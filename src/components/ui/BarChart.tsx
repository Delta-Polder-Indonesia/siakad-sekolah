import { useMemo } from 'react';

export interface BarItem {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarItem[];
  height?: number;
  barWidth?: number;
  maxBarWidth?: number;
  showValues?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  className?: string;
  emptyLabel?: string;
}

const DEFAULT_COLORS = [
  '#0f172a', // slate-900
  '#1e3a8a', // blue-900
  '#15803d', // green-700
  '#b91c1c', // red-700
  '#a16207', // amber-700
  '#6b21a8', // purple-700
  '#0e7490', // cyan-700
  '#be123c', // rose-700
];

export default function BarChart({
  data,
  height = 200,
  barWidth,
  maxBarWidth = 48,
  showValues = true,
  showGrid = true,
  animate = true,
  className = '',
  emptyLabel = 'Tidak ada data',
}: BarChartProps) {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  const chartData = useMemo(
    () =>
      data.map((item, idx) => ({
        ...item,
        color: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
      })),
    [data]
  );

  if (chartData.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-xs font-medium text-slate-400 ${className}`}
        style={{ height }}
      >
        {emptyLabel}
      </div>
    );
  }

  const viewWidth = chartData.length * (maxBarWidth + 20) + 20;

  return (
    <div className={`w-full ${className}`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${viewWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      >
        {/* Grid lines */}
        {showGrid &&
          [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - 20 - ratio * (height - 40);
            return (
              <g key={ratio}>
                <line
                  x1={10}
                  y1={y}
                  x2={viewWidth - 10}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text
                  x={5}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400"
                  fontSize="9"
                  fontFamily="ui-monospace, monospace"
                >
                  {Math.round(maxValue * ratio)}
                </text>
              </g>
            );
          })}

        {/* Bars */}
        {chartData.map((item, idx) => {
          const barH = (item.value / maxValue) * (height - 40) || 1;
          const x = idx * (maxBarWidth + 20) + 15;
          const y = height - 20 - barH;
          const actualBarWidth = barWidth || maxBarWidth * 0.6;
          const barX = x + (maxBarWidth - actualBarWidth) / 2;

          return (
            <g key={item.label}>
              <rect
                x={barX}
                y={animate ? height - 20 : y}
                width={actualBarWidth}
                height={animate ? 0 : barH}
                rx={3}
                ry={3}
                fill={item.color}
                opacity={0.85}
                style={
                  animate
                    ? {
                        transitionProperty: 'all',
                        transitionDuration: '0.7s',
                        transitionDelay: `${idx * 0.1}s`,
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        y,
                        height: barH,
                      }
                    : undefined
                }
              />
              {/* Value on top */}
              {showValues && (
                <text
                  x={x + maxBarWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-slate-700"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="ui-monospace, monospace"
                >
                  {item.value}
                </text>
              )}
              {/* Label below */}
              <text
                x={x + maxBarWidth / 2}
                y={height - 4}
                textAnchor="middle"
                className="fill-slate-500"
                fontSize="8"
                fontWeight="600"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Horizontal bar chart - good for comparing categories */
export function HorizontalBarChart({
  data,
  height = 180,
  barHeight = 24,
  showValues = true,
  animate = true,
  className = '',
  emptyLabel = 'Tidak ada data',
}: {
  data: BarItem[];
  height?: number;
  barHeight?: number;
  showValues?: boolean;
  animate?: boolean;
  className?: string;
  emptyLabel?: string;
}) {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  const chartData = useMemo(
    () =>
      data.map((item, idx) => ({
        ...item,
        color: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
      })),
    [data]
  );

  if (chartData.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-xs font-medium text-slate-400 ${className}`}
        style={{ height }}
      >
        {emptyLabel}
      </div>
    );
  }

  const totalHeight = chartData.length * (barHeight + 8) + 20;

  return (
    <div className={`w-full ${className}`}>
      <svg
        width="100%"
        height={Math.max(height, totalHeight)}
        viewBox={`0 0 300 ${Math.max(height, totalHeight)}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {chartData.map((item, idx) => {
          const barW = (item.value / maxValue) * 220 || 1;
          const y = idx * (barHeight + 8) + 10;

          return (
            <g key={item.label}>
              {/* Background bar */}
              <rect x={75} y={y} width={220} height={barHeight} rx={3} ry={3} fill="#f1f5f9" />
              {/* Value bar */}
              <rect
                x={75}
                y={y}
                width={animate ? 0 : barW}
                height={barHeight}
                rx={3}
                ry={3}
                fill={item.color}
                opacity={0.85}
                style={
                  animate
                    ? {
                        transitionProperty: 'width',
                        transitionDuration: '0.6s',
                        transitionDelay: `${idx * 0.08}s`,
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        width: barW,
                      }
                    : undefined
                }
              />
              {/* Label */}
              <text
                x={70}
                y={y + barHeight / 2 + 1}
                textAnchor="end"
                className="fill-slate-600"
                fontSize="10"
                fontWeight="600"
              >
                {item.label}
              </text>
              {/* Value */}
              {showValues && (
                <text
                  x={80 + barW}
                  y={y + barHeight / 2 + 1}
                  textAnchor="start"
                  className="fill-slate-700"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="ui-monospace, monospace"
                >
                  {item.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
