# Run only after extracting the ZIP at D:\Saba\maturity-app.
# Refuses to delete if constants contains additional user-authored files.
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$constantsDir = Join-Path $projectRoot 'front\constants'
if (-not (Test-Path $constantsDir)) {
    Write-Host 'No constants folder found; nothing to remove.'
    exit 0
}
$entries = @(Get-ChildItem -LiteralPath $constantsDir -Force)
$unexpected = @($entries | Where-Object { $_.Name -ne 'navigation.ts' -or $_.PSIsContainer })
if ($unexpected.Count -gt 0) {
    throw 'front/constants has unexpected content. Review it manually before removal.'
}
$sidebarFile = Join-Path $projectRoot 'front\components\app\Sidebar.vue'
if (-not (Test-Path $sidebarFile)) { throw 'Sidebar.vue not found; apply patch first.' }
$sidebarText = Get-Content -LiteralPath $sidebarFile -Raw
if ($sidebarText -match '~/constants') { throw 'Sidebar.vue still imports constants; apply patch first.' }
Remove-Item -LiteralPath $constantsDir -Recurse -Force
Write-Host 'Removed front/constants; sidebar navigation is now component-local.'
