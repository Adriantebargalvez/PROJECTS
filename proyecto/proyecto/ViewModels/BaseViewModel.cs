namespace proyecto.ViewModels
{
    public abstract class BaseViewModel : ObservableObject
    {
        private bool isBusy;
        private string title = string.Empty;
        private string errorMessage = string.Empty;
        private string successMessage = string.Empty;

        public bool IsBusy
        {
            get => isBusy;
            set => SetProperty(ref isBusy, value);
        }

        public string Title
        {
            get => title;
            set => SetProperty(ref title, value);
        }

        public string ErrorMessage
        {
            get => errorMessage;
            set => SetProperty(ref errorMessage, value);
        }

        public string SuccessMessage
        {
            get => successMessage;
            set => SetProperty(ref successMessage, value);
        }

        public AsyncRelayCommand? BackCommand { get; private set; }

        protected void ConfigureBackNavigation(proyecto.Services.INavigationService navigationService)
        {
            BackCommand = new AsyncRelayCommand(navigationService.GoBackAsync);
            OnPropertyChanged(nameof(BackCommand));
        }

        protected void ClearMessages()
        {
            ErrorMessage = string.Empty;
            SuccessMessage = string.Empty;
        }

        protected async Task RunBusyAsync(Func<Task> work)
        {
            if (IsBusy)
            {
                return;
            }

            try
            {
                IsBusy = true;
                ClearMessages();
                await work();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}
