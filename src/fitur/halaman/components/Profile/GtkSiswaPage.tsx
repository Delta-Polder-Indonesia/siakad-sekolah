import React from 'react';

import { komposisiGtk, statistikSiswa, tahunAjaran, totalGtk } from './dataSekolah';

export default function GtkSiswaPage() {
  return (
    <div className="bg-white font-serif">
      {/* HERO — Judul + Sub-heading */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-4 md:px-12 md:pt-10">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">GTK & Siswa</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-700">
          Komposisi tenaga pendidik, tenaga kependidikan, serta statistik peserta didik SMA Negeri 1
          Medan pada tahun ajaran {tahunAjaran}.
        </p>
      </div>

      {/* KONTEN */}
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        {/* TOTAL GTK */}
        <section className="pt-10 md:pt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">
            Tenaga Pendidik & Kependidikan
          </h3>
          <p className="mb-4 text-justify text-[15px] leading-relaxed text-slate-800">
            Total sumber daya manusia yang mengelola proses pembelajaran dan administrasi sekolah
            secara profesional. Komposisi ini mencerminkan kesiapan institusi dalam menyelenggarakan
            pendidikan yang berkualitas.
          </p>
          <div className="mt-6 border border-slate-200 bg-white px-6 py-6 text-center">
            <div className="text-3xl font-bold text-slate-900 md:text-4xl">{totalGtk}</div>
            <div className="mt-2 text-[13px] font-medium tracking-wide text-slate-600 uppercase">
              Total GTK (Guru dan Tenaga Kependidikan)
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {komposisiGtk.map((item) => (
              <div
                key={item.category}
                className="border border-slate-200 bg-white px-6 py-6 text-center"
              >
                <div className="text-3xl font-bold text-slate-900 md:text-4xl">{item.count}</div>
                <div className="mt-2 text-[13px] font-medium tracking-wide text-slate-600 uppercase">
                  {item.category}
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-800">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATISTIK SISWA */}
        <section className="pt-10 md:pt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">Peserta Didik</h3>
          <p className="mb-4 text-justify text-[15px] leading-relaxed text-slate-800">
            Indikator kunci yang menggambarkan kualitas dan hasil penyelenggaraan pendidikan di SMA
            Negeri 1 Medan. Data berikut mencakup jumlah siswa aktif, rasio guru-siswa, tingkat
            kelulusan, dan penyerapan kerja lulusan.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statistikSiswa.map((stat) => (
              <div
                key={stat.label}
                className="border border-slate-200 bg-white px-6 py-6 text-center"
              >
                <div className="text-3xl font-bold text-slate-900 md:text-4xl">{stat.value}</div>
                <div className="mt-2 text-[13px] font-medium tracking-wide text-slate-600 uppercase">
                  {stat.label}
                </div>
                <p className="mt-1 text-[13px] text-slate-500">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER NOTE */}
        <section className="pt-10 md:pt-12">
          <p className="text-[13px] text-slate-500 italic">
            Data disinkronisasi pada periode tahun ajaran {tahunAjaran} • Update terakhir: Januari
            2025
          </p>
        </section>
      </div>
    </div>
  );
}
