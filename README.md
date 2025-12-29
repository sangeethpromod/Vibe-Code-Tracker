# Weekly Reflection System

A brutally honest weekly reflection system that acts as a personal Board of Directors to catch avoidance patterns and issue executable strategy.

## Features

- Telegram bot for logging wins, problems, money matters, and avoidance behaviors
- Weekly automated summaries using Gemini AI
- Dashboard for viewing entries and reports
- Supabase for data storage and cron jobs

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase:
   - Create a new project
   - Run the SQL to create tables:
     ```sql
     CREATE TABLE entries (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       created_at timestamptz DEFAULT now(),
       type text NOT NULL,
       content text NOT NULL
     );

     CREATE TABLE weekly_reports (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       week_start date NOT NULL,
       summary text,
       patterns text,
       strategy text,
       drop_list text,
       created_at timestamptz DEFAULT now()
     );
     ```
   - Enable RLS if needed (for v1, public)
4. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   GEMINI_API_KEY=your_gemini_key
   TELEGRAM_BOT_TOKEN=your_bot_token
   NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
   ```
5. Set up Telegram bot:
   - Create bot with BotFather
   - Set webhook: `https://api.telegram.org/bot<token>/setWebhook?url=https://your-app.vercel.app/api/telegram`
6. Run development server: `npm run dev`

## Deployment

Deploy to Vercel. Set up Supabase cron for weekly reviews.

## Usage

- Send messages to Telegram bot: `/win Your win`, `/problem Issue`, etc.
- View dashboard at home page
- Check entries and reports in respective sections
