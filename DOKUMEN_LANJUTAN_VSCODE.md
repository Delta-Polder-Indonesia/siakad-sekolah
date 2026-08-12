# 📌 HANDOVER UNTUK AI/DEV DI VS CODE — Item yang TERBLOKIR di Sandbox

Dokumen ini dibuat oleh **Audit Agent (Arena)** setelah menyelesaikan perbaikan bertahap
pada branch `arena/019ff30d-siakad-sekolah`. Item yang **tidak bisa diselesaikan di sandbox
karena blocking** dicatat di sini beserta langkah konkret agar AI/dev di VS Code bisa
melanjutkan.

> **Status terakhir branch:** semua perbaikan yang bisa diverifikasi di sandbox sudah
> ter-commit & ter-push. Sebelum deploy apa pun, **jalankan perintah di bagian
> "WAJIB DI JALANKAN DULU"** di bawah (sandbox memblokir download engine Prisma).

---

## 🔴 BLOKIR-1 — Verifikasi & Build Backend (BUG-06)

### Kenapa terblokir
Sandbox tidak memiliki akses jaringan ke `binaries.prisma.sh`, sehingga
`npx prisma generate` gagal. Akibatnya `node_modules/.prisma/client` adalah **stub**
(`PrismaClient = any`), dan `npm run build` backend menampilkan 20+ error TS yang
**mayoritas artefak stub**, bukan bug nyata.

### Yang perlu dilakukan di VS Code (ber-network)
```bash
cd backend
# 1) Generate Prisma client yang benar
npx prisma generate

# 2) Typecheck & build
npx tsc --noEmit -p tsconfig.json
npm run build

# 3) Cek hasil
#    - Error seperti `Prisma.QueryEvent`, `LogEvent`, `Feedback tidak diekspor`,
#      `Parameter 'c' implicitly any` HARUSNYA hilang setelah prisma generate.
#    - Jika masih ada error NYATA, perbaiki.
```

### Catatan penting untuk penilai
- Modul baru yang ditambahkan audit (attendance, rapot, billing, library, assignment,
  surat-izin, roster, ppdb-config) TIDAK bisa di-typecheck penuh di sandbox karena stub
  Prisma. Semuanya **lolos transpile (esbuild)** & **unit test (mocking prisma)**.
- Wajib pastikan `prisma generate` sukses lalu `npm run build` lolos sebelum merge/deploy.

---

## 🔴 BLOKIR-2 — Konflik/Verifikasi Migrasi Prisma

### Yang SUDAH diperbaiki
- **BUG-01:** migrasi duplikat `20260811000000_add_feedback_sessiontoken` dihapus.
- **Schema baru:** kolom `content Json?` pada `OnlineAssignment` + migrasi
  `20260812000000_add_assignment_content`.

### Yang perlu diverifikasi di VS Code (ber-network + DB)
```bash
cd backend
# Buat DB Postgres lalu:
npx prisma migrate deploy   # pastikan sukses tanpa error "relation already exists"
npx prisma migrate dev      # untuk dev, cek drift schema vs migrations
npx prisma db seed          # jalankan seed (lihat BLOKIR-3 utk produksi)
```

---

## 🔴 BLOKIR-3 — Uji End-to-End Backend + Integrasi API

### Kenapa terblokir
Sandbox tidak bisa menjalankan Postgres & meng-*deploy* migrasi, sehingga tidak ada
verifikasi runtime penuh atas 7 domain akademik baru + modul PPDB config.

### Yang perlu diuji di VS Code (ber-network + DB)
1. Jalankan backend: `cd backend && npm run dev` (pastikan `DATABASE_URL` benar).
2. Test manual / curl tiap endpoint (lihat tabel API di bawah).
3. Jalankan integration test backend: `npm run test` dan `npm run test:e2e`.
4. Jalankan E2E Playwright frontend: `cd .. && npm run test:e2e`.

### Daftar endpoint baru yang wajib diuji (semua butuh `Authorization: Bearer <token>`)
| Method | Endpoint | Role | Catatan |
|---|---|---|---|
| GET/POST | `/api/attendance` | GURU/ADMIN | bulk create `createMany` skipDuplicates |
| DELETE | `/api/attendance/:id` | GURU/ADMIN | |
| GET/POST | `/api/rapot` | GURU/ADMIN | upsert unique compound |
| DELETE | `/api/rapot/:id` | GURU/ADMIN | |
| GET | `/api/billing` | GURU/ADMIN | filter studentId/year/status |
| POST | `/api/billing/:id/pay` | GURU/ADMIN | |
| GET/POST | `/api/billing/config` | config admin-only | |
| POST | `/api/billing/generate` | ADMIN | generate tahunan |
| GET/POST | `/api/library/books`, `/members` | login (get) / GURU-ADMIN (write) | |
| GET | `/api/library/transactions` | GURU/ADMIN | |
| POST | `/api/library/transactions/borrow` | login | self-service |
| POST | `/api/library/transactions/:id/{approve,reject,return}` | GURU/ADMIN | |
| GET/POST/DELETE | `/api/assignments` | GURU/ADMIN (write) | content JSON |
| GET/POST | `/api/assignments/submissions` | GURU/ADMIN (get), MURID/GURU/ADMIN (post) | |
| POST | `/api/surat-izin` | MURID/WALIS/GURU/ADMIN | |
| GET/PATCH | `/api/surat-izin/...` | GURU/ADMIN | |
| GET/POST/DELETE | `/api/roster` | GURU/ADMIN (write), login (get) | |
| GET/PATCH | `/api/ppdb/config` | ADMIN | otorisasi admin PPDB (BUG-05) |

