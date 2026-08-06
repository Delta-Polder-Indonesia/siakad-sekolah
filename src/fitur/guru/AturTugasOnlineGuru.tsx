import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  addOnlineAssignment,
  updateOnlineAssignment,
  deleteOnlineAssignment,
  getClasses,
  getOnlineAssignmentsByClass,
  getTeachers,
} from '../../data/services';
import type {
  AssignmentAttachment,
  AssignmentBook,
  AssignmentExercise,
  AssignmentVideo,
  OnlineAssignment,
} from '../../data/services';
import {
  Plus,
  Trash2,
  ClipboardList,
  Inbox,
  BookOpen,
  Video,
  Paperclip,
  ListChecks,
  FileText,
  CircleDot,
  PlusCircle,
  Pencil,
  X,
} from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { FileUpload, type FileUploadFile } from '../../components/ui';
import { bacaFileSebagaiDataUrl } from '../../utils/gambar';
import type { AuthUser } from '../../types';
import { DiskusiTugas } from '../bersama/TugasKonten';

// Tab Menu Utama — gaya horizontal seperti halaman Kantong Tugas murid
const TEACHER_TABS = [
  { id: 'informasi', label: 'Informasi Tugas', icon: ClipboardList },
  { id: 'ringkasan', label: 'Ringkasan', icon: FileText },
  { id: 'buku', label: 'Buku', icon: BookOpen },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'lampiran', label: 'Lampiran', icon: Paperclip },
  { id: 'latihan', label: 'Latihan', icon: ListChecks },
  { id: 'feed', label: 'Feed Tugas', icon: Inbox },
];

