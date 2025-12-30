'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SleepQualityChartProps {
  data: Array<{
    date: string;
    hours: number;
    quality: string;
    interruptions: number;
  }>;
}

export default function SleepQualityChart({ data }: SleepQualityChartProps) {
  const getBarColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return '#10B981';
      case 'good': return '#84CC16';
      case 'fair': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          stroke="#9CA3AF"
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis
          stroke="#9CA3AF"
          fontSize={12}
          domain={[0, 12]}
          label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181B',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#F3F4F6'
          }}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value: number | undefined, name: string | undefined, props: any) => [
            `${value || 0} hours (${props.payload.quality}, ${props.payload.interruptions} interruptions)`,
            'Sleep'
          ]}
        />
        <Bar
          dataKey="hours"
          fill="#3B82F6"
          radius={[2, 2, 0, 0]}
        >
          {data.map((entry, index) => (
            <Bar key={`cell-${index}`} fill={getBarColor(entry.quality)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}