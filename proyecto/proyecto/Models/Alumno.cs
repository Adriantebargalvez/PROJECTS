namespace proyecto.Models
{
    public class Alumno
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Curso { get; set; } = string.Empty;
        public string Especialidad { get; set; } = string.Empty;
        public string Estado { get; set; } = AlumnoEstados.SinAsignar;
        public int? EmpresaId { get; set; }
        public string EmpresaNombre { get; set; } = string.Empty;
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }

        public bool EstaAsignado => EmpresaId.HasValue;
        public string EmpresaAsignada => EstaAsignado ? EmpresaNombre : "Sin empresa asignada";
        public string PeriodoPracticas => FechaInicio.HasValue && FechaFin.HasValue
            ? $"{FechaInicio:dd/MM/yyyy} - {FechaFin:dd/MM/yyyy}"
            : "Periodo pendiente";
    }

    public static class AlumnoEstados
    {
        public const string SinAsignar = "Sin asignar";
        public const string Asignado = "Asignado";
        public const string EnPracticas = "En practicas";

        public static readonly IReadOnlyList<string> Todos =
        [
            SinAsignar,
            Asignado,
            EnPracticas
        ];
    }
}
