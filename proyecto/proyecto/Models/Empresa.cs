using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace proyecto.Models
{
    public class Empresa : INotifyPropertyChanged
    {
        private int id;
        private string nombre = string.Empty;
        private string contacto = string.Empty;
        private string email = string.Empty;
        private string telefono = string.Empty;
        private string direccion = string.Empty;
        private string poblacion = string.Empty;
        private int plazasDisponibles;
        private int plazasOcupadas;
        private string observaciones = string.Empty;
        private string estado = EmpresaEstados.Contactada;
        private bool isEditing;

        public event PropertyChangedEventHandler? PropertyChanged;

        public int Id
        {
            get => id;
            set => SetProperty(ref id, value);
        }

        public string Nombre
        {
            get => nombre;
            set => SetProperty(ref nombre, value);
        }

        public string Contacto
        {
            get => contacto;
            set
            {
                if (SetProperty(ref contacto, value))
                {
                    OnPropertyChanged(nameof(ContactoResumen));
                }
            }
        }

        public string Email
        {
            get => email;
            set
            {
                if (SetProperty(ref email, value))
                {
                    OnPropertyChanged(nameof(EmailResumen));
                }
            }
        }

        public string Telefono
        {
            get => telefono;
            set
            {
                if (SetProperty(ref telefono, value))
                {
                    OnPropertyChanged(nameof(TelefonoResumen));
                }
            }
        }

        public string Direccion
        {
            get => direccion;
            set
            {
                if (SetProperty(ref direccion, value))
                {
                    OnPropertyChanged(nameof(Ubicacion));
                }
            }
        }

        public string Poblacion
        {
            get => poblacion;
            set
            {
                if (SetProperty(ref poblacion, value))
                {
                    OnPropertyChanged(nameof(Ubicacion));
                }
            }
        }

        public int PlazasDisponibles
        {
            get => plazasDisponibles;
            set
            {
                if (SetProperty(ref plazasDisponibles, value))
                {
                    NotifyCalculatedProperties();
                }
            }
        }

        public int PlazasOcupadas
        {
            get => plazasOcupadas;
            set
            {
                if (SetProperty(ref plazasOcupadas, value))
                {
                    NotifyCalculatedProperties();
                }
            }
        }

        public string Observaciones
        {
            get => observaciones;
            set
            {
                if (SetProperty(ref observaciones, value))
                {
                    OnPropertyChanged(nameof(ObservacionesResumen));
                }
            }
        }

        public string Estado
        {
            get => estado;
            set
            {
                if (SetProperty(ref estado, value))
                {
                    NotifyCalculatedProperties();
                }
            }
        }

        public List<Alumno> AlumnosAsignados { get; set; } = [];

        public bool IsEditing
        {
            get => isEditing;
            set => SetProperty(ref isEditing, value);
        }

        public int PlazasRestantes => Math.Max(0, PlazasDisponibles - PlazasOcupadas);
        public bool TienePlazasDisponibles => PlazasRestantes > 0;
        public bool TieneAlumnosAsignados => AlumnosAsignados.Count > 0;
        public string ContactoResumen => string.IsNullOrWhiteSpace(Contacto) ? "Sin contacto" : Contacto;
        public string EmailResumen => string.IsNullOrWhiteSpace(Email) ? "Sin email" : Email;
        public string TelefonoResumen => string.IsNullOrWhiteSpace(Telefono) ? "Sin telefono" : Telefono;
        public string ObservacionesResumen => string.IsNullOrWhiteSpace(Observaciones) ? "Sin observaciones" : Observaciones;
        public string PlazasKpi => PlazasDisponibles <= 0 ? "Sin plazas" : $"{PlazasRestantes} libres";
        public string AlumnosKpi => $"{AlumnosAsignados.Count} asignados";
        public string PlazasResumen => $"{PlazasRestantes}/{PlazasDisponibles} plazas libres";
        public string OcupacionResumen => $"{PlazasOcupadas}/{PlazasDisponibles} plazas ocupadas";
        public double OcupacionRatio => PlazasDisponibles <= 0 ? 0 : Math.Min(1, (double)PlazasOcupadas / PlazasDisponibles);
        public string AlumnosAsignadosResumen => TieneAlumnosAsignados
            ? $"{AlumnosAsignados.Count} alumno(s) asignado(s)"
            : "Sin alumnos asignados";
        public string EstadoOperativo => Estado == EmpresaEstados.Confirmada
            ? TienePlazasDisponibles ? "Lista para asignar" : "Completa"
            : Estado == EmpresaEstados.Contactada ? "Pendiente de confirmar" : "No disponible";
        public string Ubicacion => string.IsNullOrWhiteSpace(Poblacion) ? Direccion : $"{Direccion}, {Poblacion}";

        public void CopyEditableValuesFrom(Empresa source)
        {
            Nombre = source.Nombre;
            Contacto = source.Contacto;
            Email = source.Email;
            Telefono = source.Telefono;
            Direccion = source.Direccion;
            Poblacion = source.Poblacion;
            PlazasDisponibles = source.PlazasDisponibles;
            Observaciones = source.Observaciones;
            Estado = source.Estado;
            NotifyCalculatedProperties();
        }

        private bool SetProperty<T>(ref T backingStore, T value, [CallerMemberName] string propertyName = "")
        {
            if (EqualityComparer<T>.Default.Equals(backingStore, value))
            {
                return false;
            }

            backingStore = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
            return true;
        }

        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        private void NotifyCalculatedProperties()
        {
            OnPropertyChanged(nameof(PlazasRestantes));
            OnPropertyChanged(nameof(TienePlazasDisponibles));
            OnPropertyChanged(nameof(PlazasKpi));
            OnPropertyChanged(nameof(PlazasResumen));
            OnPropertyChanged(nameof(OcupacionResumen));
            OnPropertyChanged(nameof(OcupacionRatio));
            OnPropertyChanged(nameof(EstadoOperativo));
        }
    }

    public static class EmpresaEstados
    {
        public const string Contactada = "Contactada";
        public const string Confirmada = "Confirmada";
        public const string Rechazada = "Rechazada";

        public static readonly IReadOnlyList<string> Todos =
        [
            Contactada,
            Confirmada,
            Rechazada
        ];
    }
}
