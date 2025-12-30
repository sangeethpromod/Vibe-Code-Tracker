// app/api/chart-data/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getChartData } from '@/lib/chart-generator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chartType = searchParams.get('type');
    const period = searchParams.get('period') || 'weekly';

    if (!chartType) {
      return NextResponse.json({ error: 'Chart type required' }, { status: 400 });
    }

    // Get chart data (from cache or generate new)
    const chartData = await getChartData(chartType, period);

    return NextResponse.json(chartData);

  } catch (error) {
    console.error('Chart data fetch error:', error);
    return NextResponse.json({
      data: [],
      insights: [],
      message: 'Failed to load chart data'
    }, { status: 500 });
  }
}