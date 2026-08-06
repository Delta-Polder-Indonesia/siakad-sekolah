import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStudents, getTeachers, hashPassword, saveStudents, saveTeachers } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';

export default function PengaturanAkun() {
  const { user, refreshUser } = useAuth();
  const storeVersion = useStoreVersion();
  const MIN_PASSWORD_LENGTH = 8;

  const teacher = useMemo(
    () => getTeachers().find((item) => item.id === user?.id),
    [user, storeVersion]
  );
  const student = useMemo(
    () => getStudents().find((item) => item.id === user?.id),
    [user, storeVersion]
  );

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validatePassword = () => {
    if (!password) {
      setError('Kata sandi tidak boleh kosong.');
      return false;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`);
      return false;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak sama.');
      return false;
    }
    return true;
  };

  useEffect(() => {
    // Jangan isi field password dengan nilai ter-hash dari store — field
    // dikosongkan dan hanya di-hash saat user mengetik password baru.
    if (user?.role === 'teacher' && teacher) {
      setIdentifier(teacher.nip);
      return;
    }
    if (user?.role === 'student' && student) {
      setIdentifier(student.nis);
    }
  }, [user, teacher, student]);

  if (!user) return null;

  const handleSaveTeacher = async () => {
    if (!teacher) return;
    const nextNip = identifier.trim();
    if (!nextNip) {
      setError('NIP tidak boleh kosong.');
      return;
    }
    if (!validatePassword()) {
      return;
    }

    const teachers = getTeachers();
    const usedByOtherTeacher = teachers.some(
      (item) => item.id !== teacher.id && item.nip === nextNip
    );
    if (usedByOtherTeacher) {
      setError('NIP sudah digunakan guru lain.');
      return;
    }

    const hashedPassword = await hashPassword(password);
    const nextTeachers = teachers.map((item) =>
      item.id === teacher.id ? { ...item, nip: nextNip, password: hashedPassword } : item
    );

    saveTeachers(nextTeachers);
    refreshUser();
    setPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('Pengaturan akun guru berhasil diperbarui. Data admin ikut terbarui otomatis.');
  };

  const handleSaveStudent = async () => {
    if (!student) return;
    const nextNis = identifier.trim();
    if (!nextNis) {
      setError('NIS tidak boleh kosong.');
      return;
    }
    if (!validatePassword()) {
      return;
    }

    const students = getStudents();
    const usedByOtherStudent = students.some(
      (item) => item.id !== student.id && item.nis === nextNis
    );
    if (usedByOtherStudent) {
      setError('NIS sudah digunakan siswa lain.');
      return;
    }

    const hashedPassword = await hashPassword(password);
    const nextStudents = students.map((item) =>
      item.id === student.id ? { ...item, nis: nextNis, password: hashedPassword } : item
    );

    saveStudents(nextStudents);
    refreshUser();
    setPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('Pengaturan akun siswa berhasil diperbarui. Data admin ikut terbarui otomatis.');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Akun</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ubah {user.role === 'teacher' ? 'NIP' : 'NIS'} dan kata sandi akun Anda.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {user.role === 'teacher' ? 'NIP Baru' : 'NIS Baru'}
          </label>
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Kata Sandi Baru</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setMessage('');
                setError('');
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Minimal {MIN_PASSWORD_LENGTH} karakter.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setMessage('');
                setError('');
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
              aria-label={
                showConfirmPassword
                  ? 'Sembunyikan konfirmasi kata sandi'
                  : 'Tampilkan konfirmasi kata sandi'
              }
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}

        <button
          onClick={user.role === 'teacher' ? handleSaveTeacher : handleSaveStudent}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          <Save className="h-4 w-4" /> Simpan Pengaturan
        </button>
      </section>
    </div>
  );
}
