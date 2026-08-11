import { useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AdminPanelLoginProps {
  embedded: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<boolean>;
}

/**
 * Layar login admin PPDB.
 * State user/password/loginError dikelola lokal di sini — komponen induk
 * cukup menerima callback onLogin yang mengembalikan sukses/gagal.
 */
export default function AdminPanelLogin({ embedded, onClose, onLogin }: AdminPanelLoginProps) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState('');

  async function handleLogin() {
    const ok = await onLogin(user, pass);
    if (!ok) setLoginError('Username atau password salah.');
  }

  return (
    <div
      className={cn(
        embedded
          ? 'flex min-h-full items-center justify-center bg-white p-4'
          : 'fixed inset-0 z-50 flex items-center justify-center bg-neutral-100 p-4'
      )}
    >
      <div className="w-full max-w-md rounded-xl border border-black bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b border-black pb-3">
          <h2 className="text-sm font-bold tracking-wide text-black uppercase">Login Admin PPDB</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-black transition-colors hover:text-neutral-500"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Username
            </label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none placeholder:text-neutral-400"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-wide text-black uppercase">
              Password
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none placeholder:text-neutral-400"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          {loginError && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full rounded-md border border-black bg-black px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-neutral-800"
          >
            Masuk
          </button>
          <p className="text-center text-[10px] text-black">
            Gunakan username admin dan PIN yang dikonfigurasi sistem.
          </p>
        </div>
      </div>
    </div>
  );
}
