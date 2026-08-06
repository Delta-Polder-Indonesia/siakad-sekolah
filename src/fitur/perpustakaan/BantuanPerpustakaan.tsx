// src/fitur/perpustakaan/BantuanPerpustakaan.tsx
import { useState, useEffect, useCallback, useRef, useId } from 'react';
import { namaSekolah, emailDomain } from '../halaman/components/Profile/dataSekolah';
import {
  X,
  HelpCircle,
  BookOpen,
  UserCheck,
  Mail,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  ShieldCheck,
  MessageCircle,
  GraduationCap,
  User,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * FIX #1 — Nama sekolah disentralisasi.
 * Samakan dengan konstanta di LoginPerpustakaan & DashboardPerpustakaan.
 */
const SCHOOL_NAME = namaSekolah;
const LIBRARY_LABEL = `Perpustakaan Digital ${SCHOOL_NAME}`;

// ─── Data ─────────────────────────────────────────────────────────────────────

// FIX #11 — Data diangkat ke luar komponen agar tidak re-create tiap render

type FaqItem = { id: string; question: string; answer: string };

const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-login',
    question: 'Bagaimana cara login ke Perpustakaan?',
    answer:
      'Gunakan NISN dan password yang sama dengan Portal Akademik. Jika belum memiliki akun portal, silakan daftar melalui menu PPDB terlebih dahulu.',
  },
  {
    id: 'faq-password',
    question: 'Saya lupa password, apa yang harus dilakukan?',
    answer:
      'Password Perpustakaan terhubung dengan Portal Akademik. Silakan reset password melalui halaman login portal utama atau hubungi petugas Tata Usaha (TU) di sekolah.',
  },
  {
    id: 'faq-duration',
    question: 'Berapa lama masa peminjaman buku?',
    answer:
      'Masa peminjaman standar adalah 7 hari kerja. Perpanjangan dapat diajukan maksimal 2 kali jika buku tidak dipesan oleh anggota lain.',
  },
  {
    id: 'faq-guru',
    question: 'Apakah guru juga bisa mengakses sistem ini?',
    answer:
      'Ya. Guru dapat login menggunakan NIP dan password portal yang sama. Guru memiliki hak akses yang berbeda dari siswa.',
  },
  {
    id: 'faq-stok',
    question: 'Bagaimana jika buku yang ingin dipinjam stoknya habis?',
    answer:
      'Anda dapat memesan buku tersebut. Sistem akan memberi notifikasi ketika buku tersedia kembali.',
  },
];

const PANDUAN_STEPS = [
  {
    id: 'step-login',
    Icon: UserCheck,
    title: 'Login ke Sistem',
    desc: 'Masukkan NISN (siswa) atau NIP (guru) beserta password yang sama dengan Portal Akademik. Pastikan akun Anda sudah terdaftar di sistem sekolah.',
  },
  {
    id: 'step-cari',
    Icon: BookOpen,
    title: 'Cari & Pilih Buku',
    desc: 'Gunakan fitur pencarian atau jelajahi kategori yang tersedia. Klik buku untuk melihat detail lengkap, sinopsis, dan status ketersediaan stok.',
  },
  {
    id: 'step-pinjam',
    Icon: Clock,
    title: 'Ajukan Peminjaman',
    desc: 'Klik tombol Pinjam, pilih tanggal peminjaman dan tanggal pengembalian. Tunggu konfirmasi persetujuan dari petugas perpustakaan.',
  },
  {
    id: 'step-kembali',
    Icon: ShieldCheck,
    title: 'Kembalikan Buku',
    desc: 'Bawa buku fisik ke perpustakaan atau konfirmasi pengembalian melalui sistem. Denda keterlambatan akan dihitung secara otomatis oleh sistem.',
  },
] as const;

