import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Clock, Library, LogOut, LayoutDashboard } from 'lucide-react';
import { Book } from '../../types';
import { getBooks, getLibraryTransactions, borrowBook, returnBook } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import PerpustakaanSidebar from './components/PerpustakaanSidebar';
import BookDetailModal from './components/BookDetailModal';
import KatalogPage from './pages/KatalogPage';
import PinjamanPage from './pages/PinjamanPage';
import RiwayatPage from './pages/RiwayatPage';
import KeranjangPage from './pages/KeranjangPage';
import { namaSekolah } from '../halaman/components/Profile/dataSekolah';

// ─── Constants ────────────────────────────────────────────────────────────────

const SCHOOL_NAME = namaSekolah;
const APP_VERSION = 'v2.2.0-stable';
const LOAN_DURATION = 7;

const TAB_META = {
  katalog: {
    title: 'Katalog Literatur Perpustakaan',
    desc: 'Pilih, tandai, atau ajukan permohonan sirkulasi literatur akademik.',
  },
  pinjaman: {
    title: 'Daftar Pinjaman & Status',
    desc: 'Pantau status permohonan dan batas tanggal pengembalian.',
  },
  riwayat: {
    title: 'Log Arsip Riwayat Sirkulasi',
    desc: 'Catatan historis pengembalian buku yang telah diselesaikan.',
  },
  keranjang: {
    title: 'Daftar Rencana Pinjaman Buku',
    desc: 'Daftar buku yang Anda tandai untuk dipinjam bersamaan.',
  },
} as const;

type ActiveTab = keyof typeof TAB_META;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getTodayISO = () => new Date().toISOString().slice(0, 10);

const getFutureDateISO = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

// ─── Toast Hook & Component ───────────────────────────────────────────────────

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, type: ToastState['type'] = 'info') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast({ message, type });
    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toast, show };
}

const TOAST_COLOR: Record<ToastState['type'], string> = {
  success: 'bg-emerald-800 border-emerald-600 text-emerald-50',
  error: 'bg-red-900     border-red-700     text-red-50',
  info: 'bg-neutral-800 border-neutral-600 text-neutral-50',
};

