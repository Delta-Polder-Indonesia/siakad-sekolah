import { Printer } from 'lucide-react';
import { namaSekolahUppercase } from '../../halaman/components/Profile/dataSekolah';

export interface StrukData {
  txId: string;
  bookTitle: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string;
  daysLate: number;
  denda: number;
  dendaPerHari: number;
}

interface ReturnReceiptProps {
  struk: StrukData | null;
}

export function ReturnReceipt({ struk }: ReturnReceiptProps) {
  if (!struk) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `<!DOCTYPE html><html><head><title>Struk Pengembalian - ${struk.txId}</title><style>body{font-family:'Courier New',monospace;padding:20px;max-width:320px;margin:0 auto}.header{text-align:center;border-bottom:2px dashed #333;padding-bottom:10px;margin-bottom:15px}.header h2{margin:0;font-size:14px}.header p{margin:5px 0 0;font-size:11px;color:#666}.row{display:flex;justify-content:space-between;margin:6px 0;font-size:12px}.row.label{font-weight:bold;margin-top:10px}.divider{border-top:1px dashed #ccc;margin:10px 0}.total{font-size:14px;font-weight:bold;border-top:2px solid #333;padding-top:8px;margin-top:10px}.footer{text-align:center;margin-top:20px;font-size:10px;color:#999}@media print{body{padding:0}.no-print{display:none}}</style></head><body><div class="header"><h2>PERPUSTAKAAN ${namaSekolahUppercase}</h2><p>Struk Pengembalian Buku</p></div><div class="row"><span>No. Transaksi:</span><span>${struk.txId}</span></div><div class="row"><span>Tanggal:</span><span>${struk.returnDate}</span></div><div class="divider"></div><div class="row label"><span>Nama Peminjam:</span></div><div class="row"><span>${struk.studentName}</span></div><div class="row label"><span>Judul Buku:</span></div><div class="row"><span>${struk.bookTitle}</span></div><div class="divider"></div><div class="row"><span>Tgl Pinjam:</span><span>${struk.borrowDate}</span></div><div class="row"><span>Tgl Jatuh Tempo:</span><span>${struk.dueDate}</span></div><div class="row"><span>Tgl Kembali:</span><span>${struk.returnDate}</span></div><div class="divider"></div><div class="row"><span>Keterlambatan:</span><span>${struk.daysLate} hari</span></div><div class="row"><span>Denda per Hari:</span><span>Rp ${struk.dendaPerHari.toLocaleString('id-ID')}</span></div><div class="total row"><span>TOTAL DENDA:</span><span>Rp ${struk.denda.toLocaleString('id-ID')}</span></div><div class="footer"><p>Terima kasih telah meminjam buku di perpustakaan kami.</p><p>Harap kembalikan buku tepat waktu.</p></div><div style="text-align:center;margin-top:20px" class="no-print"><button onclick="window.print()" style="padding:8px 20px;font-size:12px;cursor:pointer">🖨️ Cetak Struk</button></div></body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-1.5 rounded-md border-2 border-black bg-black px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-neutral-900"
    >
      <Printer className="h-3.5 w-3.5" />
      Cetak Struk Terakhir
    </button>
  );
}
