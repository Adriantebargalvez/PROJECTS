using System.Globalization;
using proyecto.Models;

namespace proyecto.Converters
{
    public class StatusToColorConverter : IValueConverter
    {
        public object Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        {
            return value?.ToString() switch
            {
                EmpresaEstados.Confirmada => Color.FromArgb("#0F766E"),
                EmpresaEstados.Rechazada => Color.FromArgb("#B42318"),
                AlumnoEstados.Asignado => Color.FromArgb("#2563EB"),
                AlumnoEstados.EnPracticas => Color.FromArgb("#0F766E"),
                AlumnoEstados.SinAsignar => Color.FromArgb("#B54708"),
                _ => Color.FromArgb("#7C3AED")
            };
        }

        public object ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        {
            throw new NotSupportedException();
        }
    }
}
