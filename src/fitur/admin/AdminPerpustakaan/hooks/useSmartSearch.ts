import { useMemo } from 'react';

export type MatchType = 'prefix' | 'word-start' | 'contains';

interface SearchableItem {
  id: string;
  name?: string;
  nis?: string;
  title?: string;
  author?: string;
}

interface SearchResult<T> {
  item: T;
  matchType: MatchType;
  score: number;
  matchField?: 'name' | 'nis' | 'title' | 'author' | 'id';
}

export function useSmartMemberSearch<T extends SearchableItem>(
  items: T[],
  searchQuery: string,
  options?: {
    filter?: (item: T) => boolean;
    limit?: number;
  }
) {
  return useMemo(() => {
    const { filter, limit = 30 } = options || {};
    const sourceItems = filter ? items.filter(filter) : items;

    if (!searchQuery.trim()) {
      return sourceItems.slice(0, limit).map((s) => ({
        item: s,
        matchType: 'prefix' as MatchType,
        matchField: 'name' as const,
      }));
    }

    const q = searchQuery.toLowerCase().trim();
    const queryWords = q.split(/\s+/);
    const results: SearchResult<T>[] = [];

    sourceItems.forEach((item) => {
      const nameLower = (item.name || '').toLowerCase();
      const nisLower = (item.nis || '').toLowerCase();
      const nameWords = nameLower.split(/\s+/);

      let score = 0;
      let matched = false;
      let matchType: MatchType = 'contains';
      let matchField: 'name' | 'nis' = 'name';

      if (nisLower.startsWith(q)) {
        score = 900;
        matchType = 'prefix';
        matchField = 'nis';
        matched = true;
      } else if (nisLower.includes(q)) {
        score = 200;
        matchType = 'contains';
        matchField = 'nis';
        matched = true;
      }

      let allWordsMatch = true;
      let nameScore = 0;
      const usedWordIndices = new Set<number>();

      for (const qWord of queryWords) {
        let wordMatched = false;
        for (let i = 0; i < nameWords.length; i++) {
          if (!usedWordIndices.has(i) && nameWords[i].startsWith(qWord)) {
            wordMatched = true;
            usedWordIndices.add(i);
            nameScore +=
              (nameWords.length - i) * 10 + (qWord.length / Math.max(nameWords[i].length, 1)) * 5;
            break;
          }
        }
        if (!wordMatched) {
          allWordsMatch = false;
          break;
        }
      }

      if (allWordsMatch) {
        if (nameLower.startsWith(q)) {
          score = Math.max(score, 1000 + nameScore);
          matchType = 'prefix';
        } else {
          score = Math.max(score, 500 + nameScore);
          if (matchType !== 'prefix') matchType = 'word-start';
        }
        matched = true;
      } else if (!matched && nameLower.includes(q)) {
        score = Math.max(score, 100 - nameLower.indexOf(q));
        matchType = 'contains';
        matched = true;
      }

      if (matched) results.push({ item, matchType, score, matchField });
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map((r) => ({
      item: r.item,
      matchType: r.matchType,
      matchField: r.matchField,
    }));
  }, [items, searchQuery, options]);
}

export function useSmartBookSearch<T extends SearchableItem & { available: number }>(
  items: T[],
  searchQuery: string,
  options?: {
    excludeIds?: string[];
    limit?: number;
  }
) {
  return useMemo(() => {
    const { excludeIds = [], limit = 30 } = options || {};
    const alreadySelected = new Set(excludeIds);

    if (!searchQuery.trim()) {
      return items
        .filter((b) => b.available > 0 && !alreadySelected.has(b.id))
        .slice(0, limit)
        .map((b) => ({
          item: b,
          matchType: 'prefix' as MatchType,
          matchField: 'title' as const,
        }));
    }

    const q = searchQuery.toLowerCase().trim();
    const queryWords = q.split(/\s+/);
    const results: (SearchResult<T> & { matchField: 'title' | 'author' | 'id' })[] = [];

    items.forEach((b) => {
      if (b.available <= 0 || alreadySelected.has(b.id)) return;

      const titleLower = (b.title || '').toLowerCase();
      const authorLower = (b.author || '').toLowerCase();
      const idLower = b.id.toLowerCase();

      let bestScore = 0;
      let bestMatchType: MatchType = 'contains';
      let bestMatchField: 'title' | 'author' | 'id' = 'title';

      const titleWords = titleLower.split(/\s+/);
      let allTitleWordsMatch = true;
      let titleScore = 0;
      const usedTitleIndices = new Set<number>();
      for (const qWord of queryWords) {
        let wm = false;
        for (let i = 0; i < titleWords.length; i++) {
          if (!usedTitleIndices.has(i) && titleWords[i].startsWith(qWord)) {
            wm = true;
            usedTitleIndices.add(i);
            titleScore +=
              (titleWords.length - i) * 10 + (qWord.length / Math.max(titleWords[i].length, 1)) * 5;
            break;
          }
        }
        if (!wm) {
          allTitleWordsMatch = false;
          break;
        }
      }
      if (allTitleWordsMatch) {
        bestScore = titleLower.startsWith(q) ? 1000 + titleScore : 500 + titleScore;
        bestMatchType = titleLower.startsWith(q) ? 'prefix' : 'word-start';
        bestMatchField = 'title';
      } else if (titleLower.includes(q)) {
        bestScore = 100 - titleLower.indexOf(q);
        bestMatchType = 'contains';
        bestMatchField = 'title';
      }

      const authorWords = authorLower.split(/\s+/);
      let allAuthorWordsMatch = true;
      let authorScore = 0;
      const usedAuthorIndices = new Set<number>();
      for (const qWord of queryWords) {
        let wm = false;
        for (let i = 0; i < authorWords.length; i++) {
          if (!usedAuthorIndices.has(i) && authorWords[i].startsWith(qWord)) {
            wm = true;
            usedAuthorIndices.add(i);
            authorScore +=
              (authorWords.length - i) * 10 +
              (qWord.length / Math.max(authorWords[i].length, 1)) * 5;
            break;
          }
        }
        if (!wm) {
          allAuthorWordsMatch = false;
          break;
        }
      }
      if (allAuthorWordsMatch) {
        const aScore = authorLower.startsWith(q) ? 800 + authorScore : 400 + authorScore;
        if (aScore > bestScore) {
          bestScore = aScore;
          bestMatchType = authorLower.startsWith(q) ? 'prefix' : 'word-start';
          bestMatchField = 'author';
        }
      } else if (authorLower.includes(q)) {
        const aScore = 80 - authorLower.indexOf(q);
        if (aScore > bestScore) {
          bestScore = aScore;
          bestMatchType = 'contains';
          bestMatchField = 'author';
        }
      }

      if (idLower.startsWith(q)) {
        if (700 > bestScore) {
          bestScore = 700;
          bestMatchType = 'prefix';
          bestMatchField = 'id';
        }
      } else if (idLower.includes(q)) {
        if (150 > bestScore) {
          bestScore = 150;
          bestMatchType = 'contains';
          bestMatchField = 'id';
        }
      }

      if (bestScore > 0) {
        results.push({
          item: b,
          matchType: bestMatchType,
          score: bestScore,
          matchField: bestMatchField,
        });
      }
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map((r) => ({
      item: r.item,
      matchType: r.matchType,
      matchField: r.matchField,
    }));
  }, [items, searchQuery, options]);
}
