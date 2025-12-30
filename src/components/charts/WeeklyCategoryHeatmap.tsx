'use client';

interface WeeklyCategoryHeatmapProps {
  data: Array<{
    day: string;
    category: string;
    intensity: number;
  }>;
}

export default function WeeklyCategoryHeatmap({ data }: WeeklyCategoryHeatmapProps) {
  // Transform data for heatmap
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const categories = [...new Set(data.map(d => d.category))];

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return '#1F2937';
    if (intensity <= 2) return '#DCFCE7';
    if (intensity <= 4) return '#BBF7D0';
    if (intensity <= 6) return '#86EFAC';
    if (intensity <= 8) return '#4ADE80';
    return '#22C55E';
  };

  const getTextColor = (intensity: number) => {
    return intensity > 4 ? '#FFFFFF' : '#374151';
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full">
        {/* Header row */}
        <div className="flex">
          <div className="w-16 flex-shrink-0"></div>
          {categories.map(category => (
            <div key={category} className="flex-1 text-center text-xs text-gray-400 py-2 px-1 min-w-0 truncate">
              {category}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {days.map(day => (
          <div key={day} className="flex">
            <div className="w-16 flex-shrink-0 text-xs text-gray-400 py-2 px-2 flex items-center">
              {day}
            </div>
            {categories.map(category => {
              const entry = data.find(d => d.day === day && d.category === category);
              const intensity = entry ? entry.intensity : 0;

              return (
                <div
                  key={`${day}-${category}`}
                  className="flex-1 text-center text-xs py-2 px-1 min-w-0 flex items-center justify-center"
                  style={{
                    backgroundColor: getIntensityColor(intensity),
                    color: getTextColor(intensity),
                  }}
                >
                  {intensity > 0 ? intensity : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}