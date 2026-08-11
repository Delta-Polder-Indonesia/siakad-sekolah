// src/fitur/halaman/ExpectationModal.tsx
import React, { useRef, useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { navItems } from './data/navigation/data';
import type { ExpectationModalProps, NavItem } from './types';
import { NavigationContext } from './context/NavigationContext';
import { namaSekolahUppercase, isSmk } from './components/Profile/dataSekolah';

// ── Lazy load semua page ──────────────────────────────────────
const BerandaPage = lazy(() => import('./pages/BerandaPage'));
const BeritaPage = lazy(() => import('./pages/BeritaPage'));
const GaleriPage = lazy(() => import('./pages/GaleriPage'));
const KegiatanSekolahPage = lazy(() => import('./pages/KegiatanSekolahPage'));
const KontakPage = lazy(() => import('./pages/KontakPage'));
const ProfilPage = lazy(() => import('./pages/ProfilPage'));
const ProgramSekolahPage = lazy(() => import('./pages/ProgramSekolahPage'));
const ProgramKeahlianPage = lazy(() => import('./pages/ProgramKeahlianPage'));
const SaranaPrasaranaPage = lazy(() => import('./pages/SaranaPrasaranaPage'));
const AgendaPage = lazy(() => import('./components/KalenderAkademik/AgendaPage'));
const ProgramFooter = lazy(() => import('../../layout/ProgramFooter'));

// Detail Program Sekolah
const Program1Page = lazy(() => import('./components/ProgramSekolah/Program-1'));
const Program2Page = lazy(() => import('./components/ProgramSekolah/Program-2'));
const Program3Page = lazy(() => import('./components/ProgramSekolah/Program-3'));
const Program4Page = lazy(() => import('./components/ProgramSekolah/Program-4'));
const Program5Page = lazy(() => import('./components/ProgramSekolah/Program-5'));

// Detail Berita
const Berita01Page = lazy(() => import('./components/Berita/Berita01'));
const Berita02Page = lazy(() => import('./components/Berita/Berita02'));
const Berita03Page = lazy(() => import('./components/Berita/Berita03'));
const Berita04Page = lazy(() => import('./components/Berita/Berita04'));

// Detail Kegiatan Sekolah
const Strategis01Page = lazy(() => import('./components/KegiatanSekolah/Strategis01'));
const Strategis02Page = lazy(() => import('./components/KegiatanSekolah/Strategis02'));
const Strategis03Page = lazy(() => import('./components/KegiatanSekolah/Strategis03'));
const Strategis04Page = lazy(() => import('./components/KegiatanSekolah/Strategis04'));
const Strategis05Page = lazy(() => import('./components/KegiatanSekolah/Strategis05'));

// Detail Program Keahlian
const Reg01Page = lazy(() => import('./components/ProgramKeahlian/REG-01'));
const Reg02Page = lazy(() => import('./components/ProgramKeahlian/REG-02'));
const Reg03Page = lazy(() => import('./components/ProgramKeahlian/REG-03'));
const Reg04Page = lazy(() => import('./components/ProgramKeahlian/REG-04'));
const Reg05Page = lazy(() => import('./components/ProgramKeahlian/REG-05'));
const Reg06Page = lazy(() => import('./components/ProgramKeahlian/REG-06'));
const Reg07Page = lazy(() => import('./components/ProgramKeahlian/REG-07'));

// Detail Sarana Prasarana
const Facility01Page = lazy(() => import('./components/SaranaPrasarana/Facility01'));
const Facility02Page = lazy(() => import('./components/SaranaPrasarana/Facility02'));
const Facility03Page = lazy(() => import('./components/SaranaPrasarana/Facility03'));
const Facility04Page = lazy(() => import('./components/SaranaPrasarana/Facility04'));
const Facility05Page = lazy(() => import('./components/SaranaPrasarana/Facility05'));
const Facility06Page = lazy(() => import('./components/SaranaPrasarana/Facility06'));
const Facility07Page = lazy(() => import('./components/SaranaPrasarana/Facility07'));
const Facility08Page = lazy(() => import('./components/SaranaPrasarana/Facility08'));

// Detail Ebook
const Ebook1Page = lazy(() => import('./components/Ebook/ebook_1'));
const Ebook2Page = lazy(() => import('./components/Ebook/ebook_2'));
const Ebook3Page = lazy(() => import('./components/Ebook/ebook_3'));
const Ebook4Page = lazy(() => import('./components/Ebook/ebook_4'));
const Ebook5Page = lazy(() => import('./components/Ebook/ebook_5'));
const Ebook6Page = lazy(() => import('./components/Ebook/ebook_6'));
const Ebook7Page = lazy(() => import('./components/Ebook/ebook_7'));
const Ebook8Page = lazy(() => import('./components/Ebook/ebook_8'));

// Detail Ekstrakurikuler
const Ekskul1Page = lazy(() => import('./components/Ekstrakurikuler/Ekskul-1'));
const Ekskul2Page = lazy(() => import('./components/Ekstrakurikuler/Ekskul-2'));
const Ekskul3Page = lazy(() => import('./components/Ekstrakurikuler/Ekskul-3'));
const Ekskul4Page = lazy(() => import('./components/Ekstrakurikuler/Ekskul-4'));
const Ekskul5Page = lazy(() => import('./components/Ekstrakurikuler/Ekskul-5'));
const Ekskul6Page = lazy(() => import('./components/Ekstrakurikuler/Ekskul-6'));
const Ekskul7Page = lazy(() => import('./components/Ekstrakurikuler/Ekskul-7'));
const Ekskul8Page = lazy(() => import('./components/Ekstrakurikuler/Ekskul-8'));
const Ekskul9Page = lazy(() => import('./components/Ekstrakurikuler/Ekskul-9'));
// Detail Profil Kepala Sekolah
const ProfileKepsekPage = lazy(() => import('./components/Profile/ProfileKepsek/ProfileKepsek'));
const Ekskul10Page = lazy(() => import('./components/Ekstrakurikuler/Ekskul-10'));

// Detail Pendidikan
// Detail Sila
const Sila01 = lazy(() => import('./components/SilaAsa/Sila/Sila01'));
const Sila02 = lazy(() => import('./components/SilaAsa/Sila/Sila02'));
const Sila03 = lazy(() => import('./components/SilaAsa/Sila/Sila03'));
const Sila04 = lazy(() => import('./components/SilaAsa/Sila/Sila04'));
const Sila05 = lazy(() => import('./components/SilaAsa/Sila/Sila05'));
const Sila06 = lazy(() => import('./components/SilaAsa/Sila/Sila06'));
const Sila07 = lazy(() => import('./components/SilaAsa/Sila/Sila07'));

// Detail Asa
const Asa01 = lazy(() => import('./components/SilaAsa/Asa/Asa01'));
const Asa02 = lazy(() => import('./components/SilaAsa/Asa/Asa02'));
const Asa03 = lazy(() => import('./components/SilaAsa/Asa/Asa03'));
const Asa04 = lazy(() => import('./components/SilaAsa/Asa/Asa04'));
const Asa05 = lazy(() => import('./components/SilaAsa/Asa/Asa05'));
const Asa06 = lazy(() => import('./components/SilaAsa/Asa/Asa06'));
const Asa07 = lazy(() => import('./components/SilaAsa/Asa/Asa07'));
const Asa08 = lazy(() => import('./components/SilaAsa/Asa/Asa08'));
const Asa09 = lazy(() => import('./components/SilaAsa/Asa/Asa09'));
const Asa10 = lazy(() => import('./components/SilaAsa/Asa/Asa10'));
const Asa11 = lazy(() => import('./components/SilaAsa/Asa/Asa11'));
const Asa12 = lazy(() => import('./components/SilaAsa/Asa/Asa12'));
const Asa13 = lazy(() => import('./components/SilaAsa/Asa/Asa13'));
const Asa14 = lazy(() => import('./components/SilaAsa/Asa/Asa14'));

// Detail Sekolah Berdampak
const SekolahBerdampakPage = lazy(
  () => import('./components/SekolahBerdampakDetail/SekolahBerdampakPage')
);

// Detail Research
const RisetAirBersihPage = lazy(() => import('./components/ResearchDetail/RisetAirBersih'));
const RisetInfrastrukturPage = lazy(() => import('./components/ResearchDetail/RisetInfrastruktur'));
const RisetDigitalisasiPage = lazy(() => import('./components/ResearchDetail/RisetDigitalisasi'));

// Detail SDGs
const Sdgs1 = lazy(() => import('./components/SdgsDetail/Sdgs1'));
const Sdgs2 = lazy(() => import('./components/SdgsDetail/Sdgs2'));
const Sdgs3 = lazy(() => import('./components/SdgsDetail/Sdgs3'));
const Sdgs4 = lazy(() => import('./components/SdgsDetail/Sdgs4'));
const Sdgs5 = lazy(() => import('./components/SdgsDetail/Sdgs5'));
const Sdgs6 = lazy(() => import('./components/SdgsDetail/Sdgs6'));
const Sdgs7 = lazy(() => import('./components/SdgsDetail/Sdgs7'));
const Sdgs8 = lazy(() => import('./components/SdgsDetail/Sdgs8'));
const Sdgs9 = lazy(() => import('./components/SdgsDetail/Sdgs9'));
const Sdgs10 = lazy(() => import('./components/SdgsDetail/Sdgs10'));
const Sdgs11 = lazy(() => import('./components/SdgsDetail/Sdgs11'));
const Sdgs12 = lazy(() => import('./components/SdgsDetail/Sdgs12'));
const Sdgs13 = lazy(() => import('./components/SdgsDetail/Sdgs13'));
const Sdgs14 = lazy(() => import('./components/SdgsDetail/Sdgs14'));
const Sdgs15 = lazy(() => import('./components/SdgsDetail/Sdgs15'));
const Sdgs16 = lazy(() => import('./components/SdgsDetail/Sdgs16'));
const Sdgs17 = lazy(() => import('./components/SdgsDetail/Sdgs17'));

// ── Hero config ───────────────────────────────────────────────
const HERO_CONFIG: Record<string, { title: string; description: string; image: string }> = {
  Profil: {
    title: 'Profil Sekolah',
    description: `Mengenal lebih jauh sejarah, visi, misi, dan nilai-nilai yang menjadi fondasi ${namaSekolahUppercase}.`,
    image: 'images/Dashboard/logo-profile.png',
  },
  'Program Sekolah': {
    title: 'Program Sekolah',
    description:
      'Berbagai program unggulan yang dirancang untuk mendukung perkembangan akademik dan karakter siswa.',
    image: 'images/Dashboard/logo-profile.png',
  },
  'Program Keahlian': {
    title: 'Program Keahlian',
    description: 'Program keahlian yang mempersiapkan siswa menghadapi tantangan di era modern.',
    image: 'images/Dashboard/logo-profile.png',
  },
  'Sarana Prasarana': {
    title: 'Sarana Prasarana',
    description:
      'Fasilitas lengkap dan modern untuk mendukung proses belajar mengajar yang efektif.',
    image: 'images/Dashboard/logo-profile.png',
  },
  'Kegiatan Sekolah': {
    title: 'Kegiatan Sekolah',
    description: `Dokumentasi berbagai kegiatan akademik dan non-akademik di ${namaSekolahUppercase}.`,
    image: 'images/Dashboard/logo-profile.png',
  },
  Berita: {
    title: 'Berita Terkini',
    description: `Informasi dan berita terkini seputar ${namaSekolahUppercase}.`,
    image: 'images/Dashboard/logo-profile.png',
  },
  Galeri: {
    title: 'Galeri',
    description: `Galeri foto kegiatan dan momen berharga di ${namaSekolahUppercase}.`,
    image: 'images/Dashboard/logo-profile.png',
  },
  Kontak: {
    title: 'Kontak Kami',
    description: `Hubungi kami untuk informasi lebih lanjut mengenai ${namaSekolahUppercase}.`,
    image: 'images/Dashboard/logo-profile.png',
  },
  Agenda: {
    title: 'Kalender Akademik',
    description: `Jadwal lengkap kegiatan akademik, non-akademik, dan agenda strategis ${namaSekolahUppercase}.`,
    image: 'images/Dashboard/sekolah-1.jpg',
  },
  details: {
    title: 'Detail Informasi',
    description: 'Lihat detail informasi lebih lanjut.',
    image: 'images/Dashboard/sekolah-1.webp',
  },
};

// ── Loading fallback ──────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
    </div>
  );
}

