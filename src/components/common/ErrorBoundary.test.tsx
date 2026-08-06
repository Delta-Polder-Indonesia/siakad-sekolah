import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const Bomb = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Component OK</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child Content')).toBeDefined();
  });

  it('renders fallback UI when child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Terjadi kendala pada aplikasi')).toBeDefined();
    expect(screen.getByText('Coba Lagi')).toBeDefined();

    vi.restoreAllMocks();
  });

  it('renders custom fallbackUI when provided', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallbackUI={<div>Custom Error UI</div>}>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error UI')).toBeDefined();

    vi.restoreAllMocks();
  });

  it('resets error state when "Coba Lagi" is clicked', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const onReset = vi.fn();
    const { container } = render(
      <ErrorBoundary onReset={onReset}>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Terjadi kendala pada aplikasi')).toBeDefined();

    fireEvent.click(screen.getByText('Coba Lagi'));

    expect(onReset).toHaveBeenCalledTimes(1);

    vi.restoreAllMocks();
  });
});
