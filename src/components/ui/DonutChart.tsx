import { useMemo } from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
  centerLabel?: string;
  centerSubLabel?: string;
  className?: string;
}

export default function DonutChart({
  segments,
  size = 160,
  strokeWidth = 24,
  animate = true,
  centerLabel,
  centerSubLabel,
  className = '',
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const total = useMemo(() => segments.reduce((sum, s) => sum + s.value, 0), [segments]);

  const arcs = useMemo(() => {
    if (total === 0) return [];
    let offset = 0;
    return segments.map((seg) => {
      const length = (seg.value / total) * circumference;
      const arc = { ...seg, length, offset, circumference, radius };
      offset += length;
      return arc;
    });
  }, [segments, total, circumference, radius]);

  if (total === 0) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-slate-400">0</span>
          {centerSubLabel && (
            <span className="text-[10px] font-medium text-slate-400">{centerSubLabel}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={center}
            cy={center}
            r={arc.radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.length} ${arc.circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            className={animate ? 'transition-all duration-1000 ease-out' : ''}
            style={animate ? { strokeDasharray: `${arc.length} ${arc.circumference}` } : undefined}
          />
        ))}
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
      </svg>
      {centerLabel !== undefined && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{centerLabel}</span>
          {centerSubLabel && (
            <span className="mt-0.5 text-[10px] font-semibold text-slate-500">
              {centerSubLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** Mini donut — compact version for card headers */
export function MiniDonut({
  segments,
  size = 48,
  strokeWidth = 6,
}: {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
}) {
  return <DonutChart segments={segments} size={size} strokeWidth={strokeWidth} animate={false} />;
}
