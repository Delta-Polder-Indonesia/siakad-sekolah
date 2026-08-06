import { useMemo } from 'react';

type VerificationDoc = {
  title: string;
  status: string;
  summary: string;
  detail: string;
};

export default function DokumenWajib() {
  const verificationDocs = useMemo<VerificationDoc[]>(
    () => [
      {
        title: 'Bukti pendaftaran + nomor registrasi',
        status: 'Wajib',
        summary: 'Dokumen identitas utama peserta pada sistem.',
        detail:
          'Dicetak dari portal PPDB setelah submit berhasil. Pastikan nomor registrasi terbaca jelas karena akan digunakan petugas untuk membuka data peserta di sistem.',
      },
      {
        title: 'Kartu Keluarga (KK)',
        status: 'Wajib',
        summary: 'Dasar verifikasi hubungan keluarga dan domisili.',
        detail:
          'Bawa dokumen asli dan 1 lembar fotokopi. Data kepala keluarga, alamat, dan anggota keluarga harus sesuai dengan data yang diinput saat pendaftaran.',
      },
      {
        title: 'Akta Kelahiran',
        status: 'Wajib',
        summary: 'Dasar verifikasi nama resmi dan tanggal lahir.',
        detail:
          'Bawa dokumen asli dan 1 lembar fotokopi. Penulisan nama lengkap, tempat lahir, dan tanggal lahir akan dibandingkan dengan formulir pendaftaran.',
      },
      {
        title: 'SKL/Ijazah (jenjang non-SD)',
        status: 'Wajib Bersyarat',
        summary: 'Wajib untuk pendaftar SMP/SMA/SMK.',
        detail:
          'Siapkan SKL atau ijazah sesuai ketentuan jenjang tujuan. Jika dokumen belum terbit, ikuti kebijakan sekolah terkait surat keterangan sementara.',
      },
      {
        title: 'Piagam prestasi',
        status: 'Wajib Jalur Prestasi',
        summary: 'Digunakan untuk validasi jalur prestasi.',
        detail:
          'Dokumen harus legal, jelas asal penyelenggara, tingkat kompetisi, serta rentang waktu prestasi sesuai aturan panitia PPDB setempat.',
      },
      {
        title: 'Kartu KIP/PKH',
        status: 'Wajib Jalur Afirmasi',
        summary: 'Validasi komponen sosial ekonomi.',
        detail:
          'Bawa kartu asli dan fotokopi. Nomor kartu dan identitas penerima akan diverifikasi untuk memastikan kesesuaian jalur afirmasi.',
      },
      {
        title: 'Surat pindah tugas orang tua',
        status: 'Wajib Jalur Pindahan',
        summary: 'Validasi perpindahan domisili karena tugas resmi.',
        detail:
          'Surat harus berasal dari instansi resmi, memuat identitas orang tua/wali, lokasi penugasan baru, dan masa tugas yang masih berlaku.',
      },
    ],
    []
  );

  return (
    <div className="animate-fadeIn min-h-screen bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      {/* Wadah Utama Menyerupai Lembar Halaman Dokumen Resmi */}
      <div className="mx-auto max-w-4xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm sm:p-12 md:p-16">
        {/* ── HEADER DOKUMEN (Center Atas) ── */}
        <div className="mx-auto mb-10 max-w-3xl space-y-3 border-b-2 border-slate-950 pb-8 text-center">
          <span className="block text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Persyaratan Fisik
          </span>
          <h1 className="text-[20px] font-bold tracking-tight text-slate-950 min-[480px]:text-[22px] md:text-[24px]">
            Berkas Validasi Wajib Pendaftaran
          </h1>
          <p className="text-[17px] leading-relaxed text-slate-600 md:text-[18px]">
            Bawa seluruh lembar berkas asli beserta salinan fotokopi yang telah dilegalisir saat
            mengunjungi loket verifikasi.
          </p>
        </div>

        {/* ── DAFTAR DOKUMEN PERSYARATAN (Skala Teks 16px - 20px) ── */}
        <div className="space-y-0">
          {verificationDocs.map((item, idx) => (
            <div
              key={item.title}
              className="grid gap-6 border-t border-slate-200 py-8 last:border-b last:border-slate-200 md:grid-cols-3"
            >
              {/* KIRI: Penomoran, Judul Dokumen, dan Label Status */}
              <div className="md:col-span-1">
                <span className="mb-1 block text-xs font-bold text-slate-400">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                {/* Ukuran Judul: 20px Bold */}
                <h3 className="text-[20px] leading-snug font-bold text-slate-950">{item.title}</h3>
                {/* Status Penanda Dokumen Resmi */}
                <span className="mt-2 inline-block border border-slate-300 bg-slate-50 px-2 py-0.5 text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
                  {item.status}
                </span>
              </div>

              {/* KANAN: Deskripsi Ringkas & Ketentuan Detail Teknis */}
              <div className="space-y-3 text-[16px] leading-relaxed md:col-span-2">
                {/* Ringkasan Fungsi Dokumen */}
                <p className="font-medium text-slate-900">{item.summary}</p>
                {/* Detail Ketentuan Instruksi */}
                <p className="border-l-2 border-slate-900 bg-slate-50/50 py-1 pl-4 text-slate-700">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
