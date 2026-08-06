import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../fitur/bersama/NotificationProvider';
import { namaSekolahUppercase } from '../fitur/halaman/components/Profile/dataSekolah';
import NotificationBadge from '../fitur/bersama/NotificationBadge';
import NotificationDropdown from '../fitur/bersama/NotificationDropdown';
import {
  // === 1. NAVIGASI & STRUKTUR HALAMAN ===
  Home,
  LayoutDashboard,
  Menu,
  X,
  AlignJustify,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  MoreHorizontal,
  MoreVertical,
  ArrowLeft,
  ArrowRight,

  // === 2. MANAJEMEN TUGAS, KINERJA & DOKUMEN ===
  ClipboardCheck,
  ClipboardList,
  BarChart,
  BarChart3,
  PieChart,
  LineChart,
  FileText,
  File,
  Folder,
  FolderOpen,
  Briefcase,
  Layers,
  NotebookPen,

  // === 3. KOMUNIKASI & NOTIFIKASI ===
  Mail,
  Inbox,
  Send,
  Megaphone,
  Bell,
  BellOff,
  MessageSquare,
  MessageCircle,
  Share2,

  // === 4. WAKTU & KALENDER ===
  Calendar,
  CalendarDays,
  Clock,
  Timer,

  // === 5. KEUANGAN & TRANSAKSI ===
  WalletCards,
  Wallet,
  CreditCard,
  Banknote,
  DollarSign,
  TrendingUp,

  // === 6. AKUN, PENGATURAN & KEAMANAN ===
  User,
  Users,
  UserCheck,
  UserPlus,
  Settings,
  Sliders,
  Lock,
  Unlock,
  Key,
  LogOut,
  LogIn,

  // === 7. EDUKASI, MEDSOS & KONTEN ===
  BookOpen,
  BookOpenCheck,
  GraduationCap,
  Trophy,
  Award,
  Star,
  Image,
  Video,
  Music,
  Tv,

  // === 8. UTILITAS & UTAMA ===
  Search,
  Plus,
  Minus,
  Trash2,
  Edit,
  Edit3,
  Check,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Info,
  Map,
  MapPin,
  Building2,
  Heart,
  Globe,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useState, memo } from 'react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = memo(function Sidebar({
  activePage,
  onNavigate,
  collapsed: sidebarCollapsed,
  onToggleCollapse: setSidebarCollapsed,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const { counts, markRead } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const avatarInitial = (user?.name || '?').charAt(0).toUpperCase();

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const isParent = user?.role === 'parent';
  const isGuest = user?.role === 'guest';

  const getMenuSections = () => {
    if (isTeacher) {
      return [
        {
          title: 'MENU UTAMA',
          items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'wali-kelas', label: 'Wali Kelas', icon: ShieldCheck },
            { id: 'academic-agenda', label: 'Kalender Akademik', icon: CalendarDays },
            { id: 'attendance', label: 'Input Absensi', icon: ClipboardCheck },
            { id: 'bk', label: 'Bimbingan Konseling', icon: ShieldAlert },
            { id: 'ekskul-management', label: 'Kelola Ekskul', icon: Trophy },
          ],
        },
        {
          title: 'AKADEMIK & TUGAS',
          items: [
            { id: 'assignment-settings', label: 'Atur Tugas Online', icon: Briefcase },
            { id: 'jurnal-mengajar', label: 'Jurnal Mengajar', icon: NotebookPen },
            { id: 'rapot-input', label: 'Input Rapot', icon: BookOpenCheck },
            { id: 'rekap-nilai', label: 'Rekap Nilai', icon: BarChart3 },
            { id: 'report', label: 'Laporan', icon: ClipboardList },
            { id: 'student-management', label: 'Kelola Siswa', icon: Users },
          ],
        },
        {
          title: 'KOMUNIKASI',
          items: [
            { id: 'letters-teacher', label: 'Kotak Surat', icon: Mail },
            { id: 'announcement-settings', label: 'Atur Pengumuman', icon: Megaphone },
          ],
        },
      ];
    } else if (isStudent) {
      return [
        {
          title: 'MENU UTAMA',
          items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'academic-agenda', label: 'Kalender Akademik', icon: CalendarDays },
            { id: 'roster', label: 'Roster Kelas', icon: ClipboardCheck },
            { id: 'history', label: 'Riwayat Absensi', icon: Calendar },
            { id: 'bk-record', label: 'Catatan BK', icon: ShieldAlert },
            { id: 'ekskul', label: 'Ekstrakurikuler', icon: Trophy },
          ],
        },
        {
          title: 'AKADEMIK & TUGAS',
          items: [
            { id: 'tasks', label: 'Kantong Tugas', icon: Briefcase },
            { id: 'rapot', label: 'Rapot Saya', icon: BookOpenCheck },
            { id: 'billing', label: 'Tagihan Sekolah', icon: WalletCards },
          ],
        },
        {
          title: 'KOMUNIKASI',
          items: [{ id: 'letters-student', label: 'Kirim Surat', icon: Mail }],
        },
      ];
    } else if (isParent) {
      return [
        {
          title: 'PEMANTAUAN ANAK',
          items: [
            { id: 'dashboard', label: 'Ikhtisar Belajar', icon: LayoutDashboard },
            { id: 'academic-agenda', label: 'Kalender Akademik', icon: CalendarDays },
            { id: 'rapot', label: 'Rapot Digital', icon: BookOpenCheck },
            { id: 'billing', label: 'Status Tagihan', icon: WalletCards },
            { id: 'attendance-history', label: 'Riwayat Absensi', icon: Calendar },
            { id: 'letters-status', label: 'Status Surat Izin', icon: FileText },
            { id: 'bk-record', label: 'Catatan BK', icon: ShieldAlert },
          ],
        },
        {
          title: 'HUBUNGAN SEKOLAH',
          items: [
            { id: 'school-announcements', label: 'Pengumuman', icon: Megaphone },
            { id: 'personal-messages', label: 'Pesan Wali Kelas', icon: Mail },
          ],
        },
      ];
    } else if (isGuest) {
      return [
        {
          title: 'MENU UTAMA',
          items: [
            { id: 'dashboard', label: 'Beranda Tamu', icon: Home },
            { id: 'school-announcements', label: 'Berita Sekolah', icon: Megaphone },
            { id: 'teacher-announcements', label: 'Direktori Guru', icon: User },
          ],
        },
        {
          title: 'INFORMASI SEKOLAH',
          items: [
            { id: 'tentang-sekolah', label: 'Tentang Sekolah', icon: Building2 },
            { id: 'visi-misi', label: 'Visi & Misi', icon: Star },
            { id: 'struktur-organisasi', label: 'Struktur Organisasi', icon: BarChart },
            { id: 'fasilitas', label: 'Fasilitas', icon: Map },
            { id: 'galeri', label: 'Galeri', icon: Image },
          ],
        },
        {
          title: 'AKADEMIK',
          items: [
            { id: 'ppdb', label: 'Info PPDB', icon: GraduationCap },
            { id: 'ekstrakurikuler', label: 'Ekstrakurikuler', icon: Trophy },
            { id: 'prestasi', label: 'Prestasi', icon: Award },
            { id: 'program-unggulan', label: 'Program Unggulan', icon: BookOpen },
          ],
        },
        {
          title: 'BUKU TAMU',
          items: [{ id: 'buku-tamu', label: 'Isi Buku Tamu', icon: MessageSquare }],
        },
        {
          title: 'BANTUAN',
          items: [{ id: 'faq', label: 'FAQ', icon: HelpCircle }],
        },
      ];
    }
    return [];
  };

  const getBadgeCount = (itemId: string, c: typeof counts): number => {
    switch (itemId) {
      case 'personal-messages':
      case 'letters-teacher':
      case 'letters-student':
        return c.messages + c.suratIzin;
      case 'school-announcements':
        return c.announcements;
      case 'admin-dashboard':
        return c.ppdbNotifications;
      case 'assignment-settings':
      case 'tasks':
        return c.discussions + c.groupMessages;
      default:
        return 0;
    }
  };

  const getNotifType = (itemId: string): keyof typeof counts => {
    switch (itemId) {
      case 'personal-messages':
      case 'letters-teacher':
      case 'letters-student':
        return 'messages';
      case 'school-announcements':
        return 'announcements';
      case 'admin-dashboard':
        return 'ppdbNotifications';
      case 'assignment-settings':
      case 'tasks':
        return 'discussions';
      default:
        return 'messages';
    }
  };

  const markReadForPage = (itemId: string) => {
    if (itemId === 'tasks' || itemId === 'assignment-settings') {
      markRead('discussions');
      markRead('groupMessages');
      return;
    }
    markRead(getNotifType(itemId));
  };

  const menuSections = getMenuSections();

  const avatarBg = isTeacher ? 'bg-blue-700' : 'bg-emerald-700';

  const topNavItems = [
    {
      id: 'school-announcements',
      icon: Home,
      label: 'Pengumuman Sekolah',
    },
    {
      id: 'toggle-sidebar',
      icon: AlignJustify,
      label: 'Menu',
      onClick: () => setSidebarCollapsed(),
    },
    {
      id: 'academic-agenda',
      icon: CalendarDays,
      label: 'Kalender Akademik',
      disabled: true,
    },
    {
      id: 'personal-messages',
      icon: Inbox,
      label: 'Pesan Masuk',
    },
    {
      id: 'teacher-announcements',
      icon: FileText,
      label: 'Daftar Nama Guru',
      disabled: true,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Profil Pengguna di Bagian Atas Sidebar */}
      <div className="border-b border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              loading="lazy"
              src={user.avatar}
              alt="Foto Profil"
              className="h-10 w-10 shrink-0 rounded-full border border-slate-300 object-cover shadow-sm"
            />
          ) : (
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ${avatarBg}`}
            >
              {avatarInitial}
            </div>
          )}
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-sm font-semibold text-slate-800">
                {user?.name || 'Pengguna'}
              </p>
              <p className="m-0 truncate text-xs text-slate-500">
                {isTeacher ? 'Pegawai' : isStudent ? 'Siswa' : isParent ? 'Orang Tua' : 'Tamu'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Navigasi Sidebar */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!sidebarCollapsed && (
              <p className="mb-2 px-4 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                {section.title}
              </p>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const itemBadge = getBadgeCount(item.id, counts);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (itemBadge > 0) markReadForPage(item.id);
                    setMobileOpen(false);
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex w-full items-center gap-3 border-none bg-transparent px-4 py-2 text-sm transition-colors ${
                    isActive ? 'font-bold text-black' : 'text-slate-600 hover:text-black'
                  } ${sidebarCollapsed ? 'px-2' : ''}`}
                >
                  <div className="relative shrink-0">
                    <Icon className="h-5 w-5" />
                    {sidebarCollapsed && itemBadge > 0 && (
                      <NotificationBadge count={itemBadge} dot className="!-top-1 !-right-1" />
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                      <span className="truncate">{item.label}</span>
                      {itemBadge > 0 && <NotificationBadge count={itemBadge} />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Header atas */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-slate-700 bg-slate-900">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center gap-1">
            <div className="mr-4 flex items-center gap-2 border-r border-slate-600 pr-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-600 bg-slate-800 p-1">
                <img
                  loading="lazy"
                  src={`${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`}
                  alt={`Logo ${namaSekolahUppercase}`}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="m-0 border-none bg-transparent p-0 text-sm leading-tight font-bold text-white">
                  PORTAL SISWA
                </h1>
                <p className="m-0 p-0 text-[10px] leading-tight text-slate-400">
                  {namaSekolahUppercase}
                </p>
              </div>
            </div>

            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const itemBadge = getBadgeCount(item.id, counts);
              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.disabled) return;
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      onNavigate(item.id);
                      if (itemBadge > 0) markReadForPage(item.id);
                    }
                  }}
                  className={`relative mx-0.5 rounded-md p-2 transition-all duration-150 active:scale-95 ${
                    item.disabled
                      ? 'cursor-not-allowed text-slate-600 opacity-40'
                      : isActive
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={item.disabled ? `${item.label} (nonaktif)` : item.label}
                >
                  <Icon className="h-5 w-5" />
                  {itemBadge > 0 && <NotificationBadge count={itemBadge} dot />}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setNotificationOpen((prev) => !prev)}
                className="relative rounded-md p-2 text-slate-400 transition-all duration-150 hover:bg-slate-800 hover:text-white active:scale-95"
                title={`Notifikasi (${counts.total})`}
              >
                <Bell className="h-5 w-5" />
                {counts.total > 0 && <NotificationBadge count={counts.total} dot />}
              </button>
              {notificationOpen && (
                <NotificationDropdown
                  onNavigate={(page) => {
                    onNavigate(page);
                    setNotificationOpen(false);
                  }}
                  onClose={() => setNotificationOpen(false)}
                />
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-md py-1.5 pr-3 pl-2 transition-all duration-150 hover:bg-slate-800 active:scale-[0.98]"
              >
                {user?.avatar ? (
                  <img
                    loading="lazy"
                    src={user.avatar}
                    alt="Foto profil"
                    className="h-8 w-8 rounded-full border-2 border-slate-600 object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-700 text-xs font-bold text-white">
                    {avatarInitial}
                  </div>
                )}
                <div className="hidden text-left lg:block">
                  <p className="m-0 text-xs leading-tight font-medium text-white">
                    {user?.name || 'User'}
                  </p>
                  <p className="m-0 text-[10px] text-slate-400">
                    {isTeacher ? 'Pegawai' : isStudent ? 'Siswa' : isParent ? 'Orang Tua' : 'Tamu'}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                    <div className="border-b border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        {user?.avatar ? (
                          <img
                            loading="lazy"
                            src={user.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${avatarBg}`}
                          >
                            {avatarInitial}
                          </div>
                        )}
                        <div>
                          <p className="m-0 text-sm font-semibold text-gray-800">{user?.name}</p>
                          <p className="m-0 text-xs text-gray-500">
                            {isTeacher
                              ? 'Pegawai'
                              : isStudent
                                ? 'Siswa'
                                : isParent
                                  ? 'Orang Tua'
                                  : 'Tamu'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-sky-50 hover:text-sky-600 active:scale-[0.98]"
                      >
                        <User className="h-4 w-4" />
                        Profil Saya
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('settings');
                          setUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-all duration-150 hover:bg-sky-50 hover:text-sky-600 active:scale-[0.98]"
                      >
                        <Settings className="h-4 w-4" />
                        Pengaturan
                      </button>
                    </div>
                    <div className="border-t border-gray-100 p-2">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-all duration-150 hover:bg-red-50 active:scale-[0.98]"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="h-14" />

      {/* Tombol menu mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-16 left-4 z-50 rounded-xl bg-sky-600 p-2 text-white shadow-lg md:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 top-14 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-30 hidden min-h-[calc(100vh-3.5rem)] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-300 ease-in-out md:flex ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex h-full w-64 shrink-0 flex-col">{sidebarContent}</div>
      </aside>

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
});

export default Sidebar;
