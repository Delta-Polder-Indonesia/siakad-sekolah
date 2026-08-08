import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { PageProps } from './types';
import { useAuth } from './context/AuthContext';
import { initializeData } from './data/services';
import LoginPage from './fitur/autentikasi/LoginPage';
import Sidebar from './layout/Sidebar';
import { GuestBookProvider } from './fitur/tamu/context/GuestBookContext';
import { NotificationProvider } from './fitur/bersama/NotificationProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import { FeedbackButton } from './fitur/halaman/feedback';
import { ToastProvider, lazyPage } from './components/ui';

// ── Lazy-loaded page components (split by role) ──
// Each chunk is loaded only when the user navigates to that page.

// Teacher pages
const LazyDasborGuru = lazyPage(() => import('./fitur/guru/DasborGuru'));
const LazyHalamanAbsensi = lazyPage(() => import('./fitur/guru/HalamanAbsensi'));
const LazyHalamanLaporan = lazyPage(() => import('./fitur/guru/HalamanLaporan'));
const LazyAturPengumumanGuru = lazyPage(() => import('./fitur/guru/AturPengumumanGuru'));
const LazyAturTugasOnlineGuru = lazyPage(() => import('./fitur/guru/AturTugasOnlineGuru'));
const LazyProfilGuru = lazyPage(() => import('./fitur/guru/ProfilGuru'));
const LazyKotakSuratGuru = lazyPage(() => import('./fitur/guru/KotakSuratGuru'));
const LazyInputRapotGuru = lazyPage(() => import('./fitur/guru/InputRapotGuru'));
const LazyJurnalMengajarGuru = lazyPage(() => import('./fitur/guru/JurnalMengajarGuru'));
const LazyRekapNilaiGuru = lazyPage(() => import('./fitur/guru/RekapNilaiGuru'));
const LazyManajemenSiswaGuru = lazyPage(() => import('./fitur/guru/ManajemenSiswa'));
const LazyDasborWaliKelas = lazyPage(() => import('./fitur/guru/DasborWaliKelas'));
const LazyBimbinganKonseling = lazyPage(() => import('./fitur/guru/BimbinganKonseling'));
const LazyManajemenEkskul = lazyPage(() => import('./fitur/admin/ManajemenEkskul'));

// Student pages
const LazyDasborMurid = lazyPage(() => import('./fitur/murid/DasborMurid'));
const LazyRiwayatAbsensi = lazyPage(() => import('./fitur/murid/RiwayatAbsensi'));
const LazyRosterKelas = lazyPage(() => import('./fitur/murid/RosterKelas'));
const LazyKantongTugas = lazyPage(() => import('./fitur/murid/KantongTugas'));
const LazyProfilMurid = lazyPage(() => import('./fitur/murid/ProfilMurid'));
const LazyKirimSuratMurid = lazyPage(() => import('./fitur/murid/KirimSuratMurid'));
const LazyTagihanSekolah = lazyPage(() => import('./fitur/murid/TagihanSekolah'));
const LazyRapotSiswa = lazyPage(() => import('./fitur/murid/RapotSiswa'));
const LazyCatatanBKSiswa = lazyPage(() => import('./fitur/murid/CatatanBKSiswa'));
const LazyEkskulSiswa = lazyPage(() => import('./fitur/murid/EkskulSiswa'));

// Parent pages
const LazyDasborOrangTua = lazyPage(() => import('./fitur/orang-tua/DasborOrangTua'));
const LazyRiwayatAbsensiAnak = lazyPage(() => import('./fitur/orang-tua/RiwayatAbsensiAnak'));
const LazyStatusSuratIzinAnak = lazyPage(() => import('./fitur/orang-tua/StatusSuratIzinAnak'));
const LazyCatatanBKAnak = lazyPage(() => import('./fitur/orang-tua/CatatanBKAnak'));

// Shared pages
const LazyPengaturanAkun = lazyPage(() => import('./fitur/pengaturan/PengaturanAkun'));
const LazyPengumumanSekolah = lazyPage(() => import('./fitur/bersama/PengumumanSekolah'));
const LazyDaftarNamaGuru = lazyPage(() => import('./fitur/bersama/DaftarNamaGuru'));
const LazyPesanMasuk = lazyPage(() => import('./fitur/bersama/PesanMasuk'));
const LazyAgendaPage = lazyPage(
  () => import('./fitur/halaman/components/KalenderAkademik/AgendaPage')
);
const LazyDasborKalenderAkademik = lazyPage(
  () => import('./fitur/halaman/components/KalenderAkademik/DasborKalenderAkademik')
);
const LazyFeedbackPage = lazyPage(() => import('./fitur/halaman/feedback/FeedbackPage'));

