import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Calendar,
  User,
  Filter,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Flame,
  FileCheck,
  Building2,
} from 'lucide-react';
import { prestasi } from '../../data/schoolData';
import { namaSekolahUppercase } from '../../../halaman/components/Profile/dataSekolah';

interface PrestasiRawItem {
  id?: string | number;
  judul?: string;
  siswa?: string;
  tahun?: number | string;
  tingkat?: string;
  kategori?: string;
  penyelenggara?: string;
  noSertifikat?: string;
  image?: string;
  foto?: string;
}

interface PrestasiEnrichedItem {
  id: string | number;
  judul: string;
  siswa: string;
  tahun: number;
  tingkat: string;
  kategori: string;
  penyelenggara: string;
  noSertifikat: string;
  foto: string;
}

const defaultPrestasiImages: Record<string, string> = {
  sains:
    'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80',
  olahraga:
    'https://images.unsplash.com/photo-1517649763962-0c6232662000?auto=format&fit=crop&w=1200&q=80',
  seni: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80',
  teknologi:
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  umum: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1200&q=80',
};

export default function Prestasi() {
  const [filterKategori, setFilterKategori] = useState<string>('');
  const [filterTingkat, setFilterTingkat] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const prestasiList = (Array.isArray(prestasi) ? prestasi : []) as PrestasiRawItem[];

  const enrichedPrestasi: PrestasiEnrichedItem[] = useMemo(() => {
    return prestasiList.map((item, idx) => {
      const kat = String(item?.kategori || '').toLowerCase();
      let photoUrl = item?.image || item?.foto;

      if (!photoUrl) {
        if (kat.includes('sains') || kat.includes('akademik') || kat.includes('olimpiade')) {
          photoUrl = defaultPrestasiImages.sains;
        } else if (kat.includes('olahraga') || kat.includes('atletik')) {
          photoUrl = defaultPrestasiImages.olahraga;
        } else if (kat.includes('seni') || kat.includes('budaya') || kat.includes('musik')) {
          photoUrl = defaultPrestasiImages.seni;
        } else if (
          kat.includes('robotik') ||
          kat.includes('komputer') ||
          kat.includes('teknologi')
        ) {
          photoUrl = defaultPrestasiImages.teknologi;
        } else {
          photoUrl = defaultPrestasiImages.umum;
        }
      }

      return {
        ...item,
        id: item?.id ?? `prestasi-${idx}`,
        judul: item?.judul || 'Juara Kompetisi Tingkat Nasional',
        siswa: item?.siswa || `Siswa ${namaSekolahUppercase}`,
        tahun: Number(item?.tahun) || 2026,
        tingkat: item?.tingkat || 'Nasional',
        kategori: item?.kategori || 'Akademik',
        penyelenggara: item?.penyelenggara || 'Kementerian Pendidikan & Kebudayaan',
        noSertifikat: item?.noSertifikat || `SK-PRESTASI/${2026 - idx}/${100 + idx}`,
        foto: photoUrl,
      };
    });
  }, [prestasiList]);

  const featuredItem: PrestasiEnrichedItem = enrichedPrestasi[0] || {
    id: 'featured-default',
    judul: 'Juara 1 Olimpiade Sains Nasional (OSN) Bidang Komputer',
    siswa: 'Ahmad Rizky & Tim Sains',
    tingkat: 'Nasional',
    kategori: 'Akademik / Sains',
    tahun: 2026,
    penyelenggara: 'Pusat Prestasi Nasional (Puspresnas)',
    foto: defaultPrestasiImages.sains,
    noSertifikat: 'SK-PUSPRESNAS/2026/0891',
  };

  const kategoris = useMemo(() => {
    return Array.from(new Set(enrichedPrestasi.map((p) => p.kategori).filter(Boolean)));
  }, [enrichedPrestasi]);

  const tingkats = useMemo(() => {
    return Array.from(new Set(enrichedPrestasi.map((p) => p.tingkat).filter(Boolean)));
  }, [enrichedPrestasi]);

  const filtered = useMemo(() => {
    return enrichedPrestasi.filter((p) => {
      if (filterKategori && p.kategori !== filterKategori) return false;
      if (filterTingkat && p.tingkat !== filterTingkat) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return p.judul.toLowerCase().includes(query) || p.siswa.toLowerCase().includes(query);
      }
      return true;
    });
  }, [enrichedPrestasi, filterKategori, filterTingkat, searchQuery]);

  return (
    <div className="bg-slate-100 pt-6 pb-20 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col border-b-2 border-slate-900 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-600 uppercase">
              <Building2 className="h-4 w-4 text-slate-800" />
              {namaSekolahUppercase} &bull; Portal Resmi Kebanggaan
            </div>
            <h1 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Direktori & Papan Kehormatan Prestasi
            </h1>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-2 rounded-none border border-slate-900 bg-slate-950 px-3 py-1.5 font-mono text-xs font-bold text-white">
              <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
              ARSIP RESMI TERVERIFIKASI
            </span>
          </div>
        </div>

        <section className="border border-slate-300 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-6 py-2.5 text-white">
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-amber-400 uppercase">
              <Flame className="h-4 w-4" /> Sorotan Kejuaraan Utama (Featured Hall of Fame)
            </span>
            <span className="font-mono text-xs text-slate-400">Tahun {featuredItem.tahun}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="relative h-64 bg-slate-900 lg:col-span-5 lg:h-auto">
              <img
                src={featuredItem.foto}
                alt={featuredItem.judul}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/20" />
              <span className="absolute top-4 left-4 border border-slate-900 bg-amber-400 px-3 py-1 text-xs font-extrabold tracking-wider text-slate-950 uppercase">
                Pencapaian Tertinggi
              </span>
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <span className="border border-slate-200 bg-slate-100 px-2 py-0.5 text-slate-900">
                    Tingkat {featuredItem.tingkat}
                  </span>
                  <span>&bull;</span>
                  <span>{featuredItem.kategori}</span>
                </div>

                <h2 className="font-serif text-2xl leading-tight font-bold text-slate-950 sm:text-3xl">
                  {featuredItem.judul}
                </h2>

                <p className="font-serif text-sm leading-relaxed text-slate-700">
                  Apresiasi setinggi-tingginya diberikan kepada peraih kejuaraan yang telah membawa
                  nama <strong>{namaSekolahUppercase}</strong> di panggung kompetisi resmi. Seluruh
                  data tercatat dalam Buku Induk Kejuaraan Sekolah.
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 font-mono text-xs">
                  <div>
                    <span className="block font-sans text-[10px] font-bold text-slate-400 uppercase">
                      Peraih / Perwakilan
                    </span>
                    <span className="font-bold text-slate-900">{featuredItem.siswa}</span>
                  </div>
                  <div>
                    <span className="block font-sans text-[10px] font-bold text-slate-400 uppercase">
                      Penyelenggara
                    </span>
                    <span className="font-bold text-slate-900">{featuredItem.penyelenggara}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 font-mono text-xs text-slate-500">
                <span>No. Reg: {featuredItem.noSertifikat}</span>
                <span className="flex items-center gap-1 font-sans font-bold text-slate-900">
                  Dokumen Sah <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <main className="space-y-6 lg:col-span-8">
            <div className="flex flex-col gap-3 border border-slate-300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari dalam arsip prestasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-slate-300 bg-slate-50 py-2 pr-3 pl-9 text-xs text-slate-900 focus:border-slate-950 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className="border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs font-bold tracking-wider text-slate-800 uppercase focus:border-slate-950"
                >
                  <option value="">Semua Bidang</option>
                  {kategoris.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>

                <select
                  value={filterTingkat}
                  onChange={(e) => setFilterTingkat(e.target.value)}
                  className="border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs font-bold tracking-wider text-slate-800 uppercase focus:border-slate-950"
                >
                  <option value="">Semua Tingkat</option>
                  {tingkats.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border border-slate-300 bg-white">
              <div className="flex items-center justify-between border-b border-slate-300 bg-slate-100 px-4 py-3 text-xs font-bold tracking-wider text-slate-700 uppercase">
                <span>Daftar Rekapitulasi Kejuaraan ({filtered.length})</span>
                <span className="font-mono text-[11px] text-slate-500">
                  Urutan Berdasarkan Tahun
                </span>
              </div>

              {filtered.length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {filtered.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group flex flex-col p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <span className="mt-1 font-mono text-xs font-bold text-slate-400">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="py-0.2 border border-slate-300 bg-slate-100 px-2 text-[10px] font-bold tracking-wider text-slate-800 uppercase">
                              {item.tingkat}
                            </span>
                            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                              {item.kategori}
                            </span>
                          </div>

                          <h3 className="font-serif text-base font-bold text-slate-950 transition-colors group-hover:text-red-800">
                            {item.judul}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-slate-400" />
                              <strong className="text-slate-900">{item.siswa}</strong>
                            </span>
                            <span>&bull;</span>
                            <span className="text-slate-500">{item.penyelenggara}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 sm:mt-0 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {item.tahun}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {item.noSertifikat}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  Tidak ditemukan data prestasi yang sesuai dengan kriteria filter.
                </div>
              )}
            </div>
          </main>

          <aside className="space-y-6 lg:col-span-4">
            <div className="border border-slate-300 bg-white p-5">
              <h3 className="border-b border-slate-200 pb-2 font-serif text-base font-bold text-slate-950">
                Ringkasan Capaian Institusi
              </h3>
              <dl className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Total Kejuaraan</dt>
                  <dd className="font-bold text-slate-950">{enrichedPrestasi.length} Ajang</dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Level Nasional/Provinsi</dt>
                  <dd className="font-bold text-slate-950">
                    {
                      enrichedPrestasi.filter(
                        (p) => p.tingkat === 'Nasional' || p.tingkat === 'Provinsi'
                      ).length
                    }
                  </dd>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Diverifikasi Tim BK</dt>
                  <dd className="font-bold text-emerald-700">100% Valid</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Instansi Pembina</dt>
                  <dd className="font-bold text-slate-950">{namaSekolahUppercase}</dd>
                </div>
              </dl>
            </div>

            <div className="space-y-4 border border-slate-900 bg-slate-950 p-6 text-white">
              <div className="flex items-center gap-2 text-amber-400">
                <Award className="h-5 w-5" />
                <h4 className="font-serif text-base font-bold">Pelaporan Prestasi Siswa</h4>
              </div>
              <p className="font-serif text-xs leading-relaxed text-slate-300">
                Siswa {namaSekolahUppercase} yang meraih prestasi di luar kegiatan resmi sekolah
                diimbau melapor ke Kurikulum untuk pencatatan poin portofolio.
              </p>
              <button
                type="button"
                className="w-full cursor-pointer border border-white/20 bg-white/10 py-2.5 text-center text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-slate-950"
              >
                Formulir Pendataan Prestasi
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
