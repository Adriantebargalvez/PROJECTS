using Microsoft.Extensions.DependencyInjection;
using proyecto.ViewModels;

namespace proyecto.Views
{
    public partial class StudentsPage : ContentPage, IQueryAttributable
    {
        public StudentsPage()
            : this(App.Services.GetRequiredService<StudentsViewModel>())
        {
        }

        public StudentsPage(StudentsViewModel viewModel)
        {
            InitializeComponent();
            BindingContext = viewModel;
        }

        private StudentsViewModel ViewModel => (StudentsViewModel)BindingContext;

        public void ApplyQueryAttributes(IDictionary<string, object> query)
        {
            if (query.TryGetValue("estado", out var estado))
            {
                ViewModel.SetEstadoFiltro(estado?.ToString());
            }
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            await ViewModel.LoadAsync();
        }
    }
}
