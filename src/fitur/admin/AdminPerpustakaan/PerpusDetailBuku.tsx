import { ArrowLeft, Download } from 'lucide-react';

interface PerpusDetailBukuProps {
  bookId: string | null;
  onBack: () => void;
}

interface BookDetail {
  judul: string;
  pengarang: string;
  isbn: string;
  tahun: string;
  kategori: string;
  rak: string;
  penerbit: string;
  jumlah: number;
  sinopsis: string;
  cover: string;
  ebook?: string;
}

const BOOK_DETAILS: Record<string, BookDetail> = {
  B0009: {
    judul: 'Mau Order Pustaka Digital',
    pengarang: 'Masri',
    isbn: '123-321-345-51-309',
    tahun: '2020',
    kategori: 'Sistem Informasi',
    rak: 'A01 [Rak 1]',
    penerbit: 'Elexmedia Komputindo',
    jumlah: 22,
    sinopsis:
      'Buku ini merupakan buku siswa yang dipersiapkan Pemerintah dalam rangka implementasi Kurikulum 2013.',
    cover: 'https://via.placeholder.com/200x280/4ade80/ffffff?text=Sehat+Itu+Penting',
    ebook: 'Sehat Itu Penting.pdf',
  },
  B0010: {
    judul: 'Sistem Imunisasi',
    pengarang: 'Janti Sudiono',
    isbn: '978-602-1234-56-7',
    tahun: '2021',
    kategori: 'Kesehatan',
    rak: 'A01 [Rak 1]',
    penerbit: 'Elexmedia Komputindo',
    jumlah: 42,
    sinopsis: 'Buku tentang sistem imunisasi dan kesehatan masyarakat.',
    cover: 'https://via.placeholder.com/200x280/3b82f6/ffffff?text=Sistem+Imunisasi',
    ebook: 'Sistem Imunisasi.pdf',
  },
  B0011: {
    judul: 'Sehat Itu Penting',
    pengarang: 'Ari Subekti',
    isbn: '123-321-345-51-309',
    tahun: '2020',
    kategori: 'Sistem Informasi',
    rak: 'A01 [Rak 1]',
    penerbit: 'Elexmedia Komputindo',
    jumlah: 22,
    sinopsis:
      'Buku ini merupakan buku siswa yang dipersiapkan Pemerintah dalam rangka implementasi Kurikulum 2013.',
    cover: 'https://via.placeholder.com/200x280/f59e0b/ffffff?text=Sehat+Itu+Penting',
    ebook: 'Sehat Itu Penting.pdf',
  },
};

export default function PerpusDetailBuku({ bookId, onBack }: PerpusDetailBukuProps) {
  const book = bookId ? BOOK_DETAILS[bookId] : null;

  if (!book) {
    return (
      <div className="rounded-md border-2 border-dashed border-black bg-white p-8 text-center">
        <p className="text-xs font-bold text-black">Buku tidak ditemukan</p>
        <button type="button"
          onClick={onBack}
          className="mt-4 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
        >
          Kembali ke daftar
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-md border-2 border-black bg-white p-4">
      {/* Header */}
      <div className="mb-6 border-b-2 border-black pb-3 text-center">
        <h2 className="text-xs font-bold tracking-wider text-black uppercase">
          Detail Buku Pilihan Anda
        </h2>
        <p className="mt-1 text-[10px] font-bold text-black/60">
          Silahkan cek detail buku yang Anda pilih
        </p>
      </div>

      <div className="mx-auto flex max-w-4xl flex-col gap-6 md:flex-row">
        {/* Cover */}
        <div className="flex-shrink-0">
          <img
            src={book.cover}
            alt={book.judul}
            className="h-64 w-48 rounded-md border-2 border-black object-cover"  loading="lazy" decoding="async" />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h3 className="mb-4 text-lg leading-none font-bold tracking-tight text-black">
            {book.judul}
          </h3>

          <div className="space-y-2">
            {[
              { label: 'Pengarang', value: book.pengarang },
              { label: 'ISBN', value: book.isbn },
              { label: 'Tahun Terbit', value: book.tahun },
              { label: 'Kategori', value: book.kategori },
              { label: 'Rak', value: book.rak },
              { label: 'Penerbit', value: book.penerbit },
              { label: 'Jumlah Buku', value: book.jumlah },
            ].map((item) => (
              <div key={item.label} className="flex border-b-2 border-black/10 pb-2 text-xs">
                <span className="w-28 flex-shrink-0 font-bold text-black/60">{item.label}</span>
                <span className="font-bold text-black">: {item.value}</span>
              </div>
            ))}

            <div className="flex border-b-2 border-black/10 pb-2 text-xs">
              <span className="w-28 flex-shrink-0 font-bold text-black/60">Sinopsis</span>
              <span className="flex-1 font-bold text-black">: {book.sinopsis}</span>
            </div>
          </div>

          {/* Download */}
          <div className="mt-4">
            <p className="mb-1 text-xs font-bold text-black">Download e-book di sini</p>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-md border-2 border-blue-600 bg-white px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-neutral-100"
            >
              <Download className="h-4 w-4" />
              {book.ebook}
            </a>
          </div>

          {/* Back Button */}
          <button type="button"
            onClick={onBack}
            className="mt-5 flex items-center gap-2 rounded-md border-2 border-black bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Inventori
          </button>
        </div>
      </div>
    </div>
  );
}
