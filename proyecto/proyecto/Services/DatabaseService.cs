using System.Data.Common;
using MySql.Data.MySqlClient;
using proyecto.Models;

namespace proyecto.Services
{
    public class DatabaseService : IFctDataService
    {
        private const string DefaultConnectionString = "server=localhost;port=3306;database=ProyectoFCT;user=root;password=root;";
        private readonly string connectionString;
        private readonly SemaphoreSlim schemaSemaphore = new(1, 1);
        private bool schemaReady;

        public DatabaseService()
            : this(DefaultConnectionString)
        {
        }

        public DatabaseService(string connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task<DashboardResumen> GetDashboardResumenAsync(CancellationToken cancellationToken = default)
        {
            await EnsureSchemaAsync(cancellationToken);

            using var connection = await OpenConnectionAsync(cancellationToken);
            using var command = CreateCommand(connection, @"
                SELECT
                    (SELECT COUNT(*) FROM Empresas WHERE Estado = @contactada) AS EmpresasContactadas,
                    (SELECT COUNT(*) FROM Empresas WHERE Estado = @confirmada) AS EmpresasConfirmadas,
                    (SELECT COUNT(*)
                       FROM Alumnos a
                       LEFT JOIN PracticasAsignaciones pa ON pa.AlumnoId = a.Id
                      WHERE pa.Id IS NULL
                        AND a.EmpresaId IS NULL
                        AND COALESCE(NULLIF(a.Estado, ''), @sinAsignar) = @sinAsignar) AS AlumnosSinAsignar,
                    (SELECT COALESCE(SUM(GREATEST(e.PlazasDisponibles - COALESCE(o.Ocupadas, 0), 0)), 0)
                       FROM Empresas e
                       LEFT JOIN (
                            SELECT EmpresaId, COUNT(*) AS Ocupadas
                              FROM (
                                   SELECT EmpresaId, AlumnoId FROM PracticasAsignaciones
                                   UNION
                                   SELECT EmpresaId, Id AS AlumnoId FROM Alumnos WHERE EmpresaId IS NOT NULL
                              ) asignados
                             GROUP BY EmpresaId
                       ) o ON o.EmpresaId = e.Id
                      WHERE e.Estado = @confirmada) AS PlazasDisponibles;");
            command.Parameters.AddWithValue("@contactada", EmpresaEstados.Contactada);
            command.Parameters.AddWithValue("@confirmada", EmpresaEstados.Confirmada);
            command.Parameters.AddWithValue("@sinAsignar", AlumnoEstados.SinAsignar);

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            if (!await reader.ReadAsync(cancellationToken))
            {
                return new DashboardResumen();
            }

            return new DashboardResumen
            {
                EmpresasContactadas = ReadInt(reader, "EmpresasContactadas"),
                EmpresasConfirmadas = ReadInt(reader, "EmpresasConfirmadas"),
                AlumnosSinAsignar = ReadInt(reader, "AlumnosSinAsignar"),
                PlazasDisponibles = ReadInt(reader, "PlazasDisponibles")
            };
        }

        public async Task<IReadOnlyList<Empresa>> GetEmpresasAsync(CancellationToken cancellationToken = default)
        {
            await EnsureSchemaAsync(cancellationToken);

            var empresas = new List<Empresa>();
            using var connection = await OpenConnectionAsync(cancellationToken);
            using var command = CreateCommand(connection, @"
                SELECT e.Id,
                       e.Nombre,
                       COALESCE(e.Contacto, '') AS Contacto,
                       COALESCE(e.Email, '') AS Email,
                       COALESCE(e.Telefono, '') AS Telefono,
                       COALESCE(e.Direccion, '') AS Direccion,
                       COALESCE(e.Ciudad, '') AS Ciudad,
                       COALESCE(e.PlazasDisponibles, 0) AS PlazasDisponibles,
                       COALESCE(e.Observaciones, '') AS Observaciones,
                       COALESCE(NULLIF(e.Estado, ''), @estadoDefecto) AS Estado,
                       COALESCE(o.Ocupadas, 0) AS PlazasOcupadas
                  FROM Empresas e
                  LEFT JOIN (
                       SELECT EmpresaId, COUNT(*) AS Ocupadas
                         FROM (
                              SELECT EmpresaId, AlumnoId FROM PracticasAsignaciones
                              UNION
                              SELECT EmpresaId, Id AS AlumnoId FROM Alumnos WHERE EmpresaId IS NOT NULL
                         ) asignados
                        GROUP BY EmpresaId
                  ) o ON o.EmpresaId = e.Id
                 ORDER BY e.Nombre;");
            command.Parameters.AddWithValue("@estadoDefecto", EmpresaEstados.Contactada);

            using (var reader = await command.ExecuteReaderAsync(cancellationToken))
            {
                while (await reader.ReadAsync(cancellationToken))
                {
                    empresas.Add(new Empresa
                    {
                        Id = ReadInt(reader, "Id"),
                        Nombre = ReadString(reader, "Nombre"),
                        Contacto = ReadString(reader, "Contacto"),
                        Email = ReadString(reader, "Email"),
                        Telefono = ReadString(reader, "Telefono"),
                        Direccion = ReadString(reader, "Direccion"),
                        Poblacion = ReadString(reader, "Ciudad"),
                        PlazasDisponibles = ReadInt(reader, "PlazasDisponibles"),
                        PlazasOcupadas = ReadInt(reader, "PlazasOcupadas"),
                        Observaciones = ReadString(reader, "Observaciones"),
                        Estado = NormalizeEmpresaEstado(ReadString(reader, "Estado"))
                    });
                }
            }

            await LoadAlumnosAsignadosAsync(connection, empresas, cancellationToken);
            return empresas;
        }

        public async Task<IReadOnlyList<Empresa>> GetEmpresasConfirmadasConPlazasAsync(CancellationToken cancellationToken = default)
        {
            var empresas = await GetEmpresasAsync(cancellationToken);
            return empresas
                .Where(empresa => empresa.Estado == EmpresaEstados.Confirmada && empresa.TienePlazasDisponibles)
                .OrderByDescending(empresa => empresa.PlazasRestantes)
                .ThenBy(empresa => empresa.Nombre)
                .ToList();
        }

        public async Task<Empresa> SaveEmpresaAsync(Empresa empresa, CancellationToken cancellationToken = default)
        {
            await EnsureSchemaAsync(cancellationToken);

            if (string.IsNullOrWhiteSpace(empresa.Nombre))
            {
                throw new InvalidOperationException("El nombre de la empresa es obligatorio.");
            }

            if (empresa.PlazasDisponibles < 0)
            {
                throw new InvalidOperationException("Las plazas disponibles no pueden ser negativas.");
            }

            empresa.Estado = NormalizeEmpresaEstado(empresa.Estado);

            using var connection = await OpenConnectionAsync(cancellationToken);
            if (empresa.Id == 0)
            {
                using var insertCommand = CreateCommand(connection, @"
                    INSERT INTO Empresas (Nombre, Contacto, Email, Telefono, Direccion, Ciudad, PlazasDisponibles, Observaciones, Estado)
                    VALUES (@nombre, @contacto, @email, @telefono, @direccion, @ciudad, @plazas, @observaciones, @estado);");
                AddEmpresaParameters(insertCommand, empresa);
                await insertCommand.ExecuteNonQueryAsync(cancellationToken);

                using var idCommand = CreateCommand(connection, "SELECT LAST_INSERT_ID();");
                var newId = await idCommand.ExecuteScalarAsync(cancellationToken);
                empresa.Id = Convert.ToInt32(newId);
                return empresa;
            }

            var ocupadas = await GetPlazasOcupadasAsync(connection, empresa.Id, null, cancellationToken);
            if (empresa.PlazasDisponibles < ocupadas)
            {
                throw new InvalidOperationException($"La empresa ya tiene {ocupadas} alumno(s) asignado(s). No puedes bajar las plazas por debajo de ese valor.");
            }

            using var updateCommand = CreateCommand(connection, @"
                UPDATE Empresas
                   SET Nombre = @nombre,
                       Contacto = @contacto,
                       Email = @email,
                       Telefono = @telefono,
                       Direccion = @direccion,
                       Ciudad = @ciudad,
                       PlazasDisponibles = @plazas,
                       Observaciones = @observaciones,
                       Estado = @estado
                 WHERE Id = @id;");
            updateCommand.Parameters.AddWithValue("@id", empresa.Id);
            AddEmpresaParameters(updateCommand, empresa);
            await updateCommand.ExecuteNonQueryAsync(cancellationToken);
            return empresa;
        }

        public async Task DeleteEmpresaAsync(int empresaId, CancellationToken cancellationToken = default)
        {
            await EnsureSchemaAsync(cancellationToken);

            using var connection = await OpenConnectionAsync(cancellationToken);
            using var transaction = connection.BeginTransaction();

            try
            {
                using (var updateAlumnos = CreateCommand(connection, @"
                    UPDATE Alumnos
                       SET EmpresaId = NULL,
                           Estado = @sinAsignar
                     WHERE EmpresaId = @empresaId;", transaction))
                {
                    updateAlumnos.Parameters.AddWithValue("@sinAsignar", AlumnoEstados.SinAsignar);
                    updateAlumnos.Parameters.AddWithValue("@empresaId", empresaId);
                    await updateAlumnos.ExecuteNonQueryAsync(cancellationToken);
                }

                using (var deleteAsignaciones = CreateCommand(connection, "DELETE FROM PracticasAsignaciones WHERE EmpresaId = @empresaId;", transaction))
                {
                    deleteAsignaciones.Parameters.AddWithValue("@empresaId", empresaId);
                    await deleteAsignaciones.ExecuteNonQueryAsync(cancellationToken);
                }

                await DeleteRowsByEmpresaIdIfTableExistsAsync(connection, transaction, "PersonasContacto", empresaId, cancellationToken);
                await DeleteRowsByEmpresaIdIfTableExistsAsync(connection, transaction, "EmpresasContactadas", empresaId, cancellationToken);
                await DeleteRowsReferencingEmpresaAsync(connection, transaction, empresaId, cancellationToken);

                using (var deleteEmpresa = CreateCommand(connection, "DELETE FROM Empresas WHERE Id = @empresaId;", transaction))
                {
                    deleteEmpresa.Parameters.AddWithValue("@empresaId", empresaId);
                    await deleteEmpresa.ExecuteNonQueryAsync(cancellationToken);
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<IReadOnlyList<Alumno>> GetAlumnosAsync(CancellationToken cancellationToken = default)
        {
            await EnsureSchemaAsync(cancellationToken);

            var alumnos = new List<Alumno>();
            using var connection = await OpenConnectionAsync(cancellationToken);
            using var command = CreateCommand(connection, @"
                SELECT a.Id,
                       a.Nombre,
                       COALESCE(a.Curso, '') AS Curso,
                       COALESCE(a.Especialidad, '') AS Especialidad,
                       COALESCE(pa.EmpresaId, a.EmpresaId) AS EmpresaId,
                       COALESCE(ep.Nombre, el.Nombre, '') AS EmpresaNombre,
                       pa.FechaInicio,
                       pa.FechaFin,
                       CASE
                           WHEN pa.Id IS NULL AND a.EmpresaId IS NULL THEN COALESCE(NULLIF(a.Estado, ''), @sinAsignar)
                           WHEN pa.Id IS NOT NULL AND CURDATE() BETWEEN pa.FechaInicio AND pa.FechaFin THEN @enPracticas
                           ELSE @asignado
                       END AS Estado
                  FROM Alumnos a
                  LEFT JOIN PracticasAsignaciones pa ON pa.AlumnoId = a.Id
                  LEFT JOIN Empresas ep ON ep.Id = pa.EmpresaId
                  LEFT JOIN Empresas el ON el.Id = a.EmpresaId
                 ORDER BY a.Nombre;");
            command.Parameters.AddWithValue("@sinAsignar", AlumnoEstados.SinAsignar);
            command.Parameters.AddWithValue("@asignado", AlumnoEstados.Asignado);
            command.Parameters.AddWithValue("@enPracticas", AlumnoEstados.EnPracticas);

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                alumnos.Add(new Alumno
                {
                    Id = ReadInt(reader, "Id"),
                    Nombre = ReadString(reader, "Nombre"),
                    Curso = ReadString(reader, "Curso"),
                    Especialidad = ReadString(reader, "Especialidad"),
                    EmpresaId = ReadNullableInt(reader, "EmpresaId"),
                    EmpresaNombre = ReadString(reader, "EmpresaNombre"),
                    FechaInicio = ReadNullableDate(reader, "FechaInicio"),
                    FechaFin = ReadNullableDate(reader, "FechaFin"),
                    Estado = NormalizeAlumnoEstado(ReadString(reader, "Estado"))
                });
            }

            return alumnos;
        }

        public async Task<IReadOnlyList<Alumno>> GetAlumnosSinAsignarAsync(CancellationToken cancellationToken = default)
        {
            var alumnos = await GetAlumnosAsync(cancellationToken);
            return alumnos
                .Where(alumno => alumno.Estado == AlumnoEstados.SinAsignar && !alumno.EmpresaId.HasValue)
                .OrderBy(alumno => alumno.Curso)
                .ThenBy(alumno => alumno.Nombre)
                .ToList();
        }

        public async Task<IReadOnlyList<PracticaAsignacion>> GetAsignacionesAsync(CancellationToken cancellationToken = default)
        {
            await EnsureSchemaAsync(cancellationToken);

            var asignaciones = new List<PracticaAsignacion>();
            using var connection = await OpenConnectionAsync(cancellationToken);
            using var command = CreateCommand(connection, @"
                SELECT pa.Id,
                       pa.EmpresaId,
                       e.Nombre AS EmpresaNombre,
                       pa.AlumnoId,
                       a.Nombre AS AlumnoNombre,
                       pa.FechaInicio,
                       pa.FechaFin
                  FROM PracticasAsignaciones pa
                  JOIN Empresas e ON e.Id = pa.EmpresaId
                  JOIN Alumnos a ON a.Id = pa.AlumnoId
                 ORDER BY pa.FechaInicio DESC, e.Nombre, a.Nombre;");

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                asignaciones.Add(new PracticaAsignacion
                {
                    Id = ReadInt(reader, "Id"),
                    EmpresaId = ReadInt(reader, "EmpresaId"),
                    EmpresaNombre = ReadString(reader, "EmpresaNombre"),
                    AlumnoId = ReadInt(reader, "AlumnoId"),
                    AlumnoNombre = ReadString(reader, "AlumnoNombre"),
                    FechaInicio = ReadNullableDate(reader, "FechaInicio") ?? DateTime.Today,
                    FechaFin = ReadNullableDate(reader, "FechaFin") ?? DateTime.Today
                });
            }

            return asignaciones;
        }

        public async Task AsignarPracticasAsync(int empresaId, IReadOnlyCollection<int> alumnoIds, DateTime fechaInicio, DateTime fechaFin, CancellationToken cancellationToken = default)
        {
            await EnsureSchemaAsync(cancellationToken);

            if (empresaId <= 0)
            {
                throw new InvalidOperationException("Selecciona una empresa confirmada.");
            }

            if (alumnoIds.Count == 0)
            {
                throw new InvalidOperationException("Selecciona al menos un alumno.");
            }

            if (fechaFin.Date < fechaInicio.Date)
            {
                throw new InvalidOperationException("La fecha de fin no puede ser anterior a la fecha de inicio.");
            }

            using var connection = await OpenConnectionAsync(cancellationToken);
            using var transaction = connection.BeginTransaction();

            try
            {
                var empresa = await GetEmpresaForUpdateAsync(connection, transaction, empresaId, cancellationToken);
                if (empresa is null)
                {
                    throw new InvalidOperationException("La empresa seleccionada no existe.");
                }

                if (empresa.Estado != EmpresaEstados.Confirmada)
                {
                    throw new InvalidOperationException("Solo se pueden asignar alumnos a empresas confirmadas.");
                }

                var ocupadas = await GetPlazasOcupadasAsync(connection, empresaId, transaction, cancellationToken);
                var plazasRestantes = empresa.PlazasDisponibles - ocupadas;
                if (alumnoIds.Count > plazasRestantes)
                {
                    throw new InvalidOperationException($"La empresa solo tiene {Math.Max(plazasRestantes, 0)} plaza(s) disponible(s).");
                }

                var estadoAsignacion = DateTime.Today >= fechaInicio.Date && DateTime.Today <= fechaFin.Date
                    ? AlumnoEstados.EnPracticas
                    : AlumnoEstados.Asignado;

                foreach (var alumnoId in alumnoIds.Distinct())
                {
                    await ValidateAlumnoDisponibleAsync(connection, transaction, alumnoId, cancellationToken);

                    using (var insertCommand = CreateCommand(connection, @"
                        INSERT INTO PracticasAsignaciones (EmpresaId, AlumnoId, FechaInicio, FechaFin)
                        VALUES (@empresaId, @alumnoId, @fechaInicio, @fechaFin);", transaction))
                    {
                        insertCommand.Parameters.AddWithValue("@empresaId", empresaId);
                        insertCommand.Parameters.AddWithValue("@alumnoId", alumnoId);
                        insertCommand.Parameters.AddWithValue("@fechaInicio", fechaInicio.Date);
                        insertCommand.Parameters.AddWithValue("@fechaFin", fechaFin.Date);
                        await insertCommand.ExecuteNonQueryAsync(cancellationToken);
                    }

                    using (var updateAlumno = CreateCommand(connection, @"
                        UPDATE Alumnos
                           SET EmpresaId = @empresaId,
                               Estado = @estado
                         WHERE Id = @alumnoId;", transaction))
                    {
                        updateAlumno.Parameters.AddWithValue("@empresaId", empresaId);
                        updateAlumno.Parameters.AddWithValue("@estado", estadoAsignacion);
                        updateAlumno.Parameters.AddWithValue("@alumnoId", alumnoId);
                        await updateAlumno.ExecuteNonQueryAsync(cancellationToken);
                    }
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task DesasignarPracticasAsync(int empresaId, int alumnoId, CancellationToken cancellationToken = default)
        {
            await EnsureSchemaAsync(cancellationToken);

            if (empresaId <= 0 || alumnoId <= 0)
            {
                throw new InvalidOperationException("Selecciona un alumno asignado a una empresa.");
            }

            using var connection = await OpenConnectionAsync(cancellationToken);
            using var transaction = connection.BeginTransaction();

            try
            {
                using (var deleteAsignacion = CreateCommand(connection, @"
                    DELETE FROM PracticasAsignaciones
                     WHERE EmpresaId = @empresaId
                       AND AlumnoId = @alumnoId;", transaction))
                {
                    deleteAsignacion.Parameters.AddWithValue("@empresaId", empresaId);
                    deleteAsignacion.Parameters.AddWithValue("@alumnoId", alumnoId);
                    await deleteAsignacion.ExecuteNonQueryAsync(cancellationToken);
                }

                using (var updateAlumno = CreateCommand(connection, @"
                    UPDATE Alumnos
                       SET EmpresaId = NULL,
                           Estado = @sinAsignar
                     WHERE Id = @alumnoId
                       AND (EmpresaId = @empresaId OR EmpresaId IS NULL);", transaction))
                {
                    updateAlumno.Parameters.AddWithValue("@sinAsignar", AlumnoEstados.SinAsignar);
                    updateAlumno.Parameters.AddWithValue("@empresaId", empresaId);
                    updateAlumno.Parameters.AddWithValue("@alumnoId", alumnoId);
                    await updateAlumno.ExecuteNonQueryAsync(cancellationToken);
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public List<Empresa> GetEmpresas()
        {
            return GetEmpresasAsync().GetAwaiter().GetResult().ToList();
        }

        public void InsertEmpresa(Empresa empresa)
        {
            SaveEmpresaAsync(empresa).GetAwaiter().GetResult();
        }

        public void DeleteEmpresa(int id)
        {
            DeleteEmpresaAsync(id).GetAwaiter().GetResult();
        }

        public void UpdateEmpresa(Empresa empresa)
        {
            SaveEmpresaAsync(empresa).GetAwaiter().GetResult();
        }

        private sealed record DemoEmpresa(
            string Nombre,
            string Contacto,
            string Email,
            string Telefono,
            string Direccion,
            string Ciudad,
            int PlazasDisponibles,
            string Observaciones,
            string Estado);

        private sealed record DemoAlumno(string Nombre, string Curso, string Especialidad);

        private sealed record DemoAsignacion(string EmpresaNombre, string AlumnoNombre, DateTime FechaInicio, DateTime FechaFin);

        private sealed record ForeignKeyColumn(string TableName, string ColumnName);

        private async Task EnsureSchemaAsync(CancellationToken cancellationToken)
        {
            if (schemaReady)
            {
                return;
            }

            await schemaSemaphore.WaitAsync(cancellationToken);
            try
            {
                if (schemaReady)
                {
                    return;
                }

                using var connection = await OpenConnectionAsync(cancellationToken);
                await ExecuteNonQueryAsync(connection, @"
                    CREATE TABLE IF NOT EXISTS Empresas (
                        Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                        Nombre VARCHAR(200) NOT NULL,
                        Direccion VARCHAR(255) NULL,
                        Ciudad VARCHAR(120) NULL,
                        Observaciones TEXT NULL
                    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", cancellationToken);

                await AddColumnIfMissingAsync(connection, "Empresas", "Contacto", "VARCHAR(160) NULL", cancellationToken);
                await AddColumnIfMissingAsync(connection, "Empresas", "Email", "VARCHAR(180) NULL", cancellationToken);
                await AddColumnIfMissingAsync(connection, "Empresas", "Telefono", "VARCHAR(60) NULL", cancellationToken);
                await AddColumnIfMissingAsync(connection, "Empresas", "PlazasDisponibles", "INT NOT NULL DEFAULT 0", cancellationToken);
                await AddColumnIfMissingAsync(connection, "Empresas", "Estado", "VARCHAR(40) NOT NULL DEFAULT 'Contactada'", cancellationToken);

                await ExecuteNonQueryAsync(connection, @"
                    CREATE TABLE IF NOT EXISTS Alumnos (
                        Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                        Nombre VARCHAR(200) NOT NULL,
                        Curso VARCHAR(120) NULL,
                        Especialidad VARCHAR(160) NULL,
                        Estado VARCHAR(40) NOT NULL DEFAULT 'Sin asignar',
                        EmpresaId INT NULL,
                        INDEX IX_Alumnos_EmpresaId (EmpresaId)
                    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", cancellationToken);

                await AddColumnIfMissingAsync(connection, "Alumnos", "Curso", "VARCHAR(120) NULL", cancellationToken);
                await AddColumnIfMissingAsync(connection, "Alumnos", "Especialidad", "VARCHAR(160) NULL", cancellationToken);
                await AddColumnIfMissingAsync(connection, "Alumnos", "Estado", "VARCHAR(40) NOT NULL DEFAULT 'Sin asignar'", cancellationToken);
                await AddColumnIfMissingAsync(connection, "Alumnos", "EmpresaId", "INT NULL", cancellationToken);

                await ExecuteNonQueryAsync(connection, @"
                    CREATE TABLE IF NOT EXISTS PracticasAsignaciones (
                        Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                        EmpresaId INT NOT NULL,
                        AlumnoId INT NOT NULL,
                        FechaInicio DATE NOT NULL,
                        FechaFin DATE NOT NULL,
                        CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE KEY UX_PracticasAsignaciones_Alumno (AlumnoId),
                        INDEX IX_PracticasAsignaciones_Empresa (EmpresaId)
                    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", cancellationToken);

                await ExecuteNonQueryAsync(connection, @"
                    CREATE TABLE IF NOT EXISTS AppSettings (
                        Clave VARCHAR(100) NOT NULL PRIMARY KEY,
                        Valor VARCHAR(255) NOT NULL,
                        UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", cancellationToken);

                await SeedDemoDataAsync(connection, cancellationToken);

                schemaReady = true;
            }
            finally
            {
                schemaSemaphore.Release();
            }
        }

        private async Task<MySqlConnection> OpenConnectionAsync(CancellationToken cancellationToken)
        {
            var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync(cancellationToken);
            return connection;
        }

        private static MySqlCommand CreateCommand(MySqlConnection connection, string commandText, MySqlTransaction? transaction = null)
        {
            var command = connection.CreateCommand();
            command.CommandText = commandText;
            if (transaction is not null)
            {
                command.Transaction = transaction;
            }

            return command;
        }

        private static async Task ExecuteNonQueryAsync(MySqlConnection connection, string commandText, CancellationToken cancellationToken)
        {
            using var command = CreateCommand(connection, commandText);
            await command.ExecuteNonQueryAsync(cancellationToken);
        }

        private static async Task ExecuteNonQueryAsync(MySqlConnection connection, string commandText, MySqlTransaction transaction, CancellationToken cancellationToken)
        {
            using var command = CreateCommand(connection, commandText, transaction);
            await command.ExecuteNonQueryAsync(cancellationToken);
        }

        private static async Task AddColumnIfMissingAsync(MySqlConnection connection, string tableName, string columnName, string definition, CancellationToken cancellationToken)
        {
            var exists = await TableHasColumnAsync(connection, null, tableName, columnName, cancellationToken);
            if (exists)
            {
                return;
            }

            using var addCommand = CreateCommand(connection, $"ALTER TABLE `{tableName}` ADD COLUMN `{columnName}` {definition};");
            await addCommand.ExecuteNonQueryAsync(cancellationToken);
        }

        private static async Task DeleteRowsIfTableExistsAsync(
            MySqlConnection connection,
            MySqlTransaction transaction,
            string tableName,
            CancellationToken cancellationToken)
        {
            var actualTableName = await FindTableNameAsync(connection, transaction, tableName, cancellationToken);
            if (actualTableName is null)
            {
                return;
            }

            using var deleteCommand = CreateCommand(connection, $"DELETE FROM `{EscapeIdentifier(actualTableName)}`;", transaction);
            await deleteCommand.ExecuteNonQueryAsync(cancellationToken);
        }

        private static async Task DeleteRowsByEmpresaIdIfTableExistsAsync(
            MySqlConnection connection,
            MySqlTransaction transaction,
            string tableName,
            int empresaId,
            CancellationToken cancellationToken)
        {
            var actualTableName = await FindTableNameAsync(connection, transaction, tableName, cancellationToken);
            if (actualTableName is null)
            {
                return;
            }

            var hasEmpresaId = await TableHasColumnAsync(connection, transaction, actualTableName, "EmpresaId", cancellationToken);
            if (!hasEmpresaId)
            {
                return;
            }

            using var deleteCommand = CreateCommand(connection, $"DELETE FROM `{EscapeIdentifier(actualTableName)}` WHERE `EmpresaId` = @empresaId;", transaction);
            deleteCommand.Parameters.AddWithValue("@empresaId", empresaId);
            await deleteCommand.ExecuteNonQueryAsync(cancellationToken);
        }

        private static async Task DeleteRowsReferencingEmpresaAsync(
            MySqlConnection connection,
            MySqlTransaction transaction,
            int empresaId,
            CancellationToken cancellationToken)
        {
            var references = await GetEmpresaForeignKeysAsync(connection, transaction, cancellationToken);
            foreach (var reference in references)
            {
                if (reference.TableName.Equals("Alumnos", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                using var deleteCommand = CreateCommand(
                    connection,
                    $"DELETE FROM `{EscapeIdentifier(reference.TableName)}` WHERE `{EscapeIdentifier(reference.ColumnName)}` = @empresaId;",
                    transaction);
                deleteCommand.Parameters.AddWithValue("@empresaId", empresaId);
                await deleteCommand.ExecuteNonQueryAsync(cancellationToken);
            }
        }

        private static async Task DeleteRowsReferencingEmpresasAsync(
            MySqlConnection connection,
            MySqlTransaction transaction,
            CancellationToken cancellationToken)
        {
            var references = await GetEmpresaForeignKeysAsync(connection, transaction, cancellationToken);
            foreach (var reference in references)
            {
                using var deleteCommand = CreateCommand(
                    connection,
                    $"DELETE FROM `{EscapeIdentifier(reference.TableName)}` WHERE `{EscapeIdentifier(reference.ColumnName)}` IN (SELECT Id FROM Empresas);",
                    transaction);
                await deleteCommand.ExecuteNonQueryAsync(cancellationToken);
            }
        }

        private static async Task<IReadOnlyList<ForeignKeyColumn>> GetEmpresaForeignKeysAsync(
            MySqlConnection connection,
            MySqlTransaction transaction,
            CancellationToken cancellationToken)
        {
            var databaseName = connection.Database;
            var references = new List<ForeignKeyColumn>();
            using var command = CreateCommand(connection, @"
                SELECT TABLE_SCHEMA,
                       TABLE_NAME,
                       COLUMN_NAME,
                       REFERENCED_TABLE_SCHEMA,
                       REFERENCED_TABLE_NAME,
                       REFERENCED_COLUMN_NAME
                  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE;", transaction);

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                if (!SameName(ReadString(reader, "TABLE_SCHEMA"), databaseName) ||
                    !SameName(ReadString(reader, "REFERENCED_TABLE_SCHEMA"), databaseName) ||
                    !SameName(ReadString(reader, "REFERENCED_TABLE_NAME"), "Empresas") ||
                    !SameName(ReadString(reader, "REFERENCED_COLUMN_NAME"), "Id"))
                {
                    continue;
                }

                references.Add(new ForeignKeyColumn(
                    ReadString(reader, "TABLE_NAME"),
                    ReadString(reader, "COLUMN_NAME")));
            }

            return references
                .Where(reference => !string.IsNullOrWhiteSpace(reference.TableName) && !string.IsNullOrWhiteSpace(reference.ColumnName))
                .Distinct()
                .ToList();
        }

        private static async Task<string?> FindTableNameAsync(
            MySqlConnection connection,
            MySqlTransaction transaction,
            string tableName,
            CancellationToken cancellationToken)
        {
            var databaseName = connection.Database;
            using var command = CreateCommand(connection, @"
                SELECT TABLE_SCHEMA,
                       TABLE_NAME
                  FROM INFORMATION_SCHEMA.TABLES;", transaction);

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                if (SameName(ReadString(reader, "TABLE_SCHEMA"), databaseName) &&
                    SameName(ReadString(reader, "TABLE_NAME"), tableName))
                {
                    return ReadString(reader, "TABLE_NAME");
                }
            }

            return null;
        }

        private static async Task<bool> TableHasColumnAsync(
            MySqlConnection connection,
            MySqlTransaction? transaction,
            string tableName,
            string columnName,
            CancellationToken cancellationToken)
        {
            var databaseName = connection.Database;
            using var command = CreateCommand(connection, @"
                SELECT TABLE_SCHEMA,
                       TABLE_NAME,
                       COLUMN_NAME
                  FROM INFORMATION_SCHEMA.COLUMNS;", transaction);

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                if (SameName(ReadString(reader, "TABLE_SCHEMA"), databaseName) &&
                    SameName(ReadString(reader, "TABLE_NAME"), tableName) &&
                    SameName(ReadString(reader, "COLUMN_NAME"), columnName))
                {
                    return true;
                }
            }

            return false;
        }

        private static string EscapeIdentifier(string identifier)
        {
            return identifier.Replace("`", "``");
        }

        private static bool SameName(string? left, string? right)
        {
            return string.Equals(left, right, StringComparison.OrdinalIgnoreCase);
        }

        private static async Task SeedDemoDataAsync(MySqlConnection connection, CancellationToken cancellationToken)
        {
            const string seedKey = "DemoDataV2Clean";

            using (var seedCheck = CreateCommand(connection, "SELECT COUNT(*) FROM AppSettings WHERE Clave = @clave;"))
            {
                seedCheck.Parameters.AddWithValue("@clave", seedKey);
                var alreadySeeded = Convert.ToInt32(await seedCheck.ExecuteScalarAsync(cancellationToken)) > 0;
                if (alreadySeeded)
                {
                    return;
                }
            }

            var empresasDemo = new[]
            {
                new DemoEmpresa("Telefonica Tech", "Laura Medina", "fct.telefonicatech@example.com", "910 482 015", "Ronda de la Comunicacion s/n", "Madrid", 4, "Perfil recomendado: DAM, DAW y ASIR. Entorno cloud, soporte y ciberseguridad.", EmpresaEstados.Confirmada),
                new DemoEmpresa("Mercadona", "Carlos Benitez", "formacion.mercadona@example.com", "963 883 333", "Calle Valencia 5", "Valencia", 3, "Interesa alumnado de administracion, atencion al cliente y soporte interno.", EmpresaEstados.Confirmada),
                new DemoEmpresa("Inditex", "Sonia Rivas", "talento.inditex@example.com", "981 185 400", "Avenida de la Diputacion s/n", "Arteixo", 2, "Proyecto de tienda online y analitica. Plazas completas para esta convocatoria.", EmpresaEstados.Confirmada),
                new DemoEmpresa("BBVA IT Espana", "Miguel Torres", "campus.bbva@example.com", "915 374 000", "Calle Azul 4", "Madrid", 2, "Buenas opciones para DAM y DAW. Incorporacion prevista en mayo.", EmpresaEstados.Confirmada),
                new DemoEmpresa("Decathlon Espana", "Raquel Perez", "practicas.decathlon@example.com", "916 247 500", "Avenida del Deporte 12", "San Sebastian de los Reyes", 2, "Soporte a tienda, inventario y herramientas internas.", EmpresaEstados.Confirmada),
                new DemoEmpresa("Iberdrola", "Elena Martin", "fct.iberdrola@example.com", "944 151 411", "Plaza Euskadi 5", "Bilbao", 3, "Pendiente de confirmar tutor de empresa y calendario definitivo.", EmpresaEstados.Contactada),
                new DemoEmpresa("Mapfre", "Jorge Serrano", "talento.mapfre@example.com", "915 815 500", "Carretera de Pozuelo 52", "Majadahonda", 2, "Primer contacto realizado. Revisaran disponibilidad en administracion y sistemas.", EmpresaEstados.Contactada),
                new DemoEmpresa("Accenture", "Marta Leon", "fct.accenture@example.com", "914 596 000", "Paseo de la Castellana 85", "Madrid", 5, "Contactada para perfiles de desarrollo. Falta validar plazas reales.", EmpresaEstados.Contactada),
                new DemoEmpresa("El Corte Ingles", "Departamento RRHH", "rrhh.elcorteingles@example.com", "901 122 122", "Calle Princesa 56", "Madrid", 0, "Rechazada por falta de tutor disponible durante el periodo FCT.", EmpresaEstados.Rechazada),
                new DemoEmpresa("Repsol", "Ana Delgado", "practicas.repsol@example.com", "917 538 100", "Calle Mendez Alvaro 44", "Madrid", 0, "No acepta alumnado esta convocatoria. Revisar de nuevo el proximo curso.", EmpresaEstados.Rechazada)
            };

            var alumnosDemo = new[]
            {
                new DemoAlumno("Irene Castro", "2 ASIR", "Administracion de sistemas"),
                new DemoAlumno("Lucia Martinez", "2 DAM", "Desarrollo multiplataforma"),
                new DemoAlumno("Paula Sanchez", "2 ASIR", "Administracion de sistemas"),
                new DemoAlumno("Marta Garcia", "2 DAW", "Desarrollo web"),
                new DemoAlumno("Sara Navarro", "2 DAM", "Desarrollo multiplataforma"),
                new DemoAlumno("Andrea Lopez", "2 DAW", "Desarrollo web"),
                new DemoAlumno("Claudia Romero", "2 SMR", "Sistemas microinformaticos"),
                new DemoAlumno("Javier Ruiz", "2 ASIR", "Administracion de sistemas"),
                new DemoAlumno("Miguel Garcia", "2 DAM", "Desarrollo multiplataforma"),
                new DemoAlumno("Daniel Ortega", "2 DAW", "Desarrollo web"),
                new DemoAlumno("Nuria Molina", "2 ASIR", "Administracion de sistemas"),
                new DemoAlumno("Alba Serrano", "2 DAM", "Desarrollo multiplataforma"),
                new DemoAlumno("Carmen Vidal", "2 DAW", "Desarrollo web"),
                new DemoAlumno("Noelia Santos", "2 SMR", "Sistemas microinformaticos"),
                new DemoAlumno("Hugo Ramos", "2 ASIR", "Administracion de sistemas"),
                new DemoAlumno("Sofia Hernandez", "2 DAM", "Desarrollo multiplataforma")
            };

            var asignacionesDemo = new[]
            {
                new DemoAsignacion("Telefonica Tech", "Irene Castro", new DateTime(2026, 3, 23), new DateTime(2026, 6, 12)),
                new DemoAsignacion("Telefonica Tech", "Miguel Garcia", new DateTime(2026, 3, 23), new DateTime(2026, 6, 12)),
                new DemoAsignacion("Telefonica Tech", "Sara Navarro", new DateTime(2026, 3, 23), new DateTime(2026, 6, 12)),
                new DemoAsignacion("Mercadona", "Paula Sanchez", new DateTime(2026, 3, 30), new DateTime(2026, 6, 19)),
                new DemoAsignacion("Mercadona", "Marta Garcia", new DateTime(2026, 3, 30), new DateTime(2026, 6, 19)),
                new DemoAsignacion("Inditex", "Lucia Martinez", new DateTime(2026, 3, 23), new DateTime(2026, 6, 12)),
                new DemoAsignacion("Inditex", "Andrea Lopez", new DateTime(2026, 3, 23), new DateTime(2026, 6, 12)),
                new DemoAsignacion("BBVA IT Espana", "Javier Ruiz", new DateTime(2026, 5, 4), new DateTime(2026, 7, 24)),
                new DemoAsignacion("Decathlon Espana", "Claudia Romero", new DateTime(2026, 5, 4), new DateTime(2026, 7, 24))
            };

            using var transaction = connection.BeginTransaction();
            try
            {
                await ExecuteNonQueryAsync(connection, "DELETE FROM PracticasAsignaciones;", transaction, cancellationToken);
                await DeleteRowsIfTableExistsAsync(connection, transaction, "PersonasContacto", cancellationToken);
                await DeleteRowsIfTableExistsAsync(connection, transaction, "EmpresasContactadas", cancellationToken);
                await DeleteRowsReferencingEmpresasAsync(connection, transaction, cancellationToken);
                await ExecuteNonQueryAsync(connection, "DELETE FROM Alumnos;", transaction, cancellationToken);
                await ExecuteNonQueryAsync(connection, "DELETE FROM Empresas;", transaction, cancellationToken);

                var empresaIds = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                foreach (var empresa in empresasDemo)
                {
                    empresaIds[empresa.Nombre] = await EnsureDemoEmpresaAsync(connection, transaction, empresa, cancellationToken);
                }

                var alumnoIds = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                foreach (var alumno in alumnosDemo)
                {
                    alumnoIds[alumno.Nombre] = await EnsureDemoAlumnoAsync(connection, transaction, alumno, cancellationToken);
                }

                foreach (var asignacion in asignacionesDemo)
                {
                    if (empresaIds.TryGetValue(asignacion.EmpresaNombre, out var empresaId) &&
                        alumnoIds.TryGetValue(asignacion.AlumnoNombre, out var alumnoId))
                    {
                        await EnsureDemoAsignacionAsync(connection, transaction, empresaId, alumnoId, asignacion.FechaInicio, asignacion.FechaFin, cancellationToken);
                    }
                }

                using (var markSeeded = CreateCommand(connection, @"
                    INSERT INTO AppSettings (Clave, Valor)
                    VALUES (@clave, @valor)
                    ON DUPLICATE KEY UPDATE Valor = VALUES(Valor);", transaction))
                {
                    markSeeded.Parameters.AddWithValue("@clave", seedKey);
                    markSeeded.Parameters.AddWithValue("@valor", "1");
                    await markSeeded.ExecuteNonQueryAsync(cancellationToken);
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        private static async Task<int> EnsureDemoEmpresaAsync(MySqlConnection connection, MySqlTransaction transaction, DemoEmpresa empresa, CancellationToken cancellationToken)
        {
            using (var findCommand = CreateCommand(connection, "SELECT Id FROM Empresas WHERE Nombre = @nombre LIMIT 1;", transaction))
            {
                findCommand.Parameters.AddWithValue("@nombre", empresa.Nombre);
                var existingId = await findCommand.ExecuteScalarAsync(cancellationToken);
                if (existingId is not null && existingId != DBNull.Value)
                {
                    return Convert.ToInt32(existingId);
                }
            }

            using (var insertCommand = CreateCommand(connection, @"
                INSERT INTO Empresas (Nombre, Contacto, Email, Telefono, Direccion, Ciudad, PlazasDisponibles, Observaciones, Estado)
                VALUES (@nombre, @contacto, @email, @telefono, @direccion, @ciudad, @plazas, @observaciones, @estado);", transaction))
            {
                insertCommand.Parameters.AddWithValue("@nombre", empresa.Nombre);
                insertCommand.Parameters.AddWithValue("@contacto", empresa.Contacto);
                insertCommand.Parameters.AddWithValue("@email", empresa.Email);
                insertCommand.Parameters.AddWithValue("@telefono", empresa.Telefono);
                insertCommand.Parameters.AddWithValue("@direccion", empresa.Direccion);
                insertCommand.Parameters.AddWithValue("@ciudad", empresa.Ciudad);
                insertCommand.Parameters.AddWithValue("@plazas", empresa.PlazasDisponibles);
                insertCommand.Parameters.AddWithValue("@observaciones", empresa.Observaciones);
                insertCommand.Parameters.AddWithValue("@estado", NormalizeEmpresaEstado(empresa.Estado));
                await insertCommand.ExecuteNonQueryAsync(cancellationToken);
            }

            using var idCommand = CreateCommand(connection, "SELECT LAST_INSERT_ID();", transaction);
            return Convert.ToInt32(await idCommand.ExecuteScalarAsync(cancellationToken));
        }

        private static async Task<int> EnsureDemoAlumnoAsync(MySqlConnection connection, MySqlTransaction transaction, DemoAlumno alumno, CancellationToken cancellationToken)
        {
            using (var findCommand = CreateCommand(connection, "SELECT Id FROM Alumnos WHERE Nombre = @nombre LIMIT 1;", transaction))
            {
                findCommand.Parameters.AddWithValue("@nombre", alumno.Nombre);
                var existingId = await findCommand.ExecuteScalarAsync(cancellationToken);
                if (existingId is not null && existingId != DBNull.Value)
                {
                    return Convert.ToInt32(existingId);
                }
            }

            using (var insertCommand = CreateCommand(connection, @"
                INSERT INTO Alumnos (Nombre, Curso, Especialidad, Estado, EmpresaId)
                VALUES (@nombre, @curso, @especialidad, @estado, NULL);", transaction))
            {
                insertCommand.Parameters.AddWithValue("@nombre", alumno.Nombre);
                insertCommand.Parameters.AddWithValue("@curso", alumno.Curso);
                insertCommand.Parameters.AddWithValue("@especialidad", alumno.Especialidad);
                insertCommand.Parameters.AddWithValue("@estado", AlumnoEstados.SinAsignar);
                await insertCommand.ExecuteNonQueryAsync(cancellationToken);
            }

            using var idCommand = CreateCommand(connection, "SELECT LAST_INSERT_ID();", transaction);
            return Convert.ToInt32(await idCommand.ExecuteScalarAsync(cancellationToken));
        }

        private static async Task EnsureDemoAsignacionAsync(
            MySqlConnection connection,
            MySqlTransaction transaction,
            int empresaId,
            int alumnoId,
            DateTime fechaInicio,
            DateTime fechaFin,
            CancellationToken cancellationToken)
        {
            using (var alumnoCheck = CreateCommand(connection, @"
                SELECT EmpresaId
                  FROM Alumnos
                 WHERE Id = @alumnoId
                 FOR UPDATE;", transaction))
            {
                alumnoCheck.Parameters.AddWithValue("@alumnoId", alumnoId);
                var currentEmpresaId = await alumnoCheck.ExecuteScalarAsync(cancellationToken);
                if (currentEmpresaId is not null && currentEmpresaId != DBNull.Value)
                {
                    return;
                }
            }

            using (var practicaCheck = CreateCommand(connection, "SELECT COUNT(*) FROM PracticasAsignaciones WHERE AlumnoId = @alumnoId;", transaction))
            {
                practicaCheck.Parameters.AddWithValue("@alumnoId", alumnoId);
                var alreadyAssigned = Convert.ToInt32(await practicaCheck.ExecuteScalarAsync(cancellationToken)) > 0;
                if (alreadyAssigned)
                {
                    return;
                }
            }

            using (var capacityCheck = CreateCommand(connection, @"
                SELECT e.PlazasDisponibles,
                       COALESCE(o.Ocupadas, 0) AS Ocupadas,
                       COALESCE(NULLIF(e.Estado, ''), @contactada) AS Estado
                  FROM Empresas e
                  LEFT JOIN (
                       SELECT EmpresaId, COUNT(*) AS Ocupadas
                         FROM (
                              SELECT EmpresaId, AlumnoId FROM PracticasAsignaciones
                              UNION
                              SELECT EmpresaId, Id AS AlumnoId FROM Alumnos WHERE EmpresaId IS NOT NULL
                         ) asignados
                        GROUP BY EmpresaId
                  ) o ON o.EmpresaId = e.Id
                 WHERE e.Id = @empresaId
                 FOR UPDATE;", transaction))
            {
                capacityCheck.Parameters.AddWithValue("@empresaId", empresaId);
                capacityCheck.Parameters.AddWithValue("@contactada", EmpresaEstados.Contactada);

                using var reader = await capacityCheck.ExecuteReaderAsync(cancellationToken);
                if (!await reader.ReadAsync(cancellationToken))
                {
                    return;
                }

                var plazas = ReadInt(reader, "PlazasDisponibles");
                var ocupadas = ReadInt(reader, "Ocupadas");
                var estado = NormalizeEmpresaEstado(ReadString(reader, "Estado"));
                if (estado != EmpresaEstados.Confirmada || ocupadas >= plazas)
                {
                    return;
                }
            }

            var estadoAlumno = DateTime.Today >= fechaInicio.Date && DateTime.Today <= fechaFin.Date
                ? AlumnoEstados.EnPracticas
                : AlumnoEstados.Asignado;

            using (var insertCommand = CreateCommand(connection, @"
                INSERT INTO PracticasAsignaciones (EmpresaId, AlumnoId, FechaInicio, FechaFin)
                VALUES (@empresaId, @alumnoId, @fechaInicio, @fechaFin);", transaction))
            {
                insertCommand.Parameters.AddWithValue("@empresaId", empresaId);
                insertCommand.Parameters.AddWithValue("@alumnoId", alumnoId);
                insertCommand.Parameters.AddWithValue("@fechaInicio", fechaInicio.Date);
                insertCommand.Parameters.AddWithValue("@fechaFin", fechaFin.Date);
                await insertCommand.ExecuteNonQueryAsync(cancellationToken);
            }

            using (var updateAlumno = CreateCommand(connection, @"
                UPDATE Alumnos
                   SET EmpresaId = @empresaId,
                       Estado = @estado
                 WHERE Id = @alumnoId;", transaction))
            {
                updateAlumno.Parameters.AddWithValue("@empresaId", empresaId);
                updateAlumno.Parameters.AddWithValue("@estado", estadoAlumno);
                updateAlumno.Parameters.AddWithValue("@alumnoId", alumnoId);
                await updateAlumno.ExecuteNonQueryAsync(cancellationToken);
            }
        }

        private static void AddEmpresaParameters(MySqlCommand command, Empresa empresa)
        {
            command.Parameters.AddWithValue("@nombre", empresa.Nombre.Trim());
            command.Parameters.AddWithValue("@contacto", NullIfEmpty(empresa.Contacto));
            command.Parameters.AddWithValue("@email", NullIfEmpty(empresa.Email));
            command.Parameters.AddWithValue("@telefono", NullIfEmpty(empresa.Telefono));
            command.Parameters.AddWithValue("@direccion", NullIfEmpty(empresa.Direccion));
            command.Parameters.AddWithValue("@ciudad", NullIfEmpty(empresa.Poblacion));
            command.Parameters.AddWithValue("@plazas", empresa.PlazasDisponibles);
            command.Parameters.AddWithValue("@observaciones", NullIfEmpty(empresa.Observaciones));
            command.Parameters.AddWithValue("@estado", NormalizeEmpresaEstado(empresa.Estado));
        }

        private static object NullIfEmpty(string value)
        {
            return string.IsNullOrWhiteSpace(value) ? DBNull.Value : value.Trim();
        }

        private static async Task<Empresa?> GetEmpresaForUpdateAsync(MySqlConnection connection, MySqlTransaction transaction, int empresaId, CancellationToken cancellationToken)
        {
            using var command = CreateCommand(connection, @"
                SELECT Id,
                       Nombre,
                       COALESCE(PlazasDisponibles, 0) AS PlazasDisponibles,
                       COALESCE(NULLIF(Estado, ''), @estadoDefecto) AS Estado
                  FROM Empresas
                 WHERE Id = @empresaId
                 FOR UPDATE;", transaction);
            command.Parameters.AddWithValue("@empresaId", empresaId);
            command.Parameters.AddWithValue("@estadoDefecto", EmpresaEstados.Contactada);

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            if (!await reader.ReadAsync(cancellationToken))
            {
                return null;
            }

            return new Empresa
            {
                Id = ReadInt(reader, "Id"),
                Nombre = ReadString(reader, "Nombre"),
                PlazasDisponibles = ReadInt(reader, "PlazasDisponibles"),
                Estado = NormalizeEmpresaEstado(ReadString(reader, "Estado"))
            };
        }

        private static async Task<int> GetPlazasOcupadasAsync(MySqlConnection connection, int empresaId, MySqlTransaction? transaction, CancellationToken cancellationToken)
        {
            using var command = CreateCommand(connection, @"
                SELECT COUNT(*)
                  FROM (
                       SELECT AlumnoId FROM PracticasAsignaciones WHERE EmpresaId = @empresaId
                       UNION
                       SELECT Id AS AlumnoId FROM Alumnos WHERE EmpresaId = @empresaId
                  ) asignados;", transaction);
            command.Parameters.AddWithValue("@empresaId", empresaId);
            return Convert.ToInt32(await command.ExecuteScalarAsync(cancellationToken));
        }

        private static async Task LoadAlumnosAsignadosAsync(MySqlConnection connection, IReadOnlyList<Empresa> empresas, CancellationToken cancellationToken)
        {
            if (empresas.Count == 0)
            {
                return;
            }

            var empresasById = empresas.ToDictionary(empresa => empresa.Id);
            var parameterNames = empresas.Select((_, index) => $"@empresa{index}").ToArray();
            using var command = CreateCommand(connection, $@"
                SELECT asignados.EmpresaId,
                       a.Id,
                       a.Nombre,
                       COALESCE(a.Curso, '') AS Curso,
                       COALESCE(a.Especialidad, '') AS Especialidad,
                       pa.FechaInicio,
                       pa.FechaFin,
                       CASE
                           WHEN pa.Id IS NOT NULL AND CURDATE() BETWEEN pa.FechaInicio AND pa.FechaFin THEN @enPracticas
                           ELSE @asignado
                       END AS Estado
                  FROM (
                       SELECT EmpresaId, AlumnoId FROM PracticasAsignaciones
                       UNION
                       SELECT EmpresaId, Id AS AlumnoId FROM Alumnos WHERE EmpresaId IS NOT NULL
                  ) asignados
                  JOIN Alumnos a ON a.Id = asignados.AlumnoId
                  LEFT JOIN PracticasAsignaciones pa ON pa.EmpresaId = asignados.EmpresaId AND pa.AlumnoId = asignados.AlumnoId
                 WHERE asignados.EmpresaId IN ({string.Join(", ", parameterNames)})
                 ORDER BY a.Nombre;");
            command.Parameters.AddWithValue("@asignado", AlumnoEstados.Asignado);
            command.Parameters.AddWithValue("@enPracticas", AlumnoEstados.EnPracticas);

            for (var index = 0; index < empresas.Count; index++)
            {
                command.Parameters.AddWithValue(parameterNames[index], empresas[index].Id);
            }

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                var empresaId = ReadInt(reader, "EmpresaId");
                if (!empresasById.TryGetValue(empresaId, out var empresa))
                {
                    continue;
                }

                empresa.AlumnosAsignados.Add(new Alumno
                {
                    Id = ReadInt(reader, "Id"),
                    Nombre = ReadString(reader, "Nombre"),
                    Curso = ReadString(reader, "Curso"),
                    Especialidad = ReadString(reader, "Especialidad"),
                    Estado = NormalizeAlumnoEstado(ReadString(reader, "Estado")),
                    EmpresaId = empresaId,
                    EmpresaNombre = empresa.Nombre,
                    FechaInicio = ReadNullableDate(reader, "FechaInicio"),
                    FechaFin = ReadNullableDate(reader, "FechaFin")
                });
            }

            foreach (var empresa in empresas)
            {
                empresa.PlazasOcupadas = Math.Max(empresa.PlazasOcupadas, empresa.AlumnosAsignados.Count);
            }
        }

        private static async Task ValidateAlumnoDisponibleAsync(MySqlConnection connection, MySqlTransaction transaction, int alumnoId, CancellationToken cancellationToken)
        {
            using var command = CreateCommand(connection, @"
                SELECT a.Id,
                       a.EmpresaId,
                       COALESCE(NULLIF(a.Estado, ''), @sinAsignar) AS Estado,
                       pa.Id AS PracticaId
                  FROM Alumnos a
                  LEFT JOIN PracticasAsignaciones pa ON pa.AlumnoId = a.Id
                 WHERE a.Id = @alumnoId
                 FOR UPDATE;", transaction);
            command.Parameters.AddWithValue("@alumnoId", alumnoId);
            command.Parameters.AddWithValue("@sinAsignar", AlumnoEstados.SinAsignar);

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            if (!await reader.ReadAsync(cancellationToken))
            {
                throw new InvalidOperationException("Uno de los alumnos seleccionados no existe.");
            }

            var empresaId = ReadNullableInt(reader, "EmpresaId");
            var practicaId = ReadNullableInt(reader, "PracticaId");
            var estado = NormalizeAlumnoEstado(ReadString(reader, "Estado"));
            if (empresaId.HasValue || practicaId.HasValue || estado != AlumnoEstados.SinAsignar)
            {
                throw new InvalidOperationException("Uno de los alumnos seleccionados ya tiene una empresa asignada.");
            }
        }

        private static string NormalizeEmpresaEstado(string? estado)
        {
            return Normalize(estado) switch
            {
                "confirmada" => EmpresaEstados.Confirmada,
                "rechazada" => EmpresaEstados.Rechazada,
                _ => EmpresaEstados.Contactada
            };
        }

        private static string NormalizeAlumnoEstado(string? estado)
        {
            return Normalize(estado) switch
            {
                "asignado" => AlumnoEstados.Asignado,
                "en practicas" => AlumnoEstados.EnPracticas,
                _ => AlumnoEstados.SinAsignar
            };
        }

        private static string Normalize(string? value)
        {
            return (value ?? string.Empty)
                .Trim()
                .ToLowerInvariant()
                .Replace("á", "a")
                .Replace("é", "e")
                .Replace("í", "i")
                .Replace("ó", "o")
                .Replace("ú", "u");
        }

        private static string ReadString(DbDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? string.Empty : Convert.ToString(reader.GetValue(ordinal)) ?? string.Empty;
        }

        private static int ReadInt(DbDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? 0 : Convert.ToInt32(reader.GetValue(ordinal));
        }

        private static int? ReadNullableInt(DbDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? null : Convert.ToInt32(reader.GetValue(ordinal));
        }

        private static DateTime? ReadNullableDate(DbDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? null : Convert.ToDateTime(reader.GetValue(ordinal));
        }
    }
}
