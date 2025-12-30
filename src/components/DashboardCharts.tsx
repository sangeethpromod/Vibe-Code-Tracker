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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  insights: string[];
  cached?: boolean;
  generated_at?: string;
  message?: string;
}

export default function DashboardCharts() {
  const [chartsData, setChartsData] = useState<Record<string, ChartData>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchAllCharts = async (forceRefresh = false) => {
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
        const url = forceRefresh
          ? `/api/chart-data/generate?type=${type}&period=weekly`
          : `/api/chart-data?type=${type}&period=weekly`;
        const response = await fetch(url);
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
    setLastUpdated(new Date().toLocaleString());
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllCharts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllCharts(true);
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📊 Personal Board of Directors Dashboard</h2>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-400">
              Last updated: {lastUpdated}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Refreshing...
              </>
            ) : (
              <>
                🔄 Refresh Charts
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time-Based Trends */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Entry Volume Over Time</h3>
            {chartsData.entry_volume?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.entry_volume.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.entry_volume.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <EntryVolumeChart data={chartsData.entry_volume?.data || []} />
          {chartsData.entry_volume?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.entry_volume?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.entry_volume.generated_at).toLocaleString()}
            </p>
          )}
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Energy Timeline</h3>
            {chartsData.energy_timeline?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.energy_timeline.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.energy_timeline.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <EnergyTimelineChart data={chartsData.energy_timeline?.data || []} />
          {chartsData.energy_timeline?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.energy_timeline?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.energy_timeline.generated_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Entry Type Distribution</h3>
            {chartsData.category_distribution?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.category_distribution.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.category_distribution.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <CategoryDistributionChart data={chartsData.category_distribution?.data || []} />
          {chartsData.category_distribution?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.category_distribution?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.category_distribution.generated_at).toLocaleString()}
            </p>
          )}
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Entry Types Breakdown</h3>
            {chartsData.entry_type_pie?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.entry_type_pie.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.entry_type_pie.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <EntryTypePieChart data={chartsData.entry_type_pie?.data || []} />
          {chartsData.entry_type_pie?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.entry_type_pie?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.entry_type_pie.generated_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* Health & Wellbeing */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sleep Quality Tracker</h3>
            {chartsData.sleep_quality?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.sleep_quality.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.sleep_quality.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <SleepQualityChart data={chartsData.sleep_quality?.data || []} />
          {chartsData.sleep_quality?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.sleep_quality?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.sleep_quality.generated_at).toLocaleString()}
            </p>
          )}
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Workout Frequency</h3>
            {chartsData.workout_frequency?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.workout_frequency.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.workout_frequency.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <WorkoutFrequencyChart data={chartsData.workout_frequency?.data || []} />
          {chartsData.workout_frequency?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.workout_frequency?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.workout_frequency.generated_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* Behavioral Patterns */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Avoidance by Day of Week</h3>
            {chartsData.avoidance_frequency?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.avoidance_frequency.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.avoidance_frequency.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <AvoidanceFrequencyChart data={chartsData.avoidance_frequency?.data || []} />
          {chartsData.avoidance_frequency?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.avoidance_frequency?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.avoidance_frequency.generated_at).toLocaleString()}
            </p>
          )}
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Focus vs Distraction</h3>
            {chartsData.productivity_focus?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.productivity_focus.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.productivity_focus.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <ProductivityFocusChart data={chartsData.productivity_focus?.data || []} />
          {chartsData.productivity_focus?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.productivity_focus?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.productivity_focus.generated_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* Financial & Meta */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Money Wasted Over Time</h3>
            {chartsData.financial_tracking?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.financial_tracking.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.financial_tracking.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <FinancialTrackingChart data={chartsData.financial_tracking?.data || []} />
          {chartsData.financial_tracking?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.financial_tracking?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.financial_tracking.generated_at).toLocaleString()}
            </p>
          )}
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Logging Consistency</h3>
            {chartsData.logging_consistency?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.logging_consistency.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.logging_consistency.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <LoggingConsistencyChart data={chartsData.logging_consistency?.data || []} />
          {chartsData.logging_consistency?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.logging_consistency?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.logging_consistency.generated_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* Weekly Category Heatmap - Full Width */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Weekly Category Heatmap</h3>
            {chartsData.weekly_category_heatmap?.cached !== undefined && (
              <span className={`text-xs px-2 py-1 rounded ${
                chartsData.weekly_category_heatmap.cached
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {chartsData.weekly_category_heatmap.cached ? 'Cached' : 'Fresh'}
              </span>
            )}
          </div>
          <WeeklyCategoryHeatmap data={chartsData.weekly_category_heatmap?.data || []} />
          {chartsData.weekly_category_heatmap?.insights?.map((insight, i) => (
            <p key={i} className="text-sm text-gray-400 mt-2">• {insight}</p>
          ))}
          {chartsData.weekly_category_heatmap?.generated_at && (
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(chartsData.weekly_category_heatmap.generated_at).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}