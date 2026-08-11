/**
 * TAB SETUP SEKOLAH — identitas sekolah tanpa menyentuh kode.
 *
 * Ini fitur kunci template universal: admin mengisi nama sekolah, logo,
 * kontak, jenjang & tahun ajaran → tersimpan di localStorage → langsung
 * berlaku di seluruh aplikasi (Sidebar, Footer, Login, judul browser,
 * buku tamu, dll).
 *
 * Catatan:
 *  - Perubahan di sini bersifat BRANDING/IDENTITAS. Isi konten (berita,
 *    sejarah, visi-misi) tetap dikelola per-sekolah di file data.
 *  - Perubahan jenjang penuh (SD→SMK) yang mengubah struktur konten
 *    membutuhkan build ulang (ubah `jenjang` di dataSekolah.ts).
 */
import { useState } from 'react';
import { Building2, ImagePlus, RotateCcw, Save, Info } from 'lucide-react';
import { useSchoolIdentity } from '../../../hooks/useSchoolIdentity';
import { updateSchoolIdentity, resetSchoolIdentity, type JenjangSekolah } from '../../../config/school';
import { useToast } from '../../../components/ui';

const JENJANG_OPTIONS: Array<{ value: JenjangSekolah; label: string }> = [
  { value: 'SD', label: 'SD — Sekolah Dasar' },
  { value: 'SMP', label: 'SMP — Sekolah Menengah Pertama' },
  { value: 'SMA', label: 'SMA — Sekolah Menengah Atas' },
  { value: 'SMK', label: 'SMK — Sekolah Menengah Kejuruan' },
];

/** Maks ukuran logo yang diizinkan (300KB) — batas aman localStorage. */
const MAX_LOGO_BYTES = 300 * 1024;

interface TabSetupSekolahProps {
  setNotice?: (message: string) => void;
}

