# Vibe Code Tracker - Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))
- Gemini API key ([ai.google.dev](https://ai.google.dev))
- Telegram account
- Vercel account (for deployment)

---

## 1. Database Setup (Supabase)

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for setup to complete

2. **Run the schema**
   - Open SQL Editor in Supabase dashboard
   - Copy and paste the entire `supabase/schema.sql` file
   - Execute the SQL
   - Verify tables `entries` and `weekly_reports` are created

3. **Get your credentials**
   - Go to Project Settings → API
   - Copy:
     - Project URL
     - `anon` `public` key
     - `service_role` `secret` key (show first)

---

## 2. Environment Variables

1. **Copy the template**
   ```bash
   copy .env.local.example .env.local
   ```

2. **Fill in all values in `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
   GEMINI_API_KEY=AIzaSy...
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
   TELEGRAM_CHAT_ID=123456789
   CRON_SECRET=generate-random-string-here
   ```

3. **Generate CRON_SECRET**
   ```bash
   # PowerShell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

---

## 3. Gemini API Setup

1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key"
3. Create API key
4. Copy and paste into `.env.local`

---

## 4. Telegram Bot Setup

### Create the bot
1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Follow instructions (choose name and username)
4. Copy the bot token → paste into `.env.local` as `TELEGRAM_BOT_TOKEN`

### Get your Chat ID
1. Start a conversation with your bot
2. Send any message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":123456789}`
5. Copy the number → paste into `.env.local` as `TELEGRAM_CHAT_ID`

### Set webhook (after deployment)
You'll do this after deploying to Vercel:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-app.vercel.app/api/telegram
```

---

## 5. Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   - Go to `http://localhost:3000`
   - You should see the dashboard (empty at first)

4. **Test the Telegram bot**
   - Since webhook requires HTTPS, use polling for local testing
   - Or use ngrok: `ngrok http 3000`
   - Then set webhook: `https://your-ngrok-url.ngrok.io/api/telegram`

---

## 6. Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/vibe-code-tracker.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables from `.env.local`
   - Deploy

3. **Set Telegram webhook**
   - Get your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-app.vercel.app/api/telegram`
   - You should see `{"ok":true,...}`

4. **Update Supabase cron**
   - Open Supabase SQL Editor
   - Find the cron job in `schema.sql`
   - Replace `your-app.vercel.app` with your actual Vercel URL
   - Run the updated cron schedule command

---

## 7. Usage

### Logging via Telegram
Send messages in this format:
```
win: Shipped feature X to production
problem: Can't focus in the afternoon
money: +2000 from client payment
avoidance: Scrolling Twitter instead of coding
```

### Dashboard
- `/` - Home with next review date and latest summary
- `/entries` - All logged entries with type filters
- `/reports` - Past weekly reviews

### Manual review (for testing)
```bash
curl -X POST https://your-app.vercel.app/api/weekly-review \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 8. Troubleshooting

### Bot not responding
- Verify webhook is set: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Check Vercel logs for errors
- Ensure TELEGRAM_BOT_TOKEN is correct

### Database errors
- Verify Supabase URL and keys are correct
- Check RLS policies are set to public
- Look at Supabase logs

### Gemini errors
- Verify API key is valid
- Check you have API quota remaining
- Review Vercel function logs

### Cron not running
- Verify the cron job is scheduled in Supabase
- Check the URL in the cron job matches your Vercel deployment
- Verify CRON_SECRET matches in both Supabase and Vercel

---

## Next Steps

1. **Test the full flow:**
   - Send entries via Telegram
   - View them in `/entries`
   - Manually trigger `/api/weekly-review`
   - Check `/reports` for generated review

2. **Wait for Sunday 8pm** for automatic weekly review

3. **Iterate on the Gemini prompt** in `src/lib/gemini.ts` to make it more brutal or insightful

4. **Optional enhancements:**
   - Add authentication for multi-user support
   - Export data functionality
   - Custom review schedules
   - Email notifications as alternative to Telegram

---

## Architecture Notes

- **No client-side Supabase calls**: All data fetching via Server Components
- **API routes only**: Client never touches Supabase/Gemini directly
- **Minimal auth**: v1 uses env-based secret for cron endpoint
- **Stateless**: No session management, perfect for personal use
- **Vercel Edge**: Fast, global deployment with zero config

This system is designed to surface truth, not comfort. Code accordingly.
