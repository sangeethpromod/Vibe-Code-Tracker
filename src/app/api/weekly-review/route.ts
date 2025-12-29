import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateWeeklyReview } from '@/lib/gemini';

const CRON_SECRET = process.env.CRON_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram not configured, skipping message');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'Markdown',
    }),
  });
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get last 7 days of entries
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: entries, error: fetchError } = await getSupabaseAdmin()
      .from('entries')
      .select('*')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching entries:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch entries' },
        { status: 500 }
      );
    }

    if (!entries || entries.length === 0) {
      await sendTelegramMessage(
        '📭 *Weekly Review*\n\nNo entries this week. Start logging.'
      );
      return NextResponse.json({ 
        message: 'No entries to review',
        entries_count: 0
      });
    }

    // Generate review with Gemini
    const review = await generateWeeklyReview(entries);

    // Save to database
    const weekStart = getWeekStart(new Date());
    const { data: report, error: saveError } = await getSupabaseAdmin()
      .from('weekly_reports')
      .insert({
        week_start: weekStart,
        summary: review.summary,
        patterns: review.patterns,
        strategy: review.strategy,
        drop_list: review.drop_list,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving report:', saveError);
      return NextResponse.json(
        { error: 'Failed to save report' },
        { status: 500 }
      );
    }

    // Send via Telegram
    const message = `📊 *Weekly Review* — Week of ${weekStart}

*Summary*
${review.summary}

*Patterns*
${review.patterns}

*Strategy for Next Week*
${review.strategy}

*Drop List*
${review.drop_list}

Logged entries: ${entries.length}`;

    await sendTelegramMessage(message);

    return NextResponse.json({
      message: 'Weekly review generated',
      report_id: report.id,
      entries_count: entries.length,
    });
  } catch (error) {
    console.error('Error generating weekly review:', error);
    
    // Send error notification
    await sendTelegramMessage(
      '❌ *Weekly Review Failed*\n\nCheck server logs for details.'
    );

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow GET for manual triggering
export async function GET(request: NextRequest) {
  return POST(request);
}
