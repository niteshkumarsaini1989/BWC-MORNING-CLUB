# Bharat Wellness Club - Automated Test Suite Runner (Root Shortcut)
$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$runnerPath = Join-Path (Join-Path $scriptDir "tests") "run_chrome_tests.ps1"
& powershell -ExecutionPolicy Bypass -File $runnerPath
exit $LASTEXITCODE
