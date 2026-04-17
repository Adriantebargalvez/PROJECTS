using Microsoft.Extensions.DependencyInjection;

namespace proyecto
{
    public partial class App : Application
    {
        public static IServiceProvider Services { get; private set; } = default!;

        public App(IServiceProvider services)
        {
            Services = services;
            InitializeComponent();

            MainPage = Services.GetRequiredService<AppShell>();
        }
    }
}
