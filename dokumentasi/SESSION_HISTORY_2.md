# SESSION HISTORY 2 — Projeck Portal Siswa

> Lanjutan dari `SESSION_HISTORY.md` (sudah **2651 baris**, sampai Sesi 30b).
> File baru dibuat karena file lama sudah sangat panjang.
>
> Besok tinggal bilang: **"Lanjut dari SESSION_HISTORY_2.md"**

---

## 🗓️ Sesi 31 — Halaman Kalender Akademik Dashboard (Guru/Siswa/Ortu/Admin) — TUNTAS

### ✅ Yang sudah selesai

#### 1. `DasborKalenderAkademik.tsx` (BARU)
- **Path:** `src/fitur/halaman/components/KalenderAkademik/DasborKalenderAkademik.tsx`
- Halaman dashboard **inline di shell** (tidak menerima props — tanpa `onNavigate`/`isActive`), dipakai untuk role guru, siswa, ortu, dan admin.
- **Gaya seragam hitam-putih ala DasborMurid:** `text-black`, `bg-white`, `border-black` untuk semua garis bingkai. Warna yang dipertahankan: hari ini = `bg-blue-600`, libur nasional = `text-red-600`.
- Fitur:
  - Header ala DasborMurid (judul + sub).
  - Kalender interaktif — navigasi bulan (Prev/Next), dropdown pilihan tahun ajaran (TA).
  - Panel **Agenda Terdekat** collapsible (`upcomingOpen`) → `getUpcomingAgenda(5)`.
  - Di dalamnya ada **mini Kalender Nasional** (`miniMonth`/`miniYear`) yang menampilkan `liburNasional` per bulan.
  - Tabel agenda per semester (Ganjil/Genap) per jenis (libur, ujian, kegiatan).
  - Modal detail agenda saat item diklik.
  - Baris tabel terakhir dirapikan: `last:[&>td]:border-b-0` agar bingkai bawah tidak dobel.
- Helper per-sesi (`sortByStartDate`, `filterBySemester`, `getAgendasForDate`, `getAgendaDateInfo`, dll.) **masih terduplikasi** di dalam file — belum diekstrak ke modul bersama.

#### 2. Data libur nasional (BARU)
- **Path:** `src/fitur/halaman/components/KalenderAkademik/LiburNasionalData/liburNasional.ts`
- Interface `LiburNasionalItem`, export `liburNasional` — data statis untuk **2025, 2026, 2027**.
- `4 Nov 2026` ("Maulid Nabi") sengaja sinkron dengan agenda sekolah `libur-maulid-2026`.
- Catatan: tanggal hari besar Islam 2026 masih **estimasi**.

#### 3. Data agenda (satu pintu, sudah ada sebelumnya)
- `src/fitur/halaman/components/KalenderAkademik/AgendaData/agenda.ts` — export `agendaItems`, `academicYears`, `getUpcomingAgenda`, `getAgendaByType`, `getAgendaById`, types `AgendaItem`, `AcademicYearOption`.

#### 4. Sidebar
- Top-nav `academic-agenda` dan `teacher-announcements` diberi **`disabled: true`** (render tombol top-nav menangani state disabled).
- **Item menu sidebar diubah murni ikon + teks tanpa container:** `bg-transparent`, aktif = `font-bold text-black`, hover = `text-black` (hapus `rounded-md bg-blue-50 shadow-sm` dan `hover:bg-slate-100`).
- Item menu utama **"Kalender Akademik"** (ikon `CalendarDays`) ditambahkan ke:
  - MENU UTAMA guru (setelah dashboard)
  - MENU UTAMA siswa (setelah dashboard)
  - PEMANTAUAN ANAK ortu (setelah Ikhtisar Belajar)

#### 5. Routing `src/App.tsx`
- `LazyDasborKalenderAkademik` = lazy import baru.
- Map `academic-agenda` → `LazyDasborKalenderAkademik` untuk **teacher/student/parent/admin** (4 kemunculan via replaceAll).
- **Guest tetap** `academic-agenda` → `LazyAgendaPage` (diperbaiki setelah replace salah sasaran — konteks guest beda).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/halaman/components/KalenderAkademik/DasborKalenderAkademik.tsx` | BARU — halaman kalender akademik dashboard |
| `src/fitur/halaman/components/KalenderAkademik/LiburNasionalData/liburNasional.ts` | BARU — libur nasional 2025–2027 |
| `src/layout/Sidebar.tsx` | Top-nav 2 item disabled; item menu ikon+teks; +Kalender Akademik (guru/siswa/ortu) |
| `src/App.tsx` | `academic-agenda` → `LazyDasborKalenderAkademik` (4 peran); guest tetap AgendaPage |

### 🔍 Status
- `vitest run agenda.test.ts`: ✅ **12 passed**
- `tsc` + `eslint`: ✅ 0 error (sebelum perubahan WhatsApp di sesi berikut)

---

## 🗓️ Sesi 32 — Kolom WhatsApp di DasborMurid + Seed Guru — TUNTAS

### ✅ Yang sudah selesai

#### 1. `DasborMurid.tsx` — tabel "Daftar Tenaga Pengajar"
- Kolom **WhatsApp** ditambahkan (setelah kolom Email), `colSpan` baris kosong `5` → `6`.
- Sel menampilkan `guru.whatsapp || '-'`.

#### 2. Seed data (`src/data/store/core.ts`)
- Teachers `t1`, `t2`, `t3` diberi field `whatsapp`: `081234567890`, `081323456789`, `082198765432`.

#### 3. Sinkronisasi otomatis (tanpa kode tambahan)
- Field `whatsapp?: string` sudah ada di `Teacher` interface (`src/types.ts:28`).
- `updateTeacher` (core.ts:935) menyimpan field utuh → alur **ProfilGuru → updateTeacher → getTeachers → DasborMurid** sudah sinkron otomatis.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/murid/DasborMurid.tsx` | +kolom WhatsApp, colSpan 6 |
| `src/data/store/core.ts` | seed teachers +whatsapp |

### 🔍 Status
- Tidak perlu link `wa.me` — hanya menampilkan nomor.

---

## 🗓️ Sesi 33 — Satu Pintu Data Statistik Sekolah (`dataSekolah.ts`) — TUNTAS

### ✅ Yang sudah selesai

#### 1. Audit kontradiksi data (diskusi)
Angka profil sekolah **hardcoded** di beberapa file dan bisa saling tidak sinkron:

| Angka | Lokasi hardcode |
|-------|-----------------|
| 1.850 (siswa) | `GtkSiswaPage.tsx`, `SekilasSekolah.tsx` (ringkasan + narasi) — di-define 3x |
| 97 (GTK) | `GtkSiswaPage.tsx` (total 45+30+22) + `SekilasSekolah.tsx` (hardcoded "97") |
| 36 (rombel), 3 (peminatan) | `SekilasSekolah.tsx` |
| Rasio 1:18, 98,5%, 75% | `GtkSiswaPage.tsx` |

- README lama bahkan menulis *"← GANTI ANGKA"* → memang dirancang edit manual per file.
- Ada **dua dunia data**: angka profil (97/1850) vs store operasional (`getTeachers()` hanya 3 guru) yang dipakai DasborMurid/admin.
- **Keputusan user: Config terpusat** (bukan derive dari store).

#### 2. `dataSekolah.ts` (BARU)
- **Path:** `src/fitur/halaman/components/Profile/dataSekolah.ts`
- **Primitif:** `tahunAjaran`, `komposisiGtk` (array), `siswaAktif`, `rombonganBelajar`, `programPeminatan`, `rasioGuruSiswa`, `tingkatKelulusan`, `penyerapanKerja`, + identitas (`namaSekolah`, `npsn`, `nss`, `statusSekolah`, `akreditasi`, `tahunBerdiri`, `kurikulum`, `waktuBelajar`).
- **Turunan otomatis (tidak bisa tidak sinkron):**
  - `totalGtk` = `komposisiGtk.reduce(...)` (sum)
  - `statistikSiswa` (nilai format `toLocaleString('id-ID')`)
  - `ringkasanSekolah` (dari `siswaAktif`, `totalGtk`, `rombonganBelajar`, `programPeminatan`)
  - `identitasSekolah` (dari primitif identitas)

#### 3. Konsumen yang dipindah ke satu pintu
- **`GtkSiswaPage.tsx`** — hapus `teacherData`/`studentStats`/`totalGtk` lokal → import `{ komposisiGtk, statistikSiswa, tahunAjaran, totalGtk }`; teks hero & footer pakai `tahunAjaran`.
- **`SekilasSekolah.tsx`** — hapus `ringkasan`/`identitas` lokal → import dari `dataSekolah`; **narasi di-interpolasi** (tidak bisa lepas dari config): `tahunBerdiri`, `akreditasi`, `kurikulum`, `siswaAktif.toLocaleString()`, `rombonganBelajar`, `programPeminatan`.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/halaman/components/Profile/dataSekolah.ts` | BARU — satu pintu data statistik & identitas sekolah |
| `src/fitur/halaman/components/Profile/GtkSiswaPage.tsx` | Import dari dataSekolah; total GTK dihitung otomatis |
| `src/fitur/halaman/components/Profile/SekilasSekolah.tsx` | Import ringkasan + identitas; narasi di-interpolasi |

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `eslint`: ✅ 0 error di file yang diubah (sisa 1 error + 4 warning **pre-existing** di file lain: `TabRiwayatLogin.tsx:26` no-empty-pattern, LazyLoad/Pagination/Toast/NotificationProvider react-refresh)

### ⏳ Catatan lanjutan
- `src/data/store/core.ts` masih menyimpan data operasional (3 guru, siswa, kelas) — angka publik 97/1850 sekarang dikelola di `dataSekolah.ts`, sengaja terpisah dari store (pilihan "Config terpusat").
- File lain yang belum dipindah ke satu pintu (opsional, di luar scope): `GuruPegawaiPage.tsx` (daftar guru statis sendiri), `fitur/tamu/data/schoolData.ts` (data tamu), README halaman.

---

## 🗓️ Sesi 34 — Perbaikan README Halaman + Session History Baru — TUNTAS

### ✅ Yang sudah selesai

#### 1. `src/fitur/halaman/README.md`
- Seksi **"4. Edit Konten Halaman GTK & Siswa"** (yang menunjuk `src/pages/GtkSiswaPage.tsx` + "GANTI ANGKA" per file) **diganti** menjadi **"4. Edit Konten GTK & Siswa / Sekilas Sekolah"** — mendokumentasikan `dataSekolah.ts` sebagai satu pintu (primitif yang diubah + turunan otomatis).
- Tabel **"Daftar File & Fungsinya"**: baris `GtkSiswaPage.tsx` diubah (sumber: `dataSekolah.ts`) + baris baru `Profile/dataSekolah.ts` (⭐⭐⭐ edit angka) dan `SekilasSekolah.tsx`.

#### 2. Session history
- `SESSION_HISTORY.md` sudah **2651 baris** (s.d. Sesi 30b) → dibuat file baru **`dokumentasi/SESSION_HISTORY_2.md`** berisi Sesi 31–34 (Kalender Akademik, WhatsApp, satu pintu data, README).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/halaman/README.md` | Seksi 4 → satu pintu `dataSekolah.ts`; tabel Daftar File diperbarui |
| `dokumentasi/SESSION_HISTORY_2.md` | BARU — lanjutan history (file lama sudah panjang) |

### 🔍 Status
- Perubahan dokumentasi saja (tanpa kode) — tidak perlu build.

---

## 🗓️ Sesi 35 — Audit `src/fitur/tamu` + Perbaikan Login Google — TUNTAS

### ✅ Yang sudah selesai

#### 1. Bug login Google
- `.env.local` berisi `VITE_GOOGLE_CLIENT_ID=test-client-id` yang **menimpa** fallback asli di `src/main.tsx:7-9` (`378551540056-4uh26d8e3ifgsdb1fvb2uqm0ee26nhbf.apps.googleusercontent.com`) → "akses diblokir".
- Perbaikan: `.env.local` diisi client ID asli. (Restart dev + hard refresh diperlukan.)

#### 2. Audit & pembersihan `src/fitur/tamu`
- `AgendaWidget.tsx` → memakai `getUpcomingAgenda(3)` dari `agenda.ts` (satu pintu agenda).
- Dihapus: `agendaItems` (di `guestData.ts`) dan type `AgendaItem` (di `tamu/types.ts`) — mati.
- Dihapus: `schoolProfile` & `galeriList` (mati) dari `tamu/data/schoolData.ts`.
- Semua template "SMP Negeri/Majenang" → "SMA Negeri 1 Medan" di schoolData.ts, Berita.tsx, FAQ.tsx, PPDB.tsx, BukuTamuForm.tsx, BukuTamuPage.tsx, TutorialModal.tsx; domain email → `@sman1medan.sch.id`.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `.env.local` | Client ID Google asli |
| `src/fitur/tamu/*` | Wiring agenda satu pintu; hapus data mati; ganti template nama sekolah |

### 🔍 Status
- tsc 0 error; eslint folder tamu + TutorialModal 0 error.

---

## 🗓️ Sesi 36 — Wiring Identitas Global ke Satu Pintu `dataSekolah.ts` — TUNTAS

### ✅ Yang sudah selesai

