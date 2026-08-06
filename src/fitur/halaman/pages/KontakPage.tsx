// src/fitur/halaman/pages/KontakPage.tsx

import React from 'react';
import type { PageProps } from '../types';
import {
  namaSekolahUppercase,
  alamat,
  kecamatan,
  kota,
  provinsi,
  kodePos,
  telepon,
  email,
  emailDomain,
  mapsQuery,
} from '../components/Profile/dataSekolah';

// ============================================================
// Konstanta data
// ============================================================
const CONTACT_INFO = {
  address: `${alamat}, ${kecamatan}, ${kota}, ${provinsi} ${kodePos}`,
  phone: telepon,
  callCenter: telepon,
  email,
  website: emailDomain,
} as const;

// URL Google Maps diperbarui dari config sekolah
const MAPS_URL = `https://www.google.com/maps?q=${mapsQuery}&z=17&output=embed`;

const MAPS_EXTERNAL_URL = `https://www.google.com/maps?q=${mapsQuery}`;

const TIM_DAPODIK = [
  'Pusat Data dan Teknologi Informasi',
  'Sekretariat Direktorat Jenderal Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Pendidikan Menengah.',
  'Sekretariat Direktorat Jenderal Vokasi, Pendidikan Khusus, dan Pendidikan Layanan Khusus.',
  'Sekretariat Direktorat Jenderal Guru, Tenaga Kependidikan, dan Pendidikan Guru.',
  'Sekretariat Badan Standar, Kurikulum, dan Asesmen Pendidikan.',
  'Sekretariat Badan Pengembangan dan Pembinaan Bahasa.',
];

// ============================================================
// Sub-component: InfoItem
// ============================================================
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function InfoItem({ icon, label, children }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-500">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// Icons
// ============================================================
function IconMapPin() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
      />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function IconBell() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function IconChat() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function IconEnvelope() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

// ============================================================
// Main Component
// ============================================================
export default function KontakPage({ onNavigate: _onNavigate }: PageProps) {
  return (
    <div className="bg-white font-serif">
      <section className="pt-16 pb-10 md:pt-10">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          {/* HEADER HALAMAN UTAMA */}
          <div className="mb-12 border-b-2 border-slate-950 pb-6">
            <div className="max-w-4xl">
              <h3 className="text-3xl font-bold text-slate-900 md:text-4xl">Kontak Kami</h3>
              <p className="mt-4 text-justify font-serif text-sm leading-relaxed text-slate-700 italic">
                "Dari sekolah lah kehidupan bangsa dicerdaskan, dan dari tempat ini pulalah kita
                bisa menjadi seperti sekarang. Karena itu, mari bersama peduli dan membuat sekolah
                kita lebih baik untuk menyiapkan anak kita menjadi generasi pemenang di masa depan."
              </p>
            </div>
          </div>

          {/* ── GRID UTAMA: KIRI MAPS, KANAN INFO ── */}
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-10 lg:gap-14">
            {/* ── KIRI: GOOGLE MAPS ── */}
            <div className="w-full md:col-span-5">
              {/* Iframe Maps */}
              <div
                className="aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                role="region"
                aria-label={`Peta lokasi ${namaSekolahUppercase}`}
              >
                <iframe
                  title={`Lokasi ${namaSekolahUppercase}`}
                  src={MAPS_URL}
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Tombol Buka Google Maps */}
              <div className="mt-4">
                <a
                  href={MAPS_EXTERNAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold tracking-widest text-slate-950 uppercase transition-colors hover:bg-slate-100"
                >
                  <svg
                    className="h-4 w-4 text-red-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Buka di Google Maps
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* ── KANAN: INFO KONTAK ── */}
            <div className="md:col-span-7">
              {/* Badge */}
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold tracking-wide text-blue-700 uppercase">
                Informasi Kontak
              </span>

              {/* Judul */}
              <h2 className="mt-3 text-xl leading-tight font-semibold text-slate-900 md:mt-4 lg:text-3xl">
                Layanan Terpadu Kementerian Pendidikan Dasar dan Menengah
              </h2>

              {/* Deskripsi */}
              <p className="mt-6 text-sm leading-relaxed text-slate-600 md:text-base">
                Wujud komitmen pemerintah dalam meningkatkan akses dan kualitas layanan pendidikan
                dasar dan menengah.
              </p>

              {/* Info Kontak */}
              <div className="grid gap-6 border-b border-slate-200 pt-6 pb-8 md:grid-cols-2">
                <InfoItem icon={<IconMapPin />} label="Alamat">
                  <p className="font-semibold text-slate-900">{CONTACT_INFO.address}</p>
                </InfoItem>

                <InfoItem icon={<IconPhone />} label="Telepon">
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s|-/g, '')}`}
                    className="font-semibold text-slate-900 hover:text-blue-600"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </InfoItem>

                <InfoItem icon={<IconBell />} label="Pusat Panggilan">
                  <a
                    href={`tel:${CONTACT_INFO.callCenter}`}
                    className="font-semibold text-slate-900 hover:text-blue-600"
                  >
                    {CONTACT_INFO.callCenter}
                  </a>
                </InfoItem>

                <InfoItem icon={<IconChat />} label="Unit Layanan Terpadu">
                  <a
                    href={`https://${CONTACT_INFO.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-900 hover:text-blue-600"
                  >
                    {CONTACT_INFO.website}
                  </a>
                </InfoItem>

                <InfoItem icon={<IconEnvelope />} label="Email">
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="font-semibold text-slate-900 hover:text-blue-600"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </InfoItem>
              </div>

              {/* Tim Dapodik */}
              <h3 className="mt-8 text-base font-semibold text-slate-900 md:mt-10 md:text-xl">
                Tim Dapodik Kemendikdasmen
              </h3>
              <ol className="mt-5 list-decimal space-y-2 pl-6 text-sm leading-8 text-slate-600 md:text-base">
                {TIM_DAPODIK.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
