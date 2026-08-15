import { useState, useRef, useEffect, useCallback } from 'react';
import { useRafCallback } from '../../../hooks/useRafCallback';
import type { PageProps } from '../types';
import { tabs, type TabItem } from '../data/profil/data';
import {
  SekilasSekolah,
  TonggakSejarah,
  SambutanKepsek,
  VisiMisi,
  StrukturOrganisasi,
  GuruPegawaiPage,
  GtkSiswaPage,
  AkreditasiPrestasi,
  Operasional,
} from '../components/Profile';

type ProfilPageProps = PageProps & {
  profilTabRef?: { current: number };
};

export default function ProfilPage({ onNavigate, profilTabRef }: ProfilPageProps) {
  // Tab terakhir disimpan lewat profilTabRef (dikelola ExpectationModal) supaya saat
  // membuka detail (misal Profil Kepala Sekolah) lalu kembali, tab yang sama tetap
  // aktif — bukan reset ke tab pertama.
  const [activeTab, setActiveTab] = useState<number>(profilTabRef?.current ?? 1);
  const [showFadeLeft, setShowFadeLeft] = useState(false);
  const [showFadeRight, setShowFadeRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const handleTabChange = (id: number) => {
    if (profilTabRef) profilTabRef.current = id;
    setActiveTab(id);
  };

  const active = tabs.find((t) => t.id === activeTab);

  const ActiveComponent = active?.component;

  const measureScrollFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // READ batch — jangan sisipkan setState/style write di antara pengukuran ini.
    const scrollLeft = el.scrollLeft;
    const clientWidth = el.clientWidth;
    const scrollWidth = el.scrollWidth;

    // WRITE batch — React 18+ membatch kedua update ini dalam satu render.
    setShowFadeLeft(scrollLeft > 8);
    setShowFadeRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);
  const scheduleScrollMeasurement = useRafCallback(measureScrollFades);

  useEffect(() => {
    scheduleScrollMeasurement();
    window.addEventListener('resize', scheduleScrollMeasurement);
    return () => window.removeEventListener('resize', scheduleScrollMeasurement);
  }, [scheduleScrollMeasurement]);

  useEffect(() => {
    // Commit tab mengubah DOM terlebih dahulu. Frame pertama memberi browser
    // kesempatan menyelesaikan layout; frame kedua membaca geometri yang bersih.
    let scrollFrame: number | null = null;
    const layoutFrame = window.requestAnimationFrame(() => {
      scrollFrame = window.requestAnimationFrame(() => {
        const activeEl = tabRefs.current[activeTab];
        const container = scrollRef.current;
        if (!activeEl || !container) return;

        // READ batch
        const itemLeft = activeEl.offsetLeft;
        const itemWidth = activeEl.offsetWidth;
        const viewportWidth = container.clientWidth;
        const offset = itemLeft - viewportWidth / 2 + itemWidth / 2;

        // WRITE batch
        container.scrollTo({ left: offset, behavior: 'smooth' });
      });
    });

    return () => {
      window.cancelAnimationFrame(layoutFrame);
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="relative">
          <div
            className={`pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent transition-opacity duration-200 ${
              showFadeLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${
              showFadeRight ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            ref={scrollRef}
            onScroll={scheduleScrollMeasurement}
            className="flex items-center overflow-x-auto px-6 whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] md:px-12 [&::-webkit-scrollbar]:hidden"
            role="tablist"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[tab.id] = el;
                  }}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex-shrink-0 cursor-pointer px-5 py-5 text-sm font-medium transition-colors ${
                    isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute right-4 bottom-0 left-4 h-0.5 bg-red-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main>{ActiveComponent && <ActiveComponent />}</main>
    </div>
  );
}
