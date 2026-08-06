import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  addClassAnnouncement,
  deleteClassAnnouncement,
  getClassAnnouncements,
  getClasses,
  getTeachers,
} from '../../data/services';
import { Megaphone, Trash2, Calendar, Radio } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';

export default function AturPengumumanGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

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

  const classAnnouncements = useMemo(
    () => (selectedClassId ? getClassAnnouncements(selectedClassId) : []),
    [selectedClassId, storeVersion]
  );

  const handleAddAnnouncement = () => {
    if (!selectedClassId || !title.trim() || !message.trim() || !user) return;
    addClassAnnouncement({
      id: `a_${Date.now()}`,
      classId: selectedClassId,
      title: title.trim(),
      message: message.trim(),
      content: message.trim(), // alias for compatibility
      createdBy: user.id,
      createdAt: Date.now(),
    });
    setTitle('');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* HEADER CONTROL CONTAINER */}
      <header className="flex flex-col justify-between gap-2 border-b-2 border-black pb-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-lg leading-none font-bold tracking-tight text-black">
            Atur Pengumuman Kelas
          </h1>
          <p className="mt-1.5 text-xs leading-none font-bold text-black">
            Panel manajemen maklumat, instruksi akademis, dan pengumuman resmi kelas binaan.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start border-l-2 border-black pl-4 text-right sm:self-end">
          <div className="flex flex-col">
            <label
              htmlFor="target-kelas-select"
              className="text-[10px] font-bold tracking-wider text-black uppercase"
            >
              Target Kelas
            </label>
            <select
              id="target-kelas-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="mt-0.5 cursor-pointer rounded-md border-2 border-black bg-white px-2 py-1 font-mono text-xs font-bold text-black uppercase transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
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
          </div>
        </div>
      </header>

      {/* TWO-COLUMN COMMAND WORKSPACE */}
      <div className="grid items-start gap-4 lg:grid-cols-12">
        {/* PANEL KIRI: FORMULIR INPUT EDITOR */}
        <section className="space-y-3 rounded-md border-2 border-black bg-white p-3 lg:col-span-5">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
            <Radio className="h-4 w-4 text-black" />
            <span>Tulis Maklumat Baru</span>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="input-judul"
              className="block text-[10px] font-bold tracking-wider text-black uppercase"
            >
              Judul Pengumuman
            </label>
            <input
              id="input-judul"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ketik topik maklumat utama..."
              className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="input-pesan"
              className="block text-[10px] font-bold tracking-wider text-black uppercase"
            >
              Isi Konten Pesan
            </label>
            <textarea
              id="input-pesan"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis deskripsi atau instruksi formal kelas di sini..."
              className="field-sizing-content h-auto min-h-[120px] w-full resize-y overflow-hidden rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs leading-4 font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddAnnouncement}
              disabled={!title.trim() || !message.trim()}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border-2 border-black bg-black px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-black disabled:opacity-60"
            >
              <Megaphone className="h-3.5 w-3.5" />
              <span>SIARKAN PENGUMUMAN</span>
            </button>
          </div>
        </section>

        {/* PANEL KANAN: LIVE STREAM LOG LIST */}
        <section className="flex flex-col rounded-md border-2 border-black bg-white p-3 lg:col-span-7">
          <div className="mb-3 flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-bold tracking-wider text-black uppercase">
            <Megaphone className="h-4 w-4 text-black" />
            <span>Arsip Siaran Aktif Kelas ({classAnnouncements.length})</span>
          </div>

          <div className="max-h-[510px] space-y-3 overflow-y-auto pr-0.5">
            {classAnnouncements.map((item) => (
              <div key={item.id} className="rounded-md border-2 border-black bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-bold tracking-tight text-black">{item.title}</p>
                    <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-black">
                      <Calendar className="h-3 w-3 text-black" />
                      <span>
                        {item.createdAt != null ? (
                          <>
                            {new Date(item.createdAt).toLocaleDateString('id-ID')} &bull;{' '}
                            {new Date(item.createdAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </>
                        ) : (
                          '—'
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Button Delete - Konsisten dengan Tema */}
                  <button
                    type="button"
                    onClick={() => deleteClassAnnouncement(item.id)}
                    className="shrink-0 cursor-pointer rounded-md border-2 border-black bg-white p-1.5 text-black transition-colors hover:border-rose-600 hover:bg-rose-50 hover:text-rose-600"
                    title="Hapus maklumat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="mt-2 border-t-2 border-black/10 pt-2 text-xs leading-4 font-bold whitespace-pre-line text-black">
                  {item.message}
                </p>
              </div>
            ))}

            {classAnnouncements.length === 0 && (
              <div className="rounded-md border-2 border-dashed border-black bg-white py-14 text-center">
                <p className="text-xs font-bold tracking-wider text-black uppercase">
                  EMPTY_BROADCAST_FEED
                </p>
                <p className="mt-0.5 text-xs font-bold text-black">
                  Belum ada maklumat resmi yang disebarkan ke ruang kelas ini.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
