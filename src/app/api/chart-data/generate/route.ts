// app/api/chart-data/generate/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateChartData } from '@/lib/chart-generator';

export async function POST() {
  try {
    const supabase = getSupabaseAdmin();

    // Generate all chart types
    const chartTypes = [
      'entry_volume',
      'energy_timeline',
      'category_distribution',
      'entry_type_pie',
      'weekly_category_heatmap',
      'sleep_quality',
      'workout_frequency',
      'avoidance_frequency',
      'money_mistakes_scatter',
      'procrastination_duration',
      'energy_correlation',
      'win_problem_ratio',
      'strategy_completion',
      'connection_quality',
      'productivity_focus',
      'financial_tracking',
      'logging_consistency'
    ];

    for (const chartType of chartTypes) {
      try {
        const chartData = await generateChartData(chartType);

        // Store in database (upsert to replace expired data)
        await supabase
          .from('chart_data')
          .upsert({
            chart_type: chartType,
            period: 'weekly',
            data: chartData,
            generated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }, {
            onConflict: 'chart_type,period'
          });

      } catch (error) {
        console.error(`Failed to generate ${chartType} chart:`, error);
        // Continue with other charts
      }
    }

    return NextResponse.json({ success: true, message: 'Chart data generated' });
  } catch (error) {
    console.error('Chart generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate charts' }, { status: 500 });
  }
}