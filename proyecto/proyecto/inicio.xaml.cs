using exempleTemes.Resources.Themes;
using exempleTemes.Resources;
using Microsoft.Maui.Controls;

namespace proyecto
{
    public partial class inicio : ContentPage
    {
        public inicio()
        {
            InitializeComponent();
        }

        private async void OnEmpresasClicked(object sender, EventArgs e)
        {
            // Navegar a la página de Empresas
            await Shell.Current.GoToAsync("//MainPage");
        }

        private async void OnEmpresasContactadasClicked(object sender, EventArgs e)
        {
            // Navegar a la página de Empresas Contactadas
            await Shell.Current.GoToAsync("//EmpresasContactadas");
        }
        private void Button_Clicked(object sender, EventArgs e)
        {
            ICollection<ResourceDictionary> mergeDictionaries = Application.Current.Resources.MergedDictionaries;
            if (mergeDictionaries != null)
            {
                mergeDictionaries.Clear();
                mergeDictionaries.Add(new Nature());
            }
        }
        //button oscuro
        private void Button_Clicked_1(object sender, EventArgs e)
        {
            ICollection<ResourceDictionary> mergeDictionaries = Application.Current.Resources.MergedDictionaries;
            if (mergeDictionaries != null)
            {
                mergeDictionaries.Clear();
                mergeDictionaries.Add(new Dark());
            }
        }
        private async void OnButtonPressed(object sender, EventArgs e)
        {
            var button = sender as Button;
            if (button != null)
            {
                // Animar el botón (aumentar el tamaño al presionar)
                await button.ScaleTo(1.1, 150);
            }
        }

        private async void OnButtonReleased(object sender, EventArgs e)
        {
            var button = sender as Button;
            if (button != null)
            {
                // Restaurar el tamaño original del botón cuando se suelta
                await button.ScaleTo(1.0, 150);
            }
        }
    }
}
