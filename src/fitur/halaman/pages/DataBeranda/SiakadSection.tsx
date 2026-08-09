import React from 'react';

interface SiakadSectionProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function SiakadSection({
  imageSrc,
  imageAlt = 'Ilustrasi SIAKAD',
}: SiakadSectionProps) {
  return (
    /* 
      1. '-mt-36' & 'z-20' menjaga agar background biru tetap naik ke atas menimpa section banner.
      2. 'pb-16 px-4 md:px-12' memberikan ruang bawah dan samping.
    */
    <section className="z-20 -mt-36 w-full bg-gradient-to-b from-[#dff5f8] via-[#eef9fa] via-95% to-white px-4 pb-16 font-serif md:px-12">
      {/* 
        3. 'pt-44' atau 'pt-48' ditambahkan DI SINI untuk menurunkan teks & gambar 
           secara aman ke bawah card banner tanpa menggeser background birunya.
      */}
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 pt-44 md:pt-48 lg:flex-row lg:gap-12">
        {/* ─── KONTEN ARTIKEL (Sisi Kiri) ─── */}
        <article className="flex-1 text-slate-800">
          {/* 'mb-36' diubah kembali ke 'mb-6' agar jarak judul ke paragraf normal */}
          <div className="mb-6 flex items-center gap-3">
            <img
              src="images/HalamanKami/Beranda/IconConten/flower-ora.svg"
              alt="Icon Flower"
              className="flex h-8 w-8 items-center justify-center"
            />
            <h1 className="sec-title text-blue-900">Sistem Informasi Akademik (SIAKAD)</h1>
          </div>

          <div className="sec-body space-y-4 text-slate-600">
            <p>
              <strong className="font-bold text-blue-900">
                Sistem Informasi Akademik (SIAKAD) adalah
              </strong>{' '}
              aplikasi berbasis web yang dirancang untuk melakukan proses pengelolaan data akademik
              dan data terkait lainnya, sehingga seluruh kegiatan akademik dapat terkelola menjadi
              informasi yang bermanfaat dalam pengelolaan manajemen perguruan tinggi, pengambilan
              keputusan, serta pelaporan di lingkungan perguruan tinggi yang melibatkan mahasiswa,
              dosen, dan petugas administrasi akademik.
            </p>
            <p>
              SIAKAD bertujuan sebagai penataan data dalam pengelolaan akademik, serta mempercepat
              dan memudahkan penyampaian informasi kegiatan administrasi akademik, seperti proses
              Penerimaan Mahasiswa Baru (PMB), pembuatan jadwal kuliah, pengisian Kartu Rencana
              Studi (KRS), pengisian nilai, perwalian, pengelolaan data dosen dan mahasiswa, dan
              jadwal wisuda mahasiswa.
            </p>
            <p>
              Selain menjadi sumber daya informasi di kampus, SIAKAD juga dapat digunakan sebagai
              sarana media komunikasi antara dosen dan mahasiswa, mahasiswa dengan mahasiswa, serta
              dosen dengan pejabat kampus.
            </p>
          </div>

          <div className="sec-meta mt-8">
            <p className="mb-1 font-bold text-slate-500">Sumber:</p>
            <p className="text-slate-500">www.siakad</p>
          </div>
        </article>

        {/* ─── KONTAINER GAMBAR ─── */}
        <div className="flex w-full shrink-0 items-center justify-center lg:w-[360px]">
          <img
            src={`${import.meta.env.BASE_URL}images/HalamanKami/Beranda/siakad-app.png`}
            alt={imageAlt}
            className="h-auto max-h-[450px] w-full object-contain drop-shadow-xl transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
}
