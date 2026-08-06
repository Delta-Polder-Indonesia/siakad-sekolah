import { useMemo } from 'react';
import {
  getBooks,
  getStudents,
  borrowBook,
  returnBook,
  getLibraryTransactions,
  approveLibraryLoan,
  rejectLibraryLoan,
} from '@/data/services';
import { useStoreVersion } from '@/hooks/useStoreVersion'; // Menggunakan alias @/
import { FormPeminjaman } from './FormPeminjaman';
import { FormPengembalian } from './FormPengembalian';

interface PerpusTransaksiProps {
  activeSubTab: 'pinjam' | 'kembali';
}

export default function PerpusTransaksi({ activeSubTab }: PerpusTransaksiProps) {
  const storeVersion = useStoreVersion();
  const isPinjam = activeSubTab === 'pinjam';

  const allBooks = useMemo(() => getBooks(), [storeVersion]);
  const allStudents = useMemo(() => getStudents(), [storeVersion]);
  const allTx = useMemo(() => getLibraryTransactions(), [storeVersion]);

  return (
    <div className="space-y-6">
      {isPinjam ? (
        <FormPeminjaman
          books={allBooks}
          students={allStudents}
          transactions={allTx}
          onBorrow={borrowBook}
          onApprove={approveLibraryLoan}
          onReject={rejectLibraryLoan}
        />
      ) : (
        <FormPengembalian
          allTx={allTx}
          allBooks={allBooks}
          allStudents={allStudents}
          onReturn={(txId, returnDate) => returnBook(txId, returnDate)}
        />
      )}
    </div>
  );
}
