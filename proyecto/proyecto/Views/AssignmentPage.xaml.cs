using Microsoft.Extensions.DependencyInjection;
using proyecto.ViewModels;

namespace proyecto.Views
{
    public partial class AssignmentPage : ContentPage, IQueryAttributable
    {
        public AssignmentPage()
            : this(App.Services.GetRequiredService<AssignmentViewModel>())
        {
        }

        public AssignmentPage(AssignmentViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = viewModel;
        }

        private AssignmentViewModel ViewModel => (AssignmentViewModel)BindingContext;

        public void ApplyQueryAttributes(IDictionary<string, object> query)
        {
            if (query.TryGetValue("empresaId", out var value) && int.TryParse(value?.ToString(), out var empresaId))
            {
                ViewModel.ApplyEmpresaId(empresaId);
            }
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            await ViewModel.LoadAsync();
        }
    }
}
