import React from 'react';

const layanan = [
  {
    nomor: '01',
    judul: 'Informasi Akademik',
    deskripsi:
      'Wali murid dan siswa dapat memantau jadwal pelajaran, pengumuman kegiatan tengah semester, kalender pendidikan, serta informasi darurat secara berkala.',
  },
  {
    nomor: '02',
    judul: 'Pemantauan Studi',
    deskripsi:
      'Keterbukaan rekaman presensi kehadiran dan evaluasi belajar harian untuk mendukung kemajuan studi peserta didik secara transparan.',
  },
  {
    nomor: '03',
    judul: 'Pelayanan Terpadu',
    deskripsi:
      'Kantor Tata Usaha melayani administrasi siswa, legalisasi dokumen resmi, serta konsultasi wali murid sesuai jam kerja instansi.',
  },
  {
    nomor: '04',
    judul: 'Layanan Daring',
    deskripsi:
      'Pengiriman berkas administratif dan konsultasi ringan dapat dilakukan melalui surel resmi sekolah di luar jam kerja operasional kantor.',
  },
];

const jadwal = [
  { hari: 'Senin – Kamis', jam: '07.00 – 14.00 WIB', libur: false },
  { hari: 'Jumat', jam: '07.00 – 11.00 WIB', libur: false },
  { hari: 'Sabtu – Minggu', jam: 'Tutup', libur: true },
];

const kontak = [
  { label: 'Telepon', value: '(061) 4527593' },
  { label: 'Surel', value: 'info@sman1medan.sch.id' },
  { label: 'Alamat', value: 'Jl. Teuku Cik Ditiro No. 1, Medan Baru, Kota Medan 20152' },
];

export default function Operasional() {
  return (
    <div className="bg-white font-serif">
      {/* HERO — Judul + Sub-heading */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-4 md:px-12 md:pt-10">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Operasional & Layanan</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-700">
          Informasi ketersediaan layanan, jam operasional kantor, serta saluran kontak resmi untuk
          komunikasi dengan sekolah.
        </p>
      </div>

      {/* KONTEN */}
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        {/* LAYANAN */}
        <section className="pt-10 md:pt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">
            Layanan yang Tersedia
          </h3>
          <p className="mb-4 text-justify text-[15px] leading-relaxed text-slate-800">
            Berbagai bentuk layanan yang tersedia bagi peserta didik, orang tua, dan masyarakat umum
            untuk memastikan kelancaran proses pendidikan dan komunikasi yang efektif antara sekolah
            dengan seluruh pemangku kepentingan.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {layanan.map((item) => (
              <div key={item.nomor} className="border border-slate-200 bg-white px-6 py-6">
                <div className="text-[13px] font-semibold text-slate-400 tabular-nums">
                  {item.nomor}
                </div>
                <h4 className="mt-2 text-[15px] font-bold text-slate-900">{item.judul}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-800">{item.deskripsi}</p>
              </div>
            ))}
          </div>
        </section>

        {/* JAM OPERASIONAL & KONTAK */}
        <section className="pt-10 md:pt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">
            Jam Operasional & Kontak
          </h3>
          <p className="mb-4 text-justify text-[15px] leading-relaxed text-slate-800">
            Kantor Tata Usaha beroperasi sesuai jadwal resmi berikut. Pelayanan di luar jam
            operasional dapat dilakukan melalui saluran daring resmi sekolah.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Jam Operasional */}
            <div>
              <h4 className="mb-4 text-[15px] font-bold text-slate-900">Jam Operasional</h4>
              <div className="border-t border-slate-200">
                {jadwal.map((row) => (
                  <div
                    key={row.hari}
                    className="flex items-baseline justify-between border-b border-slate-200 py-3"
                  >
                    <span
                      className={`text-[15px] ${row.libur ? 'text-slate-500' : 'text-slate-800'}`}
                    >
                      {row.hari}
                    </span>
                    <span
                      className={`text-[15px] font-semibold tabular-nums ${
                        row.libur ? 'text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {row.jam}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[13px] text-slate-500 italic">
                Pelayanan di luar jam operasional dapat dilakukan melalui saluran daring resmi.
              </p>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="mb-4 text-[15px] font-bold text-slate-900">
                Saluran Komunikasi Resmi
              </h4>
              <div className="border-t border-slate-200">
                {kontak.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-baseline justify-between border-b border-slate-200 py-3"
                  >
                    <span className="text-[15px] text-slate-600">{item.label}</span>
                    <span className="text-[15px] font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
