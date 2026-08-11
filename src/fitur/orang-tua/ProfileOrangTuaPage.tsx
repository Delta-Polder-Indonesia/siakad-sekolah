import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getStudents,
  getClasses,
  getTeachers,
  getAttendance,
  getTagihanSekolahBySiswa,
  getNilaiRapot,
  getPengumumanAdmin,
  updateStudent,
  type NilaiRapot,
  type AttendanceEntry,
  type PengumumanAdmin,
} from '../../data/services';
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
  BookOpen,
  CreditCard,
  Calendar,
  TrendingUp,
  Bell,
  Clock,
  GraduationCap,
  Users,
} from 'lucide-react';
import ModalPotongFoto from '../bersama/ModalPotongFoto';
import { bacaFileSebagaiDataUrl } from '../../utils/gambar';
import { getPredikat, isTuntas, KONFIGURASI_PENILAIAN } from '../../utils/penilaian';
import { exportRapotPdf } from '../../utils/export';

// Types
interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentFullKtpName: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  parentName?: string;
  parentFullKtpName?: string;
}

type MessageType = 'success' | 'error';

interface MessageState {
  text: string;
  type: MessageType;
}

// Constants
const DEFAULT_AVATAR = '/default-avatar.png';
const MESSAGE_DURATION = 3000;

