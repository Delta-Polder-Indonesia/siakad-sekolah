# Panduan Menambahkan/Mengubah Halaman Detail Kegiatan Sekolah

Folder ini menyimpan file-file detail untuk setiap kegiatan strategis di website portal siswa.

## Cara Menambah Kegiatan Baru

Jika Anda ingin menambahkan artikel kegiatan strategis baru dan menghubungkannya dengan tombol "Detail Kegiatan", ikuti langkah-langkah berikut:

### 1. Buat Komponen Detail Baru
Buat sebuah file baru di folder ini, misalnya `Strategis06.tsx.tsx`.
Gunakan template komponen React standar. Contoh:
```tsx
import type { PageProps } from '../../types';

export default function Strategis06Page({ onNavigate }: PageProps) {
  return (
    <div className="bg-white text-slate-950 font-sans min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={() => onNavigate?.('Kegiatan Sekolah')}
          className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950"
        >
          ← Kembali ke Kegiatan Sekolah
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Tipe Kegiatan • Periode / Bulan
        </span>
        <h1 className="mt-2 text-2xl font-bold uppercase tracking-wide text-slate-950 leading-tight">
          Judul Kegiatan Baru Anda
        </h1>
        <div className="my-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
          <img src="/placeholder-atau-link-gambar.jpg" className="h-full w-full object-cover" />
        </div>
        <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 text-justify space-y-4">
          <p>Tulis paragraf pertama artikel Anda di sini...</p>
          <p>Tulis paragraf kedua artikel Anda di sini...</p>
        </div>
      </section>
    </div>
  );
}
```

### 2. Daftarkan NavItem Baru
Buka file `src/fitur/halaman/types.ts` dan tambahkan ID baru ke tipe `NavItem`.
```typescript
  // Halaman detail Kegiatan Sekolah
  | 'kegiatan-1' | 'kegiatan-2' | 'kegiatan-3' | 'kegiatan-4' | 'kegiatan-5' | 'kegiatan-6'
```

### 3. Daftarkan Rute di ExpectationModal.tsx
Buka file `src/fitur/halaman/ExpectationModal.tsx`, kemudian:
1. Impor komponen baru di bagian atas file:
   ```typescript
   import Strategis06Page from './components/KegiatanSekolah/Strategis06.tsx';
   ```
2. Tambahkan case baru di dalam fungsi `renderPage()`:
   ```typescript
   case 'kegiatan-6': return <Strategis06Page {...props} />;
   ```

### 4. Hubungkan Data di KegiatanSekolahPage.tsx
Buka file `src/fitur/halaman/pages/KegiatanSekolahPage.tsx` dan tambahkan data kegiatan baru ke dalam array `activities`:
```typescript
{
  id: "kegiatan-6",
  title: "Judul Kegiatan Baru Anda",
  time: "Bulan / Tahun",
  desc: "Deskripsi singkat kegiatan strategis...",
  type: "Kategori / Jenis Kegiatan",
  image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/sekolah-6.jpg`,
}
```
Tombol "Detail Kegiatan" secara otomatis akan langsung terhubung ke halaman detil baru Anda!
