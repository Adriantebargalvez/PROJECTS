using System.Collections.ObjectModel;
using proyecto.Models;
using proyecto.Services;

namespace proyecto.ViewModels
{
    public class StudentsViewModel : BaseViewModel, ILoadableViewModel
    {
        private readonly IFctDataService dataService;
        private readonly List<Alumno> alumnos = [];
        private string searchText = string.Empty;
        private string estadoFiltro = "Todos";
        private string cursoFiltro = "Todos";
        private string especialidadFiltro = "Todos";

        public StudentsViewModel(IFctDataService dataService, INavigationService navigationService)
        {
            this.dataService = dataService;
            ConfigureBackNavigation(navigationService);
            Title = "Alumnos";
            EstadoFiltros = ["Todos", .. AlumnoEstados.Todos];
            CursoFiltros = [];
            EspecialidadFiltros = [];
            LoadCommand = new AsyncRelayCommand(LoadAsync);
            ResetFiltersCommand = new RelayCommand(ResetFilters);
        }

        public ObservableCollection<Alumno> AlumnosFiltrados { get; } = [];
        public IReadOnlyList<string> EstadoFiltros { get; }
        public ObservableCollection<string> CursoFiltros { get; }
        public ObservableCollection<string> EspecialidadFiltros { get; }

        public string SearchText
        {
            get => searchText;
            set
            {
                if (SetProperty(ref searchText, value))
                {
                    ApplyFilters();
                }
            }
        }

        public string EstadoFiltro
        {
            get => estadoFiltro;
            set
            {
                if (SetProperty(ref estadoFiltro, NormalizeOption(value)))
                {
                    ApplyFilters();
                }
            }
        }

        public string CursoFiltro
        {
            get => cursoFiltro;
            set
            {
                if (SetProperty(ref cursoFiltro, NormalizeOption(value)))
                {
                    ApplyFilters();
                }
            }
        }

        public string EspecialidadFiltro
        {
            get => especialidadFiltro;
            set
            {
                if (SetProperty(ref especialidadFiltro, NormalizeOption(value)))
                {
                    ApplyFilters();
                }
            }
        }

        public string TotalAlumnos => alumnos.Count.ToString();
        public string TotalSinAsignar => alumnos.Count(alumno => alumno.Estado == AlumnoEstados.SinAsignar).ToString();
        public string TotalAsignados => alumnos.Count(alumno => alumno.Estado == AlumnoEstados.Asignado).ToString();
        public string TotalEnPracticas => alumnos.Count(alumno => alumno.Estado == AlumnoEstados.EnPracticas).ToString();
        public string ResultadosResumen => $"{AlumnosFiltrados.Count} de {alumnos.Count} alumnos";

        public AsyncRelayCommand LoadCommand { get; }
        public RelayCommand ResetFiltersCommand { get; }

        public void SetEstadoFiltro(string? estado)
        {
            var requested = string.IsNullOrWhiteSpace(estado)
                ? "Todos"
                : Uri.UnescapeDataString(estado);

            EstadoFiltro = EstadoFiltros.Contains(requested) ? requested : "Todos";
        }

        public Task LoadAsync()
        {
            return RunBusyAsync(async () =>
            {
                alumnos.Clear();
                alumnos.AddRange(await dataService.GetAlumnosAsync());
                RefreshDynamicFilters();
                ApplyFilters();
                NotifyCounters();
            });
        }

        private void ApplyFilters()
        {
            var query = alumnos.AsEnumerable();
            if (EstadoFiltro != "Todos")
            {
                query = query.Where(alumno => alumno.Estado == EstadoFiltro);
            }

            if (CursoFiltro != "Todos")
            {
                query = query.Where(alumno => alumno.Curso == CursoFiltro);
            }

            if (EspecialidadFiltro != "Todos")
            {
                query = query.Where(alumno => alumno.Especialidad == EspecialidadFiltro);
            }

            var search = Normalize(SearchText);
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(alumno =>
                    Normalize(alumno.Nombre).Contains(search) ||
                    Normalize(alumno.Curso).Contains(search) ||
                    Normalize(alumno.Especialidad).Contains(search) ||
                    Normalize(alumno.EmpresaNombre).Contains(search));
            }

            AlumnosFiltrados.Clear();
            foreach (var alumno in query.OrderBy(alumno => alumno.Curso).ThenBy(alumno => alumno.Nombre))
            {
                AlumnosFiltrados.Add(alumno);
            }

            OnPropertyChanged(nameof(ResultadosResumen));
        }

        private void RefreshDynamicFilters()
        {
            ReplaceOptions(CursoFiltros, alumnos.Select(alumno => alumno.Curso));
            ReplaceOptions(EspecialidadFiltros, alumnos.Select(alumno => alumno.Especialidad));

            if (!CursoFiltros.Contains(CursoFiltro))
            {
                CursoFiltro = "Todos";
            }

            if (!EspecialidadFiltros.Contains(EspecialidadFiltro))
            {
                EspecialidadFiltro = "Todos";
            }
        }

        private void ResetFilters()
        {
            SearchText = string.Empty;
            EstadoFiltro = "Todos";
            CursoFiltro = "Todos";
            EspecialidadFiltro = "Todos";
            ApplyFilters();
        }

        private void NotifyCounters()
        {
            OnPropertyChanged(nameof(TotalAlumnos));
            OnPropertyChanged(nameof(TotalSinAsignar));
            OnPropertyChanged(nameof(TotalAsignados));
            OnPropertyChanged(nameof(TotalEnPracticas));
            OnPropertyChanged(nameof(ResultadosResumen));
        }

        private static void ReplaceOptions(ObservableCollection<string> target, IEnumerable<string> values)
        {
            target.Clear();
            target.Add("Todos");

            foreach (var value in values
                         .Where(value => !string.IsNullOrWhiteSpace(value))
                         .Distinct(StringComparer.OrdinalIgnoreCase)
                         .OrderBy(value => value))
            {
                target.Add(value);
            }
        }

        private static string NormalizeOption(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? "Todos" : value;
        }

        private static string Normalize(string? value)
        {
            return (value ?? string.Empty).Trim().ToLowerInvariant();
        }
    }
}
