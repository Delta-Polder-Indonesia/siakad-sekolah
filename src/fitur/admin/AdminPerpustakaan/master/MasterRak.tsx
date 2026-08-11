import { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import ConfirmModal from '../../../bersama/ConfirmModal';

interface Rak {
  kode: string;
  lokasi: string;
  kapasitas: number;
  terisi: number;
}

const INITIAL_DATA: Rak[] = [
  { kode: 'A01', lokasi: 'Ruang Baca Lt. 1', kapasitas: 100, terisi: 85 },
  { kode: 'A02', lokasi: 'Ruang Baca Lt. 2', kapasitas: 100, terisi: 60 },
];

export default function MasterRak() {
  const [data, setData] = useState<Rak[]>(INITIAL_DATA);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = (kode: string) => setDeleteTarget(kode);

  return (
    <div className="rounded-md border-2 border-black bg-white">
      <div className="flex items-center gap-2 border-b-2 border-black p-3">
        <MapPin className="h-5 w-5 text-black" />
        <h2 className="text-xs font-bold tracking-wider text-black uppercase">Data Rak</h2>
      </div>

      <div className="p-4">
        <button className="mb-4 flex items-center gap-2 rounded-md border-2 border-black bg-black px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-900">
          <Plus className="h-3.5 w-3.5" />
          Tambah Rak
        </button>

        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black text-xs">
            <thead>
              <tr className="bg-white">
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Kode Rak
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Lokasi
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Kapasitas
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Terisi
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Sisa
                </th>
                <th className="border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const sisa = item.kapasitas - item.terisi;
                const persen = (item.terisi / item.kapasitas) * 100;
                return (
                  <tr
                    key={item.kode}
                    className="border-b-2 border-black/10 transition-colors hover:bg-neutral-100"
                  >
                    <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                      {item.kode}
                    </td>
                    <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                      {item.lokasi}
                    </td>
                    <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                      {item.kapasitas}
                    </td>
                    <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                      {item.terisi}
                    </td>
                    <td className="border-r border-black px-3 py-2.5">
                      <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 text-[10px] font-bold text-black">
                        {sisa}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1">
                        <button className="flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100">
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button type="button"
                          onClick={() => handleDelete(item.kode)}
                          className="flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                        >
                          <Trash2 className="h-3 w-3" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={deleteTarget !== null}
        message="Yakin hapus rak ini?"
        onConfirm={() => {
          if (deleteTarget) setData(data.filter((r) => r.kode !== deleteTarget));
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
