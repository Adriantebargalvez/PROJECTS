param(
    [string]$Configuration = "Release",
    [string]$Framework = "net8.0-windows10.0.19041.0",
    [string]$RuntimeIdentifierOverride = "win10-x64"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$project = Join-Path $root "proyecto\proyecto.csproj"
$dist = Join-Path $root "dist"
$publishDir = Join-Path $dist "FCT-Manager-Windows"
$zipPath = Join-Path $dist "FCT-Manager-Windows.zip"
$downloadsDir = Join-Path $root "downloads"
$downloadZipPath = Join-Path $downloadsDir "FCT-Manager-Windows.zip"
$apiUrlFile = Join-Path $publishDir "api-url.txt"

if (Test-Path $publishDir) {
    Remove-Item -LiteralPath $publishDir -Recurse -Force
}

if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

New-Item -ItemType Directory -Force $dist | Out-Null
New-Item -ItemType Directory -Force $downloadsDir | Out-Null

dotnet publish $project `
    --no-restore `
    -f $Framework `
    -c $Configuration `
    -p:RuntimeIdentifierOverride=$RuntimeIdentifierOverride `
    -p:WindowsPackageType=None `
    -p:WindowsAppSDKSelfContained=true `
    -p:PublishReadyToRun=false `
    -p:PublishSingleFile=false `
    -o $publishDir

if ($LASTEXITCODE -ne 0) {
    throw "dotnet publish fallo con codigo $LASTEXITCODE"
}

@"
https://fct-manager-api.onrender.com/
"@.Trim() | Set-Content -LiteralPath $apiUrlFile -Encoding UTF8

Compress-Archive -Path (Join-Path $publishDir "*") -DestinationPath $zipPath -Force
Copy-Item -LiteralPath $zipPath -Destination $downloadZipPath -Force

Write-Host "Paquete generado:"
Write-Host $zipPath
Write-Host "Copia para la web:"
Write-Host $downloadZipPath
