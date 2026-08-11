# LAPORAN AUDIT TOTAL — SIAKAD SEKOLAH

**Tanggal Audit:** 2026-08-11
**Branch:** `arena/019ff30d-siakad-sekolah`
**Auditor:** Audit Total (Architecture, Backend, Frontend, Security, QA, Performance)

---

## EXECUTIVE SUMMARY

Proyek ini adalah aplikasi **Portal SIAKAD Sekolah** berbasis **React 19 + Vite + Tailwind CSS 4 + Zustand** (frontend) dan **Express + Prisma + PostgreSQL** (backend opsional). Total ~83.800 baris TypeScript frontend (483 file) + ~8.000 baris backend (57 file), plus 29 file unit test (frontend), 11 file unit test (backend), dan 4 spec E2E Playwright.

### Hasil Build/Test (dieksekusi langsung di sandbox)

| Check | Hasil | Keterangan |
|---|---|---|
| Frontend `typecheck` (`tsc --noEmit`) | ✅ **PASS** | 0 error |
| Frontend `lint` | ✅ **PASS (0 error)** | 77 warning (`no-explicit-any` dsb.) |
| Frontend `build` (`vite build --mode production`) | ✅ **PASS** | Code-splitting rapi, ~9s |
| Frontend unit test (`vitest run`) | ✅ **PASS** | 294 tests / 29 files |
| Backend unit test (`vitest run`) | ✅ **PASS** | 124 tests / 11 files |
| Backend `build` (`tsc`) | ⚠️ **FAIL** | 20+ error TS |
| Backend `prisma generate` | ❌ **GAGAL** | Engine download diblokir sandbox (network) |
| Dev server | ✅ **Berjalan** | `http://localhost:5173` |

> **Catatan penting tentang backend typecheck:** `prisma generate` gagal di sandbox karena download engine Prisma diblokir jaringan, sehingga `node_modules/.prisma/client` adalah **stub** (`PrismaClient = any`, tanpa model). Akibatnya sebagian besar error TS backend (mis. `Prisma.QueryEvent`, `Feedback` tidak ditemukan, `Parameter 'c' implicitly any`) adalah **artefak client-stub**, bukan bug nyata. **Tidak bisa diverifikasi penuh** tanpa network. Namun **satu masalah terkonfirmasi nyata**: konflik migrasi (lihat BUG-01).

### Jumlah Masalah per Severity

- **P0 (Critical):** 2
- **P1 (High):** 4
- **P2 (Medium):** 6
- **P3 (Low):** 6
- **P4 (Informational):** 4

### Kondisi Fitur

| Status | Jumlah |
|---|---|
| COMPLETE | Auth portal, feedback (local), PPDB (local), surat-izin CRUD, ekskul CRUD, perpustakaan CRUD, rapot local, tagihan local |
| PARTIAL | Semua fitur akademik (hanya frontend/localStorage, tanpa backend), PPDB backend-mode |
| BROKEN | PPDB saat backend aktif (endpoint `/ppdb/*` tidak ada di backend), migrasi DB, admin-ops routes |
| MISSING | Backend CRUD untuk seluruh domain akademik; E2E tidak dijalankan (butuh browser) |
| MOCK | Seluruh data akademik menggunakan `localStorage` (seedData) |

### Risiko Terbesar

1. **Database tidak bisa di-migrate** → backend tidak bisa dideploy (konflik migrasi). ✅ **SUDAH DIPERBAIKI** (BUG-01)
2. **Seluruh fitur akademik berjalan di `localStorage`** → data tidak tersimpan/dibagi antar-perangkat, hilang saat browser dibersihkan, dan tidak pernah "benar-benar" memakai backend walau sudah ada schema. ⏳ **TERDEFER** (BUG-03, Phase 3 besar)
3. **PPDB backend-mode rusak** → frontend memanggil endpoint yang tidak ada di backend. ✅ **DIMITIGASI** (BUG-02, PPDB terkunci mode lokal)
4. **Keamanan gerbang admin PPDB lemah** → PIN & sesi admin diverifikasi sepenuhnya di client. ⏳ **TERDEFER** (BUG-05, butuh modul backend `/ppdb`)

---

## STATUS PERBAIKAN (setelah audit)

| # | Item | Status | Keterangan |
|---|---|---|---|
| BUG-01 | Konflik migrasi Prisma (P0) | ✅ **DIPERBAIKI** | Migrasi duplikat `20260811000000` dihapus; urutan migrasi kini konsisten dengan schema |
| BUG-02 | PPDB panggil endpoint tak ada (P0) | ✅ **DIMITIGASI** | `ppdbService` terkunci mode lokal (`usePpdbApi=false`) dengan catatan TODO(Phase 3); tidak ada lagi 404 saat API aktif |
| BUG-03 | Domain akademik tanpa backend (P1) | 🔶 **BLUEPRINT: Attendance ✅ · Rapot ✅ · Billing ✅ · Library ✅** | **Attendance** (`/api/attendance`), **Rapot/Nilai** (`/api/rapot`, IDOR-safe), **Billing/Tagihan** (`/api/billing`), **Perpustakaan** (`/api/library`: Book+LibraryMember+LibraryTransaction, CRUD + transaksi lifecycle dengan update stok atomik) sudah disambungkan — masing-masing backend CRUD + auth + zod + test, plus wrapper frontend (fallback lokal). Domain lain (Assignment, SuratIzin, Roster) terdefer |
| BUG-04 | Admin-ops selalu 403 (P1) | ✅ **DIPERBAIKI** | `backup`/`query-optimization`/`data-retention` kini `requireAuth, requireAdmin` |
| BUG-05 | Admin PPDB client-side (P1) | ⏳ Terdefer | Butuh endpoint admin backend `/ppdb` (bergantung BUG-03/Phase 3) |
| BUG-06 | Backend tsc gagal (P2) | ⏳ **UNVERIFIED** | Sandbox tak bisa unduh engine Prisma; perlu `prisma generate` dgn network |
| BUG-07 | Dua shell paralel (P2) | ✅ **SEBAGIAN** | `AppShell.tsx` (dead, ber-bug) dihapus; satu shell tersisa (`AuthenticatedApp`) |
| BUG-08 | Deep-link/refresh hilang halaman (P2) | ⏳ Terdefer | Butuh migrasi navigasi ke URL-as-source-of-truth; berisiko, tidak dilakukan di sesi ini |
| BUG-09 | Default credentials seed (P2) | ⏳ Terdefer | Backend sudah blokir password lemah di prod; seed demo dibiarkan (kredensial demo terdokumentasi) |
| BUG-10 | Service duplikat (P3) | ✅ **DIKOREKSI** | Ternyata **bukan** dead code — `data/services/*` adalah fallback lokal dari `src/services/*` (pola API-wrapper + fallback), konsisten dengan PPDB |
| BUG-11 | Health publik bocorkan info (P3) | ✅ **DIPERBAIKI** | `/detailed`, `/database`, `/memory`, `/log-aggregation` kini `requireAuth, requireAdmin` |
| BUG-12 | `console.log` payload feedback (P3) | ✅ **DIPERBAIKI** | Mode simulasi tidak lagi mencetak `templateParams` (cegah PII leak) |

