import React from 'react';
import { namaSekolah } from './dataSekolah';

// ============================================================================
// TIPE DATA & INTERFACE
// ============================================================================

interface NodeData {
  jabatan: string;
  nama?: string;
}

interface NodeProps {
  data: NodeData;
  primary?: boolean;
}

interface VLineProps {
  height?: string;
}

// ============================================================================
// DATA STRUCTURE
// ============================================================================

const kepsek: NodeData = {
  jabatan: 'Kepala Sekolah',
  nama: 'Drs. H. Mulyono, M.Pd.',
};

const level2: NodeData[] = [
  { jabatan: 'Komite Sekolah' },
  { jabatan: 'Kepala Tata Usaha', nama: 'Didik Subiyantoro' },
];

const wakil: NodeData[] = [
  { jabatan: 'Waka Kurikulum', nama: 'Samiran, S.Pd.I' },
  { jabatan: 'Waka Sarpras', nama: 'Drs. Cahyo Sumargo' },
  { jabatan: 'Waka Kesiswaan', nama: "Moh. In'am Fathur Riza, S.Pd.I" },
  { jabatan: 'Waka Humas', nama: 'Sunhaji, S.Pd' },
];

const unit: NodeData[] = [
  { jabatan: 'Kepala Perpustakaan', nama: 'Siti Qotidjah N.K., S.Pd' },
  { jabatan: 'Kepala Laboratorium', nama: 'Drs. Sinar Agus' },
];

// ============================================================================
// KOMPONEN BANTU
// ============================================================================

const Node: React.FC<NodeProps> = ({ data, primary = false }) => (
  <div
    className={`w-full border border-slate-200 px-5 py-4 text-center ${
      primary ? 'bg-slate-900 text-white' : 'bg-white'
    }`}
  >
    <p
      className={`text-[13px] font-semibold tracking-wide uppercase ${
        primary ? 'text-white/60' : 'text-slate-600'
      }`}
    >
      {data.jabatan}
    </p>
    {data.nama && (
      <p className={`mt-1.5 text-[15px] font-bold ${primary ? 'text-white' : 'text-slate-900'}`}>
        {data.nama}
      </p>
    )}
  </div>
);

const VLine: React.FC<VLineProps> = ({ height = 'h-8' }) => (
  <div className={`w-px ${height} bg-slate-300`} />
);

// ============================================================================
// KOMPONEN UTAMA
// ============================================================================

export default function StrukturOrganisasi() {
  return (
    <div className="bg-white font-serif">
      {/* HERO — Judul + Sub-heading */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-4 md:px-12 md:pt-10">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Struktur Organisasi</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-700">
          Bagan organisasi dan tata kerja {namaSekolah} yang menggambarkan hierarki serta hubungan
          koordinasi antar unit dalam penyelenggaraan pendidikan.
        </p>
      </div>

      {/* KONTEN */}
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        {/* BAGAN ORGANISASI */}
        <section className="pt-10 md:pt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">
            Bagan Organisasi
          </h3>
          <p className="mb-4 text-justify text-[15px] leading-relaxed text-slate-800">
            Struktur organisasi sekolah dirancang untuk memastikan alur koordinasi yang jelas dan
            efektif antara pimpinan, unit struktural, serta seluruh pemangku kepentingan pendidikan.
          </p>
          <div className="mt-6 overflow-x-auto">
            <div className="mx-auto flex min-w-[720px] flex-col items-center">
              {/* Level 1 — Kepala Sekolah */}
              <div className="w-full max-w-xs">
                <Node data={kepsek} primary />
              </div>

              <VLine />

              {/* Level 2 — Komite & KTU */}
              <div className="relative w-full max-w-2xl">
                {/* Garis horizontal penghubung */}
                <div className="absolute top-0 right-1/4 left-1/4 h-px bg-slate-300" />

                <div className="grid grid-cols-2 gap-8">
                  {level2.map((item) => (
                    <div key={item.jabatan} className="flex flex-col items-center">
                      <VLine height="h-6" />
                      <div className="w-full max-w-[240px]">
                        <Node data={item} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <VLine />

              {/* Level 3 — Wakil Kepala (4 kolom) */}
              <div className="relative w-full max-w-5xl">
                {/* Responsif penyesuaian garis penghubung sesuai grid 2 kolom / 4 kolom */}
                <div className="absolute top-0 right-1/4 left-1/4 h-px bg-slate-300 md:right-[12.5%] md:left-[12.5%]" />

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                  {wakil.map((item) => (
                    <div key={item.jabatan} className="flex flex-col items-center">
                      <VLine height="h-6" />
                      <Node data={item} />
                    </div>
                  ))}
                </div>
              </div>

              <VLine />

              {/* Level 4 — Unit Pendukung */}
              <div className="relative w-full max-w-2xl">
                <div className="absolute top-0 right-1/4 left-1/4 h-px bg-slate-300" />

                <div className="grid grid-cols-2 gap-8">
                  {unit.map((item) => (
                    <div key={item.jabatan} className="flex flex-col items-center">
                      <VLine height="h-6" />
                      <div className="w-full max-w-[240px]">
                        <Node data={item} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <VLine />

              {/* Level 5 — Guru BK / Wali Kelas */}
              <div className="w-full max-w-xs">
                <Node data={{ jabatan: 'Guru BK & Wali Kelas' }} />
              </div>

              <VLine />

              {/* Level 6 — Siswa */}
              <div className="w-full max-w-xs">
                <Node data={{ jabatan: 'Siswa / Peserta Didik' }} primary />
              </div>
            </div>
          </div>
        </section>

        {/* KETERANGAN */}
        <section className="pt-10 md:pt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">Keterangan</h3>
          <p className="mb-4 text-justify text-[15px] leading-relaxed text-slate-800">
            Berikut penjelasan singkat mengenai peran masing-masing tingkatan dalam struktur
            organisasi sekolah.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="border border-slate-200 bg-white px-6 py-6">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 bg-slate-900" />
                <p className="text-[15px] font-bold text-slate-900">Pimpinan Tertinggi</p>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-800">
                Kepala Sekolah sebagai pemimpin tertinggi yang bertanggung jawab atas seluruh
                penyelenggaraan pendidikan.
              </p>
            </div>

            <div className="border border-slate-200 bg-white px-6 py-6">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 border border-slate-300 bg-white" />
                <p className="text-[15px] font-bold text-slate-900">Unit Struktural</p>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-800">
                Wakil Kepala Sekolah dan unit pendukung yang mengelola bidang spesifik sesuai tugas
                dan fungsinya.
              </p>
            </div>

            <div className="border border-slate-200 bg-white px-6 py-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-slate-400" />
                <p className="text-[15px] font-bold text-slate-900">Garis Koordinasi</p>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-800">
                Menunjukkan hubungan hierarki dan alur koordinasi antar unit dalam struktur
                organisasi.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
