# Panduan Menambahkan/Mengubah Halaman Detail Sarana Prasarana (Fasilitas)

Folder ini menyimpan file-file detail untuk setiap sarana prasarana / fasilitas sekolah di website portal siswa.

## Cara Menambah Fasilitas Baru

Jika Anda ingin menambahkan fasilitas baru dan menghubungkannya dengan tombol "Lihat Detail", ikuti langkah-langkah berikut:

### 1. Buat Komponen Detail Baru
Buat sebuah file baru di folder ini, misalnya `Facility09.tsx.tsx`.
Gunakan template komponen React standar. Contoh:
```tsx
import type { PageProps } from '../../types';

export default function Facility09Page({ onNavigate }: PageProps) {
  return (
    <div className="bg-white text-slate-950 font-sans min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={() => onNavigate?.('Sarana Prasarana')}
          className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950"
        >
          ← Kembali ke Sarana Prasarana
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Kode Fasilitas: facility-09
        </span>
        <h1 className="mt-2 text-2xl font-bold uppercase tracking-wide text-slate-950 leading-tight">
          Nama Fasilitas Baru Anda
        </h1>
        <div className="my-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
          <img src="/placeholder-atau-link-gambar.jpg" className="h-full w-full object-cover" />
        </div>
        <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 text-justify space-y-4">
          <p>Tulis penjelasan lengkap sarana/fasilitas baru Anda di sini...</p>
        </div>
      </section>
    </div>
  );
}
```

### 2. Daftarkan NavItem Baru
Buka file `src/fitur/halaman/types.ts` dan tambahkan ID baru ke tipe `NavItem`.
```typescript
  // Halaman detail Sarana Prasarana
  | 'facility-1' | 'facility-2' | 'facility-3' | 'facility-4'
  | 'facility-5' | 'facility-6' | 'facility-7' | 'facility-8' | 'facility-9';
```

### 3. Daftarkan Rute di ExpectationModal.tsx
Buka file `src/fitur/halaman/ExpectationModal.tsx`, kemudian:
1. Impor komponen baru di bagian atas file:
   ```typescript
   import Facility09Page from './components/SaranaPrasarana/Facility09.tsx';
   ```
2. Tambahkan case baru di dalam fungsi `renderPage()`:
   ```typescript
   case 'facility-9': return <Facility09Page {...props} />;
   ```

### 4. Hubungkan Data di SaranaPrasaranaPage.tsx
Buka file `src/fitur/halaman/pages/SaranaPrasaranaPage.tsx` dan tambahkan data fasilitas baru ke dalam array `facilities`:
```typescript
{
  id: "facility-9",
  name: "Nama Fasilitas Baru Anda",
  detail: "Spesifikasi Ringkas",
  desc: "Deskripsi singkat fasilitas baru...",
  image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-9.jpg`,
}
```
Tombol "Lihat Detail" secara otomatis akan langsung terhubung ke halaman detil baru Anda!
