import React, { useState } from 'react';
import { User, CalendarDays } from 'lucide-react';
import type { PageProps, NavItem } from '../types';

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  desc: string;
  type: string;
  image: string;
  author: string;
  date: string;
}

interface ExtracurricularItem {
  id: string;
  name: string;
  image: string;
  author: string;
  date: string;
}

const activities: ActivityItem[] = [
  {
    id: 'kegiatan-1',
    title: 'Masa Pengenalan Lingkungan Sekolah',
    time: 'Juli 2026',
    desc: 'Kegiatan orientasi bagi siswa baru untuk mengenal lingkungan sekolah, tata tertib, program kegiatan, dan membangun rasa kekeluargaan antar siswa.',
    type: 'Orientasi',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-1.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'kegiatan-2',
    title: 'Class Meeting dan Expo Karya Siswa',
    time: 'Desember 2026',
    desc: 'Pameran karya siswa dari berbagai program keahlian, lomba antar kelas, dan pentas seni yang menampilkan bakat dan kreativitas siswa.',
    type: 'Pameran',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-2.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'kegiatan-3',
    title: 'Lomba Kompetensi Siswa Tingkat Kota',
    time: 'Maret 2027',
    desc: 'Seleksi dan pelatihan siswa berprestasi untuk mengikuti kompetisi keahlian tingkat kota dan provinsi.',
    type: 'Kompetisi',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-3.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'kegiatan-4',
    title: 'Kunjungan Industri Kelas XI',
    time: 'September 2026',
    desc: 'Kunjungan ke perusahaan mitra untuk memperkenalkan siswa pada lingkungan kerja nyata dan memperkuat pemahaman industri.',
    type: 'Kunjungan',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-4.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'kegiatan-5',
    title: 'Seminar Karir dan Beasiswa',
    time: 'November 2026',
    desc: 'Pemberian informasi jalur karir, beasiswa pendidikan lanjut, dan motivasi dari alumni sukses.',
    type: 'Seminar',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-5.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
];

const extracurriculars: ExtracurricularItem[] = [
  {
    id: 'ekskul-1',
    name: 'Pramuka',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-1.jpg`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-2',
    name: 'OSIS & MPK',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-3',
    name: 'Rohis (Rohani Islam)',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-4',
    name: 'Paskibra',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-5',
    name: 'Futsal',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-6',
    name: 'Basket',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-7',
    name: 'Voli',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-8',
    name: 'Tari Tradisional',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-9',
    name: 'Paduan Suara',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
  {
    id: 'ekskul-10',
    name: 'Jurnalistik',
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png`,
    author: 'Tim Redaksi',
    date: '2026-07-17',
  },
];

export default function KegiatanSekolahPage({ onNavigate }: PageProps) {
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
              Agenda dan Aktivitas Pembelajaran
            </h3>
            <p className="mt-4 text-justify font-serif text-sm leading-relaxed text-slate-700 italic">
              "Kegiatan sekolah dirancang secara komprehensif untuk menunjang pengembangan akademik,
              keterampilan sosial, serta pembentukan karakter siswa melalui berbagai program
              intrakurikuler, ekstrakurikuler, dan kegiatan pengembangan diri di lingkungan
              sekolah."
            </p>
          </div>
        </div>

        {/* GRID KEGIATAN STRATEGIS */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((item, idx) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              {/* FOTO */}
              <button
                type="button"
                onClick={() => onNavigate?.(item.id as NavItem)}
                aria-label={`Lihat detail ${item.title}`}
                className="block aspect-[16/10] w-full cursor-pointer overflow-hidden border-b border-slate-200 bg-slate-100 text-left"
              >
                {!failedImages[item.id] ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={() => handleImageError(item.id)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-50 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    DOKUMENTASI KEGIATAN #{idx + 1}
                  </div>
                )}
              </button>

              {/* KONTEN */}
              <div className="space-y-3 p-6">
                <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  KEGIATAN STRATEGIS {String(idx + 1).padStart(2, '0')} — {item.time}
                </span>

                <h4 className="line-clamp-2 min-h-[2.5rem] text-base leading-tight font-bold tracking-wide text-slate-950 uppercase">
                  {item.title}
                </h4>

                <p className="line-clamp-4 text-justify text-xs leading-relaxed text-slate-600">
                  {item.desc}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <div className="h-2 w-2 rounded-full bg-slate-950" />
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    {item.type}
                  </span>
                </div>

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

        {/* HEADER EKSTRAKURIKULER */}
        <div className="mt-16 mb-12 border-b-2 border-slate-950 pb-6">
          <div className="max-w-4xl">
            <h3 className="flex items-center gap-2 text-xl font-bold tracking-wider text-slate-950 uppercase">
              <span className="h-5 w-1 bg-slate-950" />
              Program Ekstrakurikuler
            </h3>
            <p className="mt-4 text-justify font-serif text-sm leading-relaxed text-slate-700 italic">
              "Beragam kegiatan ekstrakurikuler yang tersedia untuk mengembangkan potensi, bakat,
              dan minat siswa di berbagai bidang, mulai dari olahraga, seni, hingga kegiatan
              keagamaan dan kepemimpinan organisasi siswa."
            </p>
          </div>
        </div>

        {/* GRID EKSTRAKURIKULER */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {extracurriculars.map((item, idx) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              {/* FOTO */}
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
                    EKSTRAKURIKULER #{idx + 1}
                  </div>
                )}
              </button>

              {/* KONTEN */}
              <div className="space-y-3 p-6">
                <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  EKSTRAKURIKULER {String(idx + 1).padStart(2, '0')}
                </span>

                <h4 className="line-clamp-2 min-h-[2.5rem] text-base leading-tight font-bold tracking-wide text-slate-950 uppercase">
                  {item.name}
                </h4>

                <p className="line-clamp-4 text-justify text-xs leading-relaxed text-slate-600">
                  Kegiatan pengembangan bakat dan minat siswa di bidang {item.name.toLowerCase()}{' '}
                  yang bertujuan untuk membentuk karakter, keterampilan sosial, dan prestasi
                  non-akademik siswa dalam lingkungan sekolah yang kondusif.
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
      </section>
    </div>
  );
}
