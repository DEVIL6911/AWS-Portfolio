Set-Location $PSScriptRoot
Write-Host "Starting site at http://localhost:8081" -ForegroundColor Magenta
Start-Process "http://localhost:8081"
python -m http.server 8081
