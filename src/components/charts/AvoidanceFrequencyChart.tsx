'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AvoidanceFrequencyChartProps {
  data: Array<{
    date: string;
    avoidance_count: number;
    triggers: string[];
    coping_strategies: string[];
  }>;
}

export default function AvoidanceFrequencyChart({ data }: AvoidanceFrequencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
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
          label={{ value: 'Avoidance Events', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
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
            `${value || 0} events`,
            'Avoidance'
          ]}
        />
        <Area
          type="monotone"
          dataKey="avoidance_count"
          stroke="#F97316"
          fill="#F97316"
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}