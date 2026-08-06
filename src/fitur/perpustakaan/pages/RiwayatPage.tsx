// src/fitur/perpustakaan/pages/RiwayatPage.tsx
import { useMemo } from 'react';
import { CheckCircle2, ClockIcon, BookMarked } from 'lucide-react';
import type { Book, LibraryTransaction } from '../../../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parses "YYYY-MM-DD" or ISO strings safely into a Local Date object
 * avoiding UTC timezone shifts.
 */
function parseLocalDate(iso: string | undefined | null): Date | null {
  if (!iso) return null;
  const dateOnly = iso.split('T')[0];
  const parts = dateOnly.split('-');
  if (parts.length !== 3) {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format tanggal ISO → lokal Indonesia.
 * Contoh: "2024-03-15" → "15 Mar 2024"
 */
function formatDate(iso: string | undefined | null): string {
  if (!iso) return '—';
  const d = parseLocalDate(iso);
  if (!d) return iso;
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Hitung durasi peminjaman dalam hari.
 */
function calcDuration(borrowDate: string, returnDate?: string | null): string {
  if (!returnDate) return '';
  const start = parseLocalDate(borrowDate);
  const end = parseLocalDate(returnDate);
  if (!start || !end) return '';
  const diffTime = end.getTime() - start.getTime();
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return days >= 0 ? `${days} hari` : '';
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface RiwayatPageProps {
  books: Book[];
  returnedBooks: LibraryTransaction[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
      <ClockIcon className="h-7 w-7 text-neutral-300" aria-hidden="true" />
    </div>
    <div>
      <p className="text-sm font-semibold text-neutral-500">Belum Ada Riwayat</p>
      <p className="mt-0.5 text-xs text-neutral-400">
        Belum ada log riwayat peminjaman dalam arsip akun ini.
      </p>
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function RiwayatPage({ books, returnedBooks }: RiwayatPageProps) {
  const bookMap = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);

  const sortedHistory = useMemo(
    () =>
      [...returnedBooks].sort((a, b) => {
        const dateA = a.returnDate ? (parseLocalDate(a.returnDate)?.getTime() ?? 0) : 0;
        const dateB = b.returnDate ? (parseLocalDate(b.returnDate)?.getTime() ?? 0) : 0;
        return dateB - dateA; // terbaru di atas
      }),
    [returnedBooks]
  );

  // ── Render: empty state ────────────────────────────────────────────────────
  if (sortedHistory.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <EmptyState />
      </div>
    );
  }

  // ── Render: tabel ─────────────────────────────────────────────────────────
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[520px] border-collapse text-left"
          aria-label={`Riwayat peminjaman — ${sortedHistory.length} data`}
        >
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
              <th scope="col" className="px-4 py-3">
                Judul Literatur
              </th>
              <th scope="col" className="px-4 py-3">
                Tanggal Pinjam
              </th>
              <th scope="col" className="px-4 py-3">
                Tanggal Kembali
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Durasi
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100 text-xs">
            {sortedHistory.map((loan) => {
              const book = bookMap.get(loan.bookId);
              const title = book?.title ?? `Buku (ID: ${loan.bookId})`;
              const duration = calcDuration(loan.borrowDate, loan.returnDate);

              return (
                <tr key={loan.id} className="transition-colors hover:bg-neutral-50/70">
                  {/* Judul */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BookMarked
                        className="h-3.5 w-3.5 shrink-0 text-neutral-400"
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-neutral-800">{title}</span>
                    </div>
                  </td>

                  {/* Tanggal terformat */}
                  <td className="px-4 py-3 text-neutral-500">{formatDate(loan.borrowDate)}</td>

                  <td className="px-4 py-3 text-neutral-500">{formatDate(loan.returnDate)}</td>

                  {/* Durasi */}
                  <td className="px-4 py-3 text-center text-neutral-400">{duration || '—'}</td>

                  {/* Status */}
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                      Dikembalikan
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Summary row */}
          <tfoot>
            <tr className="border-t border-neutral-200 bg-neutral-50/50">
              <td colSpan={5} className="px-4 py-2.5 text-right text-[11px] text-neutral-400">
                Total {sortedHistory.length} catatan pengembalian
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
