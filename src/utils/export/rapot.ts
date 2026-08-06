import type { NilaiRapot } from '../../types';
import { isTuntas, KONFIGURASI_PENILAIAN } from '../penilaian';
import { createPdfDoc, exportToCsv } from './helpers';
// ─── RAPOT PDF ────────────────────────────────────────────────────────────

export function exportRapotPdf(
  nilaiList: NilaiRapot[],
  studentName: string,
  className: string,
  tahunAjaran: string,
  semester: string
) {
  const p = createPdfDoc();
  p.addHeader('LAPORAN HASIL BELAJAR (RAPOT)', `${studentName} - Kelas ${className}`);

  // Info
  p.doc.setFontSize(9);
  p.doc.setFont('helvetica', 'bold');
  p.doc.text(`Tahun Ajaran: ${tahunAjaran}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Semester: ${semester.toUpperCase()}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Siswa: ${studentName}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Kelas: ${className}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(
    `KKM: ${KONFIGURASI_PENILAIAN.kkm} (Tuntas ≥ ${KONFIGURASI_PENILAIAN.kkm})`,
    p.margin,
    p.y
  );
  p.y += 8;

  // Table header
  const colWidths = [8, 56, 18, 18, 18, 18, 18, 16, 40];
  const headers = [
    'No',
    'Mata Pelajaran',
    'Tugas',
    'UTS',
    'UAS',
    'Akhir',
    'Pred',
    'Tuntas',
    'Catatan',
  ];

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
  let totalNilai = 0;

  nilaiList.forEach((item, idx) => {
    p.checkNewPage(6);

    // Re-draw header if new page
    if (p.y < 20) {
      p.doc.setFontSize(8);
      p.doc.setFont('helvetica', 'bold');
      p.doc.setFillColor(240, 240, 240);
      x = p.margin;
      headers.forEach((h, i) => {
        p.doc.rect(x, p.y, colWidths[i], 6, 'F');
        p.doc.text(h, x + 1, p.y + 4);
        x += colWidths[i];
      });
      p.y += 7;
      p.doc.setFontSize(7.5);
      p.doc.setFont('helvetica', 'normal');
    }

    x = p.margin;
    const row = [
      String(idx + 1),
      item.mataPelajaran,
      String(item.nilaiTugas ?? '-'),
      String(item.nilaiUTS),
      String(item.nilaiUAS),
      String(item.nilaiAkhir),
      item.predikat || '-',
      isTuntas(item.nilaiAkhir) ? 'Ya' : 'Tidak',
      item.catatanGuru || '',
    ];

    row.forEach((cell, i) => {
      p.doc.text(cell, x + 1, p.y + 4);
      x += colWidths[i];
    });
    totalNilai += item.nilaiAkhir;
    p.y += 5.5;
  });

  // Rata-rata
  p.y += 2;
  p.doc.setFont('helvetica', 'bold');
  p.doc.setFontSize(9);
  const avg = nilaiList.length > 0 ? Math.round(totalNilai / nilaiList.length) : 0;
  p.doc.text(`Rata-rata: ${avg}`, p.margin, p.y);

  p.addFooter();
  p.doc.save(`Rapot_${studentName.replace(/\s+/g, '_')}_${tahunAjaran}_${semester}.pdf`);
}

// ─── RAPOT CSV ────────────────────────────────────────────────────────────

export function exportRapotCsv(nilaiList: NilaiRapot[], filename: string) {
  const rows = nilaiList.map((item) => [
    item.mataPelajaran,
    item.nilaiTugas ?? 0,
    item.nilaiUTS,
    item.nilaiUAS,
    item.nilaiAkhir,
    item.predikat || '-',
    isTuntas(item.nilaiAkhir) ? 'Tuntas' : 'Belum Tuntas',
    item.catatanGuru || '',
  ]);

  exportToCsv(
    rows,
    [
      'Mata Pelajaran',
      'Nilai Tugas',
      'Nilai UTS',
      'Nilai UAS',
      'Nilai Akhir',
      'Predikat',
      'Ketuntasan (KKM ' + KONFIGURASI_PENILAIAN.kkm + ')',
      'Catatan Guru',
    ],
    filename
  );
}
