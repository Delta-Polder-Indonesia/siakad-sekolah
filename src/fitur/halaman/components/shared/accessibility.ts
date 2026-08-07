/**
 * Accessibility utilities untuk halaman components
 */

/**
 * Generate proper ARIA label untuk tombol navigation
 */
export function getNavAriaLabel(action: string, target?: string): string {
  if (target) {
    return `${action} ke ${target}`;
  }
  return action;
}

/**
 * Generate proper alt text untuk images dengan fallback
 */
export function getImageAltText(
  baseAlt: string,
  fallback?: string,
  context?: string
): string {
  if (context) {
    return `${baseAlt} - ${context}`;
  }
  return baseAlt || fallback || 'Gambar';
}

/**
 * Generate landmark roles untuk page structure
 */
export const LandmarkRoles = {
  MAIN: 'main',
  NAVIGATION: 'navigation',
  COMPLEMENTARY: 'complementary',
  CONTENTINFO: 'contentinfo',
  BANNER: 'banner',
  SEARCH: 'search',
} as const;

/**
 * Keyboard navigation utilities
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  action: () => void,
  allowedKeys: string[] = ['Enter', ' ', 'Escape']
) {
  if (allowedKeys.includes(event.key)) {
    event.preventDefault();
    action();
  }
}

/**
 * Focus management utilities
 */
export function trapFocus(
  containerRef: React.RefObject<HTMLElement>,
  previousActiveElement: HTMLElement | null
) {
  const focusableElements = containerRef.current?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (!focusableElements || focusableElements.length === 0) return;

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  containerRef.current?.addEventListener('keydown', handleTabKey);

  return () => {
    containerRef.current?.removeEventListener('keydown', handleTabKey);
    previousActiveElement?.focus();
  };
}

/**
 * Screen reader announcement utilities
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Generate proper heading hierarchy
 */
export function getHeadingLevel(level: 1 | 2 | 3 | 4 | 5 | 6): `h${1 | 2 | 3 | 4 | 5 | 6}` {
  return `h${level}` as `h${1 | 2 | 3 | 4 | 5 | 6}`;
}

/**
 * Check if element is in viewport untuk lazy loading
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}