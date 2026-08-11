import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeachers, updateTeacher } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import {
  Camera,
  Save,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  User,
  AtSign,
  Phone,
  BookOpen,
  Fingerprint,
} from 'lucide-react';
import ModalPotongFoto from '../bersama/ModalPotongFoto';
import { bacaFileSebagaiDataUrl } from '../../utils/gambar';

interface TeacherProfileFormData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  subject: string;
  address: string;
}

export default function TeacherProfilePage() {
  const { user, refreshUser } = useAuth();
  const storeVersion = useStoreVersion();

  const teacher = useMemo(() => getTeachers().find((t) => t.id === user?.id), [user, storeVersion]);

  const [formData, setFormData] = useState<TeacherProfileFormData>({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    subject: '',
    address: '',
  });

  const [avatarPreview, setAvatarPreview] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [bukaPotongFoto, setBukaPotongFoto] = useState(false);
  const [sumberFotoPotong, setSumberFotoPotong] = useState('');

  const resetForm = useCallback(() => {
    if (!teacher) return;
    setFormData({
      name: teacher.name || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      whatsapp: teacher.whatsapp || '',
      subject: teacher.subject || '',
      address: teacher.address || '',
    });
    setAvatarPreview(teacher.avatar || '');
    setIsDirty(false);
  }, [teacher]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleUploadAvatar = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'File harus berupa gambar', type: 'error' });
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: 'Ukuran file maksimal 5MB', type: 'error' });
      event.target.value = '';
      return;
    }
    try {
      setIsUploadingAvatar(true);
      const dataUrl = await bacaFileSebagaiDataUrl(file);
      setSumberFotoPotong(dataUrl);
      setBukaPotongFoto(true);
    } catch {
      setMessage({ text: 'Upload foto gagal', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (!teacher) return;
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      updateTeacher({
        ...teacher,
        name: formData.name.trim(),
        email: formData.email.trim() || '', // ← PERBAIKAN
        phone: formData.phone.trim() || undefined,
        whatsapp: formData.whatsapp.trim() || undefined,
        subject: formData.subject.trim() || '', // ← PERBAIKAN
        address: formData.address.trim() || undefined,
        avatar: avatarPreview || undefined,
      });
      refreshUser();
      setIsDirty(false);
      setMessage({ text: 'Profil berhasil diperbarui', type: 'success' });
    } catch {
      setMessage({ text: 'Gagal menyimpan profil', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [teacher, formData, avatarPreview, refreshUser]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* Floating Alert */}
      {message && (
        <div
          className={`flex items-center justify-between rounded-md border-2 p-3 ${
            message.type === 'success'
              ? 'border-emerald-600 bg-white text-emerald-700'
              : 'border-rose-600 bg-white text-rose-700'
          }`}
        >
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <p className="text-xs font-bold">{message.text}</p>
          </div>
          <button type="button" onClick={() => setMessage(null)} className="transition-opacity hover:opacity-70">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <section className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div
          className="relative h-32 md:h-40"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/Dashboard/logo-profile.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>

        <div className="relative -mt-10 flex flex-col justify-between gap-4 px-4 pb-4 sm:flex-row sm:items-end md:-mt-12 md:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            {/* Avatar Upload */}
            <div className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-md border-4 border-black bg-white md:h-28 md:w-28">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black text-2xl font-bold text-white">
                  {(teacher?.name || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-6 w-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAvatar}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>
            <div className="text-center sm:mb-1 sm:text-left">
              <h2 className="text-lg leading-none font-bold tracking-tight text-black">
                {teacher?.name || 'Nama Guru'}
              </h2>
              <p className="mt-1 text-xs font-bold text-black">
                Guru {teacher?.subject || '-'} • NIP {teacher?.nip || '-'}
              </p>
            </div>
          </div>

          {/* Tombol Tambahan: Ganti Foto Profil */}
          <label
            className={`inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-md border-2 px-4 py-2 text-xs font-bold transition-colors ${
              isUploadingAvatar
                ? 'cursor-not-allowed border-black bg-neutral-100 text-black/50'
                : 'border-black bg-white text-black hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600'
            } sm:self-end`}
          >
            {isUploadingAvatar ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 text-black" />
                Ganti Foto Profil
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadAvatar}
              className="hidden"
              disabled={isUploadingAvatar}
            />
          </label>
        </div>
      </section>

      {/* Grid: Detail Kiri + Form Kanan */}
      <div className="grid items-start gap-4 lg:grid-cols-12">
        {/* Kiri: Detail Data */}
        <div className="space-y-4 rounded-md border-2 border-black bg-white p-4 lg:col-span-5">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <h3 className="text-xs font-bold tracking-wider text-black uppercase">Profil</h3>
          </div>
          <div className="space-y-3.5 text-xs">
            {[
              {
                label: 'Nama Lengkap',
                value: teacher?.name,
                icon: <User className="h-4 w-4 text-black" />,
              },
              {
                label: 'NIP',
                value: teacher?.nip || 'Belum diisi',
                isItalic: !teacher?.nip,
                icon: <Fingerprint className="h-4 w-4 text-black" />,
              },
              {
                label: 'Email',
                value: teacher?.email || 'Belum diisi',
                isItalic: !teacher?.email,
                icon: <AtSign className="h-4 w-4 text-black" />,
              },
              {
                label: 'No. Telepon',
                value: teacher?.phone || 'Belum diisi',
                isItalic: !teacher?.phone,
                icon: <Phone className="h-4 w-4 text-black" />,
              },
              {
                label: 'WhatsApp',
                value: teacher?.whatsapp || 'Belum diisi',
                isItalic: !teacher?.whatsapp,
                icon: <Phone className="h-4 w-4 text-black" />,
              },
              {
                label: 'Mata Pelajaran',
                value: teacher?.subject || 'Belum diisi',
                isItalic: !teacher?.subject,
                icon: <BookOpen className="h-4 w-4 text-black" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 rounded-md border-2 border-black/10 bg-white p-2.5 transition-colors hover:bg-neutral-100"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-black bg-white">
                  {item.icon}
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-black uppercase">
                    {item.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs font-bold text-black ${item.isItalic ? 'font-normal text-black/40 italic' : ''}`}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanan: Form Edit */}
        <div className="space-y-5 rounded-md border-2 border-black bg-white p-4 lg:col-span-7">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <h3 className="text-xs font-bold tracking-wider text-black uppercase">
              Pengaturan Profil
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                Nama Lengkap <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  setIsDirty(true);
                }}
                className="w-full rounded-md border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, email: e.target.value }));
                    setIsDirty(true);
                  }}
                  placeholder="nama@domain.com"
                  className="w-full rounded-md border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, phone: e.target.value }));
                    setIsDirty(true);
                  }}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-md border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, whatsapp: e.target.value }));
                    setIsDirty(true);
                  }}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-md border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, subject: e.target.value }));
                    setIsDirty(true);
                  }}
                  placeholder="Matematika, Bahasa Indonesia, dll"
                  className="w-full rounded-md border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                Alamat Lengkap
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, address: e.target.value }));
                  setIsDirty(true);
                }}
                placeholder="Tuliskan alamat domisili..."
                className="w-full resize-none rounded-md border-2 border-black bg-white px-3.5 py-2 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t-2 border-black/10 pt-3">
            {isDirty && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
              >
                Batalkan
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving || !isDirty}
              className={`inline-flex items-center gap-2 rounded-md border-2 px-4 py-2 text-xs font-bold transition-colors ${
                isSaving || !isDirty
                  ? 'cursor-not-allowed border-black bg-neutral-100 text-black/50'
                  : 'border-black bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ModalPotongFoto
        open={bukaPotongFoto}
        sumberGambar={sumberFotoPotong}
        judul="Sesuaikan Foto Profil Anda"
        warnaAksen="biru"
        onBatal={() => {
          setBukaPotongFoto(false);
          setSumberFotoPotong('');
        }}
        onSimpan={(avatar) => {
          setAvatarPreview(avatar);
          if (teacher) {
            updateTeacher({ ...teacher, avatar });
            refreshUser();
          }
          setBukaPotongFoto(false);
          setSumberFotoPotong('');
          setMessage({ text: 'Foto profil berhasil diperbarui', type: 'success' });
        }}
      />
    </div>
  );
}