// ── Komponen utama ────────────────────────────────────────────
export default function ExpectationModal({
  open,
  onClose,
  onOpenRegistration,
}: ExpectationModalProps) {
  const [activeMenu, setActiveMenu] = useState<NavItem>('Beranda');
  // Stack riwayat halaman yang dikunjungi — tombol kembali mundur bertahap
  // (6→5→4→…→1), bukan lompat langsung ke Beranda. Disimpan di ref supaya
  // tetap sinkron saat tombol back browser ditekan berulang kali.
  const historyRef = useRef<NavItem[]>([]);
  // Jumlah entri yang sudah ditambahkan ke riwayat browser (marker pembuka +
  // satu marker tiap navigasi). Dipakai untuk membersihkan riwayat saat modal ditutup.
  const pushedCountRef = useRef(0);
  const [showAgenda, setShowAgenda] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  // Simpan posisi scroll per halaman — saat kembali, posisi scroll dipulihkan
  // ke tempat user terakhir mengklik, bukan reset ke paling atas.
  const scrollPositions = useRef<Record<string, number>>({});
  // Tab aktif halaman Profil — disimpan di ref agar tetap teringat saat halaman
  // detail (misal Profil Kepala Sekolah) dibuka lalu tombol kembali dipakai,
  // sehingga kembali ke tab yang sama (misal Sambutan Kepala Sekolah).
  const profilTabRef = useRef<number>(1);

  const saveScroll = useCallback(() => {
    if (contentRef.current) {
      scrollPositions.current[activeMenu] = contentRef.current.scrollTop;
    }
  }, [activeMenu]);

  const resetScroll = useCallback(() => {
    // Penggunaan requestAnimationFrame yang lebih stabil daripada setTimeout
    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    });
  }, []);

  const restoreScroll = useCallback((page: NavItem) => {
    const pos = scrollPositions.current[page] ?? 0;
    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = pos;
      }
    });
  }, []);

  const handleNavigate = useCallback(
    (menu: NavItem) => {
      if (menu === 'Agenda') {
        setShowAgenda(true);
        return;
      }
      setShowAgenda(false);
      // Simpan halaman sebelumnya ke stack sebelum pindah
      if (menu !== activeMenu) {
        saveScroll();
        historyRef.current = [...historyRef.current, activeMenu];
        setActiveMenu(menu);
        // Sinkronkan dengan riwayat browser supaya tombol back browser
        // juga bisa mundur satu per satu di dalam modal.
        window.history.pushState({ expectationModal: true }, '');
        pushedCountRef.current += 1;
      }
      resetScroll();
    },
    [activeMenu, resetScroll, saveScroll]
  );

  const performGoBack = useCallback(() => {
    setShowAgenda(false);
    if (historyRef.current.length > 0) {
      const prev = historyRef.current[historyRef.current.length - 1];
      historyRef.current = historyRef.current.slice(0, -1);
      setActiveMenu(prev);
      restoreScroll(prev);
    } else {
      onClose();
    }
  }, [onClose, restoreScroll]);

  // Tutup modal dari tombol dalam aplikasi: pop entri riwayat browser yang
  // sudah ditambahkan supaya tombol back browser tidak melintasi sisa-sisanya.
  const closeModal = useCallback(() => {
    const count = pushedCountRef.current;
    pushedCountRef.current = 0;
    if (count > 0) {
      window.history.go(-count);
    }
    onClose();
  }, [onClose]);

  const handleGoBack = useCallback(() => {
    // Sinkronkan tombol kembali di dalam aplikasi dengan riwayat browser.
    // Selama masih ada entri yang ditambahkan lewat pushState, pop satu entri
    // dengan history.back() — event popstate akan memproses mundurnya
    // (mengurangi pushedCount, pop historyRef, dan memulihkan posisi scroll).
    // Dengan begitu historyRef, pushedCount, dan riwayat browser selalu sinkron
    // sehingga tombol back browser setelahnya tidak lompat keluar ke halaman login.
    if (pushedCountRef.current > 1) {
      window.history.back();
    } else {
      closeModal();
    }
  }, [closeModal]);

  // Tutup modal dengan Escape & Body Scroll Locking
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, closeModal]);

  // Tandai posisi awal di riwayat browser saat modal dibuka, supaya tombol
  // back browser menutup modal (bukan langsung keluar dari aplikasi).
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ expectationModal: true }, '');
    pushedCountRef.current = 1;
  }, [open]);

  // Tombol back browser: mundur satu halaman di dalam modal, lalu menutup
  // modal jika sudah berada di halaman awal.
  useEffect(() => {
    if (!open) return;
    const handlePopState = () => {
      pushedCountRef.current = Math.max(0, pushedCountRef.current - 1);
      performGoBack();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [open, performGoBack]);

  const renderPage = () => {
    const props = { onNavigate: handleNavigate };
    const registerProps = {
      ...props,
      onRegister: () => {
        closeModal();
        onOpenRegistration?.();
      },
      onShowAgenda: () => setShowAgenda(true),
    };

    switch (activeMenu) {
      case 'Beranda':
        return <BerandaPage {...registerProps} />;
      case 'Profil':
        return <ProfilPage {...props} profilTabRef={profilTabRef} />;
      case 'Program Sekolah':
        return <ProgramSekolahPage {...props} />;
      case 'Program Keahlian':
        return <ProgramKeahlianPage {...props} />;
      case 'Sarana Prasarana':
        return <SaranaPrasaranaPage {...props} />;
      case 'Kegiatan Sekolah':
        return <KegiatanSekolahPage {...props} />;
      case 'Berita':
        return <BeritaPage {...props} />;
      case 'Galeri':
        return <GaleriPage {...props} />;
      case 'Kontak':
        return <KontakPage {...props} />;

      // Detail Sekolah Berdampak
      case 'sekolah-berdampak':
        return <SekolahBerdampakPage />;
      case 'diktisaintek-berdampak':
        return <SekolahBerdampakPage />;

      // Detail Research
      case 'riset/riset-air-bersih':
        return <RisetAirBersihPage />;
      case 'riset/riset-infrastruktur':
        return <RisetInfrastrukturPage />;
      case 'riset/riset-digitalisasi':
        return <RisetDigitalisasiPage />;

      // Detail SDGs
      case 'sdgs/sdgs-1':
        return <Sdgs1 />;
      case 'sdgs/sdgs-2':
        return <Sdgs2 />;
      case 'sdgs/sdgs-3':
        return <Sdgs3 />;
      case 'sdgs/sdgs-4':
        return <Sdgs4 />;
      case 'sdgs/sdgs-5':
        return <Sdgs5 />;
      case 'sdgs/sdgs-6':
        return <Sdgs6 />;
      case 'sdgs/sdgs-7':
        return <Sdgs7 />;
      case 'sdgs/sdgs-8':
        return <Sdgs8 />;
      case 'sdgs/sdgs-9':
        return <Sdgs9 />;
      case 'sdgs/sdgs-10':
        return <Sdgs10 />;
      case 'sdgs/sdgs-11':
        return <Sdgs11 />;
      case 'sdgs/sdgs-12':
        return <Sdgs12 />;
      case 'sdgs/sdgs-13':
        return <Sdgs13 />;
      case 'sdgs/sdgs-14':
        return <Sdgs14 />;
      case 'sdgs/sdgs-15':
        return <Sdgs15 />;
      case 'sdgs/sdgs-16':
        return <Sdgs16 />;
      case 'sdgs/sdgs-17':
        return <Sdgs17 />;
      case 'sdgs-sekolah':
        return <SekolahBerdampakPage />;

      // Detail Sila
      case 'sila-1':
        return <Sila01 />;
      case 'sila-2':
        return <Sila02 />;
      case 'sila-3':
        return <Sila03 />;
      case 'sila-4':
        return <Sila04 />;
      case 'sila-5':
        return <Sila05 />;
      case 'sila-6':
        return <Sila06 />;
      case 'sila-7':
        return <Sila07 />;

      // Detail Asa
      case 'asa-1':
        return <Asa01 />;
      case 'asa-2':
        return <Asa02 />;
      case 'asa-3':
        return <Asa03 />;
      case 'asa-4':
        return <Asa04 />;
      case 'asa-5':
        return <Asa05 />;
      case 'asa-6':
        return <Asa06 />;
      case 'asa-7':
        return <Asa07 />;
      case 'asa-8':
        return <Asa08 />;
      case 'asa-9':
        return <Asa09 />;
      case 'asa-10':
        return <Asa10 />;
      case 'asa-11':
        return <Asa11 />;
      case 'asa-12':
        return <Asa12 />;
      case 'asa-13':
        return <Asa13 />;
      case 'asa-14':
        return <Asa14 />;

      // Detail Program Sekolah
      case 'program-1':
        return <Program1Page {...props} />;
      case 'program-2':
        return <Program2Page {...props} />;
      case 'program-3':
        return <Program3Page {...props} />;
      case 'program-4':
        return <Program4Page {...props} />;
      case 'program-5':
        return <Program5Page {...props} />;

      // Detail Berita
      case 'berita-1':
        return <Berita01Page {...props} />;
      case 'berita-2':
        return <Berita02Page {...props} />;
      case 'berita-3':
        return <Berita03Page {...props} />;
      case 'berita-4':
        return <Berita04Page {...props} />;

      // Detail Kegiatan Sekolah
      case 'kegiatan-1':
        return <Strategis01Page {...props} />;
      case 'kegiatan-2':
        return <Strategis02Page {...props} />;
      case 'kegiatan-3':
        return <Strategis03Page {...props} />;
      case 'kegiatan-4':
        return <Strategis04Page {...props} />;
      case 'kegiatan-5':
        return <Strategis05Page {...props} />;

      // Detail Program Keahlian
      case 'reg-01':
        return <Reg01Page {...props} />;
      case 'reg-02':
        return <Reg02Page {...props} />;
      case 'reg-03':
        return <Reg03Page {...props} />;
      case 'reg-04':
        return <Reg04Page {...props} />;
      case 'reg-05':
        return <Reg05Page {...props} />;
      case 'reg-06':
        return <Reg06Page {...props} />;
      case 'reg-07':
        return <Reg07Page {...props} />;

      // Detail Ebook
      case 'ebook-1':
        return <Ebook1Page />;
      case 'ebook-2':
        return <Ebook2Page />;
      case 'ebook-3':
        return <Ebook3Page />;
      case 'ebook-4':
        return <Ebook4Page />;
      case 'ebook-5':
        return <Ebook5Page />;
      case 'ebook-6':
        return <Ebook6Page />;
      case 'ebook-7':
        return <Ebook7Page />;
      case 'ebook-8':
        return <Ebook8Page />;

      // Detail Sarana Prasarana
      case 'facility-1':
        return <Facility01Page {...props} />;
      case 'facility-2':
        return <Facility02Page {...props} />;
      case 'facility-3':
        return <Facility03Page {...props} />;
      case 'facility-4':
        return <Facility04Page {...props} />;
      case 'facility-5':
        return <Facility05Page {...props} />;
      case 'facility-6':
        return <Facility06Page {...props} />;
      case 'facility-7':
        return <Facility07Page {...props} />;
      case 'facility-8':
        return <Facility08Page {...props} />;

      // Detail Ekstrakurikuler
      case 'ekskul-1':
        return <Ekskul1Page {...props} />;
      case 'ekskul-2':
        return <Ekskul2Page {...props} />;
      case 'ekskul-3':
        return <Ekskul3Page {...props} />;
      case 'ekskul-4':
        return <Ekskul4Page {...props} />;
      case 'ekskul-5':
        return <Ekskul5Page {...props} />;
      case 'ekskul-6':
        return <Ekskul6Page {...props} />;
      case 'ekskul-7':
        return <Ekskul7Page {...props} />;
      case 'ekskul-8':
        return <Ekskul8Page {...props} />;
      case 'ekskul-9':
        return <Ekskul9Page {...props} />;
      case 'ekskul-10':
        return <Ekskul10Page {...props} />;

      // Detail Profil Kepala Sekolah
      case 'profile-kepsek':
        return <ProfileKepsekPage />;

      default:
        return <BerandaPage {...registerProps} />;
    }
  };

  const ctxValue = useMemo(
    () => ({
      goBack: handleGoBack,
      navigateTo: (menu: string) => handleNavigate(menu as NavItem),
      isModalNavigation: true,
    }),
    [handleGoBack, handleNavigate]
  );

  if (!open) return null;

  const isBeranda = activeMenu === 'Beranda';
  const hero = !isBeranda ? (HERO_CONFIG[activeMenu] ?? null) : null;

  const isDetailPage = !(
    [
      'Beranda',
      'Profil',
      'Program Sekolah',
      'Program Keahlian',
      'Sarana Prasarana',
      'Kegiatan Sekolah',
      'Berita',
      'Galeri',
      'Kontak',
      'Agenda',
    ] as NavItem[]
  ).includes(activeMenu);

  return (
    <MemoryRouter>
      <NavigationContext.Provider value={ctxValue}>
        {isDetailPage ? (
          <div className="fixed inset-0 z-[100] overflow-hidden bg-slate-900/60">
            <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>

            {showAgenda && (
              <Suspense fallback={<PageLoader />}>
                <AgendaPage onNavigate={() => setShowAgenda(false)} />
              </Suspense>
            )}
          </div>
        ) : (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="school-modal-title"
            className="fixed inset-0 z-[100] overflow-hidden bg-slate-900/60"
          >
            <div className="flex h-screen w-full flex-col overflow-hidden bg-white shadow-2xl">
              <div
                ref={contentRef}
                className="relative flex min-h-0 flex-grow flex-col overflow-y-auto overscroll-contain bg-white"
              >
                {/* ── HEADER ── */}
                <header className="absolute top-0 right-0 left-0 z-50 w-full bg-transparent">
                  <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
                    {/* Logo + tombol tutup */}
                    <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Tutup modal"
                        className="-ml-1 flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </button>

                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md shadow-black/30 md:h-10 md:w-10">
                          <img
                            src={`${import.meta.env.BASE_URL}images/logo/gambar-2.svg`}
                            alt={`Logo ${namaSekolahUppercase}`}
                            className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                        </div>
                        <div>
                          <h1
                            id="school-modal-title"
                            className="text-sm leading-tight font-bold tracking-tight text-white drop-shadow-md md:text-base lg:text-lg"
                          >
                            {namaSekolahUppercase}
                          </h1>
                          <p className="hidden text-[9px] font-semibold tracking-[0.12em] text-white/80 uppercase drop-shadow sm:block">
                            Sekolah Unggulan Yang Menghasilkan SDM Bermutu
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Nav desktop */}
                    <nav className="hidden flex-shrink-0 md:block">
                      <ul className="header-scrollbar-hidden flex items-center gap-0.5 overflow-x-auto whitespace-nowrap lg:gap-1">
                        {navItems.map((item) => (
                          <li key={item} className="relative flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleNavigate(item)}
                              aria-current={activeMenu === item ? 'page' : undefined}
                              className={`relative cursor-pointer px-2 py-2 text-sm font-semibold transition-colors lg:px-3 ${
                                activeMenu === item
                                  ? 'text-white drop-shadow'
                                  : 'text-white/70 drop-shadow hover:text-white'
                              }`}
                            >
                              {item}
                              {activeMenu === item && (
                                <span
                                  aria-hidden="true"
                                  className="absolute right-2 bottom-0 left-2 h-0.5 rounded-full bg-amber-400 lg:right-3 lg:left-3"
                                />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>

                  {/* Nav mobile */}
                  <nav className="px-4 md:hidden">
                    <div className="header-scrollbar-hidden touch-pan-x overflow-x-auto [-webkit-overflow-scrolling:touch]">
                      <ul className="inline-flex min-w-max items-center gap-0.5 py-1 whitespace-nowrap">
                        {navItems.map((item) => (
                          <li key={item} className="relative flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleNavigate(item)}
                              aria-current={activeMenu === item ? 'page' : undefined}
                              className={`relative cursor-pointer px-2 py-1.5 text-xs font-semibold transition-colors ${
                                activeMenu === item
                                  ? 'text-white drop-shadow'
                                  : 'text-white/70 drop-shadow hover:text-white'
                              }`}
                            >
                              {item}
                              {activeMenu === item && (
                                <span
                                  aria-hidden="true"
                                  className="absolute right-1 bottom-0 left-1 h-0.5 rounded-full bg-amber-400"
                                />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </nav>
                </header>

                {/* ── HERO SECTION ── */}
                {hero && (
                  <section className="relative h-[400px] w-full flex-shrink-0 bg-slate-900 lg:h-[500px]">
                    <img
                      src={`${import.meta.env.BASE_URL}${hero.image}`}
                      alt={hero.title}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      draggable="false"
                      decoding="async" loading="lazy" />

                    <div
                      className="absolute inset-0 z-[1]"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.16) 30%, rgba(0,0,0,0.80) 100%)',
                      }}
                    />

                    <div className="relative z-[2] mx-auto flex h-full w-full max-w-[1080px] flex-col justify-end gap-4 px-6 pb-6 lg:px-8 lg:pb-16 xl:max-w-7xl xl:pb-[72px]">
                      <div className="hero-text-1 flex items-center gap-2 text-xs text-white md:text-sm">
                        <button
                          type="button"
                          onClick={() => handleNavigate('Beranda')}
                          className="cursor-pointer hover:underline"
                        >
                          Home
                        </button>
                        <span>/</span>
                        <span>{activeMenu}</span>
                      </div>

                      <h2 className="hero-text-2 line-clamp-2 w-full text-3xl leading-normal font-bold text-white drop-shadow-md md:text-[38px] lg:w-1/2">
                        {hero.title}
                      </h2>

                      <p className="hero-text-3 w-full max-w-[840px] text-sm leading-relaxed font-normal text-white/90 drop-shadow-sm md:text-base">
                        {hero.description}
                      </p>
                    </div>
                  </section>
                )}

                {/* ── KONTEN HALAMAN ── */}
                <main className="flex-grow bg-white">
                  <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>
                </main>

                {/* ── FOOTER ── */}
                <Suspense fallback={null}>
                  <ProgramFooter onNavigate={handleNavigate} />
                </Suspense>
              </div>
            </div>

            {/* ── AGENDA OVERLAY ── */}
            {showAgenda && (
              <Suspense fallback={<PageLoader />}>
                <AgendaPage onNavigate={() => setShowAgenda(false)} />
              </Suspense>
            )}
          </div>
        )}
      </NavigationContext.Provider>
    </MemoryRouter>
  );
}
