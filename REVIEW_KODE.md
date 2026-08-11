# 📋 Laporan Review Kode — SIAKAD Sekolah

**Repo:** `Delta-Polder-Indonesia/siakad-sekolah`
**Tanggal review:** 11 Agustus 2026
**Fokus:** Kualitas kode (struktur, typing, duplikasi, kebersihan repo, best practices)
**Status:** ✅ Review selesai + perbaikan langsung diterapkan (belum di-commit)

---

## 1. Ringkasan Eksekutif

Proyek ini adalah SIAKAD (Sistem Informasi Akademik) yang cukup ambisius:
- **Frontend:** React 19 + Vite 7 + Tailwind 4 + Zustand (±88.7 ribu baris TS/TSX, 858 file)
- **Backend:** Express + Prisma + JWT + Zod, terstruktur rapi per-module dengan 5 fase implementasi
- **Kualitas dasar bagus:** typecheck & build lolos di FE dan BE, 371 test (251 FE + 120 BE) lolos setelah perbaikan, lint 0 error

**Temuan utama sebelum perbaikan:**
| # | Temuan | Severity |
|---|--------|----------|
| 1 | 2 model Prisma (`Feedback`, `SessionToken`) **tidak punya migration** → deploy fresh akan rusak | 🔴 Kritis |
| 2 | `env.ts` memakai `process.exit(1)` → 4 file test backend tidak bisa jalan sama sekali | 🔴 Kritis |
| 3 | `schema.prisma` provider `sqlite`, padahal migration & lock file PostgreSQL | 🟠 Tinggi |
| 4 | `env.example` berisi kredensial default & Google Client ID nyata | 🟠 Tinggi |
| 5 | Arsitektur **dual data layer** (mock localStorage vs API) — mayoritas fitur belum tersambung backend | 🟠 Tinggi |
| 6 | Banyak file duplikat yang sudah **berbeda isi** (drift) | 🟠 Tinggi |
| 7 | Komponen raksasa 700–1.377 baris ("god component") | 🟠 Tinggi |
| 8 | `vite.log` ter-commit, `.gitignore` aneh (ignore folder yang sudah di-track) | 🟡 Sedang |
| 9 | 135 warning ESLint `no-explicit-any` | 🟡 Sedang |
| 10 | Commit message semua "update", tidak ada konvensi | 🟡 Sedang |

---

## 2. Temuan Detail

### 🔴 KRITIS

#### 2.1 Model `Feedback` & `SessionToken` tanpa migration
Test `backend/src/utils/migration.test.ts` mendeteksi ini (gagal), dan verifikasi saya mengonfirmasi:
- `schema.prisma` punya 27 model, tapi hanya 25 yang punya `CREATE TABLE` di migration
- `Feedback` (fitur feedback publik) & `SessionToken` (registry sesi untuk "logout semua perangkat") **tidak ada tabelnya di migration mana pun**
- Dampak: `prisma migrate deploy` di environment baru → query ke kedua tabel akan error runtime; di production yang sudah jalan, tabelnya hanya ada karena `prisma db push` manual

> ✅ **DIPERBAIKI** — migration `20260811000000_add_feedback_sessiontoken` dibuat (DDL persis gaya Prisma PostgreSQL).

#### 2.2 `process.exit(1)` di `src/config/env.ts`
Saat env var wajib kurang (mis. `DATABASE_URL`, `JWT_SECRET`), modul memanggil `process.exit(1)`.
- Karena `logger.ts` dan `app.ts` meng-import `env.ts`, **semua test yang menyentuh chain itu ikut mematikan test runner** — 4 file test gagal load: `app.integration.test.ts`, `retention.test.ts`, `tokenManager.test.ts`, `dataRetention.service.test.ts`
- Anti-pattern: modul library tidak boleh mematikan proses; cukup `throw` agar caller/test bisa menangkap

> ✅ **DIPERBAIKI** — `process.exit` → `throw new Error(...)` + `setupEnv.ts` (env dummy untuk test) didaftarkan di `vitest.config.ts`. Semua 10 file test backend kini jalan.

---

### 🟠 TINGGI

