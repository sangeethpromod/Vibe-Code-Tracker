// app/api/chart-data/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const chartType = searchParams.get('type');
    const period = searchParams.get('period') || 'weekly';

    if (!chartType) {
      return NextResponse.json({ error: 'Chart type required' }, { status: 400 });
    }

    // Try to get cached data first
    const { data: cachedData, error } = await supabase
      .from('chart_data')
      .select('data, generated_at, expires_at')
      .eq('chart_type', chartType)
      .eq('period', period)
      .gt('expires_at', new Date().toISOString())
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (cachedData && !error) {
      return NextResponse.json({
        ...cachedData.data,
        cached: true,
        generated_at: cachedData.generated_at
      });
    }

    // If no cached data, return empty response (frontend will handle fallback)
    return NextResponse.json({
      data: [],
      insights: [],
      cached: false,
      message: 'Chart data not available - will be generated soon'
    });

  } catch (error) {
    console.error('Chart data fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
}