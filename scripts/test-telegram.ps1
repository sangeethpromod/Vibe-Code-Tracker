# Test Telegram webhook locally
$body = @{
    message = @{
        chat = @{ id = 123456789 }
        text = "connection:felt lonely today"
    }
} | ConvertTo-Json -Depth 10

Write-Host "Testing Telegram webhook with entry: $($body.message.text)" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/telegram" -Method Post -ContentType "application/json" -Body $body
    Write-Host "✅ Webhook call successful" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "❌ Webhook call failed: $($_.Exception.Message)" -ForegroundColor Red
}