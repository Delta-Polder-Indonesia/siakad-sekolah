import type { AgendaItem } from '../../fitur/halaman/components/KalenderAkademik/AgendaData/agenda';
import { createPdfDoc } from './helpers';
import { namaSekolahUppercase } from '../../fitur/halaman/components/Profile/dataSekolah';

// ─── KALENDER AKADEMIK PDF ───────────────────────────────────────────────

export interface KalenderAkademikPdfParams {
  tahunAjaran: string;
  ganjil: AgendaItem[];
  genap: AgendaItem[];
}

const truncate = (s: string, max: number) => (s.length > max ? s.slice(0, max - 1) + '…' : s);

export async function exportKalenderAkademikPdf({
  tahunAjaran,
  ganjil,
  genap,
}: KalenderAkademikPdfParams) {
  const p = await createPdfDoc();
  p.addHeader(`KALENDER AKADEMIK ${namaSekolahUppercase}`, `Tahun Ajaran ${tahunAjaran}`);

  const colWidths = [8, 34, 14, 52, 34, 38];
  const headers = ['NO', 'TANGGAL', 'WAKTU', 'KEGIATAN', 'JENIS', 'LOKASI'];

  const drawHeaderRow = () => {
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
  };

  const semesters = [
    { label: 'SEMESTER GANJIL', items: ganjil },
    { label: 'SEMESTER GENAP', items: genap },
  ];

  semesters.forEach((sem) => {
    p.checkNewPage(14);
    p.doc.setFontSize(9);
    p.doc.setFont('helvetica', 'bold');
    p.doc.text(sem.label, p.margin, p.y);
    p.y += 5;
    p.doc.setFontSize(7.5);
    p.doc.text(`Jumlah kegiatan: ${sem.items.length}`, p.margin, p.y);
    p.y += 3;
    drawHeaderRow();

    sem.items.forEach((item, idx) => {
      p.checkNewPage(6);
      if (p.y < 20) {
        drawHeaderRow();
        p.doc.setFontSize(7.5);
        p.doc.setFont('helvetica', 'normal');
      }

      let x = p.margin;
      const row = [
        String(idx + 1),
        item.date,
        item.time,
        truncate(item.title, 44),
        item.type,
        item.location ? truncate(item.location, 30) : '-',
      ];
      row.forEach((cell, i) => {
        p.doc.text(cell, x + 1, p.y + 4);
        x += colWidths[i];
      });
      p.y += 5.5;
    });

    p.y += 4;
  });

  p.addFooter();
  p.doc.save(`Kalender_Akademik_${tahunAjaran.replace('/', '_')}.pdf`);
}
