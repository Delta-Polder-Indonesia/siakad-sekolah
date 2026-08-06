import { useState, useEffect, useMemo } from 'react';
import { dataGuruPegawai, type GuruPegawaiItem } from './dataGuruPegawai';
import { namaSekolah } from './dataSekolah';

// ============================================================================
// KOMPONEN BANTU
// ============================================================================

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <dt className="text-[13px] text-slate-600">{label}</dt>
    <dd className="mt-1 text-[15px] text-slate-900">{value || '—'}</dd>
  </div>
);

const PersonCard = ({ person, onClick }: { person: GuruPegawaiItem; onClick: () => void }) => {
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  const imageSrc = person.foto
    ? `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}${person.foto.replace(/^\//, '')}`
    : null;

  return (
    <button onClick={onClick} className="group w-full text-left focus:outline-none">
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-slate-200 bg-slate-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={person.nama}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null; // Menghindari infinite loop
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[13px] text-slate-400">
            Tanpa Foto
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[13px] font-semibold tracking-wide text-slate-600">{person.jabatan}</p>
        <p className="mt-1.5 text-[15px] font-bold text-slate-900">{person.nama}</p>
        {person.mataPelajaran && (
          <p className="mt-1 text-[13px] text-slate-500">{person.mataPelajaran}</p>
        )}
      </div>
    </button>
  );
};

// ============================================================================
// KOMPONEN UTAMA
// ============================================================================

const FILTER_TABS = ['Semua', 'Guru', 'Pegawai', 'Satpam'] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function GuruPegawaiPage() {
  const [filterStatus, setFilterStatus] = useState<FilterTab>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<GuruPegawaiItem | null>(null);

  // Kunci scroll halaman saat modal terbuka dan tanggani tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPerson(null);
      }
    };

    if (selectedPerson) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPerson]);

  // Optimalisasi perhitungan data menggunakan useMemo
  const filteredItems = useMemo(() => {
    const sorted = [...dataGuruPegawai].sort((a, b) => a.tingkatan - b.tingkatan);
    const q = searchQuery.trim().toLowerCase();

    return sorted.filter((item) => {
      const matchStatus = filterStatus === 'Semua' || item.status === filterStatus;
      if (!matchStatus) return false;

      if (!q) return true;

      const matchNama = item.nama.toLowerCase().includes(q);
      const matchJabatan = item.jabatan.toLowerCase().includes(q);
      const matchMapel = item.mataPelajaran ? item.mataPelajaran.toLowerCase().includes(q) : false;

      return matchNama || matchJabatan || matchMapel;
    });
  }, [filterStatus, searchQuery]);

  const groupedByTingkatan = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        if (!acc[item.tingkatan]) acc[item.tingkatan] = [];
        acc[item.tingkatan].push(item);
        return acc;
      },
      {} as Record<number, GuruPegawaiItem[]>
    );
  }, [filteredItems]);

  const tingkatanOrder = useMemo(() => {
    return [1, 2, 3, 4, 5, 6].filter((t) => groupedByTingkatan[t]?.length > 0);
  }, [groupedByTingkatan]);

  const baseUrl = import.meta.env.BASE_URL ?? '/';

  return (
    <div className="bg-white font-serif">
      {/* HERO — Judul + Sub-heading */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-4 md:px-12 md:pt-10">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Guru & Pegawai</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-700">
          Direktori tenaga pendidik, tenaga kependidikan, dan staf pendukung {namaSekolah}.
        </p>
      </div>

      {/* FILTER & SEARCH */}
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-8">
            {FILTER_TABS.map((tab) => {
              const isActive = filterStatus === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`relative pb-2 text-[15px] font-medium transition-colors ${
                    isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-slate-900" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <svg
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari nama atau jabatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-0 border-b border-slate-300 bg-transparent py-2 pl-10 text-[15px] focus:border-slate-900 focus:outline-none sm:w-72"
            />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center text-[15px] text-slate-500">
            Tidak ada data yang cocok dengan pencarian Anda.
          </div>
        ) : (
          <div className="space-y-16 pt-10 md:space-y-20 md:pt-12">
            {tingkatanOrder.map((tingkatan) => {
              const items = groupedByTingkatan[tingkatan] || [];
              const label = items[0]?.tingkatLabel ?? '';

              return (
                <section key={tingkatan}>
                  <div className="mb-8 flex items-baseline justify-between border-b border-slate-200 pb-4">
                    <h3 className="text-2xl font-bold text-slate-900 md:text-[26px]">{label}</h3>
                    <p className="text-[13px] text-slate-500">{items.length} orang</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
                    {items.map((person) => (
                      <PersonCard
                        key={person.id}
                        person={person}
                        onClick={() => setSelectedPerson(person)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================== MODAL DETAIL ==================== */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/70 p-4"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden border border-slate-200 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 flex justify-end border-b border-slate-200 bg-white px-6 pt-5 pb-2">
              <button
                onClick={() => setSelectedPerson(null)}
                className="text-slate-400 transition-colors hover:text-slate-900"
              >
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                {/* Foto */}
                <div className="md:col-span-5">
                  <div className="relative overflow-hidden border border-slate-200 bg-slate-100">
                    {selectedPerson.foto && (
                      <img
                        src={`${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}${selectedPerson.foto.replace(/^\//, '')}`}
                        alt={selectedPerson.nama}
                        className="h-auto max-h-[520px] w-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Detail Biodata */}
                <div className="md:col-span-7">
                  <p className="text-[13px] font-semibold text-slate-600">
                    {selectedPerson.jabatan}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900 md:text-[26px]">
                    {selectedPerson.nama}
                  </h3>
                  {selectedPerson.mataPelajaran && (
                    <p className="mt-3 text-[15px] text-slate-700">
                      {selectedPerson.mataPelajaran}
                    </p>
                  )}

                  {/* Data Kepegawaian */}
                  <div className="mt-10">
                    <h4 className="mb-4 text-[13px] font-semibold tracking-wider text-slate-600 uppercase">
                      Data Kepegawaian
                    </h4>
                    <div className="grid grid-cols-1 gap-y-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
                      <InfoRow label="NIP" value={selectedPerson.nip} />
                      <InfoRow label="NUPTK" value={selectedPerson.nuptk} />
                      <InfoRow
                        label="Status Kepegawaian"
                        value={selectedPerson.statusKepegawaian}
                      />
                      <InfoRow label="Pendidikan Terakhir" value={selectedPerson.pendidikan} />
                      <InfoRow label="Instansi" value={selectedPerson.instansi} />
                      <InfoRow label="Keterangan" value={selectedPerson.keterangan} />
                    </div>
                  </div>

                  {/* Data Pribadi & Kontak */}
                  <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div>
                      <h4 className="mb-4 text-[13px] font-semibold tracking-wider text-slate-600 uppercase">
                        Data Pribadi
                      </h4>
                      <div className="space-y-6 border-t border-slate-200 pt-6">
                        <InfoRow label="Jenis Kelamin" value={selectedPerson.jenisKelamin} />
                        <InfoRow label="Agama" value={selectedPerson.agama} />
                        <InfoRow
                          label="Tempat, Tanggal Lahir"
                          value={selectedPerson.tempatTanggalLahir}
                        />
                        <InfoRow label="Umur" value={selectedPerson.umur} />
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-4 text-[13px] font-semibold tracking-wider text-slate-600 uppercase">
                        Kontak
                      </h4>
                      <div className="space-y-6 border-t border-slate-200 pt-6">
                        <InfoRow label="Alamat" value={selectedPerson.alamat} />
                        <InfoRow label="Kode Pos" value={selectedPerson.kodepos} />
                        <InfoRow label="Telepon" value={selectedPerson.telepon} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
