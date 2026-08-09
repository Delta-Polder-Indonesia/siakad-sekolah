import { Download } from 'lucide-react';
import { ebookData, type EbookItem } from '../../data/beranda/ebook/data';
import { resolveEbookNav } from './detailNav';

interface EbookSectionProps {
  onNavigate?: (page: string) => void;
}

export default function EbookSection({ onNavigate }: EbookSectionProps) {
  return (
    <section className="w-full bg-white font-serif">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="sec-title text-slate-900">Ebook Digital</h2>
            <p className="sec-body mt-1 text-slate-600">
              Koleksi e-book pembelajaran gratis yang dapat diunduh dan dibaca kapan saja
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const nav = resolveEbookNav(1);
              if (nav) onNavigate?.(nav);
            }}
            className="sec-btn inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-emerald-800 transition-all hover:bg-emerald-800 hover:text-white"
          >
            <span>Lihat Semua</span>
            <Download size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
    <div
      onClick={handleOpen}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-all duration-300 hover:border-emerald-800 hover:shadow-xl"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <img
          src={coverSrc}
          alt={ebook.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          draggable="false"
        />
        {ebook.category && (
          <span className="absolute top-2 left-2 rounded-md bg-emerald-800/90 px-2.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-sm">
            {ebook.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="sec-card-title line-clamp-1 text-slate-900 group-hover:text-emerald-700">
          {ebook.title}
        </h3>
        <p className="sec-card-body line-clamp-3 flex-1 text-sm text-slate-600">
          {ebook.description}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500">
          {ebook.fileSize && <span>{ebook.fileSize}</span>}
          {ebook.pages && <span>{ebook.pages} hal.</span>}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <Download size={14} /> Unduh PDF
        </div>
      </div>
    </div>
  );
}
