'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EntryVolumeChartProps {
  data: Array<{
    date: string;
    total: number;
    wins?: number;
    problems?: number;
    money?: number;
    avoidance?: number;
  }>;
}

export default function EntryVolumeChart({ data }: EntryVolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="date"
          stroke="#9CA3AF"
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181B',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#F3F4F6'
          }}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#F59E0B"
          strokeWidth={3}
          name="Total Entries"
          dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="wins"
          stroke="#10B981"
          strokeWidth={2}
          name="Wins"
          dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="problems"
          stroke="#EF4444"
          strokeWidth={2}
          name="Problems"
          dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}