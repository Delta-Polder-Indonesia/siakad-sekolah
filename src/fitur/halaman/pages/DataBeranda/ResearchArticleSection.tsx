import React from 'react';
import { namaSekolahUppercase } from '../../components/Profile/dataSekolah';
import {
  DEFAULT_ARTICLES,
  DEFAULT_SDGS,
  type ResearchArticle,
  type SdgsItem,
} from '../../data/beranda/researchArticle/data';
import { resolveRisetNav, resolveSdgsNav } from './detailNav';

export interface ResearchArticleSectionProps {
  onNavigate?: (path: string) => void;
  articles?: ResearchArticle[];
  sdgsList?: SdgsItem[];
}

export default function ResearchArticleSection({
  onNavigate,
  articles = DEFAULT_ARTICLES,
  sdgsList = DEFAULT_SDGS,
}: ResearchArticleSectionProps) {
  // Fungsi untuk menangani navigasi jika onNavigate prop disediakan.
  // path yang null (id out-of-range) dinavigasikan → no-op, tapi preventDefault
  // tetap dijalankan agar browser tidak pindah ke URL yang tidak ada.
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string | null) => {
    if (onNavigate) {
      e.preventDefault();
      if (path) onNavigate(path);
    }
  };

  // Mengambil artikel utama (artikel pertama) dan artikel sekunder (sisanya)
  const primaryArticle = articles[0] || DEFAULT_ARTICLES[0];
  const secondaryArticles = articles.slice(1);

  // Menduplikasi daftar SDGs untuk efek marquee tak terbatas
  const duplicatedSdgsList = [...sdgsList, ...sdgsList];

  return (
    <section id="section-research-article" className="w-full">
      {/* Konten Utama Bagian */}
      <div className="w-full bg-[linear-gradient(184deg,_#FFF_3.53%,_#FAFBE6_73.23%,_#F0F4B0_96.47%)] py-8 shadow-lg md:py-16 xl:py-20">
        <div className="mx-auto max-w-[1538px] px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex flex-col gap-10 md:gap-16">
            {/* Header Bagian dengan Gambar Latar dan Teks */}
            <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(270deg,_#43AD35_0%,_#038A47_25%,_#0B6839_50%)] p-6 md:p-8 lg:h-[300px]">
              <img
                alt={`Program Pendidikan & Riset ${namaSekolahUppercase}`}
                loading="lazy"
                decoding="async"
                className="absolute top-0 right-0 hidden h-full w-auto object-contain md:block"
                src="images/HalamanKami/Beranda/diktisaintek-beranda.png"
              />
              <div className="relative z-10 flex h-full max-w-[600px] flex-col justify-center gap-6">
                <div className="flex flex-col gap-4">
                  {/* Logo Pendidikan */}
                  <div className="w-fit rounded-xl bg-[linear-gradient(90deg,_#FFF_0.2%,_#FAFBE6_74.91%,_#F0F4B0_99.82%)] px-4 py-2 shadow-sm">
                    <img
                      alt={`Logo Pendidikan ${namaSekolahUppercase}`}
                      loading="lazy"
                      width={24}
                      height={24}
                      decoding="async"
                      className="h-8 w-auto"
                      src="images/HalamanKami/Beranda/icon/diktisaintek-primary-logo.png"
                    />
                  </div>
                  {/* Judul dan Subjudul */}
                  <div className="flex flex-col">
                    <span className="sec-eyebrow text-lime-300">
                      {namaSekolahUppercase} Sekolah Solusi
                    </span>
                    <h2 className="sec-title font-serif text-white">
                      Menggerakkan Innovation & Research Berdampak untuk Indonesia Emas 2045
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian Peran dan Marquee SDGs */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex shrink-0 flex-col gap-4 md:w-[320px] md:flex-row md:items-center">
                <span className="sec-subtitle bg-[linear-gradient(270deg,_#43AD35_1.19%,_#038A47_25.6%,_#0B6839_50%)] bg-clip-text font-serif text-transparent">
                  Peran {namaSekolahUppercase} dalam Inovasi Berdampak
                </span>
                <div className="h-0.5 w-16 border-b border-orange-400 md:h-16 md:w-0 md:border-r"></div>
              </div>

              {/* Wadah Marquee SDGs */}
              <div className="flex-1 overflow-hidden">
                <div className="animate-sdgs-marquee gap-3 py-2">
                  {/* Memetakan Daftar SDGs Duplikat */}
                  {duplicatedSdgsList.map((sdg, idx) => (
                    <a
                      key={`${sdg.id}-${idx}`}
                      href={`/id/sdgs/${sdg.link}`}
                      onClick={(e) => handleLinkClick(e, resolveSdgsNav(sdg.link))}
                      className="shrink-0 px-1"
                      title={sdg.title}
                    >
                      <img
                        alt={sdg.title}
                        loading="lazy"
                        width={64}
                        height={64}
                        decoding="async"
                        className="h-16 w-16 rounded-lg object-cover shadow-sm"
                        src={sdg.imageSrc} // Menggunakan link gambar yang diperbarui
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bagian Menampilkan Artikel */}
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Menampilkan Artikel Utama */}
              <div className="flex flex-col gap-4 md:w-1/2">
                <a
                  href={`/id/riset/${primaryArticle.link}`}
                  onClick={(e) => handleLinkClick(e, resolveRisetNav(primaryArticle.link))}
                  style={{ backgroundImage: `url('${primaryArticle.bgImageSrc}')` }}
                  className="group relative flex aspect-[3/2] w-full flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center p-6 shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90"></div>
                  <div className="relative z-10 flex flex-col gap-3">
                    {/* Kategori Artikel */}
                    <div className="flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                      <span className="sec-meta font-serif font-semibold text-emerald-800">
                        {primaryArticle.category}
                      </span>
                    </div>
                    {/* Judul Artikel */}
                    <span className="sec-card-title line-clamp-2 font-serif text-white">
                      {primaryArticle.title}
                    </span>
                    {/* Tanggal Artikel */}
                    <span className="sec-meta font-serif font-normal text-slate-200">
                      {primaryArticle.date}
                    </span>
                  </div>
                </a>
              </div>

              {/* Menampilkan Artikel Sekunder dan Deskripsi */}
              <div className="flex flex-col justify-between gap-6 md:w-1/2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Memetakan Artikel Sekunder */}
                  {secondaryArticles.map((article) => (
                    <a
                      key={article.id}
                      href={`/id/riset/${article.link}`}
                      onClick={(e) => handleLinkClick(e, resolveRisetNav(article.link))}
                      style={{ backgroundImage: `url('${article.bgImageSrc}')` }}
                      className="group relative flex aspect-square w-full flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center p-5 shadow-md transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90"></div>
                      <div className="relative z-10 flex flex-col gap-2">
                        {/* Kategori Artikel Sekunder */}
                        <div className="flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                          <span className="sec-meta font-serif font-semibold text-emerald-800">
                            {article.category}
                          </span>
                        </div>
                        {/* Judul Artikel Sekunder */}
                        <span className="sec-card-title line-clamp-2 font-serif text-white">
                          {article.title}
                        </span>
                        {/* Tanggal Artikel Sekunder */}
                        <span className="sec-meta font-serif font-normal text-slate-200">
                          {article.date}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Deskripsi Tambahan dan Tombol Tautan */}
                <div className="mt-2 flex flex-col gap-4">
                  <p className="sec-body font-serif text-slate-800">
                    Kami berperan aktif dalam inovasi yang berdampak melalui berbagai cara, termasuk
                    pengembangan riset dan kolaborasi dengan berbagai pihak. {namaSekolahUppercase}
                    berupaya menghasilkan inovasi yang tidak hanya bermanfaat bagi sivitas
                    akademika, tetapi juga masyarakat luas dan pembangunan daerah.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
