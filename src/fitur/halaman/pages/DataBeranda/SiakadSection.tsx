import React from 'react';
import { useSchoolIdentity } from '../../../../hooks/useSchoolIdentity';

interface SiakadSectionProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function SiakadSection({
  imageSrc,
  imageAlt = 'Ilustrasi SIAKAD',
}: SiakadSectionProps) {
  const identity = useSchoolIdentity();
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
              className="flex h-8 w-8 items-center justify-center"  loading="lazy" decoding="async" />
            <h2 className="sec-title tracking-tight text-slate-900">
              Sistem Informasi Akademik (SIAKAD)
            </h2>
          </div>

          <div className="text-[15px] leading-relaxed text-slate-800">
            <p className="mb-4 text-justify">
              <strong className="sec-subtitle mt-4 text-justify text-emerald-700 md:mt-8">
                Sistem Informasi Akademik (SIAKAD) adalah
              </strong>{' '}
              aplikasi berbasis web yang dirancang untuk melakukan proses pengelolaan data akademik
              dan data terkait lainnya, sehingga seluruh kegiatan akademik dapat terkelola menjadi
              informasi yang bermanfaat dalam pengelolaan manajemen sekolah, pengambilan keputusan,
              serta pelaporan di lingkungan {identity.namaSekolah} yang melibatkan siswa, guru, dan
              petugas administrasi akademik.
            </p>
            <p className="mb-4 text-justify">
              SIAKAD bertujuan sebagai penataan data dalam pengelolaan akademik, serta mempercepat
              dan memudahkan penyampaian informasi kegiatan administrasi akademik, seperti proses
              Penerimaan Peserta Didik Baru (PPDB), pembuatan jadwal pelajaran, pengisian rencana
              belajar, input nilai rapor, perwalian kelas, pengelolaan data guru dan siswa, hingga
              jadwal kelulusan siswa.
            </p>
            <p className="mb-4 text-justify">
              Selain menjadi sumber daya informasi di sekolah, SIAKAD juga dapat digunakan sebagai
              sarana media komunikasi antara guru dan siswa, siswa dengan sesama siswa, serta guru
              dengan pihak manajemen sekolah.
            </p>
          </div>
        </article>

        {/* ─── KONTAINER GAMBAR ─── */}
        <div className="flex w-full shrink-0 items-center justify-center lg:w-[360px]">
          <img
            src={`${import.meta.env.BASE_URL}images/HalamanKami/Beranda/siakad-app.png`}
            alt={imageAlt}
            className="h-auto max-h-[450px] w-full object-contain drop-shadow-xl transition-transform duration-300"  loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  );
}
