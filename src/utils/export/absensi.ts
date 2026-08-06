import type { Student } from '../../types';
import { createPdfDoc, formatDateShort, exportToCsv } from './helpers';
// ─── ABSENSI PDF ──────────────────────────────────────────────────────────

export function exportAbsensiPdf(
  students: (Student & {
    hadir: number;
    izin: number;
    sakit: number;
    alpha: number;
    total: number;
    percentage: number;
  })[],
  className: string,
  startDate: string,
  endDate: string,
  overallStats: {
    hadir: number;
    izin: number;
    sakit: number;
    alpha: number;
    total: number;
    percentage: number;
  }
) {
  const p = createPdfDoc();
  p.addHeader('LAPORAN ABSENSI SISWA', `Kelas ${className}`);

  p.doc.setFontSize(9);
  p.doc.setFont('helvetica', 'normal');
  p.doc.text(`Periode: ${formatDateShort(startDate)} - ${formatDateShort(endDate)}`, p.margin, p.y);
  p.y += 3;
  p.doc.text(`Kelas: ${className}`, p.margin, p.y);
  p.y += 8;

  // Overall stats
  p.doc.setFontSize(8);
  p.doc.setFont('helvetica', 'bold');
  p.doc.text(
    `Total: ${overallStats.total} | Hadir: ${overallStats.hadir} | Izin: ${overallStats.izin} | Sakit: ${overallStats.sakit} | Alpha: ${overallStats.alpha} | Rate: ${overallStats.percentage}%`,
    p.margin,
    p.y
  );
  p.y += 6;

  // Table header
  const colWidths = [8, 55, 22, 16, 16, 16, 16, 16, 20];
  const headers = ['No', 'Nama Siswa', 'NIS', 'Hadir', 'Izin', 'Sakit', 'Alpha', 'Total', '%'];

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

  // Table rows
  p.doc.setFontSize(7);
  p.doc.setFont('helvetica', 'normal');

  students.forEach((s, idx) => {
    p.checkNewPage(6);
    x = p.margin;
    const row = [
      String(idx + 1),
      s.name,
      s.nis,
      String(s.hadir),
      String(s.izin),
      String(s.sakit),
      String(s.alpha),
      String(s.total),
      `${s.percentage}%`,
    ];

    row.forEach((cell, i) => {
      p.doc.text(cell, x + 1, p.y + 4);
      x += colWidths[i];
    });
    p.y += 5;
  });

  p.addFooter();
  p.doc.save(`Absensi_${className}_${startDate}_${endDate}.pdf`);
}

// ─── ABSENSI CSV (BOM via exportToCsv) ────────────────────────────────────

export interface AbsensiExportRow {
  name: string;
  nis: string;
  hadir: number;
  izin: number;
  sakit: number;
  alpha: number;
  total: number;
  percentage: number;
}

export function exportAbsensiCsv(
  rows: AbsensiExportRow[],
  className: string,
  startDate: string,
  endDate: string
) {
  const data = rows.map((r) => [
    r.name,
    r.nis,
    r.hadir,
    r.izin,
    r.sakit,
    r.alpha,
    r.total,
    `${r.percentage}%`,
  ]);

  exportToCsv(
    data,
    ['Nama Siswa', 'NIS', 'Hadir', 'Izin', 'Sakit', 'Alpha', 'Total', 'Persentase'],
    `Laporan_Absensi_${className.replace(/\s+/g, '_')}_${startDate}_${endDate}.csv`
  );
}

export interface AbsensiKelasRow {
  kelas: string;
  siswa: number;
  hadir: number;
  izin: number;
  sakit: number;
  alpha: number;
  total: number;
  percentage: number;
}

export function exportAbsensiPerKelasCsv(
  rows: AbsensiKelasRow[],
  startDate: string,
  endDate: string
) {
  const data = rows.map((r) => [
    r.kelas,
    r.siswa,
    r.hadir,
    r.izin,
    r.sakit,
    r.alpha,
    r.total,
    `${r.percentage}%`,
  ]);

  exportToCsv(
    data,
    ['Kelas', 'Siswa Terdata', 'Hadir', 'Izin', 'Sakit', 'Alpha', 'Total', 'Persentase'],
    `Rekap_Absensi_PerKelas_${startDate}_${endDate}.csv`
  );
}