#### 2.3 Provider DB inkonsisten: `sqlite` vs `postgresql`
- `schema.prisma` → `provider = "sqlite"` (diubah dari postgresql di commit "update bagian halaman")
- `migration_lock.toml` → `postgresql`; semua migration SQL → sintaks PostgreSQL; `ENV_DOCUMENTATION.md` → PostgreSQL
- Dampak: `prisma migrate dev` ke depan akan **membangkitkan SQL SQLite yang tidak kompatibel** dengan migration Postgres yang ada. Test `migration_lock` bahkan mewajibkan postgresql.

> ✅ **DIPERBAIKI** — provider dikembalikan ke `postgresql` (konsisten dengan lock file, migration, dan dokumentasi). Catatan: jika Anda sengaja pakai SQLite untuk demo lokal, pisahkan lewat `schema.prisma` terpisah, jangan di file utama.

#### 2.4 `env.example` berisi kredensial nyata
- `VITE_GOOGLE_CLIENT_ID=378551540056-...apps.googleusercontent.com` (client ID asli)
- `VITE_ADMIN_USERNAME=admin` / `VITE_ADMIN_PASSWORD=admin` (kredensial default)
- Inkonsistensi: frontend memakai `VITE_ADMIN_PIN` (tidak didokumentasikan), backend memakai `ADMIN_USERNAME/ADMIN_PASSWORD` (min. 8 karakter — jadi nilai `admin` di file template **pasti ditolak** oleh backend)

> ✅ **DIPERBAIKI** — `env.example` diubah jadi template placeholder + variabel backend yang hilang ditambahkan (`DATABASE_URL`, `JWT_SECRET`, dll).

#### 2.5 Dual data layer: mock localStorage vs API
- `src/data/store/core/db.ts` (530 baris) = database mock berbasis `localStorage` + seed
- Seluruh Zustand store membaca dari mock ini; API backend (`src/services/*`) hanya dipakai bila `VITE_API_BASE_URL` di-set (`hasApi`)
- Hanya **2 file fitur** yang benar-benar memakai API (`FloatingNav`, `PengaturanAkun`) — sisanya berjalan di mode mock
- Dampak: backend yang sudah dibangun 5 fase hanya ~5% tersambung ke frontend; data mock bisa "menipu" saat demo (seolah-olah fitur jalan padahal tidak ada persistensi nyata)

> ⚠️ **TIDAK DIPERBAIKI** (butuh keputusan arsitektur) — lihat rekomendasi §5.

#### 2.6 Duplikasi kode yang sudah drift (isi berbeda)
| Pasangan file | FE (baris) | BE/API (baris) |
|---|---|---|
| `feedbackService.ts` (`src/data/services` vs `src/services`) | 240 | 146 |
| `ppdbService.ts` (`src/data/services` vs `src/services`) | 53 | 323 |
| `passwordValidator.ts` (FE vs BE) | berbeda | berbeda |
| `utils.ts`, `helpers.ts`, `logger.ts`, `performance.ts`, `types.ts`, `ErrorBoundary`, `AgendaWidget`, dll | duplikat nama di beberapa folder | |

Masalah: perbaikan di satu versi tidak otomatis ke versi lain → bug tersembunyi.

> ⚠️ **TIDAK DIPERBAIKI** (perlu keputusan: hapus versi mock atau versi API) — lihat §5.

#### 2.7 God components (700–1.377 baris)
| File | Baris |
|---|---|
| `src/fitur/penerimaan-siswa-baru/AdminPanel.tsx` | 1.377 |
| `src/fitur/bersama/TugasKonten/DiskusiTugas.tsx` | 1.287 |
| `src/fitur/orang-tua/ProfileOrangTuaPage.tsx` | 1.048 |
| `src/fitur/halaman/components/KalenderAkademik/DasborKalenderAkademik.tsx` | 921 |
| `src/fitur/halaman/components/KalenderAkademik/AgendaPage.tsx` | 890 |
| `src/fitur/penerimaan-siswa-baru/PPDBForm.tsx` | 850 |
| `src/fitur/admin/components/TabAkunSiswa.tsx` | 850 |

`AdminPanel.tsx` contohnya punya 25+ `useState` dalam satu komponen. Sulit di-review, di-test, dan di-refactor tanpa risiko regresi.

