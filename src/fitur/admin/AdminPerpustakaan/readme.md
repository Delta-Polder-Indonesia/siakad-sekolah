Baik, saya akan buatkan **struktur folder map** untuk halaman Perpustakaan Anda. Berdasarkan menu yang Anda sebutkan, berikut pemetaan lengkapnya:

---

## 📁 Struktur Folder Perpustakaan

```
E:\guthub\Folder Baru (2)\projeck-portal-siswa\src\
├── fitur\
│   └── admin\
│       └── AdminPerpustakaan\                    ← 📍 SEMUA FILE DI SINI
│           │
│           ├── PerpusTransaksi.tsx                 ← Entry point (wrapper pinjam/kembali)
│           │
│           ├── FormPeminjaman.tsx                  ← Fitur: Peminjaman
│           ├── FormPengembalian.tsx                ← Fitur: Pengembalian
│           │
│           ├── PerpusDashboard.tsx                 ← Fitur: Dashboard Perpus
│           ├── PerpusInventori.tsx                 ← Fitur: Inventori Buku
│           ├── PerpusAnggota.tsx                   ← Fitur: Data Anggota
│           ├── PerpusMasterBuku.tsx                ← Fitur: Master Buku
│           ├── PerpusKategori.tsx                  ← Fitur: Kategori Buku
│           ├── PerpusPenerbit.tsx                  ← Fitur: Data Penerbit
│           ├── PerpusRak.tsx                       ← Fitur: Posisi Rak
│           │
│           ├── PendingLoansTable.tsx               ← 🔧 Komponen bantu (shared)
│           ├── MemberAutocomplete.tsx              ← 🔧 Komponen bantu (shared)
│           ├── BookAutocomplete.tsx                ← 🔧 Komponen bantu (shared)
│           ├── SelectedBooksTable.tsx              ← 🔧 Komponen bantu (shared)
│           ├── DendaSettings.tsx                   ← 🔧 Komponen bantu (shared)
│           ├── ReturnReceipt.tsx                   ← 🔧 Komponen bantu (shared)
│           │
│           ├── hooks\
│           │   └── useSmartSearch.ts               ← 🔧 Hook shared
│           │
│           └── utils\
│               └── highlightMatch.tsx              ← 🔧 Helper shared
│
├── data\
│   └── store.ts                                    ← 📦 Data source (sudah ada)
│
└── hooks\
    └── useStoreVersion.ts                          ← 📦 Hook global (sudah ada)
```

---

## 🗺️ Mapping Menu → File

| Menu | File Utama | Keterangan |
|------|-----------|------------|
| **Dashboard Perpus** | `PerpusDashboard.tsx` | Statistik, grafik peminjaman, ringkasan |
| **Inventori Buku** | `PerpusInventori.tsx` | Stok buku, buku rusak/hilang |
| **Data Anggota** | `PerpusAnggota.tsx` | Daftar siswa yang jadi anggota perpus |
| **Master Buku** | `PerpusMasterBuku.tsx` | CRUD data buku (judul, pengarang, ISBN) |
| **Kategori Buku** | `PerpusKategori.tsx` | CRUD kategori/genre buku |
| **Data Penerbit** | `PerpusPenerbit.tsx` | CRUD data penerbit |
| **Posisi Rak** | `PerpusRak.tsx` | Manajemen lokasi penyimpanan buku |
| **Peminjaman** | `FormPeminjaman.tsx` | Sudah dibuat ✅ |
| **Pengembalian** | `FormPengembalian.tsx` | Sudah dibuat ✅ |

---

## 🔗 Cara Routing-nya (Contoh)

Di file routing Anda (misal `App.tsx` atau router config), import seperti ini:

```tsx
// Import dari lokasi baru
import PerpusTransaksi from './fitur/admin/AdminPerpustakaan/PerpusTransaksi';
import PerpusDashboard from './fitur/admin/AdminPerpustakaan/PerpusDashboard';
import PerpusInventori from './fitur/admin/AdminPerpustakaan/PerpusInventori';
// ... dll

// Route config
{
  path: '/admin/perpustakaan',
  element: <PerpusDashboard />           // Dashboard Perpus
},
{
  path: '/admin/perpustakaan/peminjaman',
  element: <PerpusTransaksi activeSubTab="pinjam" />
},
{
  path: '/admin/perpustakaan/pengembalian',
  element: <PerpusTransaksi activeSubTab="kembali" />
},
{
  path: '/admin/perpustakaan/master-buku',
  element: <PerpusMasterBuku />
},
// ... dst
```

---

## ✅ Status File Saat Ini

| File | Status |
|------|--------|
| `PerpusTransaksi.tsx` | ✅ Sudah ada (perlu fix import) |
| `FormPeminjaman.tsx` | ✅ Sudah ada |
| `FormPengembalian.tsx` | ✅ Sudah ada |
| `PendingLoansTable.tsx` | ✅ Sudah ada |
| `MemberAutocomplete.tsx` | ✅ Sudah ada |
| `BookAutocomplete.tsx` | ✅ Sudah ada |
| `SelectedBooksTable.tsx` | ✅ Sudah ada |
| `DendaSettings.tsx` | ✅ Sudah ada |
| `ReturnReceipt.tsx` | ✅ Sudah ada |
| `hooks/useSmartSearch.ts` | ✅ Sudah ada |
| `utils/highlightMatch.tsx` | ✅ Sudah ada |
| **PerpusDashboard.tsx** | ❌ Belum dibuat |
| **PerpusInventori.tsx** | ❌ Belum dibuat |
| **PerpusAnggota.tsx** | ❌ Belum dibuat |
| **PerpusMasterBuku.tsx** | ❌ Belum dibuat |
| **PerpusKategori.tsx** | ❌ Belum dibuat |
| **PerpusPenerbit.tsx** | ❌ Belum dibuat |
| **PerpusRak.tsx** | ❌ Belum dibuat |

---

## 🔧 Yang Perlu Diperbaiki SEKARANG

1. **Fix import `useStoreVersion`** di `PerpusTransaksi.tsx`
2. **Fix error `url` di `src/fitur/halaman/data.ts`**

Untuk fix error `useStoreVersion`, coba ganti baris 11 di `PerpusTransaksi.tsx`:

```tsx
// Dari:
import { useStoreVersion } from '../../../../hooks/useStoreVersion';

// Coba jadi (kalau default export):
import useStoreVersion from '../../../../hooks/useStoreVersion';
```

Atau lebih baik, kirim isi file `src/hooks/useStoreVersion.ts` ke saya agar saya bisa pastikan.

Apakah Anda ingin saya buatkan **template kosong** untuk 7 file yang belum ada (`PerpusDashboard.tsx` sampai `PerpusRak.tsx`)?