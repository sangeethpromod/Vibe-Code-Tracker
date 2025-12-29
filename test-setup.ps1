# Test your local setup before deploying

Write-Host "🧪 Testing Vibe Code Tracker Setup" -ForegroundColor Cyan
Write-Host ""

# Check .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local not found. Copy from .env.local.example and fill in values." -ForegroundColor Red
    exit 1
}

Write-Host "✅ .env.local found" -ForegroundColor Green

# Check required env variables
$envContent = Get-Content ".env.local" -Raw
$required = @(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GEMINI_API_KEY",
    "TELEGRAM_BOT_TOKEN",
    "CRON_SECRET"
)

$missing = @()
foreach ($var in $required) {
    if ($envContent -notmatch "$var=.+") {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host "⚠️  Missing environment variables:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
    Write-Host ""
    Write-Host "Fill these in .env.local before continuing." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ All required env variables set" -ForegroundColor Green
Write-Host ""

# Test if dev server is running
Write-Host "🚀 Starting dev server..." -ForegroundColor Cyan
Write-Host "Run 'npm run dev' in another terminal, then test endpoints:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Manual Tests:" -ForegroundColor Cyan
Write-Host "1. Visit http://localhost:3000 (should see dashboard)" -ForegroundColor White
Write-Host "2. POST test entry:" -ForegroundColor White
Write-Host '   Invoke-RestMethod -Uri "http://localhost:3000/api/entries" -Method Post -ContentType "application/json" -Body ''{"type":"win","content":"Test entry"}''' -ForegroundColor Gray
Write-Host "3. GET entries:" -ForegroundColor White
Write-Host '   Invoke-RestMethod -Uri "http://localhost:3000/api/entries" -Method Get' -ForegroundColor Gray
Write-Host "4. Test Telegram webhook:" -ForegroundColor White
Write-Host '   Send "win: Test from Telegram" to your bot' -ForegroundColor Gray
Write-Host "5. Manual weekly review (needs entries first):" -ForegroundColor White
Write-Host '   Invoke-RestMethod -Uri "http://localhost:3000/api/weekly-review" -Method Post -Headers @{"Authorization"="Bearer YOUR_CRON_SECRET"}' -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Setup looks good! Follow SETUP.md for full deployment." -ForegroundColor Green
