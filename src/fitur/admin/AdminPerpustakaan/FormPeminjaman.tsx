import { useState, useMemo } from 'react';
import { X, RotateCcw, BookOpen, AlertCircle } from 'lucide-react';
import { useToast } from '../../../components/ui';
import { MemberAutocomplete } from './MemberAutocomplete';
import { BookAutocomplete } from './BookAutocomplete';
import { SelectedBooksTable } from './SelectedBooksTable';
import { PendingLoansTable } from './PendingLoansTable';

interface Book {
  id: string;
  title: string;
  author: string;
  available: number;
  coverImage?: string;
}

interface Student {
  id: string;
  name: string;
  nis: string;
  classId?: string;
}

interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  bookId: string;
  status: string;
  borrowDate: string;
}

interface FormPeminjamanProps {
  books: Book[];
  students: Student[];
  transactions: Transaction[];
  onBorrow: (
    bookId: string,
    memberId: string,
    memberName: string,
    borrowDate: string,
    dueDate: string
  ) => { ok: boolean; message?: string };
  onApprove: (txId: string) => { ok: boolean; message?: string };
  onReject: (txId: string, note?: string) => void;
}

export function FormPeminjaman({
  books,
  students,
  transactions,
  onBorrow,
  onApprove,
  onReject,
}: FormPeminjamanProps) {
  const { showToast } = useToast();
  const [selectedBooks, setSelectedBooks] = useState<
    Array<{ id: string; title: string; qty: number }>
  >([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [idPeminjaman, setIdPeminjaman] = useState(`TX-${Date.now().toString().slice(-6)}`);

  const [tglPinjam, setTglPinjam] = useState(new Date().toISOString().slice(0, 10));
  const [tglKembali, setTglKembali] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [keterangan, setKeterangan] = useState('Pinjam');
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const pendingLoans = useMemo(
    () => transactions.filter((t) => t.status === 'menunggu'),
    [transactions]
  );

  const handleAddBook = () => {
    if (!selectedBookId) return;
    const book = books.find((b) => b.id === selectedBookId);
    if (book && !selectedBooks.find((sb) => sb.id === book.id)) {
      if (book.available <= 0) {
        showToast('error', '⚠️ Stok buku habis!');
        return;
      }
      setSelectedBooks([...selectedBooks, { id: book.id, title: book.title, qty: 1 }]);
    }
    setSelectedBookId('');
  };

  const handleRemoveBook = (id: string) =>
    setSelectedBooks(selectedBooks.filter((b) => b.id !== id));

  const handleProcess = () => {
    if (!selectedMemberId) {
      showToast('error', '⚠️ Pilih anggota terlebih dahulu.');
      return;
    }
    if (selectedBooks.length === 0) {
      showToast('error', '⚠️ Pilih minimal satu buku.');
      return;
    }

    const student = students.find((s) => s.id === selectedMemberId);
    const studentName = student ? student.name : 'Unknown';
    let successCount = 0;

    selectedBooks.forEach((b) => {
      const res = onBorrow(b.id, selectedMemberId, studentName, tglPinjam, tglKembali);
      if (res.ok) successCount++;
    });

    showToast('success', `✅ ${successCount} buku berhasil diajukan pinjamannya.`);
    handleReset();
  };

  const handleReset = () => {
    setSelectedBooks([]);
    setSelectedMemberId('');
    setSelectedBookId('');
    setIdPeminjaman(`TX-${Date.now().toString().slice(-6)}`);
    setTglPinjam(new Date().toISOString().slice(0, 10));
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setTglKembali(d.toISOString().slice(0, 10));
  };

  const handleApprove = (txId: string) => {
    const res = onApprove(txId);
    if (!res.ok) showToast('error', res.message || 'Gagal menyetujui peminjaman.');
  };

  const handleReject = (txId: string) => {
    setRejectTargetId(txId);
    setRejectNote('');
  };

  const handleConfirmReject = () => {
    if (!rejectTargetId) return;
    onReject(rejectTargetId, rejectNote.trim() || 'Ditolak oleh admin');
    setRejectTargetId(null);
    setRejectNote('');
    showToast('success', '✅ Permohonan peminjaman ditolak.');
  };

  return (
    <div className="space-y-6">
      <PendingLoansTable
        loans={pendingLoans}
        books={books}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <div className="rounded-md border-2 border-black bg-white">
        <div className="border-b-2 border-black p-4">
          <h2 className="text-xs font-bold tracking-wider text-black uppercase">
            Form Peminjaman Baru
          </h2>
        </div>

        <div className="mx-auto max-w-3xl p-6">
          <div className="mb-6 grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="pr-4 text-right text-xs font-bold text-black uppercase">
              ID Peminjaman
            </label>
            <div className="relative">
              <input
                type="text"
                value={idPeminjaman}
                readOnly
                className="w-full cursor-not-allowed rounded-md border-2 border-black bg-neutral-100 px-2.5 py-1.5 font-mono text-xs font-bold text-black opacity-60"
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[10px] font-bold text-black">
                Auto
              </span>
            </div>

            <label className="pr-4 text-right text-xs font-bold text-black uppercase">
              Tgl Pinjam
            </label>
            <input
              type="date"
              value={tglPinjam}
              onChange={(e) => setTglPinjam(e.target.value)}
              className="rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
            />

            <label className="pr-4 text-right text-xs font-bold text-black uppercase">
              Tgl Kembali
            </label>
            <input
              type="date"
              value={tglKembali}
              onChange={(e) => setTglKembali(e.target.value)}
              className="rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
            />

            <MemberAutocomplete
              students={students}
              selectedId={selectedMemberId}
              onSelect={(s) => setSelectedMemberId(s.id)}
              onClear={() => setSelectedMemberId('')}
              label="Anggota"
            />

            <label className="pr-4 text-right text-xs font-bold text-black uppercase">
              Keterangan
            </label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="h-20 resize-none rounded-md border-2 border-black bg-white px-2.5 py-2 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="mb-4 border-t-2 border-black/10 pt-4">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
              <BookOpen className="h-4 w-4 text-black" />
              Pilih Buku yang Akan Dipinjam
            </h3>

            <BookAutocomplete
              books={books}
              selectedId={selectedBookId}
              excludeIds={selectedBooks.map((b) => b.id)}
              onSelect={(b) => setSelectedBookId(b.id)}
              onClear={() => setSelectedBookId('')}
              onAdd={handleAddBook}
            />

            <SelectedBooksTable books={selectedBooks} onRemove={handleRemoveBook} />
          </div>

          <div className="flex justify-end gap-2 border-t-2 border-black/10 pt-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
            >
              <X className="h-3.5 w-3.5" /> Reset
            </button>
            <button
              onClick={handleProcess}
              className="flex items-center gap-2 rounded-md border-2 border-black bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-900"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Proses Peminjaman
            </button>
          </div>
        </div>
      </div>

      {/* MODAL INPUT ALASAN PENOLAKAN */}
      {rejectTargetId !== null && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setRejectTargetId(null)} />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-md border-2 border-black bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-rose-600 bg-white text-rose-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold tracking-wider text-black uppercase">
                Tolak Peminjaman
              </h3>
            </div>
            <label className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
              Alasan Penolakan
            </label>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Contoh: stok sedang dipinjam siswa lain"
              rows={3}
              className="w-full resize-none rounded-md border-2 border-black bg-white px-2.5 py-2 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRejectTargetId(null)}
                className="rounded-md border-2 border-black bg-white px-4 py-1.5 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="rounded-md border-2 border-rose-600 bg-rose-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-rose-700"
              >
                Tolak Pinjaman
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