> ⚠️ **TIDAK DIPERBAIKI** (refactor besar berisiko) — lihat rekomendasi §5.

---

### 🟡 SEDANG

#### 2.8 Kebersihan repo
- `vite.log` ter-commit ke git (junk file) → ✅ **DIPERBAIKI** (`git rm --cached` + masuk `.gitignore`)
- `.gitignore` meng-ignore folder `dokumentasi/` padahal 10 file di dalamnya sudah di-track (membingungkan & menyembunyikan file baru) → ✅ **DIPERBAIKI** (ignore file eksplisit, bukan seluruh folder)
- `env.example` di-ignore tapi di-track — kini konsisten (di-track sebagai template) → ✅

#### 2.9 135 warning `no-explicit-any` → 74
- ✅ 61 warning diperbaiki: `logger.ts` (17), `errors.ts` (10), `validation.ts` (9), `response.ts`, `App.tsx`, `LazyLoad.tsx`, `db.ts`, `misc.ts`, `AdminPanel.tsx`, `PerpusDashboard.tsx`, `PerpusDetailBuku.tsx`, `apiConfig.ts`, `dataRetention.service.ts`, `queryOptimization.service.ts`
- Sisa 74 sebagian besar di **file test** (`export.test.ts` 39, `dataRetention.service.test.ts` 18, `vitest.setup.ts` 10) — wajar untuk mocking, tapi bisa dirapikan bertahap

#### 2.10 Konvensi commit
16 commit, hampir semua "update" — menyulitkan `git bisect` dan riwayat. ✅ saran: konvensi seperti `feat:`, `fix:`, `refactor:` (dokumentasi di laporan ini).

#### 2.11 Aset besar di repo
`public/` 30 MB (gambar, PDF), `.git` 27 MB. Ada gambar placeholder bernama "Konoha-*" (anime) di dashboard. ✅ saran: kompres gambar, hapus placeholder, gunakan Git LFS untuk PDF.

---

## 3. Hal Positif (yang perlu dipertahankan)

- ✅ **TypeScript strict-ish**: typecheck FE & BE lolos; backend tidak pakai `any` berlebihan
- ✅ **Arsitektur backend rapi**: modular (`modules/`), middleware auth solid — JWT + blacklist token + registry sesi (`SessionToken`) + rate limit + helmet + validasi Zod
- ✅ **Code splitting bagus**: lazy loading per halaman + `manualChunks` vendor (react, pdf, maps, qrcode, icons)
- ✅ **Testing cukup sehat**: 251 test FE + 120 test BE (unit + integrasi + e2e Playwright), termasuk test konsistensi migration (bagus! ini yang menangkap bug 2.1)
- ✅ **Error handling konsisten**: class `AppError` + `handleError` + `formatErrorResponse`
- ✅ **Keamanan dasar terjaga**: password hashing bcrypt, rate limiter, security headers di Vite, blokir password lemah di production
- ✅ Refactor internal sebelumnya sudah baik (KKM/predikat disatukan ke `penilaian.ts`, duplikasi dihapus) — arah yang benar
- ✅ Komentar & dokumentasi berbahasa Indonesia yang jelas dan banyak

---

## 4. Ringkasan Perubahan yang Sudah Saya Lakukan

