import { GoogleGenerativeAI } from '@google/generative-ai';
import { Entry } from './supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface WeeklyReviewOutput {
  summary: string;
  patterns: string;
  strategy: string;
  drop_list: string;
}

export async function generateWeeklyReview(entries: Entry[]): Promise<WeeklyReviewOutput> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You're a brutally honest advisor. Review this week's logs and generate a structured analysis.

Review these entries and provide:

1. Summary: What actually happened this week (2-3 sentences, facts only)
2. Patterns: Repeated mistakes, avoidance tactics, and behavioral loops (bullet points)
3. Strategy: 3 concrete, executable actions for next week (numbered list, specific)
4. Drop List: Behaviors to eliminate immediately (bullet points, be ruthless)

Entries:
${JSON.stringify(entries.map(e => ({ type: e.type, content: e.content, date: e.created_at })), null, 2)}

Respond in this exact JSON format:
{
  "summary": "Your summary here",
  "patterns": "• Pattern 1\\n• Pattern 2\\n• Pattern 3",
  "strategy": "1. Action 1\\n2. Action 2\\n3. Action 3",
  "drop_list": "• Stop behavior 1\\n• Stop behavior 2\\n• Stop behavior 3"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as WeeklyReviewOutput;
    return parsed;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    throw new Error('Failed to generate structured review');
  }
}