const ToastBanner: React.FC<{ toast: ToastState | null }> = ({ toast }) => {
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={[
        'fixed bottom-6 left-1/2 z-[999] -translate-x-1/2',
        'flex max-w-sm min-w-[260px] items-start gap-3',
        'rounded-xl border px-4 py-3 shadow-2xl',
        TOAST_COLOR[toast.type],
      ].join(' ')}
    >
      <p className="text-sm leading-snug">{toast.message}</p>
    </div>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentSession {
  nisn: string;
  nama: string;
  kelas: string;
}

interface DashboardPerpustakaanProps {
  studentData: StudentSession;
  onLogout: () => void;
  onBackToPortal: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPerpustakaan({
  studentData,
  onLogout,
  onBackToPortal,
}: DashboardPerpustakaanProps) {
  const storeVersion = useStoreVersion();
  const { toast, show: showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('katalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [cart, setCart] = useState<string[]>([]);
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);
  const [borrowDate, setBorrowDate] = useState(getTodayISO);
  const [dueDate, setDueDate] = useState(() => getFutureDateISO(LOAN_DURATION));

  // Refresh tanggal saat tab browser aktif kembali
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') {
        setBorrowDate(getTodayISO());
        setDueDate(getFutureDateISO(LOAN_DURATION));
      }
    };
    document.addEventListener('visibilitychange', refresh);
    return () => document.removeEventListener('visibilitychange', refresh);
  }, []);

  // ── Data ──────────────────────────────────────────────────────────────────

  const allBooks = useMemo(() => getBooks(), [storeVersion]);
  const allTx = useMemo(() => getLibraryTransactions(), [storeVersion]);

  const studentHistory = useMemo(
    () => allTx.filter((tx) => tx.memberId === studentData.nisn),
    [allTx, studentData.nisn]
  );

  const returnedBooks = useMemo(
    () => studentHistory.filter((tx) => tx.status === 'dikembalikan'),
    [studentHistory]
  );

  const pendingCount = useMemo(
    () =>
      studentHistory.filter((tx) => tx.status === 'menunggu' || tx.status === 'dipinjam').length,
    [studentHistory]
  );

  const notifications = useMemo(
    () =>
      studentHistory
        .filter((tx) => tx.status === 'ditolak')
        .map((tx) => ({
          id: tx.id,
          title: allBooks.find((b) => b.id === tx.bookId)?.title ?? 'Buku tidak ditemukan',
        })),
    [studentHistory, allBooks]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const toggleCart = useCallback((bookId: string) => {
    setCart((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  }, []);

  const removeFromCart = useCallback((bookId: string) => {
    setCart((prev) => prev.filter((id) => id !== bookId));
  }, []);

  const handleBorrow = useCallback(
    (bookId: string, bookTitle: string) => {
      const res = borrowBook(bookId, studentData.nisn, studentData.nama, borrowDate, dueDate);
      if (res.ok) {
        showToast(
          `"${bookTitle}" berhasil diajukan. Pinjam: ${borrowDate} - Kembali: ${dueDate}`,
          'success'
        );
        removeFromCart(bookId);
      } else {
        showToast(res.message, 'error');
      }
    },
    [borrowDate, dueDate, studentData, removeFromCart, showToast]
  );

  const handleBorrowAllFromCart = useCallback(() => {
    if (cart.length === 0) return;

    let successCount = 0;
    const failed: string[] = [];

    cart.forEach((bookId) => {
      const book = allBooks.find((b) => b.id === bookId);

      if (!book || book.available <= 0) {
        failed.push(book?.title ?? bookId);
        return;
      }

      const res = borrowBook(bookId, studentData.nisn, studentData.nama, borrowDate, dueDate);

      if (res.ok) {
        successCount++;
      } else {
        failed.push(book.title);
      }
    });

    if (successCount > 0) {
      showToast(`${successCount} buku berhasil diajukan.`, 'success');
    }

    if (failed.length > 0) {
      showToast(`${failed.length} buku gagal: ${failed.join(', ')}.`, 'error');
    }

    setCart([]);
    setActiveTab('pinjaman');
  }, [cart, allBooks, studentData, borrowDate, dueDate, showToast]);

  const handleReturn = useCallback(
    (txId: string, bookTitle: string) => {
      const res = returnBook(txId, getTodayISO());
      if (res.ok) {
        showToast(`"${bookTitle}" berhasil dikembalikan. Terima kasih!`, 'success');
      } else {
        showToast(res.message, 'error');
      }
    },
    [showToast]
  );

  const openKatalog = useCallback(() => setActiveTab('katalog'), []);

  const { title: pageTitle, desc: pageDesc } = TAB_META[activeTab];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50 font-sans text-neutral-800 antialiased">
      {/* ── Header (sticky, tidak ikut scroll) ── */}
      <header
        aria-label="Header perpustakaan"
        className="z-50 shrink-0 border-b border-neutral-200 bg-white shadow-sm"
      >
        <div className="mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          {/* Brand */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-neutral-900 text-white">
              <Library className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm leading-none font-bold text-neutral-950">
                Sistem Informasi Perpustakaan
              </h1>
              <p className="mt-0.5 truncate text-[11px] text-neutral-500">{SCHOOL_NAME}</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 xl:flex">
              <Clock className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
              <span className="text-[10px] font-bold tracking-tight text-amber-800 uppercase">
                Jam Buka: 08:30 - 15:30 WIB
              </span>
            </div>

            <div className="text-right text-xs">
              <span className="block max-w-[120px] truncate font-semibold text-neutral-900 sm:max-w-none">
                {studentData.nama}
              </span>
              <span className="hidden text-neutral-500 sm:block">
                Kelas {studentData.kelas} &bull; NISN {studentData.nisn}
              </span>
            </div>

            <div className="flex items-center gap-1 border-l border-neutral-200 pl-3">
              <button type="button"
                onClick={onBackToPortal}
                aria-label="Kembali ke Portal Akademik"
                className="flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
              >
                <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Portal</span>
              </button>
              <button type="button"
                onClick={onLogout}
                aria-label="Keluar dari Perpustakaan"
                className="flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-800"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 overflow-hidden">
        {/* Sidebar */}
        <PerpustakaanSidebar
          activeTab={activeTab}
          cartCount={cart.length}
          pendingCount={pendingCount}
          notifications={notifications}
          onChangeTab={setActiveTab}
        />

        {/* Main */}
        <main aria-label={pageTitle} className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* Page header */}
          <div className="mb-6 border-b border-neutral-200 pb-4">
            <h2 className="text-base font-bold tracking-tight text-neutral-950 uppercase">
              {pageTitle}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">{pageDesc}</p>
          </div>

          {/* Page content */}
          {activeTab === 'katalog' && (
            <KatalogPage
              books={allBooks}
              studentHistory={studentHistory}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              borrowDate={borrowDate}
              dueDate={dueDate}
              cart={cart}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              onBorrowDateChange={setBorrowDate}
              onDueDateChange={setDueDate}
              onToggleCart={toggleCart}
              onBorrow={handleBorrow}
              onShowDetail={setSelectedBookDetail}
            />
          )}

          {activeTab === 'pinjaman' && (
            <PinjamanPage
              books={allBooks}
              studentHistory={studentHistory}
              onReturn={handleReturn}
            />
          )}

          {activeTab === 'riwayat' && (
            <RiwayatPage books={allBooks} returnedBooks={returnedBooks} />
          )}

          {activeTab === 'keranjang' && (
            <KeranjangPage
              books={allBooks}
              cart={cart}
              onRemoveFromCart={removeFromCart}
              onBorrowAll={handleBorrowAllFromCart}
              onOpenKatalog={openKatalog}
            />
          )}

          {/* Spacer bawah */}
          <div className="h-6" aria-hidden="true" />
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="z-10 shrink-0 border-t border-neutral-200 bg-white py-3">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 px-4 text-xs text-neutral-400 sm:px-6">
          <p>
            &copy; {new Date().getFullYear()} UPT Perpustakaan {SCHOOL_NAME}. All Rights Reserved.
          </p>
          <p className="font-mono text-[10px]">{APP_VERSION}</p>
        </div>
      </footer>

      {/* ── Modal ── */}
      {selectedBookDetail && (
        <BookDetailModal
          book={selectedBookDetail}
          isInCart={cart.includes(selectedBookDetail.id)}
          onToggleCart={toggleCart}
          onBorrow={(bookId, title) => {
            handleBorrow(bookId, title);
            setSelectedBookDetail(null);
          }}
          onClose={() => setSelectedBookDetail(null)}
        />
      )}

      {/* ── Toast ── */}
      <ToastBanner toast={toast} />
    </div>
  );
}
