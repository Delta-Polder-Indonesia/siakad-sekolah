import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getOnlineAssignmentsByClass,
  getStudentByUser,
  getSubmissionByAssignmentAndStudent,
} from '../../data/services';
import { submitAssignmentApi } from '../../services/assignmentService';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import {
  Send,
  Loader2,
  CheckCircle2,
  FileText,
  BookOpen,
  Video,
  Paperclip,
  ListChecks,
  MessageSquare,
  Clock,
  Hourglass,
  Info,
  FolderKanban,
} from 'lucide-react';
import { FileUpload } from '../../components/ui';
import {
  TabRingkasan,
  TabBuku,
  TabVideo,
  TabLampiran,
  TabLatihan,
  DiskusiTugas,
} from '../bersama/TugasKonten';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Gagal membaca berkas dokumen.'));
    reader.readAsDataURL(file);
  });
}

// 7 Tab Menu Utama
const NAV_TABS = [
  { id: 'ringkasan', label: 'Ringkasan', icon: FileText },
  { id: 'buku', label: 'Buku', icon: BookOpen },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'lampiran', label: 'Lampiran', icon: Paperclip },
  { id: 'latihan', label: 'Latihan', icon: ListChecks },
  { id: 'kantong', label: 'Kantong Tugas', icon: FolderKanban },
  { id: 'diskusi', label: 'Diskusi', icon: MessageSquare },
];

