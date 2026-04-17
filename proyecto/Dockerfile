FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY FctApi/FctApi.csproj FctApi/
COPY proyecto/Models proyecto/Models
COPY proyecto/Services/DatabaseService.cs proyecto/Services/DatabaseService.cs
COPY proyecto/Services/IFctDataService.cs proyecto/Services/IFctDataService.cs
RUN dotnet restore FctApi/FctApi.csproj

COPY FctApi FctApi
RUN dotnet publish FctApi/FctApi.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FctApi.dll"]
