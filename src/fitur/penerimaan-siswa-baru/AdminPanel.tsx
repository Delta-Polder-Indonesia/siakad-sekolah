/**
 * AdminPanel PPDB — orkestrator (dipecah dari satu file 1.377 baris).
 *
 * Komponen ini hanya mengelola state & data flow (data fetching, filter,
 * aksi CRUD, ekspor). Seluruh UI dipindah ke komponen khusus:
 *
 *   AdminPanelLogin          → layar login admin
 *   AdminPanelFullHeader     → header penuh (mode modal)
 *   AdminPanelEmbeddedBar    → bar ringkas (mode embedded)
 *   AdminPanelSettingsModal  → pengaturan email notifikasi
 *   AdminPanelSidebar        → ringkasan statistik + filter
 *   AdminPanelApplications   → daftar/grid pendaftar
 *   AdminPanelDetailModal    → detail pendaftar + validasi dokumen
 *   AdminPanelAuditModal     → audit trail
 *   AdminPanelConfirmModal   → konfirmasi hapus/ubah status
 *   ppdbExport.ts            → ekspor CSV/JSON/PDF/cetak (pure functions)
 */
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { cn } from '../../utils/cn';
import { ppdbService } from '../../services/ppdbService';
import { useToast } from '../../components/ui';
import AdminPanelLogin from './AdminPanelLogin';
import { AdminPanelFullHeader, AdminPanelEmbeddedBar } from './AdminPanelHeader';
import AdminPanelSettingsModal from './AdminPanelSettingsModal';
import AdminPanelSidebar from './AdminPanelSidebar';
import AdminPanelApplications from './AdminPanelApplications';
import AdminPanelDetailModal from './AdminPanelDetailModal';
import AdminPanelAuditModal from './AdminPanelAuditModal';
import AdminPanelConfirmModal from './AdminPanelConfirmModal';
import { downloadJsonFile, exportPpdbCsv, printDetailPdf, printRecap } from './ppdbExport';
import type {
  AdminPanelProps,
  AdminPanelStats,
  ApiHealthState,
  ConfirmAction,
  ViewMode,
} from './AdminPanel.types';
import type {
  PPDBAuditLog,
  PPDBApplication,
  PPDBApplicationStatus,
  PPDBNotification,
} from '../../data/services';

export type { AdminPanelProps } from './AdminPanel.types';

