/**
 * StatCard — kartu statistik dashboard (gaya hitam-putih konsisten).
 *
 * Dipakai di dasbor guru/murid/orang-tua untuk menampilkan satu angka
 * ringkasan dengan label + ikon opsional. Memiliki state loading
 * (skeleton) dan state alert (angka menonjol warna merah).
 */
import type { LucideIcon } from 'lucide-react';
import Skeleton from './Skeleton';

interface StatCardProps {
  label: string;
  value?: number | string;
  icon?: LucideIcon;
  alert?: boolean;
  loading?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  alert = false,
  loading = false,
}: StatCardProps) {
  return (
    <div className="flex min-h-[74px] flex-col justify-between rounded-md border-2 border-black bg-white p-2.5">
      <div className="flex items-center justify-between border-b-2 border-black/10 pb-1">
        {loading ? (
          <Skeleton className="h-3 w-24" />
        ) : (
          <span className="text-[10px] font-bold tracking-wider text-black uppercase">{label}</span>
        )}
        {loading ? (
          <Skeleton className="h-3.5 w-3.5 rounded" />
        ) : Icon ? (
          <Icon className={`h-3.5 w-3.5 ${alert ? 'text-rose-600' : 'text-black'}`} />
        ) : null}
      </div>
      <div className="mt-1 text-center">
        {loading ? (
          <Skeleton className="h-6 w-12" />
        ) : (
          <p className={`text-xl leading-tight font-bold ${alert ? 'text-rose-700' : 'text-black'}`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
