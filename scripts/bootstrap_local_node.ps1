$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$toolsDir = Join-Path $root ".tools"

if (-not (Test-Path $toolsDir)) {
  New-Item -ItemType Directory -Path $toolsDir | Out-Null
}

$dist = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json"
$lts = $dist | Where-Object { $_.lts } | Select-Object -First 1

if (-not $lts) {
  throw "Could not resolve Node.js LTS release from nodejs.org."
}

$version = $lts.version
$zipName = "node-$version-win-x64.zip"
$zipPath = Join-Path $toolsDir $zipName
$nodeDir = Join-Path $toolsDir "node-$version-win-x64"
$url = "https://nodejs.org/dist/$version/$zipName"

if (-not (Test-Path $nodeDir)) {
  Write-Host "Downloading $url"
  Invoke-WebRequest -Uri $url -OutFile $zipPath
  Expand-Archive -LiteralPath $zipPath -DestinationPath $toolsDir -Force
}

$node = Join-Path $nodeDir "node.exe"
$npm = Join-Path $nodeDir "npm.cmd"

& $node --version
& $npm --version

Write-Host "Node runtime is ready at $nodeDir"
Write-Host 'For this PowerShell session, run:'
Write-Host "`$env:Path = `"$nodeDir;`$env:Path`""

