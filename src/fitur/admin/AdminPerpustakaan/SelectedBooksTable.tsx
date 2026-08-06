import { Trash2 } from 'lucide-react';

interface SelectedBook {
  id: string;
  title: string;
  qty: number;
}

interface SelectedBooksTableProps {
  books: SelectedBook[];
  onRemove: (id: string) => void;
}

export function SelectedBooksTable({ books, onRemove }: SelectedBooksTableProps) {
  if (books.length === 0) return null;

  return (
    <div className="mb-4 overflow-hidden rounded-md border-2 border-black">
      <table className="w-full text-left">
        <thead className="border-b-2 border-black bg-white">
          <tr className="text-[10px] font-bold tracking-wider text-black uppercase">
            <th className="border-r-2 border-black/10 px-3 py-2">No</th>
            <th className="border-r-2 border-black/10 px-3 py-2">ID Buku</th>
            <th className="border-r-2 border-black/10 px-3 py-2">Judul</th>
            <th className="border-r-2 border-black/10 px-3 py-2 text-center">Qty</th>
            <th className="px-3 py-2 text-center">Hapus</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
          {books.map((book, idx) => (
            <tr key={book.id} className="transition-colors hover:bg-neutral-100">
              <td className="border-r-2 border-black/10 px-3 py-2 font-mono text-black/60">
                {idx + 1}
              </td>
              <td className="border-r-2 border-black/10 px-3 py-2">
                <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                  {book.id}
                </span>
              </td>
              <td className="border-r-2 border-black/10 px-3 py-2 font-bold text-black">
                {book.title}
              </td>
              <td className="border-r-2 border-black/10 px-3 py-2 text-center font-mono text-black">
                {book.qty}
              </td>
              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => onRemove(book.id)}
                  className="rounded-md border-2 border-rose-600 bg-white p-1 text-rose-600 transition-colors hover:bg-rose-50"
                  title="Hapus buku"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 border-black bg-neutral-50">
          <tr className="text-xs font-bold text-black">
            <td colSpan={3} className="px-3 py-2 text-right">
              Total Buku:
            </td>
            <td className="px-3 py-2 text-center font-mono text-black">
              {books.reduce((sum, b) => sum + b.qty, 0)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