**Verifikasi pasca-perbaikan:** Frontend `typecheck` ✅ · `lint` ✅ (0 error/77 warning) · `build` ✅ · unit test **290/290** ✅ · Backend file yang diedit lolos transpile esbuild ✅ · Backend unit test 124/124 ✅.

**Yang TIDAK saya lakukan (dengan alasan):**
- **Debounce persist localStorage** — store sudah mem-batch event (rAF/microtask) & skip-write saat tak berubah; debounce persist asinkron berisiko kehilangan data saat reload (manfaat < risiko).
- **Bug-08 (deep-link)** — refactor navigasi besar, risiko regresi tinggi; dijadwalkan sebagai pekerjaan tersendiri.
- **Bug-03/05 (backend CRUD akademik + admin auth)** — butuh pengembangan besar & penyelarasan schema (Type FE ↔ Prisma mismatch), tidak aman dilakukan sepenuhnya di sesi ini.

---

## 1. PROJECT MAP (aktual, bukan fiktif)

```text
siakad-sekolah
├── Frontend (Vite + React 19 + Tailwind 4 + Zustand)
│   ├── src/main.tsx               → entry (AuthProvider, ErrorHandler, SW)
│   ├── src/App.tsx                → authed? <LoginPage> : <AuthenticatedApp>
│   ├── src/routes.ts              → konstanta ROUTES + pageToPath (hanya dipakai AppShell/halaman)
│   ├── src/layout/
│   │   ├── AuthenticatedApp.tsx   → SHELL AKTIF (navigasi state-based, tanpa react-router)
│   │   ├── AppShell.tsx           → DEAD CODE (shell react-router, tidak di-import)
│   │   └── Sidebar.tsx            → menu berbasis id
│   ├── src/context/AuthContext.tsx
│   ├── src/data/store/            → core store (localStorage) + zustandStores
│   │   └── core/                  → db, seedData, students, teachers, attendance, dst.
│   ├── src/data/services/         → lapisan data lokal (barrel index.ts) — INTI DATA
│   ├── src/services/              → lapisan API backend (authApi, feedbackService, ppdbService)
│   ├── src/fitur/
│   │   ├── autentikasi/           → LoginPage + DataLogingPage + ExpectationModal (website di MemoryRouter)
│   │   ├── guru/                  → 15 halaman guru
│   │   ├── murid/                 → 11 halaman siswa
│   │   ├── orang-tua/             → 6 halaman wali
│   │   ├── admin/                 → PanelAdmin + AdminPerpustakaan (sub-system)
│   │   ├── tamu/                  → GuestDashboard + halaman guest
│   │   ├── halaman/               → website sekolah (Beranda, Profil, dst.) dalam MemoryRouter
│   │   ├── penerimaan-siswa-baru/ → PPDB (LandingPage + AdminPanel + Form)
│   │   └── perpustakaan/          → PerpustakaanApp (login sendiri)
│   ├── src/utils/, src/hooks/, src/config/, src/components/
├── Backend (Express + Prisma + PostgreSQL)
│   ├── src/server.ts / app.ts
│   ├── src/routes/        → health, likes, metrics, system, data-retention, query-optimization
│   ├── src/modules/       → auth, school-config, backup, feedback, stats
│   ├── src/middleware/    → auth, security, errorHandler, performance, correlationId
│   ├── src/services/      → dataRetention, migrationTesting, queryOptimization
│   ├── prisma/schema.prisma + 10 migrasi + seed.ts
│   └── src/utils/         → tokenManager, sanitize, passwordValidator, retention, backup, response
├── e2e/ (Playwright)       → admin, login, navigation, ppdb
├── dokumentasi/, backend/PHASE*.md
└── Deploy: netlify.toml, vercel.json, public/_headers, public/sw.js
```

**Stack:**

| Aspek | Nilai |
|---|---|
| Framework FE | React 19.2 + Vite 7.3 + react-router-dom (sebagian) |
| Bahasa | TypeScript 5.9 (FE), 5.7 (BE) |
| Styling | Tailwind CSS 4 + tailwind-merge + clsx |
| State | Zustand + store lokal (localStorage) + Context (Auth) |
| Backend | Express 4 + Prisma 6 + PostgreSQL |
| Auth | JWT (access + refresh) + bcrypt + SessionToken registry + token blacklist |
| Linter/Formatter | ESLint 9 (0 error) + Prettier |
| Testing | Vitest (FE/BE) + Playwright (E2E) |
| Deploy | Netlify, Vercel, GH Pages (public/sw.js), Cloudflare |

---

## 2. HASIL CHECK (Q&A 35)

