import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import type { PageProps } from '../../types';
import Skeleton from './Skeleton';

/**
 * Page skeleton shown while lazy chunk is loading.
 * Matches design system: slate bg, skeleton blocks for title + content.
 */
export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <Skeleton className="h-8 w-64 rounded-md" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
      </div>
      <Skeleton className="h-72 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
    </div>
  );
}

/**
 * Creates a lazy-loaded page component with Suspense and PageSkeleton fallback.
 * Use in page registries instead of static imports:
 *
 *   const MyPage = lazyPage(() => import('./MyPage'));
 *   PAGES = { myPage: MyPage };
 *
 * Returns ComponentType<PageProps> — the lazy component receives all PageProps
 * via the spread operator from the wrapping component.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function lazyPage(
  importFn: () => Promise<{ default: ComponentType<any> }>
): ComponentType<PageProps> {
  const LazyComp: LazyExoticComponent<ComponentType<any>> = lazy(importFn);
  const LazyPageComponent = (props: PageProps) => (
    <Suspense fallback={<PageSkeleton />}>
      <LazyComp {...props} />
    </Suspense>
  );
  LazyPageComponent.displayName = `LazyPage(${importFn.toString().slice(0, 40)})`;
  return LazyPageComponent;
}
