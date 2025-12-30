'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CategoryDistributionChartProps {
  data: Array<{
    date: string;
    wins: number;
    problems: number;
    money: number;
    avoidance: number;
    energy: number;
    workout: number;
  }>;
}

export default function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
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
        <Area
          type="monotone"
          dataKey="wins"
          stackId="1"
          stroke="#10B981"
          fill="#10B981"
          fillOpacity={0.6}
          name="Wins"
        />
        <Area
          type="monotone"
          dataKey="problems"
          stackId="1"
          stroke="#EF4444"
          fill="#EF4444"
          fillOpacity={0.6}
          name="Problems"
        />
        <Area
          type="monotone"
          dataKey="avoidance"
          stackId="1"
          stroke="#F59E0B"
          fill="#F59E0B"
          fillOpacity={0.6}
          name="Avoidance"
        />
        <Area
          type="monotone"
          dataKey="energy"
          stackId="1"
          stroke="#8B5CF6"
          fill="#8B5CF6"
          fillOpacity={0.6}
          name="Energy"
        />
        <Area
          type="monotone"
          dataKey="workout"
          stackId="1"
          stroke="#84CC16"
          fill="#84CC16"
          fillOpacity={0.6}
          name="Workouts"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}