import { namaSekolah } from './dataSekolah';
const visi = {
  statement:
    'Terwujudnya generasi yang beriman, bertaqwa, berilmu, berbudi luhur, serta unggul dalam prestasi dan berwawasan lingkungan.',
  penjelasan: `${namaSekolah} berkomitmen menjadi institusi pendidikan menengah atas yang unggul dan berdaya saing, dengan tetap berpijak pada nilai-nilai keagamaan, karakter kebangsaan, serta kepedulian terhadap lingkungan. Visi ini menjadi arah pengembangan seluruh program pendidikan dan pengelolaan sekolah secara berkelanjutan.`,
  pilar: [
    'Iman dan Taqwa: membangun landasan spiritual yang kuat sebagai fondasi karakter peserta didik.',
    'Keunggulan Akademik: mendorong pencapaian prestasi akademik dan non-akademik pada tingkat lokal, nasional, hingga internasional.',
    'Wawasan Lingkungan: menanamkan kesadaran dan kepedulian terhadap pelestarian lingkungan sebagai bagian dari gaya hidup.',
  ],
};

const misi = {
  statement:
    'Menyelenggarakan pendidikan berkualitas yang mengintegrasikan iman, ilmu, dan amal untuk membentuk generasi unggul.',
  penjelasan:
    'Misi sekolah dirumuskan sebagai langkah-langkah strategis dan operasional untuk mewujudkan visi institusi secara berkelanjutan. Setiap butir misi mencerminkan komitmen kami dalam menjaga mutu pendidikan, pengembangan sumber daya manusia, serta pemberdayaan seluruh warga sekolah.',
  poin: [
    'Mengimplementasikan iman dan taqwa dalam kehidupan sehari-hari.',
    'Mengoptimalkan pembiasaan sikap dan perilaku yang terpadu.',
    'Mengembangkan pembelajaran yang aktif, kreatif, efektif, dan menyenangkan dengan berbasis ICT.',
    'Meraih prestasi melalui pengembangan bakat, minat dan kreativitas siswa dalam kegiatan intra dan ekstrakurikuler.',
    'Meningkatkan kemampuan tenaga pendidik dan kependidikan yang profesional, inovatif, religius, dan menguasai IPTEK.',
    'Mewujudkan lingkungan sekolah yang bersih, rindang, asri, dan sehat untuk mendukung pembelajaran.',
    'Mengoptimalkan potensi sumber daya manusia, lingkungan, dan sarana sekolah.',
    'Mengembangkan jaringan kerja yang potensial, kontributif, dan berdaya guna baik dengan masyarakat, instansi pemerintah maupun swasta.',
    'Menyelenggarakan program pendidikan yang berakar pada nilai-nilai agama dan budaya masyarakat dengan tetap mengikuti perkembangan dunia luar.',
    'Menyelenggarakan program kegiatan yang mengarah kepada terwujudnya sekolah berbudaya lingkungan.',
  ],
};

const tujuan = {
  statement:
    'Mewujudkan lulusan yang berkarakter, berprestasi, dan siap menghadapi tantangan masa depan dengan berlandaskan iman dan taqwa.',
  penjelasan:
    'Tujuan sekolah merupakan penjabaran operasional dari visi dan misi yang menggambarkan target capaian pendidikan secara terukur. Setiap butir tujuan dirancang untuk membentuk profil lulusan yang unggul secara akademik, matang secara spiritual, serta memiliki kepekaan sosial dan lingkungan.',
  poin: [
    "Membentuk peserta didik yang terbiasa berdo'a sebelum dan sesudah pembelajaran serta melaksanakan kegiatan keagamaan secara konsisten.",
    'Menghasilkan lulusan yang memiliki akhlak mulia, berkepribadian luhur, dan menjunjung tinggi nilai-nilai kebangsaan.',
    'Mencapai tingkat kelulusan 100% dengan rata-rata nilai yang meningkat setiap tahun serta peningkatan jumlah lulusan yang diterima di perguruan tinggi negeri favorit.',
    'Mewujudkan peserta didik yang mampu berkomunikasi aktif menggunakan Bahasa Indonesia dan Bahasa Inggris dalam kehidupan sehari-hari.',
    'Meraih prestasi akademik dan non-akademik pada tingkat kabupaten, provinsi, nasional, hingga internasional melalui olimpiade sains, seni, dan olahraga.',
    'Mengembangkan keterampilan peserta didik dalam pemanfaatan teknologi informasi dan komunikasi sebagai bekal menghadapi era digital.',
    'Menciptakan budaya sekolah yang menjunjung tinggi keamanan, ketertiban, kebersihan, kerindangan, keindahan, kesehatan, dan kekeluargaan (7K).',
    'Membangun tenaga pendidik dan kependidikan yang profesional, kompeten, serta menguasai perkembangan IPTEK terkini.',
    'Mewujudkan sekolah sebagai pusat pembelajaran berbasis lingkungan yang mendukung program Adiwiyata secara berkelanjutan.',
    'Mempersiapkan peserta didik menjadi pribadi yang mandiri, bernalar kritis, kreatif, dan siap berkontribusi di tengah masyarakat global.',
  ],
};

