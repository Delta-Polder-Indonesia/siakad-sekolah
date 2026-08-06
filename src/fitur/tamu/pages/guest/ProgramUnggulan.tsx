import React, { useMemo } from 'react';
import { namaSekolah, namaSekolahUppercase } from '../../../halaman/components/Profile/dataSekolah';
import {
  GraduationCap,
  Star,
  Globe,
  BookOpen,
  Cpu,
  Heart,
  Users,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { programUnggulan } from '../../data/schoolData';

interface ProgramRawItem {
  id?: string | number;
  nama?: string;
  deskripsi?: string;
  siswa?: number | string;
  foto?: string;
  image?: string;
  icon?: string;
  kategori?: string;
  capaian?: string;
}

interface ProgramEnrichedItem {
  id: string | number;
  nama: string;
  deskripsi: string;
  siswa: number;
  foto: string;
  icon?: string;
  kategori: string;
  capaian: string;
}

const defaultProgramImages: Record<string, string> = {
  sains:
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
  internasional:
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  literasi:
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80',
  digital:
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  karakter:
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
};

const iconMap: Record<string, React.ElementType> = {
  star: Star,
  globe: Globe,
  book: BookOpen,
  cpu: Cpu,
  heart: Heart,
};

export default function ProgramUnggulan() {
  const programList = (Array.isArray(programUnggulan) ? programUnggulan : []) as ProgramRawItem[];

  const totalSiswa = useMemo(() => {
    return programList.reduce((sum, p) => sum + (Number(p?.siswa) || 0), 0);
  }, [programList]);

  const enrichedPrograms: ProgramEnrichedItem[] = useMemo(() => {
    return programList.map((item, index) => {
      const iconKey = String(item?.icon || '')
        .toLowerCase()
        .trim();
      let photoUrl = item?.image || item?.foto;

      if (!photoUrl) {
        if (
          iconKey.includes('globe') ||
          item?.nama?.toLowerCase().includes('internasional') ||
          item?.nama?.toLowerCase().includes('bahasa')
        ) {
          photoUrl = defaultProgramImages.internasional;
        } else if (
          iconKey.includes('cpu') ||
          item?.nama?.toLowerCase().includes('digital') ||
          item?.nama?.toLowerCase().includes('teknologi')
        ) {
          photoUrl = defaultProgramImages.digital;
        } else if (iconKey.includes('book') || item?.nama?.toLowerCase().includes('literasi')) {
          photoUrl = defaultProgramImages.literasi;
        } else if (
          iconKey.includes('heart') ||
          item?.nama?.toLowerCase().includes('karakter') ||
          item?.nama?.toLowerCase().includes('sosial')
        ) {
          photoUrl = defaultProgramImages.karakter;
        } else {
          photoUrl = defaultProgramImages.sains;
        }
      }

      return {
        ...item,
        id: item?.id ?? `program-${index}`,
        nama: item?.nama || `Program Unggulan #${index + 1}`,
        deskripsi:
          item?.deskripsi ||
          `Program akselerasi kompetensi yang dirancang untuk mempersiapkan siswa ${namaSekolahUppercase} bersaing di tingkat nasional dan global.`,
        siswa: Number(item?.siswa) || 0,
        foto: photoUrl,
        kategori: item?.kategori || 'Akademik & Inovasi',
        capaian: item?.capaian || 'Sertifikasi Nasional & Pendampingan Intensif',
      };
    });
  }, [programList]);

  return (
    <div className="space-y-8 bg-slate-50 pb-16 font-sans text-slate-900">
      <section className="relative min-h-[50vh] overflow-hidden border-b border-slate-300 bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80"
          alt={`Program Unggulan ${namaSekolahUppercase}`}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[50vh] max-w-7xl flex-col justify-end p-6 sm:p-10 lg:p-12">
          <div className="max-w-3xl space-y-4 text-white">
            <div className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/90 px-3 py-1 text-xs font-semibold tracking-widest text-slate-200 uppercase backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Kurikulum Akselerasi & Pengembangan Minat Bakat
            </div>
            <h1 className="font-serif text-3xl leading-tight font-bold tracking-tight text-white sm:text-5xl">
              Program Unggulan {namaSekolahUppercase}
            </h1>
            <p className="max-w-2xl font-serif text-sm leading-relaxed text-slate-300 sm:text-base">
              Rangkaian program strategis yang dirancang secara terstruktur untuk membentuk generasi
              berkarakter unggul, menguasai teknologi modern, serta siap bersaing di perguruan
              tinggi ternama.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <section className="relative z-20 -mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-400">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Total Program Unggulan
            </span>
            <p className="mt-1 font-serif text-3xl font-bold text-slate-950">
              {enrichedPrograms.length}{' '}
              <span className="text-sm font-normal text-slate-500">Pilihan</span>
            </p>
            <p className="mt-2 text-[11px] font-medium text-slate-500">
              Terintegrasi Kurikulum Nasional
            </p>
          </div>

          <div className="border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-400">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Siswa Terlibat
            </span>
            <p className="mt-1 font-serif text-3xl font-bold text-slate-950">
              {totalSiswa}+ <span className="text-sm font-normal text-slate-500">Peserta</span>
            </p>
            <p className="mt-2 text-[11px] font-medium text-slate-500">Aktif Mengikuti Pembinaan</p>
          </div>

          <div className="border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-400">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Tingkat Keberhasilan
            </span>
            <p className="mt-1 font-serif text-3xl font-bold text-emerald-700">
              100% <span className="text-sm font-normal text-slate-500">Kelulusan</span>
            </p>
            <p className="mt-2 text-[11px] font-medium text-slate-500">
              Sertifikasi & Portofolio Siswa
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Fokus Pembinaan Siswa
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-slate-950">
              Eksplorasi Program Unggulan
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {enrichedPrograms.map((program, index) => {
              const iconKey = String(program?.icon || '')
                .toLowerCase()
                .trim();
              const IconComponent = iconMap[iconKey] || Star;

              return (
                <div
                  key={program.id}
                  className="group flex flex-col border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-950 hover:shadow-md"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                    <img
                      src={program.foto}
                      alt={program.nama}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-slate-950/90 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                        Program #{index + 1}
                      </span>
                      <span className="bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-slate-950 uppercase backdrop-blur-sm">
                        {program.kategori}
                      </span>
                    </div>

                    <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <div className="border border-white/30 bg-slate-950/60 p-2 backdrop-blur-xs">
                          <IconComponent className="h-5 w-5 text-amber-400" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-white">{program.nama}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="space-y-4">
                      <p className="font-serif text-sm leading-relaxed text-slate-700">
                        {program.deskripsi}
                      </p>

                      <div className="space-y-2 border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-slate-900">Capaian:</span>
                          <span>{program.capaian}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {program.siswa} Siswa Aktif
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1 text-xs font-bold tracking-wider text-slate-900 uppercase transition-colors group-hover:text-red-700">
                        <span>Detail Program</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 border border-slate-200 bg-white p-8 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <div className="flex items-center gap-2 text-slate-950">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <h3 className="font-serif text-xl font-bold tracking-tight">
                Mekanisme Pendaftaran & Seleksi Program
              </h3>
            </div>
            <p className="font-serif text-xs leading-relaxed text-slate-600 sm:text-sm">
              Pendaftaran program unggulan {namaSekolah} dibuka pada awal semester ganjil melalui
              koordinasi Wali Kelas dan Tim Bimbingan Konseling (BK). Seleksi dilaksanakan secara
              transparan berdasarkan minat, bakat, serta pemetaan potensi akademik siswa.
            </p>
          </div>

          <div className="flex flex-col justify-center border-t border-slate-200 pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Konsultasi Layanan BK
            </span>
            <p className="mt-1 text-xs text-slate-700">
              Ingin mendiskusikan program yang paling sesuai untuk siswa? Hubungi tim pembina.
            </p>
            <div className="mt-4">
              <span className="inline-flex cursor-pointer items-center gap-2 border border-slate-950 bg-slate-950 px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-slate-800">
                <span>Informasi Pendaftaran</span>
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