const KONTAK_ROWS = [
  {
    id: 'kontak-petugas',
    Icon: UserCheck,
    jabatan: 'Petugas Perpustakaan',
    nama: 'Ibu Sari Wulandari, S.Pd.',
    kontak: `perpustakaan@${emailDomain}`,
    jam: 'Senin – Jumat, 07.00 – 15.00 WIB',
    mono: true,
  },
  {
    id: 'kontak-email',
    Icon: Mail,
    jabatan: 'Email Resmi',
    nama: 'Sekretariat Perpustakaan',
    kontak: `perpustakaan@${emailDomain}`,
    jam: 'Respons 1×24 jam',
    mono: true,
  },
  {
    id: 'kontak-tu',
    Icon: AlertCircle,
    jabatan: 'Tata Usaha (TU)',
    nama: 'Reset Password & Akun',
    kontak: 'Ext. 101 – Ruang TU Lantai 1',
    jam: 'Senin – Jumat, 07.00 – 14.00 WIB',
    mono: false,
  },
] as const;

/**
 * FIX #9 — Kredensial demo dipisah & hanya tampil saat user
 * memilih untuk menampilkannya (toggle show/hide).
 */
const DEMO_GURU = [
  { id: 'g1', nama: 'Bapak Andi Pratama', username: '198501012010011001', password: 'guru123' },
  { id: 'g2', nama: 'Ibu Rina Kartika', username: '198701022012012002', password: 'guru123' },
  { id: 'g3', nama: 'Bapak Dedi Saputra', username: '198901032014013003', password: 'guru123' },
] as const;

const DEMO_SISWA = [
  { id: 's1', nama: 'Siti Rahma', username: '2024001', password: 'siswa123' },
  { id: 's2', nama: 'Budi Santoso', username: '2024002', password: 'siswa123' },
  { id: 's3', nama: 'Nabila Putri', username: '2024003', password: 'siswa123' },
] as const;

const SECURITY_NOTES = [
  {
    id: 'sec-sandi',
    label: 'Kerahasiaan Sandi',
    desc: 'Dilarang keras membagikan ataupun memperlihatkan kombinasi kata sandi Anda kepada pihak lain demi menghindari penyalahgunaan wewenang akses perpustakaan.',
  },
  {
    id: 'sec-sesi',
    label: 'Terminasi Sesi',
    desc: 'Pastikan Anda selalu menekan opsi Keluar Sistem secara sempurna setelah selesai mengoperasikan portal perpustakaan, terutama jika menggunakan perangkat komputer umum.',
  },
  {
    id: 'sec-pemulihan',
    label: 'Pemulihan Akun',
    desc: 'Apabila terjadi kendala hilangnya akses atau lupa kata sandi, segeralah melapor ke ruang Tata Usaha untuk dilakukan penyetelan ulang oleh petugas operator.',
  },
  {
    id: 'sec-tanggung',
    label: 'Tanggung Jawab Peminjaman',
    desc: 'Setiap peminjam wajib menjaga keutuhan dan kebersihan buku. Kerusakan atau kehilangan buku akan dikenakan sanksi sesuai peraturan yang berlaku.',
  },
] as const;

type TabId = 'faq' | 'panduan' | 'kontak' | 'akun';

const TAB_CONFIG: { id: TabId; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'faq', label: 'FAQ', Icon: HelpCircle },
  { id: 'panduan', label: 'Panduan', Icon: BookOpen },
  { id: 'kontak', label: 'Kontak', Icon: MessageCircle },
  { id: 'akun', label: 'Akun Uji Coba', Icon: Shield },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Baris tabel reusable */
const TableRow: React.FC<{
  cells: (string | React.ReactNode)[];
  mono?: boolean[];
}> = ({ cells, mono = [] }) => (
  <tr className="divide-x-0 border-t border-gray-200">
    {cells.map((cell, i) => (
      <td
        key={i}
        className={[
          'px-3 py-2.5 text-xs text-gray-800',
          mono[i] ? 'font-mono' : '',
          i === 0 ? 'font-semibold' : '',
        ].join(' ')}
      >
        {cell}
      </td>
    ))}
  </tr>
);

