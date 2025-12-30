'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import chart components to avoid SSR issues
const EntryVolumeChart = dynamic(() => import('./charts/EntryVolumeChart'), { ssr: false });
const EnergyTimelineChart = dynamic(() => import('./charts/EnergyTimelineChart'), { ssr: false });
const CategoryDistributionChart = dynamic(() => import('./charts/CategoryDistributionChart'), { ssr: false });
const EntryTypePieChart = dynamic(() => import('./charts/EntryTypePieChart'), { ssr: false });
const WeeklyCategoryHeatmap = dynamic(() => import('./charts/WeeklyCategoryHeatmap'), { ssr: false });
const SleepQualityChart = dynamic(() => import('./charts/SleepQualityChart'), { ssr: false });
const WorkoutFrequencyChart = dynamic(() => import('./charts/WorkoutFrequencyChart'), { ssr: false });
const AvoidanceFrequencyChart = dynamic(() => import('./charts/AvoidanceFrequencyChart'), { ssr: false });
const ProductivityFocusChart = dynamic(() => import('./charts/ProductivityFocusChart'), { ssr: false });
const FinancialTrackingChart = dynamic(() => import('./charts/FinancialTrackingChart'), { ssr: false });
const LoggingConsistencyChart = dynamic(() => import('./charts/LoggingConsistencyChart'), { ssr: false });

interface ChartData {
  data: any[];
  insights: string[];
  cached?: boolean;
  generated_at?: string;
  message?: string;
}

export default function DashboardCharts() {
  const [chartsData, setChartsData] = useState<Record<string, ChartData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCharts = async () => {
      const chartTypes = [
        'entry_volume',
        'energy_timeline',
        'category_distribution',
        'entry_type_pie',
        'weekly_category_heatmap',
        'sleep_quality',
        'workout_frequency',
        'avoidance_frequency',
        'productivity_focus',
        'financial_tracking',
        'logging_consistency'
      ];

      const chartPromises = chartTypes.map(async (type) => {
        try {
          const response = await fetch(`/api/chart-data?type=${type}&period=weekly`);
          const data = await response.json();
          return { type, data };
        } catch (error) {
          console.error(`Failed to fetch ${type} chart:`, error);
          return { type, data: { data: [], insights: [], message: 'Failed to load' } };
        }
      });

      const results = await Promise.all(chartPromises);
      const chartDataMap: Record<string, ChartData> = {};

      results.forEach(({ type, data }) => {
        chartDataMap[type] = data;
      });

      setChartsData(chartDataMap);
      setLoading(false);
    };

    fetchAllCharts();
  }, []);

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">📊 Personal Board of Directors Dashboard</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse">
              <div className="h-4 bg-zinc-700 rounded mb-4"></div>
              <div className="h-32 bg-zinc-700 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">📊 Personal Board of Directors Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time-Based Trends */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Entry Volume Over Time</h3>
          <EntryVolumeChart data={chartsData.entry_volume?.data || []} />
          {chartsData.entry_volume?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Energy Timeline</h3>
          <EnergyTimelineChart data={chartsData.energy_timeline?.data || []} />
          {chartsData.energy_timeline?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Entry Type Distribution</h3>
          <CategoryDistributionChart data={chartsData.category_distribution?.data || []} />
          {chartsData.category_distribution?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Entry Types Breakdown</h3>
          <EntryTypePieChart data={chartsData.entry_type_pie?.data || []} />
          {chartsData.entry_type_pie?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>

        {/* Health & Wellbeing */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Sleep Quality Tracker</h3>
          <SleepQualityChart data={chartsData.sleep_quality?.data || []} />
          {chartsData.sleep_quality?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Workout Frequency</h3>
          <WorkoutFrequencyChart data={chartsData.workout_frequency?.data || []} />
          {chartsData.workout_frequency?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>

        {/* Behavioral Patterns */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Avoidance by Day of Week</h3>
          <AvoidanceFrequencyChart data={chartsData.avoidance_frequency?.data || []} />
          {chartsData.avoidance_frequency?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Focus vs Distraction</h3>
          <ProductivityFocusChart data={chartsData.productivity_focus?.data || []} />
          {chartsData.productivity_focus?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>

        {/* Financial & Meta */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Money Wasted Over Time</h3>
          <FinancialTrackingChart data={chartsData.financial_tracking?.data || []} />
          {chartsData.financial_tracking?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Logging Consistency</h3>
          <LoggingConsistencyChart data={chartsData.logging_consistency?.data || []} />
          {chartsData.logging_consistency?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>

        {/* Weekly Category Heatmap - Full Width */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Weekly Category Heatmap</h3>
          <WeeklyCategoryHeatmap data={chartsData.weekly_category_heatmap?.data || []} />
          {chartsData.weekly_category_heatmap?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
        </div>
      </div>
    </section>
  );
}