// Guest pages
const LazyGuestDashboard = lazyPage(() => import('./fitur/tamu/pages/GuestDashboard'));
const LazyBukuTamuPage = lazyPage(() => import('./fitur/tamu/pages/BukuTamuPage'));
const LazyProfileSaya = lazyPage(() => import('./fitur/tamu/pages/ProfileSaya'));
const LazyBerita = lazyPage(() => import('./fitur/tamu/pages/guest/Berita'));
const LazyEkstrakurikuler = lazyPage(() => import('./fitur/tamu/pages/guest/Ekstrakurikuler'));
const LazyFAQ = lazyPage(() => import('./fitur/tamu/pages/guest/FAQ'));
const LazyFasilitas = lazyPage(() => import('./fitur/tamu/pages/guest/Fasilitas'));
const LazyGaleri = lazyPage(() => import('./fitur/tamu/pages/guest/Galeri'));
const LazyPPDB = lazyPage(() => import('./fitur/tamu/pages/guest/PPDB'));
const LazyPrestasi = lazyPage(() => import('./fitur/tamu/pages/guest/Prestasi'));
const LazyProgramUnggulan = lazyPage(() => import('./fitur/tamu/pages/guest/ProgramUnggulan'));
const LazyVisiMisi = lazyPage(() => import('./fitur/tamu/pages/guest/VisiMisi'));
const LazyTentangSekolah = lazyPage(() => import('./fitur/tamu/pages/guest/TentangSekolah'));
const LazyStrukturOrganisasi = lazyPage(
  () => import('./fitur/tamu/pages/guest/StrukturOrganisasi')
);

// Admin pages (lazy loaded)
const LazyAdminMasterPanel = lazyPage(() => import('./fitur/admin/PanelAdminModal'));

// ── Wrappers for pages with special prop handling ──

const AdminDashboardPage: ComponentType<PageProps> = () => (
  <LazyAdminMasterPanel {...({ scope: 'teacher' } as any)} />
);

const GuestDashboardWrapper: ComponentType<PageProps> = ({ onNavigate }) => {
  if (!onNavigate) return null;
  return <LazyGuestDashboard onNavigate={onNavigate} />;
};

const BukuTamuPageWrapper: ComponentType<PageProps> = ({ onNavigate }) => {
  if (!onNavigate) return null;
  return <LazyBukuTamuPage onNavigate={onNavigate} {...({ defaultTab: 'form' } as any)} />;
};

const DaftarTamuWrapper: ComponentType<PageProps> = ({ onNavigate }) => {
  if (!onNavigate) return null;
  return <LazyBukuTamuPage onNavigate={onNavigate} {...({ defaultTab: 'list' } as any)} />;
};

const StatistikTamuWrapper: ComponentType<PageProps> = ({ onNavigate }) => {
  if (!onNavigate) return null;
  return <LazyBukuTamuPage onNavigate={onNavigate} {...({ defaultTab: 'stats' } as any)} />;
};

// ── Page registries per role ──

const TEACHER_PAGES: Record<string, ComponentType<PageProps>> = {
  dashboard: LazyDasborGuru,
  attendance: LazyHalamanAbsensi,
  report: LazyHalamanLaporan,
  'announcement-settings': LazyAturPengumumanGuru,
  'assignment-settings': LazyAturTugasOnlineGuru,
  'letters-teacher': LazyKotakSuratGuru,
  'rapot-input': LazyInputRapotGuru,
  'jurnal-mengajar': LazyJurnalMengajarGuru,
  'rekap-nilai': LazyRekapNilaiGuru,
  'student-management': LazyManajemenSiswaGuru,
  'wali-kelas': LazyDasborWaliKelas,
  bk: LazyBimbinganKonseling,
  'ekskul-management': LazyManajemenEkskul,
  profile: LazyProfilGuru,
  settings: LazyPengaturanAkun,
  'school-announcements': LazyPengumumanSekolah,
  'personal-messages': LazyPesanMasuk,
  'teacher-announcements': LazyDaftarNamaGuru,
  'academic-agenda': LazyDasborKalenderAkademik,
  feedback: LazyFeedbackPage,
};

const STUDENT_PAGES: Record<string, ComponentType<PageProps>> = {
  dashboard: LazyDasborMurid,
  roster: LazyRosterKelas,
  history: LazyRiwayatAbsensi,
  tasks: LazyKantongTugas,
  'letters-student': LazyKirimSuratMurid,
  rapot: LazyRapotSiswa,
  billing: LazyTagihanSekolah,
  profile: LazyProfilMurid,
  'bk-record': LazyCatatanBKSiswa,
  ekskul: LazyEkskulSiswa,
  settings: LazyPengaturanAkun,
  'school-announcements': LazyPengumumanSekolah,
  'personal-messages': LazyPesanMasuk,
  'teacher-announcements': LazyDaftarNamaGuru,
  'academic-agenda': LazyDasborKalenderAkademik,
  feedback: LazyFeedbackPage,
};

