// src/fitur/perpustakaan/pages/KatalogPage.tsx
import { useMemo, useCallback, useId, useEffect } from 'react';
import { Search, Filter, CalendarDays, X, BookX } from 'lucide-react';
import type { Book, LibraryTransaction } from '../../../types';
import BookCard from '../components/BookCard';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** ISO date string lokal hari ini: YYYY-MM-DD */
const getTodayISO = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface KatalogPageProps {
  books: Book[];
  studentHistory: LibraryTransaction[];
  searchQuery: string;
  selectedCategory: string;
  borrowDate: string;
  dueDate: string;
  cart: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBorrowDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onToggleCart: (bookId: string) => void;
  onBorrow: (bookId: string, title: string) => void;
  onShowDetail: (book: Book) => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const EmptyState: React.FC<{ hasQuery: boolean; onReset: () => void }> = ({
  hasQuery,
  onReset,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
      <BookX className="h-7 w-7 text-neutral-300" aria-hidden="true" />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-semibold text-neutral-500">Koleksi Tidak Ditemukan</p>
      <p className="text-xs text-neutral-400">
        Tidak ada koleksi literatur yang cocok dengan kriteria pencarian.
      </p>
    </div>
    {hasQuery && (
      <button type="button"
        onClick={onReset}
        className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none"
      >
        <X className="h-3 w-3" aria-hidden="true" />
        Reset Pencarian
      </button>
    )}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function KatalogPage({
  books,
  studentHistory,
  searchQuery,
  selectedCategory,
  borrowDate,
  dueDate,
  cart,
  onSearchChange,
  onCategoryChange,
  onBorrowDateChange,
  onDueDateChange,
  onToggleCart,
  onBorrow,
  onShowDetail,
}: KatalogPageProps) {
  const uid = useId();
  const searchId = `${uid}-search`;
  const borrowId = `${uid}-borrow-date`;
  const dueId = `${uid}-due-date`;

  // ── Derived data ───────────────────────────────────────────────────────────

  const categories = useMemo(
    () => [
      'Semua',
      ...[...new Set(books.map((b) => b.category))].sort((a, b) => a.localeCompare(b, 'id')),
    ],
    [books]
  );

  const filteredBooks = useMemo(
    () =>
      books.filter((book) => {
        const q = searchQuery.toLowerCase();
        const matchSearch =
          book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
        const matchCategory = selectedCategory === 'Semua' || book.category === selectedCategory;
        return matchSearch && matchCategory;
      }),
    [books, searchQuery, selectedCategory]
  );

  const { waitingSet, borrowedSet } = useMemo(() => {
    const waiting = new Set<string>();
    const borrowed = new Set<string>();
    studentHistory.forEach((h) => {
      if (h.status === 'menunggu') waiting.add(h.bookId);
      if (h.status === 'dipinjam') borrowed.add(h.bookId);
    });
    return { waitingSet: waiting, borrowedSet: borrowed };
  }, [studentHistory]);

  const cartSet = useMemo(() => new Set(cart), [cart]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    onSearchChange('');
    onCategoryChange('Semua');
  }, [onSearchChange, onCategoryChange]);

  // Sinkronisasi validasi tanggal kembali
  useEffect(() => {
    if (borrowDate && dueDate && dueDate < borrowDate) {
      onDueDateChange(borrowDate);
    }
  }, [borrowDate, dueDate, onDueDateChange]);

  const handleBorrowDateChange = useCallback(
    (value: string) => {
      onBorrowDateChange(value);
      if (dueDate < value) onDueDateChange(value);
    },
    [dueDate, onBorrowDateChange, onDueDateChange]
  );

  const hasActiveFilter = searchQuery.trim() !== '' || selectedCategory !== 'Semua';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* ── Filter Kategori ── */}
      <div
        role="group"
        aria-label="Filter kategori buku"
        className="flex items-center gap-1.5 overflow-x-auto border-b border-neutral-100 py-1 pr-2"
      >
        <span
          className="mr-2 flex shrink-0 items-center gap-1 text-[11px] font-bold tracking-wider text-neutral-400 uppercase"
          aria-hidden="true"
        >
          <Filter className="h-3 w-3" aria-hidden="true" />
          Bidang:
        </span>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button type="button"
              key={cat}
              onClick={() => onCategoryChange(cat)}
              aria-pressed={isActive}
              className={[
                'shrink-0 rounded-lg border px-3 py-1 text-xs font-medium transition',
                'focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none',
                isActive
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50',
              ].join(' ')}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Pengaturan Tanggal ── */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-neutral-500" aria-hidden="true" />
          <h3 className="text-xs font-bold tracking-tight text-neutral-800 uppercase">
            Pengaturan Tanggal Peminjaman
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={borrowId}
              className="mb-1 block text-[10px] font-bold text-neutral-500 uppercase"
            >
              Tanggal Pinjam
            </label>
            <input
              id={borrowId}
              type="date"
              value={borrowDate}
              onChange={(e) => handleBorrowDateChange(e.target.value)}
              min={getTodayISO()}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs transition outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label
              htmlFor={dueId}
              className="mb-1 block text-[10px] font-bold text-neutral-500 uppercase"
            >
              Tanggal Kembali
            </label>
            <input
              id={dueId}
              type="date"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              min={borrowDate}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs transition outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>

        <p className="mt-2 text-[10px] text-neutral-400">
          Tanggal pinjam dan kembali berlaku untuk semua buku yang Anda ajukan.
        </p>
      </div>

      {/* ── Search Bar ── */}
      <div className="flex items-center gap-2">
        <label htmlFor={searchId} className="sr-only">
          Cari buku berdasarkan judul atau pengarang
        </label>
        <div className="relative max-w-md flex-1">
          <Search
            className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul atau pengarang…"
            className="w-full rounded-lg border border-neutral-300 bg-white py-2 pr-9 pl-9 text-xs transition outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
          />
          {searchQuery && (
            <button type="button"
              onClick={() => onSearchChange('')}
              aria-label="Hapus pencarian"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-neutral-400 transition hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <p aria-live="polite" aria-atomic="true" className="shrink-0 text-[11px] text-neutral-500">
          {filteredBooks.length === books.length
            ? `${books.length} koleksi`
            : `${filteredBooks.length} dari ${books.length}`}
        </p>
      </div>

      {/* ── Grid Buku / Empty State ── */}
      {filteredBooks.length > 0 ? (
        <section aria-label={`Hasil katalog — ${filteredBooks.length} buku`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isInCart={cartSet.has(book.id)}
                isWaiting={waitingSet.has(book.id)}
                isBorrowed={borrowedSet.has(book.id)}
                onToggleCart={onToggleCart}
                onBorrow={onBorrow}
                onShowDetail={onShowDetail}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState hasQuery={hasActiveFilter} onReset={handleReset} />
      )}
    </div>
  );
}
