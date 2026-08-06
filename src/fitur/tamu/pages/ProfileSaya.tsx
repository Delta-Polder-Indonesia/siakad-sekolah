import { Mail, Shield, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileSaya() {
  const { user } = useAuth();

  const roleLabel =
    user?.role === 'teacher'
      ? 'Pegawai'
      : user?.role === 'student'
        ? 'Siswa'
        : user?.role === 'parent'
          ? 'Orang Tua'
          : user?.role === 'admin'
            ? 'Administrator'
            : 'Tamu';

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Profil Saya</h1>
        <p className="mt-1 text-sm text-slate-500">Informasi akun pengguna portal sekolah.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
            <UserCircle2 className="h-10 w-10 text-sky-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">{user?.name || 'User'}</p>
            <p className="text-sm text-slate-500">{roleLabel}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Email</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-slate-400" />
              {user?.email || '-'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Hak Akses
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Shield className="h-4 w-4 text-slate-400" />
              {roleLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
