import { ArrowLeft } from 'lucide-react';

type Props = { onBack: () => void };

export default function FasilitasDisabilitas({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-3 bg-[#0d6e38] px-4 shadow-md lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <span className="block text-base leading-none font-bold text-white">
            Fasilitas Disabilitas
          </span>
          <span className="text-[11px] text-white/70">Fasilitas Kampus</span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold">Fasilitas Disabilitas</h1>
        <p className="mt-4 text-slate-600">
          Halaman informasi fasilitas disabilitas kampus. Isi konten di sini nanti.
        </p>
      </div>
    </div>
  );
}
