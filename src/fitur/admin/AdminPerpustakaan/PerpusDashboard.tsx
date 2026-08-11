import {
  Users,
  BookOpen,
  UserCheck,
  ShoppingCart,
  ChevronDown,
  Clock,
  Calendar,
  BookMarked,
} from 'lucide-react';
import {
  getBooks,
  getLibraryMembers,
  getLibraryTransactions,
  getStudents,
} from '../../../data/services';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { useState, useMemo } from 'react';

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export default function PerpusDashboard() {
  const storeVersion = useStoreVersion();
  const [selectedMonth, setSelectedMonth] = useState('');

  const books = useMemo(() => getBooks(), [storeVersion]);
  const members = useMemo(() => getLibraryMembers(), [storeVersion]);
  const transactions = useMemo(() => getLibraryTransactions(), [storeVersion]);
  const students = useMemo(() => getStudents(), [storeVersion]);

  const activeTx = transactions.filter((t) => t.status === 'dipinjam');

  const STATS = [
    {
      label: 'ANGGOTA',
      value: members.length,
      icon: Users,
      textColor: 'text-black font-bold',
    },
    {
      label: 'BUKU',
      value: books.length,
      icon: BookOpen,
      textColor: 'text-black font-bold',
    },
    {
      label: 'PENGUNJUNG',
      value: 0,
      icon: UserCheck,
      textColor: 'text-black font-bold',
    },
    {
      label: 'PEMINJAMAN',
      value: activeTx.length,
      icon: ShoppingCart,
      textColor: 'text-black font-bold',
    },
  ];

  // Helper: hitung sisa hari (diperbaiki agar mereset jam ke 00:00:00)
  const getSisaHari = (returnDate: string | undefined) => {
    if (!returnDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(returnDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper: format tanggal Indonesia
  const formatTanggal = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Helper: ambil nama buku dari ID
  const getBookTitle = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.title : bookId;
  };

  // Helper: ambil info siswa
  const getStudentInfo = (memberId: string) => {
    const student = students.find((s) => s.id === memberId);
    const member = members.find((m) => m.id === memberId);
    return {
      name: student?.name || member?.name || 'Tidak Diketahui',
      nis: student?.nis || member?.nis || '-',
      className: student?.className || member?.className || '-',
    };
  };

  // Urutkan transaksi aktif: yang paling dekat deadline di atas
  const sortedActiveTx = useMemo(() => {
    return [...activeTx].sort((a, b) => {
      const dateA = a.returnDate ? new Date(a.returnDate).getTime() : 0;
      const dateB = b.returnDate ? new Date(b.returnDate).getTime() : 0;
      return dateA - dateB;
    });
  }, [activeTx]);

  return (
    <div className="space-y-4 font-sans text-black antialiased">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex overflow-hidden rounded-md border-2 border-black bg-white"
          >
            <div className="flex w-20 items-center justify-center border-r-2 border-black bg-white py-5">
              <stat.icon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex flex-1 flex-col justify-center p-3">
              <p className={`text-xl font-bold ${stat.textColor}`}>{stat.value}</p>
              <p className="text-[10px] font-bold tracking-wide text-black uppercase">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TABEL PEMINJAMAN AKTIF - BARU */}
      <div className="rounded-md border-2 border-black bg-white">
        <div className="flex items-center justify-between border-b-2 border-black bg-white p-4">
          <div className="flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-black" />
            <h3 className="text-xs font-bold tracking-wider text-black uppercase">
              Daftar Peminjaman Aktif
            </h3>
            <span className="ml-2 rounded-md border-2 border-black bg-black px-2 py-0.5 text-[10px] font-bold text-white">
              {sortedActiveTx.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b-2 border-black bg-white text-[10px] font-bold tracking-wider text-black uppercase">
                <th className="border-r-2 border-black/10 px-3 py-3">No</th>
                <th className="border-r-2 border-black/10 px-3 py-3">ID Transaksi</th>
                <th className="border-r-2 border-black/10 px-3 py-3">Nama Peminjam</th>
                <th className="border-r-2 border-black/10 px-3 py-3">ID/NIS</th>
                <th className="border-r-2 border-black/10 px-3 py-3">Judul Buku</th>
                <th className="border-r-2 border-black/10 px-3 py-3">ID Buku</th>
                <th className="border-r-2 border-black/10 px-3 py-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-black" />
                    Tgl Pinjam
                  </div>
                </th>
                <th className="border-r-2 border-black/10 px-3 py-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-black" />
                    Tgl Kembali
                  </div>
                </th>
                <th className="border-r border-black px-3 py-3 text-center">Sisa Hari</th>
                <th className="px-3 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {sortedActiveTx.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-black">
                    <BookOpen className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                    <p className="text-xs font-bold text-black">
                      Tidak ada peminjaman aktif saat ini
                    </p>
                  </td>
                </tr>
              ) : (
                sortedActiveTx.map((tx, index) => {
                  const sisaHari = getSisaHari(tx.returnDate);
                  const studentInfo = getStudentInfo(tx.memberId);
                  const bookTitle = getBookTitle(tx.bookId);

                  let statusBadge = '';
                  let statusClass = '';
                  let sisaClass = '';

                  if (sisaHari < 0) {
                    statusBadge = 'TERLAMBAT';
                    statusClass = 'border-black bg-white text-black';
                    sisaClass = 'text-black font-bold';
                  } else if (sisaHari <= 2) {
                    statusBadge = 'SEGERA';
                    statusClass = 'border-black bg-white text-black';
                    sisaClass = 'text-blue-600 font-bold';
                  } else {
                    statusBadge = 'AKTIF';
                    statusClass = 'border-black bg-white text-black';
                    sisaClass = 'text-black font-bold';
                  }

                  return (
                    <tr key={tx.id} className="transition-colors hover:bg-neutral-100">
                      <td className="border-r border-black px-3 py-3 font-mono font-bold text-black">
                        {index + 1}
                      </td>
                      <td className="border-r-2 border-black/10 px-3 py-3">
                        <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                          {tx.id}
                        </span>
                      </td>
                      <td className="border-r-2 border-black/10 px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-black text-[10px] font-bold text-white">
                            {studentInfo.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-black">{studentInfo.name}</p>
                            <p className="text-[10px] font-bold text-neutral-900">
                              {studentInfo.className}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border-r border-black px-3 py-3 font-mono text-[10px] font-bold text-black">
                        {studentInfo.nis}
                      </td>
                      <td className="border-r-2 border-black/10 px-3 py-3">
                        <p
                          className="max-w-[180px] truncate text-xs font-bold text-black"
                          title={bookTitle}
                        >
                          {bookTitle}
                        </p>
                      </td>
                      <td className="border-r-2 border-black/10 px-3 py-3">
                        <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                          {tx.bookId}
                        </span>
                      </td>
                      <td className="border-r border-black px-3 py-3 font-bold text-black">
                        {formatTanggal(tx.borrowDate)}
                      </td>
                      <td className="border-r border-black px-3 py-3 font-bold text-black">
                        {formatTanggal(tx.returnDate)}
                      </td>
                      <td className="border-r border-black px-3 py-3 text-center">
                        <span className={`text-xs ${sisaClass}`}>
                          {sisaHari < 0 ? `${Math.abs(sisaHari)} hari telat` : `${sisaHari} hari`}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${statusClass}`}
                        >
                          {statusBadge}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        {sortedActiveTx.length > 0 && (
          <div className="flex items-center justify-between border-t-2 border-black bg-white px-4 py-3 text-xs font-bold text-black">
            <span>Menampilkan {sortedActiveTx.length} peminjaman aktif</span>
            <span>Diurutkan berdasarkan tanggal pengembalian terdekat</span>
          </div>
        )}
      </div>

      {/* Statistik Chart */}
      <div className="rounded-md border-2 border-black bg-white p-4">
        <div className="mb-4 flex items-center justify-between border-b-2 border-black pb-3">
          <h3 className="text-xs font-bold tracking-wider text-black uppercase">
            Statistik Pengunjung Perpustakaan
          </h3>
          <div className="flex items-center gap-2">
            <label htmlFor="bulan-select" className="text-xs font-bold text-black">
              Bulan :
            </label>
            <div className="relative">
              <select
                id="bulan-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="cursor-pointer appearance-none rounded-md border-2 border-black bg-white px-3 py-1 pr-8 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 hover:bg-neutral-100"
              >
                <option value="" className="bg-white font-bold text-black">
                  --Pilih--
                </option>
                {MONTHS.map((m) => (
                  <option key={m} value={m} className="bg-white font-bold text-black">
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-black" />
            </div>
          </div>
        </div>

        <div className="flex h-48 items-center justify-center">
          <div className="text-center text-black">
            <p className="mb-2 text-xs font-bold text-black">Statistik</p>
            <div className="mx-auto h-3 w-40 overflow-hidden rounded-md border-2 border-black bg-white">
              <div className="h-full w-1/3 bg-blue-600" />
            </div>
            <p className="mt-2 text-xs font-bold text-black">Total Pengunjung Perpustakaan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
