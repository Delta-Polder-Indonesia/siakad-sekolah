import React from 'react';
import { namaSekolahUppercase } from '../../components/Profile/dataSekolah';
import { DEFAULT_TAGS } from '../../data/beranda/sekolahBerdampak/data';

export interface KampusBerdampakSectionProps {
  onNavigate?: (path: string) => void;
  titleTag?: string;
  headline?: string;
  description?: string;
  tags?: string[];
  buttonText?: string;
  buttonLink?: string;
  imageSrc?: string;
}

export default function KampusBerdampakSection({
  onNavigate,
  titleTag = `${namaSekolahUppercase} Berdampak`,
  headline = 'Menuju Dampak Nyata bagi Bangsa',
  description = `Melanjutkan visi Sekolah Unggul, ${namaSekolahUppercase} Berdampak menekankan pada hasil nyata dan kontribusi konkret bagi pembangunan nasional melalui pendidikan, inovasi, dan pengabdian kepada masyarakat.`,
  tags = DEFAULT_TAGS,
  buttonText = 'Sekolah Berdampak',
  buttonLink = 'sekolah-berdampak',
  imageSrc = 'images/HalamanKami/Beranda/smknu_pkl-2024.png',
}: KampusBerdampakSectionProps) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <section id="section-kampus-berdampak" className="w-full py-10 md:py-16">
      <div className="mx-auto max-w-[1538px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(0deg,_#43AD35_0%,_#038A47_25%,_#0B6839_50%)] px-6 py-8 sm:h-[400px] sm:p-8 md:bg-[linear-gradient(270deg,_#43AD35_0%,_#038A47_25%,_#0B6839_50%)] md:p-10">
          {/* Gambar kanan - mengisi setengah kanan penuh */}
          <img
            alt={titleTag}
            loading="lazy"
            decoding="async"
            src={imageSrc}
            className="absolute top-0 right-0 z-0 hidden h-full w-1/2 object-cover md:block"
          />

          {/* Gradient overlay agar gambar menyatu ke kiri */}
          <div className="absolute top-0 right-0 z-0 hidden h-full w-1/2 bg-[linear-gradient(90deg,_#0B6839_0%,_transparent_60%)] md:block"></div>

          {/* Area Teks dan Tombol */}
          <div className="relative z-10 flex h-full max-w-[560px] flex-col justify-center gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="sec-eyebrow font-serif text-lime-300">{titleTag}</span>
                <h2 className="sec-title font-serif text-white">{headline}</h2>
              </div>

              <p className="sec-body text-justify font-serif text-white">{description}</p>

              {/* Badge/Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center rounded-md border border-white/40 bg-white/10 px-3 py-1 backdrop-blur-sm"
                  >
                    <span className="sec-meta font-serif font-medium text-white">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Aksi */}
            <a
              href={`/id/${buttonLink}`}
              onClick={(e) => handleLinkClick(e, buttonLink)}
              aria-label={titleTag}
              className="group mt-2 inline-flex w-fit items-center gap-2 rounded-md border border-emerald-600 bg-white px-4 py-2 font-serif font-semibold text-emerald-700 shadow-sm transition-all duration-200 hover:bg-emerald-50 hover:shadow-md"
            >
              <span>{buttonText}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
