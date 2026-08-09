import React, { useState } from 'react';
import { User, CalendarDays } from 'lucide-react';
import type { PageProps, NavItem } from '../types';
import { programs } from '../data/programSekolah/data';

export default function ProgramSekolahPage({ onNavigate }: PageProps) {
  // State murni React untuk melacak gambar yang gagal dimuat tanpa manipulasi DOM langsung
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="bg-white font-serif">
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        {/* HEADER HALAMAN UTAMA */}
        <div className="mb-12 border-b-2 border-slate-950 pb-6">
          <div className="max-w-4xl">
            <h3 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Komitmen Terhadap Mutu Pendidikan
            </h3>
            <p className="mt-4 text-justify font-serif text-sm leading-relaxed text-slate-700 italic">
              "Program sekolah dirancang secara strategis untuk menyelaraskan kompetensi akademik,
              keterampilan kerja teknis (hard skills), serta pembentukan integritas karakter (soft
              skills) guna melahirkan lulusan yang siap bersaing di sektor pendidikan tinggi maupun
              dunia industri global."
            </p>
          </div>
        </div>

        {/* STRUKTUR GRID DAFTAR PROGRAM STRATEGIS */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, idx) => (
            <div
              key={program.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              {/* FOTO SEBAGAI AREA KLIK */}
              <button
                type="button"
                onClick={() => onNavigate?.(program.id as NavItem)}
                aria-label={`Lihat detail ${program.title}`}
                className="block aspect-[16/10] w-full cursor-pointer overflow-hidden border-b border-slate-200 bg-slate-100 text-left"
              >
                {!failedImages[program.id] ? (
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={() => handleImageError(program.id)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-50 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    DOKUMENTASI PROGRAM #{idx + 1}
                  </div>
                )}
              </button>

              {/* KONTEN DETAIL PROGRAM */}
              <div className="space-y-3 p-6">
                <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  PROGRAM STRATEGIS {String(idx + 1).padStart(2, '0')}
                </span>

                <h4 className="line-clamp-2 min-h-[2.5rem] text-base leading-tight font-bold tracking-wide text-slate-950 uppercase">
                  {program.title}
                </h4>

                <p className="line-clamp-4 text-justify text-xs leading-relaxed text-slate-600">
                  {program.desc}
                </p>

                {/* AUTHOR + TANGGAL */}
                <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-cyan-900" aria-hidden="true" />
                    <span>{program.author}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-cyan-900" aria-hidden="true" />
                    <time dateTime={program.date}>{program.date}</time>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
