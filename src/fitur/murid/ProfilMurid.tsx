import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClasses, getStudentByUser, updateStudent } from '../../data/services';
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
  MapPin,
  Fingerprint,
} from 'lucide-react';
import ModalPotongFoto from '../bersama/ModalPotongFoto';
import { bacaFileSebagaiDataUrl } from '../../utils/gambar';

// Types
interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  parentName?: string;
}

type MessageType = 'success' | 'error';

interface MessageState {
  text: string;
  type: MessageType;
}

// Constants
const DEFAULT_AVATAR = '/default-avatar.png';
const MESSAGE_DURATION = 3000;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const storeVersion = useStoreVersion();

  // Data Fetching
  const student = useMemo(
    () => getStudentByUser(user),
    [user, storeVersion]
  );

  const className = useMemo(() => {
    if (!student) return '-';
    return getClasses().find((item) => item.id === student.classId)?.name || '-';
  }, [student, storeVersion]);

  // Form State
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  // Avatar State
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [sumberFotoPotong, setSumberFotoPotong] = useState('');
  const [bukaPotongFoto, setBukaPotongFoto] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (!student) return;

    setFormData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
      parentName: student.parentName || '',
    });
    setAvatarPreview(student.avatar || '');
    setIsDirty(false);
  }, [student]);

  // Auto-dismiss message
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(null), MESSAGE_DURATION);
    return () => clearTimeout(timer);
  }, [message]);

  // Warn before unload if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (formData.phone) {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 13) {
        newErrors.phone = 'Nomor WhatsApp harus 10-13 digit';
      }
    }

    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'Alamat maksimal 500 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handlers
  const handleInputChange = useCallback(
    (field: keyof ProfileFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleUploadAvatar = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'File harus berupa gambar (JPG, PNG, atau GIF)', type: 'error' });
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
    } catch (error) {
      setMessage({ text: 'Upload foto gagal. Silakan coba file lain.', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  }, []);

  const handleSimpanFotoPotong = useCallback(
    (avatar: string) => {
      if (!student) return;

      setAvatarPreview(avatar);
      setIsDirty(true);

      updateStudent({
        ...student,
        ...formData,
        name: formData.name.trim() || student.name,
        avatar,
      });

      refreshUser();
      setBukaPotongFoto(false);
      setSumberFotoPotong('');
      setMessage({ text: 'Foto profil berhasil diperbarui', type: 'success' });
    },
    [student, formData, refreshUser]
  );

  const handleSaveProfile = useCallback(async () => {
    if (!student) return;

    if (!validateForm()) {
      setMessage({ text: 'Mohon periksa kembali data yang dimasukkan', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateStudent({
        ...student,
        name: formData.name.trim() || student.name,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        parentName: formData.parentName.trim() || undefined,
        avatar: avatarPreview || undefined,
      });

      refreshUser();
      setIsDirty(false);
      setMessage({ text: 'Profil berhasil diperbarui', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Gagal menyimpan profil. Silakan coba lagi.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [student, formData, avatarPreview, validateForm, refreshUser]);

  const handleBatalPotong = useCallback(() => {
    setBukaPotongFoto(false);
    setSumberFotoPotong('');
  }, []);

  if (!student) {
    return (
      <div className="m-4 flex h-96 items-center justify-center rounded-2xl border border-black bg-white">
        <div className="max-w-sm p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-black bg-white text-black">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="mb-1 font-bold text-black">Profil Tidak Ditemukan</p>
          <p className="text-xs font-bold text-black">
            Data siswa gagal dimuat atau sesi Anda telah berakhir.
          </p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 text-black">
      {/* Floating Alert Notification */}
      {message && (
        <div
          className={`flex items-center justify-between rounded-md border p-4 shadow-sm transition-all duration-300 ${
            message.type === 'success'
              ? 'border-black bg-white text-black'
              : 'border-black bg-black text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <div className="rounded-full bg-black p-1 text-white">
                <CheckCircle className="h-4 w-4" />
              </div>
            ) : (
              <div className="rounded-full bg-black p-1 text-white">
                <AlertCircle className="h-4 w-4" />
              </div>
            )}
            <p className="text-xs font-bold text-black">{message.text}</p>
          </div>
          <button type="button"
            onClick={() => setMessage(null)}
            className="rounded-md p-1 text-black transition-colors hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero Profile Banner Card */}
      <section className="overflow-hidden rounded-2xl border border-white bg-gradient-to-r from-blue-600 shadow-sm">
        <div
          className="relative h-32 md:h-44"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/Dashboard/logo-profile.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>

        <div className="relative -mt-12 flex flex-col justify-between gap-6 px-6 pb-6 sm:flex-row sm:items-end md:-mt-14 md:px-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl md:h-32 md:w-32">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black text-3xl font-bold text-white">
                  {getInitials(student.name)}
                </div>
              )}
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Camera className="h-7 w-7 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAvatar}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>

            <div className="sm:mb-2">
              <h2 className="text-xl font-bold tracking-tight text-black md:text-2xl">
                {student.name}
              </h2>
              <p className="mt-0.5 text-xs font-bold text-black">
                Kelas {className} &bull; NIS {student.nis}
              </p>
            </div>
          </div>

          <label
            className={`inline-flex items-center justify-center gap-2 rounded-md border border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100 ${
              isUploadingAvatar ? 'cursor-not-allowed bg-white opacity-60' : 'cursor-pointer'
            }`}
          >
            {isUploadingAvatar ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
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

      {/* Main Grid Content */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left Side: Detail Overview */}
        <div className="space-y-4 rounded-2xl border border-black bg-white p-6 shadow-sm lg:col-span-5">
          <div className="flex items-center gap-2 border-b border-black pb-3">
            <h3 className="text-base font-bold text-black">Profil</h3>
          </div>

          <div className="space-y-3.5 text-xs font-bold">
            {[
              {
                label: 'Nama Lengkap',
                value: student.name,
                icon: <User className="h-4 w-4 text-black" />,
              },
              {
                label: 'Nomor Induk Siswa (NIS)',
                value: student.nis,
                icon: <Fingerprint className="h-4 w-4 text-black" />,
              },
              {
                label: 'Kelas Aktif',
                value: className,
                icon: <span className="text-xs font-bold text-black">RM</span>,
              },
              {
                label: 'Jenis Kelamin',
                value: student.gender === 'L' ? 'Laki-laki' : 'Perempuan',
                icon: <span className="text-xs font-bold text-black">JK</span>,
              },
              {
                label: 'Alamat Surel (Email)',
                value: student.email || 'Belum diisi',
                icon: <AtSign className="h-4 w-4 text-black" />,
              },
              {
                label: 'No. WhatsApp',
                value: student.phone || 'Belum diisi',
                icon: <Phone className="h-4 w-4 text-black" />,
              },
              {
                label: 'Orang Tua / Wali',
                value: student.parentName || 'Belum diisi',
                icon: <User className="h-4 w-4 text-black" />,
              },
              {
                label: 'Alamat Rumah',
                value: student.address || 'Belum diisi',
                icon: <MapPin className="h-4 w-4 text-black" />,
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 rounded-lg border border-black bg-white p-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-black bg-white">
                  {item.icon}
                </div>
                <div>
                  <span className="block text-xs font-bold text-black">{item.label}</span>
                  <span className="mt-0.5 block text-xs font-bold text-black">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="space-y-5 rounded-2xl border border-black bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex items-center gap-2 border-b border-black pb-3">
            <h3 className="text-base font-bold text-black">Pengaturan Profil</h3>
          </div>

          <div className="space-y-4">
            {/* Input Name */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black uppercase">
                Nama Lengkap <span className="text-black">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full rounded-md border border-black bg-white px-4 py-2.5 text-xs font-bold text-black transition-colors placeholder:text-black/50 focus:border-black focus:outline-none"
                placeholder="Masukkan nama lengkap Anda"
              />
              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-black">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.name}
                </p>
              )}
            </div>

            {/* Twin Row Grid (Email & WhatsApp) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-black uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="nama@domain.com"
                  className="w-full rounded-md border border-black bg-white px-4 py-2.5 text-xs font-bold text-black transition-colors placeholder:text-black/50 focus:border-black focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs font-bold text-black">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-black uppercase">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-md border border-black bg-white px-4 py-2.5 text-xs font-bold text-black transition-colors placeholder:text-black/50 focus:border-black focus:outline-none"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs font-bold text-black">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Input Parent Name */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black uppercase">
                Nama Orang Tua / Wali
              </label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => handleInputChange('parentName', e.target.value)}
                placeholder="Nama ayah, ibu, atau wali"
                className="w-full rounded-md border border-black bg-white px-4 py-2.5 text-xs font-bold text-black transition-colors placeholder:text-black/50 focus:border-black focus:outline-none"
              />
            </div>

            {/* Input Address */}
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black uppercase">
                Alamat Lengkap
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Tuliskan alamat rumah domisili saat ini..."
                maxLength={500}
                className="w-full resize-none rounded-md border border-black bg-white px-4 py-2.5 text-xs font-bold text-black transition-colors placeholder:text-black/50 focus:border-black focus:outline-none"
              />
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-black">{errors.address || ''}</span>
                <span className="text-xs font-bold text-black">{formData.address.length}/500</span>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-black pt-4">
            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  if (student) {
                    setFormData({
                      name: student.name || '',
                      email: student.email || '',
                      phone: student.phone || '',
                      address: student.address || '',
                      parentName: student.parentName || '',
                    });
                    setAvatarPreview(student.avatar || '');
                    setErrors({});
                    setIsDirty(false);
                  }
                }}
                className="rounded-md border border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
              >
                Batalkan
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving || !isDirty}
              className={`inline-flex items-center gap-2 rounded-md border border-black bg-white px-5 py-2 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100 ${
                isSaving || !isDirty
                  ? 'cursor-not-allowed bg-white opacity-60 hover:border-black hover:text-black'
                  : ''
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 text-black" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Crop Avatar Modal Component */}
      <ModalPotongFoto
        open={bukaPotongFoto}
        sumberGambar={sumberFotoPotong}
        judul="Sesuaikan Foto Profil Anda"
        warnaAksen="biru"
        onBatal={handleBatalPotong}
        onSimpan={handleSimpanFotoPotong}
      />
    </div>
  );
}
