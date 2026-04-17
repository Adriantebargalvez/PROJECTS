using System.Collections.ObjectModel;
using proyecto.Models;
using proyecto.Services;

namespace proyecto.ViewModels
{
    public class CompaniesViewModel : BaseViewModel, ILoadableViewModel
    {
        private readonly IFctDataService dataService;
        private readonly IUserDialogService dialogService;
        private readonly INavigationService navigationService;
        private readonly List<Empresa> empresas = [];
        private readonly Dictionary<int, Empresa> originalEmpresas = [];
        private string searchText = string.Empty;
        private string estadoFiltro = "Todos";
        private string capacidadFiltro = "Todas";
        private string plazasMinimas = string.Empty;
        private string plazasLibresMinimas = string.Empty;
        private Empresa draftEmpresa = NewDraft();
        private bool isFormVisible;

        public CompaniesViewModel(
            IFctDataService dataService,
            IUserDialogService dialogService,
            INavigationService navigationService)
        {
            this.dataService = dataService;
            this.dialogService = dialogService;
            this.navigationService = navigationService;

            ConfigureBackNavigation(navigationService);
            Title = "Empresas";
            EstadoFiltros = ["Todos", .. EmpresaEstados.Todos];
            EstadoOptions = [.. EmpresaEstados.Todos];
            CapacidadFiltros =
            [
                "Todas",
                "Con plazas libres",
                "Completas",
                "Sin alumnos",
                "Con alumnos asignados"
            ];

            LoadCommand = new AsyncRelayCommand(LoadAsync);
            NewCompanyCommand = new RelayCommand(StartCreate);
            EditCompanyCommand = new RelayCommand(parameter => StartEdit(parameter as Empresa));
            DeleteCompanyCommand = new AsyncRelayCommand(DeleteAsync);
            AssignStudentsCommand = new AsyncRelayCommand(AssignStudentsAsync, CanAssignStudents);
            UnassignStudentCommand = new AsyncRelayCommand(UnassignStudentAsync);
            SaveInlineCompanyCommand = new AsyncRelayCommand(SaveInlineAsync);
            CancelInlineEditCommand = new RelayCommand(parameter => CancelInlineEdit(parameter as Empresa));
            SaveCompanyCommand = new AsyncRelayCommand(SaveAsync);
            CancelEditCommand = new RelayCommand(CancelEdit);
            ResetFiltersCommand = new RelayCommand(ResetFilters);
        }

