using proyecto.Models;

namespace proyecto.Services
{
    public interface IFctDataService
    {
        Task<DashboardResumen> GetDashboardResumenAsync(CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Empresa>> GetEmpresasAsync(CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Empresa>> GetEmpresasConfirmadasConPlazasAsync(CancellationToken cancellationToken = default);
        Task<Empresa> SaveEmpresaAsync(Empresa empresa, CancellationToken cancellationToken = default);
        Task DeleteEmpresaAsync(int empresaId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Alumno>> GetAlumnosAsync(CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Alumno>> GetAlumnosSinAsignarAsync(CancellationToken cancellationToken = default);
        Task<IReadOnlyList<PracticaAsignacion>> GetAsignacionesAsync(CancellationToken cancellationToken = default);
        Task AsignarPracticasAsync(int empresaId, IReadOnlyCollection<int> alumnoIds, DateTime fechaInicio, DateTime fechaFin, CancellationToken cancellationToken = default);
        Task DesasignarPracticasAsync(int empresaId, int alumnoId, CancellationToken cancellationToken = default);
    }
}
