import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getPengumumanAdmin,
  getPengumumanAdminUntukGuru,
  getPengumumanAdminUntukKelas,
  getStudentByUser,
  getTeacherByUser,
} from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { X, Megaphone } from 'lucide-react';
import { PageProps } from '../../types';

export default function PengumumanSekolah() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  // Menghitung pengumuman berdasarkan role pengguna (Logika bisnis dipertahankan)
  const pengumumanAdmin = useMemo(() => {
    if (user?.role === 'student') {
      const student = getStudentByUser(user);
      if (student) return getPengumumanAdminUntukKelas(student.classId);
    } else if (user?.role === 'teacher') {
      const teacher = getTeacherByUser(user);
      if (teacher) return getPengumumanAdminUntukGuru(teacher.classIds);
    }
    return getPengumumanAdmin();
  }, [user, storeVersion]);

  // Menutup modal preview menggunakan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewImage(null);
    };

    if (previewImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImage]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-2 text-slate-600 antialiased selection:bg-slate-200">
      {/* Header Judul - Polos & Menyatu dengan Halaman */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Megaphone className="h-6 w-6 text-slate-800" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengumuman Sekolah</h1>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Informasi resmi dan pemberitahuan penting dari manajemen sekolah.
        </p>
      </div>

      {/* List Pengumuman - Aliran List Normal & Akademik */}
      <div className="divide-y divide-slate-100">
        {pengumumanAdmin.map((item) => (
          <div
            key={item.id}
            className="-mx-2 flex flex-col justify-between gap-6 rounded-lg p-2 py-6 transition-all first:pt-2 hover:bg-slate-50/50 md:flex-row md:items-start"
          >
            {/* Area Teks Informasi */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-3">
                <span className="shrink-0 rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-xs leading-none font-medium text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <h2 className="truncate text-lg font-bold text-slate-900">{item.title}</h2>
              </div>
              <p className="text-base leading-relaxed whitespace-pre-line text-slate-600">
                {item.message}
              </p>
            </div>

            {/* Lampiran Gambar jika Ada */}
            {item.imageDataUrl && (
              <div className="mt-4 w-full shrink-0 md:mt-0 md:w-48">
                <button
                  type="button"
                  onClick={() =>
                    setPreviewImage({ src: item.imageDataUrl || '', title: item.title })
                  }
                  className="block aspect-video w-full cursor-zoom-in overflow-hidden rounded-md border border-slate-200 transition-shadow hover:shadow-md"
                >
                  <img
                    src={item.imageDataUrl}
                    alt={item.imageName || item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              </div>
            )}
          </div>
        ))}

        {pengumumanAdmin.length === 0 && (
          <div className="py-12 text-center text-sm font-medium text-slate-500">
            Belum ada pengumuman sekolah saat ini.
          </div>
        )}
      </div>

      {/* Image Preview Overlay Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
              <span className="truncate pr-4 text-sm font-bold text-slate-900">
                {previewImage.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="rounded bg-slate-100 p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-center bg-slate-100 p-2">
              <img
                src={previewImage.src}
                alt={previewImage.title}
                className="h-auto max-h-[75vh] w-auto rounded object-contain"  loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
