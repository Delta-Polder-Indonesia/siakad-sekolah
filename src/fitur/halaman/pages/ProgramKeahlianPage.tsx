import React, { useState } from 'react';
import { User, CalendarDays } from 'lucide-react';
import type { PageProps, NavItem } from '../types';
import { isSmk, programSpesialisasi, namaSekolah } from '../components/Profile/dataSekolah';
import { majors } from '../data/programKeahlian/data';

export default function ProgramKeahlianPage({ onNavigate }: PageProps) {
  // State murni React untuk melacak gambar yang gagal dimuat
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Halaman jurusan keahlian hanya berlaku untuk jenjang SMK.
  // Untuk jenjang lain tampilkan fallback sesuai label program spesialisasi.
  if (!isSmk) {
    return (
      <div className="bg-white font-serif">
        <section className="mx-auto max-w-[1280px] px-6 py-24 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{programSpesialisasi}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            {namaSekolah} menerapkan {programSpesialisasi.toLowerCase()} yang disesuaikan dengan
            kebutuhan pengembangan potensi peserta didik. Rincian program dapat dilihat pada menu
            Program Sekolah.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white font-serif">
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        {/* HEADER HALAMAN UTAMA */}
        <div className="mb-10 border-b-2 border-slate-950 pb-4">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Program Keahlian &amp; Kompetensi
          </h2>
          <p className="mt-1 text-xs tracking-wide text-slate-600 uppercase">
            Daftar Jurusan Resmi Standar Kompetensi Kerja Nasional Indonesia (SKKNI)
          </p>
        </div>

        {/* STRUKTUR TATA LETAK UTAMA */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* KOLOM KIRI: SIDEBAR */}
          <div className="space-y-6 lg:col-span-1">
            {/* Informasi Keunggulan */}
            <div className="rounded-xl border-2 border-slate-950 bg-white p-6">
              <h3 className="mb-4 border-b border-slate-200 pb-3 text-sm font-bold tracking-widest text-slate-950 uppercase">
                Standar Mutu Pendidikan
              </h3>
              <ul className="space-y-4 text-xs font-medium tracking-wide text-slate-800 uppercase">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-slate-950">01.</span>
                  <span>Kurikulum berbasis integrasi industri terkini.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-slate-950">02.</span>
                  <span>Tenaga pengajar praktisi profesional tersertifikasi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-slate-950">03.</span>
                  <span>Fasilitas ruang praktik dan laboratorium standar nasional.</span>
                </li>
              </ul>
              <button
                type="button"
                className="mt-6 w-full cursor-pointer rounded-xl border border-slate-300 bg-slate-50 py-3 text-xs font-bold tracking-wider text-slate-950 uppercase transition-colors hover:bg-slate-100"
              >
                Unduh Brosur (.PDF)
              </button>
            </div>

            {/* Informasi Pendaftaran */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h4 className="mb-3 text-xs font-bold tracking-widest text-slate-950 uppercase">
                Informasi Penerimaan
              </h4>
              <p className="mb-4 text-justify text-xs leading-relaxed text-slate-600">
                Pendaftaran untuk tahun ajaran baru telah dibuka secara terpusat. Akses jadwal
                seleksi dan persyaratan administrasi melalui tombol di bawah ini.
              </p>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1 text-xs font-bold tracking-wider text-slate-950 uppercase hover:underline"
              >
                Cek Jadwal Seleksi Resmi <span>→</span>
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: GRID DAFTAR JURUSAN */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {majors.map((major, idx) => (
                <div
                  key={major.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  {/* FOTO SEBAGAI AREA KLIK */}
                  <button
                    type="button"
                    onClick={() => onNavigate?.(major.id as NavItem)}
                    aria-label={`Lihat detail ${major.name}`}
                    className="block h-44 w-full cursor-pointer overflow-hidden border-b border-slate-200 bg-slate-100 text-left"
                  >
                    {!failedImages[major.id] ? (
                      <img
                        src={major.image}
                        alt={major.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={() => handleImageError(major.id)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Dokumentasi Jurusan #{idx + 1}
                      </div>
                    )}
                  </button>

                  {/* DETAIL KONTEN JURUSAN */}
                  <div className="p-5">
                    <h4 className="flex min-h-[2.5rem] items-center text-sm font-bold tracking-wide text-slate-950 uppercase">
                      {major.name}
                    </h4>

                    <p className="mt-2 line-clamp-4 text-justify text-xs leading-relaxed text-slate-600">
                      {major.desc}
                    </p>

                    {/* AUTHOR + TANGGAL */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                        <span>{major.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                        <time dateTime={major.date}>{major.date}</time>
                      </div>
                    </div>
                  </div>

                  {/* CATATAN KAKI KARTU */}
                  <div className="border-t border-slate-100 px-5 pt-3 pb-5">
                    <span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Kode Kompetensi: REG-{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
