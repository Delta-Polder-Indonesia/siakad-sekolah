/**
 * Safe print utilities — mengganti `document.write()` (XSS risk) dengan
 * blob URL + `window.print()`, serta `escapeHtml()` untuk semua data
 * pengguna yang disisipkan ke HTML print.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ENTITY_MAP[ch]);
}

interface PrintOptions {
  title?: string;
  width?: string;
  height?: string;
}

/**
 * Membuka jendela print baru dengan aman memakai blob URL (bukan
 * `document.write`). Konten HTML langsung dicetak otomatis saat load.
 *
 * @param html  dokumen HTML lengkap yang akan ditampilkan
 * @param opts  opsional: title, width, height
 */
export function printViaBlob(html: string, opts: PrintOptions = {}): void {
  const { title = 'Print', width = 'width=1200', height = 'height=800' } = opts;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(
    url,
    '_blank',
    `${width},${height},scrollbars=yes,resizable=yes`
  );

  if (!printWindow) {
    URL.revokeObjectURL(url);
    return;
  }

  printWindow.onload = () => {
    if (!printWindow.closed) {
      printWindow.print();
      printWindow.close();
    }
    URL.revokeObjectURL(url);
  };
}
