param(
  [string]$ApiBaseUrl = "http://127.0.0.1:3001",
  [string]$WebBaseUrl = "http://127.0.0.1:5173",
  [string]$AdminPassword = ""
)

$ErrorActionPreference = "Stop"

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

function Assert-True {
  param(
    [bool]$Condition,
    [string]$Message
  )

  if (-not $Condition) {
    throw $Message
  }
}

function Invoke-Json {
  param(
    [string]$Path,
    [string]$Method = "GET",
    [object]$Body = $null,
    [hashtable]$Headers = @{}
  )

  $parameters = @{
    Headers = $Headers
    Method = $Method
    Uri = "$ApiBaseUrl$Path"
    UseBasicParsing = $true
    WebSession = $session
  }

  if ($null -ne $Body) {
    $parameters.ContentType = "application/json"
    $parameters.Body = ($Body | ConvertTo-Json -Depth 20)
  }

  $response = Invoke-WebRequest @parameters
  return $response.Content | ConvertFrom-Json
}

Write-Host "Release smoke starting."

$health = Invoke-Json -Path "/api/health"
Assert-True ($health.status -eq "ok") "API health did not return ok."

$auth = Invoke-Json -Path "/api/auth/status"
if ($auth.authRequired -and -not $auth.authenticated) {
  Assert-True ($AdminPassword.Length -gt 0) "AdminPassword is required for auth-protected smoke tests."
  $auth = Invoke-Json -Path "/api/auth/login" -Method "POST" -Body @{ password = $AdminPassword }
  Assert-True ($auth.authenticated -eq $true) "Login did not return authenticated=true."
}

$people = Invoke-Json -Path "/api/people"
Assert-True ($null -ne $people.people) "People response did not include people array."

$reminders = Invoke-Json -Path "/api/reminders/window?pastDays=5&futureDays=5"
Assert-True ($null -ne $reminders.past -and $null -ne $reminders.future) "Reminder window is invalid."

$preview = Invoke-Json -Path "/api/import/people/preview" -Method "POST" -Body @{
  csv = "fullName,fatherName`nSmoke Test Person,Smoke Test Father`n"
}
Assert-True ($preview.validCount -eq 1) "CSV import preview did not validate one row."

$peopleCsv = Invoke-WebRequest -Uri "$ApiBaseUrl/api/export/people.csv" -UseBasicParsing -WebSession $session
Assert-True ($peopleCsv.Content -match "fullName") "People CSV export is missing headers."

$relationshipsCsv = Invoke-WebRequest -Uri "$ApiBaseUrl/api/export/relationships.csv" -UseBasicParsing -WebSession $session
Assert-True ($relationshipsCsv.Content -match "relationshipType") "Relationships CSV export is missing headers."

$backup = Invoke-Json -Path "/api/export/backup"
Assert-True ($backup.version -eq 1) "Backup export did not return version 1."

try {
  Invoke-Json -Path "/api/restore/backup" -Method "POST" -Body $backup | Out-Null
  throw "Restore without confirmation unexpectedly succeeded."
} catch {
  $statusCode = $_.Exception.Response.StatusCode.value__
  Assert-True ($statusCode -eq 400) "Restore without confirmation did not return 400."
}

$web = Invoke-WebRequest -Uri $WebBaseUrl -UseBasicParsing
Assert-True ($web.StatusCode -eq 200) "Web app did not return HTTP 200."

Write-Host "Release smoke passed."
