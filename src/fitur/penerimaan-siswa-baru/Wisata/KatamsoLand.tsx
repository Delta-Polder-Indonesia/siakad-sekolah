import { useRef } from 'react';
import {
  ArrowLeft,
  MapPin,
  Ticket,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import ProgramFooter from '../../../layout/ProgramFooter';
import type { WisataKey } from '../ContenPages/WisataSection';

type Props = { onBack: () => void; onOpenWisata: (key: WisataKey) => void };

export default function KatamsoLand({ onBack, onOpenWisata }: Props) {
  // Ref untuk mengontrol scroll pada slider foto
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const images = [
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/katamsoland_5.webp',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/katamsoland_2.webp',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/katamsoland_3.webp',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/katamsoland_4.webp',
  ];

  const otherTourism = [
    {
      key: 'aksara' as const,
      name: 'Aksara Park',
      desc: 'Surga Hiburan Malam dengan Kuliner dan Wahana Bermain yang Tak Boleh Dilewatkan',
      img: 'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/aksarapark_1.webp',
    },
    {
      key: 'katamso' as const,
      name: 'Katamso Land',
      desc: 'Pasar Kekinian dengan Pengalaman Kuliner dan Aneka Hiburan yang Tak Terlupakan',
      img: 'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/katamsoland_1.webp',
    },
    {
      key: 'tjong' as const,
      name: 'Taman Tjong Yong Hian',
      desc: 'Taman Tjong Yong Hian, Sebuah Peninggalan Berharga Tjong Yong Hian di Medan dengan Pesona Gaya Tiongkok yang Memikat',
      img: 'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/tamantjongyonghian_1.webp',
    },
    {
      key: 'museum' as const,
      name: 'Museum Perkebunan Indonesia',
      desc: 'Mari Menyingkap Sejarah Gemilang dan Kekayaan Perkebunan Indonesia di Museum Perkebunan Indonesia',
      img: 'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/mpi_1.webp',
    },
  ];

  // Handler Scroll Slider
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 flex h-14 items-center gap-3 bg-[#008244] px-4 shadow-md lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <span className="block text-base leading-none font-bold text-white">Katamso Land</span>
          <span className="text-[11px] text-white/70">Wisata Kota Medan</span>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-[linear-gradient(270deg,_#43AD35_0%,_#038A47_25%,_#0B6839_50%)] p-6 md:p-8 lg:h-[300px]">
        <img
          src="https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/katamsoland_1.webp"
          alt="Katamso Land"
          className="absolute top-0 right-0 h-full w-full object-cover object-right md:w-3/5"  loading="lazy" decoding="async" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#006535] via-[#2DB24A] via-50% to-transparent" />
        <div className="relative z-20 flex h-full items-center px-4 md:px-14">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Katamso Land
          </h1>
        </div>
      </section>

      {/* ===== DESKRIPSI & SLIDER GALERI (Sesuai HTML yang dimasukkan) ===== */}
      <section id="medan-history" className="relative px-4 py-10 sm:py-16 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 lg:flex-row lg:gap-10">
          {/* Kolom Teks Deskripsi */}
          <div className="flex flex-col gap-4 md:gap-6 lg:w-1/2">
            <h2 className="text-lg font-semibold text-[#008244] md:text-2xl">Katamso Land</h2>
            <p className="text-justify text-xs leading-5 text-slate-800 sm:text-sm sm:leading-[22px]">
              Katamso Land, pasar kekinian di kota Medan, menghadirkan pengalaman kuliner dan
              hiburan yang tak terlupakan. Saat memasuki kawasan ini, pengunjung disambut oleh
              sekitar 50 stan makanan dan minuman yang teratur dan menggoda selera. Kelezatan
              berbagai hidangan siap memanjakan lidah Anda di setiap sudutnya.
              <br />
              <br />
              Selain kuliner, keberagaman wahana hiburan juga memperkaya pengalaman di Katamso Land.
              Berjalan seberang food court, Anda akan menemukan berbagai wahana seru seperti
              kora-kora dan bianglala. Adrenalin Anda dijamin akan terpacu dan memberikan
              kegembiraan tak terlupakan.
              <br />
              <br />
              Namun, tak hanya itu, keajaiban sejati ada di Festival Lampu yang menjadi daya tarik
              utama di sini. Saat senja turun, suasana pun berubah dengan lampu-lampu hias yang
              menyinari Katamso Land. Festival ini menciptakan dunia yang menakjubkan, penuh warna,
              dan memukau mata. Mengabadikan momen indah di sini melalui foto-foto akan menjadi
              kenangan yang tak terlupakan.
              <br />
              <br />
              Menikmati keindahan festival ini hanya memerlukan biaya terjangkau, yaitu 20 ribu
              rupiah per orang. Namun, bagi anak-anak dengan tinggi di bawah 120 cm, kesenangan ini
              dapat dinikmati secara gratis. Sebuah perjalanan wisata yang tak hanya memuaskan
              perut, tetapi juga mengisi hati dengan kebahagiaan dan keajaiban lampu yang tak
              terlupakan di Katamso Land.
            </p>
          </div>

          {/* Kolom Slider Foto */}
          <div className="relative w-full min-w-0 lg:w-1/2">
            <div className="relative overflow-hidden">
              <div
                ref={scrollContainerRef}
                className="scrollbar-hide flex items-center space-x-4 overflow-x-auto scroll-smooth px-2 py-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {images.map((src, index) => (
                  <div
                    key={index}
                    className="h-[16.875rem] w-[12.5rem] flex-none transition-transform duration-300 hover:scale-105 md:h-[18.75rem] md:w-[15.625rem] lg:h-[24rem] lg:w-[18rem]"
                  >
                    <img
                      src={src}
                      alt={`Katamso Land ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover shadow-md"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Navigasi Slider */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="rounded-full bg-[#008244] p-2 text-white transition-colors hover:bg-[#006535] focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="rounded-full bg-[#008244] p-2 text-white transition-colors hover:bg-[#006535] focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INFORMASI LAINNYA & MAPS ===== */}
      <section className="relative bg-[#008244] px-4 py-10 sm:py-16 lg:px-16">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-6">
          <div className="inline-flex items-center gap-3 rounded-md bg-[#006535] pr-6">
            <div className="rounded-md bg-[#B7D46A] p-2">
              <div
                className="h-6 w-6 bg-[#008244]"
                style={{
                  clipPath:
                    'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                }}
              />
            </div>
            <h2 className="py-2 text-lg font-semibold text-white">Informasi Lainnya</h2>
          </div>

          <div className="grid grid-cols-1 overflow-hidden rounded-xl bg-white shadow-md md:grid-cols-2">
            <div className="space-y-4 px-6 py-8 md:py-14">
              <p className="text-xs leading-6 text-slate-800 sm:text-sm">
                Katamso Land merupakan destinasi wisata kuliner dan hiburan keluarga kekinian di
                Kota Medan yang menyajikan puluhan stand kuliner, wahana permainan, serta festival
                lampu yang memikat.
              </p>

              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">
                  Jl. Brigjend Katamso, Kampung Baru, Kec. Medan Maimun, Kota Medan, Sumatera Utara
                  20158
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Ticket className="h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">
                  Rp20.000 (Gratis bagi anak tinggi &lt;120cm)
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">
                  Setiap Hari Pukul 16.00–23.00 WIB
                </span>
              </div>
            </div>

            <iframe
              title="Lokasi Katamso Land"
              src="https://www.google.com/maps?q=Katamso+Land,+Medan&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[320px] w-full"
            />
          </div>
        </div>
      </section>

      {/* ===== WISATA LAINNYA ===== */}
      <section className="relative bg-white px-4 py-10 sm:py-16 lg:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#008244_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-3 rounded-md bg-[#006535] pr-6">
              <div className="rounded-md bg-[#B7D46A] p-2">
                <div
                  className="h-6 w-6 bg-[#008244]"
                  style={{
                    clipPath:
                      'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  }}
                />
              </div>
              <h2 className="py-2 text-lg font-semibold text-white">Wisata Lainnya</h2>
            </div>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onOpenWisata('lainnya');
              }}
              className="group flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-[#008244]"
            >
              <span>Wisata Lainnya</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherTourism.map((item) => (
              <a
                key={item.key}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenWisata(item.key);
                }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"  loading="lazy" decoding="async" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4 transition-colors duration-300 group-hover:bg-[#008244]">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-white">
                    {item.name}
                  </p>
                  <p className="line-clamp-2 text-xs leading-5 text-slate-600 group-hover:text-white/90">
                    {item.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ProgramFooter />
    </div>
  );
}
