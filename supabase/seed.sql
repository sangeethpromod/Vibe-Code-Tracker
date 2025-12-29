-- Seed data for testing
-- Run this in Supabase SQL Editor to add dummy entries

-- Insert sample entries
INSERT INTO entries (type, content, created_at) VALUES
  ('win', 'Shipped the new feature to production ahead of schedule', now() - interval '6 days'),
  ('win', 'Got 10 new users today from Reddit post', now() - interval '5 days'),
  ('win', 'Fixed critical bug that was affecting 30% of users', now() - interval '4 days'),
  ('problem', 'Lost focus in the afternoon, scrolled social media for 2 hours', now() - interval '5 days'),
  ('problem', 'Server crashed twice today under load', now() - interval '3 days'),
  ('problem', 'Client hasn''t responded to emails for 4 days', now() - interval '2 days'),
  ('money', '+5000 from client payment received', now() - interval '6 days'),
  ('money', '-150 on unnecessary SaaS tool subscription', now() - interval '4 days'),
  ('money', '+2500 freelance project completed', now() - interval '2 days'),
  ('avoidance', 'Watched coding tutorials instead of actually building', now() - interval '5 days'),
  ('avoidance', 'Reorganized Notion workspace for 3 hours instead of shipping', now() - interval '3 days'),
  ('avoidance', 'Overthinking the design instead of launching MVP', now() - interval '1 day'),
  ('win', 'Completed all tasks from today''s todo list', now()),
  ('problem', 'Feeling burnt out, need to take a break', now());

-- Verify the entries were inserted
SELECT 
  type,
  COUNT(*) as count,
  MAX(created_at) as latest
FROM entries
GROUP BY type
ORDER BY type;
