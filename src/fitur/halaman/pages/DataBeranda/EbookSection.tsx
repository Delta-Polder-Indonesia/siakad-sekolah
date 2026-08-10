import { Download, ArrowUpRight, BookOpen, FileText } from 'lucide-react';
import { ebookData, type EbookItem } from '../../data/beranda/ebook/data';
import { resolveEbookNav } from './detailNav';

interface EbookSectionProps {
  onNavigate?: (page: string) => void;
}

export default function EbookSection({ onNavigate }: EbookSectionProps) {
  return (
    <section className="w-full bg-[#FAF9F6] py-12 font-sans text-slate-900 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-stone-300 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1.5 flex items-center gap-2"></div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              E-book & Bahan Bacaan
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed font-medium text-slate-700">
              Koleksi e-book modul pembelajaran gratis yang dapat diunduh kapan saja.
            </p>
          </div>
        </div>

        {/* Ebook Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ebookData.map((ebook, index) => {
            const ebookNumber = index + 1;
            return (
              <EbookCard
                key={ebook.id}
                ebook={ebook}
                ebookNumber={ebookNumber}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface EbookCardProps {
  ebook: EbookItem;
  ebookNumber: number;
  onNavigate?: (page: string) => void;
}

function EbookCard({ ebook, ebookNumber, onNavigate }: EbookCardProps) {
  const handleOpen = () => {
    const nav = resolveEbookNav(ebookNumber);
    if (nav) onNavigate?.(nav);
  };

  const coverSrc = ebook.coverImage
    ? `${import.meta.env.BASE_URL}${ebook.coverImage}`
    : `${import.meta.env.BASE_URL}images/Ebook/cover-placeholder.png`;

  return (
    <article
      onClick={handleOpen}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-stone-300 bg-white p-3.5 transition-colors duration-200 hover:border-emerald-800"
    >
      {/* Frame Sampul Ringkas (Tanpa Zoom Gambar) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded bg-stone-100 ring-1 ring-black/5">
        <img
          src={coverSrc}
          alt={ebook.title}
          className="h-full w-full object-cover"
          loading="lazy"
          draggable="false"
        />

        {/* Category Tag */}
        {ebook.category && (
          <div className="absolute top-2 left-2">
            <span className="inline-block rounded bg-slate-900/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
              {ebook.category}
            </span>
          </div>
        )}
      </div>

      {/* Detail Konten Compact */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="line-clamp-1 font-serif text-base leading-snug font-bold text-slate-900 transition-colors duration-200 group-hover:text-emerald-800">
            {ebook.title}
          </h3>

          {/* Description */}
          {ebook.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed font-semibold text-slate-600">
              {ebook.description}
            </p>
          )}
        </div>

        {/* Footer Info & Action */}
        <div className="mt-3.5 border-t border-stone-200 pt-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <div className="flex items-center gap-3">
              {ebook.pages && (
                <span className="flex items-center gap-1">
                  <BookOpen size={12} strokeWidth={2.2} className="text-slate-500" />
                  {ebook.pages} hal.
                </span>
              )}
              {ebook.fileSize && (
                <span className="flex items-center gap-1">
                  <FileText size={12} strokeWidth={2.2} className="text-slate-500" />
                  {ebook.fileSize}
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 transition-colors duration-200 group-hover:text-emerald-950">
              <Download size={13} strokeWidth={2.5} />
              <span>PDF</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
