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

export default function AvrosPark({ onBack, onOpenWisata }: Props) {
  // Ref untuk slider galeri foto
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Gambar galeri Avros Park dari HTML
  const images = [
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/avp4.webp',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/avp2.webp',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/avp3.webp',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/avp5.webp',
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
      {/* ===== HEADER BAR ===== */}
      <header className="sticky top-0 z-50 flex h-14 items-center gap-3 bg-[#008244] px-4 shadow-md lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <span className="block text-base leading-none font-bold text-white">Avros Park</span>
          <span className="text-[11px] text-white/70">Wisata Kota Medan</span>
        </div>
      </header>

      {/* ===== HERO & BREADCRUMB SECTION ===== */}
      <section className="relative overflow-hidden bg-[linear-gradient(270deg,_#43AD35_0%,_#038A47_25%,_#0B6839_50%)] p-6 md:p-8 lg:h-[300px]">
        {/* Gambar Banner Right Side */}
        <img
          src="https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/avp1.webp"
          alt="Banner Avros Park"
          className="absolute top-0 right-0 h-full w-full object-cover object-center md:w-1/2"  loading="lazy" decoding="async" />

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#006535] via-[#2DB24A] via-50% to-transparent" />

        <div className="relative z-20 flex h-full items-center px-4 md:px-14">
          <h1 className="max-w-[740px] text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Avros Park
          </h1>
        </div>
      </section>

      {/* ===== DESKRIPSI & SLIDER GALERI ===== */}
      <section id="medan-history" className="relative px-4 py-10 sm:py-16 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 lg:flex-row lg:gap-10">
          {/* Paragraf Deskripsi */}
          <div className="flex flex-col gap-4 md:gap-6 lg:w-1/2">
            <h2 className="text-lg font-semibold text-[#008244] md:text-2xl">Avros Park</h2>
            <div className="space-y-3 text-justify text-xs leading-5 text-slate-800 sm:text-sm sm:leading-[22px]">
              <p>
                Avros Park, sebuah destinasi wisata dan taman edukasi yang menakjubkan, berlokasi di
                tengah kota Medan, tepatnya di Jalan Avros, Kampung Baru, Kecamatan Medan Maimun.
                Pesonanya tak hanya terletak pada lokasinya yang strategis, tetapi juga pada
                kreativitas dalam memanfaatkan Sungai Deli sebagai salah satu wahana edukatif yang
                menarik.
              </p>
              <p>
                Berbagai wahana edukatif di Avros Park menawarkan pengalaman yang tak terlupakan.
                Pengunjung dapat berpartisipasi dalam kegiatan pembuatan handycraft, menyebar bibit
                ikan, dan menanam pohon untuk mendukung keberlanjutan lingkungan. Namun, puncak
                pengalaman eksklusif di Avros Park adalah susur Sungai Deli menggunakan boat. Wahana
                ini telah berhasil mengubah persepsi negatif tentang Sungai Deli, karena
                menghadirkan pemahaman mendalam tentang sejarah sungai dan pentingnya menjaga
                kebersihan lingkungan, terutama di sekitar sungai.
              </p>
              <p>
                Selain menyajikan wahana edukatif yang menginspirasi, Avros Park juga menyediakan
                area kuliner yang menggugah selera. Tempat ini memiliki spot-spot foto yang cantik,
                yang tak hanya sempurna untuk diabadikan tetapi juga ideal untuk berbagi momen indah
                di media sosial. Para pengunjung dapat menikmati hidangan lezat dengan harga
                terjangkau, menjadikan kunjungan ke Avros Park sebagai pengalaman yang memuaskan
                semua indera.
              </p>
              <p>
                Avros Park menyambut pengunjung setiap hari, mulai dari pukul 09.00 hingga 23.00 WIB
                pada hari kerja, dan pukul 08.00 hingga 23.00 WIB pada akhir pekan. Pengunjung dapat
                menikmati keindahan taman ini tanpa dipungut biaya masuk, tetapi untuk menikmati
                wahana-wahana edukatif yang disediakan, tersedia tiket dengan harga mulai dari Rp.
                20.000. Jadi, ayo bergabunglah dalam petualangan seru dan edukatif di Avros Park, di
                mana kebahagiaan dan pengetahuan menanti Anda!
              </p>
            </div>
          </div>

          {/* Slider Foto Galeri */}
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
                      alt={`Avros Park ${index + 1}`}
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
      <section
        id="section-contact-tourism"
        className="relative bg-[#008244] px-4 py-10 sm:py-16 lg:px-16"
      >
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-6">
          <div className="inline-flex items-center gap-3 rounded-md bg-[#006535] pr-6">
            <div className="rounded-md bg-[#B7D46A] p-2">
              <img
                src="https://konten.usu.ac.id/storage/satker/0/icons/flower-sec2.svg"
                alt="Icon Bunga"
                className="h-6 w-6"  loading="lazy" decoding="async" />
            </div>
            <h2 className="py-2 text-lg font-semibold text-white">Informasi Lainnya</h2>
          </div>

          <div className="grid grid-cols-1 overflow-hidden rounded-xl bg-white shadow-md md:grid-cols-2">
            {/* Teks Info */}
            <div className="space-y-4 px-6 py-6 md:py-14">
              <p className="text-xs leading-6 text-slate-800 sm:text-sm">
                Avros Park adalah destinasi wisata dan taman edukasi yang memanfaatkan Sungai Deli
                dan terletak tepat di tengah Kota Medan. Selain menawarkan berbagai kegiatan
                edukatif seperti menyebar bibit ikan, Avros Park juga menyediakan area kuliner yang
                menggugah selera.
              </p>

              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">
                  Jl. Avros No. 60B, Kampung Baru, Kec. Medan Polonia, Kota Medan, Sumatera Utara,
                  20218
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Ticket className="h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">Gratis</span>
              </div>

              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">
                  Senin–Jumat Pukul 09.00–23.00 WIB dan Sabtu–Minggu Pukul 08.00–23.00 WIB
                </span>
              </div>
            </div>

            {/* Google Maps Embed */}
            <iframe
              title="Map Avros Park"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15928.5466077337!2d98.683609!3d3.5559738!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3031306b92f18305%3A0x92f69fcb2071f6be!2sTaman%20Edukasi%20Avros!5e0!3m2!1sen!2sid!4v1689915939305!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full max-h-[372px] min-h-[320px] w-full"
            />
          </div>
        </div>
      </section>

      {/* ===== WISATA LAINNYA ===== */}
      <section id="tourism-by-category" className="relative bg-white px-4 py-10 sm:py-16 lg:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#008244_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-3 rounded-md bg-[#006535] pr-6">
              <div className="rounded-md bg-[#B7D46A] p-2">
                <img
                  src="https://konten.usu.ac.id/storage/satker/0/icons/flower-sec2.svg"
                  alt="Icon Bunga"
                  className="h-6 w-6"  loading="lazy" decoding="async" />
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
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
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
