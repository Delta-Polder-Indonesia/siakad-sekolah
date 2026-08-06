export default function JalurSeleksi() {
  const jalurData = [
    {
      id: 'zonasi',
      title: 'Jalur Zonasi',
      shortDesc: 'Pendaftaran berdasarkan wilayah domisili terdekat dengan sekolah tujuan.',
      intro:
        'Orang tua peserta didik melakukan proses pengajuan pendaftaran dengan menghubungi langsung Sekolah yang dituju dan atau melalui website ppdb milik sekolah melalui link https://e-ppdb.bulelengkab.go.id.',
      luring: [
        'fotokopi ijazah/surat keterangan lulus',
        'fotokopi KK/surat keterangan domisili',
        'fotokopi akta kelahiran/surat keterangan lahir',
        'surat pernyataan orang tua/wali',
      ],
      daring: [
        'hasil pindai / scan ijazah / surat keterangan lulus',
        'hasil pindai / scan kk / surat keterangan domisili',
        'hasil pindai / scan akta kelahiran / surat keterangan lahir',
        'hasil pindai / scan surat pernyataan orang tua / wali',
      ],
      notes: [
        'Orang tua peserta didik yang mendaftar secara daring dapat langsung mencetak tanda bukti pendaftaran dan pendaftaran secara luring menerima tanda bukti pengajuan pendaftaran dari panitia.',
        'Verifikasi dokumen dilakukan panitia Sekolah tujuan. Panitia memiliki kewenangan untuk menolak berkas disertai alasan; atau menerima (memverifikasi) bila sesuai.',
        'Orang tua peserta didik dapat melihat hasil seleksi sementara saat jadwal pengumuman tiba langsung di web sekolah maupun papan pengumuman yang telah disediakan.',
      ],
    },
    {
      id: 'afirmasi',
      title: 'Jalur Afirmasi',
      shortDesc: 'Kuota khusus bagi peserta dari keluarga ekonomi kurang mampu (DTKS/KIP).',
      intro:
        'Orang tua peserta didik melakukan proses pengajuan pendaftaran dengan menghubungi langsung Sekolah yang dituju dan atau melalui website ppdb milik sekolah melalui link https://e-ppdb.bulelengkab.go.id.',
      luring: [
        'fotokopi ijazah/surat keterangan lulus',
        'fotokopi KK/asli surat keterangan domisili',
        'fotokopi akta kelahiran/surat keterangan lahir',
        'surat pernyataan orang tua/wali',
        'Fotokopi Kartu Keluarga Sejahtera (KKS)/Kartu Perlindungan Sosial (KPS)/Kartu Keluarga Harapan (KKH)/Kartu Indonesia Pintar (KIP)/Kartu Indonesia Sehat (BPJS KIS) penerima bantuan iuran Pemerintah Pusat/Daerah yang dibuktikan dengan Surat Terdaftar pada Basis Data Terpadu Kesejahteraan Sosial (DTKS) dari desa/kelurahan',
      ],
      daring: [
        'hasil pindai / scan ijazah / surat keterangan lulus',
        'hasil pindai / scan kk / surat keterangan domisili',
        'hasil pindai / scan akta kelahiran / surat keterangan lahir',
        'hasil pindai / scan surat pernyataan orang tua / wali',
        'hasil pindai / scan Surat DTKS',
      ],
      notes: [
        'Orang tua peserta didik yang mendaftar secara daring dapat langsung mencetak tanda bukti pendaftaran dan pendaftaran secara luring menerima tanda bukti pengajuan pendaftaran dari panitia.',
        'Verifikasi dokumen dilakukan panitia Sekolah tujuan. Panitia memiliki kewenangan untuk menolak berkas disertai alasan; atau menerima (memverifikasi) bila sesuai.',
        'Orang tua peserta didik dapat melihat hasil seleksi sementara saat jadwal pengumuman tiba langsung di web sekolah maupun papan pengumuman yang telah disediakan.',
      ],
    },
    {
      id: 'pindahan',
      title: 'Jalur Perpindahan Tugas Orang Tua/Wali',
      shortDesc: 'Akomodasi perpindahan domisili karena tugas resmi instansi.',
      intro:
        'Orang tua peserta didik melakukan proses pengajuan pendaftaran dengan menghubungi langsung Sekolah yang dituju dan atau melalui website ppdb milik sekolah melalui link https://e-ppdb.bulelengkab.go.id.',
      luring: [
        'fotokopi ijazah/surat keterangan lulus',
        'surat penugasan dari instansi tempat bekerja',
        'surat keterangan tempat tinggal orang tua/wali dari instansi/lembaga/kantor/perusahaan yang mempekerjakan dan diketahui lurah/perbekel',
        'fotokopi akta kelahiran/surat keterangan lahir',
        'surat pernyataan orang tua/wali',
      ],
      daring: [
        'hasil pindai / scan ijazah / surat keterangan lulus',
        'hasil pindai / scan surat penugasan dari instansi tempat bekerja',
        'hasil pindai / scan surat keterangan tempat tinggal orang tua/wali dari instansi/lembaga/kantor/perusahaan yang mempekerjakan dan diketahui lurah/perbekel',
        'hasil pindai / scan akta kelahiran/surat keterangan lahir',
        'hasil pindai / scan surat pernyataan orang tua/wali',
      ],
      notes: [
        'Orang tua peserta didik yang mendaftar secara daring dapat langsung mencetak tanda bukti pendaftaran dan pendaftaran secara luring menerima tanda bukti pengajuan pendaftaran dari panitia.',
        'Verifikasi dokumen dilakukan panitia sekolah tujuan. Panitia memiliki kewenangan untuk menolak berkas disertai alasan; atau menerima (memverifikasi) bila sesuai.',
        'Orang tua peserta didik dapat melihat hasil seleksi sementara saat jadwal pengumuman tiba langsung di web sekolah maupun papan pengumuman yang telah disediakan.',
      ],
    },
  ];

  return (
    <div className="animate-fadeIn min-h-screen bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      {/* Wadah Utama Menyerupai Lembar Halaman Dokumen Resmi */}
      <div className="mx-auto max-w-4xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm sm:p-12 md:p-16">
        {/* ── HEADER DOKUMEN (Center Atas) ── */}
        <div className="mx-auto mb-10 max-w-3xl space-y-3 border-b-2 border-slate-950 pb-8 text-center">
          <span className="block text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Metode Validasi
          </span>
          <h2 className="text-[20px] font-bold tracking-tight text-slate-950 min-[480px]:text-[22px] md:text-[24px]">
            Skema &amp; Jalur Seleksi Nasional
          </h2>
          <p className="text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
            Pastikan Anda memilih jenis jalur seleksi yang sesuai dengan dokumen kelengkapan
            pendukung yang Anda miliki saat ini.
          </p>
        </div>

        {/* ── DAFTAR JALUR SELEKSI (Skala Teks Diperbesar Sesuai Gambar Referensi) ── */}
        <div className="space-y-12">
          {jalurData.map((item, idx) => (
            <div key={item.id} className="border-b border-slate-200 pb-10 last:border-0 last:pb-0">
              {/* Bagian Judul Utama Jalur (Menggunakan Skala 20px Bold Sesuai Referensi) */}
              <div className="mb-4 flex items-baseline space-x-2 border-b border-slate-100 pb-2">
                <span className="text-sm font-bold text-slate-400">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                <h3 className="text-[20px] leading-snug font-bold text-slate-950">{item.title}</h3>
              </div>

              {/* Deskripsi Singkat Jalur */}
              <p className="mb-6 text-[16px] leading-relaxed text-slate-500 italic">
                {item.shortDesc}
              </p>

              {/* Konten Detail / Penjelasan Dokumen Persyaratan (16px Normal) */}
              <div className="max-w-5xl space-y-6 text-[16px] leading-relaxed text-slate-900">
                <p className="font-medium text-slate-800">{item.intro}</p>

                {/* Sub-bagian: Pendaftaran Luring */}
                <div>
                  <p className="mb-3 text-xs font-bold tracking-wider text-slate-950 uppercase">
                    ■ Persyaratan Pendaftaran Luring (Offline)
                  </p>
                  <ul className="space-y-2">
                    {item.luring.map((doc, i) => (
                      <li
                        key={i}
                        className="border-l-2 border-slate-300 pl-4 text-[16px] leading-relaxed text-slate-800"
                      >
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sub-bagian: Pendaftaran Daring */}
                <div>
                  <p className="mb-3 text-xs font-bold tracking-wider text-slate-950 uppercase">
                    ■ Persyaratan Pendaftaran Daring (Online)
                  </p>
                  <ul className="space-y-2">
                    {item.daring.map((doc, i) => (
                      <li
                        key={i}
                        className="border-l-2 border-slate-300 pl-4 text-[16px] leading-relaxed text-slate-800"
                      >
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sub-bagian: Catatan Ketentuan Resmi */}
                <div className="pt-2">
                  <p className="mb-3 text-xs font-bold tracking-wider text-slate-950 uppercase">
                    Catatan Penting Pelaksanaan:
                  </p>
                  <div className="space-y-3 border border-slate-200 bg-slate-50 p-4">
                    {item.notes.map((note, i) => (
                      <p key={i} className="text-[15px] leading-relaxed text-slate-700">
                        {i + 1}. {note}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
