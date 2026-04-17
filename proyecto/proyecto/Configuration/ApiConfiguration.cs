namespace proyecto.Configuration
{
    public static class ApiConfiguration
    {
        private const string ApiUrlFileName = "api-url.txt";

#if DEBUG
        private const string DefaultBaseUrl = "http://localhost:5080/";
#else
        private const string DefaultBaseUrl = "https://fct-manager-api.onrender.com/";
#endif

        public static string BaseUrl => ResolveBaseUrl();

        private static string ResolveBaseUrl()
        {
            var environmentUrl = Environment.GetEnvironmentVariable("FCT_MANAGER_API_URL");
            if (IsValidUrl(environmentUrl))
            {
                return NormalizeUrl(environmentUrl!);
            }

            var localConfigPath = Path.Combine(AppContext.BaseDirectory, ApiUrlFileName);
            if (File.Exists(localConfigPath))
            {
                var fileUrl = File.ReadAllText(localConfigPath).Trim();
                if (IsValidUrl(fileUrl))
                {
                    return NormalizeUrl(fileUrl);
                }
            }

            return DefaultBaseUrl;
        }

        private static bool IsValidUrl(string? value)
        {
            return Uri.TryCreate(value, UriKind.Absolute, out var uri) &&
                   (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
        }

        private static string NormalizeUrl(string value)
        {
            return value.EndsWith("/", StringComparison.Ordinal) ? value : $"{value}/";
        }
    }
}
