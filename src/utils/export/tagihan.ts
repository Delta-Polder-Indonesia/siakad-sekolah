import type { TagihanSekolah } from '../../types';
import { createPdfDoc, formatDateShort, formatRupiah } from './helpers';
// ─── TAGIHAN PDF ──────────────────────────────────────────────────────────

export async function exportTagihanPdf(
  tagihanList: TagihanSekolah[],
  studentName: string,
  tahun: number,
  monthNames: string[]
) {
  const p = await createPdfDoc();
  p.addHeader('LAPORAN TAGIHAN SEKOLAH', studentName);

  p.doc.setFontSize(9);
  p.doc.setFont('helvetica', 'normal');
  p.doc.text(`Siswa: ${studentName}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Tahun: ${tahun}`, p.margin, p.y);
  p.y += 8;

  // Table header
  const colWidths = [8, 40, 35, 30, 30, 40];
  const headers = ['No', 'Bulan', 'Jatuh Tempo', 'Jumlah', 'Status', 'Pembayaran'];

  p.doc.setFontSize(8);
  p.doc.setFont('helvetica', 'bold');
  p.doc.setFillColor(240, 240, 240);
  let x = p.margin;
  headers.forEach((h, i) => {
    p.doc.rect(x, p.y, colWidths[i], 6, 'F');
    p.doc.text(h, x + 1, p.y + 4);
    x += colWidths[i];
  });
  p.y += 7;

  // Table rows
  p.doc.setFontSize(7.5);
  p.doc.setFont('helvetica', 'normal');
  let totalTagihan = 0;
  let totalLunas = 0;

  tagihanList.forEach((item, idx) => {
    p.checkNewPage(6);
    x = p.margin;
    const paymentLabel =
      item.status === 'lunas'
        ? item.paymentMethod
          ? (
              {
                atm: 'ATM',
                mobile_banking: 'M-Banking',
                internet_banking: 'Internet',
                ewallet: 'E-Wallet',
                tunai: 'Tunai',
              } as const
            )[item.paymentMethod]
          : 'Lunas'
        : '-';

    const row = [
      String(idx + 1),
      monthNames[item.month - 1] || `Bulan ${item.month}`,
      formatDateShort(item.dueDate),
      formatRupiah(item.amount),
      item.status === 'lunas' ? 'LUNAS' : 'BELUM LUNAS',
      paymentLabel,
    ];

    row.forEach((cell, i) => {
      p.doc.text(cell, x + 1, p.y + 4);
      x += colWidths[i];
    });

    totalTagihan += item.amount;
    if (item.status === 'lunas') totalLunas += item.amount;
    p.y += 5.5;
  });

  // Summary
  p.y += 3;
  p.doc.setFontSize(9);
  p.doc.setFont('helvetica', 'bold');
  p.doc.text(`Total Tagihan: ${formatRupiah(totalTagihan)}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Total Lunas: ${formatRupiah(totalLunas)}`, p.margin, p.y);
  p.y += 4;
  const sisa = totalTagihan - totalLunas;
  p.doc.text(`Sisa Tagihan: ${formatRupiah(sisa)}`, p.margin, p.y);

  p.addFooter();
  p.doc.save(`Tagihan_${studentName.replace(/\s+/g, '_')}_${tahun}.pdf`);
}
