import React, { memo, useState } from 'react';
import { LOGIN_ILLUSTRATION, LOGIN_ILLUSTRATION_WEBP, Z_INDEX } from './constants';

interface LoginIllustrationProps {
  isOpen: boolean;
}

/**
 * Panel foto/pengumuman di sebelah KIRI panel login.
 * - Menampilkan foto full (cocok untuk banner pengumuman siswa)
 * - Muncul bersama panel login (fade in)
 * - Menempati sisa layar di kiri panel (viewport minus 440px)
 * - Sembunyi otomatis di layar < lg (1024px)
 *
 * 💡 Untuk ganti gambar pengumuman:
 *   Edit LOGIN_ILLUSTRATION di file constants.ts
 */
const LoginIllustration = memo<LoginIllustrationProps>(({ isOpen }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      aria-hidden="true"
      style={{ zIndex: Z_INDEX.loginIllustration }}
      className={`fixed top-0 bottom-0 left-0 hidden bg-slate-900 transition-opacity duration-500 ease-out lg:block ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Wrapper dengan lebar tepat (viewport - 440px lebar panel login) */}
      <div className="relative h-full overflow-hidden" style={{ width: 'calc(100vw - 440px)' }}>
        {isOpen && !hasError ? (
          <picture>
            <source srcSet={LOGIN_ILLUSTRATION_WEBP} type="image/webp" />
            <img
              src={LOGIN_ILLUSTRATION}
              alt=""
              className="h-full w-full object-cover transition-opacity duration-300"
              loading="lazy"
              decoding="async"
              width={960}
              height={720}
              onError={() => setHasError(true)}
            />
          </picture>
        ) : !isOpen ? null : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-12 text-center text-slate-400">
            <p className="text-sm font-medium tracking-wide">
              Portal Layanan Terpadu Siswa & Akademik
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

LoginIllustration.displayName = 'LoginIllustration';

export default LoginIllustration;
