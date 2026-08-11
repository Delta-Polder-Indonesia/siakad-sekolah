import { useState, useRef, lazy, Suspense } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { namaSekolahUppercase } from '../halaman/components/Profile/dataSekolah';
import PenerimaanSiswa from './pages/PenerimaanSiswa';
import InformasiPPDB from './pages/InformasiPPDB';
import JalurSeleksi from './pages/JalurSeleksi';
import PanduanAlur from './pages/PanduanAlur';
import DokumenWajib from './pages/DokumenWajib';
import SekemaBiaya from './pages/SekemaBiaya';

import type { EkskulKey } from './ContenPages/EkstrakurikulerSection';
import type { BeasiswaKey } from './ContenPages/BeasiswaSection';
import type { FasilitasKey } from './ContenPages/FasilitasSection';
import type { WisataKey } from './ContenPages/WisataSection';
import type { JurusanKey } from './ContenPages/JenjangDanJurusan';

// Halaman Ekskul
import Olahraga from './EkskulCategory/Olahraga';
import Beladiri from './EkskulCategory/Beladiri';
import Kerohanian from './EkskulCategory/Kerohanian';
import Keorganisasian from './EkskulCategory/Keorganisasian';
import SainsTeknologi from './EkskulCategory/SainsTeknologi';
import DebatBahasa from './EkskulCategory/DebatBahasa';
import MusikSastra from './EkskulCategory/MusikSastra';
import PersJurnalistik from './EkskulCategory/PersJurnalistik';

// Halaman Beasiswa
import BeasiswaAdaro from './Beasiswa/BeasiswaAdaro';
import BeasiswaPelindo from './Beasiswa/BeasiswaPelindo';
import BeasiswaSelengkapnya from './Beasiswa/BeasiswaSelengkapnya';

// Halaman Fasilitas
import FasilitasUmum from './Fasilitas/FasilitasUmum';
import FasilitasKesehatan from './Fasilitas/FasilitasKesehatan';
import FasilitasOlahraga from './Fasilitas/FasilitasOlahraga';
import FasilitasDisabilitas from './Fasilitas/FasilitasDisabilitas';
import FasilitasSelengkapnya from './Fasilitas/FasilitasSelengkapnya';

// Halaman Wisata
import AksaraPark from './Wisata/AksaraPark';
import KatamsoLand from './Wisata/KatamsoLand';
import TamanTjongYongHian from './Wisata/TamanTjongYongHian';
import MuseumPerkebunan from './Wisata/MuseumPerkebunan';
import AvrosPark from './Wisata/AvrosPark';
import WisataLainnya from './Wisata/WisataLainnya';

// Wrapper Jurusan
import JurusanWrapper from './ProgramKeahlian/JurusanWrapper';
import ProgramFooter from '../../layout/ProgramFooter';

// Halaman Program Keahlian (dari folder existing)
const Reg01Page = lazy(() => import('../halaman/components/ProgramKeahlian/REG-01'));
const Reg02Page = lazy(() => import('../halaman/components/ProgramKeahlian/REG-02'));
const Reg03Page = lazy(() => import('../halaman/components/ProgramKeahlian/REG-03'));
const Reg04Page = lazy(() => import('../halaman/components/ProgramKeahlian/REG-04'));
const Reg05Page = lazy(() => import('../halaman/components/ProgramKeahlian/REG-05'));
const Reg06Page = lazy(() => import('../halaman/components/ProgramKeahlian/REG-06'));
const Reg07Page = lazy(() => import('../halaman/components/ProgramKeahlian/REG-07'));

export type LandingPageProps = {
  onOpenForm: () => void;
  onOpenCekKelulusan: () => void;
  onClose: () => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
};

type ActiveSubPage =
  | 'none'
  | EkskulKey
  | `beasiswa-${BeasiswaKey}`
  | `fasilitas-${FasilitasKey}`
  | `wisata-${WisataKey}`
  | JurusanKey;

const TABS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'informasi', label: 'Informasi PPDB' },
  { id: 'jalur', label: 'Jalur Seleksi' },
  { id: 'tata-cara', label: 'Panduan Alur' },
  { id: 'dokumen', label: 'Dokumen Wajib' },
  { id: 'pembayaran', label: 'Skema Biaya' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function PageLoader() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
    </div>
  );
}

