/**
 * DiskusiTugas — forum & chat grup untuk tugas online.
 *
 * Dipecah dari satu file 1.287 baris menjadi:
 *   useDiskusiTugas.ts        → semua state, memo, effect, handler (logika)
 *   DiskusiTugas.types.ts     → tipe bersama + helper murni (Avatar, hari)
 *   DiskusiTugasCompact.tsx   → varian ringkas (forum saja)
 *   DiskusiTugasHeader.tsx    → judul percakapan + toggle Forum/Grup
 *   DiskusiTugasSidebar.tsx   → panel kiri: peserta forum / grup & anggota
 *   DiskusiTugasStream.tsx    → alur pesan (bubble, edit, hapus)
 *   DiskusiTugasComposer.tsx  → input pesan + lampiran + indikator mengetik
 *
 * Komponen ini murni presentasional: membaca hasil `useDiskusiTugas`
 * dan menyusun sub-komponen.
 */
import { useDiskusiTugas } from './useDiskusiTugas';
import { deleteChatGroup } from '../../../data/services';
import DiskusiTugasCompact from './DiskusiTugasCompact';
import DiskusiTugasHeader from './DiskusiTugasHeader';
import DiskusiTugasSidebar from './DiskusiTugasSidebar';
import DiskusiTugasStream from './DiskusiTugasStream';
import DiskusiTugasComposer from './DiskusiTugasComposer';
import type { DiskusiTugasProps } from './DiskusiTugas.types';

export type { DiskusiTugasProps } from './DiskusiTugas.types';

export default function DiskusiTugas({
  assignment,
  user,
  variant = 'full',
  onPosted,
  fill = false,
  leftFooter,
}: DiskusiTugasProps) {
  const h = useDiskusiTugas(assignment, user, onPosted);

  // ── Varian compact: hanya forum + kotak balasan ──
  if (variant === 'compact') {
    return (
      <DiskusiTugasCompact
        discussions={h.discussions}
        draft={h.draft}
        onDraftChange={h.setDraft}
        onSend={h.handleSendForum}
        user={user}
      />
    );
  }

  const activeTitle = h.privateTarget
    ? `Chat Privat`
    : h.mode === 'forum'
      ? 'Forum Diskusi Kelas'
      : (h.selectedGroup?.name ?? 'Grup');
  const activeSubtitle = h.privateTarget
    ? `Dengan ${h.privateTarget.name}`
    : h.mode === 'forum'
      ? `${h.discussions.length} pesan · terlihat semua murid`
      : h.selectedGroup
        ? `${h.selectedGroup.memberIds.length} anggota`
        : '';

  const canSend = h.privateTarget
    ? !!user
    : h.mode === 'forum'
      ? !!user
      : !!user && !!h.selectedGroup && (h.isTeacher || h.selectedGroup.memberIds.includes(user.id));

  return (
    <div
      className={`flex w-full border-2 border-black bg-white font-sans text-black ${
        fill ? 'h-full min-h-0' : 'h-[600px] max-h-[calc(100dvh-180px)]'
      }`}
    >
      {/* ----------------- PANEL KIRI: FORUM / GRUP ----------------- */}
      <DiskusiTugasSidebar
        mode={h.mode}
        searchQuery={h.searchQuery}
        onSearchQueryChange={h.setSearchQuery}
        q={h.q}
        user={user}
        isTeacher={h.isTeacher}
        filteredStudents={h.filteredStudents}
        allStudents={h.students}
        privateUnreadMap={h.privateUnreadMap}
        privateTarget={h.privateTarget}
        onSelectPrivateTarget={h.setPrivateTarget}
        filteredGroups={h.filteredGroups}
        selectedGroupId={h.selectedGroupId}
        onSelectGroup={h.setSelectedGroupId}
        groupUnreadMap={h.groupUnreadMap}
        onCreateGroup={h.handleCreateGroup}
        onDeleteGroup={(id) => {
          deleteChatGroup(id);
          if (h.selectedGroupId === id) h.setSelectedGroupId('');
        }}
        onJoinLeaveGroup={h.handleJoinLeaveGroup}
        selectedGroup={h.selectedGroup}
        isMemberOfSelected={h.isMemberOfSelected}
        addingMembers={h.addingMembers}
        onToggleAddingMembers={() => h.setAddingMembers(!h.addingMembers)}
        shownMembers={h.shownMembers}
        shownCandidates={h.shownCandidates}
        onToggleMember={h.handleToggleMember}
        leftFooter={leftFooter}
      />

      {/* ----------------- PANEL KANAN: WORKSPACE CHAT ----------------- */}
      <div className="flex flex-1 flex-col justify-between">
        <DiskusiTugasHeader
          mode={h.mode}
          privateTarget={h.privateTarget}
          activeTitle={activeTitle}
          activeSubtitle={activeSubtitle}
          forumUnread={h.forumUnread}
          onSetMode={h.setMode}
          onBackFromPrivate={() => h.setPrivateTarget(null)}
        />

        <DiskusiTugasStream
          streamRef={h.streamRef}
          messages={h.filteredStream}
          q={h.q}
          user={user}
          mode={h.mode}
          privateTarget={h.privateTarget}
          editingId={h.editingId}
          editingText={h.editingText}
          menuOpenId={h.menuOpenId}
          onEditingTextChange={h.setEditingText}
          onStartEdit={h.handleStartEdit}
          onCancelEdit={() => {
            h.setEditingId(null);
            h.setEditingText('');
          }}
          onSaveEdit={h.handleSaveEdit}
          onDeleteMessage={h.handleDeleteMessage}
          onToggleMenu={(id) => h.setMenuOpenId(h.menuOpenId === id ? null : id)}
        />

        <DiskusiTugasComposer
          draft={h.draft}
          onDraftChange={h.setDraft}
          onSend={h.handleSend}
          canSend={canSend}
          typingUsers={h.typingUsers}
          pendingAttachment={h.pendingAttachment}
          onRemoveAttachment={() => h.setPendingAttachment(null)}
          onPickFile={h.handlePickFile}
          fileInputRef={h.fileInputRef}
          onTyping={h.handleTyping}
          onStopTyping={h.handleStopTyping}
          mode={h.mode}
          privateTarget={h.privateTarget}
        />
      </div>
    </div>
  );
}