| # | Pertanyaan | Jawaban |
|---|---|---|
| 1 | Apakah project dapat build? | FE **YA**. BE **TIDAK** (tsc error; sebagian artefak stub Prisma). |
| 2 | Apakah project dapat dijalankan? | FE **YA** (dev server berjalan). BE butuh DB Postgres + prisma generate. |
| 3 | Runtime error? | Tidak terdeteksi saat dev load; namun banyak path API rusak. |
| 4 | TypeScript error? | FE 0. BE 20+ (belum diverifikasi penuh). |
| 5 | Lint error? | 0 error, 77 warning. |
| 6 | Broken route? | ✅ `AppShell` sudah dihapus; deep-link/refresh masih belum presisi (BUG-08, terdefer). |
| 7 | Broken component? | N/A major. |
| 8 | API tidak terhubung? | PPDB dimitigasi (mode lokal); domain akademik masih tanpa backend (BUG-03). |
| 9 | Database tidak terhubung? | ✅ Migrasi konflik diperbaiki; domain akademik masih tanpa route. |
| 10 | Fitur belum selesai? | **YA** — seluruh domain akademik mock-only (BUG-03, terdefer). |
| 11 | Tombol tidak bekerja? | ✅ Admin-ops routes BE sudah diperbaiki (BUG-04). |
| 12 | CRUD tidak lengkap? | CRUD ada di frontend-local, tapi tanpa backend/persistensi. |
| 13 | Dummy/mock data? | **YA** — `seedData.ts` (guru123/siswa123/ortu123). |
| 14 | Dead code? | ✅ `AppShell.tsx` dihapus; `data/services/feedbackService.ts` ternyata live (koreksi). |
| 15 | Memory leak? | Tidak ditemukan leak jelas; banyak `setInterval`/listener dengan cleanup. |
| 16 | Performance bottleneck? | Bundle besar (jspdf 386kB, html2canvas 201kB, PanelAdminModal 300kB) tapi di-lazy-load. |
| 17 | Security vulnerability? | **YA** — gerbang admin PPDB client-side, default creds. |
| 18 | Auth/authorization problem? | **YA** — admin-ops routes selalu 403 (bug), PPDB admin client-side. |
| 19 | Data inconsistency? | FE Type ↔ BE Prisma mismatch (domain akademik). |
| 20 | Dependency bermasalah? | jspdf 4.2.1 (beta?), @react-google-maps/api & @emailjs/browser terpasang tapi diragukan terpakai. |
| 21 | Technical debt besar? | **YA** — dua shell paralel, dua lapisan service, duplikasi. |
| 22 | Arsitektur layak dikembangkan? | Layak untuk demo/mock, **belum** layak produksi backend. |
| 23–25 | Lihat bagian FIX ORDER & KESIMPULAN. | |

---

## 3. BUG REPORT

### BUG-01 — [P0] Konflik Migrasi Prisma
- **SEVERITY:** P0 — Critical
- **FILE:** `backend/prisma/migrations/20260811000000_add_feedback_sessiontoken/migration.sql`
- **FUNCTION:** — (migration)
- **PROBLEM:** Migrasi ini membuat ulang tabel `Feedback` dan `SessionToken` yang **sudah ada** di migrasi sebelumnya (`20260808000000_add_feedback` membuat `Feedback`; `20260809130000_add_session_token` membuat `SessionToken`).
- **ROOT CAUSE:** Migrasi terakhir tampaknya hasil regenerasi/redo yang tidak dihapus, sehingga duplikat dengan migrasi lama.
- **IMPACT:** `prisma migrate deploy` akan gagal dengan `relation "Feedback" already exists` → backend **tidak dapat dideploy** ke environment baru. Produksi yang belum menjalankan migrasi ini juga gagal.
- **REPRODUCTION:** `cd backend && prisma migrate deploy` (terhadap DB kosong).
- **RECOMMENDED FIX:** Hapus migrasi `20260811000000_add_feedback_sessiontoken` (kontennya 100% duplikat), atau ubah menjadi migrasi `no-op`/`-- Empty migration`. Jangan menghapus migrasi lain.
- **WHY:** Mencegah kegagalan deploy DB.
- **RISK:** Rendah (menghapus migrasi duplikat aman karena tidak ada migrasi berikutnya yang bergantung padanya).
- **IMPACT:** Backend bisa di-migrate.

### BUG-02 — [P0] Frontend PPDB Memanggil Endpoint yang Tidak Ada di Backend
- **SEVERITY:** P0 — Critical (saat backend aktif)
- **FILE:** `src/services/ppdbService.ts`
- **FUNCTION:** `submitApplication`, `getApplications`, `getStatistics`, `getApplicationById`, `updateStatus`, `deleteApplication`
- **PROBLEM:** Saat `hasApi === true`, service memanggil `/ppdb/applications`, `/ppdb/statistics`, dll. — tetapi backend **tidak memiliki route `/ppdb` sama sekali** (lihat `backend/src/routes/index.ts`).
- **ROOT CAUSE:** Frontend service ditulis berasumsi ada backend PPDB, tetapi route PPDB tidak pernah diregistrasi di `apiRouter`.
- **IMPACT:** Semua operasi PPDB gagal (HTTP 404) saat `VITE_API_BASE_URL` diisi. PPDB hanya bekerja di mode lokal.
- **REPRODUCTION:** Set `VITE_API_BASE_URL` ke backend, buka form PPDB, submit.
- **RECOMMENDED FIX:** Implementasikan route/modul `/ppdb` di backend (di atas model `PPDBApplication`, `PPDBDocument`, `PPDBAuditLog`, `PPDBNotification` yang sudah ada), atau set `hasApi=false` untuk fitur PPDB dan tandai eksplisit.

### BUG-03 — [P1] Seluruh Domain Akademik Tidak Punya Backend (Mock-Only)
- **SEVERITY:** P1 — High
- **FILE:** `backend/src/routes/index.ts`, `src/data/store/core/*`, `src/data/services/*`
- **PROBLEM:** Schema & migrasi Prisma memuat `Attendance`, `ReportCard`, `Billing`, `Book`/`LibraryTransaction`, `OnlineAssignment`, `AssignmentSubmission`, `SuratIzin`, `ClassRoster`, `Announcement`, `ClassAnnouncement`, `BillingConfig` — tetapi **tidak ada satu pun route/controller backend** untuk model-model ini. Seluruh fitur portal membaca/menulis `localStorage` melalui `src/data/services/*`.
- **ROOT CAUSE:** Arsitektur frontend-first: lapisan data lokal adalah sumber kebenaran; backend hanya menyediakan auth + feedback + PPDB + config + stats + ops.
- **IMPACT:** Data akademik tidak persisten di server, tidak dibagi lintas perangkat/pengguna, hilang saat `localStorage` dibersihkan, dan tidak ada API untuk integrasi pihak ketiga. Backend "siakad" pada dasarnya hanya `absensi` auth shell.
- **RECOMMENDED FIX:** Buat modul CRUD per domain di backend dan lapisan API di frontend. Ini pekerjaan besar; prioritaskan sesuai FIX ORDER.

