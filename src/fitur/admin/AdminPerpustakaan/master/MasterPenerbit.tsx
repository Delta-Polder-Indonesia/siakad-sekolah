import { useState } from 'react';
import { Building, Plus, Pencil, Trash2 } from 'lucide-react';
import ConfirmModal from '../../../bersama/ConfirmModal';

interface Penerbit {
  id: string;
  nama: string;
  alamat: string;
  telp: string;
}

const INITIAL_DATA: Penerbit[] = [
  { id: 'P001', nama: 'Erlangga', alamat: 'Jakarta', telp: '021-1234567' },
  { id: 'P002', nama: 'Yudhistira', alamat: 'Bandung', telp: '022-7654321' },
];

export default function MasterPenerbit() {
  const [data, setData] = useState<Penerbit[]>(INITIAL_DATA);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = (id: string) => setDeleteTarget(id);

  return (
    <div className="rounded-md border-2 border-black bg-white">
      <div className="flex items-center gap-2 border-b-2 border-black p-3">
        <Building className="h-5 w-5 text-black" />
        <h2 className="text-xs font-bold tracking-wider text-black uppercase">Data Penerbit</h2>
      </div>

      <div className="p-4">
        <button className="mb-4 flex items-center gap-2 rounded-md border-2 border-black bg-black px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-900">
          <Plus className="h-3.5 w-3.5" />
          Tambah Penerbit
        </button>

        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black text-xs">
            <thead>
              <tr className="bg-white">
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  ID Penerbit
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Nama Penerbit
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Alamat
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  No. Telp
                </th>
                <th className="border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b-2 border-black/10 transition-colors hover:bg-neutral-100"
                >
                  <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                    {item.id}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                    {item.nama}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                    {item.alamat}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                    {item.telp}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button className="flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100">
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button type="button"
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                      >
                        <Trash2 className="h-3 w-3" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={deleteTarget !== null}
        message="Yakin hapus penerbit ini?"
        onConfirm={() => {
          if (deleteTarget) setData(data.filter((p) => p.id !== deleteTarget));
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
