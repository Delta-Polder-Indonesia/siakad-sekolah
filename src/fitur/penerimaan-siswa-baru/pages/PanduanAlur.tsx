export default function PanduanAlur() {
  const alurPendaftaran = [
    'Registrasi Akun',
    'Isi Formulir',
    'Unggah Berkas',
    'Verifikasi Sekolah',
    'Pengumuman',
    'Daftar Ulang',
  ];

  return (
    <div className="animate-fadeIn min-h-screen bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      {/* Wadah Utama Menyerupai Lembar Halaman Dokumen Resmi */}
      <div className="mx-auto max-w-4xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm sm:p-12 md:p-16">
        {/* ── HEADER DOKUMEN (Center Atas) ── */}
        <div className="mx-auto mb-10 max-w-3xl space-y-3 border-b-2 border-slate-950 pb-8 text-center">
          <span className="block text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Langkah Operasional
          </span>
          <h1 className="text-[20px] font-bold tracking-tight text-slate-950 min-[480px]:text-[22px] md:text-[24px]">
            Tata Cara & Panduan Alur Pendaftaran PPDB
          </h1>
          <p className="text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
            Urutan proses sistemis yang wajib dipenuhi oleh orang tua atau wali murid secara runtut
            demi validitas data berkas pendaftaran.
          </p>
        </div>

        {/* ── INFORMASI UTAMA & DIAGRAM (Struktur Lembar Resmi) ── */}
        <div className="mb-10 space-y-8">
          {/* Catatan / Maklumat Resmi */}
          <div className="border-l-4 border-slate-900 bg-slate-50 p-5 text-[16px] leading-relaxed text-slate-900">
            <p className="mb-1 font-bold text-slate-950">
              💡 Informasi Penting untuk Orang Tua / Wali:
            </p>
            <p>
              Proses pengisian dilakukan satu pintu secara online. Pastikan koneksi internet stabil
              dan data yang dimasukkan akurat sesuai akta resmi untuk mencegah penolakan sistem pada
              tahap verifikasi manual oleh operator.
            </p>
          </div>

          {/* Diagram Alur Berbentuk Baris Dokumen Minimalis (Tanpa Card AI) */}
          <div className="border-t border-b border-slate-200 py-6">
            <p className="mb-4 text-center text-xs font-bold tracking-wider text-slate-950 uppercase sm:text-left">
              ■ Skema Rangkaian Prosedur:
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {alurPendaftaran.map((item, idx) => (
                <div
                  key={item}
                  className="border border-slate-200 bg-white p-3 text-center text-[14px] font-medium text-slate-900"
                >
                  <span className="mb-1 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Tahap {idx + 1}
                  </span>
                  <p className="leading-tight font-bold text-slate-950">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DETAIL PENJELASAN PROSEDUR (Ukuran Teks Diperbesar 16px Sesuai Referensi Gambar) ── */}
        <div className="space-y-6">
          <p className="text-xs font-bold tracking-wider text-slate-950 uppercase">
            Detail Ketentuan Pelaksanaan Langkah Pendaftaran:
          </p>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {[
              {
                title: 'Registrasi Akun Pendaftar',
                detail:
                  'Membuat kombinasi user ID dan kata sandi akses pada portal utama menggunakan nomor induk kependudukan (NIK) siswa yang valid.',
              },
              {
                title: 'Pengisian Formulir Administratif',
                detail:
                  'Melengkapi berkas data diri secara utuh, riwayat nilai rapor, koordinat titik lokasi alamat domisili, beserta pilihan instansi sekolah tujuan.',
              },
              {
                title: 'Unggah Berkas Pendukung Digital',
                detail:
                  'Mengirimkan hasil scan berkas fisik (KK, Akta Kelahiran, SKL) dalam format dokumen pdf/jpg dengan resolusi tinggi yang terbaca jelas.',
              },
              {
                title: 'Penerbitan Kartu Nomor Registrasi',
                detail:
                  'Sistem mengeluarkan tanda bukti cetak formulir pendaftaran resmi yang memuat kode enkripsi untuk keperluan verifikasi fisik.',
              },
              {
                title: 'Validasi Berkas oleh Panitia',
                detail:
                  'Petugas operator sekolah memeriksa keselarasan dan keabsahan dokumen online dengan berkas asli yang dibawa oleh pihak pendaftar.',
              },
              {
                title: 'Pengumuman Kelulusan & Daftar Ulang',
                detail:
                  'Melihat status penetapan final kelulusan pada tanggal yang ditentukan dan melakukan konfirmasi kesediaan hak bangku sekolah baru.',
              },
            ].map((item, idx) => (
              <div key={item.title} className="max-w-5xl py-5">
                {/* Ukuran Sub-Judul: 20px Bold (Sesuai Referensi Gambar) */}
                <h3 className="mb-2 text-[20px] leading-snug font-bold text-slate-950">
                  {idx + 1}. {item.title}
                </h3>
                {/* Ukuran Teks Isi: 16px Normal (Sesuai Referensi Gambar) */}
                <p className="pl-6 text-[16px] leading-relaxed text-slate-800">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
