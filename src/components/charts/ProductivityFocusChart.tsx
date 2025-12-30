'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface ProductivityFocusChartProps {
  data: Array<{
    focus_area: string;
    score: number;
    hours: number;
    distractions: number;
  }>;
}

export default function ProductivityFocusChart({ data }: ProductivityFocusChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis
          dataKey="focus_area"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          className="text-xs"
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
        />
        <Radar
          name="Productivity Score"
          dataKey="score"
          stroke="#06B6D4"
          fill="#06B6D4"
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}