// app/lib/pattern-detector.ts

import { getSupabaseAdmin } from './supabase';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

async function sendTelegramMessage(chatId: string, text: string) {
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

export async function runPatternDetection() {
  const supabase = getSupabaseAdmin();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch recent entries
  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .gte('created_at', sevenDaysAgo.toISOString());

  if (!entries) return;

  const alerts: string[] = [];

  // Pattern 1: Repeated avoidance (4+ times)
  const avoidanceEntries = entries.filter(e =>
    e.type === 'avoidance' ||
    e.content.toLowerCase().includes('skipped') ||
    e.content.toLowerCase().includes('avoided')
  );

  if (avoidanceEntries.length >= 4) {
    alerts.push(
      `⚠️ You've logged avoidance ${avoidanceEntries.length} times this week. Pattern forming.`
    );
  }

  // Pattern 2: Money mistakes (3+ times)
  const moneyEntries = entries.filter(e => e.type === 'money');
  if (moneyEntries.length >= 3) {
    alerts.push(
      `💸 3rd money mistake this week. The feudal lord is displeased with your wastefulness.`
    );
  }

  // Pattern 3: No wins in 5+ days
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const recentWins = entries.filter(e =>
    e.type === 'win' && new Date(e.created_at) > fiveDaysAgo
  );

  if (recentWins.length === 0) {
    alerts.push(
      `🚨 You haven't logged a win in 5 days. What's happening, wretch?`
    );
  }

  // Pattern 4: Low energy streak (4+ days below 5)
  const { data: checkins } = await supabase
    .from('checkins')
    .select('energy_score, created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(4);

  if (checkins && checkins.length >= 4) {
    const allLowEnergy = checkins.every(c => c.energy_score < 5);
    if (allLowEnergy) {
      alerts.push(
        `⚡ Energy below 5 for 4 consecutive days. Check sleep and stress levels immediately.`
      );
    }
  }

  // Pattern 5: Workout absence
  const workoutEntries = entries.filter(e => e.type === 'workout');
  if (workoutEntries.length === 0) {
    alerts.push(
      `🏋️ Zero workouts logged this week. Your body rots while you delay.`
    );
  }

  // Send alerts
  if (alerts.length > 0) {
    const message = `📊 PATTERN ALERTS\n\n` + alerts.join('\n\n');
    await sendTelegramMessage(TELEGRAM_CHAT_ID, message);

    // Save to database
    for (const alert of alerts) {
      await supabase.from('pattern_alerts').insert({
        alert_type: 'threshold',
        category: 'multiple',
        message: alert,
        severity: 'warning'
      });
    }
  }
}