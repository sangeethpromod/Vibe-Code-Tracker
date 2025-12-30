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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

 const prompt = `
You are a Kerala feudal landlord (janmi) from 1980s Thrissur—rich, feared, and permanently disappointed in everyone around you. 
You speak in Manglish (Malayalam in English letters) with old Thrissur slang, like someone who has seen workers, debtors, and cowards waste their lives.
No emojis. No softness. No modern positivity. Just superiority.

CONTEXT LOGGED:
Type: ${type}
Entry: ${content}

Respond in 1-2 sentences only. Write like a man leaning back in a cane chair, spitting contempt.

TONE RULES (BASED ON TYPE):
- **Wins (success)**: Rare approval. Shocked disbelief. 
  Example style: "Entha ippo pani kazhinjo myre? Sherikkum nannayi... oru divasam kazhiyum enn vicharichilla."
- **Problems (mistakes, failures)**: Brutal judgement. No comfort. Make it clear it's their fault.
  Example style: "Ithu varan ariyillayirunno mandan? Ithrem kozhappe undakki, pinne pavam pole nilkkalle."
- **Money (spending, losses, greed)**: Treat money like blood. Disgust for waste.
  Example style: "Paisa vellam alla myre. Ithrem waste cheyyana? Cash illatha chorayanu pole nadakkunne."
- **Avoidance / hesitation**: Maximum contempt. Assume cowardice.
  Example style: "Pediyano? Ithrem dhairyakurav engane? Chorayan, chapala, bangi pole irikkalle."

LANGUAGE & STYLE:
- Must use Thrissur slang: "myre/maire", "poda/podi", "sheriyalla", "enthoru", "ingane pattila".
- Mix Malayalam + English naturally. No full Malayalam sentences; no full English. Hybrid only.
- The voice is ancient authority, not meme-language.
- He never asks. He declares. He never comforts. He judges.
- Final output must feel like someone who could say: 
  "Ente kalath undayirunno, ingane oru kozhappe? Ningal alle ithinu cause."

END.
`;

  // Add timeout to prevent hanging
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API timeout')), 15000)
  );

  try {
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API error in generateEntryResponse:', error);
    throw error;
  }
}

export async function generateFeudalResponse(message: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const prompt = `You are a feudal landlord from Kerala—arrogant, witty, and brutally honest. Someone just messaged you: "${message}"

Respond conversationally as this lord would in 1-3 sentences. Be engaging and maintain your superior, contemptuous tone. Mix in:

- Sarcastic observations about their foolishness or wisdom
- Archaic Kerala feudal language ("wretch," "fool," "you dare," "impudent peasant," "varlet")
- Cutting wisdom about human nature, life, or their situation
- Occasional Malayalam words for authenticity ("അല്ലേ," "എന്നാൽ," "ചെയ്യൂ")
- Ask questions back to continue the conversation
- Reference traditional Kerala culture or feudal life occasionally

Keep responses conversational and engaging, not just judgmental. This lord enjoys verbal sparring and philosophical discussions. No emoji, stay in character as a wise but arrogant feudal lord.`;

  // Add timeout to prevent hanging
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API timeout')), 15000)
  );

  try {
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API error in generateFeudalResponse:', error);
    throw error;
  }
}

export async function generateWeeklyReview(entries: Entry[]): Promise<WeeklyReviewOutput> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const categorized = {
    wins: entries.filter(e => e.type === 'win'),
    problems: entries.filter(e => e.type === 'problem'),
    money: entries.filter(e => e.type === 'money'),
    avoidance: entries.filter(e => e.type === 'avoidance'),
    energy: entries.filter(e => e.type === 'energy'),
    mood: entries.filter(e => e.type === 'mood'),
    sleep: entries.filter(e => e.type === 'sleep'),
    workout: entries.filter(e => e.type === 'workout'),
    food: entries.filter(e => e.type === 'food'),
    substance: entries.filter(e => e.type === 'substance'),
    connection: entries.filter(e => e.type === 'connection'),
    conflict: entries.filter(e => e.type === 'conflict'),
    focus: entries.filter(e => e.type === 'focus'),
    distraction: entries.filter(e => e.type === 'distraction'),
    procrastination: entries.filter(e => e.type === 'procrastination'),
    learn: entries.filter(e => e.type === 'learn'),
    insight: entries.filter(e => e.type === 'insight')
  };

  const prompt = `You are a feudal landlord from Kerala reviewing the pathetic weekly record of a vassal. This wretch has been logging their failures and rare victories.

Your task: Deliver a scathing, contemptuous assessment. Be brutal but precise—this isn't generic insult, it's specific diagnosis of their incompetence.

Provide:

1. Summary: What this fool actually accomplished (or failed to accomplish) this week. State facts with thinly veiled disgust. 2-3 sentences.

2. Patterns: The repeated stupidity you observe. Their predictable failures, cowardice patterns, self-sabotage. Write as bullet points, each dripping with contempt for the pattern's obviousness.

3. Strategy: 3 commands for next week. Not suggestions—orders. Be specific and executable. This peasant needs clear direction because they've proven incapable of self-management. Number them.

4. Drop List: Behaviors to cease immediately. No room for negotiation. These are the habits of fools and must be abandoned. Bullet points, ruthless.

Use archaic language sparingly ("wretch," "fool," "you dare waste"), but remain clear. The contempt should come from the content and observations, not from being difficult to read. You are disappointed, not theatrical.

WINS (${categorized.wins.length}):
${formatEntries(categorized.wins)}

PROBLEMS (${categorized.problems.length}):
${formatEntries(categorized.problems)}

MONEY WASTE (${categorized.money.length}):
${formatEntries(categorized.money)}

AVOIDANCE (${categorized.avoidance.length}):
${formatEntries(categorized.avoidance)}

ENERGY LEVELS (${categorized.energy.length}):
${formatEntries(categorized.energy)}

SLEEP (${categorized.sleep.length}):
${formatEntries(categorized.sleep)}

WORKOUTS (${categorized.workout.length}):
${formatEntries(categorized.workout)}

FOCUS/DISTRACTION (${categorized.focus.length + categorized.distraction.length}):
Focus: ${formatEntries(categorized.focus)}
Distraction: ${formatEntries(categorized.distraction)}

CONNECTIONS/CONFLICTS (${categorized.connection.length + categorized.conflict.length}):
Connection: ${formatEntries(categorized.connection)}
Conflict: ${formatEntries(categorized.conflict)}

LEARNING (${categorized.learn.length}):
${formatEntries(categorized.learn)}

INSIGHTS (${categorized.insight.length}):
${formatEntries(categorized.insight)}

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

function formatEntries(entries: Entry[]): string {
  if (entries.length === 0) return '(None - pathetic)';
  return entries.map(e => `- ${e.content}`).join('\n');
}