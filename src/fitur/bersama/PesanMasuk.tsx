import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getStudents,
  getTeachers,
  getClasses,
  getPrivateMessages,
  addPrivateMessage,
} from '../../data/services';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Search, Send, User } from 'lucide-react';

interface LocalMessage {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  timestamp: number;
}

export default function PesanMasuk() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'guru' | 'siswa'>('all');
  const [messageInput, setMessageInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');

  const [readTimestamps, setReadTimestamps] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('pesan_read_ts') || '{}');
    } catch {
      return {};
    }
  });

  const allUsers = useMemo(() => {
    const students = getStudents().map((s) => ({ ...s, role: 'Siswa' }));
    const teachers = getTeachers().map((t) => ({ ...t, role: 'Guru' }));
    const classes = getClasses();

    // LOGIKA KHUSUS ORANG TUA: Hanya bisa chat Wali Kelas
    if (user?.role === 'parent') {
      const studentId = user.id.replace('p_', '');
      const student = students.find((s) => s.id === studentId);
      if (student) {
        const schoolClass = classes.find((c) => c.id === student.classId);
        const waliKelas = teachers.find((t) => t.id === schoolClass?.teacherId);
        if (waliKelas) {
          return [{ ...waliKelas, role: 'Wali Kelas' }];
        }
      }
      return [];
    }

    return [...teachers, ...students].filter((u) => u.id !== user?.id);
  }, [user]);

  // Semua pesan privat user (1 pintu: store privateMessages yang sama dengan
  // chat privat di DiskusiTugas), dipetakan ke bentuk render lokal.
  const messages = useMemo<LocalMessage[]>(() => {
    if (!user) return [];
    return allUsers.flatMap((contact) =>
      getPrivateMessages(user.id, contact.id).map((m) => ({
        id: m.id,
        senderId: m.senderId,
        receiverId: m.receiverId,
        subject: 'Pesan Baru',
        content: m.message,
        timestamp: m.createdAt,
      }))
    );
  }, [allUsers, user, storeVersion]);

  const unreadCounts = useMemo(() => {
    if (!user) return {} as Record<string, number>;
    const counts: Record<string, number> = {};
    messages.forEach((m) => {
      if (m.senderId === user.id) return;
      const contactId = m.senderId === user.id ? m.receiverId : m.senderId;
      const lastRead = readTimestamps[contactId] || 0;
      if (m.timestamp > lastRead) {
        counts[contactId] = (counts[contactId] || 0) + 1;
      }
    });
    return counts;
  }, [messages, readTimestamps, user]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        roleFilter === 'all' || u.role.toLowerCase() === roleFilter || u.role === 'Wali Kelas';
      return matchesSearch && matchesRole;
    });
  }, [allUsers, searchTerm, roleFilter]);

  const activeContact = allUsers.find((u) => u.id === activeChatId);

  const activeMessages = useMemo(() => {
    if (!activeChatId || !user) return [];
    return messages
      .filter(
        (m) =>
          (m.senderId === user.id && m.receiverId === activeChatId) ||
          (m.senderId === activeChatId && m.receiverId === user.id)
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, activeChatId, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeChatId || !messageInput.trim()) return;

    addPrivateMessage({
      id: `pm_${Date.now()}`,
      senderId: user.id,
      receiverId: activeChatId,
      authorName: user.name || 'Pengguna',
      role: user.role || 'guest',
      message: messageInput.trim(),
      createdAt: Date.now(),
    });

    setMessageInput('');
    setSubjectInput('');
  };

  return (
    /* Container Utama - Full height flush w-full without borders creating gaps */
    <div className="-my-4 -mr-4 flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-white sm:-my-6 sm:-mr-6 lg:-my-8 lg:-mr-8">
      {/* Sidebar Contacts - Styling dari Code 2 */}
      <div className="flex h-full w-1/3 max-w-[340px] min-w-[280px] flex-col overflow-hidden border-r border-slate-200 bg-slate-50/50">
        <div className="space-y-3 border-b border-slate-200 bg-white p-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Pesan Personal</h2>

          {/* Input Pencarian */}
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-1.5 pr-3 pl-9 text-sm transition-shadow focus:border-slate-600 focus:ring-1 focus:ring-slate-600 focus:outline-none"
            />
          </div>

          {/* Simple Tab Filter: Semua | Guru | Siswa */}
          {user?.role !== 'parent' && (
            <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className={`cursor-pointer transition-colors hover:text-slate-900 ${roleFilter === 'all' ? 'font-bold text-slate-900 underline underline-offset-4' : ''}`}
              >
                SEMUA
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setRoleFilter('guru')}
                className={`cursor-pointer transition-colors hover:text-slate-900 ${roleFilter === 'guru' ? 'font-bold text-slate-900 underline underline-offset-4' : ''}`}
              >
                GURU
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setRoleFilter('siswa')}
                className={`cursor-pointer transition-colors hover:text-slate-900 ${roleFilter === 'siswa' ? 'font-bold text-slate-900 underline underline-offset-4' : ''}`}
              >
                SISWA
              </button>
            </div>
          )}
        </div>

        {/* Manifes Daftar Kontak */}
        <div className="w-full flex-1 divide-y divide-slate-100/50 overflow-y-auto bg-white">
          {filteredUsers.length === 0 ? (
            <div className="px-4 py-8 text-center font-mono">
              <p className="text-xs tracking-wider text-slate-400 uppercase">EMPTY_RESULT</p>
            </div>
          ) : (
            filteredUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setActiveChatId(u.id);
                  const next = { ...readTimestamps, [u.id]: Date.now() };
                  setReadTimestamps(next);
                  localStorage.setItem('pesan_read_ts', JSON.stringify(next));
                }}
                className={`flex w-full items-center gap-3 border-l-4 p-4 text-left transition-colors ${
                  activeChatId === u.id
                    ? 'border-slate-800 bg-slate-50'
                    : 'border-transparent bg-white hover:bg-slate-50'
                }`}
              >
                <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-base font-bold text-slate-800">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-slate-900">{u.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{u.role}</p>
                </div>
                {(unreadCounts[u.id] ?? 0) > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                    {unreadCounts[u.id]}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Mail Area - Styling dari Code 2 */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        {activeChatId && activeContact ? (
          <>
            {/* Chat Header */}
            <div className="z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-lg font-bold text-slate-800">
                  {activeContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base leading-tight font-bold text-slate-900">
                    {activeContact.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">{activeContact.role}</p>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50/50 p-6">
              {activeMessages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="rounded border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
                    Belum ada pesan. Mulai percakapan sekarang.
                  </p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                          isMine
                            ? 'rounded-br-sm bg-slate-800 text-white'
                            : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800'
                        }`}
                      >
                        {msg.subject !== 'Pesan Baru' && (
                          <div
                            className={`mb-1 text-xs font-semibold tracking-wide uppercase ${isMine ? 'text-slate-300' : 'text-slate-500'}`}
                          >
                            {msg.subject}
                          </div>
                        )}
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      </div>
                      <span className="mt-1.5 px-1 text-xs font-medium text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input Footer */}
            <div className="z-10 border-t border-slate-200 bg-white p-4 shadow-sm">
              <form
                onSubmit={handleSendMessage}
                className="mx-auto flex w-full max-w-4xl flex-col gap-3"
              >
                <input
                  type="text"
                  placeholder="Subjek (Opsional)"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-shadow focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ketik pesan Anda di sini..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm transition-shadow focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-800 p-3 text-white shadow-sm transition-colors hover:bg-slate-900 disabled:opacity-50"
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Default State (No Contact Selected) */
          <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 text-slate-500">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
              <User className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-lg font-bold tracking-wide text-slate-700 uppercase">
              Pesan Personal
            </p>
            <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
              Pilih guru atau siswa dari daftar di sebelah kiri untuk mulai mengirim dan menerima
              pesan secara privat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
