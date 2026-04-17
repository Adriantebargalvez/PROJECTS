using Microsoft.Extensions.DependencyInjection;
using proyecto.ViewModels;

namespace proyecto.Views
{
    public partial class DashboardPage : ContentPage
    {
        public DashboardPage()
            : this(App.Services.GetRequiredService<DashboardViewModel>())
        {
        }

        public DashboardPage(DashboardViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = viewModel;
        }

        private DashboardViewModel ViewModel => (DashboardViewModel)BindingContext;

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            await ViewModel.LoadAsync();
        }
    }
}
