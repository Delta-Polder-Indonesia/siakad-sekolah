# 🏫 PANDUAN SETUP SEKOLAH — Portal SIAKAD

> Panduan untuk **admin sekolah** (pembeli/pengelola) — tidak perlu kemampuan
> koding. Ikuti langkah berikut untuk menyiapkan portal sekolah Anda.
> Estimasi total: **±10–15 menit**.

---

## 1. Login sebagai Admin

1. Buka alamat portal sekolah Anda.
2. Klik **Login** (kanan atas).
3. Pilih role **Admin** — gunakan kredensial admin yang diberikan tim pengembang
   (biasanya: username `admin` + PIN khusus).
4. Setelah masuk, klik menu **Administrasi / Panel Admin** di sidebar.

---

## 2. Isi Identitas Sekolah (nama, logo, kontak)

Menu: **Admin → Sistem → Setup Sekolah**

Isi dengan data sekolah Anda:

| Kolom | Contoh | Keterangan |
|---|---|---|
| Nama Sekolah | SMP Negeri 5 Bandung | Nama resmi |
| Singkatan | SMPN 5 Bandung | Nama umum/singkatan |
| Jenjang | SD / SMP / SMA / SMK | Pilih sesuai sekolah |
| Tahun Ajaran | 2026/2027 | Tahun ajaran berjalan |
| NPSN | 20219876 | 8 digit |
| Telepon | (022) 1234567 | |
| Domain Email | smpn5bdg.sch.id | Email otomatis: info@domain |
| Alamat | Jl. ... | Alamat lengkap |
| **Logo** | file PNG/JPG | Maks 300KB, ada preview |

Klik **Simpan Identitas Sekolah**. Perubahan langsung berlaku di:
halaman login, sidebar, footer, judul tab browser, dan buku tamu — **tanpa
perlu build ulang**.

---

## 3. Kelola Data (kosongkan & impor)

Menu: **Admin → Sistem → Data Sekolah**

### 3a. Kalau instalasi BARU (data masih contoh)
1. Klik **Kosongkan Semua Data** → konfirmasi.
2. Portal jadi kosong (identitas sekolah Anda **tetap aman**).

### 3b. Impor data sekolah lama (sudah pernah pakai SIAKAD)
1. Di instalasi lama: **Data Sekolah → Ekspor Data Master** → simpan file `.json`.
2. Di instalasi baru: **Data Sekolah → Impor Data Master** → pilih file tadi.
3. Periksa ringkasan (jumlah guru/siswa/kelas) — selesai!

> 💡 Tidak ada file ekspor? Data bisa diisi manual lewat menu **Daftar Guru /
> Tambah Guru / Daftar Siswa / Tambah Siswa / Kelola Kelas**.

### 3c. Kembalikan data contoh (untuk latihan)
Klik **Reset ke Data Demo** — semua data kembali ke contoh bawaan.

---

## 4. Akun & Login Pengguna

| Role | Cara login | Data akun |
|---|---|---|
| **Guru** | NIP + password | Diinput admin (menu Daftar Guru / Tambah Guru) |
| **Siswa** | NISN + password | Diinput admin (menu Daftar Siswa / Tambah Siswa) |
| **Orang Tua** | Nama wali + password | Otomatis dari data siswa (nama wali) |
| **Tamu** | Email + kode akses | Kode akses diatur sistem |

> Password awal bisa dibuatkan admin; segera ganti setelah login pertama
> (menu Pengaturan Akun).

---

## 5. Hal yang Perlu Diketahui

- **Data tersimpan di browser (mode Standar).** Setiap perangkat (guru, siswa)
  menyimpan datanya sendiri. Untuk sinkronisasi antar perangkat, tanyakan paket
  **SIAKAD Cloud** ke tim pengembang.
- **Konten halaman publik** (berita, galeri, visi-misi, struktur organisasi,
  ekstrakurikuler, program keahlian) adalah **konten contoh** — penyesuaian
  mendalam dilakukan tim pengembang (lihat panduan teknis).
- **Backup rutin:** gunakan **Ekspor Data Master** secara berkala dan simpan
  file-nya di tempat aman.

---

## 6. Cek Cepat Setelah Setup

- [ ] Login admin berhasil
- [ ] Nama & logo sekolah tampil di login/sidebar/footer
- [ ] Judul tab browser menampilkan nama sekolah
- [ ] Data guru & siswa sudah terisi (atau terimpor)
- [ ] Login guru dengan NIP berhasil
- [ ] Login siswa dengan NISN berhasil
- [ ] Ekspor data master menghasilkan file `.json`

---

*Panduan pendukung: PANDUAN_PERSIAPAN_SEKOLAH.md (formulir data yang perlu
dikirim sekolah) & PANDUAN_PENYESUAIAN_KONTEN.md (untuk tim teknis).*
