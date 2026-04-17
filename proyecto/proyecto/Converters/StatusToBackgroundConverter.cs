using System.Globalization;
using proyecto.Models;

namespace proyecto.Converters
{
    public class StatusToBackgroundConverter : IValueConverter
    {
        public object Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        {
            return value?.ToString() switch
            {
                EmpresaEstados.Confirmada => Color.FromArgb("#D9F4EF"),
                EmpresaEstados.Rechazada => Color.FromArgb("#FFE4E0"),
                AlumnoEstados.Asignado => Color.FromArgb("#E0ECFF"),
                AlumnoEstados.EnPracticas => Color.FromArgb("#D9F4EF"),
                AlumnoEstados.SinAsignar => Color.FromArgb("#FFF2D5"),
                _ => Color.FromArgb("#EEE7FF")
            };
        }

        public object ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        {
            throw new NotSupportedException();
        }
    }
}
