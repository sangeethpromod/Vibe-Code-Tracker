'use client';

import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinancialTrackingChartProps {
  data: Array<{
    date: string;
    income: number;
    expenses: number;
    savings: number;
    net: number;
  }>;
}

export default function FinancialTrackingChart({ data }: FinancialTrackingChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data}>
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
          label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181B',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#F3F4F6'
          }}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value: number | undefined, name: string | undefined) => [
            `$${value?.toLocaleString() || '0'}`,
            name || ''
          ]}
        />
        <Bar dataKey="income" fill="#10B981" name="Income" />
        <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
        <Line
          type="monotone"
          dataKey="net"
          stroke="#3B82F6"
          strokeWidth={3}
          name="Net"
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}