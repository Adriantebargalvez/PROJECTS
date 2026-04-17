using Microsoft.Extensions.Logging;
using proyecto.Configuration;
using proyecto.Services;
using proyecto.ViewModels;
using proyecto.Views;

namespace proyecto
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });

#if DEBUG
            builder.Logging.AddDebug();
#endif

            builder.Services.AddSingleton<AppShell>();
            builder.Services.AddSingleton(new HttpClient
            {
                BaseAddress = new Uri(ApiConfiguration.BaseUrl)
            });
            builder.Services.AddSingleton<IFctDataService, HttpFctDataService>();
            builder.Services.AddSingleton<IUserDialogService, UserDialogService>();
            builder.Services.AddSingleton<INavigationService, ShellNavigationService>();

            builder.Services.AddTransient<DashboardViewModel>();
            builder.Services.AddTransient<CompaniesViewModel>();
            builder.Services.AddTransient<ConfirmedCompaniesViewModel>();
            builder.Services.AddTransient<StudentsViewModel>();
            builder.Services.AddTransient<AssignmentViewModel>();

            builder.Services.AddTransient<DashboardPage>();
            builder.Services.AddTransient<CompaniesPage>();
            builder.Services.AddTransient<ConfirmedCompaniesPage>();
            builder.Services.AddTransient<StudentsPage>();
            builder.Services.AddTransient<AssignmentPage>();

            return builder.Build();
        }
    }
}
