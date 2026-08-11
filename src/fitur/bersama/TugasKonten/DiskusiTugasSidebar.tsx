/**
 * Panel kiri DiskusiTugas: pencarian + daftar peserta forum (dengan presence
 * & chat privat) atau daftar grup + manajemen anggota. Dipecah dari DiskusiTugas.tsx.
 */
import type { ReactNode } from 'react';
import { Search, Plus, Users, UserPlus, UserMinus, X } from 'lucide-react';
import type { AuthUser, ChatGroup, Student } from '../../../types';
import { isStudentOnline } from '../../../data/services';
import { warnaNama } from '../../../codewarna/warnaNama';
import { PresenceDot, type ChatMode, type PrivateTarget } from './DiskusiTugas.types';

interface DiskusiTugasSidebarProps {
  mode: ChatMode;
  searchQuery: string;
  onSearchQueryChange: (v: string) => void;
  q: string;
  user?: AuthUser | null;
  isTeacher: boolean;

  // Mode forum: daftar siswa + chat privat
  filteredStudents: Student[];
  /** Semua siswa kelas (tanpa filter) — dipakai untuk inisial avatar member grup. */
  allStudents: Student[];
  privateUnreadMap: Record<string, number>;
  privateTarget: PrivateTarget | null;
  onSelectPrivateTarget: (target: PrivateTarget) => void;

  // Mode grup: daftar grup
  filteredGroups: ChatGroup[];
  selectedGroupId: string;
  onSelectGroup: (id: string) => void;
  groupUnreadMap: Record<string, number>;
  onCreateGroup: () => void;
  onDeleteGroup: (id: string) => void;
  onJoinLeaveGroup: (groupId: string) => void;

  // Manajemen anggota grup
  selectedGroup: ChatGroup | null;
  isMemberOfSelected: boolean;
  addingMembers: boolean;
  onToggleAddingMembers: () => void;
  shownMembers: Student[];
  shownCandidates: Student[];
  onToggleMember: (studentId: string) => void;

  leftFooter?: ReactNode;
}