export default function TabSetupSekolah({ setNotice }: TabSetupSekolahProps) {
  const { showToast } = useToast();
  const identity = useSchoolIdentity();

  const [form, setForm] = useState({
    namaSekolah: identity.namaSekolah,
    singkatan: identity.singkatan,
    jenjang: identity.jenjang,
    tahunAjaran: identity.tahunAjaran,
    npsn: identity.npsn,
    alamat: identity.alamat,
    telepon: identity.telepon,
    emailDomain: identity.emailDomain,
  });
  const [logo, setLogo] = useState<string | null>(null); // dataURL baru (null = tidak diubah)
  const [logoError, setLogoError] = useState('');

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleLogoFile = (file: File | undefined | null) => {
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Logo terlalu besar. Maksimal 300KB (gunakan PNG/JPG kecil).');
      return;
    }
    setLogoError('');
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result ?? ''));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    try {
      const merged = updateSchoolIdentity({
        ...form,
        ...(logo ? { logo } : {}),
      });
      setForm({
        namaSekolah: merged.namaSekolah,
        singkatan: merged.singkatan,
        jenjang: merged.jenjang,
        tahunAjaran: merged.tahunAjaran,
        npsn: merged.npsn,
        alamat: merged.alamat,
        telepon: merged.telepon,
        emailDomain: merged.emailDomain,
      });
      setLogo(null);
      showToast('success', 'Identitas sekolah tersimpan & langsung berlaku.');
      setNotice?.('Identitas sekolah berhasil diperbarui.');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Gagal menyimpan identitas sekolah.');
    }
  };

  const handleReset = () => {
    if (!window.confirm('Kembalikan identitas ke bawaan template? Perubahan Anda akan hilang.')) return;
    resetSchoolIdentity();
    setForm({
      namaSekolah: identity.namaSekolah,
      singkatan: identity.singkatan,
      jenjang: identity.jenjang,
      tahunAjaran: identity.tahunAjaran,
      npsn: identity.npsn,
      alamat: identity.alamat,
      telepon: identity.telepon,
      emailDomain: identity.emailDomain,
    });
    setLogo(null);
    showToast('success', 'Identitas dikembalikan ke bawaan template.');
  };

  const logoPreview = logo ?? identity.logo;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 p-5">
      {/* Info */}
      <div className="flex items-start gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 p-3 text-[11px] leading-relaxed text-blue-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Ubah identitas sekolah di sini — <b>tanpa perlu menyentuh kode</b>. Perubahan langsung
          berlaku di sidebar, halaman login, footer, judul browser, dan buku tamu. Simpan data
          sekali, aplikasi siap dipakai sekolah lain.
        </p>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-4 rounded-xl border-2 border-black bg-white p-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-black bg-neutral-50 p-1">
          {logoPreview.startsWith('data:') ? (
            <img src={logoPreview} alt="Logo sekolah" className="h-full w-full object-contain" />
          ) : (
            <img
              src={logoPreview}
              alt="Logo sekolah"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-black uppercase">Logo Sekolah</p>
          <p className="mt-0.5 text-[10px] text-neutral-500">
            PNG/JPG maks. 300KB. Logo tersimpan di browser admin ini.
          </p>
          <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-black px-3 py-1.5 text-[11px] font-bold text-black transition-colors hover:bg-black hover:text-white">
            <ImagePlus className="h-3.5 w-3.5" />
            {logo ? 'Ganti Logo' : 'Unggah Logo'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                handleLogoFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
          {logoError && <p className="mt-1 text-[10px] font-bold text-red-600">{logoError}</p>}
        </div>
      </div>

      {/* Form identitas */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border-2 border-black bg-white p-4 sm:grid-cols-2">
        <Field label="Nama Sekolah" full>
          <input
            value={form.namaSekolah}
            onChange={(e) => set('namaSekolah', e.target.value)}
            placeholder="contoh: SMA Negeri 1 Medan"
            className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          />
        </Field>

        <Field label="Singkatan / Nama Umum">
          <input
            value={form.singkatan}
            onChange={(e) => set('singkatan', e.target.value)}
            placeholder="contoh: SMAN 1 Medan"
            className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          />
        </Field>

        <Field label="Jenjang">
          <select
            value={form.jenjang}
            onChange={(e) => set('jenjang', e.target.value as JenjangSekolah)}
            className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          >
            {JENJANG_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tahun Ajaran">
          <input
            value={form.tahunAjaran}
            onChange={(e) => set('tahunAjaran', e.target.value)}
            placeholder="contoh: 2026/2027"
            className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          />
        </Field>

        <Field label="NPSN">
          <input
            value={form.npsn}
            onChange={(e) => set('npsn', e.target.value)}
            placeholder="8 digit NPSN"
            className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          />
        </Field>

        <Field label="Telepon">
          <input
            value={form.telepon}
            onChange={(e) => set('telepon', e.target.value)}
            placeholder="contoh: (061) 4510803"
            className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          />
        </Field>

        <Field label="Domain Email" full>
          <input
            value={form.emailDomain}
            onChange={(e) => set('emailDomain', e.target.value)}
            placeholder="contoh: sman1medan.sch.id (email: info@domain)"
            className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          />
        </Field>

        <Field label="Alamat" full>
          <textarea
            value={form.alamat}
            onChange={(e) => set('alamat', e.target.value)}
            rows={2}
            placeholder="Alamat lengkap sekolah"
            className="w-full resize-none rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
          />
        </Field>
      </div>

      {/* Aksi */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-md border-2 border-black px-4 py-2 text-[11px] font-bold text-black transition-colors hover:bg-neutral-100"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset ke Bawaan
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-black px-5 py-2 text-[11px] font-bold text-white transition-colors hover:bg-neutral-800"
        >
          <Save className="h-3.5 w-3.5" /> Simpan Identitas Sekolah
        </button>
      </div>

      <div className="flex items-start gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-900">
        <Building2 className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <b>Tips untuk penjualan template:</b> setelah menyimpan identitas sekolah pembeli,
          lakukan <b>Reset Data Demo</b> (menu Data) agar data contoh guru/siswa tidak ikut
          terbawa, lalu import data sekolah pembeli.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  full = false,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-1 block text-[10px] font-bold tracking-wide text-neutral-600 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
