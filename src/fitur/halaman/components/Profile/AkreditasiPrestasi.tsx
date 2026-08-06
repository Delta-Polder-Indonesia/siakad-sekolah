import React from 'react';

type Sertifikasi = {
  nama: string;
  penerbit: string;
  tahun: string;
  status: string;
};

type Prestasi = {
  tahun: string;
  nama: string;
  tingkat: 'Internasional' | 'Nasional' | 'Provinsi' | 'Kota';
  kategori: string;
};

const sertifikasi: Sertifikasi[] = [
  {
    nama: 'Akreditasi A (Unggul)',
    penerbit: 'BAN-S/M',
    tahun: '2023',
    status: 'Berlaku hingga 2028',
  },
  {
    nama: 'Sekolah Adiwiyata Nasional',
    penerbit: 'Kementerian LHK',
    tahun: '2021',
    status: 'Aktif',
  },
  {
    nama: 'ISO 9001:2015',
    penerbit: 'SGS Indonesia',
    tahun: '2022',
    status: 'Berlaku hingga 2025',
  },
  {
    nama: 'Sekolah Ramah Anak',
    penerbit: 'Kementerian PPPA',
    tahun: '2020',
    status: 'Aktif',
  },
];

const prestasi: Prestasi[] = [
  {
    tahun: '2024',
    nama: 'Juara 1 Olimpiade Sains Nasional (OSN) Bidang Fisika',
    tingkat: 'Nasional',
    kategori: 'Akademik',
  },
  {
    tahun: '2024',
    nama: 'Medali Emas Kompetisi Robotika ASEAN',
    tingkat: 'Internasional',
    kategori: 'Teknologi',
  },
  {
    tahun: '2023',
    nama: 'Juara Umum FLS2N Tingkat Provinsi Sumatera Utara',
    tingkat: 'Provinsi',
    kategori: 'Seni & Budaya',
  },
  {
    tahun: '2023',
    nama: 'Juara 2 Lomba Karya Tulis Ilmiah Nasional',
    tingkat: 'Nasional',
    kategori: 'Akademik',
  },
  {
    tahun: '2023',
    nama: 'Juara 1 Turnamen Basket Antar SMA Kota Medan',
    tingkat: 'Kota',
    kategori: 'Olahraga',
  },
  {
    tahun: '2022',
    nama: 'Medali Perak Olimpiade Matematika Internasional',
    tingkat: 'Internasional',
    kategori: 'Akademik',
  },
  {
    tahun: '2022',
    nama: 'Juara 1 Debat Bahasa Inggris Tingkat Nasional',
    tingkat: 'Nasional',
    kategori: 'Bahasa',
  },
  {
    tahun: '2022',
    nama: 'Sekolah Terinovatif — Anugerah Pendidikan Sumut',
    tingkat: 'Provinsi',
    kategori: 'Institusi',
  },
];

const highlight = [
  { value: '150+', label: 'Prestasi 5 Tahun Terakhir' },
  { value: '12', label: 'Medali Internasional' },
  { value: '48', label: 'Juara Tingkat Nasional' },
  { value: '4', label: 'Sertifikasi Aktif' },
];

const tingkatColor: Record<Prestasi['tingkat'], string> = {
  Internasional: 'text-red-600',
  Nasional: 'text-slate-900',
  Provinsi: 'text-slate-700',
  Kota: 'text-slate-500',
};

export default function AkreditasiPrestasi() {
  return (
    <div className="bg-white font-serif">
      {/* HERO — Judul + Sub-heading */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-4 md:px-12 md:pt-10">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Akreditasi & Prestasi</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-700">
          Pengakuan atas komitmen mutu dan capaian institusi. Berbagai sertifikasi dan prestasi yang
          diraih menjadi cerminan konsistensi kami dalam menyelenggarakan pendidikan yang
          berkualitas dan berdaya saing.
        </p>
      </div>

      {/* KONTEN */}
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        {/* HIGHLIGHT ANGKA */}
        <section className="pt-10 md:pt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">
            Ringkasan Capaian
          </h3>
          <p className="mb-4 text-justify text-[15px] leading-relaxed text-slate-800">
            Dalam lima tahun terakhir, institusi kami telah menorehkan berbagai pencapaian
            signifikan di berbagai bidang, mulai dari akademik hingga olahraga, yang menegaskan
            posisi kami sebagai lembaga pendidikan unggulan.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {highlight.map((h) => (
              <div key={h.label} className="border border-slate-200 bg-white px-6 py-6 text-center">
                <div className="text-3xl font-bold text-slate-900 md:text-4xl">{h.value}</div>
                <div className="mt-2 text-[13px] font-medium tracking-wide text-slate-600 uppercase">
                  {h.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SERTIFIKASI */}
        <section className="pt-10 md:pt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">Sertifikasi</h3>
          <p className="mb-4 text-justify text-[15px] leading-relaxed text-slate-800">
            Akreditasi dan sertifikasi resmi dari berbagai lembaga pemerintah dan independen sebagai
            bentuk pengakuan atas kualitas penyelenggaraan pendidikan. Setiap sertifikasi
            mencerminkan komitmen kami terhadap standar mutu yang konsisten dan berkelanjutan.
          </p>
          <div className="mt-6 border-t border-slate-200">
            {sertifikasi.map((s) => (
              <div
                key={s.nama}
                className="flex items-baseline justify-between border-b border-slate-200 py-3"
              >
                <div className="flex-1">
                  <span className="text-[15px] font-semibold text-slate-900">{s.nama}</span>
                  <span className="ml-2 text-[13px] text-slate-500">— {s.penerbit}</span>
                </div>
                <div className="ml-6 flex-shrink-0 text-right">
                  <span className="text-[13px] text-slate-600">{s.tahun}</span>
                  <span className="ml-2 text-[13px] text-slate-500">({s.status})</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRESTASI */}
        <section className="pt-10 md:pt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">
            Rekam Jejak Prestasi
          </h3>
          <p className="mb-4 text-justify text-[15px] leading-relaxed text-slate-800">
            Prestasi peserta didik dan institusi pada berbagai ajang akademik dan non-akademik dari
            tingkat kota hingga internasional. Setiap capaian merupakan hasil dari kerja keras,
            dedikasi, dan dukungan penuh dari seluruh komunitas sekolah.
          </p>
          <div className="mt-6 border-t border-slate-200">
            {prestasi.map((p) => (
              <div
                key={p.nama}
                className="flex items-start justify-between border-b border-slate-200 py-3"
              >
                <div className="flex-1">
                  <span
                    className={`text-[13px] font-semibold tracking-wide uppercase ${tingkatColor[p.tingkat]}`}
                  >
                    {p.tingkat} · {p.kategori}
                  </span>
                  <p className="mt-0.5 text-[15px] font-semibold text-slate-900">{p.nama}</p>
                </div>
                <div className="ml-6 flex-shrink-0">
                  <span className="text-[15px] font-semibold text-slate-900 tabular-nums">
                    {p.tahun}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-slate-500 italic">
            Menampilkan prestasi terpilih. Data lengkap tersedia di kantor Tata Usaha.
          </p>
        </section>
      </div>
    </div>
  );
}
