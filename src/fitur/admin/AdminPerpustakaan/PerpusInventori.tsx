import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Printer,
  Edit,
  Trash2,
  X,
  Save,
  ImageIcon,
  Upload,
  FileText,
} from 'lucide-react';
import { getBooks, addOrUpdateBook, saveBooks } from '../../../data/services';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { useToast } from '../../../components/ui';
import ConfirmModal from '../../bersama/ConfirmModal';
import { Book } from '../../../data/services';

interface PerpusInventoriProps {
  onViewDetail: (id: string) => void;
}

export default function PerpusInventori({ onViewDetail }: PerpusInventoriProps) {
  const storeVersion = useStoreVersion();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Book>>({
    id: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    rack: '',
    stock: 0,
    available: 0,
    isbn: '',
    coverImage: '',
    description: '',
  });

  // State untuk preview cover
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const allBooks = useMemo(() => getBooks(), [storeVersion]);

  const filtered = allBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingBook(null);
    setCoverPreview(null);
    setFormData({
      id: `B-${Date.now().toString().slice(-4)}`,
      title: '',
      author: '',
      category: 'Fiksi',
      publisher: '',
      rack: 'A1',
      stock: 1,
      available: 1,
      isbn: '',
      coverImage: '',
      description: '',
    });
    setShowForm(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setCoverPreview(book.coverImage || null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteBookId(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteBookId) return;
    const next = allBooks.filter((b) => b.id !== deleteBookId);
    saveBooks(next);
    setDeleteBookId(null);
    showToast('success', '✅ Buku berhasil dihapus dari inventori.');
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('error', '⚠️ Ukuran gambar maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCoverPreview(base64);
      setFormData((prev: Partial<Book>) => ({ ...prev, coverImage: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setFormData((prev: Partial<Book>) => ({ ...prev, coverImage: '' }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateBook(formData as Book);
    setShowForm(false);
    setCoverPreview(null);
    showToast('success', `✅ ${editingBook ? 'Data buku diperbarui' : 'Buku baru ditambahkan'}.`);
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="my-8 w-full max-w-lg overflow-hidden rounded-md border-2 border-black bg-white"
          >
            <div className="flex items-center justify-between border-b-2 border-black bg-white p-4">
              <h3 className="font-bold tracking-tight text-black uppercase">
                {editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setCoverPreview(null);
                }}
                className="rounded-md border-2 border-black bg-white p-1 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
              {/* ID Buku */}
              <div>
                <label className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                  ID Buku
                </label>
                <input
                  value={formData.id || ''}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                  required
                  readOnly={!!editingBook}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Judul */}
                <div className="col-span-2">
                  <label className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                    Judul Literatur
                  </label>
                  <input
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                    required
                  />
                </div>
                {/* Penulis */}
                <div>
                  <label className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                    Penulis
                  </label>
                  <input
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                    required
                  />
                </div>
                {/* ISBN */}
                <div>
                  <label className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                    ISBN
                  </label>
                  <input
                    value={formData.isbn || ''}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="978-602-xxx-xx-x"
                    className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                  />
                </div>
                {/* Kategori */}
                <div>
                  <label className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                    Kategori
                  </label>
                  <select
                    value={formData.category || 'Fiksi'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                  >
                    <option value="Fiksi">Fiksi</option>
                    <option value="Non-Fiksi">Non-Fiksi</option>
                    <option value="Sains">Sains</option>
                    <option value="Sejarah">Sejarah</option>
                    <option value="Religi">Religi</option>
                    <option value="Biografi">Biografi</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Pelajaran">Pelajaran</option>
                  </select>
                </div>
                {/* Penerbit */}
                <div>
                  <label className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                    Penerbit
                  </label>
                  <input
                    value={formData.publisher || ''}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                  />
                </div>
                {/* Stok */}
                <div>
                  <label className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                    Stok Total
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock ?? 0}
                    onChange={(e) => {
                      const stock = Number(e.target.value);
                      const currentStock = formData.stock || 0;
                      const currentAvailable = formData.available || 0;
                      const borrowed = currentStock - currentAvailable;

                      setFormData({
                        ...formData,
                        stock,
                        available: editingBook ? Math.max(0, stock - borrowed) : stock,
                      });
                    }}
                    className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                    required
                  />
                </div>
                {/* Rak */}
                <div>
                  <label className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                    Letak Rak
                  </label>
                  <input
                    value={formData.rack || ''}
                    onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                    placeholder="Contoh: A1, B2, C3"
                    className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              {/* Upload Cover */}
              <div>
                <label className="mb-1 block text-[10px] font-bold tracking-wider text-black uppercase">
                  Sampul Buku
                </label>
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  {coverPreview ? (
                    <div className="relative flex-shrink-0">
                      <img
                        src={coverPreview}
                        alt="Preview cover"
                        className="h-32 w-24 rounded-md border-2 border-black object-cover"  loading="lazy" decoding="async" />
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-md border border-black bg-white text-xs font-bold text-black transition-colors hover:border-blue-600 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-32 w-24 flex-col items-center justify-center rounded-md border-2 border-black bg-white text-black">
                      <ImageIcon className="mb-1 h-8 w-8 text-black" />
                      <span className="text-[10px] font-bold">Belum ada</span>
                    </div>
                  )}
                  {/* Upload Button */}
                  <div className="flex-1">
                    <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100">
                      <Upload className="h-4 w-4 text-black" />
                      <span>{coverPreview ? 'Ganti Gambar' : 'Upload Cover'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-1 text-[10px] font-bold text-black">
                      Format: JPG, PNG. Maks: 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="mb-1 flex items-center gap-1 text-[10px] font-bold text-black uppercase">
                  <FileText className="h-3 w-3" />
                  Deskripsi / Sinopsis Buku
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tulis deskripsi singkat tentang isi buku ini..."
                  rows={4}
                  className="w-full resize-none rounded border border-black bg-white px-3 py-2 text-sm font-bold text-black outline-none focus:border-blue-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t-2 border-black bg-white p-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setCoverPreview(null);
                }}
                className="rounded-md border border-black bg-white px-4 py-2 text-xs font-bold text-black uppercase transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md border border-black bg-white px-6 py-2 text-xs font-bold text-black uppercase transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                <Save className="h-3.5 w-3.5" /> Simpan Data
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-md border-2 border-black bg-white">
        <div className="border-b-2 border-black p-4">
          <h2 className="text-xs font-bold tracking-wider text-black uppercase">
            Data Inventory Buku
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-4">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
          >
            <Plus className="h-3.5 w-3.5" />
            Entry Buku Baru
          </button>
          <button className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100">
            <Printer className="h-3.5 w-3.5" />
            Cetak Katalog
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-black">Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-36 rounded-md border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-black bg-white">
                {['Cover', 'ID', 'Judul', 'Pengarang', 'Stok', 'Kategori', 'Rak', 'Aksi'].map(
                  (h) => (
                    <th
                      key={h}
                      className={`border-r-2 border-black/10 px-3 py-2.5 text-left font-bold text-black last:border-r-0 ${h === 'Cover' ? 'w-16' : ''}`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr
                  key={book.id}
                  className="border-b-2 border-black/10 bg-white transition-colors hover:bg-neutral-100"
                >
                  {/* Cover Preview */}
                  <td className="border-r-2 border-black/10 px-3 py-2.5">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-14 w-10 cursor-pointer rounded-md border-2 border-black object-cover transition hover:scale-110"
                        onClick={() => onViewDetail(book.id)}
                        title="Klik untuk detail"
                      />
                    ) : (
                      <div className="flex h-14 w-10 items-center justify-center rounded-md border-2 border-black bg-white">
                        <ImageIcon className="h-4 w-4 text-black" />
                      </div>
                    )}
                  </td>
                  <td className="border-r border-black px-3 py-2.5 font-mono text-[10px] font-bold text-black">
                    {book.id}
                  </td>
                  <td
                    className="max-w-[180px] cursor-pointer truncate border-r border-black px-3 py-2.5 font-bold text-black hover:text-blue-600 hover:underline"
                    onClick={() => onViewDetail(book.id)}
                    title={book.title}
                  >
                    {book.title}
                  </td>
                  <td className="border-r border-black px-3 py-2.5 font-bold text-black">
                    {book.author}
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2.5">
                    <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 text-[10px] font-bold text-black">
                      {book.available} / {book.stock}
                    </span>
                  </td>
                  <td className="border-r-2 border-black/10 px-3 py-2.5">
                    <span className="rounded-md border-2 border-black bg-white px-1.5 py-0.5 text-[10px] font-bold text-black">
                      {book.category}
                    </span>
                  </td>
                  <td className="border-r border-black px-3 py-2.5 font-mono text-[10px] font-bold text-black">
                    {book.rack}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(book)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-white text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-white text-black transition-colors hover:border-blue-600 hover:bg-neutral-100"
                        title="Hapus"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      <ConfirmModal
        open={deleteBookId !== null}
        title="Hapus Buku"
        message={`Yakin ingin menghapus buku ini dari inventori secara permanen?`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteBookId(null)}
      />
    </div>
  );
}