| File | Perubahan |
|---|---|
| `backend/prisma/migrations/20260811000000_add_feedback_sessiontoken/migration.sql` | **BARU** — tabel `Feedback` + `SessionToken` + index (menutup gap migration) |
| `backend/prisma/schema.prisma` | provider `sqlite` → `postgresql` |
| `backend/src/config/env.ts` | `process.exit(1)` → `throw` (2 lokasi) |
| `backend/src/test/setupEnv.ts` | **BARU** — env dummy untuk test |
| `backend/vitest.config.ts` | + `setupFiles` |
| `backend/src/config/logger.ts` | 17× `any` → tipe eksplisit (`Request/Response/NextFunction`, `Record<string, unknown>`, `LogInfo`) |
| `backend/src/utils/errors.ts` | `any` → `unknown`, return type `formatErrorResponse` di-type |
| `backend/src/utils/response.ts` | `ApiResponse<T = any>` → `T = unknown` |
| `backend/src/utils/validation.ts` | `req/res/next: any` → tipe Express |
| `backend/src/types/express.d.ts` | + `requestId?: string` |
| `backend/src/services/dataRetention.service.ts` | `whereClause: any` → `Prisma.*WhereInput`, `records: any[]` → `unknown[]` |
| `backend/src/services/queryOptimization.service.ts` | interface `QueryAnalysis` + hapus `any` |
| `src/components/ui/LazyLoad.tsx` | `lazyPage` jadi generik `P extends PageProps` (props asal dipertahankan) |
| `src/App.tsx` | hapus 4× `as any` — sekarang `<LazyAdminMasterPanel scope="teacher" />` ter-type |
| `src/fitur/admin/PanelAdminModal.tsx` | export `AdminGuruPanelProps` |
| `src/fitur/tamu/pages/BukuTamuPage.tsx` | export `BukuTamuPageProps` |
| `src/fitur/penerimaan-siswa-baru/AdminPanel.tsx` | hapus duplikasi `cn()` lokal (pakai `utils/cn`) + type filter |
| `src/fitur/admin/AdminPerpustakaan/PerpusDashboard.tsx` | hapus cast `any` tak perlu |
| `src/fitur/admin/AdminPerpustakaan/PerpusDetailBuku.tsx` | `Record<string, any>` → `Record<string, BookDetail>` |
| `src/data/store/core/db.ts`, `misc.ts` | hapus anotasi `any` |
| `src/services/apiConfig.ts` | hapus `(import.meta as any)` |
| `.gitignore` | + `vite.log`/`*.log`, perbaiki ignore `dokumentasi`, `!.env.example` |
| `env.example` | placeholder aman + variabel lengkap |
| `vite.log` | dihapus dari git (untracked) |

**Hasil verifikasi:**
- FE: typecheck ✅ · lint 0 error (74 warning, dari 135) ✅ · 251 test ✅ · build ✅
- BE: tsc ✅ · 120 test ✅ (sebelumnya 5 file gagal / 1 test gagal)

---

## 5. Rekomendasi Prioritas ke Depan

### 🎯 Prioritas 1 — Selesaikan arsitektur data (paling berdampak)
1. **Putuskan satu sumber kebenaran**: frontend harus memakai API backend, atau mock dihapus. Rekomendasi: jadikan `hasApi` sebagai default jalan, mock hanya untuk dev tanpa backend.
2. **Migrasi bertahap per modul** (mulai dari auth → absensi → nilai), dengan fallback ke mock saat API mati (offline-first).
3. **Hapus duplikat yang sudah drift**: pilih satu versi `feedbackService`, `ppdbService`, `passwordValidator` (FE/BE), lalu hapus yang lain.

### 🎯 Prioritas 2 — Pecah god components
- Mulai dari yang berdampak: `AdminPanel.tsx` (1.377 baris) → pecah per tab/modal; `DiskusiTugas.tsx` → pisah komponen chat/forum/group.
- Target: tidak ada file > 400–500 baris.

### 🎯 Prioritas 3 — Kebersihan & tooling
1. **Konvensi commit** (conventional commits) + branch protection di GitHub.
2. **CI lengkap**: jalankan `typecheck + lint + test` di GitHub Actions (saat ini workflow hanya build+deploy Pages).
3. **Kompres aset** `public/` (30 MB), hapus placeholder "Konoha", pertimbangkan Git LFS untuk PDF.
4. **Rapikan sisa 74 warning `any`** (kebanyakan di test).
5. **Strengthen test migration**: selain cek `CREATE TABLE`, cek juga kolom vs schema (test saat ini lolos walau kolom beda — bug 2.1 `Like` hampir terlewat).

### 🎯 Prioritas 4 — Hal yang perlu diverifikasi manual sebelum merge
- **Migration baru** (`20260811000000_add_feedback_sessiontoken`): test di environment PostgreSQL asli dengan `prisma migrate dev`/`deploy` — pastikan tabel `Feedback` & `SessionToken` terbentuk.
- **DB production yang sudah ada** kemungkinan dibuat via `prisma db push` → `_prisma_migrations` tidak ada; pertimbangkan baseline migration agar `migrate deploy` bisa dipakai di prod.
- Jangan lupa **ganti nilai di `env.example` saat deploy** (Google Client ID, password admin).
- `prisma generate` ulang setelah perubahan provider (sudah diverifikasi di sandbox).

