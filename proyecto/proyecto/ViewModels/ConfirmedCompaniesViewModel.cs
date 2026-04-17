using System.Collections.ObjectModel;
using proyecto.Models;
using proyecto.Services;

namespace proyecto.ViewModels
{
    public class ConfirmedCompaniesViewModel : BaseViewModel, ILoadableViewModel
    {
        private readonly IFctDataService dataService;
        private readonly INavigationService navigationService;
        private readonly IUserDialogService dialogService;

        public ConfirmedCompaniesViewModel(IFctDataService dataService, INavigationService navigationService, IUserDialogService dialogService)
        {
            this.dataService = dataService;
            this.navigationService = navigationService;
            this.dialogService = dialogService;
            ConfigureBackNavigation(navigationService);
            Title = "Empresas confirmadas";
            LoadCommand = new AsyncRelayCommand(LoadAsync);
            AssignCommand = new AsyncRelayCommand(AssignAsync);
            UnassignStudentCommand = new AsyncRelayCommand(UnassignStudentAsync);
        }

        public ObservableCollection<Empresa> Empresas { get; } = [];

        public AsyncRelayCommand LoadCommand { get; }
        public AsyncRelayCommand AssignCommand { get; }
        public AsyncRelayCommand UnassignStudentCommand { get; }

        public Task LoadAsync()
        {
            return RunBusyAsync(async () =>
            {
                Empresas.Clear();
                foreach (var empresa in await dataService.GetEmpresasConfirmadasConPlazasAsync())
                {
                    Empresas.Add(empresa);
                }
            });
        }

        private Task AssignAsync(object? parameter)
        {
            if (parameter is not Empresa empresa)
            {
                return Task.CompletedTask;
            }

            return navigationService.GoToAsync($"//asignacion?empresaId={empresa.Id}");
        }

        private async Task UnassignStudentAsync(object? parameter)
        {
            if (parameter is not Alumno alumno || !alumno.EmpresaId.HasValue)
            {
                return;
            }

            var confirmed = await dialogService.ConfirmAsync(
                "Quitar alumno",
                $"Se quitará a {alumno.Nombre} de {alumno.EmpresaNombre} y volverá a estar sin asignar. ¿Quieres continuar?",
                "Quitar",
                "Cancelar");

            if (!confirmed)
            {
                return;
            }

            await RunBusyAsync(async () =>
            {
                await dataService.DesasignarPracticasAsync(alumno.EmpresaId.Value, alumno.Id);
                Empresas.Clear();
                foreach (var empresa in await dataService.GetEmpresasConfirmadasConPlazasAsync())
                {
                    Empresas.Add(empresa);
                }
                SuccessMessage = $"{alumno.Nombre} vuelve a estar sin asignar.";
            });
        }
    }
}
