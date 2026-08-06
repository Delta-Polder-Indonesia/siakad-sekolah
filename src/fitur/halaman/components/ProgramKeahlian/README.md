# Panduan Menambahkan/Mengubah Halaman Detail Program Keahlian (Jurusan)

Folder ini menyimpan file-file detail untuk setiap program keahlian / jurusan di website portal siswa.

## Cara Menambah Jurusan Baru

Jika Anda ingin menambahkan jurusan baru dan menghubungkannya dengan tombol "Pelajari Selengkapnya", ikuti langkah-langkah berikut:

### 1. Buat Komponen Detail Baru
Buat sebuah file baru di folder ini, misalnya `REG-08.tsx.tsx`.
Gunakan template komponen React standar. Contoh:
```tsx
import type { PageProps } from '../../types';

export default function Reg08Page({ onNavigate }: PageProps) {
  return (
    <div className="bg-white text-slate-950 font-sans min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={() => onNavigate?.('Program Keahlian')}
          className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950"
        >
          ← Kembali ke Program Keahlian
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Kode Kompetensi: REG-08
        </span>
        <h1 className="mt-2 text-2xl font-bold uppercase tracking-wide text-slate-950 leading-tight">
          Nama Jurusan Baru Anda
        </h1>
        <div className="my-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
          <img src="/placeholder-atau-link-gambar.jpg" className="h-full w-full object-cover" />
        </div>
        <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 text-justify space-y-4">
          <p>Tulis penjelasan lengkap kurikulum atau materi yang diajarkan di jurusan baru Anda di sini...</p>
        </div>
      </section>
    </div>
  );
}
```

### 2. Daftarkan NavItem Baru
Buka file `src/fitur/halaman/types.ts` dan tambahkan ID baru ke tipe `NavItem`.
```typescript
  // Halaman detail Program Keahlian
  | 'reg-01' | 'reg-02' | 'reg-03' | 'reg-04' | 'reg-05' | 'reg-06' | 'reg-07' | 'reg-08'
```

### 3. Daftarkan Rute di ExpectationModal.tsx
Buka file `src/fitur/halaman/ExpectationModal.tsx`, kemudian:
1. Impor komponen baru di bagian atas file:
   ```typescript
   import Reg08Page from './components/ProgramKeahlian/REG-08.tsx';
   ```
2. Tambahkan case baru di dalam fungsi `renderPage()`:
   ```typescript
   case 'reg-08': return <Reg08Page {...props} />;
   ```

### 4. Hubungkan Data di ProgramKeahlianPage.tsx
Buka file `src/fitur/halaman/pages/ProgramKeahlianPage.tsx` dan tambahkan data jurusan baru ke dalam array `majors`:
```typescript
{
  id: "reg-08",
  name: "Nama Jurusan Baru Anda",
  desc: "Deskripsi singkat jurusan...",
  image: `${import.meta.env.BASE_URL}images/HalamanKami/ProgramKeahlian/sekolah-8.jpg`,
}
```
Tombol "Pelajari Selengkapnya" secara otomatis akan langsung terhubung ke halaman detil baru Anda!
