$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$postgresBin = Join-Path $repoRoot ".local-postgres\pgsql\bin"
$dataDir = Join-Path $repoRoot ".local-postgres\data"
$postgresExe = Join-Path $postgresBin "postgres.exe"
$readyExe = Join-Path $postgresBin "pg_isready.exe"
$pidFile = Join-Path $dataDir "postmaster.pid"

if (-not (Test-Path $postgresExe)) {
  throw "postgres.exe was not found at $postgresExe"
}

if (Test-Path $readyExe) {
  & $readyExe -h localhost -p 5432 -U postgres -d financial_tracker *> $null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "PostgreSQL is already accepting connections on localhost:5432."
    exit 0
  }
}

if (Test-Path $pidFile) {
  $pidLines = Get-Content $pidFile
  if ($pidLines.Count -gt 0) {
    $oldPid = [int]$pidLines[0]
    $oldProcess = Get-Process -Id $oldPid -ErrorAction SilentlyContinue

    if (-not $oldProcess) {
      Remove-Item -LiteralPath $pidFile -Force
    }
  }
}

Start-Process -FilePath $postgresExe -ArgumentList "-D", $dataDir, "-p", "5432" -WorkingDirectory $postgresBin -WindowStyle Hidden

if (Test-Path $readyExe) {
  $attempts = 0
  do {
    Start-Sleep -Seconds 2
    & $readyExe -h localhost -p 5432 -U postgres -d financial_tracker *> $null
    if ($LASTEXITCODE -eq 0) {
      break
    }

    $attempts++
  } while ($attempts -lt 20)

  if ($LASTEXITCODE -ne 0) {
    & $readyExe -h localhost -p 5432 -U postgres -d financial_tracker
    throw "PostgreSQL did not become ready on localhost:5432."
  }
}

Write-Host "Local PostgreSQL started."
