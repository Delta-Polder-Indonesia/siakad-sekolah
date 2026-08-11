type BeasiswaKey = 'adaro' | 'pelindo' | 'selengkapnya';

type BeasiswaItem = {
  title: string;
  key: BeasiswaKey;
  highlight?: boolean;
};

const beasiswaItems: BeasiswaItem[] = [
  {
    title: 'Beasiswa Adaro Foundation 2025',
    key: 'adaro',
  },
  {
    title: 'Beasiswa Pelindo Prestasi 2025',
    key: 'pelindo',
  },
  {
    title: 'Beasiswa Selengkapnya',
    key: 'selengkapnya',
    highlight: true,
  },
];

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      viewBox="0 0 256 256"
      className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
    >
      <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
    </svg>
  );
}

type BeasiswaSectionProps = {
  onOpenBeasiswa: (key: BeasiswaKey) => void;
};

export default function BeasiswaSection({ onOpenBeasiswa }: BeasiswaSectionProps) {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <section
      id="beasiswa-calon-mahasiswa"
      className="bg-cover bg-center py-10 sm:py-16"
      style={{
        backgroundImage: `url('${baseUrl}images/compressed/campus-life/bg-kampus-merdeka.webp')`,
      }}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-[1fr_400px] md:gap-16 md:px-8">
        {/* Kiri */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="https://konten.usu.ac.id/storage/satker/0/icons/flower-sec2.svg"
              alt="Ornamen Beasiswa"
              width={32}
              height={32}
              className="h-8 w-8"  loading="lazy" decoding="async" />
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Beasiswa</h2>
          </div>

          <p className="text-xs leading-5 text-slate-800 sm:text-sm sm:leading-6">
            Temukan berbagai beasiswa di Universitas Sumatera Utara (USU) untuk memastikan bahwa USU
            adalah pilihan terbaik untuk pendidikanmu. Sebagai universitas Tri Dharma, USU
            menyediakan beasiswa internal dan eksternal yang dapat dipilih oleh mahasiswa. Program
            beasiswa kami membantu mahasiswa berprestasi, mahasiswa berkebutuhan finansial, dan
            mahasiswa berbakat dalam bidang pendidikan tertentu. Jenis beasiswa yang disediakan
            termasuk prestasi, kebutuhan, dan bakat, serta pemerintah, nasional, dan internasional.
            Kami mendorong mahasiswa kami untuk mengeksplorasi penawaran beasiswa dari universitas
            dan memanfaatkan kesempatan untuk mendanai pendidikan Anda di USU.
          </p>
        </div>

        {/* Kanan */}
        <div className="h-fit rounded-2xl bg-white/60 p-4 shadow-[0_2px_8px_0_rgba(0,0,0,0.10)] backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            {beasiswaItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onOpenBeasiswa(item.key)}
                className={
                  item.highlight
                    ? 'group flex w-fit items-center gap-2 rounded-xl bg-[#0d6e38] px-3 py-2 text-white shadow-md transition-all duration-200 hover:bg-[#0a5229]'
                    : 'group flex w-fit items-center gap-2 rounded-xl px-2 py-1.5 text-slate-900 transition-all duration-200 hover:bg-green-50 hover:text-green-700'
                }
              >
                {!item.highlight && <ArrowIcon />}
                <span className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                  <span>{item.title}</span>
                  {item.highlight && <ArrowIcon />}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export type { BeasiswaKey };