        public ObservableCollection<Empresa> EmpresasFiltradas { get; } = [];
        public IReadOnlyList<string> EstadoFiltros { get; }
        public IReadOnlyList<string> EstadoOptions { get; }
        public IReadOnlyList<string> CapacidadFiltros { get; }

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
                if (SetProperty(ref estadoFiltro, value))
                {
                    ApplyFilters();
                }
            }
        }

        public string CapacidadFiltro
        {
            get => capacidadFiltro;
            set
            {
                if (SetProperty(ref capacidadFiltro, string.IsNullOrWhiteSpace(value) ? "Todas" : value))
                {
                    ApplyFilters();
                }
            }
        }

        public string PlazasMinimas
        {
            get => plazasMinimas;
            set
            {
                if (SetProperty(ref plazasMinimas, value))
                {
                    ApplyFilters();
                }
            }
        }

        public string PlazasLibresMinimas
        {
            get => plazasLibresMinimas;
            set
            {
                if (SetProperty(ref plazasLibresMinimas, value))
                {
                    ApplyFilters();
                }
            }
        }

        public Empresa DraftEmpresa
        {
            get => draftEmpresa;
            set => SetProperty(ref draftEmpresa, value);
        }

        public bool IsFormVisible
        {
            get => isFormVisible;
            set => SetProperty(ref isFormVisible, value);
        }

        public string FormTitle => "Nueva empresa";
        public string PrimaryActionText => "Crear empresa";
        public string ResultadosResumen => $"{EmpresasFiltradas.Count} de {empresas.Count} empresas";

        public AsyncRelayCommand LoadCommand { get; }
        public RelayCommand NewCompanyCommand { get; }
        public RelayCommand EditCompanyCommand { get; }
        public AsyncRelayCommand DeleteCompanyCommand { get; }
        public AsyncRelayCommand AssignStudentsCommand { get; }
        public AsyncRelayCommand UnassignStudentCommand { get; }
        public AsyncRelayCommand SaveInlineCompanyCommand { get; }
        public RelayCommand CancelInlineEditCommand { get; }
        public AsyncRelayCommand SaveCompanyCommand { get; }
        public RelayCommand CancelEditCommand { get; }
        public RelayCommand ResetFiltersCommand { get; }

        public Task LoadAsync()
        {
            return RunBusyAsync(async () =>
            {
                originalEmpresas.Clear();
                empresas.Clear();
                empresas.AddRange(await dataService.GetEmpresasAsync());
                ApplyFilters();
            });
        }

        private void StartCreate()
        {
            ClearMessages();
            CloseInlineEdits();
            DraftEmpresa = NewDraft();
            IsFormVisible = true;
        }

        private void StartEdit(Empresa? empresa)
        {
            if (empresa is null)
            {
                return;
            }

            ClearMessages();
            IsFormVisible = false;
            CloseInlineEdits(empresa.Id);

            originalEmpresas[empresa.Id] = CloneEmpresa(empresa);
            empresa.IsEditing = true;
        }

        private async Task DeleteAsync(object? parameter)
        {
            if (parameter is not Empresa empresa)
            {
                return;
            }

            var confirmed = await dialogService.ConfirmAsync(
                "Eliminar empresa",
                $"Se eliminara {empresa.Nombre} y sus asignaciones asociadas. Quieres continuar?",
                "Eliminar",
                "Cancelar");

            if (!confirmed)
            {
                return;
            }

            await RunBusyAsync(async () =>
            {
                await dataService.DeleteEmpresaAsync(empresa.Id);
                originalEmpresas.Remove(empresa.Id);
                empresas.RemoveAll(item => item.Id == empresa.Id);
                ApplyFilters();
                SuccessMessage = "Empresa eliminada correctamente.";
            });
        }

        private Task AssignStudentsAsync(object? parameter)
        {
            return parameter is Empresa empresa
                ? navigationService.GoToAsync($"//asignacion?empresaId={empresa.Id}")
                : Task.CompletedTask;
        }

        private static bool CanAssignStudents(object? parameter)
        {
            return parameter is Empresa empresa &&
                   empresa.Estado == EmpresaEstados.Confirmada &&
                   empresa.TienePlazasDisponibles;
        }

        private async Task UnassignStudentAsync(object? parameter)
        {
            if (parameter is not Alumno alumno || !alumno.EmpresaId.HasValue)
            {
                return;
            }

            var confirmed = await dialogService.ConfirmAsync(
                "Quitar alumno",
                $"Se quitara a {alumno.Nombre} de {alumno.EmpresaNombre} y volvera a estar sin asignar. Quieres continuar?",
                "Quitar",
                "Cancelar");

            if (!confirmed)
            {
                return;
            }

            await RunBusyAsync(async () =>
            {
                await dataService.DesasignarPracticasAsync(alumno.EmpresaId.Value, alumno.Id);
                originalEmpresas.Clear();
                empresas.Clear();
                empresas.AddRange(await dataService.GetEmpresasAsync());
                ApplyFilters();
                SuccessMessage = $"{alumno.Nombre} vuelve a estar sin asignar.";
            });
        }

        private Task SaveInlineAsync(object? parameter)
        {
            if (parameter is not Empresa empresa)
            {
                return Task.CompletedTask;
            }

            return RunBusyAsync(async () =>
            {
                ValidateEmpresa(empresa);
                await dataService.SaveEmpresaAsync(empresa);
                originalEmpresas.Remove(empresa.Id);
                empresa.IsEditing = false;
                empresas.Clear();
                empresas.AddRange(await dataService.GetEmpresasAsync());
                ApplyFilters();
                SuccessMessage = "Empresa actualizada correctamente.";
            });
        }

        private void CancelInlineEdit(Empresa? empresa)
        {
            if (empresa is null)
            {
                return;
            }

            if (originalEmpresas.TryGetValue(empresa.Id, out var original))
            {
                empresa.CopyEditableValuesFrom(original);
                originalEmpresas.Remove(empresa.Id);
            }

            empresa.IsEditing = false;
            ClearMessages();
        }

        private Task SaveAsync()
        {
            return RunBusyAsync(async () =>
            {
                ValidateEmpresa(DraftEmpresa);
                await dataService.SaveEmpresaAsync(DraftEmpresa);
                originalEmpresas.Clear();
                empresas.Clear();
                empresas.AddRange(await dataService.GetEmpresasAsync());
                ApplyFilters();
                IsFormVisible = false;
                DraftEmpresa = NewDraft();
                SuccessMessage = "Empresa guardada correctamente.";
            });
        }

        private void CancelEdit()
        {
            IsFormVisible = false;
            DraftEmpresa = NewDraft();
            ClearMessages();
        }

        private void ApplyFilters()
        {
            var query = empresas.AsEnumerable();
            if (EstadoFiltro != "Todos")
            {
                query = query.Where(empresa => empresa.Estado == EstadoFiltro);
            }

            query = CapacidadFiltro switch
            {
                "Con plazas libres" => query.Where(empresa => empresa.TienePlazasDisponibles),
                "Completas" => query.Where(empresa => empresa.PlazasDisponibles > 0 && empresa.PlazasRestantes == 0),
                "Sin alumnos" => query.Where(empresa => !empresa.TieneAlumnosAsignados),
                "Con alumnos asignados" => query.Where(empresa => empresa.TieneAlumnosAsignados),
                _ => query
            };

            if (TryParsePositive(PlazasMinimas, out var plazasMinimasValue))
            {
                query = query.Where(empresa => empresa.PlazasDisponibles >= plazasMinimasValue);
            }

            if (TryParsePositive(PlazasLibresMinimas, out var plazasLibresMinimasValue))
            {
                query = query.Where(empresa => empresa.PlazasRestantes >= plazasLibresMinimasValue);
            }

            var search = Normalize(SearchText);
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(empresa =>
                    Normalize(empresa.Nombre).Contains(search) ||
                    Normalize(empresa.Contacto).Contains(search) ||
                    Normalize(empresa.Email).Contains(search) ||
                    Normalize(empresa.Poblacion).Contains(search) ||
                    Normalize(empresa.Direccion).Contains(search) ||
                    Normalize(empresa.Observaciones).Contains(search));
            }

            EmpresasFiltradas.Clear();
            foreach (var empresa in query.OrderBy(empresa => empresa.Nombre))
            {
                EmpresasFiltradas.Add(empresa);
            }

            OnPropertyChanged(nameof(ResultadosResumen));
        }

        private void ResetFilters()
        {
            SearchText = string.Empty;
            EstadoFiltro = "Todos";
            CapacidadFiltro = "Todas";
            PlazasMinimas = string.Empty;
            PlazasLibresMinimas = string.Empty;
            ApplyFilters();
        }

        private static void ValidateEmpresa(Empresa empresa)
        {
            if (string.IsNullOrWhiteSpace(empresa.Nombre))
            {
                throw new InvalidOperationException("El nombre de la empresa es obligatorio.");
            }

            if (!string.IsNullOrWhiteSpace(empresa.Email) && !empresa.Email.Contains('@'))
            {
                throw new InvalidOperationException("Introduce un email valido o deja el campo vacio.");
            }

            if (empresa.PlazasDisponibles < 0)
            {
                throw new InvalidOperationException("Las plazas disponibles no pueden ser negativas.");
            }

            if (empresa.PlazasDisponibles < empresa.PlazasOcupadas)
            {
                throw new InvalidOperationException("No puedes dejar menos plazas que alumnos asignados.");
            }
        }

        private void CloseInlineEdits(int? exceptId = null)
        {
            foreach (var empresa in empresas.Where(item => item.IsEditing && item.Id != exceptId))
            {
                if (originalEmpresas.TryGetValue(empresa.Id, out var original))
                {
                    empresa.CopyEditableValuesFrom(original);
                    originalEmpresas.Remove(empresa.Id);
                }

                empresa.IsEditing = false;
            }
        }

        private static Empresa CloneEmpresa(Empresa empresa)
        {
            return new Empresa
            {
                Id = empresa.Id,
                Nombre = empresa.Nombre,
                Contacto = empresa.Contacto,
                Email = empresa.Email,
                Telefono = empresa.Telefono,
                Direccion = empresa.Direccion,
                Poblacion = empresa.Poblacion,
                PlazasDisponibles = empresa.PlazasDisponibles,
                PlazasOcupadas = empresa.PlazasOcupadas,
                Observaciones = empresa.Observaciones,
                Estado = empresa.Estado
            };
        }

        private static Empresa NewDraft()
        {
            return new Empresa
            {
                Estado = EmpresaEstados.Contactada,
                PlazasDisponibles = 1
            };
        }

        private static string Normalize(string? value)
        {
            return (value ?? string.Empty).Trim().ToLowerInvariant();
        }

        private static bool TryParsePositive(string? value, out int number)
        {
            return int.TryParse(value, out number) && number > 0;
        }
    }
}
