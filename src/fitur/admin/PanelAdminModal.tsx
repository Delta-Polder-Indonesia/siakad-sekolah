import { useState, useMemo, useEffect, Suspense } from 'react';
import PerpusDashboard from './AdminPerpustakaan/PerpusDashboard';
import PerpusInventori from './AdminPerpustakaan/PerpusInventori';
import PerpusMasterData from './AdminPerpustakaan/master';
import PerpusTransaksi from './AdminPerpustakaan/PerpusTransaksi';
import PerpusDetailBuku from './AdminPerpustakaan/PerpusDetailBuku';
import {
  Building2,
  UserPlus,
  Users,
  CreditCard,
  Megaphone,
  LayoutDashboard,
  Box,
  Database,
  ArrowLeftRight,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  CalendarDays,
  Mail,
  BookOpen,
  Tags,
  Printer,
  Archive,
  History,
} from 'lucide-react';
import TabKelolaKelas from './components/TabKelolaKelas';
import TabTambahGuru from './components/TabTambahGuru';
import TabTambahSiswa from './components/TabTambahSiswa';
import TabAkunGuru from './components/TabAkunGuru';
import TabTagihanSekolah from './components/TabTagihanSekolah';
import TabPengumumanAdmin from './components/TabPengumumanAdmin';
import TabAkunSiswa from './components/TabAkunSiswa';
import TabAkunOrangTua from './components/TabAkunOrangTua';
import TabKelolaRoster from './components/TabKelolaRoster';
import TabRiwayatLogin from './components/TabRiwayatLogin';
import TabMasterAkademik from './components/TabMasterAkademik';
import PesanMasuk from '../bersama/PesanMasuk';
import AdminPanel from '../penerimaan-siswa-baru/AdminPanel';
import { getTeachers, getClasses } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '../../components/ui';

type TeacherAdminTab =
  | 'kelas'
  | 'master-akademik'
  | 'tambah-guru'
  | 'tambah-siswa'
  | 'akun-guru'
  | 'tagihan'
  | 'pengumuman-admin'
  | 'pesan-masuk'
  | 'akun-siswa'
  | 'akun-orang-tua'
  | 'kelola-roster'
  | 'riwayat-login'
  | 'ppdb-admin'
  | 'perpus-dashboard'
  | 'perpus-inventori'
  | 'perpus-master-anggota'
  | 'perpus-master-buku'
  | 'perpus-master-kategori'
  | 'perpus-master-penerbit'
  | 'perpus-master-rak'
  | 'perpus-transaksi-pinjam'
  | 'perpus-transaksi-kembali'
  | 'perpus-detail';

interface AdminGuruPanelProps {
  scope: 'teacher' | 'student';
  open?: boolean;
  onClose?: () => void;
}

const MENU_MASTER = [
  { id: 'kelas', label: 'Kelola Kelas', icon: Building2 },
  { id: 'master-akademik', label: 'Master Akademik', icon: Database },
  { id: 'akun-guru', label: 'Daftar Guru', icon: Users },
  { id: 'tambah-guru', label: 'Tambah Guru', icon: UserPlus },
  { id: 'akun-siswa', label: 'Daftar Siswa', icon: UserCheck },
  { id: 'tambah-siswa', label: 'Tambah Siswa', icon: UserPlus },
  { id: 'ppdb-admin', label: 'Kelola PPDB', icon: Users },
  { id: 'kelola-roster', label: 'Kelola Roster', icon: CalendarDays },
  { id: 'tagihan', label: 'Tagihan SPP', icon: CreditCard },
  { id: 'pengumuman-admin', label: 'Pengumuman', icon: Megaphone },
  { id: 'riwayat-login', label: 'Riwayat Login', icon: History },
  { id: 'pesan-masuk', label: 'Pesan Masuk', icon: Mail },
  { id: 'akun-orang-tua', label: 'Akun Orang Tua', icon: ShieldCheck },
] as const;

const MENU_MASTER_GROUPS = [
  {
    title: 'Akademik',
    items: [
      { id: 'kelas', label: 'Kelola Kelas', icon: Building2 },
      { id: 'kelola-roster', label: 'Kelola Roster', icon: CalendarDays },
      { id: 'master-akademik', label: 'Master Akademik', icon: Database },
    ],
  },
  {
    title: 'Guru',
    items: [
      { id: 'akun-guru', label: 'Daftar Guru', icon: Users },
      { id: 'tambah-guru', label: 'Tambah Guru', icon: UserPlus },
    ],
  },
  {
    title: 'Siswa',
    items: [
      { id: 'akun-siswa', label: 'Daftar Siswa', icon: UserCheck },
      { id: 'tambah-siswa', label: 'Tambah Siswa', icon: UserPlus },
      { id: 'ppdb-admin', label: 'Kelola PPDB', icon: Users },
    ],
  },
  {
    title: 'Administrasi',
    items: [
      { id: 'tagihan', label: 'Tagihan SPP', icon: CreditCard },
      { id: 'riwayat-login', label: 'Riwayat Login', icon: History },
      { id: 'pengumuman-admin', label: 'Pengumuman', icon: Megaphone },
      { id: 'pesan-masuk', label: 'Pesan Masuk', icon: Mail },
      { id: 'akun-orang-tua', label: 'Akun Orang Tua', icon: ShieldCheck },
    ],
  },
] as const;

