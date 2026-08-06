'use client';

import React, { useState } from 'react';

type FAQItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

const faqData: FAQItem[] = [
  {
    id: 'faq-durasi-kunjungan',
    question: 'Apa saja fasilitas yang bisa dilihat saat kunjungan ke kampus?',
    answer:
      'Di area kampus USU, tersedia banyak fasilitas umum yang dapat dilihat, baik fasilitas olahraga maupun fasilitas akademik.',
  },
  {
    id: 'faq-pintu-kampus',
    question: 'Apakah ada panduan atau tata tertib yang harus diikuti saat kunjungan ke kampus?',
    answer:
      'Disarankan untuk selalu bertanya kepada civitas akademika dan selalu menjaga tingkah laku di area kampus.',
  },
  {
    id: 'faq-parkir',
    question:
      'Apakah saya bisa bertemu langsung dengan dosen atau mahasiswa di fakultas tertentu saat kunjungan ke kampus?',
    answer:
      'Saat melakukan kunjungan ke kampus, Anda dapat bertemu dengan dosen atau mahasiswa tertentu di luar jam belajar.',
  },
  {
    id: 'faq-penerimaan',
    question: 'Bagaimana prosedur pendaftaran bagi mahasiswa baru di Universitas Sumatera Utara?',
    answer: (
      <>
        Informasi pendaftaran dapat diakses melalui situs{' '}
        <a
          href="https://penerimaan.usu.ac.id"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#008244] underline"
        >
          https://penerimaan.usu.ac.id
        </a>
        .
      </>
    ),
  },
];