export default function AdminPanel({ onClose, embedded = false }: AdminPanelProps) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | PPDBApplicationStatus>('ALL');
  const [filterJenjang, setFilterJenjang] = useState<string>('ALL');
  const [filterJalur, setFilterJalur] = useState<string>('ALL');
  const [selected, setSelected] = useState<PPDBApplication | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  const [apps, setApps] = useState<PPDBApplication[]>([]);
  const [stats, setStats] = useState<AdminPanelStats>({
    total: 0,
    pending: 0,
    verified: 0,
    accepted: 0,
    rejected: 0,
    byJenjang: { SD: 0, SMP: 0, SMA: 0, SMK: 0 },
    byJalur: { REGULER: 0, ZONASI: 0, PRESTASI: 0, AFIRMASI: 0, PINDAHAN: 0 },
  });
  const [auditLogs, setAuditLogs] = useState<PPDBAuditLog[]>([]);
  const [notifications, setNotifications] = useState<PPDBNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showAudit, setShowAudit] = useState(false);
  const [apiHealth, setApiHealth] = useState<ApiHealthState>({
    mode: 'local',
    online: true,
    apiReachable: true,
    message: 'Memuat status koneksi...',
    checkedAt: new Date().toISOString(),
  });

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  useEffect(() => {
    if (embedded) {
      setShowLogin(false);
    } else {
      const isAuth = ppdbService.isAdminAuthenticated();
      setShowLogin(!isAuth);
    }
    refresh();
  }, [embedded]);

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const state = await ppdbService.getApiHealth();
        if (isMounted) setApiHealth(state);
      } catch {
        if (isMounted) {
          setApiHealth({
            mode: 'local',
            online: navigator.onLine,
            apiReachable: false,
            message: 'Tidak dapat memeriksa koneksi API',
            checkedAt: new Date().toISOString(),
          });
        }
      }
    };

    void checkHealth();
    const timer = window.setInterval(() => void checkHealth(), 30000);
    const handleOnline = () => void checkHealth();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOnline);

    return () => {
      isMounted = false;
      window.clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOnline);
    };
  }, []);

  useEffect(() => {
    setAdminNotesInput(selected?.adminNotes || '');
  }, [selected]);

  async function refresh() {
    const [data, s, logs, notifs, count, settings] = await Promise.all([
      ppdbService.getApplications(),
      ppdbService.getStatistics(),
      ppdbService.getAuditLogs(),
      ppdbService.getNotifications(),
      ppdbService.getUnreadCount(),
      ppdbService.getAdminSettings(),
    ]);
    setApps(data);
    setStats(s);
    setAuditLogs(logs);
    setNotifications(notifs);
    setUnreadCount(count);
    setAdminEmail(settings.email);
  }

  /** Dipanggil AdminPanelLogin; mengembalikan true bila login sukses. */
  async function handleLogin(username: string, password: string): Promise<boolean> {
    const ok = await ppdbService.adminLogin(username, password);
    if (ok) setShowLogin(false);
    return ok;
  }

  function handleLogout() {
    ppdbService.adminLogout();
    setShowLogin(true);
    try {
      if (embedded && typeof onClose === 'function') onClose();
    } catch (err) {
      void err;
    }
  }

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      const keyword = search.toLowerCase();
      const matchSearch =
        a.namaLengkap.toLowerCase().includes(keyword) ||
        a.nisn.includes(search) ||
        a.registrationNo.toLowerCase().includes(keyword) ||
        a.nik.includes(search);
      const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
      const matchJenjang = filterJenjang === 'ALL' || a.jenjangTujuan === filterJenjang;
      const matchJalur = filterJalur === 'ALL' || a.jalurPendaftaran === filterJalur;
      return matchSearch && matchStatus && matchJenjang && matchJalur;
    });
  }, [apps, search, filterStatus, filterJenjang, filterJalur]);

  const handleUpdateStatus = async (
    id: string,
    status: PPDBApplicationStatus,
    verifiedBy?: string
  ) => {
    const updated = await ppdbService.updateStatus(
      id,
      status,
      adminNotesInput || undefined,
      verifiedBy
    );
    if (updated) setSelected(updated as PPDBApplication);
    refresh();
  };

  const handleUpdateDoc = async (docKey: string, status: 'PENDING' | 'VALID' | 'INVALID') => {
    if (!selected) return;
    const updated = await ppdbService.updateDocumentStatus(selected.id, docKey, status);
    if (updated) setSelected(updated as PPDBApplication);
    refresh();
  };

  const handleDelete = (id: string) => {
    ppdbService.deleteApplication(id);
    if (selected?.id === id) setSelected(null);
    refresh();
  };

  const handleUpdateSettings = async (e: FormEvent) => {
    e.preventDefault();
    await ppdbService.updateAdminSettings({ email: adminEmail });
    setShowSettings(false);
    refresh();
  };

  const handleMarkRead = async (id: string) => {
    await ppdbService.markNotificationAsRead(id);
    refresh();
  };

  const handleSelectNotification = (n: PPDBNotification) => {
    handleMarkRead(n.id);
    setSearch(n.registrationNo);
    setShowNotifications(false);
  };

  const handleDownloadData = (app: PPDBApplication) => {
    downloadJsonFile(
      app,
      `ppdb_${app.registrationNo}_${app.namaLengkap.replace(/\s+/g, '_')}.json`
    );
  };

  const handleDownloadAll = () => {
    downloadJsonFile(apps, `ppdb_all_applications_${new Date().toISOString().split('T')[0]}.json`);
  };

  const downloadBackup = async () => {
    const content = await ppdbService.exportBackupJson();
    downloadJsonFile(
      JSON.parse(content),
      `backup-ppdb-${new Date().toISOString().slice(0, 10)}.json`
    );
  };

  const importBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const result = await ppdbService.importBackupJson(String(reader.result || ''));
      showToast(result.ok ? 'success' : 'error', result.message);
      if (result.ok) void refresh();
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  if (showLogin) {
    return <AdminPanelLogin embedded={embedded} onClose={onClose} onLogin={handleLogin} />;
  }

  return (
    <div className={cn('flex h-full w-full flex-col bg-white', embedded && 'overflow-hidden')}>
      {!embedded && (
        <AdminPanelFullHeader
          apiHealth={apiHealth}
          notifications={notifications}
          unreadCount={unreadCount}
          showNotifications={showNotifications}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
          onSelectNotification={handleSelectNotification}
          onOpenSettings={() => setShowSettings(true)}
          onOpenAudit={() => setShowAudit(true)}
          onDownloadBackup={downloadBackup}
          onImportBackup={importBackup}
          onPrintRecap={() => printRecap(filtered, stats)}
          onExportCsv={() => exportPpdbCsv(filtered)}
          onRefresh={refresh}
          onLogout={handleLogout}
        />
      )}

      {embedded && (
        <AdminPanelEmbeddedBar
          apiHealth={apiHealth}
          notifications={notifications}
          unreadCount={unreadCount}
          showNotifications={showNotifications}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
          onSelectNotification={handleSelectNotification}
          onOpenSettings={() => setShowSettings(true)}
          onOpenAudit={() => setShowAudit(true)}
          onRefresh={refresh}
        />
      )}

      <main className="flex w-full flex-1 overflow-hidden border-t border-black">
        {showSettings && (
          <AdminPanelSettingsModal
            adminEmail={adminEmail}
            onEmailChange={setAdminEmail}
            onSubmit={handleUpdateSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        <AdminPanelSidebar
          stats={stats}
          search={search}
          filterStatus={filterStatus}
          filterJenjang={filterJenjang}
          filterJalur={filterJalur}
          onSearchChange={setSearch}
          onStatusChange={setFilterStatus}
          onJenjangChange={setFilterJenjang}
          onJalurChange={setFilterJalur}
        />

        <AdminPanelApplications
          apps={apps}
          filtered={filtered}
          viewMode={viewMode}
          currentFolder={currentFolder}
          search={search}
          filterStatus={filterStatus}
          filterJenjang={filterJenjang}
          filterJalur={filterJalur}
          onOpenFolder={(jenjang) => {
            setCurrentFolder(jenjang);
            setFilterJenjang(jenjang);
          }}
          onGoHome={() => {
            setCurrentFolder(null);
            setFilterJenjang('ALL');
          }}
          onViewModeChange={setViewMode}
          onSelect={setSelected}
          onDownload={handleDownloadData}
          onPrint={printDetailPdf}
          onDownloadAll={handleDownloadAll}
        />
      </main>

      {selected && (
        <AdminPanelDetailModal
          app={selected}
          adminNotesInput={adminNotesInput}
          onNotesChange={setAdminNotesInput}
          onClose={() => setSelected(null)}
          onUpdateStatus={(status) => handleUpdateStatus(selected.id, status, 'Admin')}
          onUpdateDoc={handleUpdateDoc}
          onPrint={() => printDetailPdf(selected)}
          onRequestDelete={() =>
            setConfirmAction({
              type: 'delete',
              id: selected.id,
              message: 'Yakin ingin menghapus pendaftaran ini?',
            })
          }
        />
      )}

      {showAudit && <AdminPanelAuditModal logs={auditLogs} onClose={() => setShowAudit(false)} />}

      {confirmAction && (
        <AdminPanelConfirmModal
          action={confirmAction}
          onCancel={() => setConfirmAction(null)}
          onConfirm={(action) => {
            if (action.type === 'delete') {
              handleDelete(action.id);
            } else if (action.status) {
              handleUpdateStatus(action.id, action.status, 'Admin');
            }
            setConfirmAction(null);
          }}
        />
      )}
    </div>
  );
}
