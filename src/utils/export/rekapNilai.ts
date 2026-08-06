import { isTuntas, KONFIGURASI_PENILAIAN } from '../penilaian';
import { createPdfDoc, exportToCsv } from './helpers';
// ─── REKAP NILAI PDF ──────────────────────────────────────────────────────

export interface RekapNilaiRow {
  studentName: string;
  nis: string;
  nilaiTugas: number;
  nilaiUTS: number;
  nilaiUAS: number;
  nilaiAkhir: number;
  predikat: string;
  tuntas: boolean;
}

export function exportRekapNilaiPdf(
  rows: RekapNilaiRow[],
  className: string,
  subject: string,
  tahunAjaran: string,
  semester: string
) {
  const p = createPdfDoc();
  p.addHeader('REKAP NILAI SISWA', `${subject} - Kelas ${className}`);

  p.doc.setFontSize(9);
  p.doc.setFont('helvetica', 'bold');
  p.doc.text(`Tahun Ajaran: ${tahunAjaran}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Semester: ${semester.toUpperCase()}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(
    `KKM: ${KONFIGURASI_PENILAIAN.kkm} (Tuntas ≥ ${KONFIGURASI_PENILAIAN.kkm})`,
    p.margin,
    p.y
  );
  p.y += 8;

  const colWidths = [8, 55, 22, 18, 18, 18, 18, 18, 18];
  const headers = ['No', 'Nama Siswa', 'NIS', 'Tugas', 'UTS', 'UAS', 'Akhir', 'Pred', 'Tuntas'];

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
  let totalNilai = 0;

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
      r.studentName,
      r.nis,
      String(r.nilaiTugas),
      String(r.nilaiUTS),
      String(r.nilaiUAS),
      String(r.nilaiAkhir),
      r.predikat,
      r.tuntas ? 'Ya' : 'Tidak',
    ];

    row.forEach((cell, i) => {
      p.doc.text(cell, x + 1, p.y + 4);
      x += colWidths[i];
    });
    totalNilai += r.nilaiAkhir;
    p.y += 5;
  });

  p.y += 2;
  p.doc.setFont('helvetica', 'bold');
  p.doc.setFontSize(8);
  const avg = rows.length > 0 ? Math.round(totalNilai / rows.length) : 0;
  const tuntasCount = rows.filter((r) => r.tuntas).length;
  p.doc.text(`Rata-rata Kelas: ${avg}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(
    `Ketuntasan: ${tuntasCount}/${rows.length} (${rows.length > 0 ? Math.round((tuntasCount / rows.length) * 100) : 0}%)`,
    p.margin,
    p.y
  );

  p.addFooter();
  p.doc.save(
    `RekapNilai_${subject.replace(/\s+/g, '_')}_${className.replace(/\s+/g, '_')}_${semester}.pdf`
  );
}

export function exportRekapNilaiCsv(
  rows: RekapNilaiRow[],
  className: string,
  subject: string,
  semester: string
) {
  const data = rows.map((r) => [
    r.studentName,
    r.nis,
    r.nilaiTugas,
    r.nilaiUTS,
    r.nilaiUAS,
    r.nilaiAkhir,
    r.predikat,
    r.tuntas ? 'Tuntas' : 'Belum Tuntas',
  ]);

  exportToCsv(
    data,
    [
      'Nama Siswa',
      'NIS',
      'Nilai Tugas',
      'Nilai UTS',
      'Nilai UAS',
      'Nilai Akhir',
      'Predikat',
      'Ketuntasan (KKM ' + KONFIGURASI_PENILAIAN.kkm + ')',
    ],
    `RekapNilai_${subject.replace(/\s+/g, '_')}_${className.replace(/\s+/g, '_')}_${semester}.csv`
  );
}
