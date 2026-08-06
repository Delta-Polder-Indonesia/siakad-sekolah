import React from 'react';
import type { NavItem } from '../fitur/halaman/types';
import {
  namaSekolahUppercase,
  alamatLengkap,
  telepon,
  email,
  namaJenjang,
  jenjang,
} from '../fitur/halaman/components/Profile/dataSekolah';

interface FooterProps {
  onNavigate?: (page: NavItem) => void;
}

interface SocialLink {
  label: string;
  icon: string;
  href: string;
}

interface BottomNavLink {
  label: string;
  menu: NavItem;
}

// Data Eksternal Disimpan di Luar Komponen untuk Mencegah Re-allocation saat Render
const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Twitter', icon: 'twitter.png', href: '#' },
  { label: 'Facebook', icon: 'facebook.png', href: '#' },
  { label: 'Instagram', icon: 'Instagram.png', href: '#' },
];

const EXTERNAL_LINKS: string[] = [
  'Kementerian Pendidikan Dasar dan Menengah',
  `PPDB ${namaSekolahUppercase}`,
  `e-Perpus ${namaSekolahUppercase}`,
  `e-Lab ${namaSekolahUppercase}`,
];

const NEWS_TITLES: string[] = [
  'PELAKSANAAN ASESMEN NASIONAL BERBASIS KOMPUTER (ANBK) TAHUN AJARAN 2026/2027',
  `DIES NATALIS ${namaSekolahUppercase} KE 49 & AMBISI SEKOLAH DIGITAL`,
];

export default function ProgramFooter({ onNavigate }: FooterProps) {
  const bottomNavLinks: BottomNavLink[] = [
    { label: 'Beranda', menu: 'Beranda' as NavItem },
    { label: 'Program Keahlian', menu: 'Program Keahlian' as NavItem },
    { label: 'Program Sekolah', menu: 'Program Sekolah' as NavItem },
    { label: 'Kontak Kami', menu: 'Kontak' as NavItem },
  ];

  return (
    <footer className="mt-auto">
      <div className="grid grid-cols-1 gap-6 bg-gradient-to-r from-[#12366a] to-[#0f234d] px-6 py-6 text-xs text-gray-300 sm:grid-cols-2 md:grid-cols-4">
        {/* Logo Instansi */}
        <div className="flex items-center gap-6 pb-0 md:col-span-4">
          <a
            href="https://www.kemendikdasmen.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            title="Kemendikdasmen"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/Dashboard/gambar-3.png`}
              alt="Tut Wuri Handayani"
              className="h-12 w-auto cursor-pointer object-contain transition-opacity hover:opacity-80"
            />
          </a>

          <a
            href="https://rumah.pendidikan.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            title="Rumah Pendidikan"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/Dashboard/logo-rumah-pendidikan.png`}
              alt="Rumah Pendidikan"
              className="h-12 w-auto cursor-pointer object-contain transition-opacity hover:opacity-80"
            />
          </a>

          <a
            href="https://sekolah.data.kemendikdasmen.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            title="Sekolah Kita"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/Dashboard/logo-sekolah-kita-white.svg`}
              alt="Sekolah Kita"
              className="h-12 w-auto cursor-pointer object-contain transition-opacity hover:opacity-80"
            />
          </a>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold text-white uppercase">
            Social Media Kami
          </h4>
          <p className="mb-3 text-[11px] text-gray-300">
            Ayo follow dan ikuti informasi seputar kegiatan {namaSekolahUppercase} di media sosial
            kami.
          </p>
          <ul className="space-y-2 text-[11px] text-amber-300">
            {SOCIAL_LINKS.map(({ label, icon, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}images/SosialMedia/${icon}`}
                    alt={label}
                    className="h-4 w-4 object-contain"
                  />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Tentang */}
        <div>
          <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold text-white uppercase">
            Tentang {namaSekolahUppercase}
          </h4>
          <p className="text-justify text-[11px] leading-relaxed text-gray-300">
            {namaSekolahUppercase} merupakan salah satu lembaga pendidikan{' '}
            {namaJenjang[jenjang].toLowerCase()} negeri yang berkomitmen menghasilkan lulusan
            unggul, berintegritas, dan berdaya saing tinggi melalui penguatan karakter serta
            implementasi teknologi digital.
          </p>
          <p className="mt-3 space-y-1 text-[11px] leading-relaxed text-gray-300">
            <span className="block">{alamatLengkap}</span>
            <span className="block">Telepon: {telepon}</span>
            <span className="block">Email: {email}</span>
          </p>
        </div>

        {/* Link Tautan */}
        <div>
          <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold text-white uppercase">
            Link Tautan Kami
          </h4>
          <ul className="space-y-1 text-[11px] text-amber-300">
            {EXTERNAL_LINKS.map((label) => (
              <li key={label}>
                <button type="button" className="cursor-pointer text-left hover:underline">
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Informasi Terkini */}
        <div>
          <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold text-white uppercase">
            Informasi Terkini
          </h4>
          <ul className="space-y-2 text-[11px] text-gray-300">
            {NEWS_TITLES.map((title) => (
              <li key={title}>
                <button
                  type="button"
                  onClick={() => onNavigate?.('Berita' as NavItem)}
                  className="line-clamp-2 cursor-pointer text-left hover:underline"
                >
                  {title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="space-y-1 bg-[#0b1f46] px-4 py-4 text-center text-[11px] text-gray-300">
        <div className="mb-1 flex flex-wrap justify-center gap-3 text-xs text-white">
          {bottomNavLinks.map(({ label, menu }, idx, arr) => (
            <span key={label} className="inline-flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate?.(menu)}
                className="cursor-pointer hover:underline"
              >
                {label}
              </button>
              {idx < arr.length - 1 && <span className="text-white/40">|</span>}
            </span>
          ))}
        </div>
        <p>Copyright All Rights Reserved TIM ICT 2017 - 2026, {namaSekolahUppercase}</p>
        <p className="text-[10px] text-blue-200/60">Proudly powered by React & Tailwind CSS</p>
      </div>
    </footer>
  );
}
