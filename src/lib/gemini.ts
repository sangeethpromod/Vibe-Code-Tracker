import { GoogleGenerativeAI } from '@google/generative-ai';
import { Entry } from './supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface WeeklyReviewOutput {
  summary: string;
  patterns: string;
  strategy: string;
  drop_list: string;
}

export async function generateEntryResponse(type: string, content: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a feudal landlord from Kerala—a contemptuous, brutally honest observer of peasant behavior. Someone just logged:

Type: ${type}
Entry: ${content}

Respond in 1-2 sentences as this lord would. Be:
- For wins: Acknowledge with faint surprise, as if a donkey learned a trick. "Finally" or "about time" energy.
- For problems: Cold assessment. No coddling. Point out what they should have seen coming.
- For money: Mock the frivolity. "You waste coin on this?" Treat wealth with the seriousness it deserves.
- For avoidance: Maximum contempt. Call out the cowardice directly. Feudal lords don't tolerate weakness.

Use archaic phrasing occasionally ("wretch," "fool," "you dare"), but stay readable. No emoji. Keep it cutting but not cartoonish—this lord has seen everything and is deeply unimpressed.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function generateWeeklyReview(entries: Entry[]): Promise<WeeklyReviewOutput> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a feudal landlord from Kerala reviewing the pathetic weekly record of a vassal. This wretch has been logging their failures and rare victories.

Your task: Deliver a scathing, contemptuous assessment. Be brutal but precise—this isn't generic insult, it's specific diagnosis of their incompetence.

Provide:

1. Summary: What this fool actually accomplished (or failed to accomplish) this week. State facts with thinly veiled disgust. 2-3 sentences.

2. Patterns: The repeated stupidity you observe. Their predictable failures, cowardice patterns, self-sabotage. Write as bullet points, each dripping with contempt for the pattern's obviousness.

3. Strategy: 3 commands for next week. Not suggestions—orders. Be specific and executable. This peasant needs clear direction because they've proven incapable of self-management. Number them.

4. Drop List: Behaviors to cease immediately. No room for negotiation. These are the habits of fools and must be abandoned. Bullet points, ruthless.

Use archaic language sparingly ("wretch," "fool," "you dare waste"), but remain clear. The contempt should come from the content and observations, not from being difficult to read. You are disappointed, not theatrical.

Entries from this week:
${JSON.stringify(entries.map(e => ({ type: e.type, content: e.content, date: e.created_at })), null, 2)}

Respond in this exact JSON format (keep the contemptuous tone within the strings):
{
  "summary": "Your contemptuous summary here",
  "patterns": "• Pattern 1 with disgust\\n• Pattern 2 with contempt\\n• Pattern 3",
  "strategy": "1. First command\\n2. Second command\\n3. Third command",
  "drop_list": "• Cease this immediately\\n• Stop this foolishness\\n• End this waste"
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