import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRafCallback } from './useRafCallback';

describe('useRafCallback', () => {
  let nextFrameId: number;
  let frames: Map<number, FrameRequestCallback>;

  beforeEach(() => {
    nextFrameId = 0;
    frames = new Map();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      const id = ++nextFrameId;
      frames.set(id, callback);
      return id;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      frames.delete(id);
    });
  });

  it('menggabungkan beberapa event dalam satu frame dan memakai argumen terbaru', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useRafCallback(callback));

    act(() => {
      result.current('pertama');
      result.current('terakhir');
    });

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      frames.get(1)?.(16);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('terakhir');
  });

  it('membatalkan frame yang masih tertunda saat unmount', () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useRafCallback(callback));

    act(() => result.current());
    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(frames.has(1)).toBe(false);
    expect(callback).not.toHaveBeenCalled();
  });
});
