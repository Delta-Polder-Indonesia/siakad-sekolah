import { ArrowLeft } from 'lucide-react';
import { useBackNavigation } from '../../context/NavigationContext';

export default function Sdgs8() {
  const goBack = useBackNavigation();
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100 font-sans text-slate-900">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-3 bg-[#038A47] px-4 shadow-md lg:px-8">
        <button
          type="button"
          onClick={goBack}
          className="flex h-8 w-8 items-center justify-center rounded text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <span className="block text-base leading-none font-bold text-white">SDGs 8</span>
          <span className="text-[11px] text-white/70">Sustainable Development Goals</span>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold">Pekerjaan Layak dan Pertumbuhan Ekonomi</h1>
        <p className="mt-4 text-slate-600">Halaman informasi SDGs 8. Isi konten di sini.</p>
      </div>
    </div>
  );
}
