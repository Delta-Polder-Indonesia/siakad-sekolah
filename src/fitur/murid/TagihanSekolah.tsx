import { useMemo, useState } from 'react';
import { CreditCard, Landmark, Wallet, CircleDollarSign, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { exportTagihanPdf } from '../../utils/export';
import { useAuth } from '../../context/AuthContext';
import {
  bayarTagihanSekolah,
  getTagihanSekolahBySiswa,
  getTahunTagihanSiswa,
} from '../../data/services';
import type { TagihanSekolah } from '../../types';
import { useStoreVersion } from '../../hooks/useStoreVersion';

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const PAYMENT_METHODS: Array<{
  value: NonNullable<TagihanSekolah['paymentMethod']>;
  label: string;
}> = [
  { value: 'atm', label: 'ATM Transfer' },
  { value: 'mobile_banking', label: 'Mobile Banking' },
  { value: 'internet_banking', label: 'Internet Banking' },
  { value: 'ewallet', label: 'E-Wallet' },
  { value: 'tunai', label: 'Tunai di Tata Usaha' },
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTanggalWaktu(timestamp?: number) {
  if (!timestamp) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp);
}

function getPaymentMethodLabel(method?: string) {
  if (!method) return '-';
  return PAYMENT_METHODS.find((item) => item.value === method)?.label || method;
}

export default function TagihanSekolahPage() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] =
    useState<NonNullable<TagihanSekolah['paymentMethod']>>('atm');
  const [infoMessage, setInfoMessage] = useState<string>('');

  const availableYears = useMemo(() => {
    if (!user) return [];
    return getTahunTagihanSiswa(user.id);
  }, [user, storeVersion]);

  const activeYear = selectedYear ?? availableYears[0] ?? new Date().getFullYear();

  const bills = useMemo(() => {
    if (!user) return [];
    return getTagihanSekolahBySiswa(user.id, activeYear);
  }, [user, activeYear, storeVersion]);

  const ringkasan = useMemo(() => {
    const lunas = bills.filter((item) => item.status === 'lunas');
    const belumLunas = bills.filter((item) => item.status === 'belum_lunas');
    return {
      totalTagihan: bills.reduce((sum, item) => sum + item.amount, 0),
      totalLunas: lunas.reduce((sum, item) => sum + item.amount, 0),
      totalBelumLunas: belumLunas.reduce((sum, item) => sum + item.amount, 0),
      jumlahLunas: lunas.length,
      jumlahBelumLunas: belumLunas.length,
    };
  }, [bills]);

  const billsToPay = useMemo(() => {
    return bills.filter(
      (item) => selectedBillIds.includes(item.id) && item.status === 'belum_lunas'
    );
  }, [bills, selectedBillIds]);

  const totalSelectedAmount = useMemo(() => {
    return billsToPay.reduce((sum, item) => sum + item.amount, 0);
  }, [billsToPay]);

  const handleToggleSelectBill = (id: string) => {
    setInfoMessage('');
    setSelectedBillIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBayarMulti = () => {
    if (billsToPay.length === 0) return;

    billsToPay.forEach((bill) => {
      bayarTagihanSekolah(bill.id, selectedMethod);
    });

    const listBulan = billsToPay.map((b) => MONTH_NAMES[b.month - 1]).join(', ');
    setInfoMessage(
      `Pembayaran untuk periode [ ${listBulan} ] tahun ${activeYear} berhasil diproses.`
    );
    setSelectedBillIds([]);
  };

  const handleUnduhBuktiPdf = (bill: TagihanSekolah) => {
    const paymentLabel = getPaymentMethodLabel(bill.paymentMethod);
    const nomorTransaksi = `TRX-${bill.year}${String(bill.month).padStart(2, '0')}-${bill.studentId.toUpperCase()}`;
    const tanggalCetak = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(Date.now());

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 52;
    let cursorY = 66;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Bukti Pembayaran Uang Sekolah', marginX, cursorY);

    cursorY += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Dokumen pembayaran resmi siswa', marginX, cursorY);

    cursorY += 16;
    doc.setDrawColor(0, 0, 0);
    doc.line(marginX, cursorY, 545, cursorY);

    cursorY += 28;
    doc.setTextColor(0, 0, 0);
    const detailRows: Array<[string, string]> = [
      ['Nomor Transaksi', nomorTransaksi],
      ['Tanggal Cetak', tanggalCetak],
      ['Nama Siswa', user?.name || '-'],
      ['ID Siswa', bill.studentId],
      ['Periode', `${MONTH_NAMES[bill.month - 1]} ${bill.year}`],
      ['Metode Pembayaran', paymentLabel],
      ['Waktu Pembayaran', formatTanggalWaktu(bill.paidAt)],
      ['Status', 'Lunas'],
    ];

    detailRows.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`${label}:`, marginX, cursorY);

      doc.setFont('helvetica', 'normal');
      const wrappedValue = doc.splitTextToSize(value, 350);
      doc.text(wrappedValue, marginX + 140, cursorY);
      cursorY += Math.max(18, wrappedValue.length * 14);
    });

    cursorY += 12;
    doc.setDrawColor(0, 0, 0);
    doc.rect(marginX, cursorY, 493, 72);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('Total Pembayaran', marginX + 14, cursorY + 24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(formatRupiah(bill.amount), marginX + 14, cursorY + 54);

    cursorY += 98;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      'Dokumen ini dibuat otomatis oleh sistem absensi dan administrasi sekolah.',
      marginX,
      cursorY
    );

    const namaBulan = MONTH_NAMES[bill.month - 1].toLowerCase();
    const namaFile = `bukti-pembayaran-${namaBulan}-${bill.year}.pdf`;
    doc.save(namaFile);
  };

  const handleUnduhDaftarTahunanPdf = () => {
    if (!user) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginX = 48;
    let cursorY = 60;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Daftar Pembayaran Tahun ${activeYear}`, marginX, cursorY);

    cursorY += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Nama Siswa: ${user.name}`, marginX, cursorY);
    cursorY += 16;
    doc.text(`ID Siswa: ${user.id}`, marginX, cursorY);

    cursorY += 16;
    const tanggalCetak = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(Date.now());
    doc.text(`Tanggal Cetak: ${tanggalCetak}`, marginX, cursorY);

    cursorY += 18;
    doc.setDrawColor(0, 0, 0);
    doc.line(marginX, cursorY, 547, cursorY);

    cursorY += 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Bulan', marginX, cursorY);
    doc.text('Status', marginX + 120, cursorY);
    doc.text('Nominal', marginX + 210, cursorY);
    doc.text('Metode', marginX + 320, cursorY);
    doc.text('Waktu Bayar', marginX + 430, cursorY);

    cursorY += 10;
    doc.setLineWidth(0.6);
    doc.line(marginX, cursorY, 547, cursorY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    bills.forEach((bill) => {
      if (cursorY > 760) {
        doc.addPage();
        cursorY = 60;
      }

      cursorY += 18;
      doc.text(MONTH_NAMES[bill.month - 1], marginX, cursorY);
      doc.text(bill.status === 'lunas' ? 'Lunas' : 'Belum Lunas', marginX + 120, cursorY);
      doc.text(formatRupiah(bill.amount), marginX + 210, cursorY);
      doc.text(getPaymentMethodLabel(bill.paymentMethod), marginX + 320, cursorY);
      doc.text(formatTanggalWaktu(bill.paidAt), marginX + 430, cursorY);

      cursorY += 6;
      doc.setDrawColor(0, 0, 0);
      doc.line(marginX, cursorY, 547, cursorY);
    });

    cursorY += 24;
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Ringkasan: ${ringkasan.jumlahLunas} bulan lunas, ${ringkasan.jumlahBelumLunas} bulan belum lunas`,
      marginX,
      cursorY
    );

    const namaFile = `daftar-pembayaran-${activeYear}-${user.id}.pdf`;
    doc.save(namaFile);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-2 text-black antialiased selection:bg-blue-100">
      {/* HEADER HALAMAN & RINGKASAN */}
      <section className="space-y-2.5">
        <div className="flex flex-col gap-2 border-b border-black pb-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg leading-none font-bold tracking-tight text-black">
              Tagihan Kewajiban Sekolah
            </h1>
            <p className="mt-1 text-xs leading-none font-bold text-black">
              Daftar rekonsiliasi kas administrasi siswa berdasarkan periode aktif.
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start leading-none sm:self-auto">
            <span className="text-[10px] font-bold tracking-wider text-black uppercase">
              Tahun Buku:
            </span>
            <select
              value={activeYear}
              onChange={(event) => {
                setSelectedYear(Number(event.target.value));
                setSelectedBillIds([]);
                setInfoMessage('');
              }}
              className="cursor-pointer rounded-md border border-black bg-white px-2 py-0.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:text-blue-600 focus:outline-none"
            >
              {availableYears.map((year) => (
                <option key={year} value={year} className="font-bold text-black">
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Informasi Keuangan */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="space-y-0.5 rounded-md border-2 border-black bg-white p-2">
            <p className="text-[10px] font-bold tracking-wider text-black uppercase">
              Total Tagihan Tahunan
            </p>
            <p className="text-lg leading-none font-bold text-black">
              {formatRupiah(ringkasan.totalTagihan)}
            </p>
          </div>
          <div className="space-y-0.5 rounded-md border-2 border-black bg-white p-2">
            <p className="text-[10px] font-bold tracking-wider text-black uppercase">
              Kliring Terbayar
            </p>
            <p className="text-lg leading-none font-bold text-black">
              {ringkasan.jumlahLunas} Bulan
            </p>
          </div>
          <div className="space-y-0.5 rounded-md border-2 border-black bg-white p-2">
            <p className="text-[10px] font-bold tracking-wider text-black uppercase">
              Tunggakan Administrasi
            </p>
            <p className="text-lg leading-none font-bold text-black">
              {ringkasan.jumlahBelumLunas} Bulan
            </p>
          </div>
        </div>
      </section>

      {/* STRUKTUR TABEL UTAMA */}
      <section className="space-y-2">
        <div className="flex flex-col gap-2 pb-0.5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xs font-bold tracking-wider text-black uppercase">
            Rincian Laporan Bulanan ({activeYear})
          </h2>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleUnduhDaftarTahunanPdf}
              className="cursor-pointer rounded-md border-2 border-black bg-white px-2 py-0.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => {
                if (!user) return;
                exportTagihanPdf(bills, user.name, activeYear, MONTH_NAMES);
              }}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-blue-600 bg-blue-600 px-2 py-0.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
            >
              <Download className="h-3 w-3" />
              Export Laporan
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border-2 border-black bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="bg-white text-xs font-bold tracking-wider text-black uppercase">
                  <th className="px-3 py-2">Bulan Periode</th>
                  <th className="w-32 shrink-0 px-3 py-2">Nominal</th>
                  <th className="w-28 shrink-0 px-3 py-2">Jatuh Tempo</th>
                  <th className="w-28 shrink-0 px-3 py-2">Status Kelayakan</th>
                  <th className="w-36 shrink-0 px-3 py-2">Kanal Kliring</th>
                  <th className="w-24 shrink-0 px-3 py-2 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="bg-white text-black">
                {bills.map((item) => {
                  const isSelected = selectedBillIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`leading-tight transition-colors ${
                        isSelected ? 'bg-neutral-100 font-bold' : 'hover:bg-neutral-100'
                      }`}
                    >
                      <td className="px-3 py-2 font-bold text-black">
                        {MONTH_NAMES[item.month - 1]}
                      </td>
                      <td className="px-3 py-2 font-mono font-bold text-black">
                        {formatRupiah(item.amount)}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs font-bold text-black">
                        {item.dueDate}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.status === 'lunas' ? 'bg-blue-600' : 'bg-black'
                            }`}
                          />
                          <span className="font-bold text-black">
                            {item.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs font-bold text-black">
                        {getPaymentMethodLabel(item.paymentMethod)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {item.status === 'belum_lunas' ? (
                          <button
                            type="button"
                            onClick={() => handleToggleSelectBill(item.id)}
                            className={`inline-block w-[76px] cursor-pointer rounded-md border-2 bg-white py-0.5 text-center text-xs font-bold transition-colors hover:bg-neutral-100 ${
                              isSelected
                                ? 'border-blue-600 text-blue-600'
                                : 'border-black text-black hover:border-blue-600 hover:text-blue-600'
                            }`}
                          >
                            {isSelected ? '✓ Terpilih' : 'Pilih Bulan'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUnduhBuktiPdf(item as TagihanSekolah)}
                            className="inline-block w-[76px] cursor-pointer rounded-md border-2 border-black bg-white py-0.5 text-center text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600"
                          >
                            Unduh Resi
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* METODE PEMBAYARAN HUB (Gaya Neubrutalism Outlined) */}
      <section className="space-y-3 rounded-md border-2 border-black bg-white p-3">
        <div className="leading-none">
          <h2 className="text-xs font-bold tracking-wider text-black uppercase">
            Kanal Gerbang Pembayaran
          </h2>
          <p className="mt-1 text-xs font-bold text-black">
            Pilih salah satu instrumen keuangan pembayaran sah di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
          {PAYMENT_METHODS.map((method) => {
            const isTarget = selectedMethod === method.value;
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => setSelectedMethod(method.value)}
                className={`flex cursor-pointer items-center justify-center rounded-md border-2 p-2 text-center transition-colors hover:bg-neutral-100 ${
                  isTarget
                    ? 'border-blue-600 bg-white text-black'
                    : 'border-black bg-white text-black'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1 leading-tight">
                  <div>
                    {method.value === 'atm' && <Landmark className="h-3.5 w-3.5" />}
                    {method.value === 'mobile_banking' && <CreditCard className="h-3.5 w-3.5" />}
                    {method.value === 'internet_banking' && <CreditCard className="h-3.5 w-3.5" />}
                    {method.value === 'ewallet' && <Wallet className="h-3.5 w-3.5" />}
                    {method.value === 'tunai' && <CircleDollarSign className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-xs font-bold tracking-tight">{method.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* CHECKOUT SUBMISSION AREA */}
        <div className="flex flex-col gap-3 border-t border-black pt-3 leading-none md:flex-row md:items-center md:justify-between">
          <div className="text-xs">
            {billsToPay.length > 0 ? (
              <p className="font-bold text-black">
                Mekanisme pembayaran:{' '}
                <span className="font-bold text-black">{billsToPay.length} Bulan</span> terpilih
                dengan akumulasi tagihan:{' '}
                <span className="ml-1 inline-block rounded-md border-2 border-black bg-white px-1 py-0.5 font-mono text-xs font-bold text-black">
                  {formatRupiah(totalSelectedAmount)}
                </span>
              </p>
            ) : (
              <p className="text-xs font-bold text-black italic">
                Pilih satu atau beberapa bulan pada tabel rincian di atas untuk memuat otorisasi
                kas.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleBayarMulti}
            disabled={billsToPay.length === 0}
            className="cursor-pointer self-start rounded-md border-2 border-black bg-white px-2 py-0.5 text-xs font-bold text-black transition-colors hover:border-blue-600 hover:bg-neutral-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-black disabled:opacity-60 disabled:hover:border-black md:self-auto"
          >
            Eksekusi Transaksi ({billsToPay.length})
          </button>
        </div>

        {infoMessage && (
          <div className="rounded-md border-2 border-black bg-white p-2 text-xs leading-normal font-bold text-black">
            {infoMessage}
          </div>
        )}
      </section>
    </div>
  );
}
