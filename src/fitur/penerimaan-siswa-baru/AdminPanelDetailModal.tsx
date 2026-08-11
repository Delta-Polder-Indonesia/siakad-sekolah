/**
 * Modal detail pendaftar PPDB: biodata, validasi dokumen, catatan admin,
 * aksi verifikasi/terima/tolak/hapus. Dipecah dari AdminPanel.tsx.
 */
import { Check, X, FileText, Trash2 } from 'lucide-react';
import type { PPDBApplication, PPDBApplicationStatus } from '../../data/services';
import { formatDate } from './AdminPanel.types';

export interface AdminPanelDetailModalProps {
  app: PPDBApplication;
  adminNotesInput: string;
  onNotesChange: (notes: string) => void;
  onClose: () => void;
  onUpdateStatus: (status: PPDBApplicationStatus) => void;
  onUpdateDoc: (docKey: string, status: 'PENDING' | 'VALID' | 'INVALID') => void;
  onPrint: () => void;
  onRequestDelete: () => void;
}

export default function AdminPanelDetailModal(props: AdminPanelDetailModalProps) {
  const {
    app,
    adminNotesInput,
    onNotesChange,
    onClose,
    onUpdateStatus,
    onUpdateDoc,
    onPrint,
    onRequestDelete,
  } = props;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-100/80 p-4">
      <div className="mx-auto mt-4 w-full max-w-4xl rounded-xl border border-black bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black px-5 py-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">
              Detail Pendaftar
            </p>
            <h2 className="text-base font-bold text-black">{app.namaLengkap}</h2>
            <p className="font-mono text-[10px] text-black">{app.registrationNo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-black p-1 text-black transition-colors hover:bg-black hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-5 px-5 py-4 md:grid-cols-2">
          <div className="space-y-2 text-xs">
            <p className="border-b border-black pb-1 text-[10px] font-bold tracking-wide text-black uppercase">
              Biodata Siswa
            </p>
            <p className="text-black">NIK: {app.nik}</p>
            <p className="text-black">NISN: {app.nisn || '-'}</p>
            <p className="text-black">Tempat Lahir: {app.tempatLahir}</p>
            <p className="text-black">Tanggal Lahir: {app.tanggalLahir}</p>
            <p className="text-black">
              Jenis Kelamin: {app.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
            </p>
            <p className="text-black">Agama: {app.agama}</p>
            <p className="text-black">Kewarganegaraan: {app.kewenangnegaraan}</p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="border-b border-black pb-1 text-[10px] font-bold tracking-wide text-black uppercase">
              Data Pendaftaran
            </p>
            <p className="text-black">Jenjang: {app.jenjangTujuan}</p>
            <p className="text-black">Sekolah Tujuan: {app.sekolahTujuan || '-'}</p>
            <p className="text-black">Jalur: {app.jalurPendaftaran}</p>
            <p className="text-black">Sekolah Asal: {app.sekolahAsal}</p>
            <p className="text-black">Nomor HP: {app.nomorHp}</p>
            <p className="text-black">Email: {app.email}</p>
          </div>

          <div className="space-y-2 text-xs md:col-span-2">
            <p className="border-b border-black pb-1 text-[10px] font-bold tracking-wide text-black uppercase">
              Alamat & Orang Tua
            </p>
            <p className="text-black">
              {app.alamatLengkap}, {app.desaKelurahan || ''}, {app.kecamatan || ''},{' '}
              {app.kabupatenKota || ''}
            </p>
            <p className="text-black">
              Ayah: {app.namaAyah} | Ibu: {app.namaIbu} | Wali: {app.namaWali || '-'}
            </p>
            <p className="text-[10px] text-black">Didaftarkan: {formatDate(app.submittedAt)}</p>
            {app.adminNotes && (
              <p className="text-[10px] text-black">Catatan Admin: {app.adminNotes}</p>
            )}
          </div>

          <div className="space-y-2 text-xs md:col-span-2">
            <p className="border-b border-black pb-1 text-[10px] font-bold tracking-wide text-black uppercase">
              Validasi Dokumen
            </p>
            <div className="space-y-1.5">
              {Object.entries(app.documentValidation || {}).map(([key, status]) => (
                <div
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-black p-2"
                >
                  <p className="text-xs font-bold text-black">{key.toUpperCase()}</p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateDoc(key, 'VALID')}
                      className={`rounded border px-2 py-1 text-[10px] font-bold transition-colors ${
                        status === 'VALID'
                          ? 'border-black bg-black text-white'
                          : 'border-black text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      Valid
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateDoc(key, 'INVALID')}
                      className={`rounded border px-2 py-1 text-[10px] font-bold transition-colors ${
                        status === 'INVALID'
                          ? 'border-black bg-neutral-200 text-black'
                          : 'border-black text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      Tidak Valid
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateDoc(key, 'PENDING')}
                      className={`rounded border px-2 py-1 text-[10px] font-bold transition-colors ${
                        status === 'PENDING'
                          ? 'border-black bg-neutral-100 text-black'
                          : 'border-black text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      Pending
                    </button>
                  </div>
                </div>
              ))}
              {Object.keys(app.documentValidation || {}).length === 0 && (
                <p className="text-[10px] text-black">— Tidak ada dokumen —</p>
              )}
            </div>
          </div>

          <div className="space-y-2 text-xs md:col-span-2">
            <p className="border-b border-black pb-1 text-[10px] font-bold tracking-wide text-black uppercase">
              Catatan Admin
            </p>
            <textarea
              value={adminNotesInput}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Tambahkan catatan verifikasi untuk arsip internal..."
              rows={3}
              className="w-full resize-none rounded-md border border-black bg-white px-3 py-2 text-xs leading-relaxed text-black outline-none placeholder:text-neutral-400"
            />
            {app.adminNotes && (
              <p className="text-[10px] text-black">
                Catatan tersimpan: <span className="font-bold">{app.adminNotes}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black px-5 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateStatus('VERIFIED')}
              className="inline-flex items-center gap-1 rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
            >
              <Check className="h-3.5 w-3.5" /> Verifikasi
            </button>
            <button
              type="button"
              onClick={() => onUpdateStatus('ACCEPTED')}
              className="inline-flex items-center gap-1 rounded-md border border-black bg-black px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-neutral-800"
            >
              <Check className="h-3.5 w-3.5" /> Terima
            </button>
            <button
              type="button"
              onClick={() => onUpdateStatus('REJECTED')}
              className="inline-flex items-center gap-1 rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
            >
              <X className="h-3.5 w-3.5" /> Tolak
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1 rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
            >
              <FileText className="h-3.5 w-3.5" /> Print PDF
            </button>
            <button
              type="button"
              onClick={onRequestDelete}
              className="inline-flex items-center gap-1 rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" /> Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
