using Microsoft.Extensions.DependencyInjection;
using proyecto.ViewModels;

namespace proyecto.Views
{
    public partial class ConfirmedCompaniesPage : ContentPage
    {
        public ConfirmedCompaniesPage()
            : this(App.Services.GetRequiredService<ConfirmedCompaniesViewModel>())
        {
        }

        public ConfirmedCompaniesPage(ConfirmedCompaniesViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = viewModel;
        }

        private ConfirmedCompaniesViewModel ViewModel => (ConfirmedCompaniesViewModel)BindingContext;

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            await ViewModel.LoadAsync();
        }
    }
}