export default function LandingPage({
  onOpenForm,
  onOpenCekKelulusan,
  onClose,
  scrollRef,
}: LandingPageProps) {
  const [subPage, setSubPage] = useState<ActiveSubPage>('none');
  const [activeTab, setActiveTab] = useState<TabId>('beranda');
  // Simpan posisi scroll per tab — saat kembali, posisi dipulihkan ke tempat
  // user terakhir mengklik, bukan reset ke paling atas.
  const scrollPositions = useRef<Record<string, number>>({});

  const saveScroll = () => {
    if (scrollRef?.current) {
      scrollPositions.current[activeTab] = scrollRef.current.scrollTop;
    }
  };

  const resetScroll = () => {
    requestAnimationFrame(() => {
      if (scrollRef?.current) {
        scrollRef.current.scrollTop = 0;
      }
    });
  };

  const restoreScroll = (tab: TabId) => {
    const pos = scrollPositions.current[tab] ?? 0;
    requestAnimationFrame(() => {
      if (scrollRef?.current) {
        scrollRef.current.scrollTop = pos;
      }
    });
  };

  const openSubPage = (key: ActiveSubPage) => {
    saveScroll();
    setSubPage(key);
    resetScroll();
  };

  const goBack = () => {
    setSubPage('none');
    restoreScroll(activeTab);
  };

  const switchTab = (tab: TabId) => {
    if (tab === activeTab) return;
    saveScroll();
    setActiveTab(tab);
    restoreScroll(tab);
  };

  // ── Ekskul ──
  if (subPage === 'olahraga') return <Olahraga onBack={goBack} />;
  if (subPage === 'beladiri') return <Beladiri onBack={goBack} />;
  if (subPage === 'kerohanian') return <Kerohanian onBack={goBack} />;
  if (subPage === 'keorganisasian') return <Keorganisasian onBack={goBack} />;
  if (subPage === 'saintek') return <SainsTeknologi onBack={goBack} />;
  if (subPage === 'debat') return <DebatBahasa onBack={goBack} />;
  if (subPage === 'musik') return <MusikSastra onBack={goBack} />;
  if (subPage === 'jurnalistik') return <PersJurnalistik onBack={goBack} />;

  // ── Beasiswa ──
  if (subPage === 'beasiswa-adaro') return <BeasiswaAdaro onBack={goBack} />;
  if (subPage === 'beasiswa-pelindo') return <BeasiswaPelindo onBack={goBack} />;
  if (subPage === 'beasiswa-selengkapnya') return <BeasiswaSelengkapnya onBack={goBack} />;

  // ── Fasilitas ──
  if (subPage === 'fasilitas-umum') return <FasilitasUmum onBack={goBack} />;
  if (subPage === 'fasilitas-kesehatan') return <FasilitasKesehatan onBack={goBack} />;
  if (subPage === 'fasilitas-olahraga') return <FasilitasOlahraga onBack={goBack} />;
  if (subPage === 'fasilitas-disabilitas') return <FasilitasDisabilitas onBack={goBack} />;
  if (subPage === 'fasilitas-selengkapnya') return <FasilitasSelengkapnya onBack={goBack} />;

  // ── Wisata ──
  const openWisata = (key: WisataKey) => setSubPage(`wisata-${key}` as ActiveSubPage);
  if (subPage === 'wisata-aksara') return <AksaraPark onBack={goBack} onOpenWisata={openWisata} />;
  if (subPage === 'wisata-katamso')
    return <KatamsoLand onBack={goBack} onOpenWisata={openWisata} />;
  if (subPage === 'wisata-tjong')
    return <TamanTjongYongHian onBack={goBack} onOpenWisata={openWisata} />;
  if (subPage === 'wisata-museum')
    return <MuseumPerkebunan onBack={goBack} onOpenWisata={openWisata} />;
  if (subPage === 'wisata-avros') return <AvrosPark onBack={goBack} onOpenWisata={openWisata} />;
  if (subPage === 'wisata-lainnya') return <WisataLainnya onBack={goBack} />;

  // ── Program Keahlian (Jurusan) ──
  if (subPage === 'reg-01') {
    return (
      <Suspense fallback={<PageLoader />}>
        <JurusanWrapper onBack={goBack} Component={Reg01Page} />
      </Suspense>
    );
  }
  if (subPage === 'reg-02') {
    return (
      <Suspense fallback={<PageLoader />}>
        <JurusanWrapper onBack={goBack} Component={Reg02Page} />
      </Suspense>
    );
  }
  if (subPage === 'reg-03') {
    return (
      <Suspense fallback={<PageLoader />}>
        <JurusanWrapper onBack={goBack} Component={Reg03Page} />
      </Suspense>
    );
  }
  if (subPage === 'reg-04') {
    return (
      <Suspense fallback={<PageLoader />}>
        <JurusanWrapper onBack={goBack} Component={Reg04Page} />
      </Suspense>
    );
  }
  if (subPage === 'reg-05') {
    return (
      <Suspense fallback={<PageLoader />}>
        <JurusanWrapper onBack={goBack} Component={Reg05Page} />
      </Suspense>
    );
  }
  if (subPage === 'reg-06') {
    return (
      <Suspense fallback={<PageLoader />}>
        <JurusanWrapper onBack={goBack} Component={Reg06Page} />
      </Suspense>
    );
  }
  if (subPage === 'reg-07') {
    return (
      <Suspense fallback={<PageLoader />}>
        <JurusanWrapper onBack={goBack} Component={Reg07Page} />
      </Suspense>
    );
  }

  // ── LandingPage normal ──
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* HEADER dengan Tab Menu */}
      <header className="sticky top-0 z-50 w-full bg-[#2E86C1] shadow-md">
        <div className="flex h-14 w-full items-center justify-between gap-4 px-4 lg:px-8">
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Kembali"
              className="flex h-8 w-8 items-center justify-center rounded text-white transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <span className="block text-base leading-none font-bold text-white">
                PPDB Nasional 2026
              </span>
              <span className="text-[11px] leading-tight text-white/80">
                Penerimaan Peserta Didik Baru
              </span>
            </div>
          </div>

          <nav className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-1">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`relative px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                    activeTab === tab.id ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="mr-2 hidden flex-col items-end sm:flex">
              <span className="text-xs font-bold text-white">{namaSekolahUppercase}</span>
              <span className="text-[10px] tracking-wider text-white/70 uppercase">
                Portal PMB Online
              </span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-white/20 bg-white/10 p-1 shadow-md">
              <img
                src={`${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`}
                alt="Logo Sekolah"
                className="h-full w-full object-cover"  loading="lazy" decoding="async" />
            </div>
          </div>
        </div>

        <nav className="border-t border-white/10 lg:hidden">
          <div className="flex items-center gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`relative shrink-0 px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  activeTab === tab.id ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main>
        {activeTab === 'beranda' && (
          <>
            <section
              className="relative flex h-[597px] items-end border-b border-slate-200"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.85), rgba(15,23,42,0.4)), url('${import.meta.env.BASE_URL}images/siswa%20baru/f-3.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 1%',
              }}
            >
              <div className="mx-auto w-full max-w-7xl px-4 py-14 text-white md:px-8">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-200 uppercase">
                  PPDB Nasional 2026
                </p>
                <h1 className="mt-3 max-w-4xl text-3xl leading-tight font-bold md:text-5xl">
                  Penerimaan Peserta Didik Baru
                </h1>
                <p className="mt-4 max-w-2xl text-sm text-slate-200 md:text-base">
                  Sistem pendaftaran resmi untuk jenjang SD, SMP, SMA, dan SMK. Data pendaftar
                  diproses terintegrasi oleh sekolah dan operator administrasi secara transparan.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenForm}
                    className="inline-flex items-center gap-2 rounded-full border border-white px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white hover:text-slate-900"
                  >
                    Mulai Pendaftaran <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onOpenCekKelulusan}
                    className="rounded-full border border-slate-300 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
                  >
                    Cek Hasil Kelulusan
                  </button>
                </div>
              </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
              <PenerimaanSiswa
                onOpenInformasi={() => switchTab('informasi')}
                onOpenEkskul={(key) => openSubPage(key)}
                onOpenBeasiswa={(key) => openSubPage(`beasiswa-${key}` as ActiveSubPage)}
                onOpenFasilitas={(key) => openSubPage(`fasilitas-${key}` as ActiveSubPage)}
                onOpenWisata={(key) => openSubPage(`wisata-${key}` as ActiveSubPage)}
                onOpenJurusan={(key) => openSubPage(key)}
              />
            </div>
          </>
        )}

        {activeTab !== 'beranda' && (
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
            {activeTab === 'informasi' && <InformasiPPDB />}
            {activeTab === 'jalur' && <JalurSeleksi />}
            {activeTab === 'tata-cara' && <PanduanAlur />}
            {activeTab === 'dokumen' && <DokumenWajib />}
            {activeTab === 'pembayaran' && <SekemaBiaya />}
          </div>
        )}
      </main>

      <ProgramFooter />
    </div>
  );
}
