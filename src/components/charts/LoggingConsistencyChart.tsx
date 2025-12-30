'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LoggingConsistencyChartProps {
  data: Array<{
    date: string;
    entries: number;
    consistency_score: number;
    streak_days: number;
  }>;
}

export default function LoggingConsistencyChart({ data }: LoggingConsistencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ScatterChart data={data}>
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
          domain={[0, 100]}
          label={{ value: 'Consistency Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181B',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#F3F4F6'
          }}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: number | undefined, name: string | undefined, props: any) => [
            `${value || 0}% (${props.payload.entries} entries, ${props.payload.streak_days} day streak)`,
            'Consistency'
          ]}
        />
        <Scatter
          dataKey="consistency_score"
          fill="#8B5CF6"
          name="Consistency Score"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}