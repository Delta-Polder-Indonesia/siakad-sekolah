import { describe, expect, it, vi } from 'vitest';
import { escapeHtml, printViaBlob } from './print';

describe('escapeHtml', () => {
  it('mengembalikan string kosong untuk null/undefined', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('meng-escape karakter HTML dangerous', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(escapeHtml('a & b < c > d')).toBe('a &amp; b &lt; c &gt; d');
  });

  it('meng-escape kutip ganda dan kutip tunggal', () => {
    expect(escapeHtml('"quote"')).toBe('&quot;quote&quot;');
    expect(escapeHtml("'apos'")).toBe('&#39;apos&#39;');
  });

  it('mengkonversi nilai non-string', () => {
    expect(escapeHtml(42)).toBe('42');
    expect(escapeHtml(true)).toBe('true');
  });

  it('tidak mengubah string aman', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
  });
});

describe('printViaBlob', () => {
  const originalOpen = window.open;

  it('tidak melakukan apa-apa jika window.open gagal', () => {
    window.open = vi.fn(() => null);
    expect(() => printViaBlob('<p>hello</p>')).not.toThrow();
    window.open = originalOpen;
  });

  it('membuka jendela, menunggu load, lalu memanggil print dan close', () => {
    const mockPrint = vi.fn();
    const mockClose = vi.fn();
    const mockRevoke = vi.fn();
    const mockWindow = {
      closed: false,
      print: mockPrint,
      close: mockClose,
      onload: null as null | (() => void),
    };

    window.open = vi.fn(() => mockWindow as unknown as Window);
    vi.stubGlobal(
      'Blob',
      class {
        constructor(public parts: unknown[]) {}
      }
    );
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: mockRevoke,
    });

    printViaBlob('<p>test</p>', { title: 'Test Print' });

    expect(window.open).toHaveBeenCalledWith(
      'blob:mock-url',
      '_blank',
      'width=1200,height=800,scrollbars=yes,resizable=yes'
    );

    // Simulasi window.onload
    if (mockWindow.onload) mockWindow.onload();

    expect(mockPrint).toHaveBeenCalledOnce();
    expect(mockClose).toHaveBeenCalledOnce();
    expect(mockRevoke).toHaveBeenCalledWith('blob:mock-url');

    window.open = originalOpen;
  });
});
