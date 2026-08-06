// src/fitur/halaman/pages/DataBeranda/HeroSection.tsx
import { useEffect, useState } from 'react';
import { namaSekolahUppercase } from '../../components/Profile/dataSekolah';

interface HeroSectionProps {
  onRegister: () => void;
  onShowAgenda?: () => void;
}

const img = (name: string) => `${import.meta.env.BASE_URL}images/IconPlus/${name}`;

// ── 3 tema warna + layer gambar, meniru template Blogger (kode.txt) ──
// File gambar dikelompokkan per warna di public/images/IconPlus/{biru,hijau,merah}.
// "main" = gambar utama besar di tengah-bawah (Utama.png), "layers" = dekoratif.
// Kelas layer (vase, tea, spoon, dst.) menentukan posisinya di global.css.
// Ganti urutan/nama file di sini sesukamu.
const THEMES = [
  {
    cls: 'blue',
    label: 'Inovasi',
    main: 'biru/Utama.png',
    layers: [
      ['drone', 'biru/drone.png'],
      ['phone1', 'biru/phone1.png'],
      ['temperature', 'biru/temperature.png'],
      ['remote', 'biru/remote.png'],
      ['smartwatch', 'biru/smartwatch.png'],
      ['actioncam', 'biru/actioncam.png'],
    ],
  },
  {
    cls: 'green',
    label: 'Unggul',
    main: 'hijau/Utama.png',
    layers: [
      ['vase', 'hijau/w96.png'],
      ['tea', 'hijau/tea.png'],
      ['slipper', 'hijau/slipper.png'],
      ['picture', 'hijau/picture.png'],
      ['letter-c', 'hijau/letter-c.png'],
      ['letter-b', 'hijau/letter-b.png'],
      ['letter-a', 'hijau/letter-a.png'],
      ['football', 'hijau/football.png'],
    ],
  },
  {
    cls: 'red',
    label: 'Berdampak',
    main: 'merah/Utama.png',
    layers: [
      ['spoon', 'merah/spoon.png'],
      ['mixer', 'merah/mixer.png'],
      ['eggs', 'merah/eggs.png'],
      ['cherries', 'merah/cherries.png'],
      ['rollover', 'merah/rollover.png'],
      ['shape', 'merah/shape.png'],
      ['pie', 'merah/pie.png'],
    ],
  },
] as const;

export default function HeroSection({ onRegister, onShowAgenda }: HeroSectionProps) {
  // Rotasi tema seperti template: 7 detik per siklus (3 tema), jeda 10s
  // setelah satu putaran penuh, lalu berulang.
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const perTheme = 7000 / THEMES.length;
    const hold = 10000;
    let timer: ReturnType<typeof setTimeout>;
    const tick = (next: number) => {
      setCurrentIndex(next % THEMES.length);
      const isPause = next > 0 && next % THEMES.length === 0;
      timer = setTimeout(() => tick(next + 1), isPause ? hold : perTheme);
    };
    timer = setTimeout(() => tick(1), perTheme);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* HERO - animasi 3 tema dari template Blogger */}
      <section className="relative w-full overflow-hidden bg-[#2f454f] pt-[8rem] pb-[2rem] lg:pt-[10rem] lg:pb-[7rem]">
        {/* Lingkup animasi hero — layer dekoratif + gambar utama tengah */}
        <div className="hero-animation" aria-hidden="true">
          {THEMES.map((theme, t) => (
            <div
              key={theme.label}
              className={`theme js-theme ${theme.cls} ${currentIndex === t ? 'active' : ''}`}
            >
              {theme.layers.map(([cls, src]) => (
                <img
                  key={src}
                  className={`theme--layer ${cls}`}
                  src={img(src)}
                  alt=""
                  decoding="async"
                  draggable="false"
                />
              ))}
              {/* Gambar utama besar di tengah-bawah */}
              <img
                className="theme--layer blog"
                src={img(theme.main)}
                alt=""
                decoding="async"
                draggable="false"
              />
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-6 lg:flex-row lg:gap-12 lg:px-8">
            <div className="flex-1 space-y-6 text-left">
              <p className="text-scale-0-b py-2 text-white">Selamat datang di Laman Resmi</p>
              <h1 className="typo-hero text-white">
                {namaSekolahUppercase} <br />
                <span className="text-amber-400">Sekolah Unggul Masa Depan</span>
              </h1>
            </div>

            {/* Spacer kanan: mempertahankan tinggi seksi agar bagian bawah tidak berubah */}
            <div className="hidden w-full max-w-2xl flex-1 lg:block" aria-hidden="true">
              <div className="aspect-16/10 w-full lg:aspect-video" />
            </div>
          </div>
        </div>
      </section>

      {/* CARD OVERLAP - Statis */}
      <div className="relative z-20 -mt-16 px-6 lg:-mt-29 lg:px-8">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-500 bg-white p-6 lg:p-8">
            <h2 className="sec-title text-slate-900">
              Siapkah Kamu untuk bergabung Membangun Bangsa?
            </h2>
            <p className="sec-body mt-4 text-slate-600">
              "Menyediakan pendidikan berkualitas dengan kurikulum modern, fasilitas lengkap, dan
              tenaga pengajar profesional untuk mempersiapkan generasi unggul Indonesia."
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onRegister}
                className="sec-btn cursor-pointer rounded-lg bg-[#0b2f9f] px-6 py-3 text-white uppercase shadow-md transition-all hover:border-slate-400 hover:bg-[#0746BD]"
              >
                Daftar Sekarang
              </button>
              <button
                type="button"
                onClick={onShowAgenda}
                className="sec-btn cursor-pointer rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-slate-900 uppercase transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                Agenda Academic
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
