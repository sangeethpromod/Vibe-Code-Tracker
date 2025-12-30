import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateEntryResponse, generateFeudalResponse } from '@/lib/gemini';
import { parseEntry } from '@/lib/telegram-parser';

export const runtime = "edge";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

type ConversationState =
  | 'idle'
  | 'awaiting_checkin_energy'
  | 'awaiting_checkin_win'
  | 'awaiting_checkin_avoided'
  | 'awaiting_checkin_mood'
  | 'awaiting_checkin_grateful';

interface TelegramMessage {
  message: {
    chat: { id: number };
    text: string;
  };
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

async function saveEntry(entry: { type: string; content: string; metadata?: Record<string, unknown> }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('entries')
    .insert({
      type: entry.type,
      content: entry.content,
      metadata: entry.metadata || {},
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return data;
}

export async function POST(req: NextRequest) {
  const body: TelegramMessage = await req.json();
  const chatId = body.message.chat.id;
  const text = body.message.text?.trim();

  if (!text) return NextResponse.json({ ok: true });

  const supabase = getSupabaseAdmin();

  // Get conversation state
  const { data: stateData } = await supabase
    .from('conversation_state')
    .select('*')
    .eq('chat_id', chatId)
    .single();

  const currentState: ConversationState = stateData?.state || 'idle';
  const stateDataObj = stateData?.data || {};

  // Handle /checkin command
  if (text.toLowerCase() === '/checkin' && currentState === 'idle') {
    await updateConversationState(supabase, chatId, 'awaiting_checkin_energy', {});
    await sendTelegramMessage(chatId,
      "Quick check-in:\n\n1️⃣ Energy level today (1-10)?"
    );
    return NextResponse.json({ ok: true });
  }

  // Handle check-in flow
  if (currentState !== 'idle') {
    return await handleCheckinFlow(supabase, chatId, text, currentState, stateDataObj);
  }

  // Check if this looks like an entry (contains a colon for type:content format)
  const isEntryFormat = text.includes(':') && text.split(':')[0].trim().length > 0;

  if (isEntryFormat) {
    // Parse and save as entry
    const entry = parseEntry(text);
    await saveEntry(entry);
    const response = await generateEntryResponse(entry.type, entry.content);
    await sendTelegramMessage(chatId, response);
  } else {
    // Treat as general conversation and respond as feudal lord
    const response = await generateFeudalResponse(text);
    await sendTelegramMessage(chatId, response);
  }

  return NextResponse.json({ ok: true });
}

async function handleCheckinFlow(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  chatId: number,
  text: string,
  state: ConversationState,
  data: Record<string, unknown>
) {
  switch (state) {
    case 'awaiting_checkin_energy':
      const energy = parseInt(text);
      if (isNaN(energy) || energy < 1 || energy > 10) {
        await sendTelegramMessage(chatId, "Please enter a number between 1-10:");
        return NextResponse.json({ ok: true });
      }
      await updateConversationState(supabase, chatId, 'awaiting_checkin_win', { ...data, energy });
      await sendTelegramMessage(chatId, "2️⃣ One win today?");
      break;

    case 'awaiting_checkin_win':
      await updateConversationState(supabase, chatId, 'awaiting_checkin_avoided', { ...data, win: text });
      await sendTelegramMessage(chatId, "3️⃣ What did you avoid today?");
      break;

    case 'awaiting_checkin_avoided':
      await updateConversationState(supabase, chatId, 'awaiting_checkin_mood', { ...data, avoided: text });
      await sendTelegramMessage(chatId, "4️⃣ Current mood (one word)?");
      break;

    case 'awaiting_checkin_mood':
      await updateConversationState(supabase, chatId, 'awaiting_checkin_grateful', { ...data, mood: text });
      await sendTelegramMessage(chatId, "5️⃣ What are you grateful for today?");
      break;

    case 'awaiting_checkin_grateful':
      // Save complete check-in
      const checkinData: { energy: number; win: string; avoided: string; mood: string; grateful: string } = {
        energy: data.energy as number,
        win: data.win as string,
        avoided: data.avoided as string,
        mood: data.mood as string,
        grateful: text
      };
      await saveCheckin(supabase, checkinData);

      await updateConversationState(supabase, chatId, 'idle', {});
      await sendTelegramMessage(chatId,
        `✅ Check-in complete!\n\n` +
        `Energy: ${checkinData.energy}/10\n` +
        `Win: ${checkinData.win}\n` +
        `Avoided: ${checkinData.avoided}\n` +
        `Mood: ${checkinData.mood}\n` +
        `Grateful: ${checkinData.grateful}`
      );
      break;
  }

  return NextResponse.json({ ok: true });
}

async function updateConversationState(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  chatId: number,
  state: ConversationState,
  data: Record<string, unknown>
) {
  await supabase
    .from('conversation_state')
    .upsert({
      chat_id: chatId,
      state,
      data,
      updated_at: new Date().toISOString()
    });
}

async function saveCheckin(supabase: ReturnType<typeof getSupabaseAdmin>, data: Record<string, unknown>) {
  await supabase.from('checkins').insert({
    energy_score: data.energy,
    win_today: data.win,
    avoided_today: data.avoided,
    mood: data.mood,
    grateful_for: data.grateful
  });
}
