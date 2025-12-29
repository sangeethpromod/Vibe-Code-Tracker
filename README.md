# Vibe Code Tracker

A brutally honest weekly reflection system. Not a journal—a personal Board of Directors that catches avoidance patterns and issues executable strategy.

## Quick Start

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL in `supabase/schema.sql` in the SQL Editor
   - Copy your project URL and keys

3. **Configure environment**
   - Copy `.env.local.example` to `.env.local`
   - Fill in all the values:
     - Supabase URL and keys
     - Gemini API key (get from [ai.google.dev](https://ai.google.dev))
     - Telegram bot token (get from [@BotFather](https://t.me/botfather))
     - Generate a random CRON_SECRET

4. **Run locally**
   ```bash
   npm run dev
   ```

5. **Set up Telegram bot**
   - Create bot with @BotFather
   - Set webhook: `https://your-app.vercel.app/api/telegram`
   - Or use long polling for local testing

6. **Deploy to Vercel**
   ```bash
   vercel
   ```
   - Add all env variables in Vercel dashboard
   - Update the cron job URL in Supabase to your Vercel domain

## Usage

### Logging via Telegram
Send messages to your bot:
- `win: Closed the deal with client X`
- `problem: Can't focus on deep work`
- `money: +5000 from project`
- `avoidance: Scrolling instead of coding`

### Dashboard
- `/` - Home dashboard with latest summary
- `/entries` - All logged entries with filters
- `/reports` - Past weekly reviews

### Manual Review
POST to `/api/weekly-review` with Authorization header to trigger manual review.

## Stack
- Next.js 15 (App Router)
- Supabase (Postgres + Auth + Cron)
- Gemini API (summary generation)
- Telegram Bot API
- Vercel (deployment)

## Philosophy
This system exists to surface uncomfortable truths and force action. It's a tool, not a product demo.

## Deployment

Deploy to Vercel. Set up Supabase cron for weekly reviews.

## Usage

- Send messages to Telegram bot: `/win Your win`, `/problem Issue`, etc.
- View dashboard at home page
- Check entries and reports in respective sections
