/**
 * Header & toolbar AdminPanel PPDB (dipecah dari AdminPanel.tsx).
 * Berisi: header penuh (non-embedded), bar ringkas (embedded),
 * dan dropdown notifikasi yang dipakai bersama.
 */
import { Bell, Mail, Printer, Download, LogOut } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { cn } from '../../utils/cn';
import type { PPDBNotification } from '../../data/services';
import type { ApiHealthState } from './AdminPanel.types';

// ─────────────────────────────────────────────────────────────
// Dropdown notifikasi (dipakai header penuh & bar embedded)
// ─────────────────────────────────────────────────────────────

interface NotificationDropdownProps {
  notifications: PPDBNotification[];
  unreadCount: number;
  showNotifications: boolean;
  compact?: boolean;
  onToggle: () => void;
  onSelect: (notification: PPDBNotification) => void;
}

function NotificationDropdown({
  notifications,
  unreadCount,
  showNotifications,
  compact = false,
  onToggle,
  onSelect,
}: NotificationDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'relative rounded-md border border-black text-black transition-colors hover:bg-black hover:text-white',
          compact ? 'p-1' : 'p-1.5'
        )}
      >
        <Bell className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        {unreadCount > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-600 font-bold text-white',
              compact
                ? 'h-3.5 w-3.5 text-[7px] ring-1 ring-white'
                : 'h-4 w-4 text-[8px] ring-2 ring-white'
            )}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div
          className={cn(
            'absolute top-full right-0 z-50 mt-2 overflow-hidden rounded-xl border border-black bg-white shadow-2xl',
            compact ? 'w-72' : 'w-80'
          )}
        >
          <div
            className={cn(
              'border-b border-black bg-neutral-50',
              compact ? 'px-3 py-2' : 'px-4 py-2.5'
            )}
          >
            <h3
              className={cn(
                'uppercase',
                compact
                  ? 'text-[10px] font-black tracking-widest'
                  : 'text-xs font-bold tracking-wide'
              )}
            >
              Pesan Masuk
            </h3>
          </div>
          <div className={cn('overflow-y-auto', compact ? 'max-h-64' : 'max-h-96')}>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onSelect(n)}
                  className={cn(
                    'group cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50',
                    compact ? 'p-2.5' : 'p-3',
                    !n.isRead && (compact ? 'bg-blue-50/30' : 'bg-blue-50/50')
                  )}
                >
                  {compact ? (
                    <>
                      <p className="text-[10px] leading-tight font-bold text-neutral-900">
                        {n.message}
                      </p>
                      <p className="mt-1 text-[8px] text-neutral-400">
                        {new Date(n.createdAt).toLocaleString('id-ID')}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          'mt-1 h-2 w-2 shrink-0 rounded-full',
                          n.type === 'NEW_REGISTRATION' ? 'bg-green-500' : 'bg-blue-500',
                          n.isRead && 'opacity-0'
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-[11px] leading-tight font-medium text-neutral-900">
                          {n.message}
                        </p>
                        <p className="text-[9px] text-neutral-500">
                          {new Date(n.createdAt).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={cn('text-center', compact ? 'py-6' : 'px-4 py-8')}>
                {!compact && <Mail className="mx-auto h-8 w-8 text-neutral-200" />}
                <p
                  className={cn(
                    'font-bold text-neutral-400 uppercase',
                    compact ? 'mt-0 text-[9px] tracking-widest' : 'mt-2 text-[10px]'
                  )}
                >
                  Tidak ada pesan
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Header penuh (mode non-embedded / modal)
// ─────────────────────────────────────────────────────────────

export interface AdminPanelFullHeaderProps {
  apiHealth: ApiHealthState;
  notifications: PPDBNotification[];
  unreadCount: number;
  showNotifications: boolean;
  onToggleNotifications: () => void;
  onSelectNotification: (n: PPDBNotification) => void;
  onOpenSettings: () => void;
  onOpenAudit: () => void;
  onDownloadBackup: () => void;
  onImportBackup: (e: ChangeEvent<HTMLInputElement>) => void;
  onPrintRecap: () => void;
  onExportCsv: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

export function AdminPanelFullHeader(props: AdminPanelFullHeaderProps) {
  const {
    apiHealth,
    notifications,
    unreadCount,
    showNotifications,
    onToggleNotifications,
    onSelectNotification,
    onOpenSettings,
    onOpenAudit,
    onDownloadBackup,
    onImportBackup,
    onPrintRecap,
    onExportCsv,
    onRefresh,
    onLogout,
  } = props;

  return (
    <header className="w-full shrink-0 border-b border-black bg-white">
      <div className="flex w-full items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded border border-black bg-white px-2 py-0.5 text-[10px] font-bold text-black">
            {apiHealth.mode === 'local'
              ? 'LOCAL MODE'
              : apiHealth.apiReachable
                ? 'API ONLINE'
                : 'API OFFLINE'}
          </span>
          <span className="text-[10px] text-black">{apiHealth.message}</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-4">
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            showNotifications={showNotifications}
            onToggle={onToggleNotifications}
            onSelect={onSelectNotification}
          />

          <button
            type="button"
            onClick={onOpenSettings}
            className="rounded-md border border-black p-1.5 text-black transition-colors hover:bg-black hover:text-white"
            title="Pengaturan Email Admin"
          >
            <Mail className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1 rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            Audit Log
          </button>
          <button
            type="button"
            onClick={onDownloadBackup}
            className="inline-flex items-center gap-1 rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            Backup JSON
          </button>
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
            Import JSON
            <input
              type="file"
              accept="application/json"
              onChange={onImportBackup}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={onPrintRecap}
            className="inline-flex items-center gap-1 rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            <Printer className="h-3.5 w-3.5" /> Cetak
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1 rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1 rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Keluar
          </button>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Bar ringkas (mode embedded — dipakai PanelAdminModal)
// ─────────────────────────────────────────────────────────────

export interface AdminPanelEmbeddedBarProps {
  apiHealth: ApiHealthState;
  notifications: PPDBNotification[];
  unreadCount: number;
  showNotifications: boolean;
  onToggleNotifications: () => void;
  onSelectNotification: (n: PPDBNotification) => void;
  onOpenSettings: () => void;
  onOpenAudit: () => void;
  onRefresh: () => void;
}

export function AdminPanelEmbeddedBar(props: AdminPanelEmbeddedBarProps) {
  const {
    apiHealth,
    notifications,
    unreadCount,
    showNotifications,
    onToggleNotifications,
    onSelectNotification,
    onOpenSettings,
    onOpenAudit,
    onRefresh,
  } = props;

  return (
    <div className="flex shrink-0 items-center justify-between border-b border-black bg-neutral-50/50 px-5 py-2">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex h-2 w-2 rounded-full',
            apiHealth.apiReachable ? 'bg-green-500' : 'animate-pulse bg-red-500'
          )}
        />
        <span className="text-[10px] font-bold tracking-widest text-black uppercase">
          {apiHealth.mode === 'local' ? 'Local System' : 'Cloud Sync Active'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          showNotifications={showNotifications}
          compact
          onToggle={onToggleNotifications}
          onSelect={onSelectNotification}
        />

        <button
          type="button"
          onClick={onOpenSettings}
          className="rounded-md border border-black p-1 text-black transition-colors hover:border-black hover:bg-neutral-100"
          title="Pengaturan Email Admin"
        >
          <Mail className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onOpenAudit}
          className="rounded-md border border-black px-2 py-1 text-[9px] font-black text-black uppercase transition-colors hover:border-black hover:bg-neutral-100"
        >
          Audit
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-md border border-black px-2 py-1 text-[9px] font-black text-black uppercase transition-colors hover:border-black hover:bg-neutral-100"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