---

## 6. Skor Kualitas Kode (subjektif, sebelum → sesudah)

| Aspek | Sebelum | Sesudah |
|---|---|---|
| Kesehatan build/test | 7/10 (5 file test mati) | 9/10 |
| Konsistensi DB/schema | 5/10 | 8/10 |
| Typing (minim `any`) | 6/10 | 7.5/10 |
| Kebersihan repo | 6/10 | 8/10 |
| Arsitektur | 6/10 (dual layer) | 6/10 (butuh keputusan) |
| **Rata-rata** | **6/10** | **7.7/10** |

---

## 7. Refactor God Component: AdminPanel.tsx (1.377 → 385 baris)

**Status:** ✅ SELESAI (tindak lanjut rekomendasi §5 Prioritas 2)

### Masalah awal
`src/fitur/penerimaan-siswa-baru/AdminPanel.tsx` = 1.377 baris, 30+ `useState`, 3 `useEffect`,
18 handler, dan 10 section UI dalam satu file. Sulit di-review & di-test.

### Hasil pemecahan (11 file, semua < 350 baris)

| File baru | Baris | Isi |
|---|---|---|
| `AdminPanel.tsx` (orkestrator) | 385 | state + data flow + komposisi komponen |
| `AdminPanelHeader.tsx` | 349 | header penuh + bar embedded + dropdown notifikasi (duplikasi 2× dihapus → 1 komponen `compact`) |
| `AdminPanelApplications.tsx` | 304 | toolbar (breadcrumb/folder jenjang/toggle view) + tabel list & grid |
| `AdminPanelDetailModal.tsx` | 215 | detail pendaftar + validasi dokumen |
| `AdminPanelSidebar.tsx` | 106 | ringkasan statistik + filter |
| `AdminPanelLogin.tsx` | 89 | layar login (state lokal di komponen) |
| `AdminPanelAuditModal.tsx` | 63 | audit trail |
| `AdminPanel.types.ts` | 62 | shared types + `statusText`/`formatDate` |
| `AdminPanelSettingsModal.tsx` | 57 | pengaturan email |
| `AdminPanelConfirmModal.tsx` | 44 | konfirmasi hapus/status |
| `ppdbExport.ts` | 132 | ekspor CSV/JSON/PDF/cetak — **pure functions** (bisa diuji unit) |

### Perbaikan kualitas lain yang ikut
1. **State login dipindah ke `AdminPanelLogin`** — induk cukup terima `onLogin(): Promise<boolean>`
2. **Dropdown notifikasi diduplikasi 2× (header & bar embedded) → 1 komponen** dengan prop `compact`
3. **Logika ekspor (CSV/JSON/jsPDF/print) dipindah ke `ppdbExport.ts`** — kini bisa diuji tanpa render
4. **Duplikasi `cn()` lokal** dihapus (pakai `utils/cn` — sudah dilakukan di sesi sebelumnya)

### Test baru yang ditambahkan (9 test)
- `ppdbExport.test.ts` (6 test): statusText, formatDate, CSV, JSON download, PDF, print recap
- `AdminPanel.test.tsx` (3 test render): layar login tampil → login sukses → dashboard; mode embedded langsung dashboard

### Temuan tambahan dari penulisan test
- ⚠️ `vitest.config.ts` meng-set `VITE_API_BASE_URL` untuk **semua** test → seluruh suite berjalan
  dalam mode API (fetch ke localhost:4000). Test AdminPanel perlu mock `apiConfig` ke mode lokal.
  Saran: pindahkan nilai ini ke per-file test, atau beri env per `describe` — jangan global.

### Verifikasi (sebelum → sesudah)
| Cek | Sebelum | Sesudah |
|---|---|---|
| Typecheck | ✅ | ✅ |
| Lint | 0 error | 0 error |
| Test FE | 251 (19 file) | **260 (21 file)** |
| Build | ✅ | ✅ |
| Dev server | ✅ | ✅ (semua modul ter-serve) |

---

## 8. Refactor God Component: DiskusiTugas.tsx (1.287 → 159 baris)

