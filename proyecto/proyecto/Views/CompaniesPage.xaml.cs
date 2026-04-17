using Microsoft.Extensions.DependencyInjection;
using proyecto.ViewModels;

namespace proyecto.Views
{
    public partial class CompaniesPage : ContentPage
    {
        public CompaniesPage()
            : this(App.Services.GetRequiredService<CompaniesViewModel>())
        {
        }

        public CompaniesPage(CompaniesViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = viewModel;
        }

        private CompaniesViewModel ViewModel => (CompaniesViewModel)BindingContext;

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            await ViewModel.LoadAsync();
        }
    }
}
