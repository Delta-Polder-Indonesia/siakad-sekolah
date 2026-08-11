// src/fitur/perpustakaan/pages/KeranjangPage.tsx
import { useMemo, useCallback, useState, useEffect } from 'react';
import { Trash2, ShoppingBasket, AlertTriangle, ArrowRight } from 'lucide-react';
import type { Book } from '../../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface KeranjangPageProps {
  books: Book[];
  cart: string[];
  onRemoveFromCart: (bookId: string) => void;
  onBorrowAll: () => void;
  onOpenKatalog: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const EmptyState: React.FC<{ onOpenKatalog: () => void }> = ({ onOpenKatalog }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
      <ShoppingBasket className="h-7 w-7 text-neutral-300" aria-hidden="true" />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-semibold text-neutral-500">Keranjang Masih Kosong</p>
      <p className="text-xs text-neutral-400">
        Gunakan ikon keranjang pada Katalog Literatur untuk menandai buku.
      </p>
    </div>
    <button type="button"
      onClick={onOpenKatalog}
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none"
    >
      Buka Katalog Buku
      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  </div>
);

const ConfirmBanner: React.FC<{
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ count, onConfirm, onCancel }) => (
  <div
    role="alertdialog"
    aria-modal="true"
    tabIndex={-1}
    aria-labelledby="confirm-title"
    className="flex flex-col gap-3 rounded-xl border-2 border-amber-400 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"
  >
    <div className="flex items-start gap-2">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
      <p id="confirm-title" className="text-xs text-amber-900">
        Anda akan mengajukan peminjaman <strong>{count} buku</strong> sekaligus. Lanjutkan?
      </p>
    </div>
    <div className="flex shrink-0 gap-2">
      <button type="button"
        onClick={onCancel}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:outline-none"
      >
        Batal
      </button>
      <button type="button"
        onClick={onConfirm}
        className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none"
      >
        Ya, Ajukan
      </button>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function KeranjangPage({
  books,
  cart,
  onRemoveFromCart,
  onBorrowAll,
  onOpenKatalog,
}: KeranjangPageProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const bookMap = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);

  const { cartBooks, orphanedIds } = useMemo(() => {
    const found: Book[] = [];
    const orphaned: string[] = [];
    cart.forEach((id) => {
      const b = bookMap.get(id);
      if (b) found.push(b);
      else orphaned.push(id);
    });
    return { cartBooks: found, orphanedIds: orphaned };
  }, [cart, bookMap]);

  // Jumlah buku yang stoknya habis di keranjang
  const outOfStockCount = useMemo(
    () => cartBooks.filter((b) => b.available <= 0).length,
    [cartBooks]
  );

  // Reset konfirmasi jika keranjang menjadi kosong
  useEffect(() => {
    if (cartBooks.length === 0) {
      setShowConfirm(false);
    }
  }, [cartBooks.length]);

  const handleConfirmBorrow = useCallback(() => {
    setShowConfirm(false);
    onBorrowAll();
  }, [onBorrowAll]);

  // ── Empty state ────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <EmptyState onOpenKatalog={onOpenKatalog} />
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Konfirmasi sebelum ajukan semua */}
      {showConfirm && (
        <ConfirmBanner
          count={cartBooks.length - outOfStockCount}
          onConfirm={handleConfirmBorrow}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Peringatan stok habis */}
      {outOfStockCount > 0 && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"
        >
          <AlertTriangle
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600"
            aria-hidden="true"
          />
          <span>
            <strong>{outOfStockCount} buku</strong> di keranjang sedang tidak tersedia. Buku
            tersebut tidak akan diproses saat pengajuan.
          </span>
        </div>
      )}

      {/* Info orphaned ID */}
      {orphanedIds.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800"
        >
          {orphanedIds.length} item di keranjang tidak ditemukan di katalog dan diabaikan.
        </div>
      )}

      {/* Tabel keranjang */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table
            className="w-full min-w-[440px] border-collapse text-left"
            aria-label={`Keranjang pinjaman — ${cartBooks.length} buku`}
          >
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                <th scope="col" className="px-4 py-3">
                  Judul Buku Terpilih
                </th>
                <th scope="col" className="px-4 py-3">
                  Kategori
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Stok
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Opsi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 text-xs">
              {cartBooks.map((book) => {
                const outOfStock = book.available <= 0;
                return (
                  <tr
                    key={book.id}
                    className={`transition-colors hover:bg-neutral-50/70 ${
                      outOfStock ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Judul + Author */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-900">{book.title}</div>
                      <div className="mt-0.5 text-[11px] text-neutral-500">{book.author}</div>
                    </td>

                    {/* Kategori */}
                    <td className="px-4 py-3 text-neutral-600">{book.category}</td>

                    {/* Stok indicator */}
                    <td className="px-4 py-3 text-center">
                      {outOfStock ? (
                        <span className="inline-block rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-700 uppercase">
                          Habis
                        </span>
                      ) : (
                        <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 uppercase">
                          Tersedia {book.available}
                        </span>
                      )}
                    </td>

                    {/* Hapus */}
                    <td className="px-4 py-3 text-right">
                      <button type="button"
                        onClick={() => onRemoveFromCart(book.id)}
                        aria-label={`Hapus "${book.title}" dari keranjang`}
                        className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="text-xs text-neutral-500">
            Total: <strong className="text-neutral-900">{cartBooks.length} buku</strong>
            {outOfStockCount > 0 && (
              <span className="ml-2 text-amber-700">({outOfStockCount} tidak tersedia)</span>
            )}
          </div>
          <button type="button"
            onClick={() => setShowConfirm(true)}
            disabled={cartBooks.length === 0 || cartBooks.length === outOfStockCount}
            aria-label="Ajukan semua pinjaman dalam keranjang"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            Ajukan Semua Pinjaman
          </button>
        </div>
      </div>
    </div>
  );
}