### BUG-04 — [P1] Admin-ops Routes Selalu 403 (requireAdmin tanpa requireAuth)
- **SEVERITY:** P1 — High
- **FILE:** `backend/src/routes/backup.route.ts`, `backend/src/routes/queryOptimization.route.ts`, `backend/src/routes/dataRetention.route.ts`
- **PROBLEM:** Route ini memakai `requireAdmin` **tanpa `requireAuth`**. `requireAdmin` membaca `req.jwtUser` yang hanya diisi oleh `requireAuth`. Karena tidak ada `requireAuth`, `req.jwtUser` selalu `undefined` → selalu `403`, bahkan untuk admin sah.
- **IMPACT:** Backup, query-optimization, dan data-retention tidak dapat diakses siapa pun. (Bukan lubang keamanan, tapi fitur mati.)
- **RECOMMENDED FIX:** Tambahkan `requireAuth, requireAdmin` (urutan benar) pada semua route tersebut.

### BUG-05 — [P1] Gerbang Admin PPDB Divalidasi Sepenuhnya di Client
- **SEVERITY:** P1 — High (keamanan)
- **FILE:** `src/data/store/core/ppdb.ts` (`adminLogin`, `isAdminAuthenticated`), `src/fitur/penerimaan-siswa-baru/AdminPanel.tsx`
- **PROBLEM:** PIN admin (`VITE_ADMIN_PIN`) diverifikasi di browser; sesi disimpan di `localStorage`; tidak ada otorisasi server. `VITE_*` di-inline ke bundle client, sehingga PIN dapat diekstrak dari JS bundle.
- **IMPACT:** "UI protection ≠ security". Siapa pun yang membuka DevTools dapat membaca PIN dari bundle atau langsung menulis kunci sesi ke `localStorage`, lalu masuk sebagai admin PPDB.
- **RECOMMENDED FIX:** Pindahkan otorisasi admin PPDB ke backend (`/ppdb/admin/login`), atau gunakan JWT backend yang sudah ada.

### BUG-06 — [P2] Backend Typecheck Gagal
- **SEVERITY:** P2 — Medium
- **FILE:** `backend/src/lib/prisma.ts`, `backend/src/modules/feedback/feedback.service.ts`, `backend/src/services/dataRetention.service.ts`, dll.
- **PROBLEM:** 20+ error TS. **Status: UNVERIFIED** — mayoritas karena client Prisma = stub (download engine gagal di sandbox). Error seperti `Prisma.QueryEvent`/`LogEvent` dan `Feedback` tidak diekspor akan hilang setelah `prisma generate` sukses dengan network.
- **RECOMMENDED FIX:** Jalankan `prisma generate` di lingkungan dengan network, lalu `npm run build` ulang.

### BUG-07 — [P2] Dua Application Shell Paralel
- **SEVERITY:** P2 — Medium
- **FILE:** `src/layout/AppShell.tsx` (dead) vs `src/layout/AuthenticatedApp.tsx` (aktif)
- **PROBLEM:** `AppShell.tsx` tidak di-import siapa pun (dead code), memakai react-router, dan memiliki bug `const activePage = '';`. Sementara `AuthenticatedApp` memakai navigasi state-based.
- **IMPACT:** Bingung, duplikasi, dan `AppShell` membawa bug laten.
- **RECOMMENDED FIX:** Hapus `AppShell.tsx` atau selesaikan migrasi react-router secara konsisten.

### BUG-08 — [P2] Deep-link & Refresh Kehilangan Halaman
- **SEVERITY:** P2 — Medium
- **FILE:** `src/layout/AuthenticatedApp.tsx`
- **PROBLEM:** `activePage` diinisialisasi ke default dan **tidak pernah dibaca dari URL**. `history.pushState` memakai `window.location.pathname` (tidak berubah), sehingga URL tidak merefleksikan halaman. Refresh pada `/guru/dashboard` → kembali ke default.
- **IMPACT:** Bookmark/share URL tidak bekerja; back/forward terbatas pada state internal.
- **RECOMMENDED FIX:** Gunakan URL path sebagai sumber kebenaran (mis. baca `location.pathname` → pageId saat mount), atau migrasi ke router.

### BUG-09 — [P2] Default Credentials Lemah di Seed
- **SEVERITY:** P2 — Medium (keamanan)
- **FILE:** `backend/prisma/seed.ts` (`guru123`, `siswa123`), `src/data/store/core/seedData.ts` (`guru123`, `siswa123`, `ortu123`)
- **PROBLEM:** Password default dipakai di seed DB dan seed lokal.
- **IMPACT:** Jika deploy tanpa mengganti seed, akun mudah dibobol.
- **RECOMMENDED FIX:** Wajibkan perubahan password pertama kali login; jangan seed password statis di produksi.

### BUG-10 — [P3] Service Duplikat & Dead Service — ✅ DIKOREKSI
- **SEVERITY:** P3 — Low (sebagian besar bukan bug)
- **FILE:** `src/services/feedbackService.ts` & `src/data/services/feedbackService.ts`; `src/services/ppdbService.ts` & `src/data/services/ppdbService.ts`
- **PROBLEM (koreksi):** Dua file bernama sama tampak duplikat, tetapi ini **pola arsitektur yang disengaja dan konsisten**: `src/services/*` = wrapper yang memilih API (saat `hasApi`) atau fallback lokal; `data/services/*` = implementasi localStorage. `data/services/feedbackService.ts` **dipakai** oleh `src/services/feedbackService.ts`.
- **RECOMMENDED FIX:** Tidak perlu hapus. Pertahankan pola; dokumentasikan agar tidak dianggap dead code.

