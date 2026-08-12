import { useState, useEffect, useCallback } from 'react';
import type { ComponentType } from 'react';
import { PageProps } from '../types';
import { useAuth } from '../context/AuthContext';
import { pageToPath, pathToPage } from '../routes';
import Sidebar from './Sidebar';
import { GuestBookProvider } from '../fitur/tamu/context/GuestBookContext';
import { NotificationProvider } from '../fitur/bersama/NotificationProvider';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { ToastProvider } from '../components/ui/Toast';
import { lazyPage } from '../components/ui/LazyLoad';
import type { AdminGuruPanelProps } from '../fitur/admin/PanelAdminModal';

// ── Lazy-loaded page components (split by role) ──
// Teacher pages
const LazyDasborGuru = lazyPage(() => import('../fitur/guru/DasborGuru'));
const LazyHalamanAbsensi = lazyPage(() => import('../fitur/guru/HalamanAbsensi'));
const LazyHalamanLaporan = lazyPage(() => import('../fitur/guru/HalamanLaporan'));
const LazyAturPengumumanGuru = lazyPage(() => import('../fitur/guru/AturPengumumanGuru'));
const LazyAturTugasOnlineGuru = lazyPage(() => import('../fitur/guru/AturTugasOnlineGuru'));
const LazyProfilGuru = lazyPage(() => import('../fitur/guru/ProfilGuru'));
const LazyKotakSuratGuru = lazyPage(() => import('../fitur/guru/KotakSuratGuru'));
const LazyInputRapotGuru = lazyPage(() => import('../fitur/guru/InputRapotGuru'));
const LazyJurnalMengajarGuru = lazyPage(() => import('../fitur/guru/JurnalMengajarGuru'));
const LazyRekapNilaiGuru = lazyPage(() => import('../fitur/guru/RekapNilaiGuru'));
const LazyManajemenSiswaGuru = lazyPage(() => import('../fitur/guru/ManajemenSiswa'));
const LazyDasborWaliKelas = lazyPage(() => import('../fitur/guru/DasborWaliKelas'));
const LazyBimbinganKonseling = lazyPage(() => import('../fitur/guru/BimbinganKonseling'));
const LazyManajemenEkskul = lazyPage(() => import('../fitur/admin/ManajemenEkskul'));

// Student pages
const LazyDasborMurid = lazyPage(() => import('../fitur/murid/DasborMurid'));
const LazyRiwayatAbsensi = lazyPage(() => import('../fitur/murid/RiwayatAbsensi'));
const LazyRosterKelas = lazyPage(() => import('../fitur/murid/RosterKelas'));
const LazyKantongTugas = lazyPage(() => import('../fitur/murid/KantongTugas'));
const LazyProfilMurid = lazyPage(() => import('../fitur/murid/ProfilMurid'));
const LazyKirimSuratMurid = lazyPage(() => import('../fitur/murid/KirimSuratMurid'));
const LazyTagihanSekolah = lazyPage(() => import('../fitur/murid/TagihanSekolah'));
const LazyRapotSiswa = lazyPage(() => import('../fitur/murid/RapotSiswa'));
const LazyCatatanBKSiswa = lazyPage(() => import('../fitur/murid/CatatanBKSiswa'));
const LazyEkskulSiswa = lazyPage(() => import('../fitur/murid/EkskulSiswa'));

// Parent pages
const LazyDasborOrangTua = lazyPage(() => import('../fitur/orang-tua/DasborOrangTua'));
const LazyRiwayatAbsensiAnak = lazyPage(() => import('../fitur/orang-tua/RiwayatAbsensiAnak'));
const LazyStatusSuratIzinAnak = lazyPage(() => import('../fitur/orang-tua/StatusSuratIzinAnak'));
const LazyCatatanBKAnak = lazyPage(() => import('../fitur/orang-tua/CatatanBKAnak'));

// Shared pages
const LazyPengaturanAkun = lazyPage(() => import('../fitur/pengaturan/PengaturanAkun'));
const LazyPengumumanSekolah = lazyPage(() => import('../fitur/bersama/PengumumanSekolah'));
const LazyDaftarNamaGuru = lazyPage(() => import('../fitur/bersama/DaftarNamaGuru'));
const LazyPesanMasuk = lazyPage(() => import('../fitur/bersama/PesanMasuk'));
const LazyAgendaPage = lazyPage(
  () => import('../fitur/halaman/components/KalenderAkademik/AgendaPage')
);
const LazyDasborKalenderAkademik = lazyPage(
  () => import('../fitur/halaman/components/KalenderAkademik/DasborKalenderAkademik')
);
const LazyFeedbackPage = lazyPage(() => import('../fitur/halaman/feedback/FeedbackPage'));

