import React from 'react';
import {
  GraduationCap,
  Calendar,
  FileText,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Users,
  Clock,
} from 'lucide-react';
import { ppdbInfo } from '../../data/schoolData';
import { namaSekolah } from '../../../halaman/components/Profile/dataSekolah';

export default function PPDB() {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const totalKuota = Object.values(ppdbInfo?.kuota || {}).reduce((a, b) => a + (Number(b) || 0), 0);

  return (
    <div className="space-y-6 bg-white pb-16 font-sans text-slate-900">
      {/* Header - Disamakan dengan gaya Fasilitas (Latar Putih, Tanpa Banner Hitam) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="flex items-center gap-3 font-serif text-[24px] font-bold tracking-tight text-slate-950 sm:text-[28px]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
            <GraduationCap className="h-6 w-6 text-slate-800" />
          </div>
          PPDB {ppdbInfo?.tahunAjaran || ''}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed font-semibold text-slate-600 italic">
          Pendaftaran siswa baru {namaSekolah}
        </p>
      </div>

      {/* Kuota Penerimaan */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-[18px] font-bold tracking-tight text-slate-950">
          <Users className="h-5 w-5 text-slate-800" />
          Kuota Penerimaan
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="font-serif text-[28px] font-bold text-slate-950">{totalKuota}</p>
            <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              Total Kuota
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="font-serif text-[28px] font-bold text-slate-950">
              {ppdbInfo?.kuota?.zonasi ?? 0}
            </p>
            <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Zonasi</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="font-serif text-[28px] font-bold text-slate-950">
              {ppdbInfo?.kuota?.afirmasi ?? 0}
            </p>
            <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              Afirmasi
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="font-serif text-[28px] font-bold text-slate-950">
              {ppdbInfo?.kuota?.prestasi ?? 0}
            </p>
            <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              Prestasi
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="font-serif text-[28px] font-bold text-slate-950">
              {ppdbInfo?.kuota?.reguler ?? 0}
            </p>
            <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Reguler</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Jadwal Pendaftaran */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-[18px] font-bold tracking-tight text-slate-950">
              <Calendar className="h-5 w-5 text-slate-800" />
              Jadwal Pendaftaran
            </h2>
            <div className="space-y-3">
              {(ppdbInfo?.jadwal || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-slate-950"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-900 bg-slate-900 text-[13px] font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-[15px] font-bold tracking-tight text-slate-950">
                      {item.tahap}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-bold text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{formatDate(item.mulai)}</span>
                      {item.mulai !== item.selesai && <span>— {formatDate(item.selesai)}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Persyaratan Dokumen */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-[18px] font-bold tracking-tight text-slate-950">
              <FileText className="h-5 w-5 text-slate-800" />
              Persyaratan Dokumen
            </h2>
            <div className="space-y-2">
              {(ppdbInfo?.persyaratan || []).map((item, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg p-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                  <span className="text-[13px] leading-snug font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Biaya */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="mb-4 border-b border-slate-200 pb-3 font-serif text-[13px] font-bold tracking-wider text-slate-500 uppercase">
              Estimasi Biaya
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-bold text-slate-700">Pendaftaran</span>
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-900">
                  GRATIS
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-bold text-slate-700">SPP/Bulan</span>
                <span className="font-serif font-bold text-slate-950">
                  Rp {(ppdbInfo?.biaya?.spp || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-bold text-slate-700">Seragam</span>
                <span className="font-serif font-bold text-slate-950">
                  Rp {(ppdbInfo?.biaya?.seragam || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-bold text-slate-700">Buku</span>
                <span className="font-serif font-bold text-slate-950">
                  Rp {(ppdbInfo?.biaya?.buku || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                <p className="text-[12px] leading-relaxed font-bold text-slate-700">
                  Tersedia beasiswa untuk siswa berprestasi dan keluarga kurang mampu.
                </p>
              </div>
            </div>
          </div>

          {/* Kontak PPDB */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="mb-4 border-b border-slate-200 pb-3 font-serif text-[13px] font-bold tracking-wider text-slate-500 uppercase">
              Kontak PPDB
            </h3>
            <div className="space-y-4 text-[13px]">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-700">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-800">
                  {ppdbInfo?.kontakPPDB?.telepon || '-'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-700">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-800">
                  {ppdbInfo?.kontakPPDB?.whatsapp || '-'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-700">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-800">
                  {ppdbInfo?.kontakPPDB?.email || '-'}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="mt-5 w-full rounded-md border border-slate-950 bg-slate-950 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-60"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
