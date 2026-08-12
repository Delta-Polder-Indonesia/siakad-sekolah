import { useEffect, useMemo } from 'react';
import {
  getBooks,
  getStudents,
  getLibraryTransactions,
} from '@/data/services';
import {
  fetchBooks,
  fetchTransactions,
  borrowBookApi,
  approveLoanApi,
  rejectLoanApi,
  returnBookApi,
} from '@/services/libraryService';
import { useStoreVersion } from '@/hooks/useStoreVersion'; // Menggunakan alias @/
import { FormPeminjaman } from './FormPeminjaman';
import { FormPengembalian } from './FormPengembalian';

interface PerpusTransaksiProps {
  activeSubTab: 'pinjam' | 'kembali';
}

export default function PerpusTransaksi({ activeSubTab }: PerpusTransaksiProps) {
  const storeVersion = useStoreVersion();
  const isPinjam = activeSubTab === 'pinjam';

  // Muat katalog & transaksi dari backend bila aktif (fallback lokal).
  useEffect(() => {
    void fetchBooks();
    void fetchTransactions();
  }, [storeVersion]);

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
          onBorrow={borrowBookApi}
          onApprove={approveLoanApi}
          onReject={rejectLoanApi}
        />
      ) : (
        <FormPengembalian
          allTx={allTx}
          allBooks={allBooks}
          allStudents={allStudents}
          onReturn={(txId, returnDate) => returnBookApi(txId, returnDate)}
        />
      )}
    </div>
  );
}
