using proyecto.Models;

namespace proyecto.ViewModels
{
    public class AlumnoSelectionItem : ObservableObject
    {
        private bool isSelected;

        public AlumnoSelectionItem(Alumno alumno)
        {
            Alumno = alumno;
        }

        public Alumno Alumno { get; }
        public int Id => Alumno.Id;
        public string Nombre => Alumno.Nombre;
        public string Curso => Alumno.Curso;
        public string Especialidad => Alumno.Especialidad;

        public bool IsSelected
        {
            get => isSelected;
            set => SetProperty(ref isSelected, value);
        }
    }
}