const PARENT_PAGES: Record<string, ComponentType<PageProps>> = {
  dashboard: LazyDasborOrangTua,
  rapot: LazyRapotSiswa,
  billing: LazyTagihanSekolah,
  'school-announcements': LazyPengumumanSekolah,
  'personal-messages': LazyPesanMasuk,
  settings: LazyPengaturanAkun,
  'academic-agenda': LazyDasborKalenderAkademik,
  'attendance-history': LazyRiwayatAbsensiAnak,
  'letters-status': LazyStatusSuratIzinAnak,
  'bk-record': LazyCatatanBKAnak,
  feedback: LazyFeedbackPage,
};

const GUEST_PAGES: Record<string, ComponentType<PageProps>> = {
  dashboard: GuestDashboardWrapper,
  'school-announcements': LazyPengumumanSekolah,
  'teacher-announcements': LazyDaftarNamaGuru,
  'academic-agenda': LazyAgendaPage,
  berita: LazyBerita,
  ekstrakurikuler: LazyEkstrakurikuler,
  faq: LazyFAQ,
  fasilitas: LazyFasilitas,
  galeri: LazyGaleri,
  ppdb: LazyPPDB,
  prestasi: LazyPrestasi,
  'program-unggulan': LazyProgramUnggulan,
  'struktur-organisasi': LazyStrukturOrganisasi,
  'tentang-sekolah': LazyTentangSekolah,
  'visi-misi': LazyVisiMisi,
  'buku-tamu': BukuTamuPageWrapper,
  'daftar-tamu': DaftarTamuWrapper,
  'statistik-tamu': StatistikTamuWrapper,
  profile: LazyProfileSaya,
  feedback: LazyFeedbackPage,
};

const ADMIN_PAGES: Record<string, ComponentType<PageProps>> = {
  'admin-dashboard': AdminDashboardPage,
  'ekskul-management': LazyManajemenEkskul,
  'school-announcements': LazyPengumumanSekolah,
  'teacher-announcements': LazyDaftarNamaGuru,
  'academic-agenda': LazyDasborKalenderAkademik,
  feedback: LazyFeedbackPage,
};

function getPagesByRole(role?: string): Record<string, ComponentType<PageProps>> {
  switch (role) {
    case 'teacher':
      return TEACHER_PAGES;
    case 'student':
      return STUDENT_PAGES;
    case 'parent':
      return PARENT_PAGES;
    case 'guest':
      return GUEST_PAGES;
    case 'admin':
      return ADMIN_PAGES;
    default:
      return {};
  }
}

function getDefaultPage(role?: string): string {
  if (role === 'admin') return 'admin-dashboard';
  return 'school-announcements';
}

function AppContent() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState(() => getDefaultPage(user?.role));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [historyInitialized, setHistoryInitialized] = useState(false);

  const pages = getPagesByRole(user?.role);

  useEffect(() => {
    const initialPage = getDefaultPage(user?.role);
    setActivePage(initialPage);
  }, [user?.id, user?.role]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { page?: string } | null;
      if (state?.page) {
        setActivePage(state.page);
      }
    };

    window.addEventListener('popstate', handlePopState);
    if (!historyInitialized) {
      window.history.replaceState({ page: activePage }, '', window.location.pathname);
      setHistoryInitialized(true);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [historyInitialized, activePage]);

  useEffect(() => {
    if (!historyInitialized) return;
    const currentState = window.history.state as { page?: string } | null;
    if (!currentState || currentState.page !== activePage) {
      window.history.pushState({ page: activePage }, '', window.location.pathname);
    }
  }, [activePage, historyInitialized]);

  useEffect(() => {
    if (user && pages && !pages[activePage]) {
      setActivePage(getDefaultPage(user.role));
    }
  }, [activePage, user, pages]);

  if (!user) return <LoginPage />;

  const PageComponent = pages[activePage];

  return (
    <GuestBookProvider>
      <NotificationProvider>
        <ToastProvider>
          <div className="h-screen overflow-hidden bg-white">
            <Sidebar
              activePage={activePage}
              onNavigate={setActivePage}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
            />
            <main
              className={`fixed top-14 right-0 bottom-0 overflow-y-auto bg-white p-4 transition-[left] duration-300 ease-in-out sm:p-6 lg:p-8 ${
                sidebarCollapsed ? 'left-16' : 'md:left-64'
              }`}
            >
              {PageComponent ? (
                <section key={activePage} className="animate-page-enter block h-full">
                  <ErrorBoundary key={activePage}>
                    <PageComponent onNavigate={setActivePage} isActive={true} />
                  </ErrorBoundary>
                </section>
              ) : null}
            </main>
            <FeedbackButton onNavigate={setActivePage} />
          </div>
        </ToastProvider>
      </NotificationProvider>
    </GuestBookProvider>
  );
}

export default function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