export default function TaskPouchPage() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('ringkasan');
  const [answerText, setAnswerText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const student = useMemo(
    () => getStudentByUser(user),
    [user, storeVersion]
  );

  const assignments = useMemo(() => {
    if (!student) return [];
    return getOnlineAssignmentsByClass(student.classId);
  }, [student, storeVersion]);

  // Fallback dummy agar konten tidak kosong jika belum ada tugas di database
  const dummyTask = useMemo(
    () => ({
      id: 'dummy',
      classId: student?.classId || '',
      title: 'RINGKASAN MATERI',
      description:
        'Bab 1 membahas konsep bilangan real, urutan operasi (PEMDAS), sifat-sifat bilangan, dan penerapannya dalam masalah sehari-hari. Pahami contoh soal pada modul sebelum mengerjakan latihan.',
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      createdBy: 'Guru',
    }),
    [student]
  );

  const selectedTask = useMemo(
    () => assignments.find((item) => item.id === selectedTaskId) || assignments[0] || dummyTask,
    [assignments, selectedTaskId, dummyTask]
  );

  const existingSubmission = useMemo(() => {
    if (!student || !selectedTask || selectedTask.id === 'dummy') return null;
    return getSubmissionByAssignmentAndStudent(selectedTask.id, student.id);
  }, [selectedTask, student, storeVersion]);

  const handleSubmitAnswer = async () => {
    if (!student || !selectedTask || selectedTask.id === 'dummy' || !answerText.trim()) return;
    setIsSaving(true);
    setSaveMessage('');
    try {
      const attachmentDataUrl = selectedFile
        ? await readFileAsDataUrl(selectedFile)
        : existingSubmission?.attachmentDataUrl;
      const attachmentName = selectedFile ? selectedFile.name : existingSubmission?.attachmentName;

      await submitAssignmentApi({
        id: existingSubmission?.id || `sub_${Date.now()}`,
        assignmentId: selectedTask.id,
        studentId: student.id,
        answerText: answerText.trim(),
        attachmentName,
        attachmentDataUrl,
        submittedAt: Date.now(),
      });
      setSaveMessage('Berhasil: Jawaban tugas Anda telah tersimpan.');
      setSelectedFile(null);
    } catch (error) {
      setSaveMessage('Error: Gagal memproses berkas lampiran. Silakan coba kembali.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetAnswer = () => {
    setAnswerText('');
    setSelectedFile(null);
    setSaveMessage('');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ringkasan':
        return <TabRingkasan assignment={selectedTask} />;

      case 'buku':
        return <TabBuku assignment={selectedTask} />;

      case 'video':
        return <TabVideo assignment={selectedTask} />;

      case 'lampiran':
        return <TabLampiran assignment={selectedTask} />;

      case 'latihan':
        return <TabLatihan key={selectedTask.id} assignment={selectedTask} user={user} />;

      case 'kantong': {
        return (
          <div className="space-y-4">
            <div className="flex flex-col justify-between gap-4 border-b-2 border-black pb-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border-2 border-black bg-white px-2.5 py-0.5 text-[10px] font-bold text-black">
                    KANTONG TUGAS
                  </span>
                  {selectedTask && (
                    <span className="inline-flex items-center gap-1 text-xs text-black">
                      <Clock className="h-3.5 w-3.5" />
                      Tenggat:{' '}
                      {new Date(`${selectedTask.dueDate}T00:00:00`).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <h2 className="mt-1 text-lg font-bold text-black">
                  {selectedTask?.title || 'Pengumpulan Tugas Kuliah / Sekolah'}
                </h2>
              </div>

              {existingSubmission ? (
                <div className="flex shrink-0 items-center gap-3 rounded-md border-2 border-emerald-600 bg-white p-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                      Status Pengumpulan
                    </div>
                    <div className="text-xs font-bold text-black">
                      Sudah Terkirim ·{' '}
                      {new Date(existingSubmission.submittedAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-3 rounded-md border-2 border-amber-500 bg-white p-3">
                  <Hourglass className="h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <div className="text-[10px] font-bold tracking-wider text-amber-500 uppercase">
                      Status Pengumpulan
                    </div>
                    <div className="text-xs font-bold text-black">Belum Mengumpulkan</div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-md border-2 border-black bg-white p-3.5">
              <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-wider text-black uppercase">
                <Info className="h-3.5 w-3.5 text-black" /> Petunjuk Pengumpulan Tugas
              </h3>
              <ul className="list-inside list-disc space-y-1 text-xs font-medium text-black">
                <li>Format file berupa PDF, DOC, ZIP, atau Gambar dengan ukuran maksimal 5MB.</li>
                <li>Tuliskan deskripsi/catatan jawaban Anda pada kolom teks di bawah.</li>
                <li>Klik "Kirim Tugas" untuk menyimpan berkas tugas Anda.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-black">
                  Jawaban Teks / Catatan Tambahan
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows={3}
                  placeholder="Tuliskan lembar jawaban atau penjelasan tugas Anda di sini..."
                  className="w-full resize-none rounded-md border-2 border-black bg-white px-3 py-2 text-xs font-medium text-black transition-colors outline-none placeholder:text-black/40 focus:border-black focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <FileUpload
                  label="Lampiran Dokumen Tugas"
                  accept="image/*,.pdf,.doc,.docx,.zip"
                  maxSize={5 * 1024 * 1024}
                  files={selectedFile ? [{ file: selectedFile }] : []}
                  onChange={(files) => setSelectedFile(files[0]?.file || null)}
                  helperText={
                    existingSubmission?.attachmentName
                      ? `Sebelumnya: ${existingSubmission.attachmentName}. Unggah file baru untuk mengganti.`
                      : 'Format: PDF, DOC, ZIP, atau gambar (Maksimal 5MB).'
                  }
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 border-t-2 border-black pt-3">
                <button
                  type="button"
                  onClick={handleResetAnswer}
                  className="rounded-md border-2 border-black bg-white px-4 py-1.5 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isSaving || !answerText.trim()}
                  className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-white px-6 py-1.5 text-xs font-bold text-black transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-100 disabled:text-black"
                >
                  {isSaving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span>{isSaving ? 'Menyimpan...' : 'Kirim Tugas'}</span>
                </button>
              </div>

              {saveMessage && (
                <p className="text-right text-xs font-semibold text-black">{saveMessage}</p>
              )}
            </div>
          </div>
        );
      }

      case 'diskusi':
        return (
          <DiskusiTugas
            key={selectedTask.id}
            assignment={selectedTask}
            user={user}
            variant="full"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] bg-white p-3 text-black antialiased">
      {/* MENU TAB - BINGKAI BERUBAH BLUE-600 SAAT AKTIF */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 rounded-md border-2 bg-white px-3 py-2 text-xs font-bold text-black transition-all ${
                isActive ? 'border-black bg-neutral-200 text-black' : 'border-black bg-white hover:bg-neutral-100'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 text-black" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* AREA KONTEN AKTIF */}
      <div className="min-h-[300px]">{renderTabContent()}</div>
    </div>
  );
}
