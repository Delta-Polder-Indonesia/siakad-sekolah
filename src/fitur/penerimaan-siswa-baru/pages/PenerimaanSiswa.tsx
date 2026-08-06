import JenjangDanJurusan from '../ContenPages/JenjangDanJurusan';
import type { JurusanKey } from '../ContenPages/JenjangDanJurusan';
import CtaPendaftaran from '../ContenPages/CtaPendaftaran';
import EkstrakurikulerSection from '../ContenPages/EkstrakurikulerSection';
import type { EkskulKey } from '../ContenPages/EkstrakurikulerSection';
import FasilitasSection from '../ContenPages/FasilitasSection';
import type { FasilitasKey } from '../ContenPages/FasilitasSection';
import BeasiswaSection from '../ContenPages/BeasiswaSection';
import type { BeasiswaKey } from '../ContenPages/BeasiswaSection';
import WisataSection from '../ContenPages/WisataSection';
import type { WisataKey } from '../ContenPages/WisataSection';
import CampusVisitSection from '../ContenPages/CampusVisitSection';

type PenerimaanSiswaProps = {
  onOpenInformasi: () => void;
  onOpenEkskul: (key: EkskulKey) => void;
  onOpenBeasiswa: (key: BeasiswaKey) => void;
  onOpenFasilitas: (key: FasilitasKey) => void;
  onOpenWisata: (key: WisataKey) => void;
  onOpenJurusan: (key: JurusanKey) => void;
};

export default function PenerimaanSiswa({
  onOpenInformasi,
  onOpenEkskul,
  onOpenBeasiswa,
  onOpenFasilitas,
  onOpenWisata,
  onOpenJurusan,
}: PenerimaanSiswaProps) {
  return (
    <div className="animate-fadeIn font-sans text-slate-900">
      <JenjangDanJurusan onOpenJurusan={onOpenJurusan} />
      <CtaPendaftaran onOpenInformasi={onOpenInformasi} />
      <EkstrakurikulerSection onOpenEkskul={onOpenEkskul} />
      <BeasiswaSection onOpenBeasiswa={onOpenBeasiswa} />
      <FasilitasSection onOpenFasilitas={onOpenFasilitas} />
      <WisataSection onOpenWisata={onOpenWisata} />
      <CampusVisitSection />
    </div>
  );
}