export default function ProfileOrangTuaPage({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const { user, refreshUser } = useAuth();
  const storeVersion = useStoreVersion();

  const studentId = user?.id.replace('p_', '');

  // Data Fetching
  const student = useMemo(
    () => getStudents().find((s) => s.id === studentId),
    [studentId, storeVersion]
  );

  const className = useMemo(() => {
    if (!student) return '-';
    return getClasses().find((c) => c.id === student.classId)?.name || '-';
  }, [student, storeVersion]);

  const waliKelas = useMemo(() => {
    if (!student) return null;
    const schoolClass = getClasses().find((c) => c.id === student.classId);
    return getTeachers().find((t) => t.id === schoolClass?.teacherId);
  }, [student, storeVersion]);

  const attendance = useMemo(
    () => (studentId ? getAttendance().filter((a) => a.studentId === studentId) : []),
    [studentId, storeVersion]
  );

  const billing = useMemo(
    () => (studentId ? getTagihanSekolahBySiswa(studentId, new Date().getFullYear()) : []),
    [studentId, storeVersion]
  );

  const grades = useMemo(
    () => (studentId ? getNilaiRapot().filter((g) => g.studentId === studentId) : []),
    [studentId, storeVersion]
  );

  const announcements = useMemo(() => getPengumumanAdmin(), [storeVersion]);

  const handleExportPdf = useMemo(() => {
    if (!student || grades.length === 0) return undefined;
    const ref = grades[0];
    return () => exportRapotPdf(grades, student.name, className, ref.tahunAjaran, ref.semester);
  }, [student, grades, className]);

  const stats = useMemo(
    () => ({
      attendanceRate:
        attendance.length > 0
          ? Math.round(
              (attendance.filter((a) => a.status.toLowerCase() === 'hadir').length /
                attendance.length) *
                100
            )
          : 100,
      unpaidBills: billing.filter((t) => t.status === 'belum_lunas').length,
      averageGrade:
        grades.length > 0
          ? Math.round(grades.reduce((acc, curr) => acc + curr.nilaiAkhir, 0) / grades.length)
          : 0,
    }),
    [attendance, billing, grades]
  );

  // Form State
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
    parentFullKtpName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  // Avatar State
  const [avatarPreview, setAvatarPreview] = useState('');
  const [parentAvatarPreview, setParentAvatarPreview] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [modeUpload, setModeUpload] = useState<'student' | 'parent'>('student');
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
      parentFullKtpName: student.parentFullKtpName || '',
    });
    setAvatarPreview(student.avatar || '');
    setParentAvatarPreview(student.parentAvatar || '');
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

  const handleUploadAvatar = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, mode: 'student' | 'parent' = 'student') => {
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
        setModeUpload(mode);
        const dataUrl = await bacaFileSebagaiDataUrl(file);
        setSumberFotoPotong(dataUrl);
        setBukaPotongFoto(true);
      } catch (error) {
        setMessage({ text: 'Upload foto gagal. Silakan coba file lain.', type: 'error' });
      } finally {
        setIsUploadingAvatar(false);
        event.target.value = '';
      }
    },
    []
  );

  const handleSimpanFotoPotong = useCallback(
    (avatar: string) => {
      if (!student) return;

      if (modeUpload === 'student') {
        setAvatarPreview(avatar);
      } else {
        setParentAvatarPreview(avatar);
      }

      setIsDirty(true);

      updateStudent({
        ...student,
        ...formData,
        name: formData.name.trim() || student.name,
        avatar: modeUpload === 'student' ? avatar : avatarPreview,
        parentAvatar: modeUpload === 'parent' ? avatar : parentAvatarPreview,
      });

      refreshUser();
      setBukaPotongFoto(false);
      setSumberFotoPotong('');
      setMessage({
        text: `Foto profil ${modeUpload === 'student' ? 'siswa' : 'orang tua'} berhasil diperbarui`,
        type: 'success',
      });
    },
    [student, formData, refreshUser, modeUpload, avatarPreview, parentAvatarPreview]
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
        parentFullKtpName: formData.parentFullKtpName.trim() || undefined,
        avatar: avatarPreview || undefined,
        parentAvatar: parentAvatarPreview || undefined,
      });

      refreshUser();
      setIsDirty(false);
      setMessage({ text: 'Profil berhasil diperbarui', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Gagal menyimpan profil. Silakan coba lagi.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [student, formData, avatarPreview, parentAvatarPreview, validateForm, refreshUser]);

  const handleBatalPotong = useCallback(() => {
    setBukaPotongFoto(false);
    setSumberFotoPotong('');
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!student) {
    return (
      <div className="m-4 flex h-96 items-center justify-center rounded-md border-2 border-dashed border-black bg-white">
        <div className="max-w-sm p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md border-2 border-black bg-white">
            <AlertCircle className="h-6 w-6 text-black" />
          </div>
          <p className="mb-1 text-sm font-bold text-black">Profil Tidak Ditemukan</p>
          <p className="text-xs font-bold text-black/60">
            Data siswa gagal dimuat atau sesi Anda telah berakhir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200">
      {/* Floating Alert Notification */}
      {message && (
        <div
          className={`flex items-center justify-between gap-3 rounded-md border-2 p-3 transition-all duration-300 ${
            message.type === 'success'
              ? 'border-emerald-600 bg-white text-black'
              : 'border-rose-600 bg-white text-black'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 ${
                message.type === 'success'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-rose-600 bg-rose-600 text-white'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
            </div>
            <p className="text-xs font-bold">{message.text}</p>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:bg-neutral-100"
            aria-label="Tutup notifikasi"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Hero Profile Banner Card */}
      <section className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div
          className="relative h-32 md:h-40"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/Dashboard/logo-profile.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="absolute bottom-4 left-4 md:left-6">
            <p className="text-[10px] font-bold tracking-wider text-white uppercase">
              Akun Orang Tua / Wali
            </p>
            <h1 className="mt-0.5 text-lg leading-none font-bold tracking-tight text-white">
              {user?.name}
            </h1>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 px-4 py-4 sm:flex-row sm:items-end">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-black bg-white">
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
                <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-2xl font-bold text-black">
                  {getInitials(student.name)}
                </div>
              )}
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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

            <div>
              <h2 className="text-lg leading-none font-bold tracking-tight text-black">
                {student.name}
              </h2>
              <p className="mt-1 text-xs font-bold text-black/60">
                Kelas {className} &bull; NIS {student.nis}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-md border-2 border-black bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                  Wali Dari: {student.name}
                </span>
                <span className="rounded-md border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
                  NIS: {student.nis}
                </span>
              </div>
            </div>
          </div>

          <label
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 px-3 py-2 text-xs font-bold transition-colors ${
              isUploadingAvatar
                ? 'cursor-not-allowed border-black bg-neutral-100 text-black/40'
                : 'border-black bg-white text-black hover:border-blue-600 hover:bg-neutral-100'
            }`}
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

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-md border-2 border-black bg-white p-4 transition-colors hover:bg-neutral-100">
          <div className="rounded-md border-2 border-black bg-white p-2.5">
            <Calendar className="h-5 w-5 text-black" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-black uppercase">Presensi</p>
            <p className="text-lg leading-tight font-bold text-black">{stats.attendanceRate}%</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-md border-2 border-black bg-white p-4 transition-colors hover:bg-neutral-100">
          <div className="rounded-md border-2 border-black bg-white p-2.5">
            <CreditCard className="h-5 w-5 text-black" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-black uppercase">
              Tagihan Sekolah
            </p>
            <p className="text-lg leading-tight font-bold text-black">
              {stats.unpaidBills} Item Belum Lunas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-md border-2 border-black bg-white p-4 transition-colors hover:bg-neutral-100">
          <div className="rounded-md border-2 border-black bg-white p-2.5">
            <TrendingUp className="h-5 w-5 text-black" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-black uppercase">
              Rata-rata Nilai
            </p>
            <p className="text-lg leading-tight font-bold text-black">{stats.averageGrade}</p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid items-start gap-4 lg:grid-cols-12">
        {/* Left Side: Detail Overview */}
        <div className="space-y-4 rounded-md border-2 border-black bg-white p-4 lg:col-span-5">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <Users className="h-4 w-4 text-black" />
            <h3 className="text-xs font-bold tracking-wider text-black uppercase">Profil Siswa</h3>
          </div>

          <div className="space-y-3 text-xs">
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
                icon: <GraduationCap className="h-4 w-4 text-black" />,
              },
              {
                label: 'Jenis Kelamin',
                value: student.gender === 'L' ? 'Laki-laki' : 'Perempuan',
                icon: <User className="h-4 w-4 text-black" />,
              },
              {
                label: 'Alamat Surel (Email)',
                value: student.email || 'Belum diisi',
                isItalic: !student.email,
                icon: <AtSign className="h-4 w-4 text-black" />,
              },
              {
                label: 'No. WhatsApp',
                value: student.phone || 'Belum diisi',
                isItalic: !student.phone,
                icon: <Phone className="h-4 w-4 text-black" />,
              },
              {
                label: 'Orang Tua / Wali',
                value: student.parentName || 'Belum diisi',
                isItalic: !student.parentName,
                icon: <Users className="h-4 w-4 text-black" />,
              },
              {
                label: 'Nama Sesuai KTP/KK',
                value: student.parentFullKtpName || 'Belum diisi',
                isItalic: !student.parentFullKtpName,
                icon: <User className="h-4 w-4 text-black" />,
              },
              {
                label: 'Alamat Rumah',
                value: student.address || 'Belum diisi',
                isItalic: !student.address,
                icon: <MapPin className="h-4 w-4 text-black" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 rounded-md border-2 border-transparent p-2 transition-colors hover:border-black hover:bg-neutral-100"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-black bg-white">
                  {item.icon}
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-black/60 uppercase">
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

          {/* Wali Kelas Info Card */}
          <div className="rounded-md border-2 border-black bg-neutral-50 p-3">
            <p className="mb-2 text-[10px] font-bold tracking-wider text-black uppercase">
              Wali Kelas Terdaftar
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-black bg-white">
                <User className="h-5 w-5 text-black" />
              </div>
              <div>
                <p className="text-xs font-bold text-black">
                  {waliKelas?.name || 'Belum Ditentukan'}
                </p>
                <p className="font-mono text-[10px] font-bold text-black/60">
                  {waliKelas?.phone || '+62 --- ---- ----'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.('personal-messages')}
              className="mt-3 w-full rounded-md border-2 border-black bg-black py-2 text-[10px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-900"
            >
              Chat Wali Kelas
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="space-y-4 rounded-md border-2 border-black bg-white p-4 lg:col-span-7">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <Save className="h-4 w-4 text-black" />
            <h3 className="text-xs font-bold tracking-wider text-black uppercase">
              Pengaturan Profil Siswa
            </h3>
          </div>

          <div className="space-y-4">
            {/* Input Name */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                Nama Lengkap <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full rounded-md border-2 bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 ${
                  errors.name
                    ? 'border-rose-600 hover:border-rose-600 focus:border-rose-600'
                    : 'border-black hover:border-blue-600 focus:border-blue-600'
                }`}
                placeholder="Masukkan nama lengkap siswa"
              />
              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-rose-600">
                  <AlertCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Twin Row Grid (Email & WhatsApp) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="nama@domain.com"
                  className={`w-full rounded-md border-2 bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 ${
                    errors.email
                      ? 'border-rose-600 hover:border-rose-600 focus:border-rose-600'
                      : 'border-black hover:border-blue-600 focus:border-blue-600'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-[10px] font-bold text-rose-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={`w-full rounded-md border-2 bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 ${
                    errors.phone
                      ? 'border-rose-600 hover:border-rose-600 focus:border-rose-600'
                      : 'border-black hover:border-blue-600 focus:border-blue-600'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-[10px] font-bold text-rose-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Input Parent Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Panggilan Orang Tua
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => handleInputChange('parentName', e.target.value)}
                  placeholder="Nama ayah, ibu, atau wali"
                  className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Nama Sesuai KTP/KK
                </label>
                <input
                  type="text"
                  value={formData.parentFullKtpName}
                  onChange={(e) => handleInputChange('parentFullKtpName', e.target.value)}
                  placeholder="Nama lengkap sesuai identitas resmi"
                  className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Parent Photo Upload */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border-2 border-black bg-neutral-50 p-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-4 border-black bg-white">
                  {parentAvatarPreview ? (
                    <img
                      src={parentAvatarPreview}
                      alt="Parent Avatar"
                      className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                      <User className="h-6 w-6 text-black" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-black uppercase">
                    Foto Profil Orang Tua
                  </p>
                  <p className="text-[10px] font-bold text-black/60">
                    Agar guru dapat mengenali Anda
                  </p>
                </div>
              </div>
              <label
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 px-3 py-2 text-[10px] font-bold transition-colors ${
                  isUploadingAvatar
                    ? 'cursor-not-allowed border-black bg-neutral-100 text-black/40'
                    : 'border-black bg-white text-black hover:border-blue-600 hover:bg-neutral-100'
                }`}
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Camera className="h-3.5 w-3.5 text-black" />
                    Upload Foto
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadAvatar(e, 'parent')}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>

            {/* Input Address */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-black uppercase">
                Alamat Lengkap
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Tuliskan alamat rumah domisili saat ini..."
                maxLength={500}
                className="w-full resize-none rounded-md border-2 border-black bg-white px-2.5 py-2 text-xs leading-relaxed font-bold text-black transition-colors outline-none placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600"
              />
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-600">{errors.address || ''}</span>
                <span className="text-[10px] font-bold text-black/50">
                  {formData.address.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-end gap-3 border-t-2 border-black/10 pt-3">
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
                      parentFullKtpName: student.parentFullKtpName || '',
                    });
                    setAvatarPreview(student.avatar || '');
                    setErrors({});
                    setIsDirty(false);
                  }
                }}
                className="rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
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
                  ? 'cursor-not-allowed border-black bg-neutral-100 text-black/40'
                  : 'border-black bg-black text-white hover:bg-neutral-900'
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

      {/* Academic Progress Section */}
      <div className="overflow-hidden rounded-md border-2 border-black bg-white">
        <div className="flex items-center justify-between gap-2 border-b-2 border-black bg-white p-3">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
            <BookOpen className="h-4 w-4 text-black" />
            Nilai Akademik
          </h3>
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!handleExportPdf}
            className="rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ekspor PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-black bg-white">
              <tr className="text-xs font-bold tracking-wider text-black uppercase">
                <th className="px-3 py-2">Subjek Pelajaran</th>
                <th className="px-3 py-2 text-center">Harian</th>
                <th className="px-3 py-2 text-center">UTS</th>
                <th className="px-3 py-2 text-center">UAS</th>
                <th className="px-3 py-2 text-center">Indikator</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/10 text-xs font-bold text-black">
              {grades.length > 0 ? (
                grades.map((g: NilaiRapot) => (
                  <tr key={g.id} className="transition-colors hover:bg-neutral-100">
                    <td className="px-3 py-2.5 font-bold text-black">
                      {g.mataPelajaran}
                      <span className="mt-0.5 block text-[10px] font-bold text-black/50">
                        Semester {g.semester}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-black">
                      {g.nilaiHarian}
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-black">
                      {g.nilaiUTS}
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-black">
                      {g.nilaiUAS}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={`inline-block rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${
                          isTuntas(g.nilaiAkhir)
                            ? 'border-black bg-black text-white'
                            : 'border-black bg-white text-black'
                        }`}
                      >
                        {g.nilaiAkhir} ({getPredikat(g.nilaiAkhir)})
                        {isTuntas(g.nilaiAkhir) ? '' : ` · <${KONFIGURASI_PENILAIAN.kkm}`}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-xs font-bold text-black">
                    Data nilai belum tersedia dalam sistem
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Attendance & Announcements */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Attendance */}
        <div className="overflow-hidden rounded-md border-2 border-black bg-white">
          <div className="border-b-2 border-black bg-white p-3">
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-black uppercase">
              <Calendar className="h-4 w-4 text-black" />
              Log Presensi Harian
            </h3>
          </div>
          <div className="space-y-3 p-3">
            {attendance.length > 0 ? (
              attendance
                .slice(-4)
                .reverse()
                .map((a: AttendanceEntry) => (
                  <div
                    key={a.id}
                    className="group flex items-center justify-between gap-2 border-b-2 border-black/10 pb-2.5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-md border-2 border-black bg-white p-1.5">
                        <Clock className="h-3.5 w-3.5 text-black" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-black">{a.date}</p>
                        <p className="font-mono text-[10px] font-bold text-black/50">
                          Jam Masuk: 07:15
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${
                        a.status.toLowerCase() === 'hadir'
                          ? 'border-black bg-black text-white'
                          : 'border-black bg-white text-black'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))
            ) : (
              <p className="py-6 text-center text-xs font-bold text-black">Data log kosong</p>
            )}
          </div>
        </div>

        {/* School Announcements */}
        <div className="rounded-md border-2 border-black bg-white p-4">
          <div className="mb-3 flex items-center gap-2 border-b-2 border-black pb-2">
            <Bell className="h-4 w-4 text-black" />
            <h3 className="text-xs font-bold tracking-wider text-black uppercase">
              Informasi Institusi
            </h3>
          </div>
          <div className="space-y-4">
            {announcements.slice(0, 2).map((ann: PengumumanAdmin) => (
              <div
                key={ann.id}
                className="space-y-1.5 border-b-2 border-black/10 pb-3 last:border-0 last:pb-0"
              >
                <h4 className="cursor-pointer text-xs leading-snug font-bold text-black hover:text-black/60">
                  {ann.title}
                </h4>
                <p className="line-clamp-2 text-xs leading-relaxed font-bold text-black/70">
                  {ann.message}
                </p>
                <p className="font-mono text-[10px] font-bold text-black/50">
                  Publish: {new Date(ann.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-md border-2 border-black bg-black py-2.5 text-[10px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-900">
            Lihat Arsip Pengumuman
          </button>
        </div>
      </div>

      {/* Crop Avatar Modal Component */}
      <ModalPotongFoto
        open={bukaPotongFoto}
        sumberGambar={sumberFotoPotong}
        judul="Sesuaikan Foto Profil Siswa"
        warnaAksen="hijau"
        onBatal={handleBatalPotong}
        onSimpan={handleSimpanFotoPotong}
      />
    </div>
  );
}
