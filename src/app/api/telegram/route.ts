import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
  };
  date: number;
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

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
  // Expected format: "win: content" or "problem: content"
  const match = text.match(/^(win|problem|money|avoidance):\s*(.+)/i);
  
  if (!match) {
    return null;
  }

  return {
    type: match[1].toLowerCase(),
    content: match[2].trim(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramUpdate = await request.json();

    if (!body.message || !body.message.text) {
      return NextResponse.json({ ok: true });
    }

    const message = body.message;
    const chatId = message.chat.id;

    // Parse the message
    const entry = parseEntry(message.text!);

    if (!entry) {
      await sendTelegramMessage(
        chatId,
        'Invalid format. Use:\n\n' +
        '`win: your achievement`\n' +
        '`problem: the issue`\n' +
        '`money: financial note`\n' +
        '`avoidance: what you avoided`'
      );
      return NextResponse.json({ ok: true });
    }

    // Save to database via entries API
    const apiUrl = new URL('/api/entries', request.url).toString();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    if (response.ok) {
      await sendTelegramMessage(
        chatId,
        `✅ Logged *${entry.type}*: ${entry.content.substring(0, 100)}${entry.content.length > 100 ? '...' : ''}`
      );
    } else {
      await sendTelegramMessage(
        chatId,
        '❌ Failed to save entry. Please try again.'
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Telegram webhook is active'
  });
}
