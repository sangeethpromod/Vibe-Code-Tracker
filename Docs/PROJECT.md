# Vibe Code Tracker - Project Overview

## What You Built

A brutally honest weekly reflection system that acts as your personal Board of Directors. It logs events via Telegram, generates AI-powered weekly summaries, and surfaces uncomfortable truths to force action.

---

## File Structure

```
Vibe-Code-Tracker/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── entries/route.ts       # POST/GET entries
│   │   │   ├── telegram/route.ts      # Telegram bot webhook
│   │   │   ├── weekly-review/route.ts # Weekly AI summary
│   │   │   └── reports/route.ts       # GET weekly reports
│   │   ├── entries/page.tsx           # Entries page with filters
│   │   ├── reports/page.tsx           # Weekly reports page
│   │   ├── page.tsx                   # Home dashboard
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css                # Tailwind styles
│   └── lib/
│       ├── supabase.ts                # Supabase client & types
│       ├── gemini.ts                  # Gemini AI integration
│       └── types.ts                   # TypeScript types & validation
├── supabase/
│   └── schema.sql                     # Database schema & cron
├── .env.local                         # Environment variables (gitignored)
├── .env.local.example                 # Template for env vars
├── SETUP.md                           # Complete setup guide
├── DEPLOY.md                          # Quick deploy checklist
├── test-setup.ps1                     # Local testing script
└── README.md                          # Project overview
```

---

## Tech Stack

- **Next.js 15** (App Router) - Server Components for zero client-side API exposure
- **Supabase** - Postgres database, auth, cron jobs
- **Gemini API** - AI-powered weekly summaries
- **Telegram Bot API** - Event logging interface
- **Vercel** - Serverless deployment
- **Tailwind CSS** - Minimal, functional styling
- **TypeScript** - Type safety
- **Zod** - Runtime validation

---

## Core Features Implemented

### ✅ API Routes
- `POST /api/entries` - Create entry (validated with Zod)
- `GET /api/entries?type=win&limit=50` - Query entries with filters
- `POST /api/telegram` - Telegram webhook receiver
- `POST /api/weekly-review` - Generate AI summary (protected)
- `GET /api/reports` - Fetch weekly reports

### ✅ Dashboard Pages
- `/` - Home with next review date, this week's stats, latest summary
- `/entries` - All entries with type filters (client-side)
- `/reports` - Past weekly reviews in reverse chronological order

### ✅ Database
- `entries` table - Stores logged events (win/problem/money/avoidance)
- `weekly_reports` table - Stores AI-generated summaries
- RLS policies - Public for v1 (single-user)
- Indexes - Optimized for queries

### ✅ Integrations
- **Telegram Bot** - Parses `type: content` format, saves to DB, confirms
- **Gemini AI** - Generates structured JSON with summary/patterns/strategy/drop_list
- **Supabase Cron** - Triggers weekly review every Sunday at 8pm

---

## Data Flow

```
Telegram Message
    ↓
POST /api/telegram
    ↓
Parse format (win: content)
    ↓
POST /api/entries
    ↓
Save to Supabase
    ↓
Confirm to user

[Every Sunday 8pm]
    ↓
Supabase Cron triggers
    ↓
POST /api/weekly-review
    ↓
Fetch last 7 days entries
    ↓
Call Gemini API
    ↓
Save to weekly_reports
    ↓
Send via Telegram
```

---

## Key Design Decisions

### No Client-Side API Keys
All Supabase and Gemini calls happen server-side. Client never touches secrets.

### Server Components by Default
Home and reports pages use Server Components to fetch data directly from Supabase during SSR.

### Minimal Auth
V1 uses env-based `CRON_SECRET` for webhook protection. No user auth needed for personal use.

### Structured Gemini Output
Prompt engineering to force JSON response with specific sections. Falls back gracefully on parse errors.

### Brutal Honesty Philosophy
- No positive affirmations or gentle language
- Surfaces patterns and avoidance tactics
- Issues executable strategy, not vague advice
- Drop list forces elimination, not addition

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=          # Public, safe for client
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Public, safe for client
SUPABASE_SERVICE_ROLE_KEY=         # SECRET - server only
GEMINI_API_KEY=                    # SECRET - server only
TELEGRAM_BOT_TOKEN=                # SECRET - server only
TELEGRAM_CHAT_ID=                  # Your Telegram chat ID
CRON_SECRET=                       # Random string for auth
```

---

## What's NOT Included (By Design)

- ❌ User authentication (personal use only)
- ❌ Real-time subscriptions (weekly cadence)
- ❌ Analytics/graphs (avoid overengineering)
- ❌ Social features (private by nature)
- ❌ Complex UI (tool, not product)
- ❌ Mobile app (Telegram is the mobile interface)

---

## Next Steps

1. **Setup** - Follow [SETUP.md](SETUP.md) for complete instructions
2. **Deploy** - Use [DEPLOY.md](DEPLOY.md) for quick deploy checklist
3. **Test** - Run `test-setup.ps1` to verify local setup
4. **Use** - Start logging via Telegram, wait for Sunday review

---

## Extending the System

### Add More Entry Types
1. Update `EntryType` enum in `src/lib/types.ts`
2. Add color mapping in `src/app/entries/page.tsx`
3. Add stat card in `src/app/page.tsx`

### Customize Gemini Prompt
Edit `src/lib/gemini.ts` → `generateWeeklyReview()` function

### Change Review Schedule
Edit `supabase/schema.sql` → cron schedule (cron syntax)

### Add Email Notifications
Install nodemailer, add to `/api/weekly-review` endpoint

### Multi-User Support
- Add Supabase auth
- Update RLS policies
- Filter entries by user_id
- Add settings page

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **Telegram Bot API**: https://core.telegram.org/bots/api
- **Next.js Docs**: https://nextjs.org/docs

---

Built to surface uncomfortable truths and force action. Not a journal. A Board of Directors.
