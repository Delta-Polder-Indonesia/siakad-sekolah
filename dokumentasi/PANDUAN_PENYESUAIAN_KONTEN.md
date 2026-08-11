# 🛠️ PANDUAN PENYESUAIAN KONTEN — Portal SIAKAD (untuk Tim Teknis)

> Dokumen ini untuk **developer/teknisi** yang menyesuaikan template per sekolah.
> Identitas & data inti bisa diubah dari panel admin (tanpa koding) — lihat
> `PANDUAN_SETUP_SEKOLAH.md`. Dokumen ini berisi penyesuaian **mendalam**
> (konten halaman publik, jenjang, tema, deploy).

---

## A. Ringkasan: Apa yang Bisa Diubah TANPA Koding

| Kebutuhan | Lokasi | Cara |
|---|---|---|
| Nama sekolah, logo, kontak, jenjang, tahun ajaran | Panel admin → Sistem → Setup Sekolah | Form + unggah logo |
| Data guru/siswa/kelas | Panel admin → menu terkait | Form / import JSON |
| Backup & pindah data | Panel admin → Sistem → Data Sekolah | Ekspor/impor/reset |

---

## B. Identitas & Jenjang (file inti)

### `src/config/school.ts`
- `DEFAULT_SCHOOL_IDENTITY` → nilai bawaan saat aplikasi pertama dibuka.
  Ubah di sini agar setiap instalasi baru langsung memakai identitas sekolah
  yang dijual (bukan "SMA Negeri 1 Medan").

### `src/fitur/halaman/components/Profile/dataSekolah.ts`
- **SUMBER DATA UTAMA halaman publik**: `namaSekolah`, `npsn`, `alamat`,
  `telepon`, `jenjang` (SD/SMP/SMA/SMK), `tahunAjaran`, `visiMisi`,
  `strukturOrganisasi`, statistik GTK & siswa.
- Mengubah `jenjang` di sini = mengubah label program spesialisasi &
  komposisi konten (template sudah mendukung SD/SMP/SMA/SMK).
- Perubahan jenjang penuh yang mengubah struktur konten membutuhkan
  **build ulang**.

---

## C. Konten Halaman Publik (per sekolah)

Semua konten contoh berada di `src/fitur/halaman/` — ganti isinya sesuai
sekolah pembeli:

| Konten | File |
|---|---|
| Beranda (hero, layanan, testimoni, dll) | `src/fitur/halaman/data/beranda/*/data.ts` |
| Berita & artikel | `src/fitur/halaman/data/berita/data.ts` + `components/Berita/Berita0*.tsx` |
| Galeri | `src/fitur/halaman/data/galeri/data.ts` |
| Kegiatan sekolah | `src/fitur/halaman/data/kegiatanSekolah/data.ts` + `components/KegiatanSekolah/Strategis0*.tsx` |
| Program sekolah | `src/fitur/halaman/data/programSekolah/data.ts` + `components/ProgramSekolah/Program-*.tsx` |
| Program keahlian (SMK) | `src/fitur/halaman/data/programKeahlian/data.ts` + `components/ProgramKeahlian/REG-0*.tsx` |
| E-book / unduhan | `src/fitur/halaman/data/beranda/ebook/data.ts` + `components/Ebook/ebook_*.tsx` |
| Profil sekolah (sejarah, visi-misi, struktur) | `src/fitur/halaman/components/Profile/*` (VisiMisi, StrukturOrganisasi, TonggakSejarah, dataGuruPegawai.ts) |
| Sarana prasarana | `src/fitur/halaman/data/saranaPrasarana/data.ts` + `components/SaranaPrasarana/Facility0*.tsx` |
| Kalender akademik & libur | `src/fitur/halaman/components/KalenderAkademik/KalenderAkademiData/*.json` + `LiburNasionalData/liburNasional.ts` |
| Kontak | `src/fitur/halaman/data/kontak/data.ts` |

**Gambar** disimpan di `public/images/` — gunakan struktur folder sesuai
halamannya. **PDF/unduhan** di `public/download/`.

> 💡 Pola setiap file data: array objek dengan field jelas. Cukup salin
> strukturnya dan ganti isinya.

---

## D. Tema & Tampilan

| Kebutuhan | Lokasi |
|---|---|
| Warna aksen global | `src/index.css` (Tailwind v4 `@theme`) |
| Palet nama (chat, avatar) | `src/codewarna/color.json` & `warnaNama.ts` |
| Panduan CSS | `dokumentasi/panduan_global_css.md` |
| Judul halaman (HTML) | `index.html` (tag `<title>`) — *sejak fitur Setup Sekolah, judul browser otomatis mengikuti identitas* |

---

## E. Data Aplikasi & Mode Penyimpanan

### Mode Standar (default — tanpa server)
- Semua data tersimpan di `localStorage` browser masing-masing perangkat.
- `VITE_API_BASE_URL` **kosong** → mode ini aktif.
- Cocok untuk: sekolah kecil, demo, atau instalasi cepat.

### Mode Cloud (backend Express + PostgreSQL)
- Set `VITE_API_BASE_URL` ke URL backend → frontend memakai API
  (dengan fallback lokal bila server mati).
- Backend di `backend/` (Express + Prisma). Deploy ke Railway/Render + Neon
  (lihat `backend/README.md` & `PANDUAN_PERSIAPAN_SEKOLAH.md`).
- ⚠️ Saat ini baru sebagian modul yang punya endpoint API (auth, feedback,
  stats, dll). Modul lain (absensi, nilai, tugas, dll.) masih lokal —
  **peta pengembangan backend ada di `perencanaan_backend.md`**.

---

## F. Build & Deploy

```bash
npm install
npm run dev        # development (http://localhost:5173)
npm run build      # production build ke dist/
npm run preview    # cek hasil build
npm test           # vitest
```

| Hosting | Cara |
|---|---|
| **GitHub Pages** | Sudah ada workflow `.github/workflows/deploy.yml` — push ke `main` otomatis build & deploy. Base path `/nama-repo/` diatur otomatis. |
| **Netlify / Vercel** | Build command `npm run build`, publish `dist`. Base path otomatis `/`. |

> Setelah deploy, cek: login admin → Setup Sekolah → isi identitas → beres!

---

## G. Checklist Serah Terima ke Sekolah

- [ ] Identitas sekolah tampil di semua tempat (login/sidebar/footer/tab)
- [ ] Logo sekolah benar & tajam
- [ ] Data guru/siswa/kelas terisi (import berhasil)
- [ ] Login guru & siswa dicoba dari perangkat berbeda
- [ ] Ekspor data master → file tersimpan
- [ ] Konten halaman publik disesuaikan (atau dijadwalkan tahap 2)
- [ ] `PANDUAN_SETUP_SEKOLAH.md` diserahkan ke admin sekolah
