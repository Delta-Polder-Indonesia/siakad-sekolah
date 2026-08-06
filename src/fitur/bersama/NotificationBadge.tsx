interface NotificationBadgeProps {
  count: number;
  className?: string;
  /** Show as a small dot instead of number (for collapsed sidebar) */
  dot?: boolean;
}

export default function NotificationBadge({
  count,
  className = '',
  dot = false,
}: NotificationBadgeProps) {
  if (count <= 0) return null;

  if (dot) {
    return (
      <span
        className={`animate-pulse-glow absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white ${className}`}
      />
    );
  }

  return (
    <span
      className={`animate-scale-in inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] leading-none font-bold text-white shadow-sm ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
