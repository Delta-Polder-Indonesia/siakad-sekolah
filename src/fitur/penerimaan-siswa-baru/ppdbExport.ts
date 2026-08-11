/**
 * Ekspor & cetak data PPDB — dipisah dari AdminPanel.tsx agar bisa diuji unit.
 */
import type { PPDBApplication } from '../../data/services';
import { escapeHtml, printViaBlob } from '../../utils/print';
import { statusText, formatDate, type AdminPanelStats } from './AdminPanel.types';

/** Unduh array data sebagai file JSON (download browser). */
export function downloadJsonFile(data: unknown, filename: string): void {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Ekspor daftar pendaftar (hasil filter) ke CSV. */
export function exportPpdbCsv(rows: PPDBApplication[]): void {
  const headers = [
    'No Registrasi',
    'Nama',
    'NIK',
    'Jenjang',
    'Sekolah Tujuan',
    'Jalur',
    'Status',
    'Tanggal Daftar',
    'Nomor HP',
    'Email',
  ];
  const csvRows = rows.map((item) => [
    item.registrationNo,
    item.namaLengkap,
    item.nik,
    item.jenjangTujuan,
    item.sekolahTujuan || '',
    item.jalurPendaftaran,
    statusText(item.status),
    new Date(item.submittedAt).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    item.nomorHp,
    item.email,
  ]);
  const csv = [headers, ...csvRows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `rekap-ppdb-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Cetak detail pendaftar ke PDF (jsPDF). */
export async function printDetailPdf(app: PPDBApplication): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFontSize(16);
  doc.text('DETAIL PENDAFTARAN PPDB', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text('No. Registrasi', 20, 32);
  doc.setFont('Helvetica', 'bold');
  doc.text(app.registrationNo, 70, 32);
  doc.setFont('Helvetica', 'normal');
  const dataRows: Array<[string, string | null | undefined]> = [
    ['Nama Lengkap', app.namaLengkap],
    ['NISN', app.nisn],
    ['NIK', app.nik],
    ['Tempat, Tanggal Lahir', `${app.tempatLahir}, ${app.tanggalLahir}`],
    ['Jenis Kelamin', app.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'],
    ['Agama', app.agama],
    ['Kewarganegaraan', app.kewenangnegaraan],
    ['Jenjang Tujuan', app.jenjangTujuan],
    ['Jalur Pendaftaran', app.jalurPendaftaran],
    ['Asal Sekolah', app.sekolahAsal],
    ['Nama Ayah', app.namaAyah],
    ['Nama Ibu', app.namaIbu],
    ['Nama Wali', app.namaWali],
    ['No. HP', app.nomorHp],
    ['Alamat', app.alamatLengkap],
  ];
  let y = 40;
  dataRows.forEach(([label, value]) => {
    doc.text(String(label ?? ''), 20, y);
    doc.text(`: ${String(value ?? '-')}`, 70, y);
    y += 6;
  });
  y += 4;
  doc.text('Status Pendaftaran', 20, y);
  doc.setFont('Helvetica', 'bold');
  doc.text(`: ${statusText(app.status)}`, 70, y);
  y += 8;
  doc.setFont('Helvetica', 'normal');
  doc.text('Dokumen', 20, y);
  y += 5;
  const docStatuses = Object.entries(app.documentValidation || {}).map(
    ([key, status]) => `${key}: ${status}`
  );
  docStatuses.forEach((d) => {
    doc.text(`- ${d}`, 24, y);
    y += 5;
  });
  if (app.adminNotes) {
    y += 4;
    doc.text('Catatan Admin', 20, y);
    y += 5;
    doc.text(app.adminNotes, 24, y, { maxWidth: 170 });
  }
  doc.save(`detail-${app.registrationNo}.pdf`);
}

/** Cetak rekap pendaftar (hasil filter) ke HTML → print browser. */
export function printRecap(filtered: PPDBApplication[], stats: AdminPanelStats): void {
  const rows = filtered
    .map(
      (item, idx) => `
        <tr>
          <td>${idx + 1}</td><td>${escapeHtml(item.registrationNo)}</td><td>${escapeHtml(item.namaLengkap)}</td>
          <td>${escapeHtml(item.nik)}</td><td>${escapeHtml(item.jenjangTujuan)}</td><td>${escapeHtml(item.jalurPendaftaran)}</td>
          <td>${escapeHtml(statusText(item.status))}</td>
          <td>${escapeHtml(
            new Date(item.submittedAt).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          )}</td>
        </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html><html><head><title>Rekap PPDB</title><style>body{font-family:Arial,sans-serif;margin:24px;color:#000}h1{margin:0 0 6px;font-size:22px}p{margin:0 0 12px;color:#666;font-size:12px}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0}.meta div{border:1px solid #ccc;padding:8px;font-size:12px}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:11px}th,td{border:1px solid #ccc;padding:6px;text-align:left}th{background:#f5f5f5}</style></head><body><h1>Rekap Data Pendaftar PPDB</h1><p>Dicetak pada: ${escapeHtml(
    new Date().toLocaleString('id-ID')
  )}</p><div class="meta"><div>Total Data: <strong>${filtered.length}</strong></div><div>Menunggu: <strong>${
    stats.pending
  }</strong></div><div>Diterima: <strong>${stats.accepted}</strong></div></div><table><thead><tr><th>No</th><th>No Registrasi</th><th>Nama</th><th>NIK</th><th>Jenjang</th><th>Jalur</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>${
    rows || '<tr><td colspan="8">Tidak ada data</td></tr>'
  }</tbody></table></body></html>`;

  printViaBlob(html, { width: 'width=1200', height: 'height=800' });
}

export { formatDate };
