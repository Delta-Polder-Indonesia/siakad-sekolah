import { ArrowLeft, MapPin, Ticket, Clock, ArrowRight } from 'lucide-react';
import ProgramFooter from '../../../layout/ProgramFooter';
import type { WisataKey } from '../ContenPages/WisataSection';

type Props = { onBack: () => void; onOpenWisata: (key: WisataKey) => void };

export default function AksaraPark({ onBack, onOpenWisata }: Props) {
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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header sederhana (tombol back) */}
      <header className="sticky top-0 z-50 flex h-14 items-center gap-3 bg-[#008244] px-4 shadow-md lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <span className="block text-base leading-none font-bold text-white">Aksara Park</span>
          <span className="text-[11px] text-white/70">Wisata Kota Medan</span>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden rounded-none bg-[linear-gradient(270deg,_#43AD35_0%,_#038A47_25%,_#0B6839_50%)] p-6 md:p-8 lg:h-[300px]">
        {/* 1. Gambar Background (Mengisi setengah bagian kanan) */}
        <img
          src="https://konten.usu.ac.id/storage/satker/0/statis/fasilitas/aksarapark_1.webp"
          alt="Aksara Park"
          className="absolute top-0 right-0 h-full w-full object-cover object-right md:w-3/5"
        />

        {/* 3. Overlay Gradien (Perpaduan Hijau Pekat -> Hijau Terang -> Transparan) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#006535] via-[#2DB24A]/100 via-50% to-transparent" />

        {/* 4. Teks Judul */}
        <div className="relative z-20 flex h-full items-center px-8 md:px-14">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Aksara Park
          </h1>
        </div>
      </section>

      {/* ===== DESKRIPSI ===== */}
      <section className="px-4 py-10 sm:py-16 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-6">
          <h2 className="text-lg font-semibold text-[#008244] md:text-2xl">Aksara Park</h2>
          <p className="text-justify text-xs leading-6 text-slate-800 sm:text-sm">
            Aksara Park, surga wahana bermain di tengah gemerlap kota Medan, hadir sebagai destinasi
            hiburan malam yang tak boleh dilewatkan. Terletak di Jalan Aksara, Pahlawan, Kecamatan
            Medan Perjuangan, Kota Medan, Sumatera Utara, tempat ini menyajikan kegembiraan dan
            kenikmatan tak terbatas. Para pengunjung akan disambut oleh beragam wahana permainan
            yang menarik serta kelezatan makanan di food court dan street food. Tak hanya itu,
            spot-spot foto Instagramable yang populer di kalangan remaja juga tersebar di sini,
            memastikan setiap momen berharga bisa diabadikan secara cantik. Aksara Park bukan hanya
            tempat berjalan-jalan malam yang menyenangkan, melainkan taman hiburan yang menyuguhkan
            keasyikan penuh. Tersedia berbagai wahana yang cocok untuk anak-anak dan remaja, mulai
            dari bianglala yang memutar perasaan hingga komedi putar yang menggelitik tawa. Bagi
            yang suka tantangan, ombak banyu dan kora-kora siap memberikan sensasi menggoyangkan
            hati. Tak ada lagi alasan untuk merasa bosan atau kurang bergairah di malam hari, karena
            Aksara Park hadir sebagai jawaban. Rasakan keseruan dan keceriaan yang tak tertandingi
            di sini, nikmati setiap momen menyenangkan bersama teman-teman dan keluarga, dan bawa
            pulang kenangan indah dari taman hiburan yang memukau ini.
          </p>
        </div>
      </section>

      {/* ===== INFORMASI LAINNYA ===== */}
      <section className="relative bg-[#008244] px-4 py-10 sm:py-16 lg:px-16">
        {/* pattern bawah semi transparan */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-6">
          {/* Title Fill */}
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

          {/* Card putih */}
          <div className="grid grid-cols-1 overflow-hidden rounded-xl bg-white shadow-md md:grid-cols-2">
            {/* kiri: teks */}
            <div className="space-y-4 px-6 py-8 md:py-14">
              <p className="text-xs leading-6 text-slate-800 sm:text-sm">
                Aksara Park merupakan destinasi hiburan malam di tengah Kota Medan yang menyajikan
                beragam wahan permainan, kelezatan makanan, serta spot foto yang populer di kalangan
                anak muda.
              </p>

              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">
                  Aksara park, Pahlawan, Kec. Medan Perjuangan, Kota Medan, Sumatera Utara, 20224
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Ticket className="h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">Rp10.000–Rp15.000</span>
              </div>

              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 flex-shrink-0 text-[#006535]" />
                <span className="text-xs text-slate-700 sm:text-sm">
                  Setiap Hari Pukul 15.00–00.00 WIB
                </span>
              </div>
            </div>

            {/* kanan: peta - versi diperbaiki */}
            <iframe
              title="Lokasi Aksara Park"
              src="https://www.google.com/maps?q=3.5937959,98.7059885&z=17&output=embed"
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
        {/* Ornamen pattern samar */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#008244_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-8">
          {/* Header row */}
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

          {/* Grid 4 kolom */}
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
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
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