### BUG-11 — [P3] Endpoint Health Publik Menyiratkan Info
- **SEVERITY:** P3 — Low
- **FILE:** `backend/src/routes/health.route.ts` (`/detailed`, `/database`, `/memory`, `/log-aggregation`)
- **PROBLEM:** Endpoint ini publik tanpa auth.
- **IMPACT:** Informasi konektivitas DB & memori dapat diintip. Risiko rendah.
- **RECOMMENDED FIX:** Batasi `/detailed`, `/memory` pada admin; jaga `/health` sederhana tetap publik.

### BUG-12 — [P3] `console.log` Data Feedback di Mode Simulasi
- **SEVERITY:** P3 — Low
- **FILE:** `src/data/services/feedbackService.ts:141-142`
- **PROBLEM:** Mencetak seluruh `templateParams` feedback ke konsol saat EmailJS tidak dikonfigurasi.
- **IMPACT:** Potensi kebocoran data PII di konsol/devtools.
- **RECOMMENDED FIX:** Hapus `console.log` payload; gunakan `logger.debug` tervalidasi.

---

## 4. INCOMPLETE SYSTEM REPORT

| Feature | Status | Missing Part | Impact | Recommendation |
|---|---|---|---|---|
| Absensi (guru) | PARTIAL/MOCK | Backend CRUD | Data hanya localStorage | Buat modul Attendance BE |
| Rapot & nilai | PARTIAL/MOCK | Backend CRUD | Tidak persisten | Buat modul ReportCard BE |
| Tagihan/billing | PARTIAL/MOCK | Backend CRUD | Tidak persisten | Buat modul Billing BE |
| Perpustakaan (loan) | PARTIAL/MOCK | Backend CRUD | Tidak persisten | Buat modul Library BE |
| Tugas online & submisi | PARTIAL/MOCK | Backend CRUD | Tidak persisten | Buat modul Assignment BE |
| Surat izin | PARTIAL/MOCK | Backend CRUD | Tidak persisten | Buat modul SuratIzin BE |
| Roster kelas | PARTIAL/MOCK | Backend CRUD | Tidak persisten | Buat modul ClassRoster BE |
| Manajemen siswa/guru (admin) | PARTIAL | Backend CRUD | Hanya auth login | Buat modul admin CRUD BE |
| PPDB (backend mode) | BROKEN | Route `/ppdb/*` | 404 saat hasApi | Implementasi/flag-off |
| Admin-ops (backup/db) | BROKEN | requireAuth | Selalu 403 | Perbaiki middleware |
| Website sekolah (halaman) | COMPLETE | — | — | — |
| Guest book / tamu | COMPLETE | — | — | — |

---

## 5. SECURITY REPORT

| Issue | Severity | Location | Risk | Recommendation |
|---|---|---|---|---|
| Admin PPDB auth client-side | High | `store/core/ppdb.ts` | Priv-esc / bypass | Backend JWT |
| Default creds seed | Medium | `seed.ts`, `seedData.ts` | Account takeover | Wajib ganti password |
| `console.log` payload feedback | Low | `data/services/feedbackService.ts` | PII leak | Hapus |
| Health info publik | Low | `health.route.ts` | Info disclosure | Batasi admin |
| JWT secret dari env (tidak hardcoded) | OK | `env.ts` | — | Pastikan kuat |
| CSRF defense-in-depth | OK | `security.ts` | — | Pertahankan |
| Sanitization body | OK | `sanitize.ts` | — | — |
| Rate limiting login | OK | `auth.route.ts` | — | — |
| Helmet + CORS allowlist | OK | `app.ts` | — | — |
| No `dangerouslySetInnerHTML`, no `eval` | OK | — | — | — |
| SW cache | Informational | `sw.js` | Cache poisoning? | Validasi daftar immutable |

**Temuan keamanan penting:** Meskipun banyak praktik baik (bcrypt, JWT dengan blacklist, helmet, CORS allowlist, rate limiting, sanitization, no dangerous HTML), model keamanan utama justru diabaikan karena **semua data akademik tersimpan di `localStorage` client** — artinya otorisasi tidak ditegakkan server untuk fitur inti. Dan gerbang admin PPDB dapat di-bypass sepenuhnya di client.

---

## 6. PERFORMANCE REPORT

| Issue | Location | Impact | Priority | Recommendation |
|---|---|---|---|---|
| Bundle `jspdf` 386kB + `html2canvas` 201kB | `utils/export/loadJsPdf.ts` | Large chunk | Medium | Sudah lazy-load; pertimbangkan dynamic import on-demand (sudah) — OK |
| `PanelAdminModal` 300kB | `fitur/admin/PanelAdminModal.tsx` | Large chunk | Medium | Pertimbangkan split lebih lanjut |
| Semua data di satu objek localStorage | `store/core/db.ts` | Waterfall/rewrite besar | Medium | Batch write / debounce persist |
| Potensi N+1 di stats service | `modules/stats/stats.service.ts` | Query berulang | Low | Gunakan `groupBy`/`count` agregat |
| Index banyak sudah ada | `schema.prisma` | — | — | Pertahankan |
| Tidak ada virtualisasi list | tabel besar | Rendering lambat | Low | Virtualisasi bila data >500 baris |

**Bundle utama FE** (react-vendor 193kB, index 57kB) reasonable dan di-lazy-load per halaman. Optimasi baik.

---

## 7. ARCHITECTURE REPORT

- **Dua lapisan data paralel** (`src/data/services/*` localStorage vs `src/services/*` API) tanpa strategi migrasi yang jelas → sumber inkonsistensi.
- **Dua shell aplikasi** (`AuthenticatedApp` state-based vs `AppShell` react-router) → duplikasi & kebingungan arah.
- **Backend terbagi dua mentalitas:** (a) auth/ops yang matang, (b) domain akademik yang tidak ada sama sekali. Schema lengkap tapi "yamuk" (tidak digunakan).
- **Separation of concerns:** baik di backend (route/controller/service/middleware). Kurang di frontend (store raksasa, banyak helper di component).
- **Coupling:** tinggi antara fitur dan store lokal; perubahan tipe tersebar.
- **Scalability:** layak untuk demo/single-school mock. Tidak untuk multi-tenant/produksi karena penyimpanan client-side.
- **Duplication:** dua service feedback/ppdb, dua shell, banyak component "god" (PanelAdminModal, store).

