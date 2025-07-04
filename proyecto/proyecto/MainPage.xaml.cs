using System;
using exempleTemes.Resources.Themes;
using exempleTemes.Resources;
using Microsoft.Maui.Controls;
using proyecto.Business;
using proyecto.Models;
using System.Collections.ObjectModel;


namespace proyecto
{
    public partial class MainPage : ContentPage
    {
        private EmpresaService empresaService;
        public ObservableCollection<Empresa> Empresas { get; set; }

        private int? selectedEmpresaId = null;

        public MainPage()
        {
            InitializeComponent();
            empresaService = new EmpresaService();
            Empresas = new ObservableCollection<Empresa>();

            CargarEmpresas();
            BindingContext = this;
        }

        private void CargarEmpresas()
        {
            var empresasList = empresaService.GetEmpresas();
            Empresas.Clear();
            foreach (var empresa in empresasList)
            {
                Empresas.Add(empresa);
            }
        }

        private async void OnAddDataClicked(object sender, EventArgs e)
        {
            FormLayout.IsVisible = true;
        }

        private void OnCloseFormClicked(object sender, EventArgs e)
        {
            ClearForm();
            FormLayout.IsVisible = false;
        }

        private void OnSaveDataClicked(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(EmpresaEntry.Text) || string.IsNullOrEmpty(EmailEntry.Text))
            {
                DisplayAlert("Error", "Los campos Empresa y Email son obligatorios.", "OK");
                return;
            }

            // Create a new company object or update the existing one
            Empresa empresa = new Empresa
            {
                Nombre = EmpresaEntry.Text,
                Direccion = DireccionEntry.Text,
                Poblacion = PoblacionEntry.Text,
                Observaciones = ObservacionesEditor.Text
            };

            if (selectedEmpresaId.HasValue)
            {
                // Update the existing company in the database
                empresa.Id = selectedEmpresaId.Value;
                empresaService.UpdateEmpresa(empresa);  // Call update method
            }
            else
            {
                // Insert new company
                empresaService.AddEmpresa(empresa);
            }

            // Refresh the list and close the form
            CargarEmpresas();
            ClearForm();
            FormLayout.IsVisible = false;

            // Reset the selected company ID after save
            selectedEmpresaId = null;
        }


        private void ClearForm()
        {
            EmpresaEntry.Text = string.Empty;
            DireccionEntry.Text = string.Empty;
            PoblacionEntry.Text = string.Empty;
            PersonaContactoEntry.Text = string.Empty;
            TelefonoEntry.Text = string.Empty;
            EmailEntry.Text = string.Empty;
            ObservacionesEditor.Text = string.Empty;
        }
        //button claro
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
        private async void OnDeleteClicked(object sender, EventArgs e)
        {
            var button = sender as ImageButton;
            var empresa = button?.BindingContext as Empresa;

            if (empresa != null)
            {
                Console.WriteLine($"Eliminando empresa con ID: {empresa.Id}");

                bool answer = await DisplayAlert("Confirmar", "¿Seguro que deseas eliminar esta empresa?", "Sí", "No");
                if (answer)
                {
                    empresaService.RemoveEmpresa(empresa.Id);
                    CargarEmpresas(); // Recargar la lista después de eliminar
                }
            }
        }
        private async void OnEditClicked(object sender, EventArgs e)
        {
            var button = sender as ImageButton;
            var empresa = button?.BindingContext as Empresa;

            if (empresa != null)
            {
                // Populate the form with the data of the selected company
                EmpresaEntry.Text = empresa.Nombre;
                DireccionEntry.Text = empresa.Direccion;
                PoblacionEntry.Text = empresa.Poblacion;
                ObservacionesEditor.Text = empresa.Observaciones;

                // Optionally store the ID to track the entity you're editing
                // For example, you can use a hidden entry or a separate property for the ID
                // This is important when saving the changes
                selectedEmpresaId = empresa.Id;

                // Show the form for editing
                FormLayout.IsVisible = true;
            }
        }

        private async void homeButton(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new inicio());

        }
    }

}

