export interface EbookItem {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  coverImage?: string;
  category?: string;
  fileSize?: string;
  language?: string;
  pages?: number;
}

export const ebookData: EbookItem[] = [
  {
    id: 'ebook-1',
    title: 'Ebook 1',
    description: 'Deskripsi ebook 1. Edit konten di sini.',
    pdfUrl: 'ebook/ebook_1.pdf',
    coverImage: 'images/Ebook/cover-1.png',
    category: 'Buku Teks',
    fileSize: '2.4 MB',
    language: 'Indonesia',
    pages: 48,
  },
  {
    id: 'ebook-2',
    title: 'Ebook 2',
    description: 'Deskripsi ebook 2. Edit konten di sini.',
    pdfUrl: 'ebook/ebook_2.pdf',
    coverImage: 'images/Ebook/cover-2.png',
    category: 'Buku Teks',
    fileSize: '1.9 MB',
    language: 'Indonesia',
    pages: 36,
  },
  {
    id: 'ebook-3',
    title: 'Ebook 3',
    description: 'Deskripsi ebook 3. Edit konten di sini.',
    pdfUrl: 'ebook/ebook_3.pdf',
    coverImage: 'images/Ebook/cover-3.png',
    category: 'Referensi',
    fileSize: '3.1 MB',
    language: 'Indonesia',
    pages: 64,
  },
  {
    id: 'ebook-4',
    title: 'Ebook 4',
    description: 'Deskripsi ebook 4. Edit konten di sini.',
    pdfUrl: 'ebook/ebook_4.pdf',
    coverImage: 'images/Ebook/cover-4.png',
    category: 'Buku Teks',
    fileSize: '2.7 MB',
    language: 'Indonesia',
    pages: 52,
  },
  {
    id: 'ebook-5',
    title: 'Ebook 5',
    description: 'Deskripsi ebook 5. Edit konten di sini.',
    pdfUrl: 'ebook/ebook_5.pdf',
    coverImage: 'images/Ebook/cover-5.png',
    category: 'Referensi',
    fileSize: '1.5 MB',
    language: 'Indonesia',
    pages: 28,
  },
  {
    id: 'ebook-6',
    title: 'Ebook 6',
    description: 'Deskripsi ebook 6. Edit konten di sini.',
    pdfUrl: 'ebook/ebook_6.pdf',
    coverImage: 'images/Ebook/cover-6.png',
    category: 'Buku Teks',
    fileSize: '2.2 MB',
    language: 'Indonesia',
    pages: 42,
  },
  {
    id: 'ebook-7',
    title: 'Ebook 7',
    description: 'Deskripsi ebook 7. Edit konten di sini.',
    pdfUrl: 'ebook/ebook_7.pdf',
    coverImage: 'images/Ebook/cover-7.png',
    category: 'Referensi',
    fileSize: '1.8 MB',
    language: 'Indonesia',
    pages: 34,
  },
  {
    id: 'ebook-8',
    title: 'Ebook 8',
    description: 'Deskripsi ebook 8. Edit konten di sini.',
    pdfUrl: 'ebook/ebook_8.pdf',
    coverImage: 'images/Ebook/cover-8.png',
    category: 'Referensi',
    fileSize: '2.0 MB',
    language: 'Indonesia',
    pages: 40,
  },
];

export function getEbookById(id: string): EbookItem | undefined {
  return ebookData.find((item) => item.id === id);
}