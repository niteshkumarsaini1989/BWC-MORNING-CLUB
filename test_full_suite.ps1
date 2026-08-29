# Bharat Wellness Club - Automated Test Suite Runner
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "BHARAT WELLNESS CLUB - AUTOMATED TEST SUITE RUNNER" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Locate Edge or Chrome
$browserPath = ""
if (Test-Path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe") {
    $browserPath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
} elseif (Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe") {
    $browserPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
} else {
    Write-Error "Neither Edge nor Chrome was found."
}

Write-Host ("Using browser: " + $browserPath) -ForegroundColor Green

$port = 9888
$userDataDir = Join-Path $env:TEMP ("bwc_test_profile_" + [guid]::NewGuid().ToString("N"))
$htmlPath = "file:///d:/BWC%20CLUB/BWC-MORNING-CLUB/index.html"

# 2. Launch browser in headless mode with CDP
$proc = Start-Process -FilePath $browserPath -ArgumentList @(
    "--headless=new",
    "--remote-debugging-port=$port",
    "--remote-allow-origins=*",
    "--disable-gpu",
    "--user-data-dir=$userDataDir",
    $htmlPath
) -PassThru

Write-Host ("Browser process started (PID: " + $proc.Id + "). Connecting to DevTools Protocol...") -ForegroundColor Yellow
Start-Sleep -Seconds 2

# 3. Discover WebSocket Debugger URL
$wsUrl = ""
for ($i = 0; $i -lt 15; $i++) {
    try {
        $json = Invoke-RestMethod -Uri ("http://127.0.0.1:" + $port + "/json/list") -ErrorAction Stop
        if ($json.Count -gt 0 -and $json[0].webSocketDebuggerUrl) {
            $wsUrl = $json[0].webSocketDebuggerUrl
            break
        }
    } catch {
        Start-Sleep -Milliseconds 400
    }
}

if (-not $wsUrl) {
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $userDataDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Error "Failed to connect to CDP endpoint on port 9888."
}

Write-Host "Connected to WebSocket CDP successfully." -ForegroundColor Green

# 4. Initialize WebSocket Client
$ws = New-Object System.Net.WebSockets.ClientWebSocket
$cts = New-Object System.Threading.CancellationTokenSource
$uri = New-Object System.Uri($wsUrl)
$ws.ConnectAsync($uri, $cts.Token).Wait()

$script:msgId = 1
$script:consoleErrors = @()

function Send-CDPMessage {
    param([string]$method, [hashtable]$params = @{})
    $id = $script:msgId++
    $payload = @{
        id = $id
        method = $method
        params = $params
    } | ConvertTo-Json -Depth 10 -Compress

    $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
    $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
    $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()

    # Receive response loop
    $buffer = New-Object byte[] 65536
    while ($true) {
        $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$buffer)
        $result = $ws.ReceiveAsync($segment, $cts.Token).Result
        $responseJson = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)
        $obj = $responseJson | ConvertFrom-Json
        
        if ($obj.method -eq "Runtime.consoleAPICalled" -and $obj.params.type -eq "error") {
            $errText = ($obj.params.args | ForEach-Object { $_.value }) -join " "
            $script:consoleErrors += $errText
        }
        if ($obj.method -eq "Runtime.exceptionThrown") {
            $errText = $obj.params.exceptionDetails.exception.description
            $script:consoleErrors += $errText
        }

        if ($obj.id -eq $id) {
            return $obj
        }
    }
}

# Enable Runtime and Console
Send-CDPMessage -method "Runtime.enable" | Out-Null
Send-CDPMessage -method "Console.enable" | Out-Null
Start-Sleep -Milliseconds 600

$testJsCode = Get-Content -Path "d:\BWC CLUB\BWC-MORNING-CLUB\test_runner.js" -Raw

try {
    $res = Send-CDPMessage -method "Runtime.evaluate" -params @{
        expression = $testJsCode
        returnByValue = $true
        awaitPromise = $true
    }

    if ($res.result.exceptionDetails) {
        Write-Host ("FATAL JS EXCEPTION: " + $res.result.exceptionDetails.exception.description) -ForegroundColor Red
        exit 1
    }

    $suiteResult = $res.result.result.value

    Write-Host ""
    Write-Host "Test Results Breakdown:" -ForegroundColor Cyan
    Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray

    $index = 1
    foreach ($r in $suiteResult.results) {
        if ($r.passed) {
            Write-Host ("[" + $index + "] PASS: " + $r.name) -ForegroundColor Green
        } else {
            Write-Host ("[" + $index + "] FAIL: " + $r.name + " - " + $r.error) -ForegroundColor Red
        }
        $index++
    }

    Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray
    $summaryColor = if ($suiteResult.allPassed) { "Green" } else { "Red" }
    Write-Host ("SUMMARY: " + $suiteResult.passedCount + " / " + $suiteResult.totalCount + " TESTS PASSED") -ForegroundColor $summaryColor

    if ($script:consoleErrors.Count -gt 0) {
        Write-Host ("Console Errors Detected: " + $script:consoleErrors.Count) -ForegroundColor Red
        foreach ($e in $script:consoleErrors) {
            Write-Host ("   - " + $e) -ForegroundColor DarkRed
        }
    } else {
        Write-Host "CONSOLE STATUS: 100% ERROR-FREE (ZERO UNCAUGHT EXCEPTIONS)" -ForegroundColor Green
    }
    Write-Host "==========================================================" -ForegroundColor Cyan

    if ($suiteResult.allPassed -and $script:consoleErrors.Count -eq 0) {
        exit 0
    } else {
        exit 1
    }

} finally {
    $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Done", $cts.Token).Wait()
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $userDataDir -Recurse -Force -ErrorAction SilentlyContinue
}
