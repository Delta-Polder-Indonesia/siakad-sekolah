export default function InformasiPPDB() {
  return (
    <div className="animate-fadeIn min-h-screen bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      {/* Wadah Utama Menyerupai Lembar Halaman Dokumen Korporat */}
      <div className="mx-auto max-w-4xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm sm:p-12 md:p-16">
        {/* Header Dokumen / Judul Utama */}
        <div className="mx-auto max-w-3xl space-y-3 border-b-2 border-slate-950 pb-8 text-center">
          <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Pilihan Jenjang
          </span>
          <h1 className="text-[20px] font-bold tracking-tight text-slate-950 min-[480px]:text-[22px] md:text-[24px]">
            Jenjang Pendidikan & Persyaratan Pelaksanaan PPDB
          </h1>
          <p className="text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
            Pendaftaran sistem nasional ini tersedia secara serentak untuk seluruh jenjang
            pendidikan dasar dan menengah. Perhatikan detail regulasi persyaratan masing-masing
            jenjang di bawah ini.
          </p>
        </div>

        {/* Informasi Dasar Hukum & Layanan Meta Dokumen */}
        <div className="mb-10 grid gap-4 border-b border-slate-200 py-4 text-[14px] md:grid-cols-3">
          <p className="font-semibold text-slate-800">
            │ Dasar Hukum: Permendikbud tentang PPDB Tahun Berjalan
          </p>
          <p className="font-semibold text-slate-800">
            │ Layanan Bantuan: Senin – Jumat 08.00 – 16.00
          </p>
          <p className="font-semibold text-slate-800">
            │ Dokumen diproses secara digital dan terarsip aman
          </p>
        </div>

        {/* Isi Dokumen / Detail Regulasi Per Jenjang */}
        <div className="space-y-12">
          {/* JENJANG SD */}
          <div className="pb-4">
            <div className="mb-4 flex items-baseline space-x-3 border-b border-slate-200 pb-2">
              <h2 className="text-lg font-bold text-slate-950">1. Sekolah Dasar (SD)</h2>
              <span className="text-xs font-semibold text-slate-500">
                Rentang usia masuk minimal 6–12 tahun
              </span>
            </div>

            <h3 className="mb-3 text-[20px] leading-snug font-bold text-slate-950">
              Calon peserta didik baru kelas 1 (satu) SD harus memenuhi persyaratan usia:
            </h3>

            <div className="space-y-3 text-[16px] leading-relaxed text-slate-900">
              <ol className="list-decimal space-y-2 pl-5">
                <li>7 (tujuh) tahun; atau</li>
                <li>paling rendah 6 (enam) tahun pada tanggal 1 Juli tahun berjalan.</li>
                <li>
                  Dalam pelaksanaan PPDB, SD memprioritaskan penerimaan calon peserta didik baru
                  kelas 1 (satu) SD yang berusia 7 (tujuh) tahun.
                </li>
                <li>
                  Persyaratan usia paling rendah sebagaimana dimaksud pada huruf 2 dapat
                  dikecualikan menjadi paling rendah 5 (lima) tahun 6 (enam) bulan pada tanggal 1
                  Juli tahun berjalan bagi calon peserta didik yang memiliki:
                  <ul className="mt-1 list-disc space-y-1 pl-6 font-normal text-slate-800">
                    <li>kecerdasan dan/atau bakat istimewa; dan</li>
                    <li>kesiapan psikis.</li>
                  </ul>
                </li>
                <li>
                  Calon peserta didik yang memiliki kecerdasan dan/atau bakat istimewa dan kesiapan
                  psikis sebagaimana dimaksud pada huruf 4 dibuktikan dengan rekomendasi tertulis
                  dari psikolog profesional.
                </li>
                <li>
                  Dalam hal psikolog profesional sebagaimana dimaksud pada huruf 5 tidak tersedia,
                  rekomendasi dapat dilakukan oleh Dewan Guru Sekolah yang bersangkutan.
                </li>
                <li>
                  Calon peserta didik baru penyandang disabilitas dikecualikan dari ketentuan
                  persyaratan:
                  <ul className="mt-1 list-disc space-y-1 pl-6 font-normal text-slate-800">
                    <li>batas usia; dan</li>
                    <li>ijazah atau dokumen lain yang menyatakan kelulusan.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>

          {/* JENJANG SMP */}
          <div className="pb-4">
            <div className="mb-4 flex items-baseline space-x-3 border-b border-slate-200 pb-2">
              <h2 className="text-lg font-bold text-slate-950">
                2. Sekolah Menengah Pertama (SMP)
              </h2>
              <span className="text-xs font-semibold text-slate-500">Usia maksimal 15 tahun</span>
            </div>

            <h3 className="mb-3 text-[20px] leading-snug font-bold text-slate-950">
              Calon peserta didik baru kelas 7 (tujuh) SMP harus memenuhi persyaratan utama:
            </h3>

            <div className="space-y-3 text-[16px] leading-relaxed text-slate-900">
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Berusia paling tinggi 15 (lima belas) tahun pada tanggal 1 Juli tahun berjalan.
                </li>
                <li>Telah menyelesaikan kelas 6 (enam) SD atau bentuk lain yang sederajat.</li>
                <li>
                  Persyaratan kelulusan sebagaimana dimaksud wajib dibuktikan dengan ijazah atau
                  dokumen resmi lain yang menyatakan kelulusan dari satuan pendidikan asal.
                </li>
                <li>
                  Calon peserta didik baru penyandang disabilitas di jenjang SMP dikecualikan dari
                  ketentuan persyaratan:
                  <ul className="mt-1 list-disc space-y-1 pl-6 font-normal text-slate-800">
                    <li>batas usia; dan</li>
                    <li>ijazah atau dokumen lain yang menyatakan kelulusan.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>

          {/* JENJANG SMA */}
          <div className="pb-4">
            <div className="mb-4 flex items-baseline space-x-3 border-b border-slate-200 pb-2">
              <h2 className="text-lg font-bold text-slate-950">3. Sekolah Menengah Atas (SMA)</h2>
              <span className="text-xs font-semibold text-slate-500">
                Pendidikan menengah umum usia 15–18 tahun
              </span>
            </div>

            <h3 className="mb-3 text-[20px] leading-snug font-bold text-slate-950">
              Calon peserta didik baru kelas 10 (sepuluh) SMA harus memenuhi persyaratan utama:
            </h3>

            <div className="space-y-3 text-[16px] leading-relaxed text-slate-900">
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Berusia paling tinggi 21 (dua puluh satu) tahun pada tanggal 1 Juli tahun
                  berjalan.
                </li>
                <li>Telah menyelesaikan kelas 9 (sembilan) SMP atau bentuk lain yang sederajat.</li>
                <li>
                  Persyaratan kelulusan dibuktikan dengan dokumen resmi ijazah atau sertifikat
                  kelulusan yang setara dari sekolah asal.
                </li>
                <li>
                  Calon peserta didik baru penyandang disabilitas di jenjang SMA dikecualikan dari
                  ketentuan persyaratan:
                  <ul className="mt-1 list-disc space-y-1 pl-6 font-normal text-slate-800">
                    <li>batas usia; dan</li>
                    <li>ijazah atau dokumen resmi pernyataan kelulusan.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>

          {/* JENJANG SMK */}
          <div className="pb-4">
            <div className="mb-4 flex items-baseline space-x-3 border-b border-slate-200 pb-2">
              <h2 className="text-lg font-bold text-slate-950">
                4. Sekolah Menengah Kejuruan (SMK)
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Pendidikan vokasi berorientasi kerja
              </span>
            </div>

            <h3 className="mb-3 text-[20px] leading-snug font-bold text-slate-950">
              Calon peserta didik baru kelas 10 (sepuluh) SMK harus memenuhi persyaratan utama:
            </h3>

            <div className="space-y-3 text-[16px] leading-relaxed text-slate-900">
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Berusia paling tinggi 21 (dua puluh satu) tahun pada tanggal 1 Juli tahun
                  berjalan.
                </li>
                <li>Telah menyelesaikan kelas 9 (sembilan) SMP atau bentuk lain yang sederajat.</li>
                <li>
                  Persyaratan kelulusan dibuktikan secara sah melalui dokumen ijazah atau surat
                  keterangan lulus yang setara.
                </li>
                <li>
                  Khusus jenjang SMK dengan bidang keahlian tertentu dapat menetapkan tambahan
                  persyaratan khusus mengenai kesesuaian fisik dan aspek teknis.
                </li>
                <li>
                  Calon peserta didik baru penyandang disabilitas di jenjang SMK dikecualikan dari
                  ketentuan persyaratan:
                  <ul className="mt-1 list-disc space-y-1 pl-6 font-normal text-slate-800">
                    <li>batas usia; dan</li>
                    <li>
                      ijazah atau dokumen resmi pernyataan kelulusan, dengan mempertimbangkan
                      karakteristik kompetensi keahlian terkait.
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Lampiran Dokumen / Agenda Kegiatan */}
        <div className="mt-12 grid gap-8 border-t-2 border-slate-950 pt-12 md:grid-cols-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Lampiran I
            </span>
            <h2 className="mt-1 text-xl font-bold text-slate-950">Jadwal Resmi Pelaksanaan</h2>
          </div>
          <div className="md:col-span-2">
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {[
                { name: 'Pendaftaran Akun & Pengisian Online', date: '01 Juni – 14 Juni 2026' },
                { name: 'Verifikasi Berkas Berkas Fisik', date: '15 Juni – 21 Juni 2026' },
                { name: 'Pengumuman Hasil Kelulusan Akhir', date: '25 Juni 2026' },
                { name: 'Tahapan Daftar Ulang di Sekolah Tujuan', date: '26 Juni – 30 Juni 2026' },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-4 text-[14px] md:text-[15px]"
                >
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="font-semibold whitespace-nowrap text-slate-700">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