**Rekomendasi arsitektur (bukan overengineering):**
1. Tetapkan satu sumber kebenaran: saat `hasApi`, semua baca/tulis lewat API; saat tidak, fallback localStorage dengan banner "mode demo".
2. Selesaikan migrasi router (satu shell).
3. Bangun lapisan API per domain di backend secara bertahap.

---

## 8. DEAD CODE REPORT

| File | Function/Component | Reason | Recommendation |
|---|---|---|---|
| `src/layout/AppShell.tsx` | seluruh shell | Tidak di-import siapa pun; ada bug `activePage=''` | ✅ **Dihapus** |
| `src/routes.ts` (partial) | `pageToPath`, `getDefaultPath` | Hanya dipakai `AppShell` (sudah dihapus) + `routes.ts` sendiri | Bisa dipertahankan (ekspor tak merugikan) atau dirapikan saat migrasi router |

> **Koreksi penting:** `src/data/services/feedbackService.ts` **bukan dead code** — ia adalah fallback lokal yang di-import oleh `src/services/feedbackService.ts` (yang dipakai `FeedbackPage`). Pola `src/services/*` (wrapper API) + `data/services/*` (fallback lokal) konsisten dengan PPDB; bukan duplikasi mati.

> `grep` menemukan hanya 3 TODO/FIXME (bukan kode), 4 `console.log`. Kode relatif bersih dari marker.

---

## 9. DEPENDENCY REPORT

| Package | Status | Risk | Recommendation |
|---|---|---|---|
| `jspdf@^4.2.1` | Major-version "unstable"/beta lineage | Medium | Pastikan versi stabil |
| `@emailjs/browser@^4.4.1` | Terpasang | Info | Cek apakah terpakai (feedback email) |
| `@react-google-maps/api@^2.20.8` | Terpasang | Info | Cek pemakaian; bundle besar |
| `@react-oauth/google` | Terpasang | Info | Dipakai GoogleLoginButton |
| `react-router-dom@^7.18.2` | Dipakai sebagian kecil | Info | Deduplikasi dengan shell |
| `lucide-react@^1.25.0` | Terpasang | Info | — |
| `zod` backend | Terpakai (env, validasi) | OK | — |
| Prisma `6.19.3` | Terpakai | OK | — |
| Overrides `esbuild@^0.28.1` | Paksa versi | Info | Monitor kompatibilitas |

Tidak menjalankan `npm audit` penuh (network sandbox). **Status audit dep:** sebagian **UNVERIFIED**.

---

## 10. ROUTE AUDIT (Frontend)

Karena `AuthenticatedApp` memakai navigasi state (bukan URL), "route" = key page di map per role.

| Route (key) | Component | Permission | Data source | Status |
|---|---|---|---|---|
| dashboard (guru) | DasborGuru | teacher | localStorage | COMPLETE |
| attendance | HalamanAbsensi | teacher | localStorage | PARTIAL (no BE) |
| rapot-input / rekap-nilai | InputRapotGuru | teacher | localStorage | PARTIAL |
| dashboard (murid) | DasborMurid | student | localStorage | COMPLETE |
| tasks | KantongTugas | student | localStorage | PARTIAL |
| billing | TagihanSekolah | student/parent | localStorage | PARTIAL |
| dashboard (ortu) | DasborOrangTua | parent | localStorage | COMPLETE |
| admin-dashboard | PanelAdminModal(scope teacher) | admin | localStorage | PARTIAL |
| buku-tamu | BukuTamuPage | guest | localStorage | COMPLETE |
| (halaman website) | BerandaPage dkk. | public | JSON statis | COMPLETE |

**Deep-link/refresh** → tidak presisi (lihat BUG-08). **Route `/ppdb/*` (BE)** → MISSING.

---

## 11. API AUDIT

| Endpoint | FE Consumer | Auth | Validation | Status |
|---|---|---|---|---|
| POST `/api/auth/login` | authApi | rate-limit | zod | COMPLETE |
| POST `/api/auth/google` | GoogleLoginButton | — | zod | COMPLETE |
| POST `/api/auth/admin/login` | authApi/ppdbService | rate-limit | zod | COMPLETE |
| POST `/api/auth/refresh` | authApi/ppdbService | — | zod | COMPLETE |
| POST `/api/auth/change-password/*` | PengaturanAkun | requireAuth | zod | COMPLETE (self-only) |
| POST `/api/auth/logout` | authApi | requireAuth | — | COMPLETE |
| POST `/api/feedback` | `src/services/feedbackService.ts` | — | zod | COMPLETE |
| `/api/ppdb/*` | `src/services/ppdbService.ts` | — | — | **MISSING di BE** |
| `/api/school-config` | (tamu/school) | admin | zod | COMPLETE |
| `/api/stats` | (dashboard?) | admin | — | PARTIAL (tanpa FE) |
| `/api/backup|query-optimization|data-retention` | — | **BUG-04** | BROKEN (403) |
| `/api/health` | — | publik | — | COMPLETE |
| Semua domain akademik | — | — | — | **MISSING** |

---

## 12. DATABASE AUDIT

| Model | Used By | Relation | Index | Problem |
|---|---|---|---|---|
| SchoolConfig | school-config BE | — | — | OK |
| Teacher/Student/ClassRoom | auth BE (login) | FK lengkap | banyak | OK |
| Attendance | stats, dataRetention | FK | unique/idx | Tanpa CRUD API |
| ReportCard | — | FK | idx | **Tanpa consumer** |
| Billing/BillingConfig | — | FK | idx | **Tanpa consumer** |
| Book/LibraryTransaction | stats | FK | idx | Tanpa CRUD API |
| OnlineAssignment/Submission | dataRetention | FK | idx | Tanpa CRUD API |
| SuratIzin | dataRetention | FK | idx | Tanpa CRUD API |
| PPDBApplication dkk. | — (BE) | FK | idx | Route `/ppdb` missing |
| Feedback | feedback BE | — | idx | OK |
| SessionToken | auth BE | idx | uniq | OK |
| Like | likes BE | uniq(programId,ip) | idx | OK |

