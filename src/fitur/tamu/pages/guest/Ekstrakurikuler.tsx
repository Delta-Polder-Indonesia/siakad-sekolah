import { useState, useMemo } from 'react';
import {
  Users,
  Clock,
  Star,
  Layers,
  Activity,
  Calendar,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { ekstrakurikuler } from '../../data/schoolData';
import { namaSekolahUppercase } from '../../../halaman/components/Profile/dataSekolah';

export default function Ekstrakurikuler() {
  const [filterKategori, setFilterKategori] = useState('');

  // Defensive check for array safety
  const ekskulList = useMemo(() => (Array.isArray(ekstrakurikuler) ? ekstrakurikuler : []), []);

  const kategoris = useMemo(
    () => [...new Set(ekskulList.map((e) => e?.kategori).filter(Boolean))],
    [ekskulList]
  );

  const filtered = useMemo(() => {
    return ekskulList.filter((e) => {
      if (filterKategori && e?.kategori !== filterKategori) return false;
      return true;
    });
  }, [ekskulList, filterKategori]);

  const totalAnggota = useMemo(() => {
    return ekskulList.reduce((sum, e) => sum + (Number(e?.anggota) || 0), 0);
  }, [ekskulList]);

  return (
    <div className="w-full rounded-none bg-white pb-16 font-sans text-slate-900">
      {/* Dynamic Header Banner - Pertamina Formal Style */}
      <div className="rounded-none border-b-2 border-slate-950 bg-slate-900 px-6 py-8 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <ShieldCheck className="h-4 w-4 text-red-600" />
              <span>Pengembangan Minat & Bakat Siswa</span>
            </div>
            <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-white uppercase md:text-3xl">
              Ekstrakurikuler {namaSekolahUppercase}
            </h1>
            <p className="mt-2 max-w-2xl font-sans text-sm text-slate-300">
              Wadah pengembangan potensi non-akademik, kepemimpinan, dan kreativitas siswa SMA
              NEGERI 1 MEDAN secara profesional dan terstruktur.
            </p>
          </div>
          <div className="hidden shrink-0 border-l-2 border-red-600 pl-4 md:block">
            <span className="block font-serif text-2xl font-bold text-white">
              {ekskulList.length}
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Program Aktif
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Metric Summary Bar */}
        <div className="grid grid-cols-1 gap-4 rounded-none border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-3 md:border-r md:border-b-0 md:pr-4 md:pb-0">
            <div className="rounded-none bg-slate-900 p-3 text-white">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Total Jenis Ekskul
              </p>
              <p className="font-serif text-2xl font-bold text-slate-950">{ekskulList.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 pb-3 md:border-r md:border-b-0 md:pr-4 md:pb-0">
            <div className="rounded-none bg-slate-900 p-3 text-white">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Total Peserta Terdaftar
              </p>
              <p className="font-serif text-2xl font-bold text-slate-950">{totalAnggota}+</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-none bg-slate-900 p-3 text-white">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Kategori Bidang
              </p>
              <p className="font-serif text-2xl font-bold text-slate-950">{kategoris.length}</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-none border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Star className="h-4 w-4 text-red-600" />
            <span className="text-xs font-bold tracking-wider text-slate-800 uppercase">
              Filter Kategori
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterKategori('')}
              className={`rounded-none border px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all ${
                !filterKategori
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Semua Kategori
            </button>
            {kategoris.map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setFilterKategori(k)}
                className={`rounded-none border px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all ${
                  filterKategori === k
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ekskul, index) => (
            <div
              key={ekskul?.id || ekskul?.nama || index}
              className="group flex flex-col justify-between rounded-none border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-950 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <h3 className="font-serif text-lg font-bold tracking-tight text-slate-950 transition-colors group-hover:text-red-600">
                    {ekskul?.nama}
                  </h3>
                  <span className="shrink-0 rounded-none border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-700 uppercase">
                    {ekskul?.kategori || 'Umum'}
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <Users className="h-4 w-4 shrink-0 text-slate-500" />
                    <span>{ekskul?.anggota ?? 0} Anggota Terdaftar</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <Clock className="h-4 w-4 shrink-0 text-slate-500" />
                    <span>{ekskul?.jadwal || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-slate-900 group-hover:text-red-600">
                <span>Detail Program</span>
                <ChevronRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Informasi Pendaftaran Official Footer Box */}
        <div className="relative overflow-hidden rounded-none border border-slate-200 bg-slate-50 p-6">
          <div className="absolute top-0 left-0 h-full w-1 bg-red-600"></div>
          <h3 className="flex items-center gap-2 font-serif text-base font-bold tracking-tight text-slate-950 uppercase">
            <Calendar className="h-4 w-4 text-red-600" />
            Ketentuan & Pendaftaran Ekstrakurikuler
          </h3>
          <p className="mt-2 text-xs leading-relaxed font-medium text-slate-700">
            Siswa {namaSekolahUppercase} dapat mendaftar kegiatan ekstrakurikuler pada awal tahun
            ajaran baru melalui koordinasi Pembina dan Kesiswaan. Setiap siswa wajib mengikuti
            minimal satu kegiatan ekstrakurikuler reguler sebagai pemenuhan pengembangan diri dan
            penilaian karakter.
          </p>
        </div>
      </div>
    </div>
  );
}
