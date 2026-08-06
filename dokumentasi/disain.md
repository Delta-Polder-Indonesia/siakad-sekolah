==================================================
Tab Navigation / Button Group
==================================================

komponen Tab Navigation / Button Group menggunakan React dan Tailwind CSS dengan gaya desain **Neubrutalism Outlined / Minimalist Line Art**. 

Kriteria tampilan dan perilaku komponen:

1. **Tampilan Default (Inactive)**:
   - Background berwarna putih murni (`bg-white`).
   - Teks dan ikon berwarna hitam pekat (`text-black`).
   - Bingkai/Garis tepi tegas berwarna hitam dengan ketebalan 2px (`border-2 border-black`).
   - Sudut tombol sedikit melengkung halus (`rounded-md`).

2. **Tampilan Saat Dipilih / Diklik (Active State)**:
   - Warna background dan warna teks TETAP putih dan hitam (tidak berubah warna isi).
   - HANYA garis tepi/bingkai yang berubah menjadi warna biru tegas (`border-blue-600`).

3. **Tampilan Hover**:
   - Berikan sedikit efek highlight abu-abu tipis saat kursor di atas tombol (`hover:bg-neutral-100`).

4. **Tata Letak (Layout)**:
   - Tersusun rapi dalam grid yang responsif.
   - Posisi ikon dan teks berada di tengah (centered) secara horizontal dan vertikal.
   - Menggunakan TypeScript dan Tailwind CSS secara lengkap.