- `dataSekolah.ts` diperkaya: `alamat`, `kelurahan`, `kecamatan`, `kota`, `provinsi`, `kodePos`, `alamatLengkap`, `telepon`, `email`, `emailDomain`, `namaSekolahUppercase`, `mapsQuery`.
- Wiring ke titik identitas global (semua baca dari config):
  - `layout/Sidebar.tsx` — alt logo + nama di header (pakai `namaSekolahUppercase`).
  - `layout/ProgramFooter.tsx` — teks, link eksternal, berita, copyright + **tambah blok alamat/telepon/email**.
  - `autentikasi/DataLogingPage/constants.ts` — `SCHOOL_CONFIG.name`.
  - `autentikasi/TutorialModal.tsx` — 3 judul.
  - `perpustakaan/DashboardPerpustakaan.tsx`, `LoginPerpustakaan.tsx`, `BantuanPerpustakaan.tsx` — nama + email perpustakaan.
  - `admin/AdminPerpustakaan/ReturnReceipt.tsx` — **perbaiki sisa template** `PERPUSTAKAAN SMPN 1 MAJENANG`.
  - `tamu/pages/GuestDashboard.tsx` — nama, alamat, telepon, email, link maps (`mapsQuery`).
  - `utils/export.ts` — footer PDF (rapor/absensi/tagihan).
  - `penerimaan-siswa-baru/LandingPage.tsx` — nama di navbar.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/halaman/components/Profile/dataSekolah.ts` | + identitas kontak/alamat/maps |
| 9 file di atas | hardcode → baca `dataSekolah.ts` |

### 🔍 Status
- tsc 0 error; eslint file yang diubah 0 output.

---

## 🗓️ Sesi 37 — Level-Aware (SD/SMP/SMA/SMK) Template Universal — TUNTAS

### ✅ Yang sudah selesai

#### 1. Konfigurasi jenjang di `dataSekolah.ts`
- `export type JenjangSekolah = 'SD' | 'SMP' | 'SMA' | 'SMK'` dan `export const jenjang: JenjangSekolah = 'SMA'`.
- Helper: `isSmk/isSma/isSmp/isSd` (via fungsi `isJenjang` agar TS tidak menyempit literal), `namaJenjang` (label jenjang), `labelProgramSpesialisasi` (SMK: "Program Keahlian", SMA: "Program Peminatan", SMP/SD: "Program Unggulan") → `programSpesialisasi`.
- `komposisiGtk` **level-aware**: SMK → "Guru Produktif" + "Guru Normatif & Adaptif"; lainnya → "Guru Mata Pelajaran" + "Guru Bimbingan Konseling".
- `programPeminatan` **level-aware**: SMK → 7 (program keahlian), lainnya → 3 (peminatan).
- Ringkasan kilat label terakhir mengikuti `programSpesialisasi`.

#### 2. Gate konten level-spesifik
- `fitur/halaman/data.ts` — nav `navItems` menyembunyikan **"Program Keahlian"** untuk non-SMK (hanya relevan jenjang SMK).
- `fitur/halaman/pages/ProgramKeahlianPage.tsx` — guard `!isSmk` → fallback ramah bertema `programSpesialisasi` (hook `useState` dipindah ke atas agar eslint react-hooks lulus).
- `fitur/halaman/ExpectationModal.tsx` — detail `reg-01..07` dirender hanya untuk SMK, non-SMK → fallback; header & `HERO_CONFIG` pakai `namaSekolahUppercase`.
- `fitur/halaman/components/Profile/SekilasSekolah.tsx` — narasi & program desc menyesuaikan `namaJenjang[jenjang]` (SMK → program keahlian, lainnya → peminatan MIPA/IPS/Bahasa).
- `layout/ProgramFooter.tsx` — teks "lembaga pendidikan menengah atas" → `namaJenjang[jenjang].toLowerCase()`.

#### 3. Sisa hardcode nama sekolah dibersihkan (43 penggantian)
- 18 file publik (DataBeranda + tamu): `ResearchArticleSection`, `Prestasi`, `TestimoniCarousel`, `SilaAsaServiceSection`, `PendidikanSection`, `Galeri`, `VisiSection`, `Ekstrakurikuler`, `Fasilitas`, `HeroSection`, `LayananCarousel`, `SekolahBerdampakSection`, `testimoniData`, `BukuTamuPage`, `PPDB`, `BeritaKegiatanSection`, `Berita`, `FAQ` → semua baca `namaSekolah`/`namaSekolahUppercase`.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `dataSekolah.ts` | + jenjang, helper level, komposisi GTK & program spesialisasi level-aware |
| `data.ts`, `ProgramKeahlianPage.tsx`, `ExpectationModal.tsx`, `SekilasSekolah.tsx`, `ProgramFooter.tsx` | gate & narasi level-aware |
| 18 file halaman publik | hardcode nama → config |

### 🔍 Status
- tsc 0 error; eslint semua file yang diubah 0 output.

### 💡 Cara pakai template universal
- Cukup ubah **satu file** `src/fitur/halaman/components/Profile/dataSekolah.ts`:
  - `jenjang` → `'SD' | 'SMP' | 'SMA' | 'SMK'` (menu "Program Keahlian" & komposisi GTK otomatis menyesuaikan).
  - `namaSekolah`, `npsn`, alamat, `telepon`, `emailDomain`, statistik, dsb. → semua halaman ikut berubah.
- Konten artikel (Berita/Ekskul/Program/Riset/Sarana di `halaman/components/*`) & seed `guestData.ts` masih isi demo — sekolah pembeli mengganti isinya.

---

## 🗓️ Sesi 38 — Audit & Implementasi SIAKAD Tier 1 (KKM, Jurnal, Rekap, Wali Kelas, Mutasi) — TUNTAS

> Laporan lengkap: `dokumentasi/AUDIT_SIAKAD_TIER1.md`. Implementasi berurutan Area 1 → 5.

### ✅ Yang sudah selesai

#### 1. Audit SIAKAD Tier 1 (`dokumentasi/AUDIT_SIAKAD_TIER1.md`)
- 5 area disorot dengan file:line, gap, rekomendasi: KKM, jurnal mengajar, rekap/ekspor, wali kelas, mutasi.
- Temuan besar: predikat hardcode terduplikasi 3x (batas inkonsisten), `CatatanRpsGuru.tsx` & `ManajemenSiswa.tsx` dead code, bulk move kelas tidak menulis log mutasi.

#### 2. Area 1 — KKM & Penilaian satu pintu (TUNTAS)
- `src/utils/penilaian.ts` baru: `KKM_DEFAULT` (75), `KONFIGURASI_PENILAIAN` (bobot tugas 30% + UTS 30% + UAS 40%; predikat A≥90, B≥80, C≥70, D≥60, E<60), `hitungNilaiAkhir`, `hitungPredikat`/`getPredikat`, `isTuntas`, `getBobotNilai`.
- Wiring: `InputRapotGuru` (badge TUNTAS/BELUM TUNTAS), `RapotSiswa` (kolom Ketuntasan + strip KKM + rekap Tuntas x/y), `DasborOrangTua` & `ProfileOrangTuaPage` (hapus predikat lokal batas keliru D<70), `export.ts` (PDF & CSV rapot + kolom Tuntas + info KKM).
- Test: `src/utils/penilaian.test.ts` (6 test) lulus.

#### 3. Area 2 — Jurnal Mengajar Guru (TUNTAS)
- `src/fitur/guru/JurnalMengajarGuru.tsx` baru: pilih kelas (`teacher.classIds`) + mapel (`teacher.subject` + roster kelas), form via `CatatanRpsGuru` (kini live), rekap filter tanggal, ekspor PDF/CSV.
- Wiring: App.tsx key `'jurnal-mengajar'`, Sidebar "Jurnal Mengajar" (`NotebookPen`), routes `GURU_JURNAL_MENGAJAR`.
- `export.ts`: `exportJurnalPdf` + `exportJurnalCsv` + test (2 case).

#### 4. Area 3 — Rekap Nilai Guru (TUNTAS)
- `src/fitur/guru/RekapNilaiGuru.tsx` baru: filter kelas→mapel→semester→TA, matriks siswa×nilai, kartu statistik (Rata-rata, Tuntas, Belum Tuntas), badge per siswa, ekspor PDF/CSV.
- Wiring: App.tsx key `'rekap-nilai'`, Sidebar "Rekap Nilai" (`BarChart3`), routes `GURU_REKAP_NILAI`.
- `export.ts`: `exportRekapNilaiPdf` (ringkasan rata-rata + % ketuntasan) + `exportRekapNilaiCsv` (header KKM) + tipe `RekapNilaiRow` + test (2 case).

#### 5. Area 4 — Wali Kelas / Kelola Siswa (TUNTAS)
- `ManajemenSiswa.tsx` (dead code) kini live: key `'student-management'`, Sidebar "Kelola Siswa" (`Users`), routes `GURU_KELOLA_SISWA`, `useStoreVersion` agar daftar reaktif.
- QuickAction `student-management` di `DasborGuru` kini berfungsi.

#### 6. Area 5 — Mutasi Siswa (TUNTAS)
- `types.ts`: `Student.status?`/`statusNote?`/`statusUpdatedAt?`, `StudentStatus = 'aktif'|'keluar'|'lulus'|'pindah'`, `StudentStatusMutation`.
- `core.ts`: key `STUDENT_STATUS_MUTATION_KEY`; `getStudentStatusMutations`, `addStudentStatusMutation`, `setStudentStatus` (wrapper saveStudent + log; menolak duplikat status sama).
- `studentService.ts` & `index.ts` barrel: re-export fungsi + tipe status mutation.
- `TabKelolaKelas.tsx`: bulk move `handleExecuteMove` menulis `addStudentClassMutation` per siswa.
- `TabAkunSiswa.tsx`: kolom Status + badge warna, tombol "Mutasi" per baris, modal ubah status (dropdown + catatan), panel log dua seksi (Riwayat Status + Riwayat Mutasi Kelas).
- Siswa baru dari PPDB ACCEPTED diberi `status: 'aktif'`.
- Filter status aktif di sisi login: siswa & ortu (`AuthContext`), perpustakaan (`LoginPerpustakaan`); statistik kelas guru (`DasborGuru`) hanya menghitung siswa aktif.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/utils/penilaian.ts` + `.test.ts` | baru — satu pintu KKM/predikat/bobot |
| `src/fitur/guru/JurnalMengajarGuru.tsx`, `RekapNilaiGuru.tsx` | baru — halaman guru |
| `src/types.ts` | + Student.status/statusNote/statusUpdatedAt, StudentStatus, StudentStatusMutation |
| `src/data/store/core.ts` | + getStudentStatusMutations/addStudentStatusMutation/setStudentStatus |
| `src/data/services/studentService.ts`, `index.ts` | re-export mutasi status |
| `src/fitur/admin/components/TabKelolaKelas.tsx` | bulk move menulis log mutasi |
| `src/fitur/admin/components/TabAkunSiswa.tsx` | kolom status, tombol Mutasi, modal, log status |
| `src/context/AuthContext.tsx`, `LoginPerpustakaan.tsx`, `DasborGuru.tsx` | filter siswa aktif |
| `src/App.tsx`, `src/layout/Sidebar.tsx`, `src/routes.ts` | wiring jurnal-mengajar, rekap-nilai, student-management |
| `src/data/store.test.ts` | + 3 test status mutation |

### 🔍 Status
- tsc 0 error; eslint 0 output; 167 test lulus (13 file).

### 💡 Catatan untuk sekolah pembeli
- KKM default 75 & bobot penilaian bisa diubah satu pintu di `src/utils/penilaian.ts`.
- Mutasi siswa kini tercatat & terkontrol: siswa `keluar/lulus/pindah` otomatis tidak bisa login.

---

## 🗓️ Sesi 39 — SIAKAD Tier 2 Item 1: Rekap Absensi per Bulan per Kelas + Standarisasi CSV BOM — TUNTAS

> Pekerjaan lanjutan dari `perencanaan.md` (Tier 2, urutan 1 → 2 → 4 → 5 → 3).

### ✅ Yang sudah selesai

#### 1. `src/utils/export.ts` — 2 fungsi CSV baru (pakai `exportToCsv` = sudah BOM)
- `AbsensiExportRow` + `exportAbsensiCsv(rows, className, startDate, endDate)` — ekspor matriks absensi siswa (Nama, NIS, Hadir, Izin, Sakit, Alpha, Total, Persentase). Filename: `Laporan_Absensi_<kelas>_<tgl>.csv`.
- `AbsensiKelasRow` + `exportAbsensiPerKelasCsv(rows, startDate, endDate)` — ekspor rekap per kelas (Kelas, Siswa Terdata, H/I/S/A, Total, Persentase). Filename: `Rekap_Absensi_PerKelas_<tgl>.csv`.

#### 2. `src/fitur/guru/HalamanLaporan.tsx` — mode "Per Bulan" + CSV BOM
- State baru: `reportMode` (`'range' | 'monthly'`), `selectedMonth` (default bulan berjalan).
- `monthRange` memo → `start` = tanggal 1 bulan, `end` = akhir bulan (pad tanggal benar); `effectiveStart/End` dipakai seluruh kalkulasi (reportData + dates).
- **Toggle mode** di filter (gaya neubrutalism sesuai `PromptUser.md`: `border-2 border-black`, aktif `border-blue-600`, `hover:bg-neutral-100`).
- Saat `monthly`: dua input tanggal diganti **`<input type="month">`**.
- **Tabel "Rekap Absensi per Kelas"** (mode monthly) — matriks semua kelas binaan guru untuk bulan terpilih (judul bulan Indonesia via `toLocaleDateString('id-ID')`). Muncul tanpa perlu memilih kelas.
- **CSV inline dihapus** → `handleExportCSV` pakai `exportAbsensiCsv` (BOM, escaping aman). Tombol baru **"CSV KELAS"** (mode monthly) → `exportAbsensiPerKelasCsv`.
- Tombol CSV/PDF hanya tampil saat ada data (`reportData.length > 0` atau kelasRekap non-kosong).

#### 3. Test (`src/utils/export.test.ts`) — +4 test (total 171)
- `exportAbsensiCsv`: nama file + kolom (spasi kelas → `_`), empty rows.
- `exportAbsensiPerKelasCsv`: nama file + kolom, empty rows.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/utils/export.ts` | +`AbsensiExportRow`, +`exportAbsensiCsv`, +`AbsensiKelasRow`, +`exportAbsensiPerKelasCsv` |
| `src/utils/export.test.ts` | +4 test CSV absensi |
| `src/fitur/guru/HalamanLaporan.tsx` | mode Per Bulan, month picker, tabel rekap per kelas, CSV → `exportToCsv` (BOM) |
| `dokumentasi/perencanaan.md` | Tier 2 item 1 ✅ SELESAI (status 1/5) |

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `eslint` (3 file diubah): ✅ 0 output
- `vitest` full: ✅ **171 passed** (13 files; sebelumnya 167)
- `npm run build`: ✅ sukses

### ⏳ Catatan lanjutan
- Lanjut **Tier 2 item 2** — Dashboard ringkasan wali kelas khusus (`src/fitur/guru/DasborWaliKelas.tsx` + wiring App.tsx/Sidebar/routes).

---

## 🗓️ Sesi 40 — SIAKAD Tier 2 Item 2: Dashboard Ringkasan Wali Kelas — TUNTAS

> Pekerjaan lanjutan dari `perencanaan.md` (Tier 2, urutan 1 → 2 → 4 → 5 → 3).

### ✅ Yang sudah selesai

#### 1. `src/fitur/guru/DasborWaliKelas.tsx` (BARU)
- Komponen `PageProps { onNavigate }`, pola `useAuth` + `useStoreVersion` (loading skeleton saat `storeVersion === 0`).
- **Kelas binaan** dari `teacher.classIds` (`getTeachers` → `getClasses` filter).
- Header: judul + nama guru + badge "N Kelas Binaan".
- **4 quick links** → `onNavigate`: Kelola Siswa (`student-management`), Rekap Nilai (`rekap-nilai`), Input Rapot (`rapot-input`), Jurnal Mengajar (`jurnal-mengajar`).
- **6 kartu statistik agregat**: Siswa Aktif, Laki-laki, Perempuan, Hadir Bulan Ini, Absen (I/S/A), Rata-rata Kehadiran.
- **Chip rekap status mutasi** (aktif/keluar/lulus/pindah + jumlah) — pakai `StudentStatus` + `STATUS_META`.
- **Tabel "Rekap per Kelas Binaan"**: per kelas → Siswa, L, P, H/I/S/A, % Hadir (badge warna ≥80 emerald / ≥60 amber / <60 rose). Periode = bulan berjalan (`getAttendanceByDateRange(start, end, classId)`).
- **Panel Pengumuman Terbaru** (4 terbaru via `getSchoolAnnouncements`) + tautan "Lihat Semua" → `school-announcements`.
- Empty state untuk guru tanpa kelas binaan.

#### 2. Wiring (route + registry + sidebar)
- `src/routes.ts`: +`GURU_WALI_KELAS: '/guru/wali-kelas'` + map `'wali-kelas'` di `TEACHER_PAGE_ROUTES`.
- `src/App.tsx`: +`LazyDasborWaliKelas` + registrasi `'wali-kelas': LazyDasborWaliKelas` di `TEACHER_PAGES`.
- `src/layout/Sidebar.tsx`: item menu guru **"Wali Kelas"** (ikon `ShieldCheck`) di section MENU UTAMA setelah Dashboard; ikon diimpor.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/guru/DasborWaliKelas.tsx` | **BARU** — dashboard wali kelas |
| `src/routes.ts` | +`GURU_WALI_KELAS` + map `'wali-kelas'` |
| `src/App.tsx` | +lazy import + registri `TEACHER_PAGES` |
| `src/layout/Sidebar.tsx` | +menu "Wali Kelas" (ShieldCheck) |
| `dokumentasi/perencanaan.md` | Tier 2 item 2 ✅ SELESAI (status 2/5) |

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `eslint` (4 file diubah): ✅ 0 output
- `vitest` full: ✅ **171 passed** (13 files)
- `npm run build`: ✅ sukses (chunk baru `DasborWaliKelas-*.js`)

### ⏳ Catatan lanjutan
- Lanjut **Tier 2 item 4** — Surat keterangan pindah & ekspor rekam mutasi (`exportMutationsPdf`/`exportMutationsCsv` di `src/utils/export.ts` + tombol ekspor di `TabAkunSiswa.tsx`).

---

## 🗓️ Sesi 41 — SIAKAD Tier 2 Item 4: Surat Keterangan Pindah & Ekspor Rekam Mutasi — TUNTAS

> Pekerjaan lanjutan dari `perencanaan.md` (Tier 2, urutan 1 → 2 → 4 → 5 → 3).

### ✅ Yang sudah selesai

#### 1. `src/utils/export.ts` — 3 fungsi ekspor mutasi
- `MutasiSiswaRow { jenis: 'Status' | 'Kelas'; waktu; dari; ke; catatan }` — baris normalisasi gabungan log status + log kelas.
- `exportMutationsCsv(rows, studentName)` — CSV via `exportToCsv` (BOM). Kolom: Jenis, Waktu, Dari, Ke, Catatan. Filename: `Riwayat_Mutasi_<nama>_<tgl>.csv`.
- `exportMutationsPdf(rows, studentName)` — PDF tabel rekap mutasi (header + footer + redraw header per halaman, pola `exportRekapNilaiPdf`). Filename: `Riwayat_Mutasi_<nama>_<tgl>.pdf`.
- `exportSuratMutasiPdf(params)` — **surat keterangan pindah/keluar printable** (jsPDF): judul SURAT KETERANGAN PINDAH SEKOLAH / KELUAR, kop alamat + kota sekolah (`alamatLengkap`, `kota` dari `dataSekolah`), data siswa (nama, NIS, kelas, tanggal mutasi), paragraf keterangan + alasan, kolom tanda tangan Kepala Sekolah. Filename: `Surat_Pindah_<nama>.pdf` / `Surat_Keluar_<nama>.pdf`.

#### 2. `src/fitur/admin/components/TabAkunSiswa.tsx` — tombol ekspor di panel Log Mutasi
- Memo `mutationRows` menggabungkan `statusMutations` + `classMutations` → `MutasiSiswaRow[]` (nama kelas resolve via `resolveClassName`, label status via `STATUS_LABEL`).
- Di `actions` Card Log Mutasi:
  - **CSV** (`handleExportMutationsCsv`) & **PDF** (`handleExportMutationsPdf`) — hanya tampil saat `mutationRows.length > 0`.
  - **Surat Pindah/Keluar** (`handleExportSuratMutasi`) — hanya tampil saat siswa berstatus `pindah`/`keluar`; memakai `statusNote` + `statusUpdatedAt` siswa.
- Toast `success`/`error` pada setiap aksi (signature `showToast(type, message)`).

#### 3. Test (`src/utils/export.test.ts`) — +2 test (total 173)
- `exportMutationsCsv`: nama file `Riwayat_Mutasi_<nama>_...csv` + 1× click; empty rows → tetap `.csv` + click.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/utils/export.ts` | +`MutasiSiswaRow`, +`exportMutationsCsv`, +`exportMutationsPdf`, +`exportSuratMutasiPdf` (+import `namaSekolah`, `alamatLengkap`, `kota`) |
| `src/utils/export.test.ts` | +2 test `exportMutationsCsv` |
| `src/fitur/admin/components/TabAkunSiswa.tsx` | +memo `mutationRows`, +3 handler ekspor, tombol CSV/PDF/Surat di actions Card Log Mutasi |
| `dokumentasi/perencanaan.md` | Tier 2 item 4 ✅ SELESAI (status 3/5) |

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `eslint` (3 file diubah): ✅ 0 output
- `vitest` full: ✅ **173 passed** (13 files; sebelumnya 171)
- `npm run build`: ✅ sukses

### ⏳ Catatan lanjutan
- Lanjut **Tier 2 item 5** — Alur mutasi masuk (non-PPDB) dari sekolah lain: form tambah siswa berpenanda "mutasi masuk" + catat `StudentStatusMutation` (`fromStatus` di luar sistem → `aktif`) + `generateStudentNis`.

---

## 🗓️ Sesi 42 — SIAKAD Tier 2 Item 5: Alur Mutasi Masuk (Non-PPDB) — TUNTAS

> Pekerjaan lanjutan dari `perencanaan.md` (Tier 2, urutan 1 → 2 → 4 → 5 → 3).

### ✅ Yang sudah selesai

#### 1. `generateStudentNis` diekspor (core + service layer)
- `src/data/store/core.ts`: `generateStudentNis(students)` — dari private → **export** (tahun berjalan + 3 digit serial dari max NIS terakhir; fallback `001`).
- `src/data/services/studentService.ts` + barrel `services/index.ts`: re-export `generateStudentNis`.

#### 2. Form "Mutasi Masuk" di `TabAkunSiswa.tsx`
- State baru `isMutasiMasuk` + `asalSekolah` (opsional).
- **Toggle mode** di header section "Registrasi Siswa Baru": `Mode Reguler` ↔ `Mode Mutasi Masuk` (neubrutalism, aktif `bg-black text-white`, ikon `ArrowRightLeft`).
- Saat mode mutasi masuk:
  - Input NIS diganti **display readonly NIS otomatis** (`generateStudentNis(students)`).
  - Muncul input **Asal sekolah (opsional)**.
  - Tombol jadi **"Daftar Mutasi"**; muncul hint "NIS dibuat otomatis & dicatat sebagai mutasi masuk".
- `handleAddStudent` untuk mutasi masuk:
  - Validasi nama + kelas saja (NIS auto), cek duplikat NIS.
  - Siswa dibuat dengan `status: 'aktif'`, `statusNote: 'Mutasi masuk dari ...'`, `statusUpdatedAt`.
  - **Log `addStudentStatusMutation`**: `fromStatus: 'pindah'` → `toStatus: 'aktif'` dengan note mutasi masuk (mewakili "dari luar sistem" karena tipe `fromStatus` terbatas `StudentStatus`).
  - Reset form + toast sukses dengan NIS baru.

#### 3. Test (`src/data/store.test.ts`) — +2 test (total 175)
- `generateStudentNis`: increment dari max serial (`${year}008`); fallback `${year}001` saat tidak ada yang bisa diparsing.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/data/store/core.ts` | `generateStudentNis` jadi export |
| `src/data/services/studentService.ts`, `index.ts` | re-export `generateStudentNis` |
| `src/fitur/admin/components/TabAkunSiswa.tsx` | toggle mode mutasi masuk, NIS auto, asal sekolah, handler mutasi masuk + log status |
| `src/data/store.test.ts` | +2 test `generateStudentNis` |
| `dokumentasi/perencanaan.md` | Tier 2 item 5 ✅ SELESAI (status 4/5) |

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `eslint` (5 file diubah): ✅ 0 output
- `vitest` full: ✅ **175 passed** (13 files; sebelumnya 173)
- `npm run build`: ✅ sukses

### ⏳ Catatan lanjutan
- **Tier 2 sudah TUNTAS (5/5)** — lihat Sesi 43 di bawah.

---

## 🗓️ Sesi 43 — SIAKAD Tier 2 Item 3: Sinkronisasi Field Frontend/Backend + Homeroom di Prisma — TUNTAS

> Pekerjaan lanjutan dari `perencanaan.md` (Tier 2, urutan 1 → 2 → 4 → 5 → 3). **Item terakhir Tier 2.**

### ✅ Yang sudah selesai

#### 1. `backend/prisma/schema.prisma` — field baru
- **`ClassRoom`** +`teacherId String?` + relasi `homeroomTeacher Teacher? @relation("HomeroomTeacher", fields: [teacherId], references: [id], onDelete: SetNull)` + `@@index([teacherId])`. (Padanan `ClassRoom.teacherId` yang sudah ada di frontend `src/types.ts`.)
- **`Teacher`** +`homeroomClasses ClassRoom[] @relation("HomeroomTeacher")` (back-relation).
- **`ClassRoomTeacher`** (M2M) +`isHomeroom Boolean @default(false)` — penanda homeroom/wali kelas.
- **`ReportCard`** +`predikat String?` — sinkron `NilaiRapot.predikat` (frontend) ke model nilai backend.

#### 2. `backend/prisma/seed.ts`
- Saat guru punya `classCode`, `ClassRoomTeacher` dibuat/update dengan `isHomeroom: true` dan `ClassRoom.teacherId` di-set ke guru tersebut (Andi→X IPA 1, Rina→X IPA 2).

#### 3. `backend/src/modules/auth/auth.service.ts` — `loginTeacher`
- Response user guru kini menyertakan `classIds` (dari `ClassRoomTeacher`) dan `homeroomClassIds` (dari `ClassRoom.teacherId`) — backward compatible (field baru, tak menghapus yang lama).

#### 4. Prisma client + migration
- `npm run prisma:generate` ✅ (client v6.19.3 ter-regenerate sesuai schema baru).
- DB lokal `localhost:5432/absensi_db` **tidak sedang berjalan** → `prisma migrate dev --create-only` gagal (P1001). Solusi: migration dibuat manual via `prisma migrate diff` (dari `git show HEAD` schema lama) → `prisma/migrations/20260802090000_add_homeroom_predikat/migration.sql` (ALTER TABLE `ClassRoom`/`ClassRoomTeacher`/`ReportCard`, index, FK `ON DELETE SET NULL`).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `backend/prisma/schema.prisma` | +`ClassRoom.teacherId` & relasi homeroom, +`ClassRoomTeacher.isHomeroom`, +`ReportCard.predikat` |
| `backend/prisma/migrations/20260802090000_add_homeroom_predikat/migration.sql` | **BARU** — migration manual (DB mati) |
| `backend/prisma/seed.ts` | set `teacherId` wali kelas + `isHomeroom` |
| `backend/src/modules/auth/auth.service.ts` | `loginTeacher` +`classIds`/`homeroomClassIds` |
| `dokumentasi/perencanaan.md` | Tier 2 item 3 ✅ SELESAI (status 5/5) |

### 🔍 Status
- Backend `npm run build` (tsc): ✅ 0 error
- Frontend `tsc --noEmit`: ✅ 0 error
- Frontend `vitest` full: ✅ **175 passed** (13 files)
- ⚠️ Migration SQL belum di-apply ke DB (Postgres lokal mati). Saat DB nyala, jalankan `npm run prisma:migrate` (atau `prisma migrate deploy`) di `backend/` untuk menerapkan.

### ⏳ Catatan lanjutan
- **SIAKAD Tier 2 selesai 5/5.** Langkah lanjutan potensial: review menyeluruh SIAKAD, README halaman Sesi 35–37, atau perbaikan lint pre-existing.

### 🧱 Diskusi tambahan sesi ini — Rencana Modularisasi (belum dieksekusi)
- Pengguna melihat beberapa file sudah terlalu panjang setelah banyak sesi diskusi; diminta pendapat: modular atau tetap seperti ini.
- **Keputusan diskusi:** modular, tapi **selektif**. Pecah file yang satu tanggung jawabnya tercampur; biarkan halaman monolitik yang rapi.
- **Temuan audit ukuran file** (baris teratas): `store/core.ts` (2012), `AdminPanel.tsx` (1339), `DiskusiTugas.tsx` (1201), `ProfileOrangTuaPage.tsx` (967), `export.ts` (835).
- **Rencana konkret `core.ts`** (baris 610+): pecah jadi folder `store/core/` — `db.ts` (infra readDB/writeDB/store/subscribe), `seedData.ts` (INITIAL DATA), modul domain (`students`, `attendance`, `classes`, `teachers`, `assignments`, `library`, `ppdb`, `chat`, `grades`, `billing`, `misc`), lalu `core.ts` jadi **barrel re-export** → 18 file yang import `../store/core` **tidak berubah sama sekali**.
- Hanya 18 file yang mengimpor dari `core.ts` (semua via `data/services/` & `hooks/`) — aman untuk pola barrel.
- **Status: 🔄 RENCANA — belum dieksekusi.** Pengguna memilih "Lihat dulu, jangan ubah".

---

## 🗓️ Sesi 44 — Fix Hardcode Nama Sekolah + `alert()` di DasborKalenderAkademik — TUNTAS

### ✅ Yang sudah selesai

`src/fitur/halaman/components/KalenderAkademik/DasborKalenderAkademik.tsx`:
- **Garis bawah header "Agenda Terdekat" dibuat hitam** — sebelumnya `border-blue-600` saat panel terbuka (gaya "aktif" neubrutalism), kini selalu `border-black` agar konsisten hitam-putih.
- **Fix garis bawah tebal saat panel "Agenda Terdekat" ditutup** — `border-b-2` header dibuat kondisional (hanya saat `upcomingOpen`) sehingga tidak bertumpuk dengan border bawah panel (`border-2`) → saat tertutup hanya ada 1 garis tipis.
- **Hardcode "SMA Negeri 1 Medan" dihapus (2 tempat)** — header halaman (`:504`) & judul bagian per-semester (`:874`) kini membaca `namaSekolah` dari `src/fitur/halaman/components/Profile/dataSekolah.ts` (satu-pintu, arsitektur Sesi 36–37).
- **`alert()` placeholder PDF diganti** — tombol "PDF" kini `showToast('info', 'Fitur unduh kalender akademik PDF sedang disiapkan.')` via `useToast()` dari `@/components/ui` (konvensi Sesi 16 — no `alert` di production).
- **Modal detail → tampilan full-layar (bukan popup)** — atas permintaan user: klik "Lihat" kini menampilkan **halaman detail penuh** di area konten (tetap di bawah sidebar, tanpa overlay popup). Implementasi: hapus portal modal, tambah komponen `AgendaDetailView` (badge tipe + tanggal/waktu di header, tombol **X** untuk tutup, kartu Tanggal/Waktu/Lokasi, deskripsi), render root jadi kondisional `detailItem ? <AgendaDetailView/> : <dashboard>`. Tombol tutup memakai ikon `X` (bukan "Kembali") agar lebih simpel & profesional.
- Import baru: `useToast`, `namaSekolah`.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/halaman/components/KalenderAkademik/DasborKalenderAkademik.tsx` | +3 import, hardcode → `namaSekolah` (2x), `alert()` → `showToast('info', ...)`, modal detail → `AgendaDetailView` full-layar (hapus portal) |

### 🔍 Status
- `eslint` (file diubah): ✅ 0 output
- `tsc --noEmit`: ✅ 0 error

### ⏳ Catatan lanjutan (dari review, belum dikerjakan)
- Duplikasi helper parse tanggal (`MONTH_MAP`, `parseDate`, `getAgendaDateInfo`) antara `AgendaData/agenda.ts` & dashboard — kandidat ekstraksi modul bersama.
- `today` (`useMemo([])`) & `upcomingAgenda(5)` tidak refresh jika app dibiarkan terbuka melewati tengah malam.
- Export PDF kalender masih placeholder (toast) — bisa diimplementasi nyata memakai jsPDF/`export.ts`.

---

## 🗓️ Sesi 45 — Seragamkan Ukuran Teks Semua Halaman Siswa (Menu Utama) — TUNTAS

### ✅ Yang sudah selesai

Skala standar disepakati dari sampel **Dasbor Murid** (H1 = `text-lg`, subjudul/info header = `text-xs`, label uppercase/meta = `text-[10px]`, nilai statistik = `text-lg`/`text-xl`, judul section = `text-xs`, header & isi tabel = `text-xs`, chip/badge = `text-[10px]`).

File di-`src/fitur/murid/` + Kalender Akademik diseragamkan:

| File | Perubahan |
|------|-----------|
| `DasborMurid.tsx` | Sampel. Hapus 2 outlier `text-[11px]` → `text-xs` (total legend) & `text-[10px]` (chip mapel guru) |
| `RosterKelas.tsx` | H1 `text-sm`→`text-lg`, subjudul & badge kelas `text-[11px]`→`text-xs`, judul section `text-[10px]`→`text-xs`, thead & isi tabel `text-[10px]`/`text-[11px]`→`text-xs` |
| `RiwayatAbsensi.tsx` | H1 `text-sm`→`text-lg`, subjudul `text-[11px]`→`text-xs`, judul section (2) `text-[10px]`→`text-xs`, label bulan & tanggal kalender `text-[11px]`→`text-xs`, label meta `text-[9px]`→`text-[10px]` |
| `KantongTugas.tsx` | Judul tugas `text-base`→`text-lg` (menyamakan dengan H1 halaman lain) |
| `RapotSiswa.tsx` | Subjudul header biru & container identitas `text-[10px]`/`text-[11px]`→`text-xs`, isi tabel `text-[11px]`/`text-[10px]`→`text-xs` |
| `TagihanSekolah.tsx` | H1 `text-sm`→`text-lg`, subjudul `text-[11px]`→`text-xs`, label kartu `text-[9px]`→`text-[10px]`, nilai kartu `text-xs`→`text-lg`, judul section (2) `text-[10px]`→`text-xs`, thead `text-[10px]`→`text-xs`, isi tabel `text-[11px]`→`text-xs` |
| `KirimSuratMurid.tsx` | H1 `text-sm`→`text-lg`, feedback `text-[11px]`→`text-xs`, chip tipe & badge status `text-[9px]`→`text-[10px]` |
| `DasborKalenderAkademik.tsx` | H1 `text-base`→`text-lg`, subjudul & badge tanggal `text-[11px]`→`text-xs`, judul section `text-sm`/`text-[11px]`→`text-xs`, thead & isi tabel `text-[10px]`/`text-sm`→`text-xs`, judul agenda terdekat & detail `text-sm`→`text-xs`, judul detail `text-2xl`→`text-lg`, dropdown tahun/tombol PDF `text-[11px]`→`text-xs`, label legenda `text-[11px]`→`text-xs`, "+N lainnya" `text-[9px]`→`text-[10px]` |

Catatan: `ProfilMurid.tsx` tidak disertakan (di luar daftar menu utama yang diminta).

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `grep` verifikasi: tidak ada lagi `text-[9px]`/`text-[11px]`/`text-sm`/`text-base` di file yang diseragamkan (kecuali `ProfilMurid` di luar scope)

---

## 🗓️ Sesi 46 — Seragamkan Halaman Guru ke Neubrutalism Standar Siswa — TUNTAS

### ✅ Yang sudah selesai

Permintaan user: setelah halaman **siswa** (Sesi 45) seragam neubrutalism + skala teks, terapkan standar yang sama ke **guru** (prioritas sesi ini), lalu **orang tua & admin** menyusul. **Tamu biarkan** (desain publik/marketing tetap). Keputusan: **samakan penuh** dengan standar siswa.

#### Skala teks standar (dari DasborMurid)
- H1 = `text-lg leading-none font-bold tracking-tight text-black`
- Subjudul/info header = `text-xs leading-none font-bold text-black`
- Label uppercase/meta = `text-[10px] font-bold tracking-wider uppercase`
- Nilai statistik = `text-xl leading-tight font-bold`
- Judul section = `text-xs font-bold tracking-wider uppercase` + `border-b-2 border-black`
- Header & isi tabel = `text-xs`; chip/badge = `text-[10px]`
- Container = `mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200`

#### Markup neubrutalism
- Kartu/tabel/panel: `rounded-md border-2 border-black bg-white`
- Tombol: `rounded-md border-2 border-black bg-white ... hover:bg-neutral-100 hover:border-blue-600 hover:text-blue-600`
- Tombol utama (solid): `bg-black text-white`; aksi berwarna: `border-2 border-blue-600 bg-blue-600 text-white` (PDF), emerald/rose untuk status tuntas
- Tabel: thead `border-b-2 border-black` + `text-xs uppercase`; tbody `divide-y-2 divide-black/10`; baris `hover:bg-neutral-100`
- Empty state: `rounded-md border-2 border-dashed border-black bg-white`
- Toggle aktif: `border-blue-600` (tetap `bg-white text-black`)

#### File yang diubah (15 file guru + 1 komponen bersama)
| File | Perubahan utama |
|------|----------------|
| `DasborGuru.tsx` | slate → neubrutalism penuh; H1 text-base→text-lg; kartu stat border-2; chart card border-2; RPS button outline |
| `DasborWaliKelas.tsx` | rounded-2xl+shadow → border-2; quick links neubrutalism; STATUS_META border-2; tabel & pengumuman neubrutalism |
| `HalamanLaporan.tsx` | container/header/tabel/filter → border-2; statusClassName H/I/S/A border-2; chip % berwarna |
| `HalamanAbsensi.tsx` | border→border-2 semua; H1 text-base→text-lg; tombol status border-2 |
| `HalamanRpsGuru.tsx` | slate korporat → neubrutalism; **hapus komponen `Button`/`Card`** → tombol inline border-2 |
| `InputRapotGuru.tsx` | border→border-2 via replaceAll; `predikatClassName` 1px→`border-2` (fix review); select/input rounded-md + hover |
| `RekapNilaiGuru.tsx` | korporat → neubrutalism; kartu stat Tuntas/Belum berwarna emerald/rose; tabel border-2 |
| `JurnalMengajarGuru.tsx` | korporat → neubrutalism; filter/header/tabel border-2 |
| `CatatanRpsGuru.tsx` | border→border-2; tombol SIMPAN solid hitam |
| `AturRosterGuru.tsx` | korporat → neubrutalism; panel kiri/kanan border-2; tombol SUNTIK solid hitam |
| `AturPengumumanGuru.tsx` | border→border-2; tombol SIARKAN solid hitam |
| `AturTugasOnlineGuru.tsx` | border→border-2; tombol Tambah biru → outline biru; tombol Terbitkan border-2; label/placeholder text-black/40 |
| `KotakSuratGuru.tsx` | korporat → neubrutalism; kalender dropdown, filter status, detail surat border-2 |
| `ManajemenSiswa.tsx` | rounded-2xl+shadow+gradient → border-2; modal neubrutalism; chip stat berwarna |
| `ProfilGuru.tsx` | korporat → neubrutalism; banner/avatar/detail/form border-2; tombol Simpan solid hitam |
| `src/components/ui/QuickActions.tsx` | **komponen bersama** — kartu korporat berwarna → flat neubrutalism (border-2 border-black, hover:bg-neutral-100); `color` prop kini diabaikan (dead prop, dibersihkan saat ortu/admin dikonversi) |

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `eslint` (16 file): ✅ 0 output
- `vitest` full: ✅ **175 passed** (13 files)
- `vite build`: ✅ sukses
- Code review: 2 temuan diperbaiki (predikat 1px → border-2; Button/Card korporat → inline neubrutalism)

### ⏳ Catatan lanjutan
- Lanjut **Orang Tua** (`DasborOrangTua.tsx` 456 baris + `ProfileOrangTuaPage.tsx` 1037 baris) → lalu **Admin** (PanelAdminModal + 10 tab + komponen perpus).
- `QuickActions.color` dead prop — bersihkan saat ortu dikonversi (hapus argumen color dari pemanggil).
- Aksesibilitas: pertimbangkan `focus-visible:ring-2 ring-blue-600` untuk tombol ikon (di luar scope sesi ini, konsisten dengan pola siswa).

---

## 🗓️ Sesi 47 — Seragamkan Halaman Orang Tua ke Neubrutalism Standar Siswa — TUNTAS

### ✅ Yang sudah selesai

Permintaan user: lanjutkan penyeragaman neubrutalism ke halaman **Orang Tua** (`DasborOrangTua.tsx` + `ProfileOrangTuaPage.tsx`), samakan penuh dengan standar siswa/guru (Sesi 45–46). **Tamu tetap dibiarkan.**

#### 1. `src/fitur/orang-tua/DasborOrangTua.tsx` (456 baris)
- Container korporat `max-w-7xl bg-slate-50 p-6 text-slate-900` → `mx-auto max-w-[1400px] space-y-4 bg-white p-3 text-black antialiased selection:bg-neutral-200` (standar siswa).
- Header entitas → pola siswa: `border-b-2 border-black`, H1 `text-lg`, avatar kotak `rounded-md border-2`, chip solid hitam "Wali Dari" + chip mono "NIS".
- Stat mini (Presensi / Rata-rata) di header → `rounded-md border-2 border-black` dengan label `text-[10px]` + nilai `text-xl`.
- Kartu chart (Donut + Bar) → `border-2 border-black`; judul `text-xs uppercase border-b-2 border-black`; legenda donut pakai pola siswa (kotak warna `h-3 w-3 rounded-sm border border-black` + "label: N hari").
- **QuickActions**: argumen `color` dihapus (dead prop sejak Sesi 46).
- Kartu statistik (Tagihan / Estimasi Peringkat) → `border-2`, ikon `p-2.5 border-2`.
- Tabel Nilai Akademik: thead `border-b-2 border-black text-xs uppercase`, tbody `divide-y-2 divide-black/10`, baris `hover:bg-neutral-100`, badge Indikator pakai `isTuntas` + `KONFIGURASI_PENILAIAN.kkm` (satu-pintu KKM).
- Panel kanan (Log Presensi, Informasi Institusi, Saluran Komunikasi) → `border-2`; badge status hadir solid hitam; tombol "Chat Wali"/"Lihat Arsip" solid hitam `border-2`.
- Import `ClipboardList` dihapus (tak terpakai).

#### 2. `src/fitur/orang-tua/ProfileOrangTuaPage.tsx` (1037 baris)
- Container korporat → neubrutalism; floating alert `rounded-2xl+shadow` → `rounded-md border-2` (sukses `border-emerald-600`, error `border-rose-600`) + tombol tutup `aria-label`.
- **Hero banner**: gradient `from-slate-700 to-slate-800` + overlay slate dihapus → overlay `bg-black/70`, frame `rounded-md border-2 border-black`; avatar `rounded-full border-4 border-black` (bukan border-white); H1 `text-lg`.
- Chip profil (Wali Dari / NIS) → pola siswa; tombol "Ganti Foto Profil" → `border-2` + `hover:border-blue-600 hover:bg-neutral-100`.
- Stat cards → `border-2` + `hover:bg-neutral-100`; ikon kotak `border-2`.
- **Profil Siswa** (detail list): item `hover:border-black hover:bg-neutral-100` dengan base `border-2 border-transparent` (tidak bergeser layout); label `text-[10px] uppercase`, nilai `text-xs`.
- **Wali Kelas Info Card** → `rounded-md border-2 border-black bg-neutral-50`; tombol Chat Wali solid hitam.
- **Form** (Nama, Email, WA, Ortu, KTP, Alamat): input/textarea mengikuti pola `AturRosterGuru` — `rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black placeholder:text-black/40 hover:border-blue-600 focus:border-blue-600`; error `border-rose-600`; label `text-[10px] uppercase`; footer aksi `border-t-2 border-black/10`, tombol Simpan solid hitam / Batalkan outline.
- Upload foto ortu → `border-4 border-black` lingkaran + label upload border-2.
- Tabel Nilai Akademik + Log Presensi + Informasi Institusi → pola neubrutalism sama dengan DasborOrangTua; badge Indikator kini `isTuntas` (sebelumnya hardcode `>= 75`).
- Empty state (siswa tidak ditemukan) → `rounded-md border-2 border-dashed border-black`.

#### 3. `src/components/ui/QuickActions.tsx` — bersihkan dead prop
- Interface `QuickAction.color?: string` **dihapus** — tidak ada pemanggil yang mengirimnya lagi (DasborGuru & DasborOrangTua sudah bersih; grep verifikasi 0 pemakaian).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/orang-tua/DasborOrangTua.tsx` | korporat → neubrutalism penuh; hapus `color` di QuickActions; badge KKM satu-pintu; hapus import tak terpakai |
| `src/fitur/orang-tua/ProfileOrangTuaPage.tsx` | korporat → neubrutalism penuh; banner/avatar/form/tabel neubrutalism; badge `isTuntas` |
| `src/components/ui/QuickActions.tsx` | hapus dead prop `color` dari interface |

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `eslint` (2 file ortu + QuickActions): ✅ 0 output
- `vitest` full: ✅ **175 passed** (13 files)
- grep verifikasi: 0 pemanggil QuickActions dengan `color`; tidak ada `slate`/`rounded-xl`/`rounded-2xl`/`shadow` tersisa di 2 file ortu (avatar tetap `rounded-full` untuk lingkaran)
- Code review: tidak ada masalah memblokir; catatan minor pre-existing (tombol "Ekspor PDF" tanpa onClick, label form tanpa `htmlFor`)

### ⏳ Catatan lanjutan
- Lanjut **Admin** — `PanelAdminModal.tsx` + tab di `src/fitur/admin/components/` + panel AdminPerpustakaan (sebagian sudah neubrutalism, sebagian masih korporat/slate).
- Opsional: hubungkan tombol "Ekspor PDF" ortu ke `exportRekapNilaiPdf`/`exportToCsv` di `src/utils/export.ts`.

---

## 🗓️ Sesi 48 — Seragamkan Halaman Admin ke Neubrutalism Standar Siswa — TUNTAS

> Sesuai kesepakatan user di sesi ini: **validasi terminal hanya dijalankan SEKALI di akhir** setelah semua role (guru ✅ Sesi 46, ortu ✅ Sesi 47, admin) selesai dimodif — tidak lagi cek tsc/eslint/vitest di tengah pengerjaan (lebih cepat).

### ✅ Yang sudah selesai

Seluruh area **Admin** (~23 file, ±6.800 baris) dikonversi dari korporat/slate/campuran menjadi neubrutalism penuh standar siswa.

#### 1. Pendekatan (penting)
- Komponen UI bersama `Card`/`Button`/`Badge`/`Input` **TIDAK diubah global** — karena masih dipakai halaman tamu & login (yang sengaja dibiarkan korporat).
- Pola Sesi 46 dipertahankan: file admin yang memakainya ditulis ulang memakai **markup inline neubrutalism**.

#### 2. File ditulis ulang penuh (dulu korporat / pakai Card/Button/Badge/Input)
| File | Perubahan |
|------|-----------|
| `components/TabTambahSiswa.tsx` | `rounded-xl border-gray-100` + `rounded-lg border-gray-200` → `border-2 border-black`; input/select pola AturRosterGuru; tombol Daftarkan solid hitam |
| `components/TabRiwayatLogin.tsx` | **hapus `Card`/`Badge`** → inline; stat card `border-2`; badge role berwarna border (blue/emerald/amber/rose); bar chart hari ini `bg-blue-600`; thead/tbody pola standar; **fix lint pre-existing `no-empty-pattern`** (line 26) |
| `components/TabAkunGuru.tsx` | **hapus `Card`/`Button`/`Input`/`Badge`** → inline; daftar guru aktif `border-blue-600`; input `border-2`; checkbox `accent-black`; konfirmasi popup border-2 tanpa shadow; tombol Simpan solid hitam |
| `components/TabAkunSiswa.tsx` | **hapus `Card`/`Button`** → inline; STATUS_COLOR border-2 berwarna; tabel `border-2`/`divide-y-2`; tombol aksi Simpan solid / Mutasi biru / Log outline / Hapus rose; modal status neubrutalism; hapus kolom No yang salah colSpan (8 header vs 7 sel → 7/7); dead `totalItems` dihapus; `statusNote` `text-[9px]`→`text-[10px]` |
| `AdminPerpustakaan/BookAutocomplete.tsx` | `border-gray-300`/`shadow-xl`/`rounded-lg` → `border-2`; dropdown sticky header; badge stok berwarna border; tombol TAMBAH solid hitam |
| `AdminPerpustakaan/MemberAutocomplete.tsx` | sama; label `text-[10px] uppercase`; avatar `rounded-md border-2`; chip "Anggota terpilih" `border-emerald-600` |
| `AdminPerpustakaan/PerpusDetailBuku.tsx` | `shadow-sm`/`gray-800`/`bg-orange-300` → `border-2`; header `border-b-2`; detail list `border-b-2 border-black/10`; tombol kembali solid hitam; link ebook border biru |
| `AdminPerpustakaan/PendingLoansTable.tsx` | `border-l-4 border-amber-500`/`bg-amber-50` → `border-2 border-amber-600`; thead/tbody pola standar; tombol SETUJUI solid hitam / TOLAK rose |
| `AdminPerpustakaan/SelectedBooksTable.tsx` | `bg-[#dff0d8]`/`border-gray-200` → thead `border-b-2`; tombol hapus rose; tfoot `border-t-2 bg-neutral-50` |

#### 3. File dikonversi pola massal (`border`→`border-2`, hapus `shadow`, `bg-gray-100`→`bg-neutral-100`, `text-[11px]`→`text-xs`)
| File | Catatan |
|------|---------|
| `PanelAdminModal.tsx` | aside `border-r-2`; KPI `text-[11px]`→`text-[10px]`; toast shadow dihapus; tombol Tutup border-2 |
| `components/TabKelolaKelas.tsx` | popup konfirmasi (tambah/hapus/pindah/simpan) `border-2` tanpa `shadow-lg`; tabel thead `border-b-2` tbody `divide-y-2`; input `placeholder:text-black/40` |
| `components/TabKelolaRoster.tsx` | form grid select/input `border-2`; tabel `border-r-2 border-black/10`; popup `shadow-md` dihapus |
| `components/TabAkunOrangTua.tsx` | h2 `text-sm`→`text-xs uppercase`; sub `text-neutral-900`→`text-black/60`; disabled `bg-neutral-100 text-black/50`; tbody `divide-y-2` |
| `components/TabTambahGuru.tsx` | input `border-2` + placeholder hitam; list kelas `divide-y-2`; counter chip `border-2`; popup `shadow-md` dihapus |
| `components/TabPengumumanAdmin.tsx` | input/textarea/select/file `border-2`; artikel riwayat `hover:bg-neutral-100` (hilangkan `hover:shadow-sm`); target chip `border-2`; popup `shadow-md` dihapus |
| `components/TabTagihanSekolah.tsx` | input `border-2`; info ringkas `text-xs`; chip nominal `border-2 bg-neutral-100`; popup `shadow-md` dihapus |
| `AdminPerpustakaan/PerpusDashboard.tsx` | stat card & tabel `border-2` tanpa `shadow-sm`; thead `border-b-2` tbody `divide-y-2`; `border-r-2 border-black/10`; status badge border-2 |
| `AdminPerpustakaan/PerpusInventori.tsx` | modal `rounded-xl shadow-2xl`→`rounded-md border-2`; semua input/select/upload `border-2`; tabel `border-r-2`; `text-[9px]`→`text-[10px]`; tombol Entry solid hitam |
| `AdminPerpustakaan/FormPeminjaman.tsx` | card `border-2`; label `text-xs uppercase`; input tanggal/textarea `border-2`; ID auto `bg-neutral-100` |
| `AdminPerpustakaan/FormPengembalian.tsx` | dropdown member `border-2` tanpa `shadow-xl`; thead `border-b-2` tbody `divide-y-2`; `border-r-2 border-black/10`; tombol KEMBALIKAN solid hitam; `hover:bg-blue-50`→`hover:bg-neutral-100` |
| `AdminPerpustakaan/DendaSettings.tsx` | panel `border-2` tanpa `shadow-xl`; input `border-2`; tombol Simpan solid hitam |
| `AdminPerpustakaan/ReturnReceipt.tsx` | tombol `bg-[#3c8dbc]`→ solid hitam border-2 |
| `AdminPerpustakaan/master/` (5 file) | container `border-2` tanpa `shadow-sm`; h2 `text-xs uppercase`; thead `border-b-2`; `hover:bg-blue-50`→`hover:bg-neutral-100`; tombol Tambah solid hitam; badge status berwarna |

### 📁 Files berubah (23)
`PanelAdminModal.tsx` + `components/` (TabTambahSiswa, TabRiwayatLogin, TabAkunGuru, TabAkunSiswa, TabKelolaKelas, TabKelolaRoster, TabAkunOrangTua, TabTambahGuru, TabPengumumanAdmin, TabTagihanSekolah) + `AdminPerpustakaan/` (BookAutocomplete, MemberAutocomplete, PerpusDetailBuku, PendingLoansTable, SelectedBooksTable, ReturnReceipt, PerpusDashboard, PerpusInventori, FormPeminjaman, FormPengembalian, DendaSettings) + `master/` (Anggota, Buku, Kategori, Penerbit, Rak).

### 🔍 Status (validasi SEKALI di akhir sesuai permintaan user)
- `tsc --noEmit`: ✅ 0 error
- `eslint` (admin + ortu + guru + ui): ✅ 0 error (3 warning react-refresh **pre-existing** di LazyLoad/Pagination/Toast)
- `vitest` full: ✅ **175 passed** (13 files)
- grep verifikasi: 0 `slate`/`bg-gray`/`shadow-*`/`rounded-xl`/`rounded-2xl`/`bg-gradient`/`hover:bg-blue-50` tersisa di seluruh `src/fitur/admin`
- Code review: tidak ada masalah memblokir; minor pre-existing (alert/confirm/prompt di beberapa file AdminPerpustakaan, h3 PerpusDashboard `text-sm`)

### ⏳ Catatan lanjutan
- **Guru ✅ + Orang Tua ✅ + Admin ✅** — penyeragaman neubrutalism ke semua role (kecuali tamu) TUNTAS.
- Opsional (minor, pre-existing): ganti `alert()`/`confirm()`/`prompt()` di AdminPerpustakaan ke `useToast` (konvensi Sesi 16), seragamkan h3 PerpusDashboard ke `text-xs`, bersihkan dead prop `setNotice` di beberapa tab.

---

## 🗓️ Sesi 49 — Bersihkan alert()/confirm()/prompt() di AdminPerpustakaan ke useToast — TUNTAS

### ✅ Yang sudah selesai

Sesuai catatan lanjutan Sesi 48: semua dialog browser `alert()`/`confirm()`/`prompt()` di folder AdminPerpustakaan diganti `useToast` + `ConfirmModal` (konvensi Sesi 16 — no native dialog di production).

#### 1. `src/fitur/bersama/ConfirmModal.tsx` — disamakan ke neubrutalism (komponen bersama)
- Overlay + panel `rounded-md border-2 border-black bg-white`; header ikon kotak `border-2` (danger `border-rose-600 text-rose-600`, default `border-blue-600 text-blue-600`).
- Tombol: Batal outline `border-2 border-black hover:bg-neutral-100`; Konfirmasi danger `border-2 border-rose-600 bg-white text-rose-600 hover:bg-rose-50`, default solid hitam.
- **Aksesibilitas (fix review):** `role="dialog"` + `aria-modal="true"` + `aria-labelledby="confirm-modal-title"`.
- Escape menutup (`onCancel`), klik overlay menutup.

#### 2. `DendaSettings.tsx` — `alert()` → `useToast`
- Simpan tarif denda → `showToast('success', '✅ Tarif denda diperbarui: Rp ... per hari.')`.

#### 3. `PerpusInventori.tsx` — `confirm()` → `ConfirmModal`, `alert()` → `useToast`
- Hapus buku → state `deleteTarget` + `<ConfirmModal>`; berhasil/tidak → toast sukses/error.

#### 4. `FormPeminjaman.tsx` — `alert()` → `useToast`, `prompt()` → modal input alasan
- Semua alert validasi/sukses/gagal → toast (stok habis, pilih anggota, pilih buku, berhasil diajukan, tolak permohonan).
- `prompt('Alasan penolakan...')` diganti **modal input alasan** (state + textarea) yang tetap neubrutalism — hasil input tetap diteruskan ke handler yang sama.

#### 5. `FormPengembalian.tsx` — 4 `alert()` → `useToast`
- Berhasil + denda → toast sukses berisi rincian `Rp ... (N hari x Rp ...)`; berhasil tepat waktu → toast sukses; gagal → toast error (`res.message || fallback`).
- Simpan tarif denda → toast sukses. Logika `setStruk` tetap dijalankan sebelum toast.

#### 6. `master/*.tsx` (5 file) — `confirm()` → `ConfirmModal`
- `MasterAnggota`, `MasterBuku`, `MasterKategori`, `MasterPenerbit`, `MasterRak`: `handleDelete` kini `setDeleteTarget(id)`; `<ConfirmModal open={deleteTarget !== null} message="Yakin hapus ...?" onConfirm={...filter...} onCancel={...}>`.
- `MasterRak` memakai key `kode` (bukan `id`) — filter `r.kode !== deleteTarget`.
- Import path relatif dari `master/`: `../../../bersama/ConfirmModal` ✅.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/bersama/ConfirmModal.tsx` | neubrutalism + `role="dialog"`/`aria-modal`/`aria-labelledby` |
| `DendaSettings.tsx` | `alert()` → toast |
| `PerpusInventori.tsx` | `confirm()` → ConfirmModal; `alert()` → toast |
| `FormPeminjaman.tsx` | `alert()`/`prompt()` → toast + modal input alasan |
| `FormPengembalian.tsx` | 4× `alert()` → toast |
| `master/*.tsx` (5 file) | `confirm()` → ConfirmModal + state `deleteTarget` |

### 🔍 Status
- grep `alert(`/`confirm(`/`prompt(` di seluruh `src/fitur/admin/AdminPerpustakaan`: ✅ **0 tersisa**
- `tsc --noEmit`: ✅ 0 error
- `eslint` (AdminPerpustakaan + ConfirmModal): ✅ 0 output
- `vitest` full: ✅ **175 passed** (13 files)
- Code review: tidak ada masalah memblokir; 2 saran diterapkan (aria pada ConfirmModal + tombol danger rose outline putih agar selaras keluarga neubrutalism)

### ⏳ Catatan lanjutan
- Sisa minor pre-existing dari Sesi 48: seragamkan h3 `PerpusDashboard` ke `text-xs`, bersihkan dead prop `setNotice` di beberapa tab admin.
- Konvensi Sesi 16 kini konsisten: **tidak ada native dialog browser di production** (semua via toast/modal).

---

## 🗓️ Sesi 50 — Bersihkan Sisa Minor: h3 PerpusDashboard + Dead Prop setNotice — TUNTAS

> Menindaklanjuti catatan lanjutan Sesi 48–49.

### ✅ Yang sudah selesai

#### 1. `PerpusDashboard.tsx` — h3 diseragamkan ke `text-xs`
- 2 judul h3 yang masih `text-sm` (`tracking-tight` / tanpa tracking) → `text-xs font-bold tracking-wider text-black uppercase` (standar judul section neubrutalism).

#### 2. Dead prop `setNotice` dibersihkan (4 tab + panel)
- **`TabAkunSiswa.tsx`** — `TabAkunSiswaProps` (berisi `setNotice?` yang tak pernah dipakai) dihapus total; komponen kini `TabAkunSiswa()` tanpa props.
- **`TabRiwayatLogin.tsx`** — `setNotice?` dihapus; interface kosong yang tersisa dihapus total (menghindari lint `no-empty-object-type`); komponen `TabRiwayatLogin()` tanpa props.
- **`TabPengumumanAdmin.tsx`** & **`TabTagihanSekolah.tsx`** — `setNotice` dihapus dari interface + destructuring (`scope` tetap dipertahankan).
- **`PanelAdminModal.tsx`** —
  - Pemanggilan 4 tab di atas dihapus argumen `setNotice={handleNotice}`.
  - Prop `setNotice?` di `AdminGuruPanelProps` (panel) juga dibersihkan — tidak ada pemanggil yang mengirimnya (LoginPage hanya kirim `open`/`onClose`/`scope`); `handleNotice` kini hanya `setLocalNotice(msg)`.
  - **6 tab yang benar-benar memakai `setNotice` dipertahankan**: `TabKelolaKelas`, `TabTambahGuru`, `TabTambahSiswa`, `TabAkunGuru`, `TabAkunOrangTua`, `TabKelolaRoster` (mereka menampilkan notifikasi via `handleNotice`).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `AdminPerpustakaan/PerpusDashboard.tsx` | 2 h3 `text-sm` → `text-xs` + `tracking-wider` |
| `components/TabAkunSiswa.tsx` | hapus interface props + `TabAkunSiswa()` tanpa props |
| `components/TabRiwayatLogin.tsx` | hapus `setNotice?` + interface kosong; `TabRiwayatLogin()` tanpa props |
| `components/TabPengumumanAdmin.tsx` | hapus `setNotice` (interface + destructuring) |
| `components/TabTagihanSekolah.tsx` | hapus `setNotice` (interface + destructuring) |
| `PanelAdminModal.tsx` | hapus `setNotice={handleNotice}` di 4 tab + prop `setNotice?` panel; `handleNotice` → `setLocalNotice` |

### 🔍 Status
- grep `setNotice`: ✅ hanya tersisa di 6 tab yang benar-benar memakainya (+ `handleNotice` panel)
- `tsc --noEmit`: ✅ 0 error
- `eslint` (6 file diubah): ✅ 0 output
- `vitest` full: ✅ **175 passed** (13 files)
- Code review: tidak ada masalah memblokir (catatan opsional prop `setNotice` panel — sudah dibersihkan juga di sesi ini)

### ⏳ Catatan lanjutan
- Semua catatan minor Sesi 48–49 kini TUNTAS: h3 PerpusDashboard ✅, dead prop setNotice ✅ (sebelumnya alert/confirm/prompt juga sudah ✅).
- Opsi berikut: modularisasi `core.ts` (rencana di perencanaan.md), review SIAKAD menyeluruh, atau apply migration backend (`npm run prisma:migrate` saat Postgres nyala).

---

## 🗓️ Sesi 51 — Modularisasi `core.ts` (2260 baris → folder `store/core/` + barrel) — TUNTAS

> Mengeksekusi **Rencana Modularisasi** (perencanaan.md, Sesi 43). `core.ts` (2260 baris, 158 export) dipecah menjadi 13 file domain + `core.ts` tetap sebagai **barrel** — 18 file yang import `../store/core` **tidak berubah sama sekali**.

### ✅ Yang sudah selesai

#### Struktur baru `src/data/store/core/`
| File | Isi | Baris |
|------|-----|-------|
| `db.ts` | TYPES + Database + CONSTANTS (kini export) + INTERFACES + GC + UTILS + DB HELPERS (`readDB`/`writeDB`/`readLocalKey`/`saveLocalKey`/audit helpers, kini export) + INIT (`migrateFutureTimestamps`, `initializeData`) | 518 |
| `seedData.ts` | `initialData` (export, dipakai `db.ts`) — **TIDAK masuk barrel** agar `initialData` tetap privat | 378 |
| `students.ts` | siswa CRUD + mutasi kelas/status + `setStudentStatus` + `generateStudentNis` | 97 |
| `ppdb.ts` | `createRegistrationNo` + PPDB + notifikasi + admin settings + guest config + audit/backup + admin security | 380 |
| `chat.ts` | grup, PM, presence, read state, typing indicator | 209 |
| `misc.ts` | announcements, class rosters, class announcements, messages, tasks, bills, grades, schedule, surat izin, pengumuman admin | 191 |
| `library.ts` | buku, transaksi, anggota | 118 |
| `assignments.ts` | tugas online, submissions, diskusi, quiz | 114 |
| `grades.ts` | rapot + RPS + lesson notes | 119 |
| `billing.ts` | tagihan sekolah + pengaturan tagihan | 81 |
| `attendance.ts` | absensi | 46 |
| `teachers.ts` | guru CRUD | 25 |
| `classes.ts` | kelas CRUD | 14 |

#### Teknik & poin penting
- **Pemecahan mekanis via `sed`** (baris dipindah utuh, bukan tulis ulang) → logika identik, risiko typo nol. Path import diperbaiki `../../types` → `../../../types` (folder `core/` satu level lebih dalam).
- **Konstanta & helper kini `export` di `db.ts`** (STORAGE_KEY, SURAT_KEY, TAGIHAN_KEY, PENGATURAN_TAGIHAN_KEY, PENGUMUMAN_ADMIN_KEY, SUBMISSION_KEY, QUIZ_RESULT_KEY, RAPOT_KEY, STUDENT_CLASS_MUTATION_KEY, STUDENT_STATUS_MUTATION_KEY, PPDB_AUDIT_KEY, PPDB_ADMIN_SESSION_KEY, PPDB_ADMIN_LOCK_KEY, ADMIN_MAX_ATTEMPTS, ADMIN_LOCK_MINUTES, ADMIN_SESSION_MINUTES, ADMIN_PIN, readDB/writeDB/readLocalKey/saveLocalKey/audit helpers) agar bisa diimpor modul lain.
- **Dependensi lintas modul**: `ppdb.ts` → `students.ts` (`addStudent`, `generateStudentNis`); `billing.ts` → `students.ts` (`getStudents`); `misc.ts` → `db.ts` (ClassRoster/SuratIzin/PengumumanAdmin) + types (ClassAnnouncement). Tidak ada circular dependency runtime (`seedData` hanya `import type { Database }`).
- **`core.ts` → barrel**: `export *` dari 12 modul (db, students, teachers, classes, attendance, assignments, library, ppdb, chat, grades, billing, misc). `seedData` sengaja tidak di-export (initialData tetap privat seperti asli).
- **Fix dari review**: `createAuditId` dikembalikan private (hanya dipakai internal db.ts).

### 🔍 Status
- Verifikasi **0 export asli hilang**: script node membandingkan 189 export `core.ts` lama vs semua nama export modul → `Hilang: []` ✅
- `tsc --noEmit`: ✅ 0 error
- `eslint` (store + services): ✅ 0 output
- `vitest` full: ✅ **175 passed** (13 files)
- `vite build`: ✅ sukses
- Code review: tidak ada masalah memblokir (catatan minor: API barrel bertambah konstanta/helper — disengaja per rencana)

### ⏳ Catatan lanjutan
- File panjang lain (prioritas lebih rendah, **belum dipecah**): `export.ts` (835), halaman monolitik (`AdminPanel.tsx`, `DiskusiTugas.tsx`, `ProfileOrangTuaPage.tsx`) — dipertahankan sesuai keputusan "modular tapi selektif".
- Opsi berikut: review SIAKAD menyeluruh, apply migration backend (`npm run prisma:migrate`), atau pecah `export.ts`.

---

## 🗓️ Sesi 52 — Modularisasi `export.ts` (948 baris → folder `utils/export/` + barrel) — TUNTAS

> Melanjutkan pola Sesi 51 ke file panjang berikutnya sesuai catatan lanjutan.

### ✅ Yang sudah selesai

#### Struktur baru `src/utils/export/`
| File | Isi | Baris |
|------|-----|-------|
| `helpers.ts` | `formatRupiah`/`formatDate`/`formatDateShort` (export) + `getTimestamp`/`downloadBlob` (private) + `exportToCsv` + `createPdfDoc` (export) | 145 |
| `rapot.ts` | `exportRapotPdf` + `exportRapotCsv` | 145 |
| `absensi.ts` | `exportAbsensiPdf` + `AbsensiExportRow`/`exportAbsensiCsv` + `AbsensiKelasRow`/`exportAbsensiPerKelasCsv` | 157 |
| `tagihan.ts` | `exportTagihanPdf` | 93 |
| `jurnal.ts` | `exportJurnalPdf` + `exportJurnalCsv` | 91 |
| `rekapNilai.ts` | `RekapNilaiRow` + `exportRekapNilaiPdf` + `exportRekapNilaiCsv` | 147 |
| `mutasi.ts` | `MutasiSiswaRow` + `exportMutationsCsv`/`exportMutationsPdf` + `SuratMutasiKeluarParams`/`exportSuratMutasiPdf` | 181 |

#### Teknik & poin penting
- **Pemecahan mekanis via `sed` dari working tree** (BUKAN git — `export.ts` sudah dimodifikasi Sesi 38–42: CSV absensi, ekspor mutasi, surat pindah/keluar). Baris dipindah utuh per sekat komentar `// ─── SECTION ───`.
- **`export.ts` → barrel** `export *` dari 7 modul → 9 importer (TabAkunSiswa, HalamanLaporan, InputRapotGuru, JurnalMengajarGuru, RekapNilaiGuru, RapotSiswa, RiwayatAbsensi, TagihanSekolah, export.test.ts) **tidak berubah sama sekali**.
- **Header import per modul minimal** — hanya import yang benar-benar dipakai; `AttendanceRecord` (type tak terpakai di file asli) hilang bersih bersama header lama (perbaikan, bukan regresi).
- **Helper lintas modul diexport** dari `helpers.ts`: `formatRupiah`, `formatDate`, `formatDateShort`, `createPdfDoc`; `getTimestamp`/`downloadBlob` tetap private (dipakai internal helpers.ts saja).
- **Dependensi**: rapot/rekapNilai → `../penilaian` (`isTuntas`, `KONFIGURASI_PENILAIAN`); mutasi → `helpers` + `dataSekolah` (`namaSekolahUppercase`/`namaSekolah`/`alamatLengkap`/`kota`). Tidak ada circular dependency.

### 🔍 Status
- Verifikasi **0 export asli hilang**: script node → `Export asli: 19 | Hilang: []` ✅
- `tsc --noEmit`: ✅ 0 error
- `eslint` (export.ts + folder export/): ✅ 0 output
- `vitest` `export.test.ts`: ✅ **13 passed**; full suite: ✅ **175 passed** (13 files)
- `vite build`: ✅ sukses
- Code review: tidak ada masalah memblokir (catatan minor: API barrel bertambah helper — disengaja, konsisten dengan Sesi 51)

### ⏳ Catatan lanjutan
- Tersisa file panjang: halaman monolitik (`AdminPanel.tsx`, `DiskusiTugas.tsx`, `ProfileOrangTuaPage.tsx`) — dipertahankan sesuai keputusan "modular tapi selektif" (ekstrak komponen presentasional nanti, risiko > manfaat saat ini).
- Opsi berikut: review SIAKAD menyeluruh, apply migration backend (`npm run prisma:migrate`), atau bikin Sesi 53 untuk halaman monolitik jika diperlukan.

---

## 🗓️ Sesi 53 — Review SIAKAD Menyeluruh (KKM, Jurnal, Rekap, Wali Kelas, Mutasi) — TUNTAS

> Lanjutan dari `AUDIT_SIAKAD_TIER1.md` (Tier 1 & 2 sudah tuntas Sesi 38–43). Audit ulang read-only 5 area untuk mencari gap yang tersisa setelah semua pekerjaan.

### ✅ Yang sudah selesai

#### 1. Audit 5 area SIAKAD
| Area | Status | Temuan |
|------|--------|--------|
| **KKM / standar nilai** | ⚠️ → ✅ | `penilaian.ts` sudah jadi satu pintu. Gap: **`DasborOrangTua.tsx` masih hardcode `>= 75` / `>= 60`** untuk warna bar chart (tidak sinkron dengan `KONFIGURASI_PENILAIAN`). |
| **Jurnal mengajar** | ✅ | `classIds` (kelas ajar) benar untuk jurnal; wiring + export lengkap. |
| **Rekap / ekspor** | ✅ | Wiring lengkap, 175 test. |
| **Wali kelas** | ⚠️ → ✅ | `DasborWaliKelas.tsx` menentukan kelas binaan dari **`teacher.classIds`** (semua kelas ajar) — padahal relasi homeroom yang benar adalah **`ClassRoom.teacherId`** (sudah ada di types & seed: `c1→t1`, `c2→t2`). |
| **Mutasi** | ✅ | Wiring lengkap (Sesi 41–42), log status + kelas + ekspor surat/CSV/PDF. |

#### 2. Fix 1 — `DasborOrangTua.tsx` (bar chart warna)
- Hardcode `g.nilaiAkhir >= 75 ? green : >= 60 ? amber : red` → pakai **`KONFIGURASI_PENILAIAN.kkm`** (75) dan **`KONFIGURASI_PENILAIAN.threshold.D`** (60). Perilaku sama, kini satu-pintu (`KONFIGURASI_PENILAIAN` sudah diimport).

#### 3. Fix 2 — `DasborWaliKelas.tsx` (kelas binaan)
- `getClasses().filter((c) => teacher?.classIds.includes(c.id))` → **`getClasses().filter((c) => c.teacherId === teacher?.id)`** — dashboard kini menampilkan **kelas binaan sebenarnya** (relasi homeroom), bukan semua kelas ajar.
- Pesan empty state disesuaikan: "Anda belum ditetapkan sebagai wali kelas. Hubungi admin untuk menetapkan kelas binaan pada akun Anda."

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/orang-tua/DasborOrangTua.tsx` | warna bar chart → `KONFIGURASI_PENILAIAN.kkm` + `threshold.D` |
| `src/fitur/guru/DasborWaliKelas.tsx` | kelas binaan filter `ClassRoom.teacherId === teacher.id` + pesan empty state |

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `eslint` (2 file diubah): ✅ 0 output
- `vitest` full: ✅ **175 passed** (13 files)
- Code review: tidak ada masalah memblokir

### ⏳ Catatan lanjutan (opsional, bukan bug)
- **Daftar perbaikan lengkap dicatat di `perencanaan.md`** — section **"Review SIAKAD Menyeluruh (Sesi 53)"** (item 1–2 selesai, item 3–6 menunggu) sebagai acuan agar tidak salah arah.
- Item 3–6 yang menunggu: **3)** UI penetapan wali kelas di `TabAkunGuru` (admin tidak bisa mengubah `ClassRoom.teacherId`; backend sudah siap — `ClassRoom.teacherId` + `ClassRoomTeacher.isHomeroom`; `DasborOrangTua` sudah membaca `teacherId`), **4)** `homeroomClassIds` dari `loginTeacher` belum dikonsumsi frontend, **5)** badge % kehadiran hardcode 80/60 (kosmetik), **6)** export PDF kalender akademik masih placeholder (Sesi 44).

---

## 🗓️ Sesi 54 — Eksekusi Item 3–6 Review SIAKAD (Wali Kelas, Homeroom, Badge %, PDF Kalender) — TUNTAS

> Eksekusi seluruh item lanjutan dari section **"Review SIAKAD Menyeluruh (Sesi 53)"** di `perencanaan.md` — tanpa konfirmasi, bertahap sampai tuntas.

### ✅ Item 3 — UI penetapan wali kelas (TUNTAS)
- **Decouple kelas ajar vs wali kelas**: `applyExclusiveClassAssignment` kini **hanya mengelola `classIds`** (kelas ajar) — `ClassRoom.teacherId` (wali kelas) tidak lagi diubah otomatis saat checkbox kelas disimpan. Assertions `utils.test.ts` disesuaikan (teacherId dipertahankan). `TabTambahGuru` aman (nextClasses = allClasses).
- **Store**: `setClassTeacherId(classId, teacherId)` baru di `src/data/store/core/classes.ts` + re-export `classService.ts` / `services/index.ts`.
- **UI `TabAkunGuru.tsx`**: state `homeroomMap` (sync dari `classes` via `useEffect`), section baru **"Penetapan Wali Kelas"** — dropdown per kelas (opsi semua guru, default "— Tidak ada wali —"); saat **Simpan Perubahan Guru**, `setClassTeacherId` diterapkan hanya untuk kelas yang berubah → dasbor wali kelas & panel ortu ikut ter-update otomatis.

### ✅ Item 4 — Wiring `homeroomClassIds` (TUNTAS)
- `Teacher` type + `homeroomClassIds?: string[]`; `BackendAuthUser` + `classIds?: string[]` + `homeroomClassIds?: string[]` (padanan response `loginTeacher` Sesi 43).
- `AuthContext`: saat login guru via backend berhasil, `homeroomClassIds` disinkronkan ke store lokal via `setClassTeacherId` → dasbor wali kelas konsisten dengan backend.

### ✅ Item 5 — Standarisasi badge % kehadiran (TUNTAS)
- Util baru `src/utils/kehadiran.ts`: `BATAS_KEHADIRAN_BAIK` (80), `BATAS_KEHADIRAN_CUKUP` (60), `tingkatKehadiran()`, `kehadiranBadgeClass()`.
- Terapkan di `DasborWaliKelas.tsx` & `HalamanLaporan.tsx` (3 tempat) — hardcode `>= 80`/`>= 60` dihapus.
- Test baru `src/utils/kehadiran.test.ts` (4 test).

### ✅ Item 6 — Export PDF kalender akademik (TUNTAS)
- `src/utils/export/kalender.ts` (baru): `exportKalenderAkademikPdf({ tahunAjaran, ganjil, genap })` — PDF tabel agenda per semester (NO / Tanggal / Waktu / Kegiatan / Jenis / Lokasi) pakai `createPdfDoc` (footer + redraw header per halaman, pola `exportJurnalPdf`). Filename `Kalender_Akademik_<TA>.pdf`. Barrel `export.ts` +`./export/kalender`.
- `DasborKalenderAkademik.tsx`: tombol **PDF** kini memanggil fungsi nyata + toast sukses (placeholder "sedang disiapkan" dihapus).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/data/store/core/classes.ts` | +`setClassTeacherId` |
| `src/data/services/classService.ts`, `index.ts` | re-export `setClassTeacherId` |
| `src/fitur/admin/components/utils.ts` | decouple — hanya kelola `classIds`, `teacherId` dipertahankan |
| `src/fitur/admin/components/utils.test.ts` | assertions disesuaikan (2 test) |
| `src/fitur/admin/components/TabAkunGuru.tsx` | +section dropdown "Penetapan Wali Kelas", terapkan saat save |
| `src/types.ts` | `Teacher` +`homeroomClassIds?` |
| `src/services/authApi.ts` | `BackendAuthUser` +`classIds`/`homeroomClassIds` |
| `src/context/AuthContext.tsx` | sync homeroom backend → store saat login guru |
| `src/utils/kehadiran.ts` + `.test.ts` | **BARU** — ambang badge % kehadiran satu pintu |
| `src/fitur/guru/DasborWaliKelas.tsx`, `HalamanLaporan.tsx` | badge % pakai `kehadiranBadgeClass` |
| `src/utils/export/kalender.ts` | **BARU** — `exportKalenderAkademikPdf` |
| `src/utils/export.ts` | barrel +`./export/kalender` |
| `src/fitur/halaman/components/KalenderAkademik/DasborKalenderAkademik.tsx` | tombol PDF → fungsi nyata |

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `eslint` (16 file diubah): ✅ 0 output
- `vitest` full: ✅ **179 passed** (14 files; sebelumnya 175; +4 kehadiran.test.ts)
- `vite build`: ✅ sukses
- Code review: tidak ada masalah memblokir (rename `exportKalenderAkademikPdf` untuk konsistensi pola `exportXxxPdf`)
- Catatan: 1 kegagalan **flaky** di `export.test.ts` (click-spy) pada run pertama — lulus saat run ulang; tidak terkait perubahan (file tidak disentuh)

### ⏳ Catatan lanjutan
- **Review SIAKAD 6/6 TUNTAS.** `homeroomClassIds` dari `loginTeacher` kini dikonsumsi frontend saat login backend.
- Migration Prisma `20260802090000_add_homeroom_predikat` masih perlu di-apply saat DB nyala (`npm run prisma:migrate` di `backend/`).

---

## 🗓️ Sesi 55 — Ekstrak Helper Tanggal Kalender ke Modul Bersama (`dateUtils.ts`) — TUNTAS

> Backlog dari `SESSION_HISTORY_2.md` Sesi 44 (catatan lanjutan): duplikasi `MONTH_MAP`/`parseDate`/`getAgendaDateInfo` antar file kalender.

### ✅ Yang sudah selesai

#### 1. `AgendaData/dateUtils.ts` (BARU — satu pintu)
- `parseAgendaDate(dateStr)` — parse tanggal tunggal Indonesia (perilaku asli dipertahankan, regex tak dianker — dipakai `getUpcomingAgenda`).
- `getAgendaDateInfo(item)` — parse rentang: sama bulan ("1–3 Juli 2026") + lintas bulan ("25 Juni 2026 – 2 Juli 2026") + fallback tunggal.
- `getAgendasForDate(date, items)`, `sortByStartDate(items)`, `filterBySemester(items, sem, tahun)`.
- **Generic struktural** `{ date: string }` (bukan import `AgendaItem`) → bebas siklus import.
- **Fix bug lintas-bulan (pre-existing)**: regex `same` diberi `(?<!\d)` negative lookbehind — sebelumnya "25 Juni 2026 – 2 Juli 2026" salah terbaca "26 – 2 Juli 2026" (start 26 Jul > end 2 Jul, rentang terbalik). Data saat ini hanya berisi rentang sama bulan, jadi bug laten — kini benar & ter-test.

#### 2. Konsumen yang memakai modul bersama
- `AgendaData/agenda.ts` — hapus `MONTH_MAP` + `parseDate` lokal → `parseAgendaDate` dari `./dateUtils` (import dirapikan ke atas file).
- `AgendaPage.tsx` — hapus 6 helper duplikat → import `filterBySemester`/`getAgendasForDate`/`sortByStartDate`.
- `DasborKalenderAkademik.tsx` — hapus 6 helper duplikat → import yang sama.
- `groupByType`/`isSameDay`/`toDateKey` tetap lokal (tak terduplikasi antar file).

#### 3. Test + bersih-bersih
- `AgendaData/dateUtils.test.ts` (BARU, **11 test**): parse tunggal, rentang sama/lintas bulan, filter per tanggal, sort, filter semester, perilaku substring `parseAgendaDate`.
- `agenda.ts.bak` (file backup yatim) dihapus.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `AgendaData/dateUtils.ts` | **BARU** — helper tanggal agenda satu pintu |
| `AgendaData/dateUtils.test.ts` | **BARU** — 11 test |
| `AgendaData/agenda.ts` | hapus duplikat, pakai `parseAgendaDate` |
| `AgendaPage.tsx` | hapus 6 helper, import dari `dateUtils` |
| `DasborKalenderAkademik.tsx` | hapus 6 helper, import dari `dateUtils` |
| `AgendaData/agenda.ts.bak` | dihapus (backup yatim) |

### 🔍 Status
- `tsc --noEmit`: ✅ 0 error
- `eslint` (5 file diubah): ✅ 0 output
- `vitest` full: ✅ **190 passed** (15 files; sebelumnya 179; +11 dateUtils)
- Code review: tidak ada masalah memblokir (2 nit dibereskan: import ke atas file, hapus `.bak`)

### ⏳ Catatan lanjutan
- AgendaPage (guest/public) masih memakai `alert('Fitur unduh kalender akademik PDF sedang disiapkan.')` di tombol PDF-nya — placeholder `alert()` tersisa (konvensi Sesi 16 no-alert). Kandidat: sambungkan ke `exportKalenderAkademikPdf` (Sesi 54) + toast, seperti yang sudah dilakukan di DasborKalenderAkademik.

---

## 🗓️ Sesi 56 — Nama Program Sinkron + Fitur Ebook di BeritaKegiatanSection — TUNTAS

> **⚠️ CARA KERJA USER (penting untuk sesi berikutnya):** User sangat menekankan alur kerja — **diskusi dulu → jabarkan plan/alur → user review → user bilang "oke" → baru eksekusi**. Jangan langsung mengeksekusi tanpa persetujuan plan. User tidak mau dikerjakan "membabi buta" lalu hasilnya tidak sesuai ekspektasi.

### ✅ Yang sudah selesai

#### 1. Nama program di `PendidikanSection.tsx` disinkronkan dengan `ProgramKeahlianPage`
- `id: 'mipa'` → title **"Program MIPA"** → **"Rekayasa Perangkat Lunak"** + desc dari `reg-01` (pemrograman/web-mobile/database).
- `id: 'ips'` → title **"Program IPS"** → **"Teknik Komputer dan Jaringan"** + desc dari `reg-02` (jaringan/keamanan/troubleshooting).
- Link ke route `reg-01`/`reg-02` tetap. Tampilan card lain (bahasa, ekstrakurikuler, olimpiade, alumni) tidak diubah.

#### 2. Fitur Ebook (bagian bawah BeritaKegiatanSection)
- **Heading "Berita & Kegiatan Lainnya" → "Ebook"** — isi/container grid card tetap (gambar, judul, deskripsi).
- Navigasi card sekarang `onNavigate?.(`ebook-${index + 1}`)` → route `ebook-1` s/d `ebook-8` (menggantikan `kegiatan-${targetId}` lama). `remainingItems` = item indeks 3 dst = **8 item** (data `activityItems` total 11, featured 1 + secondary 2).
- **Folder baru:** `src/fitur/halaman/components/Ebook/` berisi **`ebook_1.tsx` s/d `ebook_8.tsx`** — template sederhana meniru pola `SdgsDetail/Sdgs1.tsx`: `fixed inset-0 z-50 overflow-y-auto bg-slate-100`, header sticky biru (`bg-blue-800`) + tombol kembali (`useBackNavigation`), judul "Ebook N", deskripsi, dan **tombol Download** (membuat `<a download>` ke `${BASE_URL}ebook/ebook_N.pdf`).
- **Routing `ExpectationModal.tsx`:** lazy import `Ebook1Page`–`Ebook8Page` (`./components/Ebook/ebook_N`), route case `'ebook-1'`–`'ebook-8'` → `<EbookNPage />`.
- **Folder `public/ebook/`** dibuat sebagai tempat user menaruh file PDF (`ebook_1.pdf` s/d `ebook_8.pdf`).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/halaman/pages/DataBeranda/PendidikanSection.tsx` | title+desc MIPA→RPL, IPS→TKJ (sinkron reg-01/reg-02) |
| `src/fitur/halaman/pages/DataBeranda/BeritaKegiatanSection.tsx` | heading "Ebook", onClick card → `ebook-${index+1}` |
| `src/fitur/halaman/components/Ebook/ebook_1.tsx`–`ebook_8.tsx` | **BARU** — 8 template halaman detail ebook + tombol download |
| `src/fitur/halaman/ExpectationModal.tsx` | lazy import 8 ebook + route case `ebook-1`–`ebook-8` |
| `public/ebook/` | **BARU** — tempat file PDF ebook |

### 🔍 Status
- Belum dicek tsc/eslint penuh (mesin lambat). Kode mengikuti pola file yang ada.

---

## 🗓️ Sesi 57 — Restore Posisi Scroll Saat Kembali (ExpectationModal) — TUNTAS

### ✅ Yang sudah selesai

Masalah: setiap pindah halaman (terutama kembali dari halaman detail ebook) scroll selalu reset ke atas → user harus scroll ke bawah lagi untuk mencari posisi klik semula.

`src/fitur/halaman/ExpectationModal.tsx`:
- Tambah `scrollPositions = useRef<Record<string, number>>({})` — simpan posisi scroll per halaman.
- `saveScroll()` — simpan `contentRef.scrollTop` untuk `activeMenu` saat ini.
- `restoreScroll(page)` — pulihkan posisi halaman tujuan (`scrollPositions.current[page] ?? 0`) via `requestAnimationFrame`.
- `handleNavigate` — sebelum pindah: `saveScroll()`, lalu `resetScroll()` untuk halaman baru.
- `handleGoBack` — saat kembali: `restoreScroll(prev)` (bukan reset ke atas).

**Alur:** scroll ke bawah di Beranda → klik card ebook → halaman ebook tampil dari atas → klik kembali → **kembali ke posisi card tadi diklik**. Berlaku untuk semua halaman (nav menu + detail).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/halaman/ExpectationModal.tsx` | +`scrollPositions`, `saveScroll`, `restoreScroll`, wiring di `handleNavigate` & `handleGoBack` |

---

## 🗓️ Sesi 58 — Restore Posisi Scroll di Penerimaan Siswa Baru (PPDB) — TUNTAS

### ✅ Yang sudah selesai

Pola Sesi 57 diterapkan ke flow PPDB (`PpdbModal` + `LandingPage`).

#### 1. `src/fitur/autentikasi/DataLogingPage/PpdbModal.tsx`
- `scrollRef = useRef<HTMLDivElement>` dipasang di scroll container (`fixed inset-0 overflow-y-auto`).
- `scrollPositions` ref per view.
- `handleViewChange(next)` — simpan posisi view lama sebelum pindah, pulihkan posisi view tujuan setelah render (landing ↔ form ↔ cek-kelulusan).
- Prop `scrollRef` diteruskan ke `LandingPage`.

#### 2. `src/fitur/penerimaan-siswa-baru/LandingPage.tsx`
- Props +`scrollRef?: React.RefObject<HTMLDivElement | null>`.
- `scrollPositions` ref per tab; `saveScroll()`, `restoreScroll(tab)`, `resetScroll()`.
- `openSubPage(key)` — simpan posisi tab, set subpage, reset scroll ke atas.
- `goBack()` — kembali dari subpage → `restoreScroll(activeTab)`.
- `switchTab(tab)` — simpan tab lama, pindah, `restoreScroll(tab)` (tab baru pertama kali = atas).
- Semua handler `setSubPage`/`setActiveTab` diganti ke `openSubPage`/`switchTab` (header desktop+mobile, `PenerimaanSiswa`).

**Alur:** scroll ke bawah di landing PPDB → klik card ekskul/beasiswa/fasilitas/wisata/jurusan → halaman detail tampil dari atas → kembali → **posisi scroll di tempat klik pulih**.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/autentikasi/DataLogingPage/PpdbModal.tsx` | +`scrollRef`, `handleViewChange` (simpan/pulihkan per view) |
| `src/fitur/penerimaan-siswa-baru/LandingPage.tsx` | +`scrollRef` prop, `saveScroll`/`restoreScroll`/`resetScroll`, `openSubPage`, `goBack`, `switchTab` |

---

## 🗓️ Sesi 59 — Fix Halaman Wisata/Subpage Tampil di Posisi Bawah — TUNTAS

### ✅ Yang sudah selesai

Bug: masuk halaman subpage (mis. `Wisata/AksaraPark`) menampilkan **bagian paling bawah** halaman, bukan atas — karena scroll container mempertahankan `scrollTop` dari landing (yang berada di posisi bawah saat card diklik).

`src/fitur/penerimaan-siswa-baru/LandingPage.tsx`:
- `openSubPage()` **sebelumnya hanya `saveScroll()` + `setSubPage`** (tanpa reset) → sekarang + **`resetScroll()`** agar subpage selalu tampil dari atas.
- `restoreScroll` dibuat **parameterized** `(tab: TabId)` — perbaikan bug: sebelumnya membaca `activeTab` (closure lama = tab yang baru saja ditinggalkan), sehingga salah memulihkan posisi. Kini `goBack()` → `restoreScroll(activeTab)`, `switchTab(tab)` → `restoreScroll(tab)`.
- `resetScroll()` baru — set `scrollRef.scrollTop = 0` via rAF.

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/penerimaan-siswa-baru/LandingPage.tsx` | `openSubPage` +resetScroll; `restoreScroll(tab)` parameterized; +`resetScroll` |

### 🔍 Status
- Dikonfirmasi user: ✅ benar (masuk halaman detail tampil dari atas, kembali ke posisi klik).

---

## 🗓️ Sesi 60 — Halaman Pemantauan Orang Tua (Riwayat Absensi Anak + Status Surat Izin) — TUNTAS

> Tugas dari `dokumentasi/LiveDiskusi.txt` (versi pertama). Dibangun ADITIF mengikuti pola modul existing; `AuthContext`/fallback login lokal **tidak diubah**.

### ✅ Yang sudah selesai

#### 1. `src/fitur/orang-tua/RiwayatAbsensiAnak.tsx` (BARU)
- Halaman ortu: riwayat absensi anak (read-only).
- Pola: `studentId = user.id.replace('p_', '')`, `useStoreVersion()` agar reaktif, gaya neubrutalism hitam-putih `max-w-[1400px]`.
- Fitur: filter bulan, ringkasan via `DonutChart`/`BarChart`, tabel riwayat absensi.

#### 2. `src/fitur/orang-tua/StatusSuratIzinAnak.tsx` (BARU)
- Halaman ortu: status surat izin anak (read-only, dari `getSuratIzinByStudent`).

#### 3. Wiring
- `App.tsx`: `PARENT_PAGES` + `'attendance-history'` & `'letters-status'`.
- `routes.ts`: `ORTU_RIWAYAT_ABSENSI` (`/ortu/riwayat-absensi`) & `ORTU_STATUS_SURAT_IZIN` (`/ortu/status-surat-izin`) + map di `PARENT_PAGE_ROUTES`.
- `Sidebar.tsx`: menu ortu "Riwayat Absensi" (`Calendar`) & "Status Surat Izin" (`FileText`).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/fitur/orang-tua/RiwayatAbsensiAnak.tsx` | **BARU** — riwayat absensi anak (filter bulan + chart) |
| `src/fitur/orang-tua/StatusSuratIzinAnak.tsx` | **BARU** — status surat izin anak |
| `src/App.tsx` | +`attendance-history`, +`letters-status` (parent) |
| `src/routes.ts` | +`ORTU_RIWAYAT_ABSENSI`, +`ORTU_STATUS_SURAT_IZIN` |
| `src/layout/Sidebar.tsx` | +2 item menu ortu |

### 🔍 Status
- Ter-commit di `0cbb37e update` (commit parent pages).

---

## 🗓️ Sesi 61 — Modul Bimbingan Konseling (BK) — TUNTAS

> Tugas dari `dokumentasi/LiveDiskusi.txt` (versi kedua): modul BK fungsional — catatan poin pelanggaran/prestasi yang diinput guru, dipantau read-only siswa & ortu. Bangun ADITIF (tidak mengubah `AuthContext`/service lama).

### ✅ Yang sudah selesai

#### 1. Tipe data (`src/types.ts`)
- `export interface CatatanBK { id; studentId; jenis: 'pelanggaran'|'prestasi'; kategori; deskripsi; poin: number; tanggal; dicatatOleh; createdAt }`.
- Konvensi: **pelanggaran NEGATIF, prestasi POSITIF**; `getTotalPoinBK` menjumlahkan langsung.

#### 2. Store `src/data/store/core/bk.ts` (BARU)
- Key `BK_KEY = 'siakad-bk-records'` di `db.ts` (terpisah dari `Database` utama).
- `getCatatanBK`, `getCatatanBKByStudent`, `addCatatanBK`, `deleteCatatanBK`, `getTotalPoinBK` — pola `readLocalKey` + `localStorage.setItem` + `notifyStoreUpdated()` (contoh `billing.ts`).
- Barrel `core.ts`: `export * from './core/bk'`.
- Seed `initialCatatanBK` (3 contoh) di `seedData.ts`, di-seed saat **fresh install** di `initializeData()` (db.ts).

#### 3. Service `src/data/services/bkService.ts` (BARU)
- Thin-wrapper re-export; didaftarkan di `services/index.ts` (fungsi + `export type { CatatanBK }`).

#### 4. Halaman
| Halaman | Path | Isi |
|---------|------|-----|
| Guru/Admin | `src/fitur/guru/BimbinganKonseling.tsx` | Form tambah catatan (siswa/jenis/poin/kategori/deskripsi/tanggal), rekap poin per siswa (`BarChart`), komposisi prestasi-pelanggaran (`DonutChart`), tabel daftar + hapus |
| Siswa | `src/fitur/murid/CatatanBKSiswa.tsx` | Read-only: total poin, statistik, riwayat kartu |
| Ortu | `src/fitur/orang-tua/CatatanBKAnak.tsx` | Read-only versi ortu |

#### 5. Wiring
- `App.tsx`: `'bk'` (teacher), `'bk-record'` (student & parent).
- `routes.ts`: `GURU_BK /guru/bk`, `SISWA_BK /siswa/catatan-bk`, `ORTU_BK /ortu/catatan-bk`.
- `Sidebar.tsx`: menu "Bimbingan Konseling"/"Catatan BK" (ikon `ShieldAlert`).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/types.ts` | +`CatatanBK` |
| `src/data/store/core/bk.ts` | **BARU** — store BK |
| `src/data/store/core/db.ts` | +`BK_KEY` + seed `initialCatatanBK` |
| `src/data/store/core/seedData.ts` | +`initialCatatanBK` |
| `src/data/store/core.ts` | barrel +`./core/bk` |
| `src/data/services/bkService.ts` | **BARU** — service BK |
| `src/data/services/index.ts` | +export BK + tipe |
| `src/fitur/guru/BimbinganKonseling.tsx` | **BARU** |
| `src/fitur/murid/CatatanBKSiswa.tsx` | **BARU** |
| `src/fitur/orang-tua/CatatanBKAnak.tsx` | **BARU** |
| `src/App.tsx`, `src/routes.ts`, `src/layout/Sidebar.tsx` | wiring BK |

### 🔍 Status
- `npm run typecheck` ✅ · `eslint` ✅ · `npm test` ✅ (190) · `npm run build` ✅
- Ter-commit di `3ccccb2 update` (HEAD).

---

## 🗓️ Sesi 62 — Modul Ekstrakurikuler (Ekskul) — TUNTAS

> Tugas dari `dokumentasi/LiveDiskusi.txt` (versi ketiga): master ekskul, pendaftaran siswa, absensi pertemuan. Dibangun ADITIF mengikuti pola modul BK (Sesi 61). **Belum di-commit** — menunggu user commit.

### ✅ Yang sudah selesai

#### 1. Tipe data (`src/types.ts`)
- `Ekskul { id; nama; kategori; pembina; hari; jam; lokasi?; kuota?; deskripsi?; createdAt }`
- `EkskulMember { id; ekskulId; studentId; joinedAt; status: 'aktif'|'keluar' }`
- `EkskulKehadiran { id; ekskulId; studentId; tanggal; status: 'hadir'|'izin'|'alpha'; catatan?; createdAt }`

#### 2. Store `src/data/store/core/ekskul.ts` (BARU)
- Key di `db.ts`: `EKSKUL_KEY = 'siakad-ekskul'`, `EKSKUL_MEMBER_KEY = 'siakad-ekskul-member'`, `EKSKUL_HADIR_KEY = 'siakad-ekskul-hadir'`.
- CRUD: `getEkskul`, `addEkskul`, `updateEkskul`, `deleteEkskul` (delete ikut menghapus anggota & kehadiran terkait).
- Keanggotaan: `getEkskulMembers`, `getEkskulMembersByEkskul`, `getAktifMemberCount`, `getEkskulByStudent`, `getEkskulTersedia`, `daftarEkskul` (**menghormati kuota**; re-aktifkan bila status keluar), `keluarEkskul` (status → 'keluar').
- Kehadiran: `getEkskulKehadiran(ekskulId)`, `getEkskulKehadiranByStudent`, `addEkskulKehadiran` (**upsert** per ekskul/siswa/tanggal), `deleteEkskulKehadiran`.
- Barrel `core.ts`: `export * from './core/ekskul'`.
- Seed `initialEkskul` (3: Basket, Paduan Suara, Coding Club) + `initialEkskulMember` + `initialEkskulKehadiran` di `seedData.ts`, di-seed saat fresh install di `initializeData()`.

#### 3. Service `src/data/services/ekskulService.ts` (BARU)
- Thin-wrapper re-export; didaftarkan di `services/index.ts` (fungsi + `export type { Ekskul, EkskulMember, EkskulKehadiran }`).

#### 4. Halaman
| Halaman | Path | Isi |
|---------|------|-----|
| Guru/Admin | `src/fitur/admin/ManajemenEkskul.tsx` | Form CRUD ekskul (nama/kategori/pembina/hari/jam/lokasi/kuota/deskripsi), tabel daftar (Ubah/Hapus), panel kelola anggota (tambah via `getStudents()`, keluarkan), panel absensi pertemuan per tanggal (toggle Hadir/Izin/Alpha per anggota + Simpan), rekap anggota per ekskul (`BarChart`) |
| Siswa | `src/fitur/murid/EkskulSiswa.tsx` | Daftar ekskul diikuti (rekap H/I/A per ekskul + tombol Keluar), ekskul tersedia (tombol Daftar, disabled saat kuota penuh), riwayat kehadiran |

#### 5. Wiring
- `App.tsx`: `'ekskul-management'` (teacher **dan** admin), `'ekskul'` (student).
- `routes.ts`: `GURU_EKSKUL /guru/ekskul`, `ADMIN_EKSKUL /admin/ekskul`, `SISWA_EKSKUL /siswa/ekskul` + map di `TEACHER_PAGE_ROUTES`/`ADMIN_PAGE_ROUTES`/`STUDENT_PAGE_ROUTES`.
- `Sidebar.tsx`: menu guru "Kelola Ekskul" & siswa "Ekstrakurikuler" (ikon `Trophy`).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `src/types.ts` | +`Ekskul`, +`EkskulMember`, +`EkskulKehadiran` |
| `src/data/store/core/ekskul.ts` | **BARU** — store ekskul |
| `src/data/store/core/db.ts` | +3 key ekskul + seed |
| `src/data/store/core/seedData.ts` | +`initialEkskul`, +`initialEkskulMember`, +`initialEkskulKehadiran` |
| `src/data/store/core.ts` | barrel +`./core/ekskul` |
| `src/data/services/ekskulService.ts` | **BARU** — service ekskul |
| `src/data/services/index.ts` | +export ekskul + tipe |
| `src/fitur/admin/ManajemenEkskul.tsx` | **BARU** — kelola ekskul/anggota/absensi |
| `src/fitur/murid/EkskulSiswa.tsx` | **BARU** — daftar & pantau ekskul |
| `src/App.tsx`, `src/routes.ts`, `src/layout/Sidebar.tsx` | wiring ekskul |

### 🔍 Status
- `npm run typecheck` ✅ · `eslint` (file diubah) ✅ · `npm test` ✅ (**190 passed**, 15 files) · `npm run build` ✅ (chunk baru `ManajemenEkskul-*.js`, `EkskulSiswa-*.js`).
- **BELUM di-commit** — perubahan BK (HEAD `3ccccb2`) + Ekskul siap di-commit oleh user. `git status` menunjukkan: 9 file modifikasi (App.tsx, routes.ts, Sidebar.tsx, types.ts, db.ts, seedData.ts, core.ts, services/index.ts, LiveDiskusi.txt) + 4 file baru (ekskul.ts, ekskulService.ts, ManajemenEkskul.tsx, EkskulSiswa.tsx).

---

## 🗓️ Sesi 63 — Hero Animasi 3 Tema ala Template Blogger + Kelompokkan Gambar per Warna — TUNTAS

> Diskusi lanjutan dari hero landing `DataBeranda`. Referensi template: `dokumentasi/templet/kode.txt` (HTML 3 tema), `styles.min.css` (posisi & animasi), `main.min.js` (rotasi). **Belum di-commit** — menunggu user commit.

### ✅ Yang sudah selesai

#### 1. Perbaikan nama file `public/images/IconPlus/` (39 PNG)
- File yang ter-download **tanpa ekstensi** (tampil blank putih) dicek signature byte-nya → semuanya PNG asli, lalu ditambah `.png` (10 file: `w96`, `w192`, `w192er`, `w384`, `w3847`, `w3848`, `w384a`, `w384qww`, `w768s`, `w1024`).
- 4 nama bentrok dengan `.png` yang sudah ada (konten berbeda) diberi akhiran `-2` agar tidak menimpa: `w96-2.png`, `w192-2.png`, `w384-2.png`, `w1024-2.png`.

#### 2. Struktur hero dibuat semirip template Blogger
- **`HeroSection.tsx`** — `img()` diarahkan ke `images/IconPlus/<subfolder>/<file>`. Array `THEMES` 3 tema (green/blue/red) berisi `layers` (dekoratif) + `main` (gambar utama besar). Render: tiap layer `className="theme--layer <kelas>"`, gambar utama `className="theme--layer blog"`.
- **`global.css`** — di-port dari `styles.min.css`:
  - Latar tema: green `#388d80`, blue `#4583aa`, red `#bc382e`.
  - Layer naik `translateY(100vh)` → `translate3d(0,0,0)`, durasi `1.4s cubic-bezier(.645,.045,.355,1)`, delay bertingkat `nth-child(1..15)` 0.25s → 0.95s (tiap +0.05s).
  - Fade tema: `0.8s opacity` + delay `1.2s` saat `.active`.
  - Posisi layer kelas template per breakpoint 37.5rem / 60rem / 75rem (vase, tea, slipper, picture, letter-*, football, blog — green; drone, phone1, temperature, remote, smartwatch, actioncam — blue; spoon, mixer, eggs, cherries, rollover, shape, pie — red).
  - Gambar utama besar `blog`: `left:24%; width:55%` di desktop (≥75rem), tersembunyi di HP (display:none) baru tampil ≥37.5rem — perilaku asli template.
  - Layer ekstra pakai posisi generik `deco-a` s.d. `deco-g` (tampil di semua layar).
- **Rotasi seperti `main.min.js`**: 7000ms per siklus → ~2333ms per tema; setelah satu putaran penuh jeda 10000ms, lalu berulang.

#### 3. Kelompokkan gambar per warna (oleh user)
- User membuat folder `biru/`, `hijau/`, `merah/` berisi gambar sesuai background masing-masing, dan menamai gambar tengahnya **`Utama.png`**.
- `THEMES` diisi: blue ← `biru/` (8 dekoratif + Utama), green ← `hijau/` (10 dekoratif + Utama), red ← `merah/` (14 dekoratif + Utama).

### 📁 Files berubah
| File | Perubahan |
|------|-----------|
| `public/images/IconPlus/*` | +`.png` (10), `-2` (4) — semua valid PNG |
| `public/images/IconPlus/{biru,hijau,merah}/` | **BARU** — kelompok gambar per warna + `Utama.png` |
| `src/fitur/halaman/pages/DataBeranda/HeroSection.tsx` | `img()` → IconPlus; `THEMES` 3 tema `{layers, main}`; render `theme--layer <kelas>` + `blog`; rotasi 7s/3 + jeda 10s |
| `src/fitur/halaman/global.css` | latar 3 tema; posisi layer template + `blog`; `nth-child(1..15)`; `deco-a..g`; media 37.5/60/75rem |

### 🔍 Status
- `npm run typecheck`: ✅ 0 error
- `eslint` `HeroSection.tsx`: ✅ 0 output
- File gambar yang dirujuk semua sudah diverifikasi ada di folder masing-masing.

### 📌 Cara mengatur posisi gambar utama (Utama)
- Pilih filenya: `HeroSection.tsx` → `main: 'biru/Utama.png'` (biru), `'hijau/Utama.png'` (hijau), `'merah/Utama.png'` (merah).
- Atur posisinya: `global.css` → blok `.hero-animation .blog` (4 tempat): line `:149` (HP), `:277` (≥37.5rem), `:383` (≥60rem), `:410` (≥75rem). Ubah `left` (geser horizontal), `width` (ukuran), `bottom` (jarak dari bawah).
- Kelas layer dekoratif menentukan posisinya; ganti nama file di `THEMES.layers` sesukanya.

### ⏳ Catatan
- `Utama` (`blog`) & beberapa kelas (`drone`, `remote`, `vase`, `slipper`, `letter-b`, `eggs`, `cherries`, `rollover`, `actioncam`) **tersembunyi di HP** — perilaku asli template. Bila ingin tampil di HP, ubah `display:none` pada blok mobile-nya.
- File lama di root `IconPlus/` (`12345w768.png`, `w1024-2.png`, `w384awqdse.png`, `w768asw.png`) tidak dipakai lagi.

---

## 📝 Cara lanjut besok

1. Jalankan `npm run dev`
2. Buka chat AI
3. Kirim pesan: **"Lanjut dari SESSION_HISTORY_2.md"**
4. Saya akan baca file ini dan lanjut dari sini.
   Atau kasih instruksi spesifik:
   - **Commit modul Ekskul (Sesi 62)** — perubahan BK (HEAD `3ccccb2`) + Ekskul (working tree) siap di-commit
   - **Cek & susun gambar hero (Sesi 63)** — jalankan `npm run dev`, lihat 3 tema; ganti file di `THEMES` (`HeroSection.tsx`) & posisi `blog` (`global.css`) lalu commit
   - **Verifikasi manual Ekskul** — guru buat ekskul + catat kehadiran; siswa daftar ekskul & lihat riwayat
   - "Kerjakan/edit konten Ebook" — `src/fitur/halaman/components/Ebook/ebook_1.tsx`–`ebook_8.tsx` + PDF di `public/ebook/ebook_N.pdf`
   - "Kerjakan modularisasi core.ts" (rencana sudah ada di perencanaan.md — Rencana Modularisasi)
   - "Lanjut ke review SIAKAD" (KKM/standar nilai, jurnal mengajar, rekap/ekspor, wali kelas, mutasi)
   - "Apply migration backend & tes live" (nyalakan Postgres, jalankan `npm run prisma:migrate`)
   - "Dokumentasikan Sesi 35-37 ke README halaman"
   - "Perbaiki lint error pre-existing" (`TabRiwayatLogin.tsx:26`, react-refresh warnings)