**Status:** ✅ SELESAI (tindak lanjut rekomendasi §5 Prioritas 2 — lanjutan)

### Masalah awal
`src/fitur/bersama/TugasKonten/DiskusiTugas.tsx` = 1.287 baris: chat forum + grup + privat
dalam satu file dengan 15+ `useState`, 10 `useEffect`, 13 handler, dan JSX 3 panel.

### Hasil pemecahan — pola *custom hook + komponen presentasional*

| File | Baris | Peran |
|---|---|---|
| `useDiskusiTugas.ts` | 594 | **Hook logika**: semua state, memo, effect, handler chat |
| `DiskusiTugasSidebar.tsx` | 408 | Panel kiri: peserta forum / grup & manajemen anggota |
| `DiskusiTugasStream.tsx` | 228 | Alur pesan: pemisah hari, bubble, edit/hapus, lampiran |
| `DiskusiTugas.tsx` (orkestrator) | **159** | Komposisi presentasional murni |
| `DiskusiTugasComposer.tsx` | 136 | Input pesan + lampiran + indikator "sedang mengetik" |
| `DiskusiTugas.types.tsx` | 116 | Tipe bersama + helper murni (Avatar, PresenceDot, hari) |
| `DiskusiTugasHeader.tsx` | 77 | Judul percakapan + toggle Forum/Grup |
| `DiskusiTugasCompact.tsx` | 71 | Varian ringkas (forum saja) |

### Manfaat arsitektur
1. **Logika terpisah dari tampilan** — `useDiskusiTugas()` mengembalikan state + 14 handler;
   komponen tidak lagi berisi logika bisnis, hanya meneruskan props.
2. **Helper murni bisa diuji langsung** — `getDayKey`, `getDayLabel`, `isPrivateMessage`,
   `Avatar`, `PresenceDot` tidak lagi terkubur di komponen.
3. **Bug potensial dihindari**: avatar member grup semula memakai daftar siswa *hasil
   filter* (berubah saat pencarian aktif) — kini eksplisit `allStudents` (tidak difilter),
   persis perilaku asli yang benar.

### Test baru (+10)
- `DiskusiTugas.types.test.tsx` (7): getDayKey/getDayLabel (Hari Ini/Kemarin/tanggal),
  isPrivateMessage, PresenceDot, Avatar
- `DiskusiTugas.test.tsx` (3 render): varian full, varian compact, dan tampilnya pesan forum
  yang sudah ada (seeding via data service)

### Catatan refactor
- File `.ts` berisi JSX → harus `.tsx` (kesalahan umum; ketahuan typecheck)
- `react-hooks/exhaustive-deps` v5 tidak lagi memeriksa custom hooks → 9 directive
  `eslint-disable` di hook menjadi usang & dihapus (mengurangi 9 error lint)

### Verifikasi (sebelum → sesudah)
| Cek | Sebelum | Sesudah |
|---|---|---|
| Typecheck | ✅ | ✅ |
| Lint | 0 error | 0 error (77 warning, turun 9) |
| Test FE | 260 (21 file) | **270 (23 file)** |
| Build | ✅ | ✅ |
| Dev server | ✅ | ✅ (semua 8 modul HTTP 200) |

---

## 9. Audit Performa — ✅ 4 Perbaikan Langsung + Rekomendasi

**Tanggal:** 11 Agustus 2026. Diukur dari build production (`npm run build`), aset, dan pola kode.

### Temuan & Perbaikan Langsung (✅ SELESAI)