export default function DiskusiTugasSidebar(props: DiskusiTugasSidebarProps) {
  const {
    mode,
    searchQuery,
    onSearchQueryChange,
    q,
    user,
    isTeacher,
    filteredStudents,
    allStudents,
    privateUnreadMap,
    privateTarget,
    onSelectPrivateTarget,
    filteredGroups,
    selectedGroupId,
    onSelectGroup,
    groupUnreadMap,
    onCreateGroup,
    onDeleteGroup,
    onJoinLeaveGroup,
    selectedGroup,
    isMemberOfSelected,
    addingMembers,
    onToggleAddingMembers,
    shownMembers,
    shownCandidates,
    onToggleMember,
    leftFooter,
  } = props;

  return (
    <aside className="flex w-72 flex-col border-r-2 border-black">
      {/* Search Input */}
      <div className="flex items-center gap-2 border-b-2 border-black px-3 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-black/50" />
        <input
          type="text"
          placeholder="Cari percakapan..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full bg-transparent text-xs outline-none placeholder:text-black/40"
        />
      </div>

      {mode === 'forum' ? (
        /* ---------- MODE FORUM (terlihat semua murid) ---------- */
        <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="border-b-2 border-black bg-white px-3 py-1.5 text-[10px] font-bold tracking-wider text-black uppercase">
            Peserta Forum (Semua)
          </div>
          {filteredStudents.length === 0 && (
            <div className="px-3 py-6 text-center">
              <Search className="mx-auto h-6 w-6 text-black/30" />
              <p className="mt-2 text-[11px] text-black/50 italic">
                {q
                  ? 'Tidak ada siswa yang cocok dengan pencarian.'
                  : 'Belum ada siswa di kelas ini.'}
              </p>
            </div>
          )}
          <div>
            {filteredStudents.map((student) => {
              const online = isStudentOnline(student.id);
              const unread = privateUnreadMap[student.id] ?? 0;
              const isTarget = privateTarget?.id === student.id;
              return (
                <div
                  key={student.id}
                  onClick={() => onSelectPrivateTarget({ id: student.id, name: student.name })}
                  className={`flex cursor-pointer items-center justify-between border-b border-black/10 px-3 py-2.5 last:border-0 ${
                    isTarget
                      ? 'bg-neutral-100 text-black shadow-[inset_3px_0_0_0_#2563eb]'
                      : 'hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <PresenceDot online={online} />
                    <p className="truncate text-xs" style={{ color: warnaNama(student.name) }}>
                      {student.name}
                    </p>
                    {unread > 0 && (
                      <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </div>
                  <span
                    className={`shrink-0 text-[10px] ${isTarget ? 'text-black/60' : 'text-black/40'}`}
                  >
                    {online ? 'Aktif' : 'Offline'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ---------- MODE GRUP (chat privat per grup) ---------- */
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Kotak GRUP (bingkai terpisah, scroll sendiri) */}
          <div className="flex min-h-0 flex-1 flex-col border-b-2 border-black">
            <div className="flex items-center justify-between border-b-2 border-black bg-white px-3 py-1.5">
              <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                Grup
              </span>
              {isTeacher && (
                <button
                  type="button"
                  onClick={onCreateGroup}
                  title="Buat grup baru"
                  className="inline-flex cursor-pointer items-center gap-0.5 text-[11px] font-bold text-black hover:text-black/60"
                >
                  <Plus className="h-3.5 w-3.5" /> Grup
                </button>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {filteredGroups.length === 0 && (
                <div className="px-3 py-6 text-center">
                  {q ? (
                    <Search className="mx-auto h-6 w-6 text-black/30" />
                  ) : (
                    <Users className="mx-auto h-6 w-6 text-black/30" />
                  )}
                  <p className="mt-2 text-[11px] text-black/50 italic">
                    {q
                      ? 'Tidak ada grup yang cocok dengan pencarian.'
                      : isTeacher
                        ? 'Belum ada grup. Klik "+ Grup" untuk membuat.'
                        : 'Belum ada grup di kelas ini. Gabung ke grup yang dibuat guru untuk mulai berdiskusi.'}
                  </p>
                </div>
              )}{' '}
              {filteredGroups.map((group) => {
                const isSelected = group.id === selectedGroupId;
                const isMember = user ? group.memberIds.includes(user.id) : false;
                const unread = groupUnreadMap[group.id] ?? 0;
                return (
                  <div
                    key={group.id}
                    onClick={() => onSelectGroup(group.id)}
                    className={`flex cursor-pointer items-center justify-between border-b border-black/10 px-3 py-2.5 transition-colors last:border-0 ${
                      isSelected
                        ? 'bg-neutral-100 text-black shadow-[inset_3px_0_0_0_#2563eb]'
                        : 'hover:bg-neutral-100'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="flex items-center gap-1.5 truncate text-xs font-bold">
                        <span className="truncate" style={{ color: warnaNama(group.name) }}>
                          {group.name}
                        </span>
                        {isMember && unread > 0 && (
                          <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                            {unread}
                          </span>
                        )}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        {group.memberIds.length > 0 && (
                          <span className="flex shrink-0 -space-x-1.5">
                            {group.memberIds.slice(0, 4).map((mid) => {
                              const member = allStudents.find((s) => s.id === mid);
                              return (
                                <span
                                  key={mid}
                                  className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[8px] font-bold text-blue-800 ring-1 ring-white"
                                >
                                  {(member?.name?.trim().charAt(0) || '?').toUpperCase()}
                                </span>
                              );
                            })}
                          </span>
                        )}
                        <p className="truncate text-[10px] text-black/40">
                          {group.memberIds.length} anggota
                          {isMember ? ' · Anda anggota' : ' · Anda belum bergabung'}
                        </p>
                      </div>
                    </div>
                    {isTeacher ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteGroup(group.id);
                        }}
                        title="Hapus grup"
                        className="shrink-0 rounded p-0.5 hover:bg-white/20"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onJoinLeaveGroup(group.id);
                        }}
                        title={isMember ? 'Keluar dari grup' : 'Gabung ke grup'}
                        className={`inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                          isMember
                            ? 'border-black/10 text-black/50 hover:bg-neutral-100'
                            : 'border-black text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {isMember ? (
                          <UserMinus className="h-3 w-3" />
                        ) : (
                          <UserPlus className="h-3 w-3" />
                        )}
                        {isMember ? 'Keluar' : 'Gabung'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kotak ANGGOTA (hanya anggota grup; bingkai terpisah, scroll sendiri) */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b-2 border-black bg-white px-3 py-1.5">
              <span className="text-[10px] font-bold tracking-wider text-black uppercase">
                Anggota {selectedGroup ? `(${selectedGroup.memberIds.length})` : ''}
              </span>
              {isTeacher && (
                <button
                  type="button"
                  onClick={onToggleAddingMembers}
                  disabled={!selectedGroup}
                  title={addingMembers ? 'Tutup daftar calon anggota' : 'Tambah anggota ke grup'}
                  className="inline-flex cursor-pointer items-center gap-0.5 text-[11px] font-bold text-black hover:text-black/60 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {addingMembers ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  {addingMembers ? 'Selesai' : '+ Tambah'}
                </button>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {!selectedGroup && (
                <div className="px-3 py-6 text-center">
                  <Users className="mx-auto h-6 w-6 text-black/30" />
                  <p className="mt-2 text-[11px] text-black/50 italic">
                    Pilih grup dari daftar untuk melihat anggotanya.
                  </p>
                </div>
              )}

              {selectedGroup && !isTeacher && !isMemberOfSelected && (
                <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
                  <p className="text-[11px] text-black/50 italic">
                    Anda belum menjadi anggota grup ini.
                  </p>
                  <button
                    type="button"
                    onClick={() => onJoinLeaveGroup(selectedGroup.id)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md border-2 border-black px-2.5 py-1 text-[10px] font-bold transition-colors hover:bg-neutral-100"
                  >
                    <UserPlus className="h-3 w-3" /> Gabung Grup
                  </button>
                </div>
              )}

              {selectedGroup && isTeacher && !addingMembers && shownMembers.length === 0 && (
                <div className="px-3 py-6 text-center">
                  <Users className="mx-auto h-6 w-6 text-black/30" />
                  <p className="mt-2 text-[11px] text-black/50 italic">
                    {q
                      ? 'Tidak ada siswa yang cocok dengan pencarian.'
                      : 'Belum ada anggota di grup ini. Klik "+ Tambah" untuk menambah siswa.'}
                  </p>
                </div>
              )}

              {selectedGroup && addingMembers && shownCandidates.length === 0 && (
                <div className="px-3 py-6 text-center">
                  <UserPlus className="mx-auto h-6 w-6 text-black/30" />
                  <p className="mt-2 text-[11px] text-black/50 italic">
                    {q ? 'Tidak ada siswa yang cocok.' : 'Semua siswa sudah menjadi anggota.'}
                  </p>
                </div>
              )}

              {selectedGroup &&
                !addingMembers &&
                shownMembers.map((student) => {
                  const online = isStudentOnline(student.id);
                  const unread = privateUnreadMap[student.id] ?? 0;
                  return (
                    <div
                      key={student.id}
                      onClick={() => onSelectPrivateTarget({ id: student.id, name: student.name })}
                      className="flex cursor-pointer items-center justify-between border-b border-black/10 px-3 py-2 last:border-0 hover:bg-neutral-100"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <PresenceDot online={online} />
                        <p className="truncate text-xs" style={{ color: warnaNama(student.name) }}>
                          {student.name}
                        </p>
                        {unread > 0 && (
                          <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                            {unread}
                          </span>
                        )}
                      </div>
                      {isTeacher && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleMember(student.id);
                          }}
                          title="Keluarkan dari grup"
                          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border-2 border-black px-1.5 py-0.5 text-[10px] font-bold transition-colors hover:bg-neutral-100"
                        >
                          <UserMinus className="h-3 w-3" /> Keluar
                        </button>
                      )}
                    </div>
                  );
                })}

              {selectedGroup &&
                addingMembers &&
                shownCandidates.map((student) => {
                  const online = isStudentOnline(student.id);
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between border-b border-black/10 px-3 py-2 last:border-0"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <PresenceDot online={online} />
                        <p className="truncate text-xs" style={{ color: warnaNama(student.name) }}>
                          {student.name}
                        </p>
                      </div>
                      {isTeacher && (
                        <button
                          type="button"
                          onClick={() => onToggleMember(student.id)}
                          title="Tambahkan ke grup"
                          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border-2 border-black px-1.5 py-0.5 text-[10px] font-bold transition-colors hover:bg-neutral-100"
                        >
                          <UserPlus className="h-3 w-3" /> + Grup
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {leftFooter && <div className="border-t-2 border-black p-3">{leftFooter}</div>}
    </aside>
  );
}
