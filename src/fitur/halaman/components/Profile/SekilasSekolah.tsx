import {
  akreditasi,
  identitasSekolah,
  kurikulum,
  programPeminatan,
  programSpesialisasi,
  ringkasanSekolah,
  rombonganBelajar,
  siswaAktif,
  tahunBerdiri,
  namaSekolah,
  namaJenjang,
  jenjang,
  kota,
  provinsi,
  isSmk,
} from './dataSekolah';

export default function SekilasSekolah() {
  const programDesc = isSmk
    ? `${programPeminatan} program keahlian utama: Teknik Komputer dan Jaringan, Rekayasa Perangkat Lunak, Teknik Elektronika, Akuntansi dan Keuangan, Otomatisasi dan Tata Kelola Perkantoran, Pemasaran, serta Perhotelan.`
    : `${programPeminatan} program peminatan utama: Matematika dan Ilmu Pengetahuan Alam (MIPA), Ilmu Pengetahuan Sosial (IPS), serta Bahasa dan Budaya.`;

  return (
    <div className="bg-white font-serif">
      {/* HERO */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-4 md:px-12 md:pt-10">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Sekilas Sekolah</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-700">
          Profil singkat, identitas, dan gambaran umum {namaSekolah} sebagai institusi{' '}
          {namaJenjang[jenjang].toLowerCase()} yang unggul dan berdaya saing.
        </p>
      </div>

      {/* NARASI SEKILAS */}
      <div className="mx-auto max-w-6xl px-6 pt-10 md:px-12 md:pt-12">
        <article className="text-justify text-[15px] leading-relaxed text-slate-800">
          <p className="mb-4">
            {namaSekolah} senantiasa memegang teguh komitmen untuk menyelenggarakan pendidikan{' '}
            {namaJenjang[jenjang].toLowerCase()} yang berkualitas, unggul, dan berdaya saing dalam
            rangka mendukung terciptanya sumber daya manusia yang cerdas dan berkarakter. Berdiri
            sejak tahun {tahunBerdiri}, {namaSekolah} telah menjadi salah satu institusi pendidikan
            tertua dan paling terkemuka di {kota}, Provinsi {provinsi}.
          </p>

          <p className="mb-4">
            Sebagai sekolah dengan akreditasi {akreditasi} dari Badan Akreditasi Nasional
            Sekolah/Madrasah (BAN-S/M), {namaSekolah} konsisten menghadirkan proses pembelajaran
            yang mengintegrasikan nilai-nilai keagamaan, karakter kebangsaan, keunggulan akademik,
            serta kepedulian terhadap lingkungan hidup. Kurikulum yang diterapkan adalah {kurikulum}
            , yang memberikan ruang bagi pengembangan potensi peserta didik secara utuh sesuai bakat
            dan minatnya.
          </p>

          <p className="mb-4">
            Peran penting yang diemban oleh {namaSekolah} sekaligus menandai tonggak sejarah panjang
            perjalanan dunia pendidikan di {provinsi}. Selama lebih dari enam dekade, sekolah ini
            telah melahirkan puluhan ribu alumni yang tersebar di berbagai bidang profesi,
            akademisi, praktisi industri, birokrat, hingga tokoh masyarakat, baik di tingkat
            nasional maupun internasional.
          </p>

          <p className="mb-4">
            Kemampuan {namaSekolah} dalam mempertahankan mutu pendidikan dibangun di atas fondasi
            yang solid, meliputi tenaga pendidik profesional, tenaga kependidikan yang kompeten,
            sarana dan prasarana modern, serta dukungan komite sekolah dan pemerintah daerah yang
            konsisten. Saat ini sekolah melayani lebih dari {siswaAktif.toLocaleString('id-ID')}{' '}
            peserta didik yang terbagi dalam {rombonganBelajar} rombongan belajar dengan{' '}
            {programDesc}
          </p>

          <p className="mb-4">
            Dalam upaya menghadapi tantangan pendidikan abad ke-21, {namaSekolah} terus melakukan
            transformasi digital pada seluruh aspek penyelenggaraan pendidikan, mulai dari sistem
            informasi akademik, pembelajaran berbasis teknologi, hingga penyediaan fasilitas
            laboratorium komputer, jaringan fiber optic, serta ruang kelas multimedia yang mendukung
            metode pembelajaran interaktif.
          </p>

          <p>
            Komitmen kami tidak hanya berhenti pada pencapaian akademik, tetapi juga pada
            pembentukan karakter, jiwa kepemimpinan, dan kesadaran lingkungan. Melalui berbagai
            program intrakurikuler, kokurikuler, dan ekstrakurikuler yang variatif, peserta didik
            dibekali dengan kompetensi holistik agar siap menghadapi jenjang pendidikan tinggi
            maupun dunia kerja di masa depan.
          </p>
        </article>
      </div>

      {/* STATISTIK RINGKASAN */}
      <div className="mx-auto max-w-6xl px-6 pt-12 md:px-12 md:pt-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {ringkasanSekolah.map((item, index) => (
            <div key={index} className="border border-slate-200 bg-white px-6 py-6 text-center">
              <div className="text-3xl font-bold text-slate-900 md:text-4xl">{item.value}</div>
              <div className="mt-2 text-[13px] font-medium tracking-wide text-slate-600 uppercase">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IDENTITAS SEKOLAH */}
      <div className="mx-auto max-w-6xl px-6 pt-14 md:px-12 md:pt-16">
        <h3 className="mb-6 text-2xl font-bold text-slate-900 md:text-[26px]">Identitas Sekolah</h3>

        <div className="border-t border-slate-200">
          {identitasSekolah.map((item, index) => (
            <div
              key={index}
              className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3"
            >
              <span className="text-[15px] text-slate-600">{item.label}</span>
              <span className="text-right text-[15px] font-semibold text-slate-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO IMAGE — FULL BLEED */}
      <section className="mt-14 mb-14 md:mt-20 md:mb-20">
        <figure className="w-full">
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-100">
            <img
              src={`${import.meta.env.BASE_URL}images/HalamanKami/profil/gedung-utama.jpg`}
              alt={`Gedung Utama ${namaSekolah}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const caption = (e.target as HTMLImageElement)
                  .closest('figure')
                  ?.querySelector('figcaption');
                if (caption) (caption as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <figcaption className="mx-auto max-w-6xl px-6 py-4 text-center text-[13px] text-slate-500 italic md:px-12">
            Gedung Utama {namaSekolah}, tampak depan.
          </figcaption>
        </figure>
      </section>
    </div>
  );
}
