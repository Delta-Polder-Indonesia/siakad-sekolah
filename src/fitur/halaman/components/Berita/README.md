# Panduan Menambahkan/Mengubah Halaman Detail Berita

Folder ini menyimpan file-file detail untuk setiap berita di website portal siswa.

## Cara Menambah Berita Baru

Jika Anda ingin menambahkan artikel berita baru dan menghubungkannya dengan tombol "Read Article", ikuti langkah-langkah berikut:

### 1. Buat Komponen Detail Baru
Buat sebuah file baru di folder ini, misalnya `Berita05.tsx.tsx`.
Gunakan template komponen React standar. Contoh:
```tsx
import type { PageProps } from '../../types';

export default function Berita05Page({ onNavigate }: PageProps) {
  return (
    <div className="bg-white text-slate-950 font-sans min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={() => onNavigate?.('Berita')}
          className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950"
        >
          ← Kembali ke Berita
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Kategori Berita • Tanggal
        </span>
        <h1 className="mt-2 text-2xl font-bold uppercase tracking-wide text-slate-950 leading-tight">
          Judul Berita Baru Anda
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
  // Halaman detail Berita
  | 'berita-1' | 'berita-2' | 'berita-3' | 'berita-4' | 'berita-5'
```

### 3. Daftarkan Rute di ExpectationModal.tsx
Buka file `src/fitur/halaman/ExpectationModal.tsx`, kemudian:
1. Impor komponen baru di bagian atas file:
   ```typescript
   import Berita05Page from './components/Berita/Berita05.tsx';
   ```
2. Tambahkan case baru di dalam fungsi `renderPage()`:
   ```typescript
   case 'berita-5': return <Berita05Page {...props} />;
   ```

### 4. Hubungkan Data di BeritaPage.tsx
Buka file `src/fitur/halaman/pages/BeritaPage.tsx` dan tambahkan data berita baru ke dalam array `news`:
```typescript
{
  id: "berita-5",
  title: "Judul Berita Baru Anda",
  date: "Tanggal Berita",
  category: "Prestasi / Kegiatan / Informasi / Pengumuman",
  excerpt: "Kutipan singkat berita...",
  image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpg`,
}
```
Tombol "Read Article" secara otomatis akan langsung terhubung ke halaman detil baru Anda!
