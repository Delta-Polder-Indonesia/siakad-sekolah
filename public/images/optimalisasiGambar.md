# 📋 Panduan Optimasi Gambar Portal Sekolah

## 🔗 Link Tools Optimasi Gambar

### Tools Online (Gratis & Mudah Digunakan)
- **TinyPNG** - https://tinypng.com/ (Kompresi PNG/JPG, hasil sangat bagus)
- **Squoosh** - https://squoosh.app/ (Tool dari Google, bisa konversi ke WebP)
- **ImageOptim** - https://imageoptim.com/ (Kompresi JPG/PNG)
- **Compressor.io** - https://compressor.io/ (Kompresi JPG, PNG, SVG, GIF)
- **CloudConvert** - https://cloudconvert.com/ (Konversi ke berbagai format termasuk WebP)

### Tools Desktop (Untuk Batch Processing)
- **ImageMagick** - https://imagemagick.org/ (Command line, sangat powerful)
- **Sharp** - https://sharp.pixelplumbing.com/ (Node.js library, bisa diintegrasi)

### Tools Online untuk Konversi WebP
- **Convertio** - https://convertio.co/jpg-webp/ (Konversi JPG ke WebP)
- **FreeConvert** - https://www.freeconvert.com/jpg-to-webp/ (Konversi JPG ke WebP)
- **Online-Convert** - https://image.online-convert.com/convert-to-webp (Konversi ke WebP)

---

## 🎯 Gambar yang Perlu Dioptimasi (Prioritas Tinggi)

### Series Konoha (Utama - Loading Slide)
Lokasi: `public/images/Dashboard/`

1. **Konoha-1.jpg** - 693.91 KB
   - Deskripsi: Fasilitas Pembelajaran Modern
   - Digunakan di: Background slideshow login page
   - Tipe: Hero image (pertama kali di-load)
   - Optimasi: Kompresi + konversi ke WebP

2. **Konoha-2.jpg** - 697.06 KB
   - Deskripsi: Kegiatan Ekstrakurikuler
   - Digunakan di: Background slideshow login page
   - Tipe: Hero image
   - Optimasi: Kompresi + konversi ke WebP

3. **Konoha-3.jpg** - 23.66 KB
   - Deskripsi: Prestasi Siswa Berprestasi
   - Digunakan di: Background slideshow login page
   - Tipe: Gambar kecil
   - Optimasi: Kompresi saja

4. **Konoha-4.jpg** - 106.71 KB
   - Deskripsi: Fasilitas pembelajaran
   - Digunakan di: Background slideshow login page
   - Tipe: Gambar menengah
   - Optimasi: Kompresi + konversi ke WebP

5. **Konoha-5.jpg** - 323.47 KB
   - Deskripsi: Lingkungan Belajar Nyaman
   - Digunakan di: Background slideshow login page
   - Tipe: Hero image
   - Optimasi: Kompresi + konversi ke WebP

6. **Konoha-6.jpg** - 43.70 KB
   - Deskripsi: Alumni Tahun Ajaran 2024/2025
   - Digunakan di: Background slideshow login page
   - Tipe: Gambar kecil
   - Optimasi: Kompresi saja

### Gambar lain yang perlu perhatian:
- **Spanduk PPDB 2023.jpg** - Kemungkinan besar ukurannya besar
- **ProgramSekolah.jpg** - Banner utama
- **branda-1.jpg sampai branda-5.jpg** - Series branding

---

## 📝 Panduan Langkah demi Langkah

### Metode 1: Menggunakan TinyPNG (Paling Mudah)

1. Buka https://tinypng.com/
2. Upload gambar-gambar di atas (bisa multiple sekaligus)
3. Tunggu proses kompresi selesai
4. Download hasil yang sudah dikompresi
5. Replace file lama dengan file baru yang sudah dikompresi

### Metode 2: Menggunakan Squoosh (Untuk WebP)

1. Buka https://squoosh.app/
2. Upload gambar
3. Pilih output format: WebP
4. Atur quality (rekomendasi 80-85%)
5. Klik "Download" 
6. Replace file lama atau gunakan sebagai WebP version

### Metode 3: Konversi ke WebP dengan Penggantian di Kode

Jika menggunakan WebP, perlu update kode di:
- `src/fitur/autentikasi/DataLogingPage/constants.ts`
- `src/fitur/halaman/components/Profile/TonggakSejarah.tsx`

Ganti ekstensi `.jpg` dengan `.webp` atau gunakan `<picture>` element untuk fallback:

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Deskripsi" loading="lazy">
</picture>
```

---

## 💡 Tips Tambahan

### Rekomendasi Quality Settings:
- **JPG/PNG untuk hero images:** Quality 80-85%
- **JPG/PNG untuk gambar biasa:** Quality 70-75%
- **WebP:** Quality 80-85% (penghematan 25-35% lebih banyak dari JPG)

### Rekomendasi Dimensi:
- Pastikan dimensi gambar sesuai dengan tampilan di layar
- Hero images: Max 1920x1080 (Full HD)
- Gambar biasa: Max 1200x800
- Thumbnails: Max 400x300

### Loading Strategy:
- Gambar hero utama: `loading="eager"` (di-load segera)
- Gambar lain: `loading="lazy"` (di-load saat scroll)

---

## 📊 Target Penghematan

Dengan optimasi yang direkomendasikan:
- **Kompresi saja:** Penghematan 20-30% ukuran file
- **Konversi ke WebP:** Penghematan tambahan 25-35%
- **Total potensi penghematan:** 40-60% dari ukuran asli

Untuk 6 gambar Konoha series (total ~1.8 MB):
- Setelah kompresi: ~1.2-1.4 MB
- Setelah WebP: ~0.8-1.0 MB
- **Total penghematan:** 800 KB - 1 MB

---

## 🔄 Schedule Maintenance

### Rutinitas Mingguan/Bulanan:
- [ ] Cek gambar baru yang ditambahkan
- [ ] Optimasi gambar baru sebelum commit
- [ ] Pastikan semua gambar hero sudah di WebP
- [ ] Test loading performance setelah optimasi

### Checklist Sebelum Deploy:
- [ ] Semua gambar hero sudah dikompresi
- [ ] Gambar konversi ke WebP jika memungkinkan
- [ ] Test loading di browser (dev tools network tab)
- [ ] Pastikan tidak ada gambar yang terlalu besar (>500 KB)

---

## 📞 Bantuan Tambahan

Jika membutuhkan bantuan lebih lanjut:
- Cek dokumentasi Vite untuk image optimization
- Lihat artikel tentang WebP support di browser
- Konsultasikan dengan tim desain untuk kualitas visual

---

**Catatan:** File ini dibuat sebagai referensi untuk optimasi gambar berkelanjutan. Update setelah ada gambar baru yang perlu dioptimasi.