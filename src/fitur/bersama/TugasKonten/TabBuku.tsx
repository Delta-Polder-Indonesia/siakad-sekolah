import { BookOpen, ExternalLink } from 'lucide-react';
import type { OnlineAssignment } from '../../../data/services';

export default function TabBuku({ assignment }: { assignment: OnlineAssignment }) {
  const books = assignment.books ?? [];

  if (books.length === 0) {
    return (
      <div className="rounded-md border-2 border-dashed border-black bg-white py-10 text-center">
        <p className="text-xs font-bold text-black italic">
          Tidak ada referensi buku untuk materi/tugas ini.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {books.map((book, index) => (
        <div key={index} className="rounded-md border-2 border-black bg-white p-3.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs leading-tight font-bold text-black">{book.title}</p>
            <BookOpen className="h-4 w-4 shrink-0 text-blue-600" />
          </div>
          <p className="mt-1 text-[11px] font-medium text-black">
            {book.author} {book.year ? `· ${book.year}` : ''}
          </p>
          {book.link && (
            <a
              href={book.link}
              target="_blank"
              rel="noreferrer"
              className="mt-2.5 inline-flex items-center gap-1 rounded-md border-2 border-black bg-white px-2.5 py-1 text-[10px] font-bold text-black transition-colors hover:bg-neutral-100"
            >
              <ExternalLink className="h-3 w-3" /> Buka Tautan
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