const MENU_PERPUS = [
  { id: 'perpus-dashboard', label: 'Dashboard Perpus', icon: LayoutDashboard },
  { id: 'perpus-inventori', label: 'Inventori Buku', icon: Box },
  { id: 'perpus-master-anggota', label: 'Data Anggota', icon: Database },
  { id: 'perpus-master-buku', label: 'Master Buku', icon: BookOpen },
  { id: 'perpus-master-kategori', label: 'Kategori Buku', icon: Tags },
  { id: 'perpus-master-penerbit', label: 'Data Penerbit', icon: Printer },
  { id: 'perpus-master-rak', label: 'Posisi Rak', icon: Archive },
  { id: 'perpus-transaksi-pinjam', label: 'Peminjaman', icon: ArrowLeftRight },
  { id: 'perpus-transaksi-kembali', label: 'Pengembalian', icon: ArrowLeftRight },
] as const;

function MenuRenderer({
  items,
  activeTab,
  onSelect,
}: {
  items:
    | readonly { id: string; label: string; icon: LucideIcon }[]
    | { id: string; label: string; icon: LucideIcon }[];
  activeTab: TeacherAdminTab;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="space-y-0.5">
      {items.map((menu) => {
        const isActive = activeTab === menu.id;
        return (
          <button
            type="button"
            key={menu.id}
            onClick={() => onSelect(menu.id)}
            className={`flex w-full items-center gap-2.5 px-2 py-1.5 text-left transition-colors select-none ${
              isActive ? 'font-bold text-blue-600' : 'font-bold text-black hover:text-blue-600'
            }`}
          >
            <menu.icon
              className={`h-4 w-4 shrink-0 transition-colors ${
                isActive ? 'text-blue-600' : 'text-black'
              }`}
            />
            <span className="flex-1 truncate text-xs tracking-wide">{menu.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function AdminMasterPanel({ scope, open, onClose }: AdminGuruPanelProps) {
  const storeVersion = useStoreVersion();
  const [activeTab, setActiveTab] = useState<TeacherAdminTab>(
    scope === 'teacher' ? 'kelas' : 'akun-siswa'
  );
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [localNotice, setLocalNotice] = useState('');
  const loading = storeVersion === 0;

  const teachers = useMemo(() => getTeachers(), [storeVersion]);
  const classes = useMemo(() => getClasses(), [storeVersion]);

  // Auto-clear toast notice setelah 3 detik
  useEffect(() => {
    if (localNotice) {
      const timer = setTimeout(() => setLocalNotice(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [localNotice]);

  const filteredGroups = useMemo(() => {
    const result: Array<{
      title: string;
      items: Array<{ id: string; label: string; icon: LucideIcon }>;
    }> = [];

    for (const group of MENU_MASTER_GROUPS) {
      if (scope === 'student' && (group.title === 'Akademik' || group.title === 'Guru')) {
        continue;
      }
      result.push({
        title: group.title,
        items: group.items.map((item) => ({
          id: item.id,
          label: item.label,
          icon: item.icon,
        })),
      });
    }
    return result;
  }, [scope]);

  const filledClassCount = useMemo(() => {
    return classes.filter((item) => item.teacherId).length;
  }, [classes]);

  const isPerpusTab = activeTab.startsWith('perpus-');

  const handleViewDetail = (bookId: string) => {
    setSelectedBookId(bookId);
    setActiveTab('perpus-detail');
  };

  const handleBackToInventori = () => {
    setSelectedBookId(null);
    setActiveTab('perpus-inventori');
  };

  const activeMenu = [...MENU_MASTER, ...MENU_PERPUS].find((m) => m.id === activeTab);

  const handleNotice = (msg: string) => {
    setLocalNotice(msg);
  };

  const isModal = open !== undefined;
  if (isModal && !open) return null;

  const panel = (
    <section className="flex h-full w-full overflow-hidden bg-white">
      {/* ══ SUB-SIDEBAR ══════════════════════════════════════════════ */}
      <aside className="scrollbar-hide flex h-full max-h-full w-52 shrink-0 flex-col justify-between overflow-y-auto border-r-2 border-black bg-white p-4">
        <div className="space-y-5">
          <div className="flex flex-col gap-0.5 border-b-2 border-black pb-3">
            <h2 className="text-sm font-bold tracking-tight text-black uppercase">Tata Usaha</h2>
            <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
              Portal Kendali Pusat
            </p>
          </div>

          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-1.5 px-2 text-[10px] font-bold tracking-widest text-black uppercase">
                  {group.title}
                </p>
                <div>
                  <MenuRenderer
                    items={group.items}
                    activeTab={activeTab}
                    onSelect={(id) => setActiveTab(id as TeacherAdminTab)}
                  />
                </div>
              </div>
            ))}

            <div>
              <p className="mb-1.5 px-2 text-[10px] font-bold tracking-widest text-black uppercase">
                Perpustakaan
              </p>
              <div>
                <MenuRenderer
                  items={MENU_PERPUS}
                  activeTab={activeTab}
                  onSelect={(id) => setActiveTab(id as TeacherAdminTab)}
                />
              </div>
            </div>
          </div>

          {/* KPI Ringkasan */}
          <div className="space-y-1.5 border-t border-black pt-4">
            <p className="mb-2 text-[10px] font-bold tracking-widest text-black uppercase">
              Ringkasan Data
            </p>
            {loading ? (
              <>
                <div className="flex items-center justify-between py-0.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </>
            ) : (
              <>
                {[
                  { label: 'Total Guru', value: teachers.length },
                  { label: 'Total Kelas', value: classes.length },
                  { label: 'Kelas Terisi', value: filledClassCount },
                ].map((kpi) => (
                  <div key={kpi.label} className="flex items-center justify-between py-0.5">
                    <span className="text-[10px] font-bold text-black">{kpi.label}</span>
                    <span className="text-[10px] font-bold text-blue-600 tabular-nums">
                      {kpi.value}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ══ KONTEN UTAMA ═════════════════════════════════════════════ */}
      <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-white">
        {/* Breadcrumb */}
        <div className="flex shrink-0 items-center justify-between border-b-2 border-black bg-white px-5 py-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-black uppercase">Panel Admin</span>
            <ChevronRight className="h-3.5 w-3.5 text-black" />
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              {isPerpusTab ? 'Perpustakaan' : activeMenu?.label || '—'}
            </span>
          </div>

          {isModal && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border-2 border-black bg-white px-3 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
            >
              Tutup
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="relative w-full flex-1 overflow-y-auto bg-white p-5">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <>
              {activeTab === 'kelas' && <TabKelolaKelas setNotice={handleNotice} />}
              {activeTab === 'master-akademik' && <TabMasterAkademik setNotice={handleNotice} />}
              {activeTab === 'tambah-guru' && <TabTambahGuru setNotice={handleNotice} />}
              {activeTab === 'tambah-siswa' && <TabTambahSiswa setNotice={handleNotice} />}
              {activeTab === 'akun-guru' && <TabAkunGuru setNotice={handleNotice} />}
              {activeTab === 'tagihan' && <TabTagihanSekolah scope={scope} />}
              {activeTab === 'pengumuman-admin' && <TabPengumumanAdmin scope={scope} />}
              {activeTab === 'pesan-masuk' && <PesanMasuk />}
              {activeTab === 'akun-orang-tua' && <TabAkunOrangTua setNotice={handleNotice} />}
              {activeTab === 'riwayat-login' && <TabRiwayatLogin />}
              {activeTab === 'akun-siswa' && <TabAkunSiswa />}
              {activeTab === 'ppdb-admin' && (
                <AdminPanel onClose={() => setActiveTab('akun-siswa')} embedded />
              )}
              {activeTab === 'kelola-roster' && <TabKelolaRoster setNotice={handleNotice} />}

              {/* Menu Perpustakaan */}
              <Suspense
                fallback={
                  <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  </div>
                }
              >
                {activeTab === 'perpus-dashboard' && <PerpusDashboard />}
                {activeTab === 'perpus-inventori' && (
                  <PerpusInventori onViewDetail={handleViewDetail} />
                )}
                {activeTab.startsWith('perpus-master-') && (
                  <PerpusMasterData activeSubTab={activeTab.replace('perpus-master-', '')} />
                )}
                {activeTab.startsWith('perpus-transaksi-') && (
                  <PerpusTransaksi
                    activeSubTab={
                      activeTab.replace('perpus-transaksi-', '') as 'pinjam' | 'kembali'
                    }
                  />
                )}
                {activeTab === 'perpus-detail' && (
                  <PerpusDetailBuku bookId={selectedBookId} onBack={handleBackToInventori} />
                )}
              </Suspense>
            </>
          )}

          {localNotice && (
            <div className="fixed right-4 bottom-4 z-50 rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition-all">
              {localNotice}
            </div>
          )}
        </div>
      </main>
    </section>
  );

  if (isModal) {
    return <div className="fixed inset-0 z-[100] flex items-stretch bg-white">{panel}</div>;
  }

  return panel;
}
