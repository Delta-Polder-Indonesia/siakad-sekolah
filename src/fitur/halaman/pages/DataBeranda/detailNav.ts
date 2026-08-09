// Helper guard navigasi halaman detail di Beranda.
// Setiap fungsi memvalidasi id/link terhadap halaman detail yang BENAR-BENAR ADA
// (lihat case switch di ExpectationModal). Id di luar range atau bukan angka
// dikembalikan sebagai null — pemanggil cukup melewatkan navigasi (no-op),
// sehingga tidak nyasar ke Beranda seperti perilaku default switch sebelumnya.

const RISET_LINKS = new Set([
  'riset-air-bersih',
  'riset-infrastruktur',
  'riset-digitalisasi',
]);

const SDGS_MIN = 1;
const SDGS_MAX = 17;
const SILA_MIN = 1;
const SILA_MAX = 7;
const ASA_MIN = 1;
const ASA_MAX = 14;
const EBOOK_MIN = 1;
const EBOOK_MAX = 8;
const REG_MIN = 1;
const REG_MAX = 7;
const BERITA_MIN = 1;
const BERITA_MAX = 4;

// Halaman detail Research: 'riset/riset-air-bersih' dll.
export const resolveRisetNav = (link?: string): string | null => {
  if (!link || !RISET_LINKS.has(link)) return null;
  return `riset/${link}`;
};

// Halaman detail SDGs: 'sdgs/sdgs-1' .. 'sdgs/sdgs-17'.
// Menerima 'sdgs-3', '3', atau angka 3.
export const resolveSdgsNav = (link?: string | number): string | null => {
  if (link === undefined || link === null || link === '') return null;
  const n = Number(String(link).replace(/^sdgs-/, ''));
  return Number.isInteger(n) && n >= SDGS_MIN && n <= SDGS_MAX ? `sdgs/sdgs-${n}` : null;
};

// Halaman detail Sila: 'sila-1' .. 'sila-7'.
export const resolveSilaNav = (navId?: string): string | null => {
  if (!navId) return null;
  const n = Number(navId.replace(/^sila-/, ''));
  return Number.isInteger(n) && n >= SILA_MIN && n <= SILA_MAX ? `sila-${n}` : null;
};

// Halaman detail Asa: 'asa-1' .. 'asa-14'.
export const resolveAsaNav = (navId?: string): string | null => {
  if (!navId) return null;
  const n = Number(navId.replace(/^asa-/, ''));
  return Number.isInteger(n) && n >= ASA_MIN && n <= ASA_MAX ? `asa-${n}` : null;
};

// Gabungan untuk ticker yang dipakai sila & asa sekaligus (EscalatorTicker).
export const resolveSilaAsaNav = (navId?: string): string | null => {
  return resolveSilaNav(navId) ?? resolveAsaNav(navId);
};

// Halaman detail Ebook: 'ebook-1' .. 'ebook-8'.
// Menerima 'ebook-3', '3', atau angka 3.
export const resolveEbookNav = (rawId?: string | number): string | null => {
  if (rawId === undefined || rawId === null || rawId === '') return null;
  const n = Number(String(rawId).replace(/^ebook-/, ''));
  return Number.isInteger(n) && n >= EBOOK_MIN && n <= EBOOK_MAX ? `ebook-${n}` : null;
};

// Halaman detail Program Keahlian: 'reg-01' .. 'reg-07' (format dua digit).
// Menerima 'reg-03', '3', atau angka 3.
export const resolveRegNav = (rawId?: string | number): string | null => {
  if (rawId === undefined || rawId === null || rawId === '') return null;
  const n = Number(String(rawId).replace(/^reg-/, ''));
  return Number.isInteger(n) && n >= REG_MIN && n <= REG_MAX
    ? `reg-${String(n).padStart(2, '0')}`
    : null;
};

// Halaman detail Berita: 'berita-1' .. 'berita-4'.
// Menerima 'berita-3', '3', atau angka 3.
export const resolveBeritaNav = (rawId?: string | number): string | null => {
  if (rawId === undefined || rawId === null || rawId === '') return null;
  const n = Number(String(rawId).replace(/^berita-/, ''));
  return Number.isInteger(n) && n >= BERITA_MIN && n <= BERITA_MAX
    ? `berita-${n}`
    : null;
};

