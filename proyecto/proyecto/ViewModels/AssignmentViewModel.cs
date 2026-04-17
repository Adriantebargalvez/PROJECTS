using System.Collections.ObjectModel;
using System.ComponentModel;
using proyecto.Models;
using proyecto.Services;

namespace proyecto.ViewModels
{
    public class AssignmentViewModel : BaseViewModel, ILoadableViewModel
    {
        private readonly IFctDataService dataService;
        private int? pendingEmpresaId;
        private Empresa? selectedEmpresa;
        private DateTime fechaInicio = DateTime.Today;
        private DateTime fechaFin = DateTime.Today.AddMonths(3);

        public AssignmentViewModel(IFctDataService dataService, INavigationService navigationService)
        {
            this.dataService = dataService;
            ConfigureBackNavigation(navigationService);
            Title = "Asignación de prácticas";
            LoadCommand = new AsyncRelayCommand(LoadAsync);
            SaveAssignmentCommand = new AsyncRelayCommand(SaveAsync);
        }

        public ObservableCollection<Empresa> Empresas { get; } = [];
        public ObservableCollection<AlumnoSelectionItem> Alumnos { get; } = [];

        public Empresa? SelectedEmpresa
        {
            get => selectedEmpresa;
            set
            {
                if (SetProperty(ref selectedEmpresa, value))
                {
                    RefreshSelectionState();
                }
            }
        }

        public DateTime FechaInicio
        {
            get => fechaInicio;
            set
            {
                if (SetProperty(ref fechaInicio, value))
                {
                    OnPropertyChanged(nameof(FechaFinMinima));
                }
            }
        }

        public DateTime FechaFin
        {
            get => fechaFin;
            set => SetProperty(ref fechaFin, value);
        }

        public DateTime FechaFinMinima => FechaInicio;
        public int SelectedCount => Alumnos.Count(alumno => alumno.IsSelected);
        public int PlazasRestantes => SelectedEmpresa?.PlazasRestantes ?? 0;
        public string SelectedCountText => $"{SelectedCount} alumno(s) seleccionados";
        public string CapacidadText => SelectedEmpresa is null ? "Selecciona una empresa" : $"{PlazasRestantes} plaza(s) libres";
        public bool HasStudents => Alumnos.Count > 0;

        public AsyncRelayCommand LoadCommand { get; }
        public AsyncRelayCommand SaveAssignmentCommand { get; }

        public void ApplyEmpresaId(int empresaId)
        {
            pendingEmpresaId = empresaId > 0 ? empresaId : null;
            if (Empresas.Count > 0 && pendingEmpresaId.HasValue)
            {
                SelectedEmpresa = Empresas.FirstOrDefault(empresa => empresa.Id == pendingEmpresaId.Value);
            }
        }

        public Task LoadAsync()
        {
            return RunBusyAsync(LoadDataAsync);
        }

        private async Task SaveAsync()
        {
            await RunBusyAsync(async () =>
            {
                if (SelectedEmpresa is null)
                {
                    throw new InvalidOperationException("Selecciona una empresa confirmada.");
                }

                var selectedIds = Alumnos.Where(alumno => alumno.IsSelected).Select(alumno => alumno.Id).ToList();
                if (selectedIds.Count == 0)
                {
                    throw new InvalidOperationException("Selecciona al menos un alumno.");
                }

                if (selectedIds.Count > SelectedEmpresa.PlazasRestantes)
                {
                    throw new InvalidOperationException($"Has seleccionado {selectedIds.Count} alumno(s), pero la empresa solo tiene {SelectedEmpresa.PlazasRestantes} plaza(s) libres.");
                }

                await dataService.AsignarPracticasAsync(SelectedEmpresa.Id, selectedIds, FechaInicio, FechaFin);
                await LoadDataAsync();
                SuccessMessage = "Asignación guardada correctamente.";
            });
        }

        private async Task LoadDataAsync()
        {
            ClearSelectionSubscriptions();
            Empresas.Clear();
            Alumnos.Clear();

            foreach (var empresa in await dataService.GetEmpresasConfirmadasConPlazasAsync())
            {
                Empresas.Add(empresa);
            }

            foreach (var alumno in await dataService.GetAlumnosSinAsignarAsync())
            {
                var item = new AlumnoSelectionItem(alumno);
                item.PropertyChanged += OnAlumnoSelectionChanged;
                Alumnos.Add(item);
            }

            SelectedEmpresa = pendingEmpresaId.HasValue
                ? Empresas.FirstOrDefault(empresa => empresa.Id == pendingEmpresaId.Value)
                : SelectedEmpresa is null ? Empresas.FirstOrDefault() : Empresas.FirstOrDefault(empresa => empresa.Id == SelectedEmpresa.Id);

            RefreshSelectionState();
            OnPropertyChanged(nameof(HasStudents));
        }

        private void OnAlumnoSelectionChanged(object? sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(AlumnoSelectionItem.IsSelected))
            {
                RefreshSelectionState();
            }
        }

        private void RefreshSelectionState()
        {
            OnPropertyChanged(nameof(SelectedCount));
            OnPropertyChanged(nameof(SelectedCountText));
            OnPropertyChanged(nameof(PlazasRestantes));
            OnPropertyChanged(nameof(CapacidadText));
        }

        private void ClearSelectionSubscriptions()
        {
            foreach (var alumno in Alumnos)
            {
                alumno.PropertyChanged -= OnAlumnoSelectionChanged;
            }
        }
    }
}