const tataNilai = {
  statement: 'Lima nilai dasar yang menjadi landasan perilaku seluruh warga sekolah.',
  penjelasan:
    'Tata nilai merupakan pedoman perilaku yang dianut dan dijunjung tinggi oleh seluruh pimpinan, tenaga pendidik, tenaga kependidikan, serta peserta didik dalam menjalankan setiap aktivitas di lingkungan sekolah.',
  nilai: [
    {
      judul: 'Integritas',
      deskripsi:
        'Menjunjung tinggi kejujuran, tanggung jawab, dan konsistensi antara ucapan dengan perbuatan dalam setiap aspek kehidupan sekolah.',
    },
    {
      judul: 'Profesional',
      deskripsi:
        'Menjalankan tugas dan tanggung jawab dengan kompetensi, disiplin, dan komitmen terhadap standar mutu pendidikan.',
    },
    {
      judul: 'Inovatif',
      deskripsi:
        'Terbuka terhadap gagasan baru, kreatif dalam mencari solusi, dan adaptif terhadap perkembangan ilmu pengetahuan dan teknologi.',
    },
    {
      judul: 'Kolaboratif',
      deskripsi:
        'Membangun sinergi antar warga sekolah, orang tua, dan masyarakat untuk mencapai tujuan pendidikan bersama.',
    },
    {
      judul: 'Berwawasan Lingkungan',
      deskripsi:
        'Peduli terhadap kelestarian lingkungan dan menerapkan budaya hidup bersih, sehat, serta berkelanjutan.',
    },
  ],
};

export default function VisiMisi() {
  return (
    <div className="bg-white font-serif">
      {/* HERO */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-4 md:px-12 md:pt-10">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Visi, Misi, Tujuan, dan Tata Nilai
        </h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-700">
          Landasan filosofi sekolah yang menjadi pedoman dalam penyelenggaraan pendidikan dan
          pembentukan karakter peserta didik di {namaSekolah}.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        {/* VISI */}
        <section className="pt-10 md:pt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">Visi Sekolah</h3>

          <p className="text-justify text-[15px] leading-relaxed text-slate-800">
            {visi.statement}
          </p>

          <p className="mt-4 text-justify text-[15px] leading-relaxed text-slate-700">
            {visi.penjelasan}
          </p>

          <ol className="mt-4 list-decimal pl-6">
            {visi.pilar.map((item, idx) => (
              <li key={idx} className="py-0.5 text-[15px] leading-relaxed text-slate-800">
                {item}
              </li>
            ))}
          </ol>
        </section>

        {/* MISI */}
        <section className="mt-10 md:mt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">Misi Sekolah</h3>

          <p className="text-justify text-[15px] leading-relaxed text-slate-800">
            {misi.statement}
          </p>

          <p className="mt-4 text-justify text-[15px] leading-relaxed text-slate-700">
            {misi.penjelasan}
          </p>

          <ol className="mt-4 list-decimal pl-6">
            {misi.poin.map((item, idx) => (
              <li key={idx} className="py-0.5 text-[15px] leading-relaxed text-slate-800">
                {item}
              </li>
            ))}
          </ol>
        </section>

        {/* TUJUAN */}
        <section className="mt-10 md:mt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">Tujuan Sekolah</h3>

          <p className="text-justify text-[15px] leading-relaxed text-slate-800">
            {tujuan.statement}
          </p>

          <p className="mt-4 text-justify text-[15px] leading-relaxed text-slate-700">
            {tujuan.penjelasan}
          </p>

          <ol className="mt-4 list-decimal pl-6">
            {tujuan.poin.map((item, idx) => (
              <li key={idx} className="py-0.5 text-[15px] leading-relaxed text-slate-800">
                {item}
              </li>
            ))}
          </ol>
        </section>

        {/* TATA NILAI */}
        <section className="mt-10 md:mt-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-[26px]">
            Tata Nilai Sekolah
          </h3>

          <p className="text-justify text-[15px] leading-relaxed text-slate-800">
            {tataNilai.statement}
          </p>

          <p className="mt-4 text-justify text-[15px] leading-relaxed text-slate-700">
            {tataNilai.penjelasan}
          </p>

          <ol className="mt-4 list-decimal pl-6">
            {tataNilai.nilai.map((item, idx) => (
              <li key={idx} className="py-0.5 text-[15px] leading-relaxed text-slate-800">
                <span className="font-bold">{item.judul}</span> — {item.deskripsi}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