| # | Temuan (diukur) | Dampak | Perbaikan |
|---|---|---|---|
| 1 | **`pdf-vendor` (jspdf ±377KB) di-modulepreload di index.html** — Vite meng-inject `<link rel="modulepreload">` untuk semua chunk yang terjangkau dynamic import, jadi **semua pengunjung mengunduh jspdf + html2canvas (±570KB) di first load** walau tidak pernah mencetak PDF | First load berat | ✅ **Dynamic import jspdf** di `utils/export/helpers.ts` (`createPdfDoc` → async), `TagihanSekolah.tsx`, `ppdbExport.ts` + `build.modulePreload: false`. **index.html kini hanya memuat 1 script.** |
| 2 | **`sharp` (native image lib ±30MB install) ada di dependencies tapi TIDAK dipakai** di mana pun | Install lambat, bloat node_modules | ✅ Dihapus dari `package.json` |
| 3 | **Backend tanpa kompresi** — respons JSON dikirim polos | API lambat di jaringan lambat | ✅ `compression` middleware ditambahkan di `backend/src/app.ts` (gzip) |
| 4 | **248 gambar, 30MB** — terbesar `ProgramKeahlian.png` 2.3MB, `siakad-app.png` 2.3MB, `logo-profile.png` 1.9MB | Repo besar + page load lambat (GH Pages tanpa optimizer) | ✅ Dikompres dengan sharp: **30MB → 17MB** (hemat ±13MB). Top: ProgramKeahlian 2.3→0.68MB, siakad-app 2.3→0.28MB, logo-profile 1.9→0.46MB |

### Hasil pengukuran first load (sebelum → sesudah)
- **index.html script/preload:** 3 file (index + react-vendor + pdf-vendor) → **1 file**
- **JS kritikal:** ±734KB → ±357KB (react-vendor tetap perlu; pdf-vendor hanya saat cetak)
- **Aset total:** 30MB → 17MB
- Semua tes tetap hijau: FE 270 ✅ · BE 120 ✅ · lint 0 error ✅

### Rekomendasi lanjutan (belum dikerjakan — butuh keputusan/refactor lebih besar)

**Prioritas tinggi:**
1. ~~**Pagination di backend**~~ → ✅ **SELESAI** — `GET /api/feedback` kini memakai
   `?page=&limit=` (default 1/20, max 100, `skip/take` + `count` paralel). Response
   backward-compatible: `data` tetap array + meta `pagination` (util `paginatedResponse`).
   Frontend `fetchFeedbackReviews()` meminta `limit=100`. +4 unit test
   (`feedback.service.test.ts`). **Terapkan pola ini ke endpoint daftar lain** saat
   modul siswa/absensi disambungkan ke backend.
2. ~~**Pola `writeDB` (mock localStorage)**~~ → ✅ **SELESAI** — lihat Section 10 di bawah.
3. ~~**`loading="lazy"` + `width/height`**~~ → ✅ **SELESAI** — 151/207 tag `<img>` kini
   `loading="lazy" decoding="async"` (gambar hero/login/logo sengaja tetap eager).
   ⚠️ Catatan: automasi regex sempat merusak 86 file (tag `<img>` berisi arrow function
   `onError={() => ...}`) — sudah di-rollback & diaplikasikan ulang dengan parser aman;
   seluruh suite terverifikasi hijau lagi.

**Prioritas sedang:**
4. **`React.memo`** — hanya 1 pemakaian di seluruh repo. Komponen daftar (sidebar chat, tabel) yang menerima props stabil layak di-memo.
5. **Polling `setInterval` 1.5s (typing) & 10s (presence) di DiskusiTugas** memicu re-render seluruh chat — pertimbangkan event-based store subscription.
6. **Chunk `index.es` ±159KB** (export utils) ikut terunduh saat membuka halaman yang import `utils/export` — bisa dipecah per-domain (sudah dipisah per file, tapi barrel `export.ts` menyatukan).
7. **Deploy di Vercel/Netlify** (brotli + edge caching) daripada GitHub Pages untuk gain tambahan; `_headers` cache sudah bagus.

### Hal yang sudah bagus (pertahankan)
- ✅ Code splitting per halaman (lazy) + `manualChunks` vendor
- ✅ Cache headers immutable di `_headers`
- ✅ Google Fonts dimuat non-blocking (`media="print"` + onload)
- ✅ Security headers + CSP lengkap
- ✅ Gzip kini aktif di backend

---

## 10. Refactor `writeDB` / State Ephemeral — ✅ SELESAI (perf ~946×)

**Masalah:** `setTyping` dipanggil pada **setiap keystroke** di kotak chat, dan setiap
panggilan men-serialize **SELURUH database** (bisa ±1MB karena lampiran base64) ke
localStorage + memicu notifikasi global → **50+ komponen re-render**. Hal sama terjadi
pada heartbeat presence (10 dtk) dan penanda "sudah dibaca".

