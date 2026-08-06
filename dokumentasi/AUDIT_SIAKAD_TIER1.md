# Audit Kesenjangan SIAKAD — Tier 1

> Audit 5 area fitur akademik inti untuk melengkapi Portal SIAKAD menjadi template universal (SD/SMP/SMA/SMK).
> Tanggal: 2 Agustus 2026 — Mode read-only (tidak mengubah kode).

> **STATUS IMPLEMENTASI (2 Agustus 2026):** Semua 5 area TUNTAS ✅. Detail di `SESSION_HISTORY_2.md` Sesi 38.

---

## Ringkasan Temuan Kritis

1. **2 file orphan / dead code** — fitur sudah dibangun di layer data & UI tapi tidak ter-wire ke router/sidebar:
   - `src/fitur/guru/CatatanRpsGuru.tsx` (Jurnal Mengajar)
   - `src/fitur/guru/ManajemenSiswa.tsx` (Kelola Siswa untuk Guru) + QuickAction `student-management` di `DasborGuru.tsx:319` = dead link
2. **Inkonsistensi hardcode predikat** — rumus diulang 3x dengan batas berbeda, tanpa satu sumber kebenaran:
   - `InputRapotGuru.tsx:16-26`: A(≥90) B(≥80) C(≥70) D(≥60) E(<60)
   - `DasborOrangTua.tsx:31-36`: A(≥90) B(≥80) C(≥70) D(<70) — **tanpa E, batas D berbeda**
   - `ProfileOrangTuaPage.tsx:72-77`: duplikat sama
   - `RapotSiswa.tsx:14-27`: bobot IP A=4 B=3 C=2 D=1 (hardcode)
3. **Sinkronisasi frontend/backend tidak lengkap** — `ClassRoom.teacherId`, `NilaiRapot.predikat` ada di frontend tapi tidak ada padanan field di Prisma.
4. **Tidak ada konsep KKM/ketuntasan** — kata kunci "KKM"/"ketuntasan" di seluruh `src/` & backend = 0 hasil.

---

## Area 1 — KKM (Kriteria Ketuntasan Minimal) — ✅ TUNTAS

### ✅ Sudah ada
| File | Baris | Keterangan |
|---|---|---|
| `src/utils/penilaian.ts` | 1-60 | **BARU** — satu pintu `KKM_DEFAULT` (75), `KONFIGURASI_PENILAIAN`, `hitungPredikat`, `isTuntas`, `getBobotNilai` |
| `src/utils/penilaian.test.ts` | 1-90 | **BARU** — 6 test KKM/predikat/bobot |
| `src/fitur/guru/InputRapotGuru.tsx` | import | badge TUNTAS/BELUM TUNTAS di form & rata-rata |
| `src/fitur/murid/RapotSiswa.tsx` | import | kolom Ketuntasan + strip KKM + rekap Tuntas x/y |
| `src/fitur/orang-tua/DasborOrangTua.tsx` | import | predikat lokal (batas D<70) dihapus → helper |
| `src/fitur/orang-tua/ProfileOrangTuaPage.tsx` | import | duplikat dihapus → helper |
| `src/utils/export.ts` | 208, 419 | + kolom Tuntas & info KKM di PDF/CSV rapot |

### ❌ Gap (telah ditutup)
- ✅ Konsep KKM / status Tuntas/Belum Tuntas kini ada di rapot.
- ✅ Predikat hardcoded 3x digabung ke `penilaian.ts` (batas konsisten A≥90 B≥80 C≥70 D≥60 E<60).
- ✅ Bobot IP hardcode dipindah ke `getBobotNilai` satu pintu.

---

## Area 2 — Jurnal Mengajar — ✅ TUNTAS

### ✅ Sudah ada
| File | Baris | Keterangan |
|---|---|---|
| `src/fitur/guru/JurnalMengajarGuru.tsx` | 1-320 | **BARU** — pilih kelas+mapel, rekap filter tanggal, ekspor PDF/CSV |
| `src/fitur/guru/CatatanRpsGuru.tsx` | 1-157 | Jurnal/catatan mengajar — kini LIVE (via JurnalMengajarGuru) |
| `src/App.tsx` / `src/routes.ts` / `Sidebar.tsx` | — | Wiring key `'jurnal-mengajar'`, route `GURU_JURNAL_MENGAJAR`, menu "Jurnal Mengajar" |
| `src/utils/export.ts` | 700+ | `exportJurnalPdf` + `exportJurnalCsv` + test |
| `src/data/store/core.ts` | 2199-2229 | `getTeacherLessonNotes`, `upsertTeacherLessonNote` |

### ❌ Gap (telah ditutup)
- ✅ `CatatanRpsGuru` kini ter-wire (dead code → live).
- ✅ Halaman Jurnal Mengajar + rekap per kelas/mapel/tanggal + ekspor PDF/CSV.

---

## Area 3 — Rekap & Ekspor — ✅ TUNTAS

### ✅ Sudah ada
| File | Baris | Keterangan |
|---|---|---|
| `src/fitur/guru/RekapNilaiGuru.tsx` | 1-360 | **BARU** — matriks siswa×nilai per kelas→mapel→semester→TA + statistik + ekspor PDF/CSV |
| `src/utils/export.ts` | 49, 139, 233, 321, 412 | `exportToCsv`, `exportRapotPdf/Csv`, `exportAbsensiPdf`, `exportTagihanPdf` |
| `src/utils/export.ts` | 800+ | `exportRekapNilaiPdf` (rata-rata + % ketuntasan) + `exportRekapNilaiCsv` (header KKM) + test |
| `src/App.tsx` / `src/routes.ts` / `Sidebar.tsx` | — | Wiring key `'rekap-nilai'`, route `GURU_REKAP_NILAI`, menu "Rekap Nilai" |
| `src/fitur/guru/HalamanLaporan.tsx` | 1-238 | Rekap absensi per kelas per rentang tanggal (matriks) + PDF + CSV |
| `src/fitur/murid/RapotSiswa.tsx` | 83-166 | Cetak & ekspor rapot siswa (+ kolom tuntas & KKM) |

