/**
 * Shared types untuk AdminPanel PPDB (dipecah dari AdminPanel.tsx).
 */
import type { PPDBApplicationStatus } from '../../data/services';

export type AdminPanelProps = {
  onClose: () => void;
  embedded?: boolean;
};

export interface AdminPanelStats {
  total: number;
  pending: number;
  verified: number;
  accepted: number;
  rejected: number;
  byJenjang: { SD: number; SMP: number; SMA: number; SMK: number };
  byJalur: {
    REGULER: number;
    ZONASI: number;
    PRESTASI: number;
    AFIRMASI: number;
    PINDAHAN: number;
  };
}

export interface ApiHealthState {
  mode: string;
  online: boolean;
  apiReachable: boolean;
  message: string;
  checkedAt: string;
}

export type ViewMode = 'list' | 'grid';

export type ConfirmAction = {
  type: 'delete' | 'status';
  id: string;
  status?: PPDBApplicationStatus;
  message: string;
};

/** Label status pendaftaran (dipakai di tabel, kartu, dan ekspor). */
export function statusText(status: string): string {
  if (status === 'PENDING') return 'Menunggu';
  if (status === 'VERIFIED') return 'Terverifikasi';
  if (status === 'ACCEPTED') return 'Diterima';
  if (status === 'REJECTED') return 'Ditolak';
  return status;
}

/** Format tanggal ISO → format Indonesia (hari, bulan, tahun, jam). */
export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
