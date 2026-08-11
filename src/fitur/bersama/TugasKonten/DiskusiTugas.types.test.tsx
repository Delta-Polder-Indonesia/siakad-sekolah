/**
 * Unit test helper murni DiskusiTugas (dipecah dari DiskusiTugas.tsx).
 */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import {
  getDayKey,
  getDayLabel,
  PresenceDot,
  Avatar,
  isPrivateMessage,
} from './DiskusiTugas.types';
import type { PrivateMessage, GroupChatMessage } from '../../../types';

describe('DiskusiTugas helpers (dipisah dari DiskusiTugas.tsx)', () => {
  it('getDayKey memakai format Y-M-D (bulan 0-indexed, persis implementasi asli)', () => {
    const ts = new Date(2026, 7, 11, 10, 30).getTime(); // 11 Agustus 2026
    expect(getDayKey(ts)).toBe('2026-7-11');
  });

  it('getDayLabel menampilkan "Hari Ini" untuk tanggal hari ini', () => {
    expect(getDayLabel(Date.now())).toBe('Hari Ini');
  });

  it('getDayLabel menampilkan "Kemarin" untuk tanggal kemarin', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(getDayLabel(yesterday.getTime())).toBe('Kemarin');
  });

  it('getDayLabel menampilkan tanggal lokal untuk hari lain', () => {
    const ts = new Date(2026, 0, 5, 9, 0).getTime();
    const label = getDayLabel(ts);
    expect(label).toMatch(/2026/);
  });

  it('isPrivateMessage membedakan pesan privat (senderId) vs grup (authorId)', () => {
    const privateMsg: PrivateMessage = {
      id: 'p1',
      senderId: 's1',
      receiverId: 's2',
      authorName: 'A',
      role: 'murid',
      message: 'halo',
      createdAt: 1,
    };
    const groupMsg: GroupChatMessage = {
      id: 'g1',
      groupId: 'g1',
      authorId: 's1',
      authorName: 'A',
      role: 'murid',
      message: 'halo',
      createdAt: 1,
    };
    expect(isPrivateMessage(privateMsg)).toBe(true);
    expect(isPrivateMessage(groupMsg)).toBe(false);
  });

  it('PresenceDot menampilkan indikator online/offline', () => {
    const { container: dotOn } = render(<PresenceDot online />);
    expect(dotOn.querySelector('span')?.className).toContain('bg-emerald-500');
    const { container: dotOff } = render(<PresenceDot online={false} />);
    expect(dotOff.querySelector('span')?.className).toContain('bg-neutral-300');
  });

  it('Avatar menampilkan inisial nama', () => {
    const { container } = render(<Avatar name="Budi" />);
    expect(container.textContent).toBe('B');
  });
});
