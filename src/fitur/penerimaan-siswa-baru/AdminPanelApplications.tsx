/**
 * Panel daftar pendaftar PPDB: toolbar (breadcrumb, folder jenjang,
 * toggle list/grid, download semua) + tabel list & grid view.
 * Dipecah dari AdminPanel.tsx.
 */
import {
  File,
  Eye,
  Download as DownloadIcon,
  FileText,
  Folder,
  List,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import type { PPDBApplication, PPDBApplicationStatus } from '../../data/services';
import { statusText, formatDate, type ViewMode } from './AdminPanel.types';

export interface AdminPanelApplicationsProps {
  apps: PPDBApplication[];
  filtered: PPDBApplication[];
  viewMode: ViewMode;
  currentFolder: string | null;
  search: string;
  filterStatus: 'ALL' | PPDBApplicationStatus;
  filterJenjang: string;
  filterJalur: string;
  onOpenFolder: (jenjang: string) => void;
  onGoHome: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSelect: (app: PPDBApplication) => void;
  onDownload: (app: PPDBApplication) => void;
  onPrint: (app: PPDBApplication) => void;
  onDownloadAll: () => void;
}

export default function AdminPanelApplications(props: AdminPanelApplicationsProps) {
  const {
    apps,
    filtered,
    viewMode,
    currentFolder,
    search,
    filterStatus,
    filterJenjang,
    filterJalur,
    onOpenFolder,
    onGoHome,
    onViewModeChange,
    onSelect,
    onDownload,
    onPrint,
    onDownloadAll,
  } = props;

  const showJenjangChips =
    !currentFolder &&
    !search &&
    filterStatus === 'ALL' &&
    filterJenjang === 'ALL' &&
    filterJalur === 'ALL';

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white px-5 py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex shrink-0 items-center gap-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">
            Data Pendaftar
          </p>
          <div className="ml-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={onGoHome}
              className={cn(
                'text-[11px] font-bold transition-colors',
                !currentFolder
                  ? 'border-b border-black text-black hover:border-black hover:bg-neutral-100'
                  : 'text-neutral-400 hover:text-black'
              )}
            >
              My Files
            </button>
            {currentFolder && (
              <>
                <span className="text-neutral-300">/</span>
                <span className="border-b border-black text-[11px] font-bold text-black">
                  {currentFolder}
                </span>
              </>
            )}
          </div>
        </div>

        {showJenjangChips && (
          <div className="flex items-center gap-1.5">
            {['SD', 'SMP', 'SMA', 'SMK'].map((jenjang) => (
              <button
                type="button"
                key={jenjang}
                onClick={() => onOpenFolder(jenjang)}
                className="group inline-flex items-center gap-1.5 rounded-md border border-black bg-neutral-50 px-2.5 py-1 text-[10px] font-bold text-black transition-colors hover:border-black"
              >
                <Folder className="h-3 w-3 text-neutral-400" fill="currentColor" />
                <span>{jenjang}</span>
                <span className="text-[9px] text-neutral-400">
                  {apps.filter((a) => a.jenjangTujuan === jenjang).length}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex rounded-md border border-black p-0.5 transition-colors hover:border-black">
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={cn(
                'rounded p-1 transition-colors',
                viewMode === 'list' ? 'bg-black text-white' : 'text-black hover:text-black'
              )}
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'rounded p-1 transition-colors',
                viewMode === 'grid' ? 'bg-black text-white' : 'text-black hover:text-black'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={onDownloadAll}
            className="inline-flex items-center gap-1.5 rounded-md border border-black bg-white px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:border-black hover:bg-neutral-100"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            Download Semua
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {viewMode === 'list' ? (
          <div className="w-full overflow-x-auto rounded-md border border-black bg-white">
            <table className="w-full text-left text-xs text-black">
              <thead>
                <tr className="border-b border-black bg-neutral-50 text-[10px] font-bold tracking-wide uppercase">
                  <th className="px-3 py-2.5">Item</th>
                  <th className="px-3 py-2.5">No. Registrasi</th>
                  <th className="px-3 py-2.5">Jalur</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Terakhir Diubah</th>
                  <th className="px-3 py-2.5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/20">
                {filtered.map((item) => (
                  <tr key={item.id} className="group transition-colors hover:bg-neutral-50">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-neutral-400" />
                        <div>
                          <p className="text-xs font-bold text-black">{item.namaLengkap}</p>
                          <p className="font-mono text-[9px] tracking-tighter text-neutral-500 uppercase">
                            {item.jenjangTujuan}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-black">
                      {item.registrationNo}
                    </td>
                    <td className="px-3 py-2.5 text-[10px] font-bold tracking-tighter text-black uppercase">
                      {item.jalurPendaftaran}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          'rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase',
                          item.status === 'ACCEPTED'
                            ? 'border-green-600 bg-green-50 text-green-600'
                            : item.status === 'REJECTED'
                              ? 'border-red-600 bg-red-50 text-red-600'
                              : item.status === 'VERIFIED'
                                ? 'border-black bg-neutral-100 text-black'
                                : 'border-amber-600 bg-amber-50 text-amber-600'
                        )}
                      >
                        {statusText(item.status)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[10px] text-neutral-500">
                      {formatDate(item.submittedAt)}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => onSelect(item)}
                          className="rounded-md p-1.5 hover:bg-neutral-100"
                          title="Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDownload(item)}
                          className="rounded-md p-1.5 hover:bg-neutral-100"
                          title="Download JSON"
                        >
                          <DownloadIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onPrint(item)}
                          className="rounded-md p-1.5 hover:bg-neutral-100"
                          title="Print PDF"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col items-center rounded-xl border border-black bg-white p-4 transition-all hover:bg-neutral-50 hover:shadow-lg"
              >
                <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onDownload(item)}
                    className="p-1 text-neutral-400 hover:text-black"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                  </button>
                </div>

                <File className="mb-3 h-12 w-12 text-neutral-200" fill="currentColor" />
                <p className="w-full truncate text-center text-xs font-bold text-black">
                  {item.namaLengkap}
                </p>
                <p className="mt-0.5 font-mono text-[9px] tracking-tighter text-neutral-500 uppercase">
                  {item.registrationNo}
                </p>

                <div className="mt-3 flex items-center gap-1.5">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[8px] font-bold text-neutral-600 uppercase">
                    {item.jenjangTujuan}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[8px] font-bold uppercase',
                      item.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : item.status === 'VERIFIED'
                            ? 'bg-blue-100 text-black'
                            : 'bg-amber-100 text-amber-700'
                    )}
                  >
                    {statusText(item.status)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="mt-4 w-full rounded-lg bg-black py-2 text-[10px] font-bold text-white transition-all hover:bg-neutral-800"
                >
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div
            className="mt-15 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-black bg-neutral-50"
            style={{ minHeight: '300px' }}
          >
            <Folder className="mb-3 h-12 w-12 text-neutral-200" />
            <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase italic">
              Belum ada file di folder ini
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
