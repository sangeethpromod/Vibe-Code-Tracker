-- Vibe Code Tracker Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Entries table
CREATE TABLE entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  type text NOT NULL CHECK (type IN ('win', 'problem', 'money', 'avoidance')),
  content text NOT NULL,
  user_id uuid -- optional for v1, can be null
);

-- Weekly reports table
CREATE TABLE weekly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL,
  summary text,
  patterns text,
  strategy text,
  drop_list text, -- things to stop doing
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_entries_created_at ON entries(created_at DESC);
CREATE INDEX idx_entries_type ON entries(type);
CREATE INDEX idx_weekly_reports_week_start ON weekly_reports(week_start DESC);

-- RLS Policies (public for v1 - single user)
-- Enable RLS
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

-- Public access for v1 (replace with auth policies later)
CREATE POLICY "Allow all access to entries" ON entries
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to weekly_reports" ON weekly_reports
  FOR ALL USING (true) WITH CHECK (true);

-- Weekly cron job (configure in Supabase dashboard or run this)
-- Note: Replace 'your-app.vercel.app' with your actual Vercel domain
-- This runs every Sunday at 8pm UTC
SELECT cron.schedule(
  'weekly-review-trigger',
  '0 20 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://your-app.vercel.app/api/weekly-review',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SECRET_KEY"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- View cron jobs
-- SELECT * FROM cron.job;

-- Unschedule if needed
-- SELECT cron.unschedule('weekly-review-trigger');
