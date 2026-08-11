import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClasses,
  getNilaiRapotBySiswa,
  getStudents,
  getTahunAjaranRapotSiswa,
} from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { BookOpenCheck, Download, User } from 'lucide-react';
import { exportRapotPdf, exportRapotCsv } from '../../utils/export';
import { getBobotNilai, isTuntas, KONFIGURASI_PENILAIAN } from '../../utils/penilaian';
import { escapeHtml, printViaBlob } from '../../utils/print';

export default function RapotSiswa() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();

  const student = useMemo(() => getStudents().find((s) => s.id === user?.id), [user, storeVersion]);

  const className = useMemo(() => {
    if (!student) return '-';
    return getClasses().find((c) => c.id === student.classId)?.name || '-';
  }, [student, storeVersion]);

  const tahunAjaranList = useMemo(() => {
    if (!user) return [];
    const list = getTahunAjaranRapotSiswa(user.id);
    if (list.length === 0) {
      const y = new Date().getFullYear();
      return [`${y}/${y + 1}`];
    }
    return list;
  }, [user, storeVersion]);

  const [tahunAjaran, setTahunAjaran] = useState(
    () => tahunAjaranList[0] || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
  );
  const [semester, setSemester] = useState<'ganjil' | 'genap'>('genap');

  const nilaiRapot = useMemo(() => {
    if (!user) return [];
    return getNilaiRapotBySiswa(user.id, tahunAjaran, semester);
  }, [user, tahunAjaran, semester, storeVersion]);

  // Kalkulasi data summary ala KHS UNPAB
  const stats = useMemo(() => {
    const totalSKS = nilaiRapot.length * 3; // Mengasumsikan rata-rata 3 SKS per MK
    const totalKN = nilaiRapot.reduce(
      (sum, item) => sum + getBobotNilai(item.predikat ?? '') * 3,
      0
    );
    const ipSemester = totalSKS > 0 ? (totalKN / totalSKS).toFixed(2) : '0.00';
    const mapelTuntas = nilaiRapot.filter((item) => isTuntas(item.nilaiAkhir)).length;

    return {
      totalSKS,
      totalKN,
      ipSemester,
      totalMapel: nilaiRapot.length,
      mapelTuntas,
      mapelBelumTuntas: nilaiRapot.length - mapelTuntas,
    };
  }, [nilaiRapot]);

  // Format string untuk Tahun Akademik
  const formatTA = useMemo(() => {
    return `${semester === 'ganjil' ? 'GANJIL' : 'GENAP'} ${tahunAjaran.split('/')[0]}`;
  }, [tahunAjaran, semester]);

  // Handle Cetak Dokumen
  const handleCetakRapot = () => {
    if (nilaiRapot.length === 0) return;

    const rowsHtml = nilaiRapot
      .map((item, idx) => {
        const bobot = getBobotNilai(item.predikat ?? '');
        const kode = item.id?.substring(0, 5) || `4210${idx + 1}`;
        return `
        <tr style="background: #fff;">
          <td style="border: 2px solid #000; padding: 4px; text-align: center;">${idx + 1}</td>
          <td style="border: 2px solid #000; padding: 4px; text-align: center;">${escapeHtml(formatTA)}</td>
          <td style="border: 2px solid #000; padding: 4px; text-align: center; font-family: monospace;">${escapeHtml(kode)}</td>
          <td style="border: 2px solid #000; padding: 4px 8px; text-align: left;">${escapeHtml(item.mataPelajaran)}</td>
          <td style="border: 2px solid #000; padding: 4px; text-align: center;">${semester === 'ganjil' ? '1' : '2'}</td>
          <td style="border: 2px solid #000; padding: 4px; text-align: center;">3</td>
          <td style="border: 2px solid #000; padding: 4px; text-align: center;">KKNI</td>
          <td style="border: 2px solid #000; padding: 4px; text-align: center; font-weight: bold;">${escapeHtml(item.predikat)}</td>
          <td style="border: 2px solid #000; padding: 4px; text-align: center;">${bobot}</td>
          <td style="border: 2px solid #000; padding: 4px; text-align: center; font-weight: bold;">${bobot * 3}</td>
        </tr>
      `;
      })
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Portal Mahasiswa - KHS</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 15px; color: #000; font-size: 11px; }
          .header-blue { background: #2563eb; color: white; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px; border: 2px solid #000; }
          .header-blue h1 { margin: 0; font-size: 13px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
          th { background: #ffffff; border: 2px solid #000; padding: 6px 2px; color: #000; font-weight: bold; text-transform: uppercase; text-align: center; }
          .sub-th { background: #ffffff; }
          .summary-strip { background: #ffffff; color: #000; font-weight: bold; padding: 6px 10px; border: 2px solid #000; margin-top: -2px; text-transform: uppercase; font-size: 10px; }
          @media print { .header-blue { background: #2563eb !important; -webkit-print-color-adjust: exact; } th { background: #ffffff !important; -webkit-print-color-adjust: exact; } .sub-th { background: #ffffff !important; -webkit-print-color-adjust: exact; } .summary-strip { background: #ffffff !important; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header-blue">
          <div>
            <h1>PORTAL SISWA</h1>
            <div style="font-size: 9px; margin-top: 1px; opacity: 0.9;">Kartu Hasil Studi (KHS) Digital</div>
          </div>
          <div style="text-align: right; font-weight: bold; font-size: 9px; line-height: 1.2;">
            NAMA: ${escapeHtml(student?.name?.toUpperCase() || '-')}
            <br>
            NPM/NIS: ${escapeHtml(student?.nis || '-')} &bull; KELAS: ${escapeHtml(className)}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th rowspan="2" style="width: 30px;">No.</th>
              <th rowspan="2" style="width: 100px;">TA</th>
              <th rowspan="2" style="width: 60px;">Kode</th>
              <th rowspan="2">Mata Pelajaran</th>
              <th rowspan="2" style="width: 40px;">SMT</th>
              <th rowspan="2" style="width: 40px;">SKS</th>
              <th rowspan="2" style="width: 75px;">Kurikulum</th>
              <th colspan="2" class="sub-th" style="border-bottom: 2px solid #000; width: 90px;">Nilai</th>
              <th rowspan="2" style="width: 50px;">(K x N)</th>
            </tr>
            <tr>
              <th class="sub-th" style="border-right: 2px solid #000; width: 45px;">Huruf</th>
              <th class="sub-th" style="width: 45px;">Angka</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div class="summary-strip">
          TOTAL SKS : ${stats.totalSKS} | Jumlah K x N : ${stats.totalKN} | IP Semester : ${escapeHtml(stats.ipSemester)} | Beban SKS Berikut : 24
        </div>
      </body>
      </html>
    `;

    printViaBlob(html, { width: 'width=1400', height: 'height=800' });
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-white p-4 text-black antialiased selection:bg-neutral-200">
      {/* PANEL FILTER ATAS */}
      <div className="mb-4 flex flex-col justify-between gap-3 border-b-2 border-black pb-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-wider text-black uppercase">
              Tahun Ajaran
            </span>
            <select
              value={tahunAjaran}
              onChange={(e) => setTahunAjaran(e.target.value)}
              className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors outline-none hover:bg-neutral-100 focus:border-black"
            >
              {tahunAjaranList.map((ta) => (
                <option key={ta} value={ta}>
                  {ta}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-wider text-black uppercase">
              Semester
            </span>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value as 'ganjil' | 'genap')}
              className="rounded-md border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black transition-colors outline-none hover:bg-neutral-100 focus:border-black"
            >
              <option value="ganjil">Ganjil</option>
              <option value="genap">Genap</option>
            </select>
          </div>
        </div>

        {nilaiRapot.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Tombol Export PDF */}
            <button
              type="button"
              onClick={() =>
                exportRapotPdf(nilaiRapot, student?.name || '', className, tahunAjaran, semester)
              }
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100 hover:text-black"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>

            {/* Tombol Export CSV */}
            <button
              type="button"
              onClick={() =>
                exportRapotCsv(
                  nilaiRapot,
                  `Rapot_${(student?.name || 'siswa').replace(/\s+/g, '_')}_${tahunAjaran}_${semester}.csv`
                )
              }
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100 hover:text-black"
            >
              <Download className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>

            {/* Tombol Cetak KHS */}
            <button
              type="button"
              onClick={handleCetakRapot}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-black hover:bg-neutral-100 hover:text-black"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Cetak KHS</span>
            </button>
          </div>
        )}
      </div>

      {/* REPLIKA KHS DIGITAL PORTAL UNPAB */}
      {nilaiRapot.length === 0 ? (
        <div className="rounded-md border-2 border-dashed border-black bg-white py-12 text-center">
          <BookOpenCheck className="mx-auto mb-2 h-8 w-8 text-black" />
          <p className="text-xs font-bold text-black italic">
            Belum ada nilai Kartu Hasil Studi (KHS) yang diterbitkan untuk semester ini.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border-2 border-black bg-white">
          {/* Header Biru Khas Portal */}
          <div className="flex flex-col gap-2 border-b-2 border-black bg-black p-3 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xs font-bold tracking-wide text-white uppercase">
                PORTAL MAHASISWA UNPAB
              </h2>
              <p className="mt-0.5 text-xs font-bold text-white">
                Sistem Informasi Kartu Hasil Studi (KHS) Akademik
              </p>
            </div>

            <div className="flex max-w-full items-center gap-2 rounded-md border-2 border-white bg-black px-2.5 py-1 text-xs">
              {student?.avatar ? (
                <img
                  src={student.avatar}
                  alt=""
                  className="h-7 w-7 shrink-0 rounded-md border border-white bg-white object-cover"  loading="lazy" decoding="async" />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white bg-white text-black">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="truncate leading-none">
                <div className="truncate">
                  <span className="text-[10px] font-bold text-white">NAMA:</span>{' '}
                  <strong className="font-bold text-white uppercase">{student?.name}</strong>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-2 font-mono text-[10px] font-bold text-white">
                  <span>NPM: {student?.nis}</span>
                  <span>|</span>
                  <span className="font-sans">KELAS: {className}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Grid KHS Utama */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-sans text-xs">
              <thead>
                {/* Header Tingkat 1 */}
                <tr className="border-b-2 border-black bg-white text-center font-bold text-black">
                  <th className="w-8 shrink-0 border-r-2 border-black px-1.5 py-2" rowSpan={2}>
                    No.
                  </th>
                  <th className="w-20 shrink-0 border-r-2 border-black px-1.5 py-2" rowSpan={2}>
                    TA
                  </th>
                  <th className="w-14 shrink-0 border-r-2 border-black px-1.5 py-2" rowSpan={2}>
                    Kode
                  </th>
                  <th className="border-r-2 border-black px-2.5 py-2 text-left" rowSpan={2}>
                    Mata Kuliah
                  </th>
                  <th className="w-10 shrink-0 border-r-2 border-black px-1.5 py-2" rowSpan={2}>
                    SMT
                  </th>
                  <th className="w-10 shrink-0 border-r-2 border-black px-1.5 py-2" rowSpan={2}>
                    SKS
                  </th>
                  <th className="w-16 shrink-0 border-r-2 border-black px-1.5 py-2" rowSpan={2}>
                    Kurikulum
                  </th>
                  <th
                    className="w-20 shrink-0 border-b-2 border-black bg-white px-1.5 py-1"
                    colSpan={2}
                  >
                    Nilai
                  </th>
                  <th className="w-12 shrink-0 border-r-2 border-black px-1.5 py-2" rowSpan={2}>
                    (K * N)
                  </th>
                  <th className="w-20 shrink-0 px-1.5 py-2" rowSpan={2}>
                    Ketuntasan
                  </th>
                </tr>
                {/* Sub-Header Tingkat 2 */}
                <tr className="border-b-2 border-black bg-white text-center font-bold text-black">
                  <th className="w-10 shrink-0 border-r-2 border-black px-1.5 py-1">Huruf</th>
                  <th className="w-10 shrink-0 border-r-2 border-black px-1.5 py-1">Angka</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black bg-white text-black">
                {nilaiRapot.map((item, idx) => {
                  const bobotAngka = getBobotNilai(item.predikat ?? '');
                  const sksItem = 3;
                  return (
                    <tr
                      key={item.id}
                      className="leading-tight transition-colors hover:bg-neutral-100"
                    >
                      <td className="border-r-2 border-black px-1.5 py-1.5 text-center font-mono text-xs font-bold text-black">
                        {idx + 1}
                      </td>
                      <td className="border-r-2 border-black px-1.5 py-1.5 text-center text-xs font-bold text-black">
                        {formatTA}
                      </td>
                      <td className="border-r-2 border-black px-1.5 py-1.5 text-center font-mono text-xs font-bold text-black">
                        {item.id?.substring(0, 5) || '4210' + (idx + 1)}
                      </td>
                      <td className="border-r-2 border-black px-2.5 py-1.5 font-bold text-black">
                        {item.mataPelajaran}
                      </td>
                      <td className="border-r-2 border-black px-1.5 py-1.5 text-center font-mono font-bold text-black">
                        {semester === 'ganjil' ? '1' : '2'}
                      </td>
                      <td className="border-r-2 border-black px-1.5 py-1.5 text-center font-mono font-bold text-black">
                        {sksItem}
                      </td>
                      <td className="border-r-2 border-black px-1.5 py-1.5 text-center text-xs font-bold text-black">
                        KKNI
                      </td>
                      <td className="border-r-2 border-black px-1.5 py-1.5 text-center font-bold text-black">
                        {item.predikat}
                      </td>
                      <td className="border-r-2 border-black px-1.5 py-1.5 text-center font-mono font-bold text-black">
                        {bobotAngka}
                      </td>
                      <td className="border-r-2 border-black px-1.5 py-1.5 text-center font-mono font-bold text-black">
                        {sksItem * bobotAngka}
                      </td>
                      <td
                        className={`px-1.5 py-1.5 text-center text-xs font-bold ${
                          isTuntas(item.nilaiAkhir) ? 'text-green-700' : 'text-red-600'
                        }`}
                      >
                        {isTuntas(item.nilaiAkhir) ? 'TUNTAS' : 'BELUM'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Strip Total Parameter */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 border-black bg-white px-3 py-2 text-[10px] font-bold tracking-wide text-black uppercase">
            <span>
              TOTAL SKS :{' '}
              <span className="font-mono font-extrabold text-black">{stats.totalSKS}</span>
            </span>
            <span>|</span>
            <span>
              Jumlah K x N :{' '}
              <span className="font-mono font-extrabold text-black">{stats.totalKN}</span>
            </span>
            <span>|</span>
            <span>
              IP Semester :{' '}
              <span className="font-mono font-extrabold text-black">{stats.ipSemester}</span>
            </span>
            <span>|</span>
            <span>
              Beban SKS Berikut : <span className="font-mono font-extrabold text-black">24</span>
            </span>
            <span>|</span>
            <span>
              KKM :{' '}
              <span className="font-mono font-extrabold text-black">
                {KONFIGURASI_PENILAIAN.kkm}
              </span>
            </span>
            <span>|</span>
            <span>
              Tuntas :{' '}
              <span className="font-mono font-extrabold text-green-700">
                {stats.mapelTuntas}/{stats.totalMapel}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
