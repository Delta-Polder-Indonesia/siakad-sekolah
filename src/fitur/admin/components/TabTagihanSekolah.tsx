import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import {
  getPengaturanTagihan,
  terapkanTagihanTahunanUntukSemuaSiswa,
} from '../../../data/services';

interface TabTagihanSekolahProps {
  scope: 'teacher' | 'student';
}

export default function TabTagihanSekolah({ scope }: TabTagihanSekolahProps) {
  const [tahunTagihan, setTahunTagihan] = useState(new Date().getFullYear());
  const [nominalTagihan, setNominalTagihan] = useState(250000);
  const [tanggalJatuhTempo, setTanggalJatuhTempo] = useState(10);

  // State untuk notifikasi satu baris
  const [localNotice, setLocalNotice] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // State baru untuk mengontrol pop-up konfirmasi kustom
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const billingSettings = getPengaturanTagihan();
    setNominalTagihan(billingSettings.monthlyAmount);
    setTanggalJatuhTempo(billingSettings.dueDay);
    setTahunTagihan(new Date().getFullYear());
  }, []);

  // Validasi awal sebelum memunculkan konfirmasi kustom
  const preCheckValidation = () => {
    if (!Number.isFinite(tahunTagihan) || tahunTagihan < 2020 || tahunTagihan > 2100) {
      setLocalNotice({ message: '⚠️ Tahun tagihan tidak valid.', type: 'error' });
      return;
    }
    if (!Number.isFinite(nominalTagihan) || nominalTagihan <= 0) {
      setLocalNotice({ message: '⚠️ Nominal tagihan harus lebih dari 0.', type: 'error' });
      return;
    }

    setLocalNotice(null);
    setShowConfirm(true); // Buka pop-up kecil di atas tombol
  };

  // Eksekusi final saat admin menekan tombol "Yakin"
  const handleExecuteTerapkan = () => {
    const day = Math.max(1, Math.min(28, tanggalJatuhTempo));

    terapkanTagihanTahunanUntukSemuaSiswa(tahunTagihan, nominalTagihan, day, scope);

    setLocalNotice({
      message: `✅ Pengaturan tagihan tahun ${tahunTagihan} berhasil diterapkan untuk semua siswa.`,
      type: 'success',
    });
    setShowConfirm(false);
  };

  return (
    <div className="w-full space-y-4 rounded-md border-2 border-black bg-white p-4">
      {/* STRIP HEADER */}
      <div className="border-b-2 border-black pb-2">
        <h3 className="text-xs font-bold tracking-wide text-black uppercase">
          Pengaturan Tagihan Uang Sekolah
        </h3>
        <p className="mt-0.5 text-[10px] text-black">
          Atur nominal bulanan dan tanggal jatuh tempo, lalu terapkan ke seluruh siswa per tahun.
        </p>
      </div>

      {/* FIELD GRID */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Tahun */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold tracking-wide text-black uppercase">Tahun</label>
          <input
            type="number"
            value={tahunTagihan}
            onChange={(e) => {
              setTahunTagihan(Number(e.target.value));
              setLocalNotice(null);
              setShowConfirm(false);
            }}
            className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
          />
        </div>

        {/* Nominal */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold tracking-wide text-black uppercase">
            Nominal Bulanan (Rp)
          </label>
          <input
            type="number"
            min={1000}
            step={1000}
            value={nominalTagihan}
            onChange={(e) => {
              setNominalTagihan(Number(e.target.value));
              setLocalNotice(null);
              setShowConfirm(false);
            }}
            className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
          />
        </div>

        {/* Jatuh Tempo */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold tracking-wide text-black uppercase">
            Tanggal Jatuh Tempo
          </label>
          <input
            type="number"
            min={1}
            max={28}
            value={tanggalJatuhTempo}
            onChange={(e) => {
              setTanggalJatuhTempo(Number(e.target.value));
              setLocalNotice(null);
              setShowConfirm(false);
            }}
            className="w-full rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-colors outline-none hover:border-blue-600 focus:border-blue-600"
          />
        </div>
      </div>

      {/* INFO RINGKAS */}
      <div>
        <p className="text-xs leading-relaxed font-bold text-black">
          Sistem akan membuat <span className="font-bold">12 tagihan</span> per siswa untuk tahun{' '}
          <span className="font-mono font-bold">{tahunTagihan}</span> dengan nominal{' '}
          <span className="rounded-md border-2 border-black bg-neutral-100 px-1.5 py-0.5 font-mono font-bold">
            Rp {new Intl.NumberFormat('id-ID').format(nominalTagihan)}
          </span>{' '}
          jatuh tempo setiap tanggal{' '}
          <span className="font-bold">{Math.max(1, Math.min(28, tanggalJatuhTempo))}</span>. Tagihan
          yang sudah ada sebelumnya tidak akan ditimpa atau diubah.
        </p>
      </div>

      {/* BAR BAWAH: NOTIFIKASI & AREA TOMBOL DENGAN POPUP KONFIRMASI */}
      <div className="relative flex min-h-[44px] flex-col items-center justify-between gap-3 border-t-2 border-black/10 pt-3 sm:flex-row">
        {/* Sisi Kiri: Notifikasi Status Inline */}
        <div className="flex w-full flex-1 items-center sm:w-auto">
          {localNotice && (
            <div
              className={`flex items-center gap-1.5 text-[11px] font-bold tracking-tight ${
                localNotice.type === 'error' ? 'text-red-600' : 'text-black'
              }`}
            >
              {localNotice.type === 'error' ? (
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-black" />
              )}
              <span>{localNotice.message}</span>
            </div>
          )}
        </div>

        {/* Sisi Kanan: Wadah Kontrol Aksi Eksekusi & Pop-up Kustom */}
        <div className="relative flex w-full shrink-0 flex-col items-end gap-2 sm:w-auto">
          {/* POP-UP KECIL KONFIRMASI (Hanya muncul jika lolos validasi) */}
          {showConfirm && (
            <div className="absolute right-0 bottom-full z-10 mb-2 w-64 space-y-2 rounded-md border-2 border-black bg-white p-2.5 text-right">
              <div className="flex items-start gap-1.5 text-left">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                <p className="text-[10px] leading-tight font-bold text-black">
                  Yakin ingin menerapkan 12 tagihan ini ke semua siswa?
                </p>
              </div>
              <div className="flex justify-end gap-1.5 text-[10px]">
                <button type="button"
                  onClick={() => setShowConfirm(false)}
                  className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-bold text-black transition-colors hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button type="button"
                  onClick={handleExecuteTerapkan}
                  className="rounded-md border-2 border-black bg-black px-2.5 py-1 font-bold text-white transition-colors hover:bg-neutral-900"
                >
                  Ya, Yakin
                </button>
              </div>
            </div>
          )}

          {/* TOMBOL UTAMA */}
          <button type="button"
            onClick={preCheckValidation}
            className={`inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black px-4 py-2 text-xs font-bold transition-colors sm:w-auto ${
              showConfirm
                ? 'cursor-not-allowed bg-neutral-100 text-black opacity-60'
                : 'bg-white text-black hover:border-blue-600 hover:text-blue-600'
            }`}
            disabled={showConfirm}
          >
            <Save className="h-3.5 w-3.5" />
            Terapkan Tagihan
          </button>
        </div>
      </div>
    </div>
  );
}