> **Catatan IDOR:** beberapa list per-user (rapot, billing, surat-izin, submisi) sengaja
> dibatasi GURU/ADMIN sampai **linkage auth** (relasi akun login → siswa/wali) dibangun.
> Lihat BLOKIR-4.

---

## 🔴 BLOKIR-4 — Linkage Auth (relasi akun ↔ data siswa) — belum dibangun

### Konteks
Banyak self-service (siswa lihat rapot/tagihan, wali lihat anak, siswa pinjam buku,
submit tugas, lihat surat-izin) belum dibuka lewat API karena **belum ada pemetaan yang
andal antara ID login (backend CUID) dan data lokal (`s1`, `t1`, dll.)**. Frontend lokal
memakai id seperti `s1`/`t1`, sementara backend memakai CUID.

### Yang perlu dilakukan (pekerjaan lanjutan)
1. Bangun tabel/relasi `Teacher`↔`Student`↔`Wali` yang benar di schema (mungkin sudah
   sebagian: `Student.guardian*`, `ClassRoomTeacher`).
2. Tambahkan ownership-check di tiap endpoint yang dibatasi, mis.:
   - MURID → hanya rapot/tagihan/submisi milik dirinya.
   - WALIS → hanya data anak yang diasuh (`getParentStudent` di frontend punya logika ini).
   - GURU → hanya kelas yang diampunya.
3. Setelah itu, buka kembali endpoint yang kini dibatasi GURU/ADMIN agar role MURID/WALIS
   bisa self-service dengan aman (hindari IDOR).

---

## 🔴 BLOKIR-5 — Migrasi Data Aplikasi PPDB & Akademik dari localStorage → DB

### Konteks (BUG-02 / BUG-03 parsial)
- **Data aplikasi PPDB** (`PPDBApplication`) masih di `localStorage` frontend.
  Schema Prisma punya `PPDBApplication` tapi **kontrak field TIDAK kompatibel**:
  frontend pakai ~60 field bahasa Indonesia (`namaLengkap`, `jenisKelamin`, …),
  backend pakai ~25 field bahasa Inggris (`fullName`, `gender`, …).
- **Data akademik** (absensi, rapot, tagihan, dll.) juga masih di `localStorage`.
  Wrapper `src/services/*` sudah fallback: saat `hasApi` → API, saat tidak → lokal.

### Yang perlu dilakukan (pekerjaan besar, bertahap)
1. **Penyelarasan schema:** putuskan satu kontrak data. Opsi termudah = tambah kolom
   JSON `extended`/`raw` di `PPDBApplication` untuk field bahasa Indonesia, atau
   refactor frontend memakai field bahasa Inggris.
2. **Migrasi data:** buat skrip satu-kali yang membaca `localStorage` dan memasukkan
   ke DB (seeding/backfill) saat first-run dengan backend.
3. **Aktifkan `usePpdbApi = hasApi`** di `src/services/ppdbService.ts` setelah modul
   `/ppdb/applications` (CRUD) dibangun & kontrak disamakan (saat ini terkunci false).
4. Bangun endpoint CRUD `/api/ppdb/applications` (create/list/status/documents/audit).

---

## 🟡 Catatan Kecil (opsional, non-blocking)

- **BUG-10 (di-koreksi):** `src/data/services/*` adalah fallback lokal dari `src/services/*`
  (pola API-wrapper + fallback) — BUKAN dead code. Pertahankan pola.
- **`routes.ts` `pathToPage`** sudah memulihkan deep-link; pastikan halaman detail website
  (Berita detail, dll.) juga berfungsi di URL path (belum diuji E2E di sandbox).
- **Frontend demo credentials:** `guru123` / `siswa123` / `ortu123` di `seedData.ts` hanya
  untuk mode demo (mock). Backend sudah memblokir password lemah di produksi.

---

## 🚀 WAJIB DI JALANKAN DULU (sebelum apa pun)

```bash
# 1) Backend: generate Prisma + build + test
cd backend
npx prisma generate
npm run build
npm run test

# 2) Seed (perhatikan BLOKIR-3 utk produksi)
npx prisma migrate deploy
npm run prisma:seed

# 3) Frontend: typecheck + lint + build + test
cd ..
npm run typecheck
npm run lint
npm run build
npm run test

# 4) E2E (opsional, butuh dev server)
npm run test:e2e
```

---

## ✅ Ringkasan yang SUDAH SELESAI di Sandbox
- Phase 1: BUG-01 (hapus migrasi duplikat), BUG-02 (PPDB tidak panggil endpoint tak ada).
- Phase 2: BUG-11 (health dibatasi admin), BUG-12 (hapus console.log payload feedback).
- Phase 3: BUG-04 (admin-ops 403), BUG-03 (7 domain akademik: attendance, rapot, billing,
  library, assignment, surat-izin, roster — backend + wrapper frontend + test).
- Phase 3 Security: BUG-05 (auth admin PPDB → server: login JWT + `/api/ppdb/config`).
- Phase 4: BUG-07 (hapus shell duplikat `AppShell.tsx`), BUG-08 (deep-link/refresh).
- BUG-09 (sebagian): seed backend diblokir di produksi + env.example dikoreksi
  (`ADMIN_PASSWORD_HASH` → `ADMIN_PASSWORD`).

**Verifikasi sandbox:** FE typecheck/lint/build ✅, FE 338 test ✅, BE 172 test ✅,
dev server boot ✅.
