import { useState } from 'react';
import { BookMarked, Plus, Pencil, Trash2 } from 'lucide-react';
import ConfirmModal from '../../../bersama/ConfirmModal';

interface Buku {
  id: string;
  judul: string;
  pengarang: string;
  penerbit: string;
  tahun: string;
  stok: number;
}

const INITIAL_DATA: Buku[] = [
  {
    id: 'B001',
    judul: 'Matematika Dasar',
    pengarang: 'Prof. Budi',
    penerbit: 'Erlangga',
    tahun: '2023',
    stok: 15,
  },
  {
    id: 'B002',
    judul: 'Bahasa Indonesia',
    pengarang: 'Dr. Ani',
    penerbit: 'Yudhistira',
    tahun: '2024',
    stok: 20,
  },
];

export default function MasterBuku() {
  const [data, setData] = useState<Buku[]>(INITIAL_DATA);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = (id: string) => setDeleteTarget(id);

  return (
    <div className="rounded-md border-2 border-black bg-white">
      <div className="flex items-center gap-2 border-b-2 border-black p-3">
        <BookMarked className="h-5 w-5 text-black" />
        <h2 className="text-xs font-bold tracking-wider text-black uppercase">Data Buku</h2>
      </div>

      <div className="p-4">
        <button className="mb-4 flex items-center gap-2 rounded-md border-2 border-black bg-black px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-900">
          <Plus className="h-3.5 w-3.5" />
          Tambah Buku
        </button>

        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black text-xs">
            <thead>
              <tr className="bg-white">
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  ID Buku
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Judul
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Pengarang
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Penerbit
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Tahun
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Stok
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
                    {item.judul}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                    {item.pengarang}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                    {item.penerbit}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                    {item.tahun}
                  </td>
                  <td className="border-r border-black px-3 py-2.5">
                    <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 text-[10px] font-bold text-black">
                      {item.stok}
                    </span>
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
        message="Yakin hapus buku ini?"
        onConfirm={() => {
          if (deleteTarget) setData(data.filter((b) => b.id !== deleteTarget));
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
