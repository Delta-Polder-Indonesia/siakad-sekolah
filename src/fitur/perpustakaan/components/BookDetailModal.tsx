// src/fitur/perpustakaan/components/BookDetailModal.tsx
import { useEffect, useRef, useCallback, useId } from 'react';
import { ShoppingCart, ImageIcon, X, CheckCircle2 } from 'lucide-react';
import type { Book } from '../../../types';

// ─── Focus Trap Hook ──────────────────────────────────────────────────────────

const FOCUSABLE_SELECTORS =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useFocusTrap(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Simpan element sebelumnya untuk dikembalikan saat modal tutup
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
        (n) => !n.closest('[hidden]')
      );

    // Fokus ke elemen pertama saat modal buka
    focusable()[0]?.focus();

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const nodes = focusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    el.addEventListener('keydown', handleKeyDown);
    return () => {
      el.removeEventListener('keydown', handleKeyDown);
      // Kembalikan fokus jika elemen pemicu masih ada di DOM
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [ref]);
}

// ─── Body Scroll Lock Hook ────────────────────────────────────────────────────

function useBodyScrollLock() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookDetailModalProps {
  book: Book;
  isInCart: boolean;
  isBorrowed?: boolean;
  onToggleCart: (bookId: string) => void;
  onBorrow: (bookId: string, title: string) => void;
  onClose: () => void;
}

// ─── Metadata row ─────────────────────────────────────────────────────────────

const MetaItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">{label}</p>
    <p className="mt-0.5 text-sm text-neutral-700">{value}</p>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookDetailModal({
  book,
  isInCart,
  isBorrowed = false,
  onToggleCart,
  onBorrow,
  onClose,
}: BookDetailModalProps) {
  const uid = useId();
  const titleId = `${uid}-modal-title`;
  const dialogRef = useRef<HTMLDivElement>(null);

  // Hooks
  useFocusTrap(dialogRef);
  useBodyScrollLock();

  // Escape menutup modal
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Backdrop click menutup modal
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const isUnavailable = book.available <= 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-in fade-in zoom-in-95 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white/95 px-5 py-4 backdrop-blur-sm">
          <h2 id={titleId} className="text-sm font-bold text-neutral-900">
            Detail Buku
          </h2>
          <button type="button"
            onClick={onClose}
            aria-label="Tutup detail buku"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* ── Cover ── */}
            <div className="mx-auto shrink-0 md:mx-0">
              <div className="h-64 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={`Sampul buku "${book.title}" karya ${book.author}`}
                    className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                ) : (
                  <div
                    className="flex h-full w-full flex-col items-center justify-center text-neutral-300"
                    aria-label="Sampul tidak tersedia"
                  >
                    <ImageIcon className="mb-2 h-16 w-16" aria-hidden="true" />
                    <span className="text-xs">Tidak ada sampul</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Info ── */}
            <div className="flex min-w-0 flex-1 flex-col">
              {/* Judul & Author */}
              <h3 className="mb-0.5 text-xl leading-snug font-bold text-neutral-900">
                {book.title}
              </h3>
              <p className="mb-4 text-sm text-neutral-500">oleh {book.author}</p>

              {/* Badge */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                  {book.category}
                </span>
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-black">
                  Rak {book.rack}
                </span>
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                    isUnavailable ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {isUnavailable ? 'Stok Habis' : `${book.available} Tersedia`}
                </span>
              </div>

              {/* Metadata */}
              <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-3">
                {book.isbn && (
                  <MetaItem label="ISBN" value={<span className="font-mono">{book.isbn}</span>} />
                )}
                {book.publisher && <MetaItem label="Penerbit" value={book.publisher} />}
                <MetaItem label="Stok Total" value={`${book.stock} buku`} />
                <MetaItem label="Tersedia" value={`${book.available} buku`} />
              </div>

              {/* Deskripsi */}
              {book.description && (
                <div className="mb-4">
                  <p className="mb-1 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Deskripsi
                  </p>
                  <p className="text-sm leading-relaxed text-neutral-600">{book.description}</p>
                </div>
              )}

              {/* ── Aksi ── */}
              <div className="mt-auto flex gap-2 border-t border-neutral-100 pt-4">
                {/* Keranjang */}
                <button type="button"
                  onClick={() => onToggleCart(book.id)}
                  disabled={isUnavailable}
                  aria-label={
                    isUnavailable
                      ? `Tidak dapat menambahkan "${book.title}" — stok habis`
                      : isInCart
                        ? `Hapus "${book.title}" dari keranjang`
                        : `Tambah "${book.title}" ke keranjang`
                  }
                  aria-pressed={isInCart}
                  className={[
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition',
                    'focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                    isUnavailable
                      ? 'cursor-not-allowed bg-neutral-100 text-neutral-400 ring-neutral-200'
                      : isInCart
                        ? 'bg-neutral-900 text-white ring-neutral-900 hover:bg-neutral-700'
                        : 'border border-neutral-300 bg-white text-neutral-700 ring-neutral-400 hover:bg-neutral-50',
                  ].join(' ')}
                >
                  <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
                  {isInCart ? 'Di Keranjang' : 'Tambah ke Keranjang'}
                </button>

                {/* Pinjam */}
                <button type="button"
                  onClick={() => onBorrow(book.id, book.title)}
                  disabled={isUnavailable || isBorrowed}
                  aria-label={
                    isBorrowed
                      ? `"${book.title}" sedang Anda pinjam`
                      : isUnavailable
                        ? `Tidak dapat meminjam "${book.title}" — stok habis`
                        : `Pinjam buku "${book.title}"`
                  }
                  className={[
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition',
                    'focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                    isBorrowed
                      ? 'cursor-default bg-emerald-100 text-emerald-700 ring-emerald-300'
                      : isUnavailable
                        ? 'cursor-not-allowed bg-neutral-100 text-neutral-400 ring-neutral-200'
                        : 'bg-sky-600 text-white ring-sky-500 hover:bg-sky-500',
                  ].join(' ')}
                >
                  {isBorrowed && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
                  {isBorrowed ? 'Sedang Dipinjam' : 'Pinjam Sekarang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
