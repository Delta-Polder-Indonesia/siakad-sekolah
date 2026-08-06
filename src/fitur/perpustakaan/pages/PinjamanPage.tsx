// src/fitur/perpustakaan/pages/PinjamanPage.tsx
import { useMemo } from 'react';
import { RotateCcw, BookOpen, Hourglass } from 'lucide-react';
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
 * Hitung sisa hari menggunakan floor of full-day difference.
 * Normalisasi ke midnight agar tidak terpengaruh jam saat fungsi dipanggil.
 */
function calcSisaHari(dueDate: string | undefined | null): number {
  if (!dueDate) return 0;
  const due = parseLocalDate(dueDate);
  if (!due) return 0;

  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return isNaN(diffDays) ? 0 : diffDays;
}

/**
 * Format ISO date ke format lokal Indonesia.
 * "2024-03-15" → "15 Mar 2024"
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

// ─── Badge config ─────────────────────────────────────────────────────────────

type Urgency = 'terlambat' | 'segera' | 'aktif';

function getUrgency(sisaHari: number): Urgency {
  if (sisaHari < 0) return 'terlambat';
  if (sisaHari <= 2) return 'segera';
  return 'aktif';
}

const URGENCY_BADGE: Record<Urgency, { label: string; cls: string }> = {
  terlambat: {
    label: 'TERLAMBAT',
    cls: 'border-red-200 bg-red-100 text-red-800',
  },
  segera: {
    label: 'SEGERA',
    cls: 'border-amber-200 bg-amber-100 text-amber-800',
  },
  aktif: {
    label: 'AKTIF',
    cls: 'border-emerald-200 bg-emerald-100 text-emerald-800',
  },
};

const URGENCY_TEXT: Record<Urgency, string> = {
  terlambat: 'text-red-600',
  segera: 'text-amber-600',
  aktif: 'text-emerald-600',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
      <BookOpen className="h-7 w-7 text-neutral-300" aria-hidden="true" />
    </div>
    <div>
      <p className="text-sm font-semibold text-neutral-500">Tidak Ada Pinjaman Aktif</p>
      <p className="mt-0.5 text-xs text-neutral-400">
        Tidak tercatat beban pinjaman aktif atau permohonan tertunda.
      </p>
    </div>
  </div>
);

/** Status cell untuk baris pinjaman aktif */
const StatusCell: React.FC<{
  loan: LibraryTransaction;
  sisaHari: number;
  urgency: Urgency;
}> = ({ loan, sisaHari, urgency }) => {
  if (loan.status === 'menunggu') {
    return (
      <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[9px] font-bold text-neutral-600 uppercase">
        Menunggu Konfirmasi
      </span>
    );
  }

  if (loan.status === 'dipinjam') {
    const { label, cls } = URGENCY_BADGE[urgency];
    return (
      <div className="flex flex-col gap-1">
        <span
          className={`w-fit rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${cls}`}
        >
          {label}
        </span>
        <span className={`text-[10px] font-medium ${URGENCY_TEXT[urgency]}`}>
          {sisaHari < 0 ? `${Math.abs(sisaHari)} hari terlambat` : `${sisaHari} hari lagi`}
        </span>
      </div>
    );
  }

  return null;
};

/** Kolom aksi */
const ActionCell: React.FC<{
  loan: LibraryTransaction;
  bookTitle: string;
  onReturn: (txId: string, title: string) => void;
}> = ({ loan, bookTitle, onReturn }) => {
  if (loan.status === 'dipinjam') {
    return (
      <button
        onClick={() => onReturn(loan.id, bookTitle)}
        aria-label={`Kembalikan buku "${bookTitle}"`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
      >
        <RotateCcw className="h-3 w-3" aria-hidden="true" />
        Kembalikan
      </button>
    );
  }

  if (loan.status === 'menunggu') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400">
        <Hourglass className="h-3 w-3" aria-hidden="true" />
        Menunggu admin
      </span>
    );
  }

  return null;
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PinjamanPageProps {
  books: Book[];
  studentHistory: LibraryTransaction[];
  onReturn: (txId: string, bookTitle: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PinjamanPage({ books, studentHistory, onReturn }: PinjamanPageProps) {
  const bookMap = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);

  const activeLoans = useMemo(
    () => studentHistory.filter((h) => h.status === 'menunggu' || h.status === 'dipinjam'),
    [studentHistory]
  );

  // ── Empty state ────────────────────────────────────────────────────────────
  if (activeLoans.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <EmptyState />
      </div>
    );
  }

  // ── Tabel ─────────────────────────────────────────────────────────────────
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[560px] border-collapse text-left"
          aria-label={`Pinjaman aktif — ${activeLoans.length} data`}
        >
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
              <th scope="col" className="px-4 py-3">
                Judul Literatur
              </th>
              <th scope="col" className="px-4 py-3">
                Tgl Pinjam
              </th>
              <th scope="col" className="px-4 py-3">
                Tgl Kembali
              </th>
              <th scope="col" className="px-4 py-3">
                Status / Sisa
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100 text-xs">
            {activeLoans.map((loan) => {
              const book = bookMap.get(loan.bookId);
              const bookTitle = book?.title ?? `Buku (ID: ${loan.bookId})`;
              const sisaHari = calcSisaHari(loan.dueDate);
              const urgency = getUrgency(sisaHari);

              return (
                <tr key={loan.id} className="transition-colors hover:bg-neutral-50/70">
                  {/* Judul + catatan */}
                  <td className="px-4 py-3">
                    <span className="font-semibold text-neutral-900">{bookTitle}</span>
                    {loan.note && (
                      <p className="mt-1 text-[10px] text-red-500 italic">Catatan: {loan.note}</p>
                    )}
                  </td>

                  {/* Tanggal terformat */}
                  <td className="px-4 py-3 text-neutral-600">{formatDate(loan.borrowDate)}</td>
                  <td className="px-4 py-3 font-medium text-neutral-600">
                    {formatDate(loan.dueDate)}
                  </td>

                  {/* StatusCell pakai config terpusat */}
                  <td className="px-4 py-3">
                    <StatusCell loan={loan} sisaHari={sisaHari} urgency={urgency} />
                  </td>

                  {/* ActionCell */}
                  <td className="px-4 py-3 text-right">
                    <ActionCell loan={loan} bookTitle={bookTitle} onReturn={onReturn} />
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Summary row */}
          <tfoot>
            <tr className="border-t border-neutral-200 bg-neutral-50/50">
              <td colSpan={5} className="px-4 py-2.5 text-right text-[11px] text-neutral-400">
                Total {activeLoans.length} pinjaman aktif
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
