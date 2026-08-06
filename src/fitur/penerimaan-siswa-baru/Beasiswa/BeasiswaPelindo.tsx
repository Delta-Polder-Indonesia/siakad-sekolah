import { ArrowLeft } from 'lucide-react';

type Props = { onBack: () => void };

export default function BeasiswaPelindo({ onBack }: Props) {
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
            Beasiswa Pelindo Prestasi 2025
          </span>
          <span className="text-[11px] text-white/70">Program Beasiswa</span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold">Beasiswa Pelindo Prestasi 2025</h1>
        <p className="mt-4 text-slate-600">
          Halaman informasi Beasiswa Pelindo Prestasi 2025. Isi konten di sini nanti.
        </p>
      </div>
    </div>
  );
}