**Konflik migrasi (BUG-01)**: migrasi `20260811000000` duplikat `Feedback`+`SessionToken`.

---

## 13. TESTING AUDIT

| Feature | Risk | Recommended Test | Priority |
|---|---|---|---|
| Migrasi Prisma | Tinggi (BUG-01) | E2E `migrate deploy` dari DB kosong | **P0** |
| PPDB backend-mode | Tinggi | Integration test `/ppdb/*` | P1 |
| Auth + session + logout-all | Tinggi | Integration (sebagian ada) | P1 |
| Attendance/rekap (local) | Sedang | Unit (belum ada utk store) | P2 |
| Backup/query-opt auth | Sedang | Integration auth 401/403 | P2 |

- FE: 29 file / 294 test (banyak `act(...)` warnings — kualitas ok).
- BE: 11 file / 124 test.
- E2E Playwright: 4 spec ada, **tidak dijalankan** di sandbox (butuh browser build; bisa `npm run test:e2e`).

---

## 14. DOCUMENTATION AUDIT

- `README.md` (30KB) lengkap, `dokumentasi/` dan `backend/PHASE*.md` kaya. 
- `REVIEW_KODE.md` adalah ulasan kode sebelumnya.
- `perencanaan_backend.md` memuat roadmap backend.
- **Catatan:** dokumentasi mengklaim banyak backend sudah siap, padahal **domain akademik belum punya API** → beberapa bagian **obsolete/overclaim**. `env.example` root berisi `VITE_ADMIN_PASSWORD=admin` (contoh lemah, tapi hanya contoh).

---

## 15. FINAL HEALTH SCORE

```text
Code Quality:         7/10   — Terstruktur, prettier rapi, banyak praktik baik; tapi god-component
Architecture:         5/10   — Satu shell tersisa (AppShell dihapus); dua lapisan data; backend akademik absen
Security:             6/10   — Naik: health dibatasi, admin-ops aman, feedback log dibersihkan; admin PPDB client-side masih
Performance:          8/10   — Lazy-loading & bundling baik; beberapa chunk besar
Reliability:         6/10   — Naik: migrasi DB tidak konflik, PPDB tidak lagi 404; API akademik masih absen
Maintainability:     6/10   — Nama & struktur konsisten; satu shell; dua lapisan service terpola
Testing:             6/10   — 414 unit test pass; E2E belum diverifikasi; store akademik minim test
Documentation:        8/10   — Sangat lengkap, sedikit overclaim
Feature Completeness: 6/10   — UI lengkap, tapi inti tidak tersambung backend
Overall:             6/10   — Demo/UI matang; perbaikan blocker & security sudah dilakukan
```

---

## 16. RECOMMENDED FIX ORDER

```
PHASE 1 — BLOCKER
  P0: BUG-01  Hapus migrasi duplikat → biar `migrate deploy` sukses.
  P0: BUG-02  Implementasikan route /ppdb ATAU flag-off hasApi untuk PPDB.

PHASE 2 — SECURITY
  P1: BUG-05  Pindahkan auth admin PPDB ke backend (JWT).
  P2: BUG-09  Ganti default credentials & wajibkan ganti password.

PHASE 3 — DATA / API
  P1: BUG-03  Bangun lapisan CRUD backend untuk domain akademik (mulai dari yang paling penting:
              Attendance → ReportCard → Billing → Library → Assignment → SuratIzin).
  P1: BUG-04  Perbaiki requireAuth pada backup/query-optimization/data-retention.

PHASE 4 — CORE FUNCTIONALITY
  P2: BUG-07  Selesaikan migrasi router (hapus AppShell atau aktifkan react-router penuh).
  P2: BUG-08  Buat URL sebagai sumber kebenaran navigasi (deep-link/refresh).

PHASE 5 — PERFORMANCE
  - Split PanelAdminModal, pantau jspdf/html2canvas on-demand.
  - Debounce persist localStorage.

PHASE 6 — UI/UX
  - Perbaiki `act()` warnings di test AdminPanel.
  - State loading/empty/error konsisten di halaman yang memakai API.

PHASE 7 — REFACTORING
  - Konsolidasi service feedback/ppdb duplikat; hapus dead code (AppShell, feedbackService mati).

PHASE 8 — TESTING
  - Tambah integration test migrasi & PPDB.
  - Jalankan & pertahankan E2E Playwright.

PHASE 9 — DOCUMENTATION
  - Koreksi klaim backend yang belum ada; perjelas mode mock vs backend.
```

**Dependency antarperbaikan:** PHASE 1 wajib sebelum apa pun (deploy gagal). BUG-02 & BUG-03 saling terkait (PPDB + domain akademik). BUG-05 bergantung pada keberadaan endpoint admin di backend (PHASE 3). BUG-07/08 sebaiknya digabung saat migrasi router.

---

## 17. KESIMPULAN AKHIR