export default function CampusVisitSection() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="section-campus-life-visit-access"
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-b from-[#038A47] to-[#006535] py-8 md:py-16"
    >
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 md:grid md:grid-cols-2 md:px-8">
        {/* Kolom Kiri: Kunjungan ke Kampus */}
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md md:p-8">
          {/* Title Header */}
          <div className="inline-flex w-fit items-center overflow-hidden rounded-md bg-[#008244]">
            <div className="flex items-center justify-center bg-[#70c042] p-2.5">
              <img
                alt="USU section decorative ornament for Kunjungan ke Kampus"
                loading="lazy"
                width="24"
                height="24"
                src="https://konten.usu.ac.id/storage/satker/0/icons/flower-sec2.svg?w=64&q=75"
                className="h-6 w-6 brightness-200 filter"
              />
            </div>
            <h2 className="px-4 py-2 text-lg font-bold tracking-wide text-white md:text-xl">
              Kunjungan ke Kampus
            </h2>
          </div>

          <p className="text-xs leading-relaxed text-gray-700 md:text-sm">
            Kunjungan ke kampus ditujukan untuk calon mahasiswa Universitas Sumatera Utara. Anda
            akan melihat secara langsung bagaimana suasana kampus kami, termasuk fasilitas,
            mahasiswa, dan kehidupan di dalam kampus.
          </p>

          <a
            href="https://goo.gl/maps/UmHuprdkbiFjAp2YA"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 rounded-lg border border-[#008244] px-4 py-2 text-xs font-semibold text-gray-800 shadow-sm transition-all duration-200 hover:text-[#008244] hover:shadow-md md:text-sm"
          >
            <span>Mulai Berkunjung</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 256 256"
              className="h-4 w-4 text-[#008244] transition-transform group-hover:translate-x-0.5"
            >
              <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
            </svg>
          </a>

          {/* Section FAQ */}
          <div className="mt-2 flex flex-col gap-4">
            <p className="text-sm font-semibold text-[#008244] md:text-base">
              Pertanyaan yang Sering Diajukan
            </p>

            <div className="space-y-3">
              {faqData.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      aria-controls={faq.id}
                      onClick={() => toggleFaq(faq.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleFaq(faq.id);
                        }
                      }}
                      className="flex cursor-pointer items-center justify-between gap-3 p-4 select-none focus:ring-2 focus:ring-[#008244] focus:outline-none"
                    >
                      <span className="flex-1 text-xs font-semibold text-gray-800 md:text-sm">
                        {faq.question}
                      </span>
                      <svg
                        className={`h-5 w-5 transform text-gray-500 transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : 'rotate-0'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>

                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div id={faq.id} className="min-h-0 overflow-hidden">
                        <div className="border-t border-gray-200/60 p-4 pt-0 text-xs leading-relaxed text-gray-600 md:text-sm">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Akses dan Transportasi */}
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md md:p-8">
          {/* Title Header */}
          <div className="inline-flex w-fit items-center overflow-hidden rounded-md bg-[#008244]">
            <div className="flex items-center justify-center bg-[#70c042] p-2.5">
              <img
                alt="USU section decorative ornament for Akses dan Transportasi"
                loading="lazy"
                width="24"
                height="24"
                src="https://konten.usu.ac.id/storage/satker/0/icons/flower-sec2.svg?w=64&q=75"
                className="h-6 w-6 brightness-200 filter"
              />
            </div>
            <h2 className="px-4 py-2 text-lg font-bold tracking-wide text-white md:text-xl">
              Akses dan Transportasi
            </h2>
          </div>

          <p className="text-xs leading-relaxed text-gray-700 md:text-sm">
            Mahasiswa dari luar Kota Medan dapat menggunakan pesawat ke Bandara Kualanamu dan
            melanjutkan perjalanan dengan taksi atau bus ke kampus USU. Mahasiswa juga dapat naik
            kereta api dan melanjutkan perjalanan dengan angkutan umum.
          </p>

          <div className="space-y-4">
            {/* Bus / Darat */}
            <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="shrink-0 pt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M23 4.25H9C8.00544 4.25 7.05161 4.64509 6.34835 5.34835C5.64509 6.05161 5.25 7.00544 5.25 8V26C5.25 26.4641 5.43437 26.9092 5.76256 27.2374C6.09075 27.5656 6.53587 27.75 7 27.75H10C10.4641 27.75 10.9092 27.5656 11.2374 27.2374C11.5656 26.9092 11.75 26.4641 11.75 26V23.75H20.25V26C20.25 26.4641 20.4344 26.9092 20.7626 27.2374C21.0908 27.5656 21.5359 27.75 22 27.75H25C25.4641 27.75 25.9092 27.5656 26.2374 27.2374C26.5656 26.9092 26.75 26.4641 26.75 26V8C26.75 7.00544 26.3549 6.05161 25.6517 5.34835C24.9484 4.64509 23.9946 4.25 23 4.25ZM6.75 22.25V14.75H25.25V22.25H6.75ZM6.75 9.75H25.25V13.25H6.75V9.75ZM9 5.75H23C23.5967 5.75 24.169 5.98705 24.591 6.40901C25.0129 6.83097 25.25 7.40326 25.25 8V8.25H6.75V8C6.75 7.40326 6.98705 6.83097 7.40901 6.40901C7.83097 5.98705 8.40326 5.75 9 5.75Z"
                    fill="#006937"
                  />
                </svg>
              </div>
              <p className="text-xs leading-relaxed text-gray-700 md:text-sm">
                Mahasiswa dapat menggunakan bus untuk menuju ke USU melalui terminal bus terdekat
                dan turun di Terminal Amplas. Setelah itu, mahasiswa bisa melanjutkan perjalanan
                dengan angkutan umum ke kampus USU dengan durasi sekitar 30 menit.
              </p>
            </div>

            {/* Pesawat Terbang */}
            <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="shrink-0 pt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M31.7953 7.25337C31.7272 6.82077 31.5292 6.41909 31.2275 6.1016C30.9259 5.7841 30.5349 5.56578 30.1064 5.47559L24.8886 4.32893C24.3291 4.20689 23.7498 4.20643 23.1901 4.32758C22.6304 4.44873 22.1032 4.68866 21.6442 5.03115L6.22193 16.2667L1.90193 16.0889C1.55466 16.0765 1.21229 16.1738 0.923466 16.367C0.634642 16.5602 0.414041 16.8396 0.292998 17.1653C0.171954 17.491 0.156622 17.8466 0.249179 18.1816C0.341736 18.5165 0.537476 18.8138 0.808597 19.0312L5.25304 22.5245C5.78638 23.1734 6.14193 23.0489 14.9686 18.24L15.7953 26.6134C15.809 26.8418 15.8873 27.0616 16.0211 27.2473C16.1548 27.433 16.3385 27.5769 16.5508 27.6623C16.7036 27.7226 16.8666 27.7528 17.0308 27.7512C17.3614 27.741 17.6772 27.6116 17.9197 27.3867L20.0442 25.4489C20.2557 25.2529 20.399 24.9944 20.453 24.7112L22.3997 14.1334C25.573 12.3556 28.5775 10.6845 30.7197 9.4667C31.103 9.25112 31.4113 8.92369 31.6035 8.52818C31.7957 8.13267 31.8626 7.68792 31.7953 7.25337Z"
                    fill="#006937"
                  />
                </svg>
              </div>
              <p className="text-xs leading-relaxed text-gray-700 md:text-sm">
                Mahasiswa dapat menuju lokasi Universitas Sumatera Utara dengan menggunakan pesawat
                terbang. Setelah tiba di Bandara Kualanamu, perjalanan dapat dilanjutkan dengan
                menggunakan taksi/bus dengan durasi sekitar 60 menit.
              </p>
            </div>

            {/* Kapal Laut */}
            <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="shrink-0 pt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M2.66699 28.6587C4.39366 28.7867 5.84566 27.3333 7.11099 27.3333C8.37633 27.3333 10.4337 28.6733 11.5563 28.6587C12.903 28.6707 14.4803 27.3333 16.0003 27.3333C17.5203 27.3333 19.0977 28.6707 20.4443 28.6587C22.171 28.7867 23.623 27.3333 24.8897 27.3333C26.1563 27.3333 28.211 28.6733 29.3337 28.6587M8.00033 27.3333C6.10966 24.9787 4.77766 21.964 4.20966 20.3667C4.02966 19.86 3.94033 19.6067 4.04433 19.364C4.14966 19.1227 4.40433 19.0093 4.91766 18.7827L14.9043 14.3587C15.443 14.1187 15.7137 14 16.0003 14C16.287 14 16.5577 14.12 17.0977 14.36L27.083 18.7827C27.595 19.0093 27.851 19.1227 27.9563 19.364C28.0603 19.6067 27.9697 19.86 27.791 20.3667C27.223 21.964 25.891 24.9787 24.0003 27.3333"
                    stroke="#006937"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 17.3334L8.288 13.5907C8.468 11.2547 8.55733 10.0867 9.324 9.37741C10.0907 8.66675 11.2627 8.66675 13.6053 8.66675H18.3947C20.7373 8.66675 21.9093 8.66675 22.6747 9.37741C23.4427 10.0867 23.532 11.2547 23.712 13.5907L24 17.3334"
                    stroke="#006937"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.334 8.66671L11.5633 6.83737C11.7713 5.16937 11.8753 4.33471 12.4433 3.83337C13.01 3.33337 13.85 3.33337 15.5313 3.33337H16.47C18.15 3.33337 18.9913 3.33337 19.558 3.83337C20.126 4.33471 20.23 5.16937 20.438 6.83737L20.6673 8.66671"
                    stroke="#006937"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-xs leading-relaxed text-gray-700 md:text-sm">
                Mahasiswa dapat menggunakan kapal dan berlabuh di Pelabuhan Belawan. Kemudian,
                perjalanan dapat dilanjutkan dengan angkutan umum atau bus menuju lokasi USU dengan
                durasi sekitar 120 menit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
