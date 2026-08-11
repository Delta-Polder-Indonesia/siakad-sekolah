# 🎨 STANDAR MARKUP HALAMAN ROLE — Portal SIAKAD

> Dokumen ini adalah **satu-satunya acuan gaya markup** untuk semua halaman
> role (guru, murid, orang tua, admin). Tujuan: tidak ada lagi "belang-belang"
> antar halaman. Gunakan komponen dari `src/components/ui/` — JANGAN menulis
> class Tailwind manual jika komponen sudah tersedia.

---

## 1. Prinsip Warna

| Elemen | Warna | Contoh |
|---|---|---|
| Struktur (border, tombol, header) | **Hitam-putih** | `border-2 border-black`, `bg-black text-white` |
| Warna data (legend, chart, status) | Boleh berwarna | hijau/merah/amber/biru untuk makna |
| Fokus input | Hitam | `focus:border-black focus:bg-neutral-50` |

> ⛔ JANGAN gunakan `bg-blue-600`, `border-blue-600`, `hover:border-blue-600`
> untuk elemen struktural (tombol, tab, input). Biru hanya untuk warna data
> (legend, kalender hari ini) dan status badge.

## 2. Komponen Wajib

| Komponen | Ganti markup manual ini | Props |
|---|---|---|
| `Button` | `<button className="border-2 border-black bg-black...">` | `variant` (primary/secondary/ghost/danger), `size`, `loading` |
| `Input` | `<input className="border-2 border-black...">` + label | `label`, `error` |
| `Card` | `<div className="rounded-md border-2 border-black bg-white">` | `title`, `subtitle`, `actions` |
| `StatCard` | kartu statistik dashboard | `label`, `value`, `icon`, `alert`, `loading` |
| `PageHeader` | header halaman (`border-b-2 border-black` + h1) | `title`, `subtitle`, `actions` |
| `SectionTitle` | judul seksi uppercase | `children` |
| `Table` | tabel data | `columns`, `data`, `rowKey`, `emptyMessage` |
| `Badge` | status pill | `variant` (default/success/warning/danger/info) |

## 3. Pola Baku

**Header halaman:**
```tsx
<PageHeader
  title="Dasbor Guru"
  subtitle={<span>{user?.name || '-'}</span>}
  actions={<Button size="sm" onClick={...}>Aksi</Button>}
/>
```

**Judul seksi:**
```tsx
<SectionTitle>Ringkasan Kehadiran</SectionTitle>
```

**Tombol:**
```tsx
<Button size="sm" onClick={handleX}>Simpan</Button>
<Button variant="secondary" size="sm" onClick={handleBatal}>Batal</Button>
```

**Input berlabel:**
```tsx
<Input label="Nama Siswa" value={name} onChange={...} placeholder="..." />
```

**Tabel:**
```tsx
<Table
  columns={[
    { key: 'nama', header: 'Nama' },
    { key: 'status', header: 'Status', render: (row) => <Badge variant="success">{row.status}</Badge> },
  ]}
  data={rows}
  rowKey={(r) => r.id}
/>
```

**Kartu statistik:**
```tsx
<StatCard label="Hadir" value={stats.hadir} icon={CheckCircle} />
```

## 4. Aturan Tambahan

- Semua `<button>` ber-`onClick` WAJIB `type="button"` (sudah diterapkan).
- Semua `<img>` WAJIB punya `alt`.
- Tanpa emoji, tanpa animasi mengambang (float/pulse berlebihan). Ikon dari `lucide-react` diperbolehkan.
- Font: konsisten — judul `text-lg font-bold`, label seksi `text-[10px] font-bold tracking-wider uppercase`, isi `text-xs`.

## 5. Target

Setiap halaman role baru ATAU refactor halaman lama WAJIB memakai komponen
di atas. Dengan begitu kesan visual antar halaman identik dan profesional.
