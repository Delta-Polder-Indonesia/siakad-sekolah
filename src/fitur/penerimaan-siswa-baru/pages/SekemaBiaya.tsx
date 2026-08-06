export default function SekemaBiaya() {
  const alurPembayaran = [
    'Pengumuman Diterima',
    'Tagihan Resmi Sekolah',
    'Pilih Metode Bayar',
    'Simpan Bukti Bayar',
    'Validasi Bendahara',
    'Status Lunas',
  ];

  const paymentItems = [
    {
      title: 'Pendaftaran Online',
      summary: 'Umumnya gratis untuk sekolah negeri.',
      detail:
        'Portal PPDB tidak menarik biaya untuk submit formulir pada sekolah negeri. Jika ada pungutan, pastikan ada dasar surat resmi dari sekolah/panitia.',
    },
    {
      title: 'Daftar Ulang',
      summary: 'Muncul setelah peserta dinyatakan diterima.',
      detail:
        'Komponen bisa mencakup seragam, atribut, kegiatan awal tahun, atau komite sesuai kebijakan masing-masing sekolah. Selalu minta rincian resmi tertulis.',
    },
    {
      title: 'Metode Pembayaran',
      summary: 'Gunakan jalur pembayaran resmi sekolah.',
      detail:
        'Pembayaran biasanya melalui virtual account, transfer bank mitra, atau kasir sekolah. Hindari transaksi di luar kanal resmi untuk mencegah risiko penipuan.',
    },
    {
      title: 'Dokumen Pembayaran',
      summary: 'Bukti bayar harus disimpan sampai proses selesai.',
      detail:
        'Simpan bukti transfer, mutasi, atau kwitansi asli. Dokumen ini diperlukan saat validasi bendahara, audit internal, atau saat terjadi selisih data pembayaran.',
    },
    {
      title: 'Peringatan Keamanan',
      summary: 'Jangan transfer ke rekening pribadi.',
      detail:
        'Pembayaran hanya ke rekening resmi sekolah/instansi. Konfirmasi nama penerima, nomor rekening, dan referensi pembayaran sebelum transaksi dilakukan.',
    },
  ];

  const faqItems = [
    {
      q: 'Jika terdapat kekeliruan input NIK atau nama, apakah bisa diperbaiki?',
      a: 'Bisa disesuaikan kembali selama masa rentang waktu validasi verifikasi fisik berkas belum ditutup oleh panitia sekolah tujuan dengan membawa bukti akta asli.',
    },
    {
      q: 'Apakah pendaftar wajib hadir ke sekolah setelah submit formulir online?',
      a: 'Benar, kehadiran fisik mutlak diperlukan untuk mencocokkan dokumen digital dengan fisik berkas asli siswa.',
    },
    {
      q: 'Bagaimana jika berkas pas foto belum lengkap diunggah?',
      a: 'Anda tetap disarankan mengunggah dokumen yang tersedia terlebih dahulu, lalu melengkapinya kembali sebelum batas tenggat verifikasi berakhir.',
    },
    {
      q: 'Bagaimana cara memastikan status transaksi pembayaran telah lunas?',
      a: 'Silakan lakukan pengecekan berkala pada menu dasbor akun pendaftaran Anda atau serahkan struk mutasi bank resmi pada bagian bendahara komite.',
    },
  ];

  return (
    <div className="animate-fadeIn min-h-screen bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      {/* Wadah Utama Menyerupai Lembar Halaman Dokumen Resmi */}
      <div className="mx-auto max-w-4xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm sm:p-12 md:p-16">
        {/* ── BAGIAN I: SKEMA BIAYA & DAFTAR ULANG ── */}
        <div className="space-y-10">
          {/* Header Dokumen (Center Atas) */}
          <div className="mx-auto mb-8 max-w-3xl space-y-3 border-b-2 border-slate-950 pb-8 text-center">
            <span className="block text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
              Rincian Keuangan
            </span>
            <h1 className="text-[20px] font-bold tracking-tight text-slate-950 min-[480px]:text-[22px] md:text-[24px]">
              Skema Biaya &amp; Administrasi Daftar Ulang
            </h1>
            <p className="text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
              Sistem informasi keterbukaan pembiayaan administrasi. Harap mengacu pada keputusan
              final komite masing-masing sekolah.
            </p>
          </div>

          {/* Diagram Alur Prosedur Pembayaran */}
          <div className="border-b border-slate-200 pb-8">
            <p className="mb-4 text-xs font-bold tracking-wider text-slate-950 uppercase">
              ■ Tata Alur Transaksi Pembiayaan:
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-3 border border-slate-200 bg-slate-50 p-4">
              {alurPembayaran.map((item, idx) => (
                <div key={item} className="flex items-center gap-x-2">
                  <div className="border border-slate-400 bg-white px-3 py-1 text-[13px] font-bold text-slate-950">
                    {item}
                  </div>
                  {idx < alurPembayaran.length - 1 && (
                    <span className="text-xs font-bold text-slate-400">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Daftar Ketentuan Biaya (Skala Teks Sesuai Gambar Referensi) */}
          <div className="space-y-0">
            {paymentItems.map((item, idx) => (
              <div
                key={item.title}
                className="grid gap-6 border-t border-slate-200 py-8 last:border-b last:border-slate-200 md:grid-cols-3"
              >
                {/* KIRI: Judul Komponen */}
                <div className="md:col-span-1">
                  <span className="mb-1 block text-xs font-bold text-slate-400">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <h3 className="text-[20px] leading-snug font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-slate-500 italic">
                    {item.summary}
                  </p>
                </div>

                {/* KANAN: Penjelasan Teknis */}
                <div className="flex items-center md:col-span-2">
                  <p className="w-full border-l-2 border-slate-900 py-1 pl-4 text-[16px] leading-relaxed text-slate-800">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BAGIAN II: FAQ / PERTANYAAN UMUM ── */}
        <div className="mt-16 space-y-10 border-t-2 border-slate-950 pt-16">
          {/* Header Sub-Bagian FAQ */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
              Rubrik Interaktif
            </span>
            <h2 className="text-[22px] font-bold tracking-tight text-slate-950">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          {/* Daftar Item FAQ (Skala Teks Sesuai Gambar Referensi) */}
          <div className="space-y-0">
            {faqItems.map((item, idx) => (
              <div
                key={item.q}
                className="grid gap-6 border-t border-slate-200 py-8 last:border-b last:border-slate-200 md:grid-cols-3"
              >
                {/* KIRI: Pertanyaan (Menggunakan Ukuran Judul Referensi) */}
                <div className="md:col-span-1">
                  <span className="mb-1 block text-xs font-bold text-slate-400">
                    Pertanyaan {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <h3 className="text-[20px] leading-snug font-bold text-slate-950">{item.q}</h3>
                </div>

                {/* KANAN: Jawaban (Menggunakan Ukuran Teks Isi Referensi) */}
                <div className="flex items-center md:col-span-2">
                  <p className="w-full border-l-2 border-slate-400 bg-slate-50/50 py-2 pl-4 text-[16px] leading-relaxed text-slate-800">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
