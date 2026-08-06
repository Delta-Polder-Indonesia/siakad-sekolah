import { describe, expect, it } from 'vitest';
import { bacaFileSebagaiDataUrl } from './gambar';

describe('bacaFileSebagaiDataUrl', () => {
  it('resolves with data URL on successful read', async () => {
    const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const result = await bacaFileSebagaiDataUrl(mockFile);
    expect(result).toContain('data:text/plain;base64,');
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles empty file', async () => {
    const result = await bacaFileSebagaiDataUrl(new File([], 'empty.txt'));
    expect(result).toBeDefined();
  });
});