**Solusi (non-breaking):**
1. **State ephemeral dipisah ke key localStorage kecil sendiri:**
   - `siakad-presence-v1` (Record studentId → timestamp)
   - `siakad-typing-v1` (scope → user → {ts, name, role})
   - `siakad-chat-read-v1` (scope → user → lastRead)
   - Helper baru `readEphemeral` / `writeEphemeral` di `db.ts`; `chat.ts` memakainya.
   - **Migrasi otomatis sekali**: key baru kosong → fallback baca dari DB utama (legacy),
     lalu tertulis otomatis ke key baru. Data lama tidak hilang.
2. **Coalescing notifikasi store (rAF)** — beberapa `writeDB` dalam satu frame memicu
   **satu** event re-render, bukan per-write. `storeVersion` tetap naik sinkron (aman
   untuk `useSyncExternalStore`).
3. **`writeDB` skip-identik** — kalau JSON hasil sama dengan yang tersimpan, tidak
   menulis & tidak notify (mengurangi write sia-sia).
4. **Bonus:** `getUnreadPrivateCount` semula mem-parse seluruh DB **2× per panggilan**
   (dan dipanggil dalam loop semua siswa) → kini 1× + baca read-state dari key kecil.

**Hasil benchmark (DB ±1MB, 50 lampiran, 100× operasi typing):**

| Pola | Waktu |
|---|---|
| Lama: serialize seluruh DB per keystroke | **519 ms** |
| Baru: key kecil ephemeral | **0.5 ms** |
| **Percepatan** | **~946×** |

**Catatan test:** notifikasi store kini asinkron (1/frame) — test `store.test.ts`
"notifies subscribers" disesuaikan menunggu rAF. Seluruh suite tetap hijau
(FE 270 ✅ · BE 124 ✅ · lint 0 error ✅).

---

---

## 11. Template Universal — Setup Sekolah Tanpa Koding ✅

**Latar:** pengguna menjual SIAKAD sebagai template ke banyak sekolah (SD/SMP/SMA/SMK).
Prioritas bergeser dari "sambungkan backend" → **"gampang di-branding & disetup ulang"**.

### Yang dikerjakan
1. **`src/config/school.ts` — sumber identitas tunggal + runtime override**
   - `getSchoolIdentity()` = default + override localStorage (`siakad-school-identity`)
   - `updateSchoolIdentity()` / `resetSchoolIdentity()` — langsung notify seluruh aplikasi
   - `schoolConfig` lama dipertahankan (backward compat, dipakai FeedbackForm)
2. **`src/hooks/useSchoolIdentity.ts`** — hook reaktif (ikut store version)
3. **Branding reaktif**: Sidebar (nama+logo), ProgramFooter (nama/kontak), LoginPanel &
   LoginPage (logo), judul browser dinamis di App (`document.title`)
4. **Hardcode "SMA Negeri 1 Medan" dibersihkan** — SiakadSection, BukuTamuForm,
   guestData, schoolData (tamu) kini interpolasi dari identitas
5. **Panel Setup Sekolah** (menu admin → Sistem): form nama/singkatan/jenjang/tahun
   ajaran/NPSN/telepon/domain email/alamat + **unggah logo** (max 300KB, preview) +
   simpan/reset. Perubahan langsung berlaku, tanpa build ulang.

### Test baru (+9)
- `config/school.test.ts` (6): default, update parsial, reset, tolak field kosong,
  aman dari data rusak, email dari domain
- `TabSetupSekolah.test.tsx` (3 render): tampil form, simpan identitas, reset

### Verifikasi
- FE: 279 test (25 file) ✅ · lint 0 error ✅ · build ✅ · dev server semua modul 200 ✅

### Catatan penting (dokumentasi untuk penjualan)
- Setelan ini = identitas/branding. Isi konten (berita, sejarah, visi-misi, struktur)
  tetap per-sekolah di file data masing-masing.
- Perubahan jenjang penuh yang mengubah struktur konten (SD→SMK) tetap butuh build
  ulang (ubah `jenjang` di `dataSekolah.ts`); setelan jenjang di panel untuk identitas.

*Laporan dibuat otomatis dari hasil analisis & perbaikan langsung di workspace. Semua perubahan ada di folder `siakad-sekolah/` (belum di-commit — silakan review lalu commit sendiri).*
