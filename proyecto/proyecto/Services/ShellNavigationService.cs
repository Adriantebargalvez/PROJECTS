namespace proyecto.Services
{
    public class ShellNavigationService : INavigationService
    {
        private readonly Stack<string> routeHistory = [];
        private string currentRoute = "//dashboard";

        public Task GoToAsync(string route)
        {
            var normalizedRoute = NormalizeRoute(route);
            if (normalizedRoute != currentRoute)
            {
                routeHistory.Push(currentRoute);
                currentRoute = normalizedRoute;
            }

            return Shell.Current.GoToAsync(route);
        }

        public Task GoBackAsync()
        {
            if (routeHistory.Count > 0)
            {
                currentRoute = routeHistory.Pop();
                return Shell.Current.GoToAsync(currentRoute);
            }

            if (Shell.Current.Navigation.NavigationStack.Count > 1)
            {
                return Shell.Current.GoToAsync("..");
            }

            currentRoute = "//dashboard";
            return Shell.Current.GoToAsync("//dashboard");
        }

        private static string NormalizeRoute(string route)
        {
            var cleanRoute = route.Trim();
            var queryStart = cleanRoute.IndexOf('?');
            if (queryStart >= 0)
            {
                cleanRoute = cleanRoute[..queryStart];
            }

            return cleanRoute.StartsWith("//", StringComparison.Ordinal)
                ? cleanRoute
                : $"//{cleanRoute.TrimStart('/')}";
        }
    }
}
