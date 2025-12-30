'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

interface EnergyTimelineChartProps {
  data: Array<{
    date: string;
    energy: number;
    moving_average: number;
    zone: string;
  }>;
}

export default function EnergyTimelineChart({ data }: EnergyTimelineChartProps) {
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
          domain={[1, 10]}
          stroke="#9CA3AF"
          fontSize={12}
          ticks={[1, 3, 5, 7, 9]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181B',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#F3F4F6'
          }}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
        />

        {/* Reference areas for energy zones */}
        <ReferenceArea y1={1} y2={3} fill="#DC2626" fillOpacity={0.1} label="Crisis" />
        <ReferenceArea y1={3} y2={5} fill="#F59E0B" fillOpacity={0.1} label="Low" />
        <ReferenceArea y1={5} y2={8} fill="#10B981" fillOpacity={0.1} label="Normal" />
        <ReferenceArea y1={8} y2={10} fill="#3B82F6" fillOpacity={0.1} label="Peak" />

        <Line
          type="monotone"
          dataKey="energy"
          stroke="#F59E0B"
          strokeWidth={3}
          name="Daily Energy"
          dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="moving_average"
          stroke="#8B5CF6"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="7-Day Average"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}