// Guest pages
const LazyGuestDashboard = lazyPage(() => import('../fitur/tamu/pages/GuestDashboard'));
const LazyBukuTamuPage = lazyPage(() => import('../fitur/tamu/pages/BukuTamuPage'));
const LazyProfileSaya = lazyPage(() => import('../fitur/tamu/pages/ProfileSaya'));
const LazyBerita = lazyPage(() => import('../fitur/tamu/pages/guest/Berita'));
const LazyEkstrakurikuler = lazyPage(() => import('../fitur/tamu/pages/guest/Ekstrakurikuler'));
const LazyFAQ = lazyPage(() => import('../fitur/tamu/pages/guest/FAQ'));
const LazyFasilitas = lazyPage(() => import('../fitur/tamu/pages/guest/Fasilitas'));
const LazyGaleri = lazyPage(() => import('../fitur/tamu/pages/guest/Galeri'));
const LazyPPDB = lazyPage(() => import('../fitur/tamu/pages/guest/PPDB'));
const LazyPrestasi = lazyPage(() => import('../fitur/tamu/pages/guest/Prestasi'));
const LazyProgramUnggulan = lazyPage(() => import('../fitur/tamu/pages/guest/ProgramUnggulan'));
const LazyVisiMisi = lazyPage(() => import('../fitur/tamu/pages/guest/VisiMisi'));
const LazyTentangSekolah = lazyPage(() => import('../fitur/tamu/pages/guest/TentangSekolah'));
const LazyStrukturOrganisasi = lazyPage(
  () => import('../fitur/tamu/pages/guest/StrukturOrganisasi')
);

const LazyAdminMasterPanel = lazyPage<AdminGuruPanelProps & PageProps>(
  () => import('../fitur/admin/PanelAdminModal')
);

const AdminDashboardPage: ComponentType<PageProps> = () => (
  <LazyAdminMasterPanel scope="teacher" />
);

const GuestDashboardWrapper: ComponentType<PageProps> = ({ onNavigate }) => {
  if (!onNavigate) return null;
  return <LazyGuestDashboard onNavigate={onNavigate} />;
};

const BukuTamuPageWrapper: ComponentType<PageProps> = ({ onNavigate }) => {
  if (!onNavigate) return null;
  return <LazyBukuTamuPage onNavigate={onNavigate} defaultTab="form" />;
};

const DaftarTamuWrapper: ComponentType<PageProps> = ({ onNavigate }) => {
  if (!onNavigate) return null;
  return <LazyBukuTamuPage onNavigate={onNavigate} defaultTab="list" />;
};

const StatistikTamuWrapper: ComponentType<PageProps> = ({ onNavigate }) => {
  if (!onNavigate) return null;
  return <LazyBukuTamuPage onNavigate={onNavigate} defaultTab="stats" />;
};

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

export default function AuthenticatedApp() {
  const { user } = useAuth();

  const pages = getPagesByRole(user?.role);

  // Pulihkan halaman dari URL (deep-link/refresh). Bila path tidak dikenal
  // untuk role, jatuh ke halaman default.
  const pageIdFromLocation = useCallback(
    (role?: string): string => {
      if (!role) return getDefaultPage(role);
      const fromUrl = pathToPage(window.location.pathname, role);
      if (fromUrl && pages[fromUrl]) return fromUrl;
      return getDefaultPage(role);
    },
    [pages]
  );

  const [activePage, setActivePage] = useState<string>(() => pageIdFromLocation(user?.role));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Saat user berganti, pulihkan dari URL (atau default).
  useEffect(() => {
    setActivePage(pageIdFromLocation(user?.role));
  }, [user?.id, user?.role, pageIdFromLocation]);

  // Navigasi browser back/forward: baca URL → aktifkan halaman.
  useEffect(() => {
    const handlePopState = () => {
      setActivePage(pageIdFromLocation(user?.role));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user?.id, user?.role, pageIdFromLocation]);

  // Saat halaman berubah (navigasi via sidebar), sinkronkan URL.
  useEffect(() => {
    if (!user) return;
    const target = pageToPath(activePage, user.role);
    if (window.location.pathname !== target) {
      window.history.pushState({ page: activePage }, '', target);
    }
  }, [activePage, user]);

  // Halaman tidak valid utk role → default.
  useEffect(() => {
    if (user && pages && !pages[activePage]) {
      setActivePage(getDefaultPage(user.role));
    }
  }, [activePage, user, pages]);

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
          </div>
        </ToastProvider>
      </NotificationProvider>
    </GuestBookProvider>
  );
}