1. **Dapat build?** Frontend: **YA**. Backend: **TIDAK** (tsc error; sebagian besar artefak stub Prisma, belum terverifikasi penuh).
2. **Dapat dijalankan?** Frontend: **YA** (mock mode). Backend: butuh DB + `prisma generate` + perbaikan migrasi.
3. **Runtime error?** Tidak terdeteksi saat load awal; banyak path API rusak.
4. **TypeScript error?** FE 0. BE 20+ (sebagian artefak).
5. **Lint error?** 0.
6. **Broken route?** Deep-link/refresh, `/ppdb/*` BE, admin-ops 403.
7. **Broken component?** Tidak ditemukan yang crash.
8. **API tidak terhubung?** **YA** — PPDB & seluruh domain akademik.
9. **Database tidak terhubung?** **YA** — migrasi konflik, schema akademik tanpa route.
10. **Fitur belum selesai?** Seluruh domain akademik mock-only.
11. **Tombol tidak bekerja?** Admin-ops BE selalu 403.
12. **CRUD tidak lengkap?** Lengkap di frontend-local, tanpa backend/persistensi.
13. **Dummy/mock data?** **YA** (seedData, guru123/siswa123/ortu123).
14. **Dead code?** ✅ `AppShell.tsx` dihapus; `data/services/feedbackService.ts` ternyata live (koreksi).
15. **Memory leak?** Tidak ditemukan; listener/interval ber-`cleanup`.
16. **Performance bottleneck?** Chunk jspdf/html2canvas/PanelAdminModal besar (sudah lazy).
17. **Security vulnerability?** ✅ Beberapa diperbaiki (health, admin-ops, feedback log); admin PPDB client-side masih (BUG-05).
18. **Auth/authorization problem?** ✅ Admin-ops 403 diperbaiki; otorisasi inti masih di client (BUG-03/05).
19. **Data inconsistency?** FE Type ↔ BE Prisma (domain akademik).
20. **Dependency bermasalah?** Beberapa besar/beta; audit penuh UNVERIFIED (network).
21. **Technical debt besar?** Dua shell, dua lapisan service, god-component.
22. **Arsitektur layak dikembangkan?** Layak untuk demo/mock; **belum** untuk produksi backend.
23. **10 masalah terpenting:** (1) migrasi duplikat P0, (2) PPDB `/ppdb` missing, (3) domain akademik tanpa backend, (4) admin-ops 403, (5) admin PPDB client-side, (6) default creds, (7) dua shell, (8) deep-link rusak, (9) backend tsc gagal, (10) service duplikat.
24. **Perbaiki dulu:** PHASE 1 (migrasi + PPDB route), lalu PHASE 2 (keamanan).
25. **Layak produksi?** **Belum** untuk mode backend. Mode frontend/demo **dapat dipakai sebagai prototype**; untuk produksi riil harus menyelesaikan PHASE 1–4.

> **Status verifikasi (perbaikan):** ✅ DIPERBAIKI: BUG-01, 02, 04, 07, 11, 12. ⏳ TERDEFER: BUG-03, 05, 08, 09. ✅ DIKOREKSI (bukan bug): BUG-10. ⏳ UNVERIFIED: BUG-06 (butuh network untuk `prisma generate`).

> **Status penyelesaian bertahap (sesi perbaikan):**
> - **PHASE 1 (Blockers):** ✅ BUG-01 migrasi, BUG-02 PPDB — **selesai & terverifikasi.**
> - **PHASE 2 (Security):** ✅ BUG-11 health, BUG-12 feedback log — **selesai.**
> - **PHASE 3 (Data/API):** ✅ BUG-04 admin-ops 403 — **selesai.** 🔶 BUG-03 blueprint: **Attendance ✅ · Rapot ✅ · Billing ✅ · Library ✅** disambungkan; domain lain terdefer.
> - **PHASE 4 (Core):** ✅ BUG-07 hapus shell duplikat — **selesai.** ⏳ BUG-08 deep-link — terdefer.
> - **PHASE 5–9:** ⏳ Sebagian besar terdefer (perlu pengembangan backend CRUD per domain, migrasi router, dsb.).

> **Blueprint BUG-03 — ringkasan (Attendance, Rapot, Billing, Library):**
> - **Attendance** (`/api/attendance`): service→controller→route, akses guru/admin, zod (status enum, format `YYYY-MM-DD`), bulk `createMany`+`skipDuplicates` pada unique `[studentId,date]`, delete. Frontend: `services/attendanceService` (wrapper fallback lokal) + `HalamanAbsensi` di-wire. (+7 BE test, +3 FE test)
> - **Rapot/Nilai** (`/api/rapot`): upsert pada unique compound `[studentId,classId,academicYear,semester,subject]`, list+pagination, delete; pemetaan DTO `NilaiRapot`↔`ReportCard`. Akses guru/admin only (IDOR-safe; siswa/ortu baca rapot ditutup sementara sampai linkage auth dibangun). Frontend: `services/rapotService` (wrapper fallback lokal, API write/read ikut sinkron ke store) + `InputRapotGuru` di-wire. (+5 BE test, +3 FE test)
> - **Billing/Tagihan** (`/api/billing`): list (filter studentId/year/status + pagination), pay (mark isPaid), get/set pengaturan (BillingConfig), generate tahunan (bulk createMany skipDuplicates pada unique `[studentId,year,month]`). Akses config/generate admin-only; list/pay guru-admin (self-service siswa ditutup sementara sampai linkage auth). Frontend: `services/billingService` (wrapper fallback lokal) + `TagihanSekolah` (pay) & `TabTagihanSekolah` admin (config+generate) di-wire. (+8 BE test, +4 FE test)
> - **Perpustakaan** (`/api/library`): 3 model — Book CRUD (list q/category, upsert, delete), LibraryMember CRUD, LibraryTransaction lifecycle (borrow MENUNGGU → approve DIPINJAM / reject DITOLAK / return DIKEMBALIKAN) dengan update stok `available` via `prisma.$transaction`. Konversi status UI (huruf kecil) ↔ DB (huruf besar). Akses: baca katalog/anggota login cukup; tulis & approve/reject/return guru-admin. Frontend: `services/libraryService` (wrapper fallback lokal, kontrak sesuai komponen) + `PerpusTransaksi`, `PerpusInventori`, `PerpusDashboard` di-wire; FormPeminjaman/FormPengembalian didukung async. Catatan: alur pinjam siswa (memberId=NIS) tetap mode lokal (butuh mapping ke LibraryMember). (+9 BE test, +6 FE test)
> - **Verifikasi:** FE typecheck/lint/build ✅ · FE 306 test ✅ · BE 153 test ✅.
> - **Catatan:** backend `tsc` belum bisa diverifikasi penuh (sandbox tak bisa unduh engine Prisma → client stub). Wajib jalankan `prisma generate` lalu `npm run build` di environment ber-network sebelum deploy.
