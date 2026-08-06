import React from 'react';

export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return <>{text}</>;

  const q = query.toLowerCase().trim();
  const queryWords = q.split(/\s+/);
  const textLower = text.toLowerCase();

  const highlights: { start: number; end: number }[] = [];

  for (const qWord of queryWords) {
    const wordRegex = /\S+/g;
    let match;
    while ((match = wordRegex.exec(textLower)) !== null) {
      if (match[0].startsWith(qWord)) {
        highlights.push({ start: match.index, end: match.index + qWord.length });
      }
    }
  }

  if (highlights.length === 0) {
    const idx = textLower.indexOf(q);
    if (idx >= 0) {
      highlights.push({ start: idx, end: idx + q.length });
    }
  }

  if (highlights.length === 0) return <>{text}</>;

  highlights.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  for (const h of highlights) {
    if (merged.length > 0 && h.start <= merged[merged.length - 1].end) {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, h.end);
    } else {
      merged.push({ ...h });
    }
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  merged.forEach((h, i) => {
    if (h.start > lastIndex) {
      parts.push(<span key={`t-${i}`}>{text.slice(lastIndex, h.start)}</span>);
    }
    parts.push(
      <span key={`h-${i}`} className="rounded bg-yellow-200 px-0.5 font-bold text-yellow-900">
        {text.slice(h.start, h.end)}
      </span>
    );
    lastIndex = h.end;
  });
  if (lastIndex < text.length) {
    parts.push(<span key="last">{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
}
