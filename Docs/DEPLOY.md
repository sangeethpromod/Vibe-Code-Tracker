# Quick Deploy Guide

## Pre-Deploy Checklist

- ✅ Dependencies installed
- ✅ API routes created
- ✅ Dashboard pages built
- ⚠️ Environment variables needed
- ⚠️ Supabase schema not yet applied
- ⚠️ Telegram bot not configured

---

## Deploy Now

### 1. Supabase Setup (5 min)
```bash
# Go to supabase.com → New Project
# Copy supabase/schema.sql → SQL Editor → Run
# Get: URL, anon key, service_role key
```

### 2. Gemini API (2 min)
```bash
# Go to ai.google.dev → Get API Key
```

### 3. Telegram Bot (3 min)
```bash
# Message @BotFather → /newbot
# Get token
# Message your bot
# Visit: api.telegram.org/bot<TOKEN>/getUpdates
# Get chat ID from response
```

### 4. Configure Environment
Edit `.env.local` with all your keys (see SETUP.md for details)

### 5. Test Locally
```bash
npm run dev
# Visit http://localhost:3000
```

### 6. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vibe-code-tracker.git
git push -u origin main
```

### 7. Deploy to Vercel
```bash
# Go to vercel.com
# Import GitHub repo
# Add ALL environment variables
# Deploy
```

### 8. Configure Telegram Webhook
```bash
# After deploy, visit:
https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://your-app.vercel.app/api/telegram
```

### 9. Update Supabase Cron
```sql
-- In Supabase SQL Editor, run:
SELECT cron.schedule(
  'weekly-review-trigger',
  '0 20 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://your-app.vercel.app/api/weekly-review',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_CRON_SECRET"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

### 10. Test the Flow
```
1. Send to bot: "win: Built the entire app"
2. Check /entries page
3. POST to /api/weekly-review (with Auth header)
4. Check /reports page
```

---

## You're Live! 

Start logging brutal truths. See you Sunday at 8pm for your first automated review.