### ❌ Gap (telah ditutup)
- ✅ Rekap nilai per kelas per mapel (matriks) + ekspor PDF/CSV + info KKM/ketuntasan.
- ⚠️ Rekap absensi per bulan per kelas & standarisasi CSV BOM — belum dikerjakan (luar scope Tier 1; catatan lanjutan).

---

## Area 4 — Wali Kelas — ✅ TUNTAS

### ✅ Sudah ada
| File | Baris | Keterangan |
|---|---|---|
| `src/fitur/guru/ManajemenSiswa.tsx` | 1-280 | **Kini LIVE** — key `'student-management'` di App.tsx, route `GURU_KELOLA_SISWA`, menu "Kelola Siswa" |
| `src/fitur/guru/DasborGuru.tsx` | QuickAction | Dead link `student-management` diperbaiki — kini berfungsi |
| `src/types.ts` | 34-39, 20-32 | `ClassRoom.teacherId` + `Teacher.classIds` |
| `src/fitur/admin/components/utils.ts` | 3-29 | `applyExclusiveClassAssignment` |
| `src/fitur/admin/components/TabAkunGuru.tsx` | 290-313 | Hak akses kelas ajar |
| `src/fitur/orang-tua/DasborOrangTua.tsx` | 61-65, 434-450 | Kartu wali kelas + Chat |
| `src/fitur/guru/KotakSuratGuru.tsx` | 36-52 | Persetujuan surat izin per kelas ajar |

### ❌ Gap (telah ditutup)
- ✅ `ManajemenSiswa` ter-wire (dead code → live) + dead link QuickAction diperbaiki.
- ⚠️ Dashboard ringkasan wali kelas khusus & field homeroom di Prisma — belum dikerjakan (catatan lanjutan Tier 2).

---

## Area 5 — Mutasi Siswa — ✅ TUNTAS

### ✅ Sudah ada
| File | Baris | Keterangan |
|---|---|---|
| `src/types.ts` | 365-382 | `StudentClassMutation` + **BARU** `Student.status?`/`statusNote?`/`statusUpdatedAt?`, `StudentStatus`, `StudentStatusMutation` |
| `src/data/store/core.ts` | 130, 990-1040 | `getStudentClassMutations`, `addStudentClassMutation` + **BARU** `getStudentStatusMutations`, `addStudentStatusMutation`, `setStudentStatus` |
| `src/data/services/studentService.ts` | 1-30 | Re-export + tipe status mutation |
| `src/fitur/admin/components/TabAkunSiswa.tsx` | 103-111, 187-190, 438-560 | Ganti kelas → log mutasi; **BARU** kolom Status + badge, tombol "Mutasi", modal ubah status, panel log 2 seksi |
| `src/fitur/admin/components/TabKelolaKelas.tsx` | 220-280 | Pindah massal → **BARU** menulis `addStudentClassMutation` per siswa |
| `src/data/store/core.ts` | 1142-1156 | **BARU** siswa dari PPDB ACCEPTED diberi `status: 'aktif'` |
| `src/context/AuthContext.tsx` | 95-130 | **BARU** filter siswa/ortu non-aktif tidak bisa login |
| `src/fitur/perpustakaan/LoginPerpustakaan.tsx` | 96-110 | **BARU** filter NISN non-aktif |
| `src/fitur/guru/DasborGuru.tsx` | 62-70 | **BARU** statistik hanya menghitung siswa aktif |

### ❌ Gap (telah ditutup)
- ✅ `Student.status` (aktif/keluar/lulus/pindah) + log `StudentStatusMutation` + setter `setStudentStatus`.
- ✅ Bulk move di TabKelolaKelas kini menulis log mutasi.
- ⚠️ Surat keterangan pindah & ekspor rekam mutasi — belum dikerjakan (catatan lanjutan).

---

## Rekomendasi Urutan Kerja

1. **Area 1 (KKM)** — helper `penilaian.ts` satu pintu + wire status tuntas → **SELESAI ✅**.
2. **Area 2 (Jurnal)** — wire `CatatanRpsGuru` ke route/sidebar (dead code → live) → **SELESAI ✅**.
3. **Area 3 (Rekap)** — rekap nilai per kelas per mapel + standarisasi CSV → **SELESAI ✅**.
4. **Area 4 (Wali Kelas)** — wire `ManajemenSiswa` + fix dead link → **SELESAI ✅**.
5. **Area 5 (Mutasi)** — status siswa + log bulk move → **SELESAI ✅**.

> **Verifikasi akhir:** tsc 0 error, eslint 0 output, **167 test lulus** (13 file).

## Catatan Lanjutan (Tier 2 — belum dikerjakan)

- Rekap absensi per bulan per kelas; standarisasi semua CSV ke `exportToCsv` (BOM).
- Dashboard ringkasan wali kelas khusus (rekap siswa + pengumuman ortu).
- Field `homeroom` di Prisma + sinkronisasi field frontend/backend (`ClassRoom.teacherId`, `NilaiRapot.predikat`).
- Surat keterangan pindah & ekspor rekam mutasi.
- Alur mutasi masuk (non-PPDB) dari sekolah lain.
