$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$postgresBin = Join-Path $repoRoot ".local-postgres\pgsql\bin"
$psqlExe = Join-Path $postgresBin "psql.exe"
$schemaFile = Join-Path $repoRoot "backend\schema.sql"
$demoSeedFile = Join-Path $repoRoot "backend\demo_seed.sql"

if (-not (Test-Path $psqlExe)) {
  throw "psql.exe was not found at $psqlExe"
}

& $psqlExe "postgresql://postgres:postgres@localhost:5432/financial_tracker" -f $schemaFile
if ($LASTEXITCODE -ne 0) {
  throw "schema.sql failed."
}

& $psqlExe "postgresql://postgres:postgres@localhost:5432/financial_tracker" -f $demoSeedFile
if ($LASTEXITCODE -ne 0) {
  throw "demo_seed.sql failed."
}

Write-Host "Schema and demo data loaded into financial_tracker."
