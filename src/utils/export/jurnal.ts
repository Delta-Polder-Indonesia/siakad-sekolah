import type { TeacherLessonNote } from '../../types';
import { createPdfDoc, exportToCsv } from './helpers';
// ─── JURNAL MENGAJAR PDF ─────────────────────────────────────────────────

export async function exportJurnalPdf(
  notes: TeacherLessonNote[],
  teacherName: string,
  className: string,
  subject: string
) {
  const p = await createPdfDoc();
  p.addHeader('JURNAL MENGAJAR GURU', `${subject} - Kelas ${className}`);

  p.doc.setFontSize(9);
  p.doc.setFont('helvetica', 'bold');
  p.doc.text(`Guru: ${teacherName}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Mata Pelajaran: ${subject}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Kelas: ${className}`, p.margin, p.y);
  p.y += 4;
  p.doc.text(`Jumlah Catatan: ${notes.length}`, p.margin, p.y);
  p.y += 8;

  const colWidths = [22, 60, 25, 15, 65];
  const headers = ['Tanggal', 'Materi', 'PR', 'Hadir', 'Catatan'];

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

  p.doc.setFontSize(7.5);
  p.doc.setFont('helvetica', 'normal');

  notes.forEach((note) => {
    p.checkNewPage(6);

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
      note.date,
      note.materi,
      note.adaPr ? note.prDetail || 'Ada PR' : '-',
      '-',
      note.catatan || '',
    ];

    row.forEach((cell, i) => {
      p.doc.text(cell, x + 1, p.y + 4);
      x += colWidths[i];
    });
    p.y += 5.5;
  });

  p.addFooter();
  p.doc.save(`Jurnal_${subject.replace(/\s+/g, '_')}_${className.replace(/\s+/g, '_')}.pdf`);
}

export function exportJurnalCsv(notes: TeacherLessonNote[], filename: string) {
  const rows = notes.map((note) => [
    note.date,
    note.materi,
    note.adaPr ? 'Ada PR' : 'Tidak',
    note.prDetail || '',
    note.catatan || '',
  ]);

  exportToCsv(rows, ['Tanggal', 'Materi', 'PR', 'Detail PR', 'Catatan'], filename);
}
