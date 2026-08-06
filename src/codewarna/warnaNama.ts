// Warna nama berdasarkan huruf awal (A-Z), diambil dari codewarna/color.json.
// Semua warna dipilih yang kontras agar terbaca di latar putih.
export const WARNA_ABJAD: Record<string, string> = {
  A: '#00A36C', // Jade
  B: '#C04000', // Mahogany
  C: '#FFA500', // Orange
  D: '#00CED1', // DarkTurquoise
  E: '#1E90FF', // DodgerBlue
  F: '#8B4513', // SaddleBrown
  G: '#228B22', // ForestGreen
  H: '#B8860B', // DarkGoldenRod
  I: '#4169E1', // RoyalBlue
  J: '#C35817', // Red Fox
  K: '#6B8E23', // OliveDrab
  L: '#CD7F32', // Bronze
  M: '#7E3517', // Blood Red
  N: '#0041C2', // Blueberry Blue
  O: '#FF7F50', // Coral
  P: '#2E8B57', // SeaGreen
  Q: '#8A4117', // Dark Sienna
  R: '#EB5406', // Red Gold
  S: '#1569C7', // Blue Eyes
  T: '#008080', // Teal
  U: '#800080', // Purple
  V: '#9400D3', // DarkViolet
  W: '#FF1493', // DeepPink
  X: '#C71585', // MediumVioletRed
  Y: '#960018', // Carmine Red
  Z: '#FF2400', // Scarlet Red
};

/** Ambil warna (hex) berdasarkan huruf awal nama. Fallback hitam. */
export function warnaNama(nama: string): string {
  const huruf = (nama || '').trim().charAt(0).toUpperCase();
  return WARNA_ABJAD[huruf] ?? '#000000';
}
