namespace proyecto.Models
{
    public class PracticaAsignacion
    {
        public int Id { get; set; }
        public int EmpresaId { get; set; }
        public string EmpresaNombre { get; set; } = string.Empty;
        public int AlumnoId { get; set; }
        public string AlumnoNombre { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }

        public string Periodo => $"{FechaInicio:dd/MM/yyyy} - {FechaFin:dd/MM/yyyy}";
    }
}
