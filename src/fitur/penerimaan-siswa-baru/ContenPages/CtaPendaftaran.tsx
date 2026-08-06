type CtaPendaftaranProps = {
  onOpenInformasi: () => void;
};

export default function CtaPendaftaran({ onOpenInformasi }: CtaPendaftaranProps) {
  return (
    <div className="mt-10 px-2 sm:px-4">
      <div className="rounded-2xl bg-[#0d6e38] px-6 py-8 shadow-md sm:px-10 sm:py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Bergabung Bersama Kami
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-emerald-100">
              Penerimaan siswa baru tahun ajaran 2026/2027 sudah dibuka. Informasi jalur seleksi dan
              jadwal pendaftaran selengkapnya dapat diakses melalui tautan berikut.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenInformasi}
            className="shrink-0 rounded-lg bg-white px-6 py-3 text-xs font-bold text-[#0d6e38] shadow transition-all hover:bg-slate-100 hover:shadow-lg"
          >
            Kunjungi Halaman Pendaftaran →
          </button>
        </div>
      </div>
    </div>
  );
}
