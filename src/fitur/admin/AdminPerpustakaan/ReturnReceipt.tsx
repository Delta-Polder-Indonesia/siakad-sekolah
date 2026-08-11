import { Printer } from 'lucide-react';
import { namaSekolahUppercase } from '../../halaman/components/Profile/dataSekolah';
import { escapeHtml, printViaBlob } from '../../../utils/print';

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
    if (!struk) return;

    const title = `Struk Pengembalian - ${escapeHtml(struk.txId)}`;
    const html = `<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:'Courier New',monospace;padding:20px;max-width:320px;margin:0 auto}.header{text-align:center;border-bottom:2px dashed #333;padding-bottom:10px;margin-bottom:15px}.header h2{margin:0;font-size:14px}.header p{margin:5px 0 0;font-size:11px;color:#666}.row{display:flex;justify-content:space-between;margin:6px 0;font-size:12px}.row.label{font-weight:bold;margin-top:10px}.divider{border-top:1px dashed #ccc;margin:10px 0}.total{font-size:14px;font-weight:bold;border-top:2px solid #333;padding-top:8px;margin-top:10px}.footer{text-align:center;margin-top:20px;font-size:10px;color:#999}@media print{body{padding:0}.no-print{display:none}}</style></head><body><div class="header"><h2>PERPUSTAKAAN ${escapeHtml(namaSekolahUppercase)}</h2><p>Struk Pengembalian Buku</p></div><div class="row"><span>No. Transaksi:</span><span>${escapeHtml(struk.txId)}</span></div><div class="row"><span>Tanggal:</span><span>${escapeHtml(struk.returnDate)}</span></div><div class="divider"></div><div class="row label"><span>Nama Peminjam:</span></div><div class="row"><span>${escapeHtml(struk.studentName)}</span></div><div class="row label"><span>Judul Buku:</span></div><div class="row"><span>${escapeHtml(struk.bookTitle)}</span></div><div class="divider"></div><div class="row"><span>Tgl Pinjam:</span><span>${escapeHtml(struk.borrowDate)}</span></div><div class="row"><span>Tgl Jatuh Tempo:</span><span>${escapeHtml(struk.dueDate)}</span></div><div class="row"><span>Tgl Kembali:</span><span>${escapeHtml(struk.returnDate)}</span></div><div class="divider"></div><div class="row"><span>Keterlambatan:</span><span>${escapeHtml(struk.daysLate)} hari</span></div><div class="row"><span>Denda per Hari:</span><span>Rp ${escapeHtml(struk.dendaPerHari.toLocaleString('id-ID'))}</span></div><div class="total row"><span>TOTAL DENDA:</span><span>Rp ${escapeHtml(struk.denda.toLocaleString('id-ID'))}</span></div><div class="footer"><p>Terima kasih telah meminjam buku di perpustakaan kami.</p><p>Harap kembalikan buku tepat waktu.</p></div></body></html>`;

    printViaBlob(html, { title, width: 'width=400', height: 'height=600' });
  };

  return (
    <button type="button"
      onClick={handlePrint}
      className="flex items-center gap-1.5 rounded-md border-2 border-black bg-black px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-neutral-900"
    >
      <Printer className="h-3.5 w-3.5" />
      Cetak Struk Terakhir
    </button>
  );
}
