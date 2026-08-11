// src/fitur/perpustakaan/components/PerpustakaanSidebar.tsx
import { useId, useState, useEffect } from 'react';
import { BookOpen, Bookmark, History, ShoppingCart, AlertCircle, CheckCircle2 } from 'lucide-react';

// ─── Shared type (idealnya diexport dari types.ts) ────────────────────────────

export type LibraryTab = 'katalog' | 'pinjaman' | 'riwayat' | 'keranjang';

// ─── Nav config ───────────────────────────────────────────────────────────────

interface NavItemConfig {
  key: LibraryTab;
  label: string;
  Icon: React.FC<{ className?: string }>;
}

const PRIMARY_NAV: NavItemConfig[] = [
  { key: 'katalog', label: 'Katalog Literatur', Icon: BookOpen },
  { key: 'pinjaman', label: 'Status Pinjaman', Icon: Bookmark },
  { key: 'riwayat', label: 'Arsip Riwayat', Icon: History },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface PerpustakaanSidebarProps {
  activeTab: LibraryTab;
  cartCount: number;
  pendingCount: number;
  notifications: Array<{ id: string; title?: string }>;
  onChangeTab: (tab: LibraryTab) => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Badge angka — reusable untuk cart & pending */
const CountBadge: React.FC<{
  count: number;
  ariaLabel: string;
  variant?: 'dark' | 'red';
}> = ({ count, ariaLabel, variant = 'dark' }) => {
  if (count <= 0) return null;
  const cls =
    variant === 'red'
      ? 'bg-red-100 text-red-700 border border-red-200'
      : 'bg-neutral-900 text-white';
  return (
    <span
      aria-label={ariaLabel}
      className={`min-w-[1.25rem] rounded-md px-1.5 py-0.5 text-center text-[10px] font-bold ${cls}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

/** Satu baris nav */
const NavItem: React.FC<{
  item: NavItemConfig;
  isActive: boolean;
  badge?: number;
  onClick: () => void;
}> = ({ item, isActive, badge, onClick }) => (
  <button type="button"
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    className={[
      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium',
      'transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none',
      isActive
        ? 'bg-neutral-100 font-semibold text-neutral-950'
        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950',
    ].join(' ')}
  >
    <item.Icon
      className={`h-4 w-4 shrink-0 ${isActive ? 'text-neutral-800' : 'text-neutral-400'}`}
      aria-hidden="true"
    />
    <span className="flex-1 text-left">{item.label}</span>

    {badge !== undefined && (
      <CountBadge count={badge} ariaLabel={`${badge} pinjaman aktif`} variant="red" />
    )}
  </button>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function PerpustakaanSidebar({
  activeTab,
  cartCount,
  pendingCount,
  notifications,
  onChangeTab,
}: PerpustakaanSidebarProps) {
  const uid = useId();
  const navLabel = `${uid}-nav-label`;

  const [sessionTime, setSessionTime] = useState<string>('');

  useEffect(() => {
    setSessionTime(
      new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }, []);

  const visibleNotifs = notifications.slice(0, 3);

  const mobileNavItems: NavItemConfig[] = [
    ...PRIMARY_NAV,
    { key: 'keranjang', label: 'Keranjang', Icon: ShoppingCart },
  ];

  return (
    <>
      {/* ── DESKTOP SIDEBAR ──────────────────────────────────────────────────── */}
      <aside
        aria-label="Navigasi perpustakaan"
        className="hidden w-64 shrink-0 flex-col justify-between border-r border-neutral-200 bg-white p-4 md:flex"
      >
        <div className="space-y-6">
          {/* ── Navigasi Utama ── */}
          <section aria-labelledby={navLabel}>
            <span
              id={navLabel}
              className="mb-2 block px-1 text-[10px] font-bold tracking-wider text-neutral-400 uppercase"
            >
              Navigasi Utama
            </span>

            <nav aria-label="Menu perpustakaan" className="space-y-1">
              {PRIMARY_NAV.map((item) => (
                <NavItem
                  key={item.key}
                  item={item}
                  isActive={activeTab === item.key}
                  badge={item.key === 'pinjaman' ? pendingCount : undefined}
                  onClick={() => onChangeTab(item.key)}
                />
              ))}
            </nav>
          </section>

          {/* ── Notifikasi ── */}
          {visibleNotifs.length > 0 && (
            <section aria-label="Notifikasi terbaru" aria-live="polite" aria-atomic="false">
              <span className="mb-2 block px-1 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                Notifikasi Terbaru
              </span>
              <ul role="list" className="space-y-2">
                {visibleNotifs.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-2.5 text-[10px] leading-snug text-red-800"
                  >
                    <AlertCircle
                      className="mt-px h-3 w-3 shrink-0 text-red-500"
                      aria-hidden="true"
                    />
                    <div>
                      <span className="block leading-none font-bold uppercase">Ditolak</span>
                      <span className="mt-0.5 block text-red-700">
                        {n.title ?? 'Transaksi ditolak'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              {notifications.length > 3 && (
                <p className="mt-1.5 px-1 text-[10px] text-neutral-400">
                  +{notifications.length - 3} notifikasi lainnya
                </p>
              )}
            </section>
          )}

          {/* ── Keranjang ── */}
          <section aria-label="Penanda buku">
            <span className="mb-2 block px-1 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
              Penanda Buku
            </span>
            <button type="button"
              onClick={() => onChangeTab('keranjang')}
              aria-current={activeTab === 'keranjang' ? 'page' : undefined}
              className={[
                'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium',
                'transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none',
                activeTab === 'keranjang'
                  ? 'bg-neutral-100 font-semibold text-neutral-950'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart
                  className={`h-4 w-4 shrink-0 ${activeTab === 'keranjang' ? 'text-neutral-800' : 'text-neutral-400'}`}
                  aria-hidden="true"
                />
                <span>Keranjang Pinjam</span>
              </div>

              <CountBadge
                count={cartCount}
                ariaLabel={`${cartCount} buku di keranjang`}
                variant="dark"
              />
            </button>
          </section>
        </div>

        {/* ── Footer ── */}
        <div className="space-y-1 border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" aria-hidden="true" />
            <span>Sesi Aktif & Terautentikasi</span>
          </div>
          <p className="pl-4 font-mono text-[9px] text-neutral-300">
            {sessionTime && `${sessionTime} WIB`}
          </p>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────────────────────── */}
      <nav
        aria-label="Navigasi perpustakaan mobile"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-neutral-200 bg-white md:hidden"
      >
        {mobileNavItems.map((item) => {
          const isActive = activeTab === item.key;
          const badge =
            item.key === 'pinjaman' ? pendingCount : item.key === 'keranjang' ? cartCount : 0;

          return (
            <button type="button"
              key={item.key}
              onClick={() => onChangeTab(item.key)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={badge > 0 ? `${item.label} (${badge})` : item.label}
              className={[
                'relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                'focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:outline-none focus-visible:ring-inset',
                isActive ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-700',
              ].join(' ')}
            >
              <div className="relative">
                <item.Icon className="h-5 w-5" aria-hidden="true" />
                {badge > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1.5 -right-2 min-w-[1rem] rounded-full bg-red-600 px-1 py-px text-center text-[8px] leading-none font-bold text-white"
                  >
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className="leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Spacer agar konten tidak tertutup bottom nav di mobile */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