export default function AturTugasOnlineGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [activeTab, setActiveTab] = useState<string>('informasi');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [summary, setSummary] = useState('');
  const [books, setBooks] = useState<AssignmentBook[]>([]);
  const [videos, setVideos] = useState<AssignmentVideo[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<FileUploadFile[]>([]);
  const [exercises, setExercises] = useState<AssignmentExercise[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [existingAttachments, setExistingAttachments] = useState<AssignmentAttachment[]>([]);
  const [selectedFeedAssignmentId, setSelectedFeedAssignmentId] = useState<string>('');

  // Sinkronisasi data manifest kelas binaan guru
  const teacherClasses = useMemo(() => {
    const teacher = getTeachers().find((item) => item.id === user?.id);
    return getClasses().filter((item) => teacher?.classIds.includes(item.id));
  }, [user, storeVersion]);

  useEffect(() => {
    if (!selectedClassId && teacherClasses.length > 0) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses, selectedClassId]);

  const classAssignments = useMemo(
    () => (selectedClassId ? getOnlineAssignmentsByClass(selectedClassId) : []),
    [selectedClassId, storeVersion]
  );

  // Auto-pilih tugas pertama untuk kelas aktif di panel Feed Tugas.
  useEffect(() => {
    if (!classAssignments.some((a) => a.id === selectedFeedAssignmentId)) {
      setSelectedFeedAssignmentId(classAssignments[0]?.id ?? '');
    }
  }, [classAssignments, selectedFeedAssignmentId]);

  // ============ HELPER: Buku ============
  const addBook = () => setBooks((prev) => [...prev, { title: '', author: '' }]);
  const updateBook = (index: number, patch: Partial<AssignmentBook>) =>
    setBooks((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  const removeBook = (index: number) => setBooks((prev) => prev.filter((_, i) => i !== index));

  // ============ HELPER: Video ============
  const addVideo = () => setVideos((prev) => [...prev, { title: '', url: '' }]);
  const updateVideo = (index: number, patch: Partial<AssignmentVideo>) =>
    setVideos((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  const removeVideo = (index: number) => setVideos((prev) => prev.filter((_, i) => i !== index));

  // ============ HELPER: Latihan ============
  const addExercise = () =>
    setExercises((prev) => [...prev, { question: '', options: ['', ''], correctIndex: 0 }]);
  const updateExercise = (index: number, patch: Partial<AssignmentExercise>) =>
    setExercises((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  const removeExercise = (index: number) =>
    setExercises((prev) => prev.filter((_, i) => i !== index));
  const updateOption = (eIndex: number, oIndex: number, value: string) =>
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== eIndex ? ex : { ...ex, options: ex.options.map((o, j) => (j === oIndex ? value : o)) }
      )
    );
  const addOption = (eIndex: number) =>
    setExercises((prev) =>
      prev.map((ex, i) => (i !== eIndex ? ex : { ...ex, options: [...ex.options, ''] }))
    );
  const removeOption = (eIndex: number, oIndex: number) =>
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== eIndex) return ex;
        const options = ex.options.filter((_, j) => j !== oIndex);
        const correctIndex = Math.min(ex.correctIndex, Math.max(0, options.length - 1));
        return { ...ex, options, correctIndex };
      })
    );

  const resetDraft = () => {
    setAssignmentTitle('');
    setAssignmentDescription('');
    setSummary('');
    setBooks([]);
    setVideos([]);
    setAttachmentFiles([]);
    setExercises([]);
    setExistingAttachments([]);
    setEditingAssignmentId(null);
  };

  const handleEditAssignment = (item: OnlineAssignment) => {
    setAssignmentTitle(item.title);
    setAssignmentDescription(item.description);
    setAssignmentDueDate(item.dueDate);
    setSummary(item.summary || '');
    setBooks(item.books ? item.books.map((b) => ({ ...b })) : []);
    setVideos(item.videos ? item.videos.map((v) => ({ ...v })) : []);
    setExercises(
      item.exercises
        ? item.exercises.map((e) => ({
            question: e.question,
            options: [...e.options],
            correctIndex: e.correctIndex,
          }))
        : []
    );
    setExistingAttachments(item.attachments ? item.attachments.map((a) => ({ ...a })) : []);
    setAttachmentFiles([]);
    setEditingAssignmentId(item.id);
    setActiveTab('informasi');
  };

  const cancelEdit = () => {
    resetDraft();
  };

  const handleAddAssignment = async () => {
    if (
      !selectedClassId ||
      !assignmentTitle.trim() ||
      !assignmentDescription.trim() ||
      !assignmentDueDate ||
      !user
    )
      return;
    setIsPublishing(true);
    try {
      const newAttachments = await Promise.all(
        attachmentFiles.map(async (entry) => ({
          name: entry.file.name,
          dataUrl: entry.dataUrl || (await bacaFileSebagaiDataUrl(entry.file)),
          size: entry.file.size,
        }))
      );
      const payload: OnlineAssignment = {
        id: editingAssignmentId ?? `task_${Date.now()}`,
        classId: selectedClassId,
        title: assignmentTitle.trim(),
        description: assignmentDescription.trim(),
        dueDate: assignmentDueDate,
        createdBy: user.id,
        createdAt: editingAssignmentId
          ? (classAssignments.find((item) => item.id === editingAssignmentId)?.createdAt ??
            Date.now())
          : Date.now(),
        summary: summary.trim() || undefined,
        books: books.filter((b) => b.title.trim()).map((b) => ({ ...b, title: b.title.trim() })),
        videos: videos
          .filter((v) => v.title.trim() && v.url.trim())
          .map((v) => ({ ...v, title: v.title.trim(), url: v.url.trim() })),
        attachments: [...existingAttachments, ...newAttachments],
        exercises: exercises
          .filter((e) => e.question.trim() && e.options.filter((o) => o.trim()).length >= 2)
          .map((e) => ({
            question: e.question.trim(),
            options: e.options.map((o) => o.trim()),
            correctIndex: e.correctIndex,
          })),
      };
      if (editingAssignmentId) {
        updateOnlineAssignment(payload);
      } else {
        addOnlineAssignment(payload);
      }
      resetDraft();
    } catch {
      // Gagal memproses lampiran — form tetap diisi agar user bisa ulangi
    } finally {
      setIsPublishing(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'informasi':
        return (
          <section className="space-y-3 rounded-md border-2 border-black p-3">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
              <ClipboardList className="h-4 w-4 text-black" />
              <span>Informasi Penugasan</span>
            </div>

            {/* Judul */}
            <div className="space-y-1">
              <label
                htmlFor="input-judul-tugas"
                className="block text-xs font-bold tracking-wide text-black uppercase"
              >
                Judul Penugasan
              </label>
              <input
                id="input-judul-tugas"
                type="text"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                placeholder="Ketik nama atau topik penugasan formal..."
                className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
              />
            </div>

            {/* Instruksi */}
            <div className="space-y-1">
              <label
                htmlFor="textarea-instruksi"
                className="block text-xs font-bold tracking-wide text-black uppercase"
              >
                Instruksi / Deskripsi Parameter
              </label>
              <textarea
                id="textarea-instruksi"
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
                placeholder="Tulis instruksi langkah pengerjaan tugas atau butir soal di sini..."
                rows={4}
                className="w-full resize-none rounded-md border-2 border-black bg-white px-2.5 py-2 text-xs leading-relaxed font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
              />
            </div>

            {/* Due date */}
            <div className="space-y-1">
              <label
                htmlFor="input-due-date"
                className="block text-xs font-bold tracking-wide text-black uppercase"
              >
                Batas Akhir Pengumpulan (Due Date)
              </label>
              <input
                id="input-due-date"
                type="date"
                value={assignmentDueDate}
                onChange={(e) => setAssignmentDueDate(e.target.value)}
                className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black outline-none focus:border-blue-600"
              />
            </div>
          </section>
        );

      case 'ringkasan':
        return (
          <section className="space-y-2 rounded-md border-2 border-black p-3">
            <div className="flex items-center gap-1.5 border-b-2 border-black pb-1.5 text-[10px] font-bold tracking-wider text-black uppercase">
              <FileText className="h-3.5 w-3.5" />
              <span>Ringkasan Materi</span>
            </div>
            <textarea
              id="textarea-ringkasan"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Rangkuman inti materi: tujuan pembelajaran, poin penting, glosarium..."
              rows={8}
              className="w-full resize-none rounded-md border-2 border-black bg-white px-2.5 py-2 text-xs leading-relaxed font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
            />
          </section>
        );

      case 'buku':
        return (
          <section className="space-y-2 rounded-md border-2 border-black p-3">
            <div className="flex items-center justify-between border-b-2 border-black pb-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-black uppercase">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Buku / Referensi ({books.length})</span>
              </div>
              <button
                type="button"
                onClick={addBook}
                className="inline-flex cursor-pointer items-center gap-0.5 rounded-md border-2 border-blue-600 bg-white px-1.5 py-0.5 text-[10px] font-bold text-blue-700 transition-colors hover:bg-blue-50"
              >
                <Plus className="h-3 w-3" /> Tambah
              </button>
            </div>
            {books.length === 0 && (
              <p className="text-[10px] font-bold text-black italic">Belum ada referensi buku.</p>
            )}
            {books.map((book, bIndex) => (
              <div key={bIndex} className="space-y-1 rounded-md border-2 border-black/40 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                    Buku #{bIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBook(bIndex)}
                    className="cursor-pointer rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:border-red-600 hover:text-red-600"
                    title="Hapus buku"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <input
                  value={book.title}
                  onChange={(e) => updateBook(bIndex, { title: e.target.value })}
                  placeholder="Judul buku"
                  className="w-full rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
                />
                <input
                  value={book.author}
                  onChange={(e) => updateBook(bIndex, { author: e.target.value })}
                  placeholder="Pengarang"
                  className="w-full rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
                />
                <div className="flex gap-1.5">
                  <input
                    value={book.year || ''}
                    onChange={(e) => updateBook(bIndex, { year: e.target.value })}
                    placeholder="Tahun"
                    className="w-20 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
                  />
                  <input
                    value={book.link || ''}
                    onChange={(e) => updateBook(bIndex, { link: e.target.value })}
                    placeholder="Tautan URL (opsional)"
                    className="min-w-0 flex-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
                  />
                </div>
              </div>
            ))}
          </section>
        );

      case 'video':
        return (
          <section className="space-y-2 rounded-md border-2 border-black p-3">
            <div className="flex items-center justify-between border-b-2 border-black pb-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-black uppercase">
                <Video className="h-3.5 w-3.5" />
                <span>Video Pembelajaran ({videos.length})</span>
              </div>
              <button
                type="button"
                onClick={addVideo}
                className="inline-flex cursor-pointer items-center gap-0.5 rounded-md border-2 border-blue-600 bg-white px-1.5 py-0.5 text-[10px] font-bold text-blue-700 transition-colors hover:bg-blue-50"
              >
                <Plus className="h-3 w-3" /> Tambah
              </button>
            </div>
            {videos.length === 0 && (
              <p className="text-[10px] font-bold text-black italic">
                Belum ada video pembelajaran.
              </p>
            )}
            {videos.map((video, vIndex) => (
              <div key={vIndex} className="space-y-1 rounded-md border-2 border-black/40 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                    Video #{vIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVideo(vIndex)}
                    className="cursor-pointer rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:border-red-600 hover:text-red-600"
                    title="Hapus video"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <input
                  value={video.title}
                  onChange={(e) => updateVideo(vIndex, { title: e.target.value })}
                  placeholder="Judul video"
                  className="w-full rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
                />
                <input
                  value={video.url}
                  onChange={(e) => updateVideo(vIndex, { url: e.target.value })}
                  placeholder="URL YouTube (contoh: https://youtube.com/watch?v=...)"
                  className="w-full rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
                />
                <input
                  value={video.description || ''}
                  onChange={(e) => updateVideo(vIndex, { description: e.target.value })}
                  placeholder="Deskripsi singkat (opsional)"
                  className="w-full rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
                />
              </div>
            ))}
          </section>
        );

      case 'lampiran':
        return (
          <section className="space-y-2 rounded-md border-2 border-black p-3">
            <div className="flex items-center gap-1.5 border-b-2 border-black pb-1.5 text-[10px] font-bold tracking-wider text-black uppercase">
              <Paperclip className="h-3.5 w-3.5" />
              <span>Lampiran Materi ({existingAttachments.length + attachmentFiles.length})</span>
            </div>
            {existingAttachments.length > 0 && (
              <div className="space-y-1">
                {existingAttachments.map((attachment, aIndex) => (
                  <div
                    key={aIndex}
                    className="flex items-center justify-between gap-2 rounded-md border-2 border-black/40 bg-white px-2 py-1"
                  >
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Paperclip className="h-3 w-3 shrink-0 text-black" />
                      <span className="truncate text-[10px] font-bold text-black">
                        {attachment.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setExistingAttachments((prev) => prev.filter((_, i) => i !== aIndex))
                      }
                      className="shrink-0 cursor-pointer rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:border-red-600 hover:text-red-600"
                      title="Hapus lampiran"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <FileUpload
              label={existingAttachments.length > 0 ? 'Tambah Lampiran Baru' : ''}
              accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.zip"
              maxSize={5 * 1024 * 1024}
              multiple
              files={attachmentFiles}
              onChange={setAttachmentFiles}
              helperText="File pendukung materi: PDF, PPT, DOC, gambar, atau ZIP. Maksimal 5MB per file."
            />
          </section>
        );

      case 'latihan':
        return (
          <section className="space-y-2 rounded-md border-2 border-black p-3">
            <div className="flex items-center justify-between border-b-2 border-black pb-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-black uppercase">
                <ListChecks className="h-3.5 w-3.5" />
                <span>Latihan / Kuis ({exercises.length})</span>
              </div>
              <button
                type="button"
                onClick={addExercise}
                className="inline-flex cursor-pointer items-center gap-0.5 rounded-md border-2 border-blue-600 bg-white px-1.5 py-0.5 text-[10px] font-bold text-blue-700 transition-colors hover:bg-blue-50"
              >
                <Plus className="h-3 w-3" /> Tambah Soal
              </button>
            </div>
            {exercises.length === 0 && (
              <p className="text-[10px] font-bold text-black italic">Belum ada soal latihan.</p>
            )}
            {exercises.map((exercise, eIndex) => (
              <div key={eIndex} className="space-y-1.5 rounded-md border-2 border-black/40 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                    Soal #{eIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExercise(eIndex)}
                    className="cursor-pointer rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:border-red-600 hover:text-red-600"
                    title="Hapus soal"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <textarea
                  value={exercise.question}
                  onChange={(e) => updateExercise(eIndex, { question: e.target.value })}
                  placeholder="Tulis butir soal..."
                  rows={2}
                  className="w-full resize-none rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] leading-relaxed font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
                />
                {exercise.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateExercise(eIndex, { correctIndex: oIndex })}
                      title="Tandai sebagai kunci jawaban"
                      className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-md border px-1.5 py-1 text-[10px] font-bold transition-colors ${
                        exercise.correctIndex === oIndex
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-black bg-white text-black hover:border-blue-600 hover:text-blue-600'
                      }`}
                    >
                      <CircleDot className="h-3 w-3" /> Kunci
                    </button>
                    <input
                      value={option}
                      onChange={(e) => updateOption(eIndex, oIndex, e.target.value)}
                      placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}`}
                      className="min-w-0 flex-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black outline-none placeholder:text-black/40 focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(eIndex, oIndex)}
                      className="shrink-0 cursor-pointer rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:border-red-600 hover:text-red-600"
                      title="Hapus pilihan"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(eIndex)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-blue-600 bg-white px-1.5 py-0.5 text-[10px] font-bold text-blue-700 transition-colors hover:bg-blue-50"
                >
                  <PlusCircle className="h-3 w-3" /> Tambah Pilihan
                </button>
              </div>
            ))}
          </section>
        );

      case 'feed': {
        const selectedFeedAssignment =
          classAssignments.find((item) => item.id === selectedFeedAssignmentId) ?? null;
        return (
          <section className="flex h-full flex-col overflow-hidden rounded-md border-2 border-black">
            <div className="flex items-center justify-between gap-2 border-b-2 border-black p-3">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
                <select
                  id="select-target-kelas"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  title="Target Kelas"
                  className="cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black uppercase transition-colors outline-none hover:border-blue-600 hover:text-blue-600 focus:border-blue-600"
                >
                  {teacherClasses.map((cls) => (
                    <option key={cls.id} value={cls.id} className="font-bold text-black">
                      {cls.name.toUpperCase()}
                    </option>
                  ))}
                  {teacherClasses.length === 0 && (
                    <option value="" className="font-bold text-black">
                      NULL_CLASS
                    </option>
                  )}
                </select>
                <span>Feed Tugas Terdaftar Aktif ({classAssignments.length})</span>
              </div>
              <select
                id="select-feed-tugas"
                value={selectedFeedAssignmentId}
                onChange={(e) => setSelectedFeedAssignmentId(e.target.value)}
                title="Pilih tugas untuk membuka diskusi"
                className="max-w-[280px] cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black uppercase transition-colors outline-none hover:border-blue-600 hover:text-blue-600 focus:border-blue-600"
              >
                {classAssignments.map((item) => (
                  <option key={item.id} value={item.id} className="font-bold text-black">
                    {item.title}
                  </option>
                ))}
                {classAssignments.length === 0 && (
                  <option value="" className="font-bold text-black">
                    NULL_ASSIGNMENT
                  </option>
                )}
              </select>
            </div>

            {classAssignments.length === 0 ? (
              <div className="rounded-md border-2 border-dashed border-black bg-white py-20 text-center">
                <p className="text-xs font-bold tracking-wider text-black uppercase">
                  EMPTY_ASSIGNMENT_FEED
                </p>
                <p className="mt-0.5 text-xs font-bold text-black">
                  Belum ada entri parameter data atau tugas online yang ditugaskan di kelas ini.
                </p>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 items-stretch">
                {/* PANEL KANAN: CHAT PENUH TUGAS TERPILIH */}
                <div className="flex min-w-0 flex-1 flex-col">
                  {selectedFeedAssignment && user ? (
                    <DiskusiTugas
                      key={selectedFeedAssignment.id}
                      assignment={selectedFeedAssignment}
                      user={user}
                      variant="full"
                      fill
                      leftFooter={
                        <div className="space-y-2">
                          {editingAssignmentId && (
                            <div className="flex items-center justify-between gap-2 rounded-md border-2 border-blue-600 bg-white p-1.5">
                              <div className="flex min-w-0 items-center gap-1.5">
                                <Pencil className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                                <span className="truncate text-[10px] font-bold text-black">
                                  Mode Edit — memperbarui tugas yang sudah terbit
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="shrink-0 cursor-pointer rounded-md border-2 border-black bg-white px-2 py-0.5 text-[10px] font-bold text-black transition-colors hover:border-red-600 hover:text-red-600"
                              >
                                Batal
                              </button>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={handleAddAssignment}
                            disabled={
                              isPublishing ||
                              !assignmentTitle.trim() ||
                              !assignmentDescription.trim() ||
                              !assignmentDueDate
                            }
                            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border-2 border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:border-black disabled:bg-neutral-100 disabled:text-black disabled:opacity-60"
                          >
                            {isPublishing ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : editingAssignmentId ? (
                              <Pencil className="h-3.5 w-3.5" />
                            ) : (
                              <Plus className="h-3.5 w-3.5" />
                            )}
                            <span>
                              {isPublishing
                                ? 'Menyimpan...'
                                : editingAssignmentId
                                  ? 'Simpan Perubahan'
                                  : 'Terbitkan Tugas'}
                            </span>
                          </button>
                        </div>
                      }
                    />
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
                      <Inbox className="h-8 w-8 text-black/30" />
                      <p className="text-xs font-bold text-black/60">
                        Pilih tugas untuk melihat diskusi
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white p-3 text-xs text-black antialiased selection:bg-neutral-200">
      {/* MENU TAB - BINGKAI BERUBAH BLUE-600 SAAT AKTIF (seperti halaman murid) */}
      <div className="mt-4 mb-6 grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {TEACHER_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 rounded-md border-2 bg-white px-3 py-2 text-xs font-bold text-black transition-all ${
                isActive ? 'border-blue-600' : 'border-black hover:bg-neutral-100'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 text-black" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* AREA KONTEN AKTIF — flex: tab konten mengisi sisa */}
      <div className="flex min-h-0 flex-1 flex-col">{renderTabContent()}</div>
    </div>
  );
}
