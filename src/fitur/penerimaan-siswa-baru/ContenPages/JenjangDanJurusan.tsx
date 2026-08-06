type JurusanKey = 'reg-01' | 'reg-02' | 'reg-03' | 'reg-04' | 'reg-05' | 'reg-06' | 'reg-07';

const jenjangList = [
  { name: 'SD / MI', href: '#sd' },
  { name: 'SMP / MTs', href: '#smp' },
  { name: 'SMA / MA', href: '#sma' },
  { name: 'SMK', href: '#smk' },
];

type JurusanItem = {
  name: string;
  key: JurusanKey | null; // null = belum ada halaman
};

const jurusanList: JurusanItem[] = [
  { name: 'Teknik Komputer dan Jaringan', key: 'reg-01' },
  { name: 'Rekayasa Perangkat Lunak', key: 'reg-02' },
  { name: 'Akuntansi', key: 'reg-03' },
  { name: 'Otomatisasi Tata Kelola Perkantoran', key: 'reg-04' },
  { name: 'Multimedia', key: 'reg-05' },
  { name: 'Teknik Kendaraan Ringan', key: 'reg-06' },
  { name: 'Teknik Elektronika', key: 'reg-07' },
  { name: 'Tata Boga', key: null },
  { name: 'Perhotelan', key: null },
  { name: 'Desain Komunikasi Visual', key: null },
];

type JenjangDanJurusanProps = {
  onOpenJurusan: (key: JurusanKey) => void;
};

export default function JenjangDanJurusan({ onOpenJurusan }: JenjangDanJurusanProps) {
  return (
    <div className="relative z-20 -mt-20 px-2 sm:px-4">
      <div className="grid gap-6 md:grid-cols-12">
        {/* Card Kiri: Pilihan Jenjang */}
        <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-lg sm:p-8 md:col-span-5">
          <div>
            <h2 className="mb-3 text-xl font-bold text-[#0d6e38]">Pilihan Jenjang Pendidikan</h2>
            <p className="mb-6 text-xs text-slate-600 sm:text-sm">
              Tersedia berbagai pilihan jenjang pendidikan dan program yang dapat Anda pilih di
              sekolah kami. Dapatkan informasi lengkap untuk menemukan program pendidikan terbaik.
            </p>
            <div className="space-y-3">
              {jenjangList.map((j) => (
                <a
                  key={j.name}
                  href={j.href}
                  className="group flex items-center gap-3 text-sm font-bold text-slate-800 transition-colors hover:text-[#0d6e38]"
                >
                  <span className="text-[#0d6e38] transition-transform group-hover:translate-x-1">
                    ➔
                  </span>
                  <span>{j.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Card Kanan: Jurusan / Program Keahlian */}
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8 md:col-span-7">
          <h2 className="mb-6 text-xl font-bold text-[#0d6e38]">Program Keahlian dan Jurusan</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {jurusanList.map((j) =>
              j.key ? (
                <button
                  key={j.name}
                  type="button"
                  onClick={() => onOpenJurusan(j.key as JurusanKey)}
                  className="group flex items-center gap-3 text-left text-sm font-bold text-slate-800 transition-colors hover:text-[#0d6e38]"
                >
                  <span className="text-[#0d6e38] transition-transform group-hover:translate-x-1">
                    ➔
                  </span>
                  <span>{j.name}</span>
                </button>
              ) : (
                <div
                  key={j.name}
                  className="flex cursor-not-allowed items-center gap-3 text-sm font-bold text-slate-400"
                  title="Halaman belum tersedia"
                >
                  <span>➔</span>
                  <span>{j.name}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export type { JurusanKey };
