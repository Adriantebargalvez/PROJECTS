using MySql.Data.MySqlClient;
using proyecto.Models;
using proyecto.Services;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddSingleton<IFctDataService>(_ =>
    new DatabaseService(GetConnectionString(builder.Configuration)));

var app = builder.Build();

app.UseCors();

app.MapGet("/", () => Results.Ok(new
{
    name = "FCT Manager API",
    status = "online"
}));

var api = app.MapGroup("/api");

api.MapGet("/health", () => Results.Ok(new { status = "ok" }));

api.MapGet("/dashboard", (IFctDataService service, CancellationToken cancellationToken) =>
    SafeAsync(async () => Results.Ok(await service.GetDashboardResumenAsync(cancellationToken))));

api.MapGet("/empresas", (IFctDataService service, CancellationToken cancellationToken) =>
    SafeAsync(async () => Results.Ok(await service.GetEmpresasAsync(cancellationToken))));

api.MapGet("/empresas/confirmadas-con-plazas", (IFctDataService service, CancellationToken cancellationToken) =>
    SafeAsync(async () => Results.Ok(await service.GetEmpresasConfirmadasConPlazasAsync(cancellationToken))));

api.MapPost("/empresas", (Empresa empresa, IFctDataService service, CancellationToken cancellationToken) =>
    SafeAsync(async () => Results.Ok(await service.SaveEmpresaAsync(empresa, cancellationToken))));

api.MapDelete("/empresas/{empresaId:int}", (int empresaId, IFctDataService service, CancellationToken cancellationToken) =>
    SafeAsync(async () =>
    {
        await service.DeleteEmpresaAsync(empresaId, cancellationToken);
        return Results.NoContent();
    }));

api.MapGet("/alumnos", (IFctDataService service, CancellationToken cancellationToken) =>
    SafeAsync(async () => Results.Ok(await service.GetAlumnosAsync(cancellationToken))));

api.MapGet("/alumnos/sin-asignar", (IFctDataService service, CancellationToken cancellationToken) =>
    SafeAsync(async () => Results.Ok(await service.GetAlumnosSinAsignarAsync(cancellationToken))));

api.MapGet("/asignaciones", (IFctDataService service, CancellationToken cancellationToken) =>
    SafeAsync(async () => Results.Ok(await service.GetAsignacionesAsync(cancellationToken))));

api.MapPost("/asignaciones", (AsignarPracticasRequest request, IFctDataService service, CancellationToken cancellationToken) =>
    SafeAsync(async () =>
    {
        await service.AsignarPracticasAsync(
            request.EmpresaId,
            request.AlumnoIds,
            request.FechaInicio,
            request.FechaFin,
            cancellationToken);

        return Results.NoContent();
    }));

api.MapDelete("/asignaciones/{empresaId:int}/{alumnoId:int}", (int empresaId, int alumnoId, IFctDataService service, CancellationToken cancellationToken) =>
    SafeAsync(async () =>
    {
        await service.DesasignarPracticasAsync(empresaId, alumnoId, cancellationToken);
        return Results.NoContent();
    }));

app.Run();

static async Task<IResult> SafeAsync(Func<Task<IResult>> action)
{
    try
    {
        return await action();
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(new ApiError(ex.Message));
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
}

static string GetConnectionString(IConfiguration configuration)
{
    var rawConnectionString =
        configuration.GetConnectionString("DefaultConnection") ??
        configuration["DATABASE_CONNECTION_STRING"] ??
        configuration["MYSQL_CONNECTION_STRING"] ??
        configuration["MYSQL_URL"] ??
        configuration["DATABASE_URL"];

    if (string.IsNullOrWhiteSpace(rawConnectionString))
    {
        throw new InvalidOperationException("Configura ConnectionStrings__DefaultConnection en Render con la cadena de conexion MySQL.");
    }

    return rawConnectionString.StartsWith("mysql://", StringComparison.OrdinalIgnoreCase)
        ? ConvertMySqlUrlToConnectionString(rawConnectionString)
        : rawConnectionString;
}

static string ConvertMySqlUrlToConnectionString(string url)
{
    var uri = new Uri(url);
    var userInfo = uri.UserInfo.Split(':', 2);
    var database = uri.AbsolutePath.Trim('/');

    var builder = new MySqlConnectionStringBuilder
    {
        Server = uri.Host,
        Port = (uint)(uri.Port > 0 ? uri.Port : 3306),
        UserID = Uri.UnescapeDataString(userInfo.ElementAtOrDefault(0) ?? string.Empty),
        Password = Uri.UnescapeDataString(userInfo.ElementAtOrDefault(1) ?? string.Empty),
        Database = database,
        SslMode = MySqlSslMode.Required
    };

    return builder.ConnectionString;
}

internal sealed record AsignarPracticasRequest(
    int EmpresaId,
    IReadOnlyCollection<int> AlumnoIds,
    DateTime FechaInicio,
    DateTime FechaFin);

internal sealed record ApiError(string Error);
