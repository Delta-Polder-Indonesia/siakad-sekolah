import { Check, Ban } from 'lucide-react';

interface PendingLoan {
  id: string;
  memberId: string;
  memberName: string;
  bookId: string;
  borrowDate: string;
}

interface Book {
  id: string;
  title: string;
}

interface PendingLoansTableProps {
  loans: PendingLoan[];
  books: Book[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function PendingLoansTable({ loans, books, onApprove, onReject }: PendingLoansTableProps) {
  if (loans.length === 0) return null;

  return (
    <div className="rounded-md border-2 border-amber-600 bg-white">
      <div className="flex items-center justify-between border-b-2 border-black bg-white p-3">
        <h2 className="text-xs font-bold tracking-wider text-black uppercase">
          Permohonan Peminjaman Tertunda ({loans.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-black bg-white">
            <tr className="text-[10px] font-bold tracking-wider text-black uppercase">
              <th className="px-3 py-2">Siswa</th>
              <th className="px-3 py-2">Judul Buku</th>
              <th className="px-3 py-2">Tgl Pinjam</th>
              <th className="px-3 py-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
            {loans.map((tx) => (
              <tr key={tx.id} className="transition-colors hover:bg-neutral-100">
                <td className="px-3 py-2.5">
                  <div className="font-bold text-black">{tx.memberName}</div>
                  <div className="font-mono text-[10px] font-bold text-black/50">
                    ID: {tx.memberId}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-black">
                  {books.find((b) => b.id === tx.bookId)?.title}
                </td>
                <td className="px-3 py-2.5 font-mono text-[10px] text-black/70">{tx.borrowDate}</td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onApprove(tx.id)}
                      className="flex items-center gap-1.5 rounded-md border-2 border-black bg-black px-3 py-1 text-[10px] font-bold text-white transition-colors hover:bg-neutral-900"
                    >
                      <Check className="h-3.5 w-3.5" /> SETUJUI
                    </button>
                    <button
                      onClick={() => onReject(tx.id)}
                      className="flex items-center gap-1.5 rounded-md border-2 border-rose-600 bg-white px-3 py-1 text-[10px] font-bold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <Ban className="h-3.5 w-3.5" /> TOLAK
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
