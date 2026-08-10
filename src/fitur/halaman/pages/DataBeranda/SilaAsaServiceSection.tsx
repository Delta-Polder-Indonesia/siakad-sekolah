import React, { useState, useEffect } from 'react';
import { namaSekolahUppercase } from '../../components/Profile/dataSekolah';
import {
  silaServices,
  asaServices,
  layananLinks,
  type ServiceItemProps,
} from '../../data/beranda/silaAsaService/data';
import { resolveSilaAsaNav } from './detailNav';

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 256 256"
    className={className}
  >
    <path d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z" />
  </svg>
);

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 256 256"
    className={className}
  >
    <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
  </svg>
);

function EscalatorTicker({
  services,
  onNavigate,
}: {
  services: ServiceItemProps[];
  onNavigate?: (id: string) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isPaused, services.length]);

  const extendedServices = [...services, ...services, ...services];

  const ITEM_HEIGHT = 216 / 7;
  const VISIBLE_OFFSET = 2;
  const translateY = (currentIndex + services.length - VISIBLE_OFFSET) * ITEM_HEIGHT;

  return (
    <div
      className="relative flex h-[280px] w-full flex-col gap-3 self-end overflow-hidden rounded-t-2xl bg-white p-6 pb-0 after:absolute after:bottom-0 after:left-0 after:z-[9] after:h-[100px] after:w-full after:bg-[linear-gradient(360deg,_rgba(255,255,255,95%)_0%,_rgba(255,255,255,75%)_50%,_rgba(255,255,255,40%)_100%)] after:content-[''] hover:after:hidden hover:after:bg-none sm:w-[560px] lg:w-[544px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Browser dots */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <div className="h-[11px] w-[11px] rounded-full bg-[#F44]">&nbsp;</div>
        <div className="h-[11px] w-[11px] rounded-full bg-[#99B51E]">&nbsp;</div>
        <div className="h-[11px] w-[11px] rounded-full bg-[#FDA328]">&nbsp;</div>
      </div>

      {/* Ticker area */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="-mt-3 flex h-[216px] flex-col transition-transform duration-700 ease-in-out"
          style={{ transform: `translate3d(0px, -${translateY}px, 0px)` }}
        >
          {extendedServices.map((s, i) => {
            const actualIndex = i % services.length;
            const isActive = actualIndex === currentIndex;
            return (
              <div
                key={`service-${i}`}
                className="flex flex-[0_0_calc(100%/7)] items-center gap-1 pt-3"
              >
                <CheckIcon
                  className={`flex-shrink-0 text-[#038A47] transition-all duration-500 ease-in-out ${
                    isActive ? 'h-[14px] w-[14px] sm:h-4 sm:w-4' : 'h-3 w-3'
                  }`}
                />
                <a
                  rel="noreferrer"
                  href={s.href}
                  target={onNavigate ? '_self' : '_blank'}
                  onClick={(e) => {
                    if (onNavigate) {
                      // navId out-of-range → no-op (tidak nyasar ke Beranda),
                      // namun tetap cegah navigasi browser ke URL asing.
                      e.preventDefault();
                      const navId = resolveSilaAsaNav(s.navId);
                      if (navId) onNavigate(navId);
                    }
                  }}
                  className={`cursor-pointer transition-all duration-500 ease-in-out hover:relative hover:z-[25] hover:!text-[#038A47] ${
                    isActive
                      ? 'text-sm leading-5 font-medium text-[#038A47] lg:text-base lg:leading-[22px]'
                      : 'text-xs font-normal text-black'
                  }`}
                >
                  {s.label}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SilaAsaServiceSectionProps {
  onNavigate?: (page: string) => void;
}

export default function SilaAsaServiceSection({ onNavigate }: SilaAsaServiceSectionProps) {
  return (
    <section id="section-sila-asa-services" className="w-full pt-16">
      <div className="flex flex-col overflow-hidden">
        {/* ========== PUTRI ========== */}
        <div className="overflow-hidden bg-[linear-gradient(270deg,_#43AD35_0%,_#038A47_25%,_#0B6839_50%)] pt-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 xl:px-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_544px] lg:items-center lg:gap-16">
              {/* Text */}
              <div className="flex-1 pb-6 md:pb-8 [&>*]:relative [&>*]:z-10">
                <div className="mb-4 -ml-2 flex h-10 w-10 items-center justify-center rounded-[4px] p-1">
                  <img
                    alt={`Logo Putri ${namaSekolahUppercase}`}
                    loading="lazy"
                    width="32"
                    height="32"
                    decoding="async"
                    className="aspect-square"
                    src={`${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`}
                  />
                </div>
                <h2 className="sec-subtitle mb-2 font-serif text-white">
                  Kini, kamu bisa mengakses berbagai layanan administratif dengan lebih mudah.
                </h2>
                <p className="sec-body mb-3 text-justify font-serif font-light text-white">
                  Dengan Putri (Sistem Informasi Layanan Administrasi) {namaSekolahUppercase},
                  proses administrasi yang sebelumnya rumit kini menjadi lebih mudah dan efisien.
                  Semua kebutuhan administratif siswa terintegrasi dalam satu pintu digital,
                  mempermudah mereka untuk fokus pada hal-hal yang lebih penting dalam perjalanan
                  akademik.
                </p>
                <a
                  className="group inline-flex w-fit items-center gap-1.5 rounded border border-solid border-green-200 bg-white px-2 py-1.5 transition-all duration-200 hover:bg-white"
                  href="https://sila.sman1medan.sch.id/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sec-btn font-serif font-semibold text-green-500">
                    Kunjungi Putri
                  </span>
                  <ArrowIcon className="ease h-2.5 w-2.5 text-green-500 transition-all duration-300 group-hover:translate-x-1 lg:h-3 lg:w-3" />
                </a>
              </div>

              {/* Visual */}
              <div className="relative z-10 mx-auto flex h-full w-full items-end justify-center sm:w-fit lg:w-full">
                <EscalatorTicker services={silaServices} onNavigate={onNavigate} />
                <div className="absolute -right-16 -bottom-10 sm:-right-[80px] lg:right-0">
                  <img
                    alt={`Kakak Putri ${namaSekolahUppercase}`}
                    loading="lazy"
                    width="164"
                    height="240"
                    className="relative z-10 w-[164px] sm:w-[200px]"
                    style={{ transform: 'scaleX(-1)' }}
                    src={`${import.meta.env.BASE_URL}images/HalamanKami/Beranda/icon/kakak-sila.png`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== PUTRA ========== */}
        <div className="overflow-hidden bg-[linear-gradient(90deg,_#43AD35_0%,_#038A47_25%,_#0B6839_50%)] pt-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 xl:px-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[544px_1fr] md:items-center lg:gap-16">
              {/* Visual */}
              <div className="relative z-10 order-2 mx-auto flex h-full w-full items-end justify-center sm:w-fit md:order-1 lg:w-full">
                <EscalatorTicker services={asaServices} onNavigate={onNavigate} />
                <div className="absolute -right-14 -bottom-20 sm:-right-[60px] lg:right-4">
                  <img
                    alt={`Abang Putra ${namaSekolahUppercase}`}
                    loading="lazy"
                    width="164"
                    height="240"
                    className="relative z-10 w-[164px] sm:w-[200px]"
                    src={`${import.meta.env.BASE_URL}images/HalamanKami/Beranda/icon/abang-asa.png`}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="order-1 flex-1 pb-6 md:order-2 md:pb-8 [&>*]:relative [&>*]:z-10">
                <div className="mb-4 -ml-2 flex h-10 w-10 items-center justify-center rounded-[4px] p-1">
                  <img
                    alt={`Logo Putra ${namaSekolahUppercase}`}
                    loading="lazy"
                    width="32"
                    height="32"
                    decoding="async"
                    className="aspect-square"
                    src={`${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`}
                  />
                </div>
                <h2 className="sec-subtitle mb-2 font-serif text-white">
                  Mengajukan berbagai dokumen akademik sekarang lebih mudah dan efisien.
                </h2>
                <p className="sec-body mb-3 text-justify font-serif font-light text-white">
                  Dari pengurusan ujian akhir hingga permohonan magang, Putra (Aplikasi Satu Atap)
                  mengakomodasi semua layanan permohonan dengan mudah melalui satu platform digital.
                  Hilangkan kerumitan dan percepat penyelesaian urusan akademik, memberikan
                  kemudahan dan kenyamanan bagi siswa dalam mengelola kebutuhan administratif.
                </p>
                <a
                  className="group inline-flex w-fit items-center gap-1.5 rounded border border-solid border-green-200 bg-white px-2 py-1.5 transition-all duration-200 hover:bg-white"
                  href="https://asa.sman1medan.sch.id/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sec-btn font-serif font-semibold text-green-500">
                    Kunjungi Putra
                  </span>
                  <ArrowIcon className="ease h-2.5 w-2.5 text-green-500 transition-all duration-300 group-hover:translate-x-1 lg:h-3 lg:w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========== STRIP LINK LAYANAN ========== */}
        <div className="flex flex-col items-center gap-8 bg-[#038A47] px-4 py-8 sm:px-8 xl:px-16">
          <div className="flex flex-wrap justify-center gap-4">
            {layananLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                title={link.title}
                aria-label={link.title}
                className="relative flex w-[140px] p-0.5 after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-[10px] after:bg-[linear-gradient(70deg,_#D5D800_0%,_#038A47_30%,_#39A935_70%,_#006633_100%)] after:opacity-0 after:transition-all after:duration-300 after:ease-in-out after:hover:opacity-100 sm:w-[160px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative z-[2] flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-4 md:h-16 md:p-4">
                  <img
                    alt={link.alt}
                    loading="lazy"
                    width={link.width}
                    height={link.height}
                    decoding="async"
                    className={link.imgClass}
                    src={`${import.meta.env.BASE_URL}${link.src}`}
                  />
                  {link.label && (
                    <span className="text-[10px] leading-[14px] font-semibold text-black uppercase md:text-xs md:leading-4">
                      {link.label}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
