// app/lib/chart-generator.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSupabaseAdmin } from './supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateChartData(chartType: string): Promise<any> {
  const supabase = getSupabaseAdmin();

  // Get raw data based on chart type
  const rawData = await getChartRawData(chartType, supabase);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompts = {
    entry_volume: `Analyze this entry data and generate a line chart showing entry volume over time.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"date": "2024-01-01", "total": 5, "wins": 2, "problems": 1, "money": 1, "avoidance": 1},
    ...
  ],
  "insights": ["Volume increased 40% this week", "Most active on Wednesdays"]
}`,

    energy_timeline: `Analyze energy check-in data and create an energy timeline chart.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"date": "2024-01-01", "energy": 7, "moving_average": 6.8, "zone": "normal"},
    ...
  ],
  "insights": ["Energy dipped below 5 for 3 days", "Average energy: 6.2/10"]
}`,

    category_distribution: `Create a stacked area chart showing entry type distribution over time.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"date": "2024-01-01", "wins": 2, "problems": 3, "money": 1, "avoidance": 1, "energy": 1, "workout": 0},
    ...
  ],
  "insights": ["Problems increased 200% mid-week", "Wins-to-problems ratio: 0.4"]
}`,

    entry_type_pie: `Create a pie chart showing current entry type distribution.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"name": "wins", "value": 15, "percentage": 25},
    {"name": "problems", "value": 20, "percentage": 33},
    ...
  ],
  "insights": ["60% of entries are problems - concerning", "Only 10% wins logged"]
}`,

    weekly_category_heatmap: `Create a heatmap showing entry types by week.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"week": "2024-W01", "wins": 8, "problems": 12, "money": 3, "avoidance": 5, "energy": 7},
    ...
  ],
  "insights": ["No wins logged in week 3", "Consistent energy tracking"]
}`,

    sleep_quality: `Create a bar chart showing sleep patterns.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"date": "2024-01-01", "hours": 7.5, "quality": "good", "interruptions": 1},
    ...
  ],
  "insights": ["Average sleep: 6.8 hours", "Sleep quality poor 3 nights this week"]
}`,

    workout_frequency: `Create a workout frequency calendar heatmap.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"date": "2024-01-01", "worked_out": true, "duration": 45},
    ...
  ],
  "insights": ["Worked out 4/7 days", "Current streak: 2 days", "Longest streak: 5 days"]
}`,

    avoidance_frequency: `Create a bar chart showing avoidance by day of week.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"day": "Monday", "count": 3, "types": ["work", "calls", "exercise"]},
    {"day": "Tuesday", "count": 1, "types": ["meetings"]},
    ...
  ],
  "insights": ["Most avoidance on Mondays", "Work avoidance most common"]
}`,

    money_mistakes_scatter: `Create a scatter plot of money mistakes by time.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"time": "14:30", "amount": 25.50, "category": "food", "day": "Monday"},
    ...
  ],
  "insights": ["80% of purchases after 8pm", "Average impulse buy: $35"]
}`,

    procrastination_duration: `Create a horizontal bar chart of procrastination duration.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"task": "Dentist appointment", "days_avoided": 37, "category": "health"},
    {"task": "Tax paperwork", "days_avoided": 21, "category": "finance"},
    ...
  ],
  "insights": ["Longest avoidance: 37 days", "Health tasks most avoided"]
}`,

    energy_correlation: `Create a scatter plot showing energy vs entry types.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"energy": 3, "entry_type": "problems", "count": 5},
    {"energy": 8, "entry_type": "wins", "count": 3},
    ...
  ],
  "insights": ["Low energy correlates with more problems", "High energy = more wins"]
}`,

    win_problem_ratio: `Create a dual-axis line chart of win/problem ratio.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"week": "2024-W01", "wins": 8, "problems": 12, "ratio": 0.67},
    ...
  ],
  "insights": ["Ratio declining for 3 weeks", "Current ratio: 0.4 (needs improvement)"]
}`,

    strategy_completion: `Create progress bars for strategy completion.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"strategy": "Exercise 4x/week", "completed": 60, "target": 100},
    {"strategy": "Limit social media", "completed": 20, "target": 100},
    ...
  ],
  "insights": ["Average completion: 35%", "Best: Exercise (60%)", "Worst: Social media (20%)"]
}`,

    connection_quality: `Create a line chart of connection quality over time.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"date": "2024-01-01", "score": 2, "positive_connections": 1, "avoided_connections": 0},
    ...
  ],
  "insights": ["Connection score: -3 this week", "More avoided than positive connections"]
}`,

    productivity_focus: `Create a stacked bar chart of focus vs distraction time.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"date": "2024-01-01", "focus_hours": 4.5, "distraction_hours": 2.3, "net_productivity": 2.2},
    ...
  ],
  "insights": ["Lost 12 hours to distractions this week", "Average focus time: 3.8 hours/day"]
}`,

    financial_tracking: `Create an area chart of money wasted over time.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"week": "2024-W01", "amount": 125.50, "cumulative": 125.50},
    ...
  ],
  "insights": ["Wasted $380 this month", "Could have bought: 2 weeks groceries"]
}`,

    logging_consistency: `Create a logging consistency calendar.
Raw data: ${JSON.stringify(rawData)}

Return JSON in this exact format:
{
  "data": [
    {"date": "2024-01-01", "entries_count": 4, "has_entries": true},
    ...
  ],
  "insights": ["Logged entries 5/7 days", "Current streak: 3 days", "Average: 3.2 entries/day"]
}`
  };

  const prompt = prompts[chartType as keyof typeof prompts] || `Generate chart data for ${chartType}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`Failed to parse ${chartType} chart data:`, error);
    return { data: [], insights: [] };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getChartRawData(chartType: string, supabase: any): Promise<any> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  switch (chartType) {
    case 'entry_volume':
    case 'category_distribution':
      return await supabase
        .from('entries')
        .select('created_at, type')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at');

    case 'energy_timeline':
      return await supabase
        .from('checkins')
        .select('created_at, energy_score')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at');

    case 'entry_type_pie':
    case 'weekly_category_heatmap':
      return await supabase
        .from('entries')
        .select('type')
        .gte('created_at', thirtyDaysAgo.toISOString());

    case 'sleep_quality':
      return await supabase
        .from('entries')
        .select('created_at, content, metadata')
        .eq('type', 'sleep')
        .gte('created_at', thirtyDaysAgo.toISOString());

    case 'workout_frequency':
      return await supabase
        .from('entries')
        .select('created_at, content, metadata')
        .eq('type', 'workout')
        .gte('created_at', thirtyDaysAgo.toISOString());

    case 'avoidance_frequency':
      return await supabase
        .from('entries')
        .select('created_at, content, type')
        .eq('type', 'avoidance')
        .gte('created_at', thirtyDaysAgo.toISOString());

    case 'money_mistakes_scatter':
      return await supabase
        .from('entries')
        .select('created_at, content, type')
        .eq('type', 'money')
        .gte('created_at', thirtyDaysAgo.toISOString());

    case 'procrastination_duration':
      return await supabase
        .from('entries')
        .select('created_at, content, type')
        .eq('type', 'procrastination')
        .gte('created_at', thirtyDaysAgo.toISOString());

    case 'energy_correlation':
      const [entries, checkins] = await Promise.all([
        supabase.from('entries').select('created_at, type').gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('checkins').select('created_at, energy_score').gte('created_at', thirtyDaysAgo.toISOString())
      ]);
      return { entries, checkins };

    case 'win_problem_ratio':
      return await supabase
        .from('entries')
        .select('created_at, type')
        .in('type', ['win', 'problem'])
        .gte('created_at', thirtyDaysAgo.toISOString());

    case 'connection_quality':
      return await supabase
        .from('entries')
        .select('created_at, type')
        .in('type', ['connection', 'conflict'])
        .gte('created_at', thirtyDaysAgo.toISOString());

    case 'productivity_focus':
      return await supabase
        .from('entries')
        .select('created_at, type, content')
        .in('type', ['focus', 'distraction'])
        .gte('created_at', thirtyDaysAgo.toISOString());

    case 'financial_tracking':
      return await supabase
        .from('entries')
        .select('created_at, content, type')
        .eq('type', 'money')
        .gte('created_at', thirtyDaysAgo.toISOString());

    case 'logging_consistency':
      return await supabase
        .from('entries')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

    default:
      return await supabase
        .from('entries')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .limit(100);
  }
}