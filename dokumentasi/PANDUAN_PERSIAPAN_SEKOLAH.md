# 📋 CHECKLIST PERSIAPAN SEKOLAH — Paket SIAKAD Cloud

> Dokumen ini diisi oleh pihak sekolah (pembeli) dan dikirim kembali ke tim
> pengembang **sebelum** proses instalasi dimulai. Semakin lengkap datanya,
> semakin cepat aplikasi siap dipakai.

---

## A. Data Dasar Sekolah

| Item | Contoh | Diisi Sekolah |
|---|---|---|
| Nama resmi sekolah | SMA Negeri 1 Medan | |
| Singkatan / nama umum | SMAN 1 Medan | |
| Jenjang | SD / SMP / SMA / SMK | |
| Status | Negeri / Swasta | |
| NPSN | 10210881 | |
| Tahun ajaran berjalan | 2026/2027 | |
| Alamat lengkap | Jl. ... No. ..., Kec. ..., Kota ... | |
| Telepon sekolah | (061) 1234567 | |
| Domain email sekolah | sman1medan.sch.id | |
| **Logo sekolah** (PNG/JPG, maks 300KB) | file: logo.png | |

## B. Akun Administrator

| Item | Keterangan |
|---|---|
| Username admin yang diinginkan | |
| Email admin (untuk notifikasi) | |

## C. Data Guru & Pegawai (paling penting)

Bisa berupa file Excel/CSV dengan kolom:
`nama | NIP | mata pelajaran | email | password awal (boleh kosong, default dibuatkan)`

> Tips: bisa diekspor dari Dapodik sekolah.

## D. Data Siswa & Orang Tua

Bisa berupa file Excel/CSV dengan kolom:
`NISN | nama | jenis kelamin | kelas | nama ayah | nama ibu | nama wali | no HP orang tua | password awal`

## E. Struktur Akademik

| Item | Contoh |
|---|---|
| Daftar kelas & rombongan belajar | X-1, X-2, XI IPA-1, ... |
| Wali kelas per kelas | |
| Mata pelajaran yang diajarkan | |
| Jadwal/roster pelajaran (jika sudah ada) | |

## F. Data Awal (opsional, bisa menyusul)

- [ ] Absensi semester berjalan
- [ ] Nilai/rapot semester sebelumnya
- [ ] Data buku perpustakaan
- [ ] Data tagihan/SPP
- [ ] Pengumuman awal

## G. Teknis & Hosting

| Item | Pilihan / Diisi |
|---|---|
| Domain yang diinginkan | contoh: siakad.sekolah.sch.id |
| Hosting backend | Diurus tim pengembang (Railway/Render) |
| Database | Diurus tim pengembang (PostgreSQL/Neon) |
| Siapa penanggung jawab sekolah? | Nama + no HP + email |

---

## Alur Serah Terima

```
1. Sekolah isi checklist ini + kirim data (A-F)
2. Tim pengembang setup: deploy backend, buat database, seed data
3. Frontend dibuild dengan identitas sekolah & di-deploy
4. Uji coba bersama admin sekolah (1-2 hari)
5. Pelatihan admin & guru (via video call / panduan)
6. Serah terima + dokumen cara pakai
```

## Biaya yang Perlu Diketahui Sekolah (Paket Cloud)

| Komponen | Estimasi/bulan | Ditanggung |
|---|---|---|
| Server backend (Railway/Render) | Rp 30-80rb | sekolah / termasuk langganan |
| Database (Neon/PostgreSQL) | Rp 20-70rb | sekolah / termasuk langganan |
| Domain .sch.id | gratis* | sekolah |
| Pemeliharaan & backup | sesuai kesepakatan | sekolah |

\* domain .sch.id umumnya gratis untuk sekolah negeri via Kemdikbud.

---

*Dokumen pendukung: PANDUAN_PENGGUNA.md (cara pakai aplikasi) & PANDUAN_INSTALL.md (untuk tim teknis).*
