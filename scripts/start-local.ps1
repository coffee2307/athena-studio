# Athena Studio local launcher — Windows PowerShell 5.1+.
# Never changes git branches, files, secrets, or other running processes.
param(
 [switch]$CheckOnly,
 [switch]$SkipInstall
)
$ErrorActionPreference = "Stop"
$repo = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $repo

Write-Host "Athena Studio / Local preflight" -ForegroundColor Cyan
Write-Host "Repository: $repo"
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if (-not $nodeCmd -or -not $npmCmd) {
 throw "Can cai Node.js 24 LTS (kem npm) va mo lai PowerShell."
}
$nodeVersion = (& node --version).Trim()
$nodeMatch = [regex]::Match($nodeVersion, '^v(\d+)\.')
if (-not $nodeMatch.Success -or [int]$nodeMatch.Groups[1].Value -lt 22) {
 throw "Node.js $nodeVersion qua cu. Dung Node.js 24 LTS de phu hop GitHub CI."
}
Write-Host "Node: $nodeVersion"
$branch = (& git branch --show-current).Trim()
if ($LASTEXITCODE -ne 0) { throw "Khong doc duoc branch Git." }
Write-Host "Git branch: $branch"
if ($branch -ne "feat/athena-template-gallery-20261022") {
 Write-Warning "Dang o nhanh khac. Kiem tra git status va git switch truoc khi chay de xem ban Soft Launch moi."
}
$dirty = @(& git status --porcelain --untracked-files=no)
if ($dirty.Count -gt 0) {
 Write-Warning "Co file duoc Git theo doi dang thay doi. Script khong ghi de hay xoa cac thay doi nay."
}
$envPath = Join-Path $repo ".env.local"
if (Test-Path $envPath) {
 $origin = Get-Content $envPath | Where-Object { $_ -match '^\s*NEXT_PUBLIC_SITE_URL\s*=' } | Select-Object -Last 1
 if ($origin -and $origin -notmatch '^\s*NEXT_PUBLIC_SITE_URL\s*=\s*["'']?http://127\.0\.0\.1:3182["'']?\s*$') {
  Write-Warning "NEXT_PUBLIC_SITE_URL trong .env.local co the khong dung. Local OAuth yeu cau http://127.0.0.1:3182"
 }
 Write-Host "Local config: .env.local present (values hidden)"
} else {
 Write-Warning "Chua co .env.local. Website van co the mo voi auth fail-closed. Tao file neu can login GitHub."
}
$bound = @(Get-NetTCPConnection -LocalPort 3182 -State Listen -ErrorAction SilentlyContinue)
if ($bound.Count -gt 0) {
 $ownerId = $bound[0].OwningProcess
 $owner = Get-Process -Id $ownerId -ErrorAction SilentlyContinue
 $ownerName = if ($owner) { $owner.ProcessName } else { "unknown" }
 Write-Warning "Port 3182 da co tien trinh $ownerName (PID $ownerId). Khong tu dong dung tien trinh."
 Write-Host "Mo http://127.0.0.1:3182/ neu day la Athena; neu can restart, dung terminal dang chay bang Ctrl+C."
 if (-not $CheckOnly) { exit 2 }
}
if ($CheckOnly) {
 Write-Host "Preflight completed. No files changed." -ForegroundColor Green
 exit 0
}
if (-not (Test-Path (Join-Path $repo "node_modules"))) {
 if ($SkipInstall) { throw "Chua cai node_modules. Hay chay npm ci truoc." }
 Write-Host "Installing dependencies using lockfile (npm ci)..."
 & npm ci --no-audit --no-fund
 if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
}
Write-Host "Starting Athena at http://127.0.0.1:3182/" -ForegroundColor Green
Write-Host "Nhan Ctrl+C trong terminal nay de dung."
& npm run dev
if ($LASTEXITCODE -ne 0) { throw "Dev server exited with code $LASTEXITCODE" }
