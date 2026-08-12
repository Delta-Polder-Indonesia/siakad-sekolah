import { useState, useMemo, useRef, useEffect } from 'react';
import { Receipt, BookOpen, CalendarDays, Check, AlertCircle, X, User, Search } from 'lucide-react';
import { useToast } from '../../../components/ui';
import { DendaSettings } from './DendaSettings';
import { getDendaConfig, setDendaConfig } from './dendaUtils';
import { ReturnReceipt, StrukData } from './ReturnReceipt';
import { highlightMatch } from './utils/highlightMatch';
import { useSmartMemberSearch } from './hooks/useSmartSearch';

interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  bookId: string;
  status: string;
  borrowDate: string;
  dueDate: string;
}

interface Book {
  id: string;
  title: string;
}

interface Student {
  id: string;
  name: string;
  nis: string;
  classId?: string;
}

interface FormPengembalianProps {
  allTx: Transaction[];
  allBooks: Book[];
  allStudents: Student[];
  onReturn: (
    txId: string,
    returnDate: string
  ) => { ok: boolean; message?: string } | Promise<{ ok: boolean; message?: string }>;
}

export function FormPengembalian({
  allTx,
  allBooks,
  allStudents,
  onReturn,
}: FormPengembalianProps) {
  const { showToast } = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [dendaPerHari, setDendaPerHari] = useState(getDendaConfig());
  const [struk, setStruk] = useState<StrukData | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const memberDropdownRef = useRef<HTMLDivElement>(null);
  const memberInputRef = useRef<HTMLInputElement>(null);

  const studentsWithLoans = useMemo(() => {
    const memberIds = new Set(allTx.filter((t) => t.status === 'dipinjam').map((t) => t.memberId));
    return allStudents.filter((s) => memberIds.has(s.id));
  }, [allTx, allStudents]);

  const filteredMembers = useSmartMemberSearch(studentsWithLoans, memberSearch, { limit: 20 });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(e.target as Node)) {
        setShowMemberDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMemberSearchChange = (query: string) => {
    setMemberSearch(query);
    setSelectedMemberId('');
    setShowMemberDropdown(true);
    setStruk(null);
  };

  const handleSelectMember = (student: Student) => {
    setSelectedMemberId(student.id);
    setMemberSearch(`${student.name} (${student.nis})`);
    setShowMemberDropdown(false);
    setStruk(null);
  };

  const memberLoans = useMemo(() => {
    if (!selectedMemberId) return [];
    return allTx.filter((t) => t.memberId === selectedMemberId && t.status === 'dipinjam');
  }, [allTx, selectedMemberId]);

  const getSisaHari = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDenda = (dueDate: string) => {
    const sisa = getSisaHari(dueDate);
    if (sisa >= 0) return 0;
    return Math.abs(sisa) * dendaPerHari;
  };

  const handleReturn = async (txId: string, bookTitle: string) => {
    const returnDate = new Date().toISOString().slice(0, 10);
    const tx = allTx.find((t) => t.id === txId);
    if (!tx) return;

    const res = await onReturn(txId, returnDate);
    if (res.ok) {
      const sisaHari = getSisaHari(tx.dueDate);
      const denda = getDenda(tx.dueDate);
      const daysLate = sisaHari < 0 ? Math.abs(sisaHari) : 0;
      const student = allStudents.find((s) => s.id === tx.memberId);

      setStruk({
        txId,
        bookTitle,
        studentName: student?.name || tx.memberName,
        borrowDate: tx.borrowDate,
        dueDate: tx.dueDate,
        returnDate,
        daysLate,
        denda,
        dendaPerHari,
      });

      if (denda > 0) {
        showToast(
          'success',
          `✅ Buku "${bookTitle}" berhasil dikembalikan. Denda keterlambatan: Rp ${denda.toLocaleString('id-ID')} (${daysLate} hari x Rp ${dendaPerHari.toLocaleString('id-ID')}).`
        );
      } else {
        showToast('success', `✅ Buku "${bookTitle}" berhasil dikembalikan tepat waktu.`);
      }
    } else {
      showToast('error', res.message || 'Gagal mengembalikan buku.');
    }
  };

  const handleSaveDenda = (amount: number) => {
    setDendaPerHari(amount);
    setDendaConfig(amount);
    showToast(
      'success',
      `✅ Tarif denda diperbarui: Rp ${amount.toLocaleString('id-ID')} per hari.`
    );
  };

  const selectedStudent = allStudents.find((s) => s.id === selectedMemberId);

  return (
    <div className="space-y-6">
      <div className="rounded-md border-2 border-black bg-white">
        {/* Header Form */}
        <div className="flex items-center justify-between border-b-2 border-black p-4">
          <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
            <Receipt className="h-5 w-5 text-black" />
            Form Pengembalian Buku
          </h2>
          <div className="relative">
            <DendaSettings dendaPerHari={dendaPerHari} onDendaChange={handleSaveDenda} />
          </div>
        </div>

        <div className="mx-auto max-w-3xl p-6">
          <div className="mb-2 grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="pr-4 text-right text-xs font-bold text-black uppercase">
              Pilih Siswa
            </label>
            <div className="relative" ref={memberDropdownRef}>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-black" />
                <input
                  ref={memberInputRef}
                  type="text"
                  value={memberSearch}
                  onChange={(e) => handleMemberSearchChange(e.target.value)}
                  onFocus={() => setShowMemberDropdown(true)}
                  placeholder="Ketik nama atau NIS siswa yang meminjam..."
                  className="w-full rounded-md border-2 border-black bg-white py-2 pr-8 pl-9 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:bg-neutral-50"
                />
                {memberSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setMemberSearch('');
                      setSelectedMemberId('');
                      setShowMemberDropdown(false);
                      setStruk(null);
                    }}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-black hover:text-black"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {showMemberDropdown && !selectedMemberId && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border-2 border-black bg-white">
                  {filteredMembers.length > 0 ? (
                    <>
                      <div className="sticky top-0 border-b-2 border-black bg-neutral-50 px-3 py-1.5">
                        <p className="text-[10px] font-bold text-black">
                          {memberSearch.trim()
                            ? `${filteredMembers.length} siswa ditemukan untuk "${memberSearch}"`
                            : `${filteredMembers.length} siswa dengan pinjaman aktif`}
                        </p>
                      </div>
                      {filteredMembers.map(({ item: student }) => {
                        const loanCount = allTx.filter(
                          (t) => t.memberId === student.id && t.status === 'dipinjam'
                        ).length;
                        return (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => handleSelectMember(student)}
                            className="flex w-full items-center gap-3 border-b-2 border-black/10 px-3 py-2.5 text-left text-xs transition-colors last:border-0 hover:bg-neutral-100"
                          >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-black bg-white text-xs font-bold text-black">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-bold text-black">
                                {highlightMatch(student.name, memberSearch)}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2">
                                <span className="text-[10px] font-bold text-black">
                                  NIS: {highlightMatch(student.nis, memberSearch)}
                                </span>
                                {student.classId && (
                                  <span className="text-[10px] font-bold text-black">
                                    • Kelas: {student.classId}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 text-[10px] font-bold text-black">
                                {loanCount} buku
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <div className="p-4 text-center">
                      <User className="mx-auto mb-2 h-8 w-8 text-black" />
                      <p className="text-xs font-bold text-black">
                        Tidak ditemukan siswa dengan pinjaman aktif untuk &quot;{memberSearch}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedMemberId && selectedStudent && (
            <div className="mt-4 flex items-center gap-3 rounded-md border-2 border-black bg-white p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-sm font-bold text-black">
                {selectedStudent.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-black">{selectedStudent.name}</p>
                <p className="text-xs font-bold text-black">
                  NIS: {selectedStudent.nis} | Kelas: {selectedStudent.classId || '-'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedMemberId('');
                  setMemberSearch('');
                  setStruk(null);
                }}
                className="rounded-md border-2 border-black bg-white p-1.5 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
                title="Ganti siswa"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedMemberId && (
        <div className="rounded-md border-2 border-black bg-white">
          <div className="flex items-center justify-between border-b-2 border-black p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
              <BookOpen className="h-4 w-4 text-black" />
              Daftar Buku yang Dipinjam ({memberLoans.length})
            </h3>
            <ReturnReceipt struk={struk} />
          </div>

          {memberLoans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-black bg-white text-[10px] font-bold tracking-wider text-black uppercase">
                    <th className="border-r-2 border-black/10 px-4 py-3 text-left">No</th>
                    <th className="border-r-2 border-black/10 px-4 py-3 text-left">ID Transaksi</th>
                    <th className="border-r-2 border-black/10 px-4 py-3 text-left">Judul Buku</th>
                    <th className="border-r-2 border-black/10 px-4 py-3 text-left">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3 text-black" />
                        Tgl Pinjam
                      </div>
                    </th>
                    <th className="border-r-2 border-black/10 px-4 py-3 text-left">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3 text-black" />
                        Tgl Kembali
                      </div>
                    </th>
                    <th className="border-r-2 border-black/10 px-4 py-3 text-center">Sisa Hari</th>
                    <th className="border-r-2 border-black/10 px-4 py-3 text-right">Denda</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
                  {memberLoans.map((loan, idx) => {
                    const book = allBooks.find((b) => b.id === loan.bookId);
                    const sisaHari = getSisaHari(loan.dueDate);
                    const denda = getDenda(loan.dueDate);
                    return (
                      <tr key={loan.id} className="transition-colors hover:bg-neutral-100">
                        <td className="border-r-2 border-black/10 px-4 py-3 font-bold text-black">
                          {idx + 1}
                        </td>
                        <td className="border-r border-black px-4 py-3">
                          <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                            {loan.id}
                          </span>
                        </td>
                        <td className="border-r-2 border-black/10 px-4 py-3 font-bold text-black">
                          {book?.title || 'Buku Tidak Diketahui'}
                        </td>
                        <td className="border-r-2 border-black/10 px-4 py-3 font-bold text-black">
                          {loan.borrowDate}
                        </td>
                        <td className="border-r-2 border-black/10 px-4 py-3 font-bold text-black">
                          {loan.dueDate}
                        </td>
                        <td className="border-r border-black px-4 py-3 text-center font-bold text-black">
                          {sisaHari < 0
                            ? `${Math.abs(sisaHari)} hari telat`
                            : sisaHari === 0
                              ? 'Hari ini'
                              : `${sisaHari} hari lagi`}
                        </td>
                        <td className="border-r border-black px-4 py-3 text-right font-bold text-black">
                          {denda > 0 ? (
                            `Rp ${denda.toLocaleString('id-ID')}`
                          ) : (
                            <span className="text-[10px]">Tidak ada</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleReturn(loan.id, book?.title || 'Buku')}
                            className="inline-flex items-center gap-1 rounded-md border-2 border-black bg-black px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-neutral-900"
                          >
                            <Check className="h-3 w-3" />
                            KEMBALIKAN
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-black">
              <BookOpen className="mx-auto mb-2 h-10 w-10 text-black" />
              <p className="text-sm font-bold text-black">
                Siswa ini tidak memiliki buku yang sedang dipinjam.
              </p>
            </div>
          )}
        </div>
      )}

      {!selectedMemberId && (
        <div className="flex items-start gap-3 rounded-md border-2 border-black bg-white p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-black" />
          <div>
            <p className="text-sm font-bold text-black">Cara Mengembalikan Buku</p>
            <ol className="mt-1 list-inside list-decimal space-y-1 text-xs font-bold text-black">
              <li>Ketik nama atau NIS siswa di kolom pencarian di atas</li>
              <li>Pilih siswa dari hasil pencarian yang muncul</li>
              <li>Sistem akan menampilkan semua buku yang sedang dipinjam siswa tersebut</li>
              <li>
                Klik tombol <strong>KEMBALIKAN</strong> pada buku yang ingin dicatat pengembaliannya
              </li>
              <li>
                Stok buku akan otomatis bertambah dan status berubah menjadi
                &quot;dikembalikan&quot;
              </li>
              <li>Struk pengembalian bisa dicetak untuk arsip</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
