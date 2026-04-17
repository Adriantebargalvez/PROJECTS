namespace proyecto.Services
{
    public class UserDialogService : IUserDialogService
    {
        public Task<bool> ConfirmAsync(string title, string message, string accept = "Aceptar", string cancel = "Cancelar")
        {
            return Shell.Current.DisplayAlert(title, message, accept, cancel);
        }

        public Task AlertAsync(string title, string message, string accept = "Aceptar")
        {
            return Shell.Current.DisplayAlert(title, message, accept);
        }
    }
}
