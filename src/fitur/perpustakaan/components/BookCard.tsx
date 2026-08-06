// src/fitur/perpustakaan/components/BookCard.tsx
import { useCallback } from 'react';
import { ShoppingCart, Eye, ImageIcon, Clock, CheckCircle2 } from 'lucide-react';
import type { Book } from '../../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookCardProps {
  book: Book;
  isInCart: boolean;
  isWaiting: boolean;
  isBorrowed: boolean;
  onToggleCart: (bookId: string) => void;
  onBorrow: (bookId: string, title: string) => void;
  onShowDetail: (book: Book) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Clamp badge count untuk display */
const clampCount = (n: number) => (n > 99 ? '99+' : String(n));

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Cover image dengan fallback */
const BookCover: React.FC<{
  book: Book;
  onClick: () => void;
}> = ({ book, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Lihat detail buku "${book.title}"`}
    className="group/cover relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none focus-visible:ring-inset"
  >
    {book.coverImage ? (
      <img
        src={book.coverImage}
        alt={`Sampul "${book.title}"`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
    ) : (
      <div
        className="flex h-full w-full flex-col items-center justify-center text-neutral-300"
        aria-hidden="true"
      >
        <ImageIcon className="mb-2 h-12 w-12" aria-hidden="true" />
        <span className="text-[10px]">Tidak ada sampul</span>
      </div>
    )}

    {/* ── Overlay "Lihat Detail" ── */}
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/cover:bg-black/15"
    >
      <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-neutral-800 opacity-0 shadow-lg transition-opacity group-hover/cover:opacity-100">
        <Eye className="h-3 w-3" aria-hidden="true" />
        Lihat Detail
      </span>
    </div>
  </button>
);

/** Badge stok — pojok kanan atas cover */
const StockBadge: React.FC<{ available: number }> = ({ available }) => {
  const inStock = available > 0;
  return (
    <span
      role="status"
      aria-label={inStock ? `${available} eksemplar tersedia` : 'Stok habis'}
      className={`rounded-md px-2 py-0.5 text-[10px] font-bold text-white ${
        inStock ? 'bg-emerald-500' : 'bg-red-500'
      }`}
    >
      {inStock ? `${clampCount(available)} Tersedia` : 'Kosong'}
    </span>
  );
};

/** Badge "Dipinjam" — pojok kiri atas */
const BorrowedBadge: React.FC = () => (
  <span
    role="status"
    aria-label="Sedang Anda pinjam"
    className="rounded-md bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white"
  >
    Dipinjam
  </span>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookCard({
  book,
  isInCart,
  isWaiting,
  isBorrowed,
  onToggleCart,
  onBorrow,
  onShowDetail,
}: BookCardProps) {
  const isUnavailable = book.available <= 0;

  const handleShowDetail = useCallback(() => onShowDetail(book), [book, onShowDetail]);

  const handleToggleCart = useCallback(() => onToggleCart(book.id), [book.id, onToggleCart]);

  const handleBorrow = useCallback(
    () => onBorrow(book.id, book.title),
    [book.id, book.title, onBorrow]
  );

  // ── Button state ───────────────────────────────────────────────────────────

  const cartDisabled = isUnavailable || isBorrowed;
  // Kunci tombol pinjam jika sedang dipinjam, stok habis, atau dalam status menunggu
  const borrowDisabled = isUnavailable || isBorrowed || isWaiting;

  const borrowBtnCls = isBorrowed
    ? 'bg-sky-100 text-sky-700 cursor-default'
    : isUnavailable
      ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
      : isWaiting
        ? 'bg-amber-100 text-amber-700 cursor-default'
        : 'bg-sky-600 text-white hover:bg-sky-500';

  const cartBtnCls = isBorrowed
    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
    : isInCart
      ? 'bg-neutral-900 text-white'
      : isUnavailable
        ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
        : 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <article
      aria-label={`Buku: ${book.title}`}
      className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      {/* ── Cover ── */}
      <div className="relative">
        <BookCover book={book} onClick={handleShowDetail} />

        {/* Badges overlay */}
        <div className="pointer-events-none absolute top-2 right-2">
          <StockBadge available={book.available} />
        </div>
        {isBorrowed && (
          <div className="pointer-events-none absolute top-2 left-2">
            <BorrowedBadge />
          </div>
        )}
      </div>

      {/* ── Info panel ── */}
      <div className="p-3">
        {/* Judul + Pengarang */}
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-neutral-900">
            <button
              type="button"
              onClick={handleShowDetail}
              title={book.title}
              aria-label={`Lihat detail: ${book.title}`}
              className="block w-full truncate text-left transition hover:text-sky-600 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              {book.title}
            </button>
          </h3>
          <p className="mt-0.5 truncate text-[11px] text-neutral-500">{book.author}</p>
        </div>

        {/* Kategori & Rak */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600">
            {book.category}
          </span>
          <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">
            Rak {book.rack}
          </span>
          {isWaiting && !isBorrowed && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
              <Clock className="h-2.5 w-2.5" aria-hidden="true" />
              Menunggu
            </span>
          )}
        </div>

        {/* Deskripsi singkat */}
        {book.description && (
          <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-neutral-400">
            {book.description}
          </p>
        )}

        {/* ── Tombol Aksi ── */}
        <div className="mt-3 flex items-center gap-2 border-t border-neutral-100 pt-3">
          {/* Keranjang */}
          <button
            type="button"
            onClick={handleToggleCart}
            disabled={cartDisabled}
            aria-label={
              isBorrowed
                ? `"${book.title}" sedang dipinjam`
                : isInCart
                  ? `Hapus "${book.title}" dari keranjang`
                  : isUnavailable
                    ? `Stok "${book.title}" habis`
                    : `Tambah "${book.title}" ke keranjang`
            }
            aria-pressed={isInCart && !cartDisabled}
            className={[
              'flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-bold transition',
              'focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none',
              cartBtnCls,
            ].join(' ')}
          >
            <ShoppingCart className="h-3 w-3" aria-hidden="true" />
            {isInCart && !isBorrowed ? 'Di Keranjang' : 'Keranjang'}
          </button>

          {/* Pinjam */}
          <button
            type="button"
            onClick={handleBorrow}
            disabled={borrowDisabled}
            aria-label={
              isBorrowed
                ? `"${book.title}" sedang Anda pinjam`
                : isWaiting
                  ? `Menunggu konfirmasi pinjam "${book.title}"`
                  : isUnavailable
                    ? `Stok "${book.title}" habis`
                    : `Pinjam buku "${book.title}"`
            }
            className={[
              'flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-bold transition',
              'focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none',
              borrowBtnCls,
            ].join(' ')}
          >
            {isBorrowed && <CheckCircle2 className="h-3 w-3" aria-hidden="true" />}
            {isWaiting && !isBorrowed && <Clock className="h-3 w-3" aria-hidden="true" />}
            {isBorrowed ? 'Dipinjam' : isWaiting ? 'Menunggu' : 'Pinjam'}
          </button>
        </div>
      </div>
    </article>
  );
}
