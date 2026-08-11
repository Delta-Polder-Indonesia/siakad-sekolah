import { useState } from 'react';
import { HelpCircle, ChevronDown, Search, MessageCircle } from 'lucide-react';
import { faqList } from '../../data/schoolData';
import { namaSekolah } from '../../../halaman/components/Profile/dataSekolah';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(1);

  const safeFaqList = Array.isArray(faqList) ? faqList : [];

  const filtered = safeFaqList.filter(
    (faq) =>
      (faq?.pertanyaan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq?.jawaban || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-white pb-16 font-sans text-slate-900">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="flex items-center gap-3 font-serif text-[24px] font-bold tracking-tight text-slate-950 sm:text-[28px]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
            <HelpCircle className="h-6 w-6 text-slate-800" />
          </div>
          Pertanyaan yang Sering Diajukan
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed font-semibold text-slate-600 italic">
          Temukan jawaban untuk pertanyaan umum seputar {namaSekolah}
        </p>
      </div>

      {/* Input Kolom Pencarian - Bingkai Slate & Hover/Focus Biru */}
      <div className="relative">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari pertanyaan..."
          className="w-full rounded-md border border-slate-200 bg-white py-3.5 pr-4 pl-12 text-xs font-bold text-slate-900 transition-colors outline-none placeholder:text-slate-400 hover:border-slate-900 focus:border-slate-900"
        />
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filtered.map((faq, index) => {
          const faqId = faq?.id ?? index;
          const isOpen = openId === faqId;

          return (
            <div
              key={faqId}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-colors hover:border-slate-950"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faqId)}
                className="flex w-full cursor-pointer items-center justify-between p-5 text-left"
              >
                <span className="pr-4 font-serif text-[16px] font-bold text-slate-950">
                  {faq?.pertanyaan}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                    isOpen ? 'rotate-180 text-black' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-slate-200 bg-slate-50/50 p-5">
                  <p className="text-[14px] leading-relaxed font-semibold text-slate-700">
                    {faq?.jawaban}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Kosong */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white py-12 text-center shadow-xs">
          <HelpCircle className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-3 text-[15px] font-bold text-slate-800">
            Tidak ada pertanyaan ditemukan
          </p>
          <p className="text-[13px] font-semibold text-slate-500">Coba kata kunci lain</p>
        </div>
      )}

      {/* Contact CTA */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-700 sm:mr-5 sm:mb-0">
            <MessageCircle className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-[18px] font-bold tracking-tight text-slate-950">
              Tidak menemukan jawaban yang Anda cari?
            </h3>
            <p className="mt-1 text-[14px] font-semibold text-slate-600">
              Hubungi kami langsung untuk mendapatkan informasi lebih lanjut
            </p>
          </div>
          <button
            type="button"
            className="mt-4 cursor-pointer rounded-md border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950 sm:mt-0"
          >
            Hubungi Kami
          </button>
        </div>
      </div>
    </div>
  );
}
