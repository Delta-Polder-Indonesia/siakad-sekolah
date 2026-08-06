import { ArrowLeft, Download } from 'lucide-react';
import { useBackNavigation } from '../../context/NavigationContext';

export default function Ebook4Page() {
  const goBack = useBackNavigation();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.BASE_URL}ebook/ebook_4.pdf`;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100 font-sans text-slate-900">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-3 bg-blue-800 px-4 shadow-md lg:px-8">
        <button
          type="button"
          onClick={goBack}
          className="flex h-8 w-8 items-center justify-center rounded text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <span className="block text-base leading-none font-bold text-white">Ebook 4</span>
          <span className="text-[11px] text-white/70">E-Book Perpustakaan</span>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold">Ebook 4</h1>
        <p className="mt-4 text-slate-600">Deskripsi ebook 4. Edit konten di sini.</p>
        <button
          type="button"
          onClick={handleDownload}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Download size={18} />
          Download Ebook
        </button>
      </div>
    </div>
  );
}
