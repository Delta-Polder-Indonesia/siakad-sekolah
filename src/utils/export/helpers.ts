import { namaSekolahUppercase } from '../../fitur/halaman/components/Profile/dataSekolah';
// ─── HELPERS ──────────────────────────────────────────────────────────────

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getTimestamp(): string {
  return new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── CSV EXPORT (Excel-compatible) ───────────────────────────────────────

export function exportToCsv(rows: (string | number)[][], headers: string[], filename: string) {
  const csvContent = [
    headers.join(','),
    ...rows.map((r) =>
      r
        .map((cell) => {
          const str = String(cell);
          // Escape quotes and wrap in quotes if contains comma or newline
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(',')
    ),
  ].join('\n');

  const bom = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

// ─── PDF PAGE SETUP ───────────────────────────────────────────────────────

export async function createPdfDoc() {
  const jsPDF = await import('./loadJsPdf').then((m) => m.loadJsPdf());
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addHeader = (title: string, subtitle?: string) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, y, { align: 'center' });
    y += 6;
    if (subtitle) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, pageWidth / 2, y, { align: 'center' });
      y += 5;
    }
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  const addFooter = () => {
    const footerY = pageHeight - 10;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text(
      `Dicetak: ${getTimestamp()} | Portal Siswa ${namaSekolahUppercase}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );
    doc.setTextColor(0);
  };

  const checkNewPage = (needed: number) => {
    const footerSpace = 15;
    if (y + needed > pageHeight - footerSpace) {
      addFooter();
      doc.addPage();
      y = margin;
    }
  };

  return {
    doc,
    pageWidth,
    margin,
    contentWidth,
    get y() {
      return y;
    },
    set y(val: number) {
      y = val;
    },
    addHeader,
    addFooter,
    checkNewPage,
  };
}
