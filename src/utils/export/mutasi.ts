import { createPdfDoc, exportToCsv, formatDate } from './helpers';
import {
  namaSekolahUppercase,
  namaSekolah,
  alamatLengkap,
  kota,
} from '../../fitur/halaman/components/Profile/dataSekolah';
// ─── MUTASI SISWA CSV & PDF ──────────────────────────────────────────────

export interface MutasiSiswaRow {
  jenis: 'Status' | 'Kelas';
  waktu: string;
  dari: string;
  ke: string;
  catatan: string;
}

export function exportMutationsCsv(rows: MutasiSiswaRow[], studentName: string) {
  const data = rows.map((r) => [
    r.jenis,
    new Date(r.waktu).toLocaleString('id-ID'),
    r.dari,
    r.ke,
    r.catatan || '-',
  ]);

  const today = new Date().toISOString().slice(0, 10);
  exportToCsv(
    data,
    ['Jenis', 'Waktu', 'Dari', 'Ke', 'Catatan'],
    `Riwayat_Mutasi_${studentName.replace(/\s+/g, '_')}_${today}.csv`
  );
}

export async function exportMutationsPdf(rows: MutasiSiswaRow[], studentName: string) {
  const p = await createPdfDoc();
  p.addHeader('REKAP RIWAYAT MUTASI SISWA', studentName);

  p.doc.setFontSize(9);
  p.doc.setFont('helvetica', 'bold');
  p.doc.text(`Siswa: ${studentName}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Jumlah Rekam Mutasi: ${rows.length}`, p.margin, p.y);
  p.y += 8;

  const colWidths = [10, 22, 44, 44, 44, 48];
  const headers = ['No', 'Jenis', 'Waktu', 'Dari', 'Ke', 'Catatan'];

  p.doc.setFontSize(7.5);
  p.doc.setFont('helvetica', 'bold');
  p.doc.setFillColor(240, 240, 240);
  let x = p.margin;
  headers.forEach((h, i) => {
    p.doc.rect(x, p.y, colWidths[i], 6, 'F');
    p.doc.text(h, x + 1, p.y + 4);
    x += colWidths[i];
  });
  p.y += 7;

  p.doc.setFontSize(7);
  p.doc.setFont('helvetica', 'normal');

  rows.forEach((r, idx) => {
    p.checkNewPage(6);

    if (p.y < 20) {
      p.doc.setFontSize(7.5);
      p.doc.setFont('helvetica', 'bold');
      p.doc.setFillColor(240, 240, 240);
      x = p.margin;
      headers.forEach((h, i) => {
        p.doc.rect(x, p.y, colWidths[i], 6, 'F');
        p.doc.text(h, x + 1, p.y + 4);
        x += colWidths[i];
      });
      p.y += 7;
      p.doc.setFontSize(7);
      p.doc.setFont('helvetica', 'normal');
    }

    x = p.margin;
    const row = [
      String(idx + 1),
      r.jenis,
      new Date(r.waktu).toLocaleString('id-ID'),
      r.dari,
      r.ke,
      r.catatan || '-',
    ];

    row.forEach((cell, i) => {
      p.doc.text(cell, x + 1, p.y + 4);
      x += colWidths[i];
    });
    p.y += 5;
  });

  p.addFooter();
  const today = new Date().toISOString().slice(0, 10);
  p.doc.save(`Riwayat_Mutasi_${studentName.replace(/\s+/g, '_')}_${today}.pdf`);
}

// ─── SURAT KETERANGAN PINDAH / KELUAR (printable) ───────────────────────

export interface SuratMutasiKeluarParams {
  studentName: string;
  nis: string;
  className: string;
  jenis: 'pindah' | 'keluar';
  note?: string;
  movedAt?: string;
}

export async function exportSuratMutasiPdf(params: SuratMutasiKeluarParams) {
  const judul =
    params.jenis === 'pindah' ? 'SURAT KETERANGAN PINDAH SEKOLAH' : 'SURAT KETERANGAN KELUAR';
  const alasan = params.jenis === 'pindah' ? 'pindah sekolah' : 'mengundurkan diri / keluar';

  const p = await createPdfDoc();
  p.addHeader(judul, `${namaSekolahUppercase}`);

  // Kop alamat sekolah
  p.doc.setFontSize(9);
  p.doc.setFont('helvetica', 'normal');
  p.doc.text(`Alamat: ${alamatLengkap}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Kota: ${kota}`, p.margin, p.y);
  p.y += 8;

  // Pembuka
  p.doc.setFontSize(9);
  p.doc.setFont('helvetica', 'normal');
  const paragraf1 =
    'Yang bertanda tangan di bawah ini, Kepala Sekolah pada sekolah tersebut di atas, dengan ini menerangkan bahwa:';
  p.doc.text(paragraf1, p.margin, p.y, { maxWidth: p.contentWidth });
  p.y += 6;

  // Data siswa (mini table)
  p.doc.setFont('helvetica', 'bold');
  p.doc.text(`Nama: ${params.studentName}`, p.margin, p.y);
  p.y += 5;
  p.doc.text(`NIS / NISN: ${params.nis}`, p.margin, p.y);
  p.y += 5;
  p.doc.text(`Kelas: ${params.className}`, p.margin, p.y);
  p.y += 5;
  if (params.movedAt) {
    p.doc.text(`Tanggal Mutasi: ${formatDate(params.movedAt)}`, p.margin, p.y);
    p.y += 5;
  }
  p.y += 3;

  // Isi keterangan
  p.doc.setFont('helvetica', 'normal');
  const tanggalMutasi = params.movedAt
    ? ` terhitung sejak tanggal ${formatDate(params.movedAt)}`
    : '';
  const paragraf2 = `Bahwa siswa tersebut benar-benar terdaftar sebagai peserta didik pada ${namaSekolah}, ${kota}. Demi kepentingan ${alasan}${tanggalMutasi}, maka diberikan surat keterangan ini.`;
  const paragraf2Lines = p.doc.splitTextToSize(paragraf2, p.contentWidth);
  p.doc.text(paragraf2Lines, p.margin, p.y);
  p.y += paragraf2Lines.length * 4 + 3;

  if (params.note) {
    p.doc.text(`Keterangan: ${params.note}`, p.margin, p.y);
    p.y += 5;
  }

  p.y += 6;
  p.doc.text('Surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.', p.margin, p.y);
  p.y += 18;

  // Tanda tangan
  const tanggalSekarang = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  p.doc.text(`${kota}, ${tanggalSekarang}`, p.contentWidth - 50, p.y);
  p.y += 5;
  p.doc.text('Kepala Sekolah,', p.contentWidth - 50, p.y);
  p.y += 20;
  p.doc.text('(_____________________________)', p.contentWidth - 50, p.y);

  p.addFooter();
  p.doc.save(
    `Surat_${params.jenis === 'pindah' ? 'Pindah' : 'Keluar'}_${params.studentName.replace(/\s+/g, '_')}.pdf`
  );
}
