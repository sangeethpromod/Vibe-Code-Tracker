'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WorkoutFrequencyChartProps {
  data: Array<{
    date: string;
    workouts: number;
    duration: number;
    intensity: string;
  }>;
}

export default function WorkoutFrequencyChart({ data }: WorkoutFrequencyChartProps) {
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

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
        <YAxis
          stroke="#9CA3AF"
          fontSize={12}
          label={{ value: 'Workouts', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
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
            `${value || 0} workouts (${props.payload.duration} min, ${props.payload.intensity} intensity)`,
            'Workouts'
          ]}
        />
        <Line
          type="monotone"
          dataKey="workouts"
          stroke="#8B5CF6"
          strokeWidth={3}
          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}