'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface EntryTypePieChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

const COLORS = {
  wins: '#10B981',
  problems: '#EF4444',
  money: '#3B82F6',
  avoidance: '#F59E0B',
  energy: '#8B5CF6',
  mood: '#EC4899',
  sleep: '#06B6D4',
  workout: '#84CC16',
  food: '#F97316',
  substance: '#DC2626',
  connection: '#6366F1',
  conflict: '#7C3AED',
  focus: '#14B8A6',
  distraction: '#F43F5E',
  procrastination: '#92400E',
  learn: '#65A30D',
  insight: '#0891B2'
};

export default function EntryTypePieChart({ data }: EntryTypePieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name as keyof typeof COLORS] || '#6B7280'}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181B',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#F3F4F6'
          }}
          formatter={(value: number | undefined, name: string | undefined) => [
            `${value || 0} entries (${data.find(d => d.name === name)?.percentage}%)`,
            (name || '').charAt(0).toUpperCase() + (name || '').slice(1)
          ]}
        />
        <Legend
          formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}