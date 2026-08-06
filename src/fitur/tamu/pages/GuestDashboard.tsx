import React, { useMemo } from 'react';
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useGuestBook } from '../context/GuestBookContext';
import { siteMedia } from '../data/siteMedia';
import AgendaWidget from '../components/AgendaWidget';
import {
  namaSekolahUppercase,
  alamatLengkap,
  telepon,
  email,
  mapsQuery,
} from '../../halaman/components/Profile/dataSekolah';

interface GuestDashboardProps {
  onNavigate: (page: string) => void;
}

export default function GuestDashboard({ onNavigate }: GuestDashboardProps) {
  const { entries: guestEntries = [] } = useGuestBook();

  // Kalkulasi rata-rata rating yang aman dari NaN
  const avgRating = useMemo(() => {
    if (!guestEntries || guestEntries.length === 0) return '0.0';
    const total = guestEntries.reduce((sum, e) => sum + (Number(e.rating) || 0), 0);
    return (total / guestEntries.length).toFixed(1);
  }, [guestEntries]);

  // Mengambil 3 entri terbaru
  const recentGuests = useMemo(() => {
    if (!guestEntries) return [];
    return [...guestEntries].reverse().slice(0, 3);
  }, [guestEntries]);

  const handleOpenMaps = () => {
    window.open(`https://maps.google.com/?q=${mapsQuery}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 font-serif">
      {/* ══════════════════════════════════════════════════════
          HERO SECTION (INTEGRATED SINGLE COMPOSITION)
          ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[72vh] overflow-hidden border border-slate-200 bg-slate-950">
        <img
          src={siteMedia.heroCampus}
          alt={`Kegiatan belajar siswa di ${namaSekolahUppercase}`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/50 to-slate-950/30" />
        <div className="relative z-10 flex min-h-[72vh] items-end p-6 sm:p-10 lg:p-14">
          <div className="max-w-3xl space-y-5 text-white">
            <span className="inline-block rounded-md border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-slate-200 uppercase backdrop-blur-sm">
              Portal Resmi Instansi • {namaSekolahUppercase}
            </span>
            <h1 className="text-3xl leading-tight font-bold tracking-tight text-white sm:text-5xl">
              Portal Informasi Resmi Untuk Orang Tua, Calon Siswa, dan Masyarakat
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Akses informasi PPDB, profil sekolah, program unggulan, prestasi, dan agenda akademik
              {namaSekolahUppercase} dalam satu portal yang terstruktur.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('ppdb')}
                className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-5 py-3 text-xs font-bold tracking-wider text-slate-950 uppercase transition-colors hover:bg-slate-100 focus:outline-none"
              >
                <GraduationCap className="h-4 w-4" />
                Informasi PPDB
              </button>
              <button
                type="button"
                onClick={() => onNavigate('tentang-sekolah')}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-white/40 bg-slate-900/40 px-5 py-3 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/10 focus:outline-none"
              >
                Profil Sekolah
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT GRID
          ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Utama */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tentang Sekolah Card */}
          <section className="grid grid-cols-1 overflow-hidden border border-slate-200 bg-white md:grid-cols-2">
            <img
              src={siteMedia.classroom}
              alt={`Suasana pembelajaran di kelas ${namaSekolahUppercase}`}
              className="h-72 w-full object-cover md:h-full"
              loading="lazy"
            />
            <div className="flex flex-col justify-between p-6">
              <div className="space-y-3">
                <span className="text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                  Tentang Sekolah
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                  Pendidikan Berbasis Karakter dan Kompetensi
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {namaSekolahUppercase} mengembangkan pembelajaran aktif dengan dukungan guru
                  profesional, laboratorium, literasi digital, serta pembinaan karakter untuk
                  menyiapkan siswa menghadapi jenjang pendidikan perguruan tinggi.
                </p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('tentang-sekolah')}
                  className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase transition-colors hover:text-red-800"
                >
                  Lihat Profil Lengkap <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Fokus Layanan */}
          <section className="space-y-4 border border-slate-200 bg-white p-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                Fokus Layanan
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                Informasi Yang Paling Sering Diakses
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onNavigate('ppdb')}
                className="flex cursor-pointer items-center justify-between border border-slate-200 px-4 py-4 text-left transition-colors hover:border-slate-950 hover:bg-slate-50"
              >
                <span className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                  Penerimaan Siswa Baru
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('program-unggulan')}
                className="flex cursor-pointer items-center justify-between border border-slate-200 px-4 py-4 text-left transition-colors hover:border-slate-950 hover:bg-slate-50"
              >
                <span className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                  Program Unggulan
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('prestasi')}
                className="flex cursor-pointer items-center justify-between border border-slate-200 px-4 py-4 text-left transition-colors hover:border-slate-950 hover:bg-slate-50"
              >
                <span className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                  Prestasi Siswa
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('galeri')}
                className="flex cursor-pointer items-center justify-between border border-slate-200 px-4 py-4 text-left transition-colors hover:border-slate-950 hover:bg-slate-50"
              >
                <span className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                  Galeri Kegiatan
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </section>

          {/* Media Galeri Ringkas */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <img
              src={siteMedia.library}
              alt={`Siswa belajar di perpustakaan ${namaSekolahUppercase}`}
              className="h-56 w-full border border-slate-200 object-cover"
              loading="lazy"
            />
            <img
              src={siteMedia.students}
              alt={`Siswa ${namaSekolahUppercase}`}
              className="h-56 w-full border border-slate-200 object-cover"
              loading="lazy"
            />
          </section>

          {/* Buku Tamu Digital */}
          <section className="space-y-4 border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950">Buku Tamu Digital</h2>
            <p className="text-xs leading-relaxed text-slate-600">
              Kami terbuka untuk masukan dari orang tua, alumni, dan masyarakat. Tinggalkan pesan
              agar layanan {namaSekolahUppercase} terus meningkat.
            </p>
            <div className="flex items-center gap-5 text-xs font-semibold text-slate-700">
              <p>{guestEntries.length} Pengunjung Tercatat</p>
              <p className="flex items-center gap-1">
                {avgRating} <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('buku-tamu')}
                className="flex cursor-pointer items-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-slate-800"
              >
                <BookOpen className="h-4 w-4" />
                Isi Buku Tamu
              </button>
              <button
                type="button"
                onClick={() => onNavigate('daftar-tamu')}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-xs font-bold tracking-wider text-slate-700 uppercase transition-colors hover:border-slate-950 hover:text-slate-950"
              >
                Lihat Semua Pesan
              </button>
            </div>
          </section>

          {/* Lokasi Sekolah */}
          <section className="space-y-3 border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950">Lokasi Sekolah</h2>
            <p className="text-xs text-slate-600">{alamatLengkap}.</p>
            <button
              type="button"
              onClick={handleOpenMaps}
              className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold tracking-wider text-red-700 uppercase transition-colors hover:text-red-800"
            >
              <MapPin className="h-4 w-4" />
              Buka di Google Maps
            </button>
          </section>
        </div>

        {/* Sidebar Info & Kontak */}
        <div className="space-y-6">
          <AgendaWidget onNavigate={onNavigate} />

          {/* Kontak Sekolah */}
          <div className="space-y-5 border border-slate-200 bg-white p-5">
            <h3 className="border-b border-slate-200 pb-3 text-xs font-bold tracking-[0.2em] text-slate-950 uppercase">
              Kontak Sekolah
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="border border-slate-200 bg-slate-50 p-2.5">
                  <Phone className="h-4 w-4 text-slate-600" />
                </div>
                <div className="font-mono text-xs font-semibold tracking-tight text-slate-950">
                  {telepon}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="border border-slate-200 bg-slate-50 p-2.5">
                  <Mail className="h-4 w-4 text-slate-600" />
                </div>
                <div className="text-xs font-semibold tracking-tight text-slate-950">{email}</div>
              </div>
            </div>
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Jam Operasional
              </span>
              <div className="flex justify-between text-xs font-semibold text-slate-950">
                <span>Senin - Jumat</span>
                <span className="font-mono">07:00 - 15:00</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Sabtu - Minggu</span>
                <span>Tutup</span>
              </div>
            </div>
          </div>

          {/* Umpan Balik Pengunjung */}
          <div className="border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-bold text-slate-950">Umpan Balik Pengunjung</h3>
            <p className="mt-1 text-xs text-slate-600">
              {guestEntries.length} pesan masuk di buku tamu.
            </p>
            <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-800">
              Nilai rata-rata {avgRating} <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </p>
            <div className="mt-4 space-y-2">
              {recentGuests.length > 0 ? (
                recentGuests.slice(0, 2).map((entry, idx) => (
                  <p
                    key={entry.id || idx}
                    className="line-clamp-2 border-l-2 border-slate-300 pl-3 text-xs text-slate-600 italic"
                  >
                    "{entry.pesan}"
                  </p>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Belum ada tanggapan.</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onNavigate('statistik-tamu')}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 py-2.5 text-xs font-bold tracking-wider text-slate-700 uppercase transition-colors hover:border-slate-950 hover:text-slate-950"
            >
              Lihat Statistik Buku Tamu
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
