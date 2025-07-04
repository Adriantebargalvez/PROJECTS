namespace proyecto;

public partial class EmpresasContactadas : ContentPage
{
	public EmpresasContactadas()
	{
		InitializeComponent();
	}
    private async void homeButton(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new inicio());

    }
}