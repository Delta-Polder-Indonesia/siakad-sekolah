# Panduan Lengkap global.css - HeroSection

## 📁 Lokasi File
```
src/fitur/halaman/global.css
```

---

## 🎯 Struktur Umum

File ini mengatur **animasi hero 3 tema** (biru, hijau, merah) yang berputar otomatis setiap 5 detik. Setiap tema punya 4 gambar layer + 1 gambar utama (tengah).

---

## 🖼️ Layer System (Sistem Lapisan Gambar)

### Urutan Layer (dari belakang ke depan)
```
Layer 1 (item-1) → Gambar utama / paling depan
Layer 2 (item-2) → Gambar pendukung
Layer 3 (item-3) → Gambar pendukung
Layer 4 (item-4) → Gambar pendukung
hero-slot        → Gambar utama tengah (slot khusus)
```

### Z-Index (Ketebalan Lapisan)
| Element       | Z-Index | Keterangan                    |
|---------------|---------|-------------------------------|
| `.theme--layer` | default | Layer gambar biasa           |
| `.hero-slot`    | 2       | Gambar utama tengah          |
| `.blue .item-1` | 3       | Gambar utama tema biru       |

---

## 📍 Posisi Gambar Utama (hero-slot)

### Posisi Default (Mobile)
```css
.hero-animation .hero-slot {
  left: 50%;           /* Posisi horizontal: tengah */
  bottom: 14%;         /* Posisi vertikal: 14% dari bawah */
  width: 26%;          /* Lebar gambar */
  aspect-ratio: 16/10; /* Rasio aspect gambar */
  transform: translateX(-50%); /* Pusatkan horizontal */
}
```

### Posisi Desktop (min-width: 62rem / 992px)
```css
@media screen and (min-width: 62rem) {
  .hero-animation .hero-slot {
    left: 54%;    /* Pindah sedikit ke kanan */
    bottom: 20%;  /* Naik lebih tinggi */
    width: 22%;   /* Lebih kecil di desktop */
  }
}
```

### Cara Mengubah Posisi
| Property      | Fungsi                                    | Contoh Nilai     |
|---------------|-------------------------------------------|------------------|
| `left`        | Posisi horizontal (dari kiri)             | `50%` = tengah   |
| `bottom`      | Posisi vertikal (dari bawah)              | `14%` = naik     |
| `right`       | Posisi horizontal (dari kanan)            | `10%`            |
| `top`         | Posisi vertikal (dari atas)               | `20%`            |
| `width`       | Lebar gambar                              | `26%`            |
| `height`      | Tinggi gambar (opsional)                  | `auto`           |
| `transform`   | Pergeseran relatif                        | `translateX(-50%)`|

---

## 🎨 Posisi Per Tema

### 🔵 Tema Biru (Blue)
```css
/* Mobile */
.blue .item-1 { bottom: 19%; right: 2%; width: 40%; }  /* Gambar utama */
.blue .item-2 { bottom: 52%; left: 0%; width: 12%; }
.blue .item-3 { bottom: 0%; left: 20%; width: 14%; }
.blue .item-4 { bottom: 48%; left: 40%; width: 9%; }

/* Desktop */
@media (min-width: 62rem) {
  .blue .hero-main { right: 6%; width: 34%; }
  .blue .item-2 { bottom: 58%; left: 2%; width: 10%; }
  .blue .item-3 { bottom: 4%; left: 30%; width: 12%; }
  .blue .item-4 { bottom: 52%; left: 44%; width: 8%; }
}
```

### 🟢 Tema Hijau (Green)
```css
/* Mobile */
.green .item-1 { bottom: 58%; left: 2%; width: 11%; }
.green .item-2 { bottom: 2%; left: 6%; width: 14%; }
.green .item-3 { bottom: 46%; left: 44%; width: 10%; }
.green .item-4 { bottom: 8%; right: 6%; width: 14%; }

/* Desktop */
@media (min-width: 62rem) {
  .green .item-1 { bottom: 62%; left: 3%; width: 9%; }
  .green .item-2 { bottom: 5%; left: 10%; width: 12%; }
  .green .item-3 { bottom: 50%; left: 46%; width: 8%; }
  .green .item-4 { bottom: 8%; right: 8%; width: 12%; }
}
```

