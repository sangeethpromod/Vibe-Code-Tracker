// app/api/chart-data/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateAllCharts } from '@/lib/chart-generator';

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { period = 'weekly' } = await req.json().catch(() => ({}));

    console.log(`Starting chart generation for period: ${period}`);

    const results = await generateAllCharts(period);

    const successCount = Object.values(results).filter(result =>
      !result.message || result.message !== 'Failed to generate'
    ).length;

    console.log(`Chart generation completed: ${successCount}/${Object.keys(results).length} successful`);

    return NextResponse.json({
      success: true,
      message: `Generated ${successCount} charts successfully`,
      results
    });

  } catch (error) {
    console.error('Chart generation failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate charts',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Also allow GET requests for manual triggering
  try {
    console.log('Starting chart generation via GET request');

    const results = await generateAllCharts('weekly');

    const successCount = Object.values(results).filter(result =>
      !result.message || result.message !== 'Failed to generate'
    ).length;

    console.log(`Chart generation completed: ${successCount}/${Object.keys(results).length} successful`);

    return NextResponse.json({
      success: true,
      message: `Generated ${successCount} charts successfully`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chart generation failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate charts',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}