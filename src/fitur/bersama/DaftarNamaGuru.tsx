import { useMemo, useState } from 'react';
import { getClasses, getTeachers } from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Search } from 'lucide-react';

export default function DaftarNamaGuru() {
  const storeVersion = useStoreVersion();
  const [searchQuery, setSearchQuery] = useState('');

  const daftarGuru = useMemo(() => {
    const classes = getClasses();
    return getTeachers().map((item) => ({
      id: item.id,
      name: item.name,
      subject: item.subject,
      avatar: item.avatar,
      whatsapp: item.whatsapp || item.phone || '',
      kelasAjar:
        item.classIds
          .map((classId) => classes.find((classItem) => classItem.id === classId)?.name || '')
          .filter(Boolean)
          .join(', ') || '-',
    }));
  }, [storeVersion]);

  const filteredGuru = useMemo(() => {
    if (!searchQuery.trim()) return daftarGuru;
    const query = searchQuery.toLowerCase();
    return daftarGuru.filter(
      (g) =>
        g.name.toLowerCase().includes(query) ||
        g.subject.toLowerCase().includes(query) ||
        g.kelasAjar.toLowerCase().includes(query)
    );
  }, [daftarGuru, searchQuery]);

  return (
    <div className="w-full space-y-4 bg-white p-4 text-xs font-bold text-black antialiased selection:bg-blue-100">
      {/* Header */}
      <div className="mb-4 border-b border-black pb-4">
        <h1 className="text-base font-bold text-black uppercase">Daftar Nama Guru</h1>
        <p className="mt-1 text-xs font-bold text-black">
          Informasi profil korespondensi staf pengajar dan kurikulum.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Cari nama guru / mata pelajaran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-black bg-white py-2 pr-3 pl-9 text-xs font-bold text-black placeholder:font-normal placeholder:text-gray-500 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto rounded-md border border-black bg-white">
        <table className="w-full min-w-[800px] border-collapse text-xs">
          <thead>
            <tr className="border-b border-black bg-gray-50 font-bold text-black uppercase">
              <th className="w-10 px-4 py-3 text-left">No</th>
              <th className="w-14 px-4 py-3 text-left">Profil</th>
              <th className="px-4 py-3 text-left">Nama Guru</th>
              <th className="w-48 px-4 py-3 text-left">Mata Pelajaran</th>
              <th className="w-56 px-4 py-3 text-left">Kelas Binaan</th>
              <th className="w-40 px-4 py-3 text-right">Kontak WhatsApp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black text-black">
            {filteredGuru.map((guru, index) => (
              <tr key={guru.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-black">{index + 1}</td>
                <td className="px-4 py-3">
                  {guru.avatar ? (
                    <img
                      src={guru.avatar}
                      alt={guru.name}
                      className="h-8 w-8 rounded-full border border-black object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black bg-white text-xs font-bold text-black">
                      {guru.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-bold text-black">{guru.name}</td>
                <td className="px-4 py-3 font-bold text-black">{guru.subject}</td>
                <td
                  className="max-w-[200px] truncate px-4 py-3 font-bold text-black"
                  title={guru.kelasAjar}
                >
                  {guru.kelasAjar}
                </td>
                <td className="px-4 py-3 text-right">
                  {guru.whatsapp ? (
                    <a
                      href={`https://wa.me/${guru.whatsapp.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-md border border-black bg-white px-3 py-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:text-blue-600"
                    >
                      {guru.whatsapp}
                    </a>
                  ) : (
                    <span className="px-4 font-bold text-black">—</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredGuru.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="border-t border-black bg-white py-8 text-center text-xs font-bold text-black"
                >
                  Tidak ada data guru yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
