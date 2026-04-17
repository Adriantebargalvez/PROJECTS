using System.Collections.ObjectModel;
using proyecto.Models;
using proyecto.Services;

namespace proyecto.ViewModels
{
    public class DashboardViewModel : BaseViewModel, ILoadableViewModel
    {
        private readonly IFctDataService dataService;
        private readonly INavigationService navigationService;
        private DashboardResumen resumen = new();

        public DashboardViewModel(IFctDataService dataService, INavigationService navigationService)
        {
            this.dataService = dataService;
            this.navigationService = navigationService;
            Title = "Panel FCT";
            RefreshCommand = new AsyncRelayCommand(LoadAsync);
            GoToEmpresasCommand = new AsyncRelayCommand(() => navigationService.GoToAsync("//empresas"));
            GoToAsignacionCommand = new AsyncRelayCommand(() => navigationService.GoToAsync("//asignacion"));
            GoToAlumnosCommand = new AsyncRelayCommand(() => navigationService.GoToAsync("//alumnos"));
            GoToAlumnosSinAsignarCommand = new AsyncRelayCommand(() =>
                navigationService.GoToAsync($"//alumnos?estado={Uri.EscapeDataString(AlumnoEstados.SinAsignar)}"));
        }

        public DashboardResumen Resumen
        {
            get => resumen;
            set
            {
                if (SetProperty(ref resumen, value))
                {
                    OnPropertyChanged(nameof(EmpresasContactadas));
                    OnPropertyChanged(nameof(EmpresasConfirmadas));
                    OnPropertyChanged(nameof(AlumnosSinAsignar));
                    OnPropertyChanged(nameof(PlazasDisponibles));
                }
            }
        }

        public ObservableCollection<Empresa> EmpresasConfirmadasDisponibles { get; } = [];
        public ObservableCollection<Alumno> AlumnosPendientes { get; } = [];

        public string EmpresasContactadas => Resumen.EmpresasContactadas.ToString();
        public string EmpresasConfirmadas => Resumen.EmpresasConfirmadas.ToString();
        public string AlumnosSinAsignar => Resumen.AlumnosSinAsignar.ToString();
        public string PlazasDisponibles => Resumen.PlazasDisponibles.ToString();

        public AsyncRelayCommand RefreshCommand { get; }
        public AsyncRelayCommand GoToEmpresasCommand { get; }
        public AsyncRelayCommand GoToAsignacionCommand { get; }
        public AsyncRelayCommand GoToAlumnosCommand { get; }
        public AsyncRelayCommand GoToAlumnosSinAsignarCommand { get; }

        public Task LoadAsync()
        {
            return RunBusyAsync(async () =>
            {
                var resumenTask = dataService.GetDashboardResumenAsync();
                var empresasTask = dataService.GetEmpresasConfirmadasConPlazasAsync();
                var alumnosTask = dataService.GetAlumnosSinAsignarAsync();

                await Task.WhenAll(resumenTask, empresasTask, alumnosTask);

                Resumen = await resumenTask;
                Replace(EmpresasConfirmadasDisponibles, (await empresasTask).Take(4));
                Replace(AlumnosPendientes, (await alumnosTask).Take(5));
            });
        }

        private static void Replace<T>(ObservableCollection<T> target, IEnumerable<T> source)
        {
            target.Clear();
            foreach (var item in source)
            {
                target.Add(item);
            }
        }
    }
}
