namespace proyecto.Services
{
    public interface IUserDialogService
    {
        Task<bool> ConfirmAsync(string title, string message, string accept = "Aceptar", string cancel = "Cancelar");
        Task AlertAsync(string title, string message, string accept = "Aceptar");
    }
}
