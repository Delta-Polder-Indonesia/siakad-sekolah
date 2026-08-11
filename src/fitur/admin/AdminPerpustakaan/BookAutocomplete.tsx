import { useRef, useEffect, useState } from 'react';
import { Search, X, BookOpen, PenLine, Plus } from 'lucide-react';
import { useSmartBookSearch } from './hooks/useSmartSearch';
import { highlightMatch } from './utils/highlightMatch';

interface Book {
  id: string;
  title: string;
  author: string;
  available: number;
  coverImage?: string;
}

interface BookAutocompleteProps {
  books: Book[];
  selectedId: string;
  excludeIds?: string[];
  onSelect: (book: Book) => void;
  onClear: () => void;
  onAdd: () => void;
  placeholder?: string;
}

export function BookAutocomplete({
  books,
  selectedId,
  excludeIds = [],
  onSelect,
  onClear,
  onAdd,
  placeholder = 'Ketik judul buku, pengarang, atau ID buku...',
}: BookAutocompleteProps) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useSmartBookSearch(books, search, { excludeIds, limit: 30 });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (query: string) => {
    setSearch(query);
    onClear();
    setShowDropdown(true);
  };

  const handleSelect = (book: Book) => {
    onSelect(book);
    setSearch(book.title);
    setShowDropdown(false);
  };

  return (
    <div className="flex gap-2" ref={dropdownRef}>
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-black/50" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className={`w-full rounded-md border-2 bg-white py-2 pr-8 pl-9 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50 ${
            selectedId ? 'border-emerald-600' : 'border-black'
          }`}
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              onClear();
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-black/50 transition-colors hover:text-black"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {showDropdown && !selectedId && (
          <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border-2 border-black bg-white">
            {filtered.length > 0 ? (
              <>
                <div className="sticky top-0 z-10 border-b-2 border-black bg-neutral-50 px-3 py-1.5">
                  <p className="text-[10px] font-bold text-black/70">
                    {search.trim() ? (
                      <>
                        Menampilkan <strong>{filtered.length}</strong> buku untuk &quot;
                        <strong>{search}</strong>&quot;
                      </>
                    ) : (
                      <>
                        Ketik untuk mencari atau pilih dari daftar ({filtered.length} ditampilkan)
                      </>
                    )}
                  </p>
                </div>
                {filtered.map(({ item: book, matchType, matchField }) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => handleSelect(book)}
                    className={`flex w-full items-center gap-3 border-b-2 border-black/10 px-3 py-2.5 text-left text-xs transition last:border-0 hover:bg-neutral-100 ${
                      matchType === 'prefix' ? 'bg-neutral-50' : ''
                    }`}
                  >
                    <div className="flex h-12 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-black bg-white">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt="" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-black/40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-black">
                        {highlightMatch(book.title, search)}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <PenLine className="h-3 w-3 flex-shrink-0 text-black/40" />
                        <span className="truncate text-[10px] font-bold text-black/60">
                          {matchField === 'author'
                            ? highlightMatch(book.author, search)
                            : book.author}
                        </span>
                        {matchField === 'id' && (
                          <span className="ml-1 font-mono text-[10px] font-bold text-black/40">
                            • ID: {highlightMatch(book.id, search)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${
                          book.available <= 2
                            ? 'border-rose-600 bg-white text-rose-600'
                            : book.available <= 5
                              ? 'border-amber-600 bg-white text-amber-600'
                              : 'border-emerald-600 bg-white text-emerald-600'
                        }`}
                      >
                        Sisa: {book.available}
                      </span>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="p-4 text-center">
                <BookOpen className="mx-auto mb-2 h-8 w-8 text-black/30" />
                <p className="text-xs font-bold text-black/70">
                  Tidak ditemukan buku untuk &quot;{search}&quot;
                </p>
                <p className="mt-1 text-[10px] font-bold text-black/40">
                  Coba ketik huruf awal judul atau nama pengarang
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <button type="button"
        onClick={onAdd}
        disabled={!selectedId}
        className="flex items-center gap-1.5 rounded-md border-2 border-black bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-900 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black/40"
      >
        <Plus className="h-3.5 w-3.5" />
        TAMBAH
      </button>
    </div>
  );
}
