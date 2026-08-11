import { useState } from 'react';
import { Users, Plus, Pencil, Trash2 } from 'lucide-react';
import ConfirmModal from '../../../bersama/ConfirmModal';

interface Anggota {
  id: string;
  nama: string;
  kelas: string;
  hp: string;
  alamat: string;
  status: 'Aktif' | 'Nonaktif';
}

const INITIAL_DATA: Anggota[] = [
  {
    id: 'A001',
    nama: 'Ahmad Rizky',
    kelas: 'VII-A',
    hp: '08123456789',
    alamat: 'Jl. Mawar No. 1',
    status: 'Aktif',
  },
  {
    id: 'A002',
    nama: 'Siti Nurhaliza',
    kelas: 'VIII-B',
    hp: '08198765432',
    alamat: 'Jl. Melati No. 5',
    status: 'Aktif',
  },
];

export default function MasterAnggota() {
  const [data, setData] = useState<Anggota[]>(INITIAL_DATA);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = (id: string) => setDeleteTarget(id);

  return (
    <div className="rounded-md border-2 border-black bg-white">
      <div className="flex items-center gap-2 border-b-2 border-black p-3">
        <Users className="h-5 w-5 text-black" />
        <h2 className="text-xs font-bold tracking-wider text-black uppercase">Data Anggota</h2>
      </div>

      <div className="p-4">
        <button type="button"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
          }}
          className="mb-4 flex items-center gap-2 rounded-md border-2 border-black bg-black px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-900"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Anggota
        </button>

        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black text-xs">
            <thead>
              <tr className="bg-white">
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  ID Anggota
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Nama
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Kelas
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  No. HP
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Alamat
                </th>
                <th className="border-r-2 border-b-2 border-black/10 px-3 py-2.5 text-left font-bold text-black">
                  Status
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
                    {item.kelas}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                    {item.hp}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2.5 font-bold text-black">
                    {item.alamat}
                  </td>
                  <td className="border-r border-black px-3 py-2.5">
                    <span
                      className={`rounded-md border-2 px-2 py-0.5 text-[10px] font-bold ${item.status === 'Aktif' ? 'border-emerald-600 bg-white text-emerald-600' : 'border-black bg-white text-black opacity-60'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button type="button"
                        onClick={() => {
                          setShowForm(true);
                          setEditingId(item.id);
                        }}
                        className="flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1 text-[10px] font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                      >
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
        message="Yakin hapus anggota ini?"
        onConfirm={() => {
          if (deleteTarget) setData(data.filter((a) => a.id !== deleteTarget));
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
