import React, { useState } from 'react';
import { User, CalendarDays } from 'lucide-react';
import type { PageProps, NavItem } from '../types';

interface FacilityItem {
  id: string;
  name: string;
  detail: string;
  desc: string;
  image: string;
  author: string;
  date: string;
}

const facilities: FacilityItem[] = [
  {
    id: 'facility-1',
    name: 'Perpustakaan',
    detail: '5.000+ Koleksi Buku',
    desc: 'Ruang baca nyaman dengan sistem digitalisasi katalog dan akses e-book.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-2',
    name: 'Laboratorium Komputer',
    detail: '40 Unit PC',
    desc: 'Lab terintegrasi dengan spesifikasi tinggi untuk pemrograman, desain, dan simulasi.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-3',
    name: 'Ruang Kelas Multimedia',
    detail: 'Proyektor & Smart TV',
    desc: 'Setiap ruang kelas dilengkapi proyektor dan perangkat media pembelajaran interaktif.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-4',
    name: 'Laboratorium IPA',
    detail: 'Praktikum Sains',
    desc: 'Fasilitas lengkap untuk praktikum fisika, kimia, dan biologi dengan standar keselamatan.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-5',
    name: 'Lapangan Olahraga',
    detail: 'Serbaguna',
    desc: 'Lapangan untuk basket, voli, futsal, dan berbagai kegiatan ekstrakurikuler olahraga.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-6',
    name: 'Ruang UKS',
    detail: 'Layanan Kesehatan',
    desc: 'Unit Kesehatan Sekolah dengan perawat dan fasilitas pertolongan pertama.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-6.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-7',
    name: 'Masjid Sekolah',
    detail: 'Kapasitas 200 Jemaah',
    desc: 'Ruang ibadah dan kegiatan keagamaan siswa dengan fasilitas wudhu yang memadai.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-7.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'facility-8',
    name: 'Kantin & Koperasi',
    detail: 'Hygienis & Terjangkau',
    desc: 'Penyediaan makanan bergizi dengan standar kebersihan dan harga terjangkau.',
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-8.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
];

export default function SaranaPrasaranaPage({ onNavigate }: PageProps) {
  // State murni React untuk melacak gambar yang gagal dimuat tanpa manipulasi DOM langsung
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="bg-white font-serif">
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        {/* HEADER HALAMAN UTAMA */}
        <div className="mb-12 border-b-2 border-slate-950 pb-6">
          <div className="max-w-4xl">
            <h3 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Fasilitas Modern Untuk Masa Depan Digital
            </h3>
            <p className="mt-4 text-justify font-serif text-sm leading-relaxed text-slate-700 italic">
              "Kami menyediakan lingkungan belajar yang kondusif dengan dukungan teknologi terkini.
              Setiap fasilitas dirancang secara strategis untuk memastikan kenyamanan, keselamatan,
              serta efektivitas tinggi dalam mendukung seluruh proses pembelajaran interaktif."
            </p>
          </div>
        </div>

        {/* STRUKTUR GRID DAFTAR FASILITAS */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((item, idx) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              {/* FOTO SEBAGAI AREA KLIK */}
              <button
                type="button"
                onClick={() => onNavigate?.(item.id as NavItem)}
                aria-label={`Lihat detail ${item.name}`}
                className="block aspect-[16/10] w-full cursor-pointer overflow-hidden border-b border-slate-200 bg-slate-100 text-left"
              >
                {!failedImages[item.id] ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={() => handleImageError(item.id)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-50 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    DOKUMENTASI FASILITAS #{idx + 1}
                  </div>
                )}
              </button>

              {/* KONTEN DETAIL FASILITAS */}
              <div className="space-y-3 p-6">
                <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  FACILITY {String(idx + 1).padStart(2, '0')} — {item.detail}
                </span>

                <h4 className="line-clamp-2 min-h-[2.5rem] text-base leading-tight font-bold tracking-wide text-slate-950 uppercase">
                  {item.name}
                </h4>

                <p className="line-clamp-4 text-justify text-xs leading-relaxed text-slate-600">
                  {item.desc}
                </p>

                {/* AUTHOR + TANGGAL */}
                <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400" aria-hidden="true" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays
                      className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400"
                      aria-hidden="true"
                    />
                    <time dateTime={item.date}>{item.date}</time>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INFO TAMBAHAN / STATS */}
        <div className="mt-16 flex flex-col items-stretch gap-12 rounded-xl border border-slate-200 bg-slate-50 p-8 md:flex-row md:p-12">
          <div className="flex flex-1 flex-col justify-center space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold tracking-wider text-slate-950 uppercase">
              <span className="h-4 w-1 bg-slate-950" />
              Standar Keamanan &amp; Kenyamanan
            </h3>
            <p className="text-justify text-xs leading-relaxed text-slate-600">
              Seluruh area sekolah dilengkapi dengan CCTV 24 jam, sistem keamanan terpadu, serta
              area hijau yang luas untuk menjaga kesegaran udara di lingkungan belajar.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['24/7 CCTV', 'Green Campus', 'Fiber Optic WiFi', 'Full AC Lab'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold tracking-wider text-slate-600 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 md:w-1/3">
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center">
              <p className="text-2xl font-bold tracking-tight text-slate-950">12+</p>
              <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Lab Komputer
              </p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center">
              <p className="text-2xl font-bold tracking-tight text-slate-950">100%</p>
              <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Smart Class
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
