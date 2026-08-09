import HeroSection from './DataBeranda/HeroSection';
import BeritaKegiatanSection from './DataBeranda/BeritaKegiatanSection';
import EbookSection from './DataBeranda/EbookSection';
import TestimoniCarousel from './DataBeranda/TestimoniCarousel';
import LayananCarousel from './DataBeranda/LayananCarousel';
import VisiSection from './DataBeranda/VisiSection';
import SiakadSection from './DataBeranda/SiakadSection';
import PendidikanSection from './DataBeranda/PendidikanSection';
import ResearchArticleSection from './DataBeranda/ResearchArticleSection';
import SekolahBerdampakSection from './DataBeranda/SekolahBerdampakSection';
import SilaAsaServiceSection from './DataBeranda/SilaAsaServiceSection';
import type { PageProps, NavItem } from '../types';

interface BerandaPageProps extends PageProps {
  onRegister: () => void;
  onShowAgenda?: () => void;
}

export default function BerandaPage({ onNavigate, onRegister, onShowAgenda }: BerandaPageProps) {
  const handleSectionNavigate = (page: string) => {
    onNavigate?.(page as NavItem);
  };

  return (
    <>
      <HeroSection onRegister={onRegister} onShowAgenda={onShowAgenda} />
      <SiakadSection />
      <PendidikanSection onNavigate={handleSectionNavigate} />
      <SilaAsaServiceSection onNavigate={handleSectionNavigate} />
      <SekolahBerdampakSection onNavigate={handleSectionNavigate} />
      <VisiSection />
      <ResearchArticleSection onNavigate={handleSectionNavigate} />
      <LayananCarousel />

      <TestimoniCarousel />
      <BeritaKegiatanSection onNavigate={handleSectionNavigate} />
      <EbookSection onNavigate={handleSectionNavigate} />
    </>
  );
}
