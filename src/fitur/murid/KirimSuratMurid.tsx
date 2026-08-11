import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addSuratIzin, getClasses, getStudentByUser, getSuratIzinByStudent } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Send, Loader2, FileText, Calendar } from 'lucide-react';
import { FileUpload } from '../../components/ui';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Gagal memproses unggahan file.'));
    reader.readAsDataURL(file);
  });
}

export default function KirimSuratMurid() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [type, setType] = useState<'izin' | 'sakit' | 'dispensasi' | 'lainnya'>('izin');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const student = useMemo(
    () => getStudentByUser(user),
    [user, storeVersion]
  );

  const className = useMemo(() => {
    if (!student) return '-';
    return getClasses().find((item) => item.id === student.classId)?.name || '-';
  }, [student, storeVersion]);

  const riwayatSurat = useMemo(() => {
    if (!student) return [];
    return [...getSuratIzinByStudent(student.id)].sort((a, b) => b.createdAt - a.createdAt);
  }, [student, storeVersion]);

  const handleSubmit = async () => {
    if (!user || !student || !subject.trim() || !message.trim()) {
      setFeedback('Error: Judul perihal dan isi surat wajib diisi.');
      return;
    }

    if (attachment && attachment.size > 2 * 1024 * 1024) {
      setFeedback('Error: Ukuran file lampiran tidak boleh melebihi 2MB.');
      return;
    }

    setIsSaving(true);
    setFeedback('');
    try {
      const attachmentDataUrl = attachment ? await readFileAsDataUrl(attachment) : undefined;
      addSuratIzin({
        id: `ltr_${Date.now()}`,
        studentId: student.id,
        classId: student.classId,
        type,
        status: 'menunggu',
        subject: subject.trim(),
        message: message.trim(),
        letterDate,
        attachmentName: attachment?.name,
        attachmentDataUrl,
        createdAt: Date.now(),
      });
      setFeedback('Berhasil: Surat permohonan izin Anda telah dikirim.');
      setSubject('');
      setMessage('');
      setAttachment(null);
    } catch {
      setFeedback('Error: Terjadi kesalahan. Silakan coba kirim kembali.');
    } finally {
      setIsSaving(false);
    }
  };

  const typeLabel: Record<string, string> = {
    izin: 'Izin',
    sakit: 'Sakit',
    dispensasi: 'Dispensasi',
    lainnya: 'Keperluan Lain',
  };

  const statusLabel = {
    menunggu: 'Menunggu Persetujuan',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
  } as const;

  const statusStyle = {
    menunggu: 'text-black bg-white border-2 border-black',
    disetujui: 'text-black bg-white border-2 border-black',
    ditolak: 'text-white bg-black border-2 border-black',
  } as const;

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-2 text-black antialiased selection:bg-blue-600 selection:text-white">
      {/* HEADER HALAMAN */}
      <header className="border-b-2 border-black pb-3">
        <h1 className="text-lg leading-none font-bold tracking-wide text-black uppercase">
          Perizinan & Absensi
        </h1>
        <p className="mt-1 text-xs leading-none font-semibold text-black">
          Ajukan surat izin berhalangan hadir atau pantau status persetujuan dari wali kelas.
        </p>
      </header>

      {/* WORKSPACE GRID */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* FORM PENGAJUAN (Kiri) */}
        <section className="space-y-4 lg:col-span-5">
          <div className="border-b-2 border-black pb-1.5">
            <h2 className="text-xs font-bold tracking-wide text-black uppercase">
              Formulir Pengajuan
            </h2>
          </div>

          {/* Informasi Identitas */}
          <div className="grid grid-cols-3 gap-3 rounded-md border-2 border-black bg-white p-3">
            <div>
              <span className="mb-0.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                Nama Siswa
              </span>
              <span className="block truncate text-xs font-semibold text-black">
                {student?.name || '-'}
              </span>
            </div>
            <div>
              <span className="mb-0.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                NIS
              </span>
              <span className="block font-mono text-xs font-semibold text-black">
                {student?.nis || '-'}
              </span>
            </div>
            <div>
              <span className="mb-0.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                Kelas
              </span>
              <span className="block font-mono text-xs font-semibold text-black">{className}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold tracking-wide text-black uppercase">
                Tanggal Izin
              </label>
              <input
                type="date"
                value={letterDate}
                onChange={(event) => setLetterDate(event.target.value)}
                className="w-full rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold tracking-wide text-black uppercase">
                Kategori Izin
              </label>
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as 'izin' | 'sakit' | 'dispensasi' | 'lainnya')
                }
                className="w-full appearance-none rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors outline-none focus:border-black"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1em',
                }}
              >
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="dispensasi">Dispensasi</option>
                <option value="lainnya">Urusan Keluarga / Lainnya</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold tracking-wide text-black uppercase">
              Perihal / Alasan Utama
            </label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Contoh: Surat keterangan sakit dari dokter klinik"
              className="w-full rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/50 focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold tracking-wide text-black uppercase">
              Isi Surat / Penjelasan Detail
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tuliskan alasan ketidakhadiran Anda secara ringkas dan jelas di sini..."
              className="w-full resize-none rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs leading-relaxed font-bold text-black transition-colors outline-none placeholder:text-black/50 focus:border-black"
            />
          </div>

          <div>
            <FileUpload
              label="Unggah Bukti Pendukung (PDF/Foto max 2MB)"
              accept="image/*,.pdf"
              maxSize={2 * 1024 * 1024}
              files={attachment ? [{ file: attachment }] : []}
              onChange={(files) => setAttachment(files[0]?.file || null)}
              helperText="Format: JPG, PNG, atau PDF. Maksimal 2MB."
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t-2 border-black pt-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-black disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>{isSaving ? 'Mengirim Surat...' : 'Kirim Surat'}</span>
            </button>

            {feedback && (
              <p
                className={`font-mono text-xs font-bold ${
                  feedback.startsWith('Berhasil') ? 'text-black' : 'text-black'
                }`}
              >
                {feedback}
              </p>
            )}
          </div>
        </section>

        {/* LOG RIWAYAT SURAT (Kanan) */}
        <section className="flex flex-col space-y-3 lg:col-span-7">
          <div className="border-b-2 border-black pb-1.5">
            <h2 className="text-xs font-bold tracking-wide text-black uppercase">
              Riwayat Pengajuan
            </h2>
          </div>

          <div className="scrollbar-thin max-h-[580px] space-y-3 overflow-y-auto pr-1">
            {riwayatSurat.map((item) => (
              <div key={item.id} className="relative rounded-md border-2 border-black bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <h3 className="truncate text-xs leading-tight font-bold text-black">
                      {item.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-black">
                      <span className="rounded border-2 border-black bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase">
                        {typeLabel[item.type]}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3 text-black" />
                        <span>
                          Izin:{' '}
                          {new Date(`${item.letterDate}T00:00:00`).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </span>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${statusStyle[item.status]}`}
                  >
                    {statusLabel[item.status]}
                  </span>
                </div>

                <p className="mt-2.5 border-t-2 border-black/10 pt-2 text-xs leading-relaxed font-semibold whitespace-pre-line text-black">
                  {item.message}
                </p>

                <div className="mt-3 flex items-center justify-between border-t-2 border-black/10 pt-2 font-mono text-[10px] font-bold text-black">
                  <span className="flex max-w-[60%] items-center gap-1">
                    <FileText className="h-3 w-3 shrink-0 text-black" />
                    <span className="truncate">{item.attachmentName || 'Tanpa lampiran'}</span>
                  </span>
                  <span className="shrink-0">
                    Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            ))}

            {riwayatSurat.length === 0 && (
              <div className="rounded-md border-2 border-dashed border-black bg-white py-10 text-center">
                <p className="text-xs font-bold tracking-widest text-black uppercase">
                  — Belum ada riwayat pengajuan —
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
