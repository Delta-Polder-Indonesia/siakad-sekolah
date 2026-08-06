import { useMemo, useState } from 'react';
import { BookMarked, Save } from 'lucide-react';
import { getTeacherLessonNotes, upsertTeacherLessonNote } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';

type CatatanRpsGuruProps = {
  teacherId: string;
  classId: string;
  className: string;
  subject: string;
  setNotice: (msg: string) => void;
};

export default function CatatanRpsGuru({
  teacherId,
  classId,
  className,
  subject,
  setNotice,
}: CatatanRpsGuruProps) {
  const storeVersion = useStoreVersion();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [materi, setMateri] = useState('');
  const [adaPr, setAdaPr] = useState(false);
  const [prDetail, setPrDetail] = useState('');
  const [catatan, setCatatan] = useState('');

  const notes = useMemo(
    () => getTeacherLessonNotes(teacherId, classId, subject),
    [teacherId, classId, subject, storeVersion]
  );

  const handleSave = () => {
    if (!materi.trim()) {
      setNotice('Materi pembelajaran wajib diisi sebelum simpan catatan RPS.');
      return;
    }

    upsertTeacherLessonNote({
      teacherId,
      classId,
      subject,
      date,
      materi: materi.trim(),
      adaPr,
      prDetail: adaPr ? prDetail.trim() : '',
      catatan: catatan.trim(),
    });

    setMateri('');
    setAdaPr(false);
    setPrDetail('');
    setCatatan('');
    setNotice(`Catatan RPS ${subject} kelas ${className} berhasil disimpan.`);
  };

  return (
    <section className="w-full max-w-full overflow-hidden rounded-md border-2 border-black bg-white p-3 text-xs text-black">
      <div className="mb-3 flex items-center gap-2 border-b-2 border-black pb-2">
        <BookMarked className="h-4 w-4 text-black" />
        <h4 className="text-xs font-bold tracking-wider text-black uppercase">
          Catatan RPS: {subject} - {className}
        </h4>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
            Tanggal Mengajar
          </label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 font-mono text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
            Materi Hari Ini
          </label>
          <input
            value={materi}
            onChange={(event) => setMateri(event.target.value)}
            placeholder="Contoh: Persamaan Linear Dua Variabel"
            className="w-full rounded-md border-2 border-black bg-white px-2 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="block text-[10px] font-bold tracking-wider text-black uppercase">
            Catatan Tambahan
          </label>
          <textarea
            value={catatan}
            onChange={(event) => setCatatan(event.target.value)}
            placeholder="Ringkasan progres kelas, kendala, atau tindak lanjut"
            className="h-16 w-full rounded-md border-2 border-black bg-white px-2 py-1.5 text-xs font-semibold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
          />
        </div>
      </div>

      <div className="mt-2 rounded-md border-2 border-black bg-white p-2">
        <label className="inline-flex items-center gap-2 text-xs font-bold text-black">
          <input
            type="checkbox"
            checked={adaPr}
            onChange={(event) => setAdaPr(event.target.checked)}
            className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
          />
          Ada PR untuk pertemuan ini
        </label>
        {adaPr ? (
          <input
            value={prDetail}
            onChange={(event) => setPrDetail(event.target.value)}
            placeholder="Detail PR: halaman, soal, deadline"
            className="mt-2 w-full rounded-md border-2 border-black bg-white px-2 py-1.5 text-xs font-semibold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
          />
        ) : null}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-black bg-black px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-neutral-800"
        >
          <Save className="h-3.5 w-3.5" /> SIMPAN CATATAN
        </button>
      </div>

      <div className="mt-3 border-t-2 border-black pt-2">
        <p className="mb-1 text-[10px] font-bold tracking-wider text-black uppercase">
          Riwayat Materi Sebelumnya
        </p>
        <div className="max-h-48 space-y-1 overflow-x-auto overflow-y-auto pr-0.5">
          {notes.map((item) => (
            <div
              key={item.id}
              className="min-w-[300px] rounded-md border-2 border-black bg-white p-2 text-xs"
            >
              <p className="font-bold text-black">
                <span className="font-mono text-[10px]">{item.date}</span> - {item.materi}
              </p>
              <p className="font-semibold text-black">Catatan: {item.catatan || '-'}</p>
              <p className="font-semibold text-black">
                PR: {item.adaPr ? item.prDetail || 'Ada PR' : 'Tidak ada PR'}
              </p>
            </div>
          ))}
          {notes.length === 0 ? (
            <p className="text-xs font-semibold text-black">
              Belum ada riwayat materi untuk kelas ini.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
