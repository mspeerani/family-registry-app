param(
  [switch]$Strict
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

Write-Host "Project audit starting in $root"

$requiredFiles = @(
  ".gitignore",
  "README.md",
  "PRD.md",
  "TECHNICAL_SPEC.md",
  "DATA_MODEL.md",
  "UI_UX_SPEC.md",
  "I18N_SPEC.md",
  "IMPLEMENTATION_PLAN.md",
  "ACCEPTANCE_CRITERIA.md",
  "PROJECT_STATUS.md",
  "QUALITY_PLAN.md",
  "CHECKPOINTS.md",
  "RISK_REGISTER.md",
  "DECISION_LOG.md",
  "EVAL_PLAN.md",
  "RELEASE_PLAN.md",
  "SECURITY_PRIVACY_GUARDRAILS.md"
)

$missing = @()
foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $root $file))) {
    $missing += $file
  }
}

if ($missing.Count -gt 0) {
  Write-Error "Missing required project files: $($missing -join ', ')"
}

$tracked = & "C:\Program Files\Git\cmd\git.exe" ls-files
$staged = & "C:\Program Files\Git\cmd\git.exe" diff --cached --name-only --diff-filter=ACMRT

$blockedPatterns = @(
  '\.env($|\.)',
  '\.sqlite$',
  '\.sqlite3$',
  '\.db$',
  '\.db3$',
  '\.csv$',
  '\.xlsx$',
  '\.xls$',
  '\.bak$',
  '\.backup$',
  '\.dump$',
  '\.sql$',
  '(^|/)data/',
  '^database/',
  '^db/',
  '(^|/)backups?/',
  '(^|/)exports?/',
  '(^|/)imports?/',
  '(^|/)uploads?/',
  '(^|/)photos?/',
  '(^|/)private/',
  '(^|/)personal/'
)

$pathsToCheck = @($tracked + $staged) | Where-Object { $_ } | Sort-Object -Unique

$blockedTracked = @()
foreach ($path in $pathsToCheck) {
  foreach ($pattern in $blockedPatterns) {
    if ($path -match $pattern) {
      if ($path -ne ".env.example") {
        $blockedTracked += $path
      }
    }
  }
}

if ($blockedTracked.Count -gt 0) {
  Write-Error "Blocked private/sensitive files are tracked: $($blockedTracked -join ', ')"
}

$gitignore = Get-Content -LiteralPath (Join-Path $root ".gitignore") -Raw
$requiredIgnoreEntries = @(
  ".env",
  "*.sqlite",
  "*.db",
  "backups/",
  "exports/",
  "imports/",
  "uploads/",
  "photos/"
)

$missingIgnoreEntries = @()
foreach ($entry in $requiredIgnoreEntries) {
  if ($gitignore -notmatch [regex]::Escape($entry)) {
    $missingIgnoreEntries += $entry
  }
}

if ($missingIgnoreEntries.Count -gt 0) {
  Write-Error "Missing required .gitignore entries: $($missingIgnoreEntries -join ', ')"
}

if ($Strict) {
  $excludedDirectoryPatterns = @(
    '\\.git\\',
    '\\.tools\\',
    '\\node_modules\\',
    '\\dist\\',
    '\\build\\',
    '\\coverage\\'
  )

  $secretPatterns = @(
    'sk-[A-Za-z0-9_-]{20,}',
    'ghp_[A-Za-z0-9_]{20,}',
    'github_pat_[A-Za-z0-9_]{20,}',
    'BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY',
    '(?i)(api[_-]?key|secret|password|token)\s*=\s*["''][^"'']{8,}["'']'
  )

  $secretHits = Get-ChildItem -Path $root -Recurse -File -Include *.md,*.ts,*.tsx,*.js,*.jsx,*.ps1,*.json,*.yml,*.yaml |
    Where-Object {
      $path = $_.FullName
      -not ($excludedDirectoryPatterns | Where-Object { $path -match $_ })
    } |
    Select-String -Pattern $secretPatterns

  if ($secretHits) {
    $formatted = $secretHits | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line.Trim())" }
    Write-Error "Strict audit found possible secrets:`n$($formatted -join [Environment]::NewLine)"
  }
}

Write-Host "Project audit passed."
