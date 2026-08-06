import type { ComponentType } from 'react';

/** Identitas tab konten tugas yang dibagi guru → murid. */
export type TabKontenTugas = 'ringkasan' | 'buku' | 'video' | 'lampiran' | 'latihan' | 'diskusi';

export interface TabKontenDef {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

/** Ubah URL YouTube (youtube.com / youtu.be / shorts / embed) menjadi embed URL. */
export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const pathParts = u.pathname.split('/').filter(Boolean);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith('/embed/') && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}`;
      }
      if (u.pathname.startsWith('/shorts/') && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}`;
      }
    }
    if (u.hostname === 'youtu.be' && pathParts[0]) {
      return `https://www.youtube.com/embed/${pathParts[0]}`;
    }
  } catch {
    // URL tidak valid — fallback ke buka tab baru.
  }
  return null;
}

/** Paksa unduh berkas data-url (dipakai tab Lampiran). */
export function downloadDataUrl(dataUrl: string, name: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/** Label role dalam Bahasa Indonesia (dipakai Diskusi). */
export function roleLabel(role: string): string {
  switch (role) {
    case 'teacher':
      return 'Guru';
    case 'student':
      return 'Siswa';
    case 'parent':
      return 'Orang Tua';
    case 'admin':
      return 'Admin';
    default:
      return role;
  }
}

/** Format timestamp → tanggal + jam lokal id-ID. */
export function formatDateTime(timestamp: number): string {
  return `${new Date(timestamp).toLocaleDateString('id-ID')} · ${new Date(
    timestamp
  ).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
}

/** Format ukuran file (bytes) → KB/MB yang mudah dibaca. */
export function formatFileSize(bytes: number): string {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
