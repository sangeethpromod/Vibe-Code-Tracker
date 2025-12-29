import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = "edge";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

async function sendTelegramMessage(chatId: number, text: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  });
}

function parseEntry(text: string): { type: string; content: string } | null {
  const match = text.match(/^(win|problem|money|avoidance):\s*(.+)/i);
  if (!match) return null;
  return {
    type: match[1].toLowerCase(),
    content: match[2].trim(),
  };
}

export async function POST(req: Request) {
  try {
    const update = await req.json();
    console.log("TELEGRAM UPDATE:", update);

    const message = update?.message;
    if (!message?.text) {
      return new Response("OK", { status: 200 });
    }

    const chatId = message.chat.id;
    const entry = parseEntry(message.text);

    if (!entry) {
      await sendTelegramMessage(
        chatId,
        'Invalid format. Use:\n\n`win: your achievement`\n`problem: the issue`\n`money: financial note`\n`avoidance: what you avoided`'
      );
      return new Response("OK", { status: 200 });
    }

    // Save to Supabase
    const { data, error } = await getSupabaseAdmin()
      .from('entries')
      .insert({
        type: entry.type,
        content: entry.content,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      await sendTelegramMessage(chatId, '❌ Failed to save entry. Please try again.');
    } else {
      console.log('Saved entry:', data);
      await sendTelegramMessage(
        chatId,
        `✅ Logged *${entry.type}*: ${entry.content.substring(0, 100)}${entry.content.length > 100 ? '...' : ''}`
      );
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("ERROR:", err);
    return new Response("OK", { status: 200 });
  }
}