/** Judul seksi berformat surat kabar */
const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="mb-5 border-b-2 border-gray-900 pb-1 font-sans text-sm font-black tracking-widest text-gray-900 uppercase">
    {children}
  </h3>
);

// ─── Focus Trap Hook ──────────────────────────────────────────────────────────

/**
 * FIX #3 — Focus trap agar Tab key tidak keluar dari modal.
 */
function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const el = ref.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    el.addEventListener('keydown', handleKeyDown);
    // Pindahkan fokus ke elemen pertama saat modal buka
    first?.focus();

    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [active, ref]);
}

// ─── Component ────────────────────────────────────────────────────────────────

interface BantuanPerpustakaanProps {
  onClose: () => void;
}

export default function BantuanPerpustakaan({ onClose }: BantuanPerpustakaanProps) {
  const uid = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `${uid}-bantuan-title`;

  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('faq');
  const [showPasswords, setShowPasswords] = useState(false); // FIX #9
  const scrollRef = useRef<HTMLDivElement>(null); // FIX #8

  // FIX #3 — focus trap
  useFocusTrap(dialogRef, true);

  // FIX #7 — Escape menutup modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // FIX #8 — Reset scroll ke atas saat ganti tab
  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // FIX #12 + #15 — id-based toggle, useCallback
  const toggleFaq = useCallback((id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    /*
     * FIX #2 — role="dialog", aria-modal, aria-labelledby
     */
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[300] flex flex-col overflow-hidden bg-white font-sans text-gray-900"
    >
      {/* ── Scrollable content ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-3xl px-4 pt-2 pb-16 sm:px-6">
          {/* ── Banner ── */}
          {/* FIX #14 — Hapus px-24 kaku, ganti dengan text-center murni */}
          <div className="relative mb-6 border-b-4 border-double border-gray-900 pt-12 pb-5 text-center sm:pt-10">
            {/* FIX #6 — aria-label deskriptif */}
            <button
              onClick={onClose}
              aria-label="Tutup halaman bantuan perpustakaan"
              className="absolute top-3 right-0 flex cursor-pointer items-center gap-1.5 rounded-xl border-2 border-gray-900 bg-white px-3 py-2 text-xs font-bold tracking-wider text-gray-900 uppercase transition hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tutup</span>
            </button>

            <p className="mb-1 text-xs font-bold tracking-widest text-gray-500 uppercase">
              Pusat Bantuan · {LIBRARY_LABEL}
            </p>
            {/* FIX #2 — id untuk aria-labelledby */}
            <h1
              id={titleId}
              className="mb-2 text-2xl font-black tracking-tight text-gray-900 uppercase sm:text-3xl md:text-4xl"
            >
              Bantuan Perpustakaan
            </h1>
            <p className="mx-auto max-w-xl text-sm text-gray-600 italic">
              Panduan Lengkap, FAQ, dan Informasi Kontak Layanan {LIBRARY_LABEL}
            </p>
          </div>

          {/* ── Intro ── */}
          {/* FIX #13 — Hapus kelas Tailwind invalid first-letter:line-height-none */}
          <p className="mb-6 border-b border-gray-300 pb-6 text-justify text-sm leading-relaxed text-gray-700 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:leading-none first-letter:font-black first-letter:text-gray-900">
            Sistem perpustakaan digital ini dirancang untuk memudahkan seluruh warga sekolah dalam
            mengelola peminjaman, pengembalian, dan pencarian koleksi buku secara daring. Demi
            kelancaran penggunaan, diharapkan seluruh pengguna membaca panduan dan informasi berikut
            dengan saksama.
          </p>

          {/* ── Tab Nav ── */}
          {/*
           * FIX #5 — role="tablist", role="tab", aria-selected
           * FIX #10 — font konsisten (font-sans di seluruh komponen)
           */}
          <div
            role="tablist"
            aria-label="Navigasi bantuan"
            className="mb-6 flex flex-wrap justify-center gap-2 border-b border-gray-900 pb-4"
          >
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  className={[
                    'flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2',
                    'text-xs font-bold tracking-wider uppercase transition-all',
                    'focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                    isActive
                      ? 'border-gray-900 bg-gray-900 text-white focus-visible:ring-gray-900'
                      : 'border-gray-900 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500',
                  ].join(' ')}
                >
                  <tab.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════════════
              TAB PANELS
              FIX #5 — role="tabpanel", aria-labelledby
          ═══════════════════════════════════════════════════════ */}

          {/* ── FAQ ── */}
          <div
            id="panel-faq"
            role="tabpanel"
            aria-labelledby="tab-faq"
            hidden={activeTab !== 'faq'}
            className="space-y-5 pb-6"
          >
            <SectionHeading>I. Pertanyaan yang Sering Diajukan</SectionHeading>

            <dl className="space-y-3">
              {FAQ_LIST.map((faq) => {
                const isOpen = openFaqId === faq.id;
                const panelId = `${uid}-faq-panel-${faq.id}`;
                const triggerId = `${uid}-faq-btn-${faq.id}`;

                return (
                  /*
                   * FIX #4 — aria-expanded, aria-controls, role="term"/"definition"
                   * FIX #12 — key={faq.id} bukan index
                   */
                  <div key={faq.id} className="rounded-xl border border-gray-200 bg-gray-50">
                    <dt>
                      <button
                        id={triggerId}
                        onClick={() => toggleFaq(faq.id)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="flex w-full cursor-pointer items-start justify-between gap-3 px-4 py-3.5 text-left focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none focus-visible:ring-inset"
                      >
                        <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <HelpCircle
                            className="mt-px h-4 w-4 shrink-0 text-gray-700"
                            aria-hidden="true"
                          />
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp
                            className="h-4 w-4 shrink-0 text-gray-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDown
                            className="h-4 w-4 shrink-0 text-gray-500"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </dt>
                    <dd
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      hidden={!isOpen}
                      className="border-t border-gray-200 px-4 pt-3 pb-4"
                    >
                      <p className="border-l-2 border-gray-900 pl-4 text-sm leading-relaxed text-gray-700">
                        {faq.answer}
                      </p>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {/* ── Panduan ── */}
          <div
            id="panel-panduan"
            role="tabpanel"
            aria-labelledby="tab-panduan"
            hidden={activeTab !== 'panduan'}
            className="space-y-5 pb-6"
          >
            <SectionHeading>II. Panduan Penggunaan Sistem</SectionHeading>

            <ol className="space-y-4" aria-label="Langkah penggunaan sistem">
              {PANDUAN_STEPS.map((step, i) => (
                <li key={step.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 uppercase">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-black text-white"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <step.Icon className="h-4 w-4 text-gray-700" aria-hidden="true" />
                    {step.title}
                  </h4>
                  <p className="border-l-2 border-gray-900 pl-4 text-sm leading-relaxed text-gray-700">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Kontak ── */}
          <div
            id="panel-kontak"
            role="tabpanel"
            aria-labelledby="tab-kontak"
            hidden={activeTab !== 'kontak'}
            className="space-y-6 pb-6"
          >
            <SectionHeading>III. Informasi Kontak Layanan</SectionHeading>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {['Jabatan', 'Nama', 'Kontak / Lokasi', 'Jam Operasional'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-3 py-2.5 text-xs font-bold text-gray-700 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KONTAK_ROWS.map((row) => (
                    <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-2 text-xs font-semibold text-gray-900">
                          <row.Icon
                            className="h-3.5 w-3.5 shrink-0 text-gray-600"
                            aria-hidden="true"
                          />
                          {row.jabatan}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-800">{row.nama}</td>
                      <td
                        className={`px-3 py-2.5 text-xs text-gray-800 ${row.mono ? 'font-mono' : ''}`}
                      >
                        {row.kontak}
                      </td>
                      <td className="px-3 py-2.5 text-right text-xs text-gray-600">{row.jam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside role="note" className="rounded-xl border-2 border-gray-900 bg-amber-50 p-4">
              <h4 className="mb-2 text-center text-xs font-black tracking-wide text-gray-900 uppercase">
                ⚠ Pelaporan Kendala Teknis
              </h4>
              <p className="text-justify text-xs leading-relaxed text-gray-800">
                Untuk masalah teknis sistem, silakan laporkan ke petugas perpustakaan dengan
                menyertakan tangkapan layar (screenshot) jika memungkinkan. Laporan dengan bukti
                visual akan diproses lebih cepat.
              </p>
            </aside>
          </div>

          {/* ── Akun Uji Coba ── */}
          <div
            id="panel-akun"
            role="tabpanel"
            aria-labelledby="tab-akun"
            hidden={activeTab !== 'akun'}
            className="space-y-6 pb-6"
          >
            <SectionHeading>IV. Lampiran Akun Uji Coba (Demo)</SectionHeading>

            {/*
             * FIX #9 — Peringatan konteks & toggle show/hide password
             */}
            <aside role="note" className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-900">
                ⚠ Perhatian: Data berikut hanya untuk keperluan pengujian internal. Jangan bagikan
                di luar lingkungan pengembangan.
              </p>
            </aside>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 italic">
                Klik tombol di samping untuk menampilkan password demo.
              </p>
              <button
                type="button"
                onClick={() => setShowPasswords((v) => !v)}
                aria-pressed={showPasswords}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none"
              >
                {showPasswords ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> Sembunyikan
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Tampilkan Password
                  </>
                )}
              </button>
            </div>

            {/* Tenaga Pendidik */}
            <section aria-labelledby="heading-guru">
              <h4
                id="heading-guru"
                className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 uppercase"
              >
                <GraduationCap className="h-4 w-4 text-gray-700" aria-hidden="true" />
                A. Tenaga Pendidik (Guru)
              </h4>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {['Nama', 'NIP (Username)', 'Password'].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="px-3 py-2.5 text-xs font-bold text-gray-700 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_GURU.map((row) => (
                      <TableRow
                        key={row.id}
                        cells={[row.nama, row.username, showPasswords ? row.password : '••••••••']}
                        mono={[false, true, true]}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Siswa Aktif */}
            <section aria-labelledby="heading-siswa">
              <h4
                id="heading-siswa"
                className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 uppercase"
              >
                <User className="h-4 w-4 text-gray-700" aria-hidden="true" />
                B. Siswa Aktif
              </h4>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {['Nama', 'NIS (Username)', 'Password'].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="px-3 py-2.5 text-xs font-bold text-gray-700 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_SISWA.map((row) => (
                      <TableRow
                        key={row.id}
                        cells={[row.nama, row.username, showPasswords ? row.password : '••••••••']}
                        mono={[false, true, true]}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* ── Maklumat Keamanan (selalu tampil) ── */}
          <section
            aria-labelledby="heading-security"
            className="mt-2 border-t-2 border-gray-900 pt-6 pb-8"
          >
            <div className="rounded-xl border-2 border-gray-900 p-4">
              <h4
                id="heading-security"
                className="mb-3 text-center text-xs font-black tracking-wide text-gray-900 uppercase"
              >
                ⚠ Maklumat Penting Perlindungan Data
              </h4>
              <ul className="space-y-2.5" role="list">
                {SECURITY_NOTES.map((note) => (
                  <li key={note.id} className="flex gap-2.5 text-xs text-gray-800">
                    <span
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-bold text-gray-900">{note.label}:</strong> {note.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── Footer catatan ── */}
          <p className="mt-2 text-center text-[11px] text-gray-400 italic">
            Layanan Bantuan Terintegrasi · {LIBRARY_LABEL}
          </p>
        </div>
      </div>
    </div>
  );
}
