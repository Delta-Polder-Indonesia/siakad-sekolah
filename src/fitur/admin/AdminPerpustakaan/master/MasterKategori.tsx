import { useState } from 'react';
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react';
import ConfirmModal from '../../../bersama/ConfirmModal';

interface Kategori {
  id: string;
  nama: string;
  keterangan: string;
}

const INITIAL_DATA: Kategori[] = [
  { id: 'K001', nama: 'Pelajaran', keterangan: 'Buku pelajaran sekolah' },
  { id: 'K002', nama: 'Novel', keterangan: 'Karya fiksi' },
];

export default function MasterKategori() {
  const [data, setData] = useState<Kategori[]>(INITIAL_DATA);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = (id: string) => setDeleteTarget(id);

  return (
    <div className="rounded-md border-2 border-black bg-white">
      <div className="flex items-center gap-2 border-b-2 border-black p-3">
        <Tag className="h-5 w-5 text-black" />
        <h2 className="text-xs font-bold tracking-wider text-black uppercase">Data Kategori</h2>
      </div>

      <div className="p-4">
        <button className="mb-4 flex items-center gap-2 rounded-md border-2 border-black bg-black px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-900">
          <Plus className="h-3.5 w-3.5" />
          Tambah Kategori
        </button>

        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black text-xs">
            <thead>
              <tr className="bg-white">
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  ID Kategori
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Nama Kategori
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Keterangan
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
                    {item.keterangan}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button className="flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-black hover:bg-neutral-100">
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button type="button"
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
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
        message="Yakin hapus kategori ini?"
        onConfirm={() => {
          if (deleteTarget) setData(data.filter((k) => k.id !== deleteTarget));
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
