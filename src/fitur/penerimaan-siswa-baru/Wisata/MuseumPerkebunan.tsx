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

export default function MuseumPerkebunan({ onBack, onOpenWisata }: Props) {
  // Ref untuk slider galeri foto
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Gambar galeri Museum Perkebunan Indonesia sesuai data HTML
  const images = [
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/mpi_6.webp?w=16&q=75',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/mpi_2.webp?w=16&q=75',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/mpi_3.webp?w=16&q=75',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/mpi_4.webp?w=16&q=75',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/mpi_5.webp?w=16&q=75',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/mpi_6.webp?w=16&q=75',
    'https://konten.usu.ac.id/storage/satker/0/null/2023-Jul/mpi_2.webp?w=16&q=75',
  ];

  const otherTourism = [
    {
      key: 'aksara' as const,
      name: 'Aksara Park',
      desc: 'Surga Hiburan Malam dengan Kuliner dan Wahana Bermain yang Tak Boleh Dilewatkan',
      img: 'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/aksarapark_1.webp?w=992&q=75',
    },
    {
      key: 'katamso' as const,
      name: 'Katamso Land',
      desc: 'Pasar Kekinian dengan Pengalaman Kuliner dan Aneka Hiburan yang Tak Terlupakan',
      img: 'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/katamsoland_1.webp?w=992&q=75',
    },
    {
      key: 'tjong' as const,
      name: 'Taman Tjong Yong Hian',
      desc: 'Taman Tjong Yong Hian, Sebuah Peninggalan Berharga Tjong Yong Hian di Medan dengan Pesona Gaya Tiongkok yang Memikat',
      img: 'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/tamantjongyonghian_1.webp?w=992&q=75',
    },
    {
      key: 'museum' as const,
      name: 'Museum Perkebunan Indonesia',
      desc: 'Mari Menyingkap Sejarah Gemilang dan Kekayaan Perkebunan Indonesia di Museum Perkebunan Indonesia',
      img: 'https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/mpi_1.webp?w=992&q=75',
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
          <span className="block text-base leading-none font-bold text-white">
            Museum Perkebunan Indonesia
          </span>
          <span className="text-[11px] text-white/70">Wisata Kota Medan</span>
        </div>
      </header>

      {/* ===== HERO & BREADCRUMB SECTION ===== */}
      <section className="relative overflow-hidden bg-[linear-gradient(270deg,_#43AD35_0%,_#038A47_25%,_#0B6839_50%)] p-6 md:p-8 lg:h-[300px]">
        {/* Gambar Banner Right Side */}
        <img
          src="https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/mpi_1.webp?w=16&q=75"
          alt="Banner Museum Perkebunan Indonesia"
          className="absolute top-0 right-0 h-full w-full object-cover object-center md:w-1/2"  loading="lazy" decoding="async" />

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#006535] via-[#2DB24A] via-50% to-transparent" />

        <div className="relative z-20 flex h-full items-center px-4 md:px-14">
          <h1 className="max-w-[740px] text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Museum Perkebunan Indonesia
          </h1>
        </div>
      </section>

      {/* ===== DESKRIPSI & SLIDER GALERI ===== */}
      <section id="medan-history" className="relative px-4 py-10 sm:py-16 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 lg:flex-row lg:gap-10">
          {/* Paragraf Deskripsi persis dari HTML */}
          <div className="flex flex-col gap-4 md:gap-6 lg:w-1/2">
            <h2 className="text-lg font-semibold text-[#008244] md:text-2xl">
              Museum Perkebunan Indonesia
            </h2>
            <p className="text-justify text-xs leading-5 text-slate-800 sm:text-sm sm:leading-[22px]">
              Museum Perkebunan Indonesia berdiri megah di Jalan Brigjen Katamso No. 53, Kota Medan,
              Sumatera Utara. Tempat ini bukan sekadar gedung kosong, melainkan pusat ilmu dan
              wawasan tentang gemerlap dunia perkebunan di Indonesia.
              <br />
              <br />
              Menyambut pengunjung dengan dua lantai yang penuh cerita, museum ini menampilkan
              rentetan informasi mengenai perkebunan masa lampau, lengkap dengan koleksi berharga
              hasil kebun dan kisah-kisah bersejarahnya. Di setiap ruangan, ada pelajaran menarik
              mengenai perjalanan dan perkembangan perkebunan di Indonesia, tak ketinggalan mengenai
              pusat penelitian perkebunan yang mewarnai inovasi pertanian.
              <br />
              <br />
              Sekali menginjakkan kaki di dalamnya, pengunjung diajak menggali pengetahuan mengenai
              komoditas unggulan perkebunan Indonesia yang telah memikat dunia sejak zaman keemasan
              abad ke-18 hingga saat ini. Mengesankan betapa perkebunan telah menjadi bagian tak
              terpisahkan dari sejarah bangsa.
              <br />
              <br />
              Tak hanya isi dalam ruangan, namun di halaman depan, pesawat terbang Piper Pawnee yang
              menarik perhatian terlihat. Pesawat ini adalah saksi bisu sejarah, diproduksi pada
              tahun 1958 oleh PTPN II dan bertugas menyemprot hama tanaman tembakau selama hampir
              setengah abad.
              <br />
              <br />
              Sebuah kesempatan berharga untuk menjelajahi sejarah gemilang perkebunan Indonesia dan
              mendalami kekayaan alamnya.
              <br />
              <br />
              Tak perlu jauh-jauh ke Jawa untuk mengenali kehebatan perkebunan Indonesia, cukup
              sambangi Museum Perkebunan Indonesia di Medan dan leburkan diri dalam gemerlap warisan
              pertanian bangsa.
            </p>
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
                      alt={`Museum Perkebunan Indonesia ${index + 1}`}
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
            {/* Teks Info persis dari HTML */}
            <div className="space-y-4 px-6 py-6 md:py-14">
              <p className="text-xs leading-6 text-slate-800 sm:text-sm">
                Museum Perkebunan Indonesia yang berada di jalan Brigjen Katamso No.53 Medan
                merupakan pusat ilmu dan wawasan mengenai dunia perkebunan Indonesia.
              </p>

              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">
                  Museum 1: Jl. Brigjend Katamso No. 53, Kampung Baru, Kec. Medan Maimun, Kota
                  Medan, Sumatera Utara, 20215 — Museum 2: Gedung BKSPPS, Jl. Pemuda No.10, AUR,
                  Kec. Medan Maimun, Kota Medan, Sumatera Utara, 20151
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Ticket className="h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">
                  Lokal: Rp25.000 — Turis: Rp35.000 (Termasuk Souvenir dan Air Mineral)
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">
                  Museum 1: Senin–Sabtu Pukul 08.00–16.00 WIB — Museum 2: Setiap Hari Pukul
                  09.00–17.00 WIB
                </span>
              </div>
            </div>

            {/* Google Maps Embed persis dari URL HTML */}
            <iframe
              title="Map Museum Perkebunan Indonesia"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63713.167711325455!2d98.62279436058546!3d3.5706850931909777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30313049053a852d%3A0xabbdd59e512b1d5a!2sMuseum%20Perkebunan%20Indonesia!5e0!3m2!1sen!2sid!4v1690259319207!5m2!1sen!2sid"
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
