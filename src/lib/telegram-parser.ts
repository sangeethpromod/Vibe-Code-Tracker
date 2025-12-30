// app/lib/telegram-parser.ts

export type EntryType =
  | 'win' | 'problem' | 'money' | 'avoidance'
  | 'energy' | 'mood' | 'sleep'
  | 'workout' | 'food' | 'substance'
  | 'connection' | 'conflict'
  | 'focus' | 'distraction' | 'procrastination'
  | 'learn' | 'insight';

interface ParsedEntry {
  type: EntryType;
  content: string;
  metadata?: Record<string, unknown>;
}

export function parseEntry(text: string): ParsedEntry {
  const lower = text.toLowerCase().trim();

  // Original types (support both long and short prefixes)
  if (lower.startsWith('win:') || lower.startsWith('w:')) {
    return { type: 'win', content: extractContent(text) };
  }
  if (lower.startsWith('problem:') || lower.startsWith('p:')) {
    return { type: 'problem', content: extractContent(text) };
  }
  if (lower.startsWith('money:') || lower.startsWith('m:')) {
    return { type: 'money', content: extractContent(text) };
  }
  if (lower.startsWith('avoid:') || lower.startsWith('a:')) {
    return { type: 'avoidance', content: extractContent(text) };
  }

  // Emotional/Mental
  if (lower.startsWith('energy:') || lower.startsWith('e:')) {
    const content = extractContent(text);
    const scoreMatch = content.match(/(\d+)(?:\/10)?/);
    return {
      type: 'energy',
      content,
      metadata: scoreMatch ? { score: parseInt(scoreMatch[1]) } : {}
    };
  }
  if (lower.startsWith('mood:')) {
    return { type: 'mood', content: extractContent(text) };
  }
  if (lower.startsWith('sleep:')) {
    const content = extractContent(text);
    const hoursMatch = content.match(/(\d+)\s*h(?:rs?|ours?)?/i);
    return {
      type: 'sleep',
      content,
      metadata: hoursMatch ? { hours: parseInt(hoursMatch[1]) } : {}
    };
  }

  // Habits/Health
  if (lower.startsWith('workout:') || lower.startsWith('gym:')) {
    const content = extractContent(text);
    const durationMatch = content.match(/(\d+)\s*min/i);
    return {
      type: 'workout',
      content,
      metadata: durationMatch ? { duration_min: parseInt(durationMatch[1]) } : {}
    };
  }
  if (lower.startsWith('food:') || lower.startsWith('ate:')) {
    return { type: 'food', content: extractContent(text) };
  }
  if (lower.startsWith('drinks:') || lower.startsWith('caffeine:') || lower.startsWith('substance:')) {
    return { type: 'substance', content: extractContent(text) };
  }

  // Relationship/Social
  if (lower.startsWith('connection:') || lower.startsWith('connect:')) {
    return { type: 'connection', content: extractContent(text) };
  }
  if (lower.startsWith('conflict:')) {
    return { type: 'conflict', content: extractContent(text) };
  }

  // Work/Productivity
  if (lower.startsWith('focus:') || lower.startsWith('deep:')) {
    return { type: 'focus', content: extractContent(text) };
  }
  if (lower.startsWith('distracted:') || lower.startsWith('distraction:')) {
    return { type: 'distraction', content: extractContent(text) };
  }
  if (lower.startsWith('procrastinate:') || lower.startsWith('procrastination:')) {
    return { type: 'procrastination', content: extractContent(text) };
  }

  // Learning/Growth
  if (lower.startsWith('learn:') || lower.startsWith('learned:')) {
    return { type: 'learn', content: extractContent(text) };
  }
  if (lower.startsWith('insight:')) {
    return { type: 'insight', content: extractContent(text) };
  }

  // Default to problem if no prefix matched
  return { type: 'problem', content: text };
}

function extractContent(text: string): string {
  return text.substring(text.indexOf(':') + 1).trim();
}