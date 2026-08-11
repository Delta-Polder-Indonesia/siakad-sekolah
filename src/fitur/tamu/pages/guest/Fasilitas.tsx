import React, { useState, useMemo } from 'react';
import {
  Building2,
  CheckCircle2,
  Search,
  Zap,
  ShieldCheck,
  Sparkles,
  FlaskConical,
  Monitor,
  BookOpen,
  Trophy,
  HeartPulse,
  Layers,
} from 'lucide-react';
import { fasilitas } from '../../data/schoolData';
import { namaSekolahUppercase } from '../../../halaman/components/Profile/dataSekolah';

interface FasilitasRawItem {
  id?: number | string;
  nama?: string;
  jumlah?: number | string;
  kondisi?: string;
  deskripsi?: string;
  icon?: string;
  image?: string;
  foto?: string;
  kategori?: string;
  spesifikasi?: string[];
}

interface FasilitasEnrichedItem {
  id: number | string;
  nama: string;
  jumlah: number;
  kondisi: string;
  deskripsi: string;
  icon: string;
  foto: string;
  kategori: string;
  spesifikasi: string[];
}

const defaultFasilitasImages: Record<string, string> = {
  lab: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
  komputer:
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  perpustakaan:
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
  olahraga:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  umum: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
};

const iconMap: Record<string, React.ElementType> = {
  flask: FlaskConical,
  computer: Monitor,
  book: BookOpen,
  trophy: Trophy,
  heart: HeartPulse,
};

export default function Fasilitas() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedKategori, setSelectedKategori] = useState<string>('');

  const fasilitasList = (Array.isArray(fasilitas) ? fasilitas : []) as FasilitasRawItem[];

  const enrichedFasilitas: FasilitasEnrichedItem[] = useMemo(() => {
    return fasilitasList.map((item, index) => {
      const iconKey = String(item?.icon || '')
        .toLowerCase()
        .trim();
      let photoUrl = item?.image || item?.foto;

      if (!photoUrl) {
        if (iconKey.includes('flask') || item?.nama?.toLowerCase().includes('lab')) {
          photoUrl = defaultFasilitasImages.lab;
        } else if (iconKey.includes('computer') || item?.nama?.toLowerCase().includes('komputer')) {
          photoUrl = defaultFasilitasImages.komputer;
        } else if (iconKey.includes('book') || item?.nama?.toLowerCase().includes('perpustakaan')) {
          photoUrl = defaultFasilitasImages.perpustakaan;
        } else if (iconKey.includes('trophy') || item?.nama?.toLowerCase().includes('lapangan')) {
          photoUrl = defaultFasilitasImages.olahraga;
        } else {
          photoUrl = defaultFasilitasImages.umum;
        }
      }

      return {
        ...item,
        id: item?.id ?? `fasilitas-${index}`,
        nama: item?.nama || `Fasilitas #${index + 1}`,
        jumlah: Number(item?.jumlah) || 1,
        kondisi: item?.kondisi || 'Sangat Baik',
        deskripsi:
          item?.deskripsi ||
          `Sarana pendukung kegiatan belajar mengajar di ${namaSekolahUppercase} dengan standar pelayanan prima.`,
        icon: item?.icon || 'building',
        foto: photoUrl,
        kategori:
          item?.kategori ||
          (iconKey.includes('flask') || iconKey.includes('computer')
            ? 'Laboratorium'
            : 'Fasilitas Umum'),
        spesifikasi: item?.spesifikasi || [
          'Pendingin Ruangan (AC)',
          'Akses Wi-Fi High-Speed',
          'Standar Keamanan K3',
        ],
      };
    });
  }, [fasilitasList]);

  const kategoris = useMemo(() => {
    return Array.from(new Set(enrichedFasilitas.map((f) => f.kategori).filter(Boolean)));
  }, [enrichedFasilitas]);

  const filteredFasilitas = useMemo(() => {
    return enrichedFasilitas.filter((f) => {
      if (selectedKategori && f.kategori !== selectedKategori) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return f.nama.toLowerCase().includes(query) || f.deskripsi.toLowerCase().includes(query);
      }
      return true;
    });
  }, [enrichedFasilitas, selectedKategori, searchQuery]);

  return (
    <div className="bg-slate-100 pt-6 pb-20 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col border-b-2 border-slate-900 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-600 uppercase">
              <Building2 className="h-4 w-4 text-slate-800" />
              {namaSekolahUppercase} &bull; Sarana & Prasarana
            </div>
            <h1 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Direktori Fasilitas Pembelajaran
            </h1>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-2 rounded-none border border-slate-900 bg-slate-950 px-3 py-1.5 font-mono text-xs font-bold text-white">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              STANDAR SARPRAS NASIONAL
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border border-slate-300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari fasilitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 bg-slate-50 py-2 pr-3 pl-9 text-xs text-slate-900 focus:border-slate-950 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs font-bold tracking-wider text-slate-800 uppercase focus:border-slate-950"
            >
              <option value="">Semua Kategori</option>
              {kategoris.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFasilitas.map((item) => {
            const iconKey = String(item.icon).toLowerCase().trim();
            const IconComponent = iconMap[iconKey] || Layers;

            return (
              <div
                key={item.id}
                className="group flex flex-col border border-slate-300 bg-white shadow-sm transition-all hover:border-slate-950"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.foto}
                    alt={item.nama}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"  loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-slate-950/20" />
                  <span className="absolute top-3 left-3 border border-slate-900 bg-slate-950 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                    {item.kategori}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-slate-700" />
                      <h3 className="font-serif text-lg font-bold text-slate-950">{item.nama}</h3>
                    </div>
                    <p className="line-clamp-3 font-serif text-xs leading-relaxed text-slate-600">
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-slate-500">
                        Jumlah: <strong className="text-slate-900">{item.jumlah} Unit</strong>
                      </span>
                      <span className="font-bold text-emerald-700">{item.kondisi}</span>
                    </div>

                    <div className="space-y-1">
                      {item.spesifikasi.slice(0, 2).map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-[11px] text-slate-600"
                        >
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