### 🔴 Tema Merah (Red)
```css
/* Mobile */
.red .item-1 { bottom: 54%; right: 4%; width: 12%; }
.red .item-2 { bottom: 4%; right: 24%; width: 13%; }
.red .item-3 { bottom: 44%; left: 8%; width: 11%; }
.red .item-4 { bottom: 6%; left: 30%; width: 12%; }

/* Desktop */
@media (min-width: 62rem) {
  .red .item-1 { bottom: 58%; right: 6%; width: 10%; }
  .red .item-2 { bottom: 6%; right: 28%; width: 11%; }
  .red .item-3 { bottom: 48%; left: 10%; width: 9%; }
  .red .item-4 { bottom: 8%; left: 34%; width: 10%; }
}
```

---

## 🔄 Animasi Transition

### Timing Function
```css
.theme--layer {
  transition: 1.4s cubic-bezier(0.645, 0.045, 0.355, 1) transform;
  transform: translateY(100vh); /* Mulai dari bawah layar */
}

.active .theme--layer {
  transform: translate3d(0, 0, 0); /* Posisi akhir */
}
```

### Delay Per Layer
| Layer    | Delay     |
|----------|-----------|
| item-1   | 0.25s     |
| item-2   | 0.3s      |
| item-3   | 0.35s     |
| item-4   | 0.4s      |
| item-5   | 0.45s     |

### Transisi Tema
```css
.theme {
  transition: 0.8s opacity cubic-bezier(0.645, 0.045, 0.355, 1) 1.2s;
  opacity: 0;  /* Default: tersembunyi */
}

.theme.active {
  opacity: 1;  /* Aktif: terlihat */
}
```

---

## 📐 Contoh Modifikasi

### 1. Pindah Gambar Utama ke Kiri
```css
.hero-animation .hero-slot {
  left: 20%;  /* Ganti dari 50% ke 20% */
}
```

### 2. Besarkan Gambar Utama
```css
.hero-animation .hero-slot {
  width: 40%;  /* Ganti dari 26% ke 40% */
}
```

### 3. Pindah ke Atas
```css
.hero-animation .hero-slot {
  bottom: 40%;  /* Ganti dari 14% ke 40% */
}
```

### 4. Gambar Utama Per Tema Berbeda
```css
/* Biru: gambar di kiri */
.hero-animation .blue .hero-slot {
  left: 20%;
  bottom: 20%;
}

/* Hijau: gambar di kanan */
.hero-animation .green .hero-slot {
  left: 70%;
  bottom: 15%;
}

/* Merah: gambar di tengah atas */
.hero-animation .red .hero-slot {
  left: 50%;
  bottom: 40%;
}
```

### 5. Ubah Rasio Aspect
```css
.hero-animation .hero-slot {
  aspect-ratio: 1/1;   /* Square */
  /* atau */
  aspect-ratio: 4/3;   /* Portrait */
  /* atau */
  aspect-ratio: 21/9;  /* Ultra-wide */
}
```

### 6. Tambah Border/Shadow
```css
.hero-animation .hero-slot {
  border: 3px solid white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}
```

---

## 🖥️ Responsive Breakpoints

| Breakpoint | Width     | Keterangan        |
|------------|-----------|-------------------|
| Mobile     | < 992px   | Default           |
| Desktop    | ≥ 992px   | `min-width: 62rem`|

---

## ⚠️ Tips Penting

1. **Gunakan `%` untuk responsive** - Lebih fleksibel daripada `px`
2. **`transform: translateX(-50%)`** - Penting untukpusatkan elemen yang pakai `left: 50%`
3. **`aspect-ratio`** - Pertahankan rasio gambar agar tidak stretch
4. **`object-fit: contain`** - Pastikan gambar tidak terpotong
5. **Z-index** - Atur urutan tumpukan gambar

---

## 📝 Catatan Template

- **hero-slot**: Slot gambar utama tengah (bisa diganti per tema)
- **item-1**: Gambar utama di layer (berbeda dengan hero-slot)
- **hero-main**: Class khusus untuk item-1 tema biru

Untuk gambar utama tengah, edit `.hero-slot`.
Untuk gambar per tema, edit `.blue .item-1`, `.green .item-1`, `.red .item-1`.
