import { z } from 'zod';

// Entry types
export const EntryType = z.enum([
  'win', 'problem', 'money', 'avoidance',
  'energy', 'mood', 'sleep',
  'workout', 'food', 'substance',
  'connection', 'conflict',
  'focus', 'distraction', 'procrastination',
  'learn', 'insight'
]);
export type EntryType = z.infer<typeof EntryType>;

// Request validation schemas
export const CreateEntrySchema = z.object({
  type: EntryType,
  content: z.string().min(1).max(5000),
});

export type CreateEntryRequest = z.infer<typeof CreateEntrySchema>;

// Response types
export interface EntryResponse {
  id: string;
  created_at: string;
  type: EntryType;
  content: string;
}

export interface WeeklyReportResponse {
  id: string;
  week_start: string;
  summary: string;
  patterns: string;
  strategy: string;
  drop_list: string;
  created_at: string;
}
