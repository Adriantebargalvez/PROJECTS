using System.Net.Http.Json;
using System.Text.Json;
using proyecto.Models;

namespace proyecto.Services
{
    public class HttpFctDataService : IFctDataService
    {
        private readonly HttpClient httpClient;

        public HttpFctDataService(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        public Task<DashboardResumen> GetDashboardResumenAsync(CancellationToken cancellationToken = default)
        {
            return GetAsync<DashboardResumen>("api/dashboard", cancellationToken);
        }

        public Task<IReadOnlyList<Empresa>> GetEmpresasAsync(CancellationToken cancellationToken = default)
        {
            return GetAsync<IReadOnlyList<Empresa>>("api/empresas", cancellationToken);
        }

        public Task<IReadOnlyList<Empresa>> GetEmpresasConfirmadasConPlazasAsync(CancellationToken cancellationToken = default)
        {
            return GetAsync<IReadOnlyList<Empresa>>("api/empresas/confirmadas-con-plazas", cancellationToken);
        }

        public Task<Empresa> SaveEmpresaAsync(Empresa empresa, CancellationToken cancellationToken = default)
        {
            return PostAsync<Empresa, Empresa>("api/empresas", empresa, cancellationToken);
        }

        public async Task DeleteEmpresaAsync(int empresaId, CancellationToken cancellationToken = default)
        {
            using var response = await httpClient.DeleteAsync($"api/empresas/{empresaId}", cancellationToken);
            await EnsureSuccessAsync(response, cancellationToken);
        }

        public Task<IReadOnlyList<Alumno>> GetAlumnosAsync(CancellationToken cancellationToken = default)
        {
            return GetAsync<IReadOnlyList<Alumno>>("api/alumnos", cancellationToken);
        }

        public Task<IReadOnlyList<Alumno>> GetAlumnosSinAsignarAsync(CancellationToken cancellationToken = default)
        {
            return GetAsync<IReadOnlyList<Alumno>>("api/alumnos/sin-asignar", cancellationToken);
        }

        public Task<IReadOnlyList<PracticaAsignacion>> GetAsignacionesAsync(CancellationToken cancellationToken = default)
        {
            return GetAsync<IReadOnlyList<PracticaAsignacion>>("api/asignaciones", cancellationToken);
        }

        public async Task AsignarPracticasAsync(
            int empresaId,
            IReadOnlyCollection<int> alumnoIds,
            DateTime fechaInicio,
            DateTime fechaFin,
            CancellationToken cancellationToken = default)
        {
            var request = new AsignarPracticasRequest(empresaId, alumnoIds, fechaInicio, fechaFin);
            using var response = await httpClient.PostAsJsonAsync("api/asignaciones", request, cancellationToken);
            await EnsureSuccessAsync(response, cancellationToken);
        }

        public async Task DesasignarPracticasAsync(int empresaId, int alumnoId, CancellationToken cancellationToken = default)
        {
            using var response = await httpClient.DeleteAsync($"api/asignaciones/{empresaId}/{alumnoId}", cancellationToken);
            await EnsureSuccessAsync(response, cancellationToken);
        }

        private async Task<T> GetAsync<T>(string url, CancellationToken cancellationToken)
        {
            using var response = await httpClient.GetAsync(url, cancellationToken);
            await EnsureSuccessAsync(response, cancellationToken);
            return await response.Content.ReadFromJsonAsync<T>(cancellationToken: cancellationToken)
                ?? throw new InvalidOperationException("La API no devolvio datos.");
        }

        private async Task<TResponse> PostAsync<TRequest, TResponse>(string url, TRequest body, CancellationToken cancellationToken)
        {
            using var response = await httpClient.PostAsJsonAsync(url, body, cancellationToken);
            await EnsureSuccessAsync(response, cancellationToken);
            return await response.Content.ReadFromJsonAsync<TResponse>(cancellationToken: cancellationToken)
                ?? throw new InvalidOperationException("La API no devolvio datos.");
        }

        private static async Task EnsureSuccessAsync(HttpResponseMessage response, CancellationToken cancellationToken)
        {
            if (response.IsSuccessStatusCode)
            {
                return;
            }

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            var message = TryReadApiError(content) ??
                          $"La API devolvio {(int)response.StatusCode} {response.ReasonPhrase} en {response.RequestMessage?.RequestUri}. Revisa que la URL base apunte a tu API de Render y que /api/health funcione.";
            throw new InvalidOperationException(message);
        }

        private static string? TryReadApiError(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
            {
                return null;
            }

            try
            {
                using var document = JsonDocument.Parse(content);
                if (document.RootElement.TryGetProperty("error", out var error))
                {
                    return error.GetString();
                }

                if (document.RootElement.TryGetProperty("detail", out var detail))
                {
                    return detail.GetString();
                }
            }
            catch (JsonException)
            {
                return content;
            }

            return content;
        }

        private sealed record AsignarPracticasRequest(
            int EmpresaId,
            IReadOnlyCollection<int> AlumnoIds,
            DateTime FechaInicio,
            DateTime FechaFin);
    }
}
