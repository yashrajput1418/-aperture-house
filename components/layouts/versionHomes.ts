import type { ComponentType } from 'react';
import type { Version } from '@/lib/version';

/**
 * Where each version's pages live.
 *
 * Routes resolve a version through these maps rather than importing all
 * four layouts directly, so a disabled version's code is never pulled into
 * a page it does not render. The import callbacks are written out one by
 * one (not built from a template string) so the bundler can still see
 * them and split them into their own chunks.
 */
export const homeFor: Record<Version, () => Promise<{ default: ComponentType }>> = {
  1: () => import('@/components/v1/Home'),
  2: () => import('@/components/v2/Home'),
  3: () => import('@/components/v3/Home'),
  4: () => import('@/components/v4/Home'),
};

export const caseFor: Record<
  Version,
  () => Promise<{ default: ComponentType<{ p: CaseProps['p']; next: CaseProps['next'] }> }>
> = {
  1: () => import('@/components/v1/Case'),
  2: () => import('@/components/v2/Case'),
  3: () => import('@/components/v3/Case'),
  4: () => import('@/components/v4/Case'),
};

type CaseProps = {
  p: import('@/content/site').Project;
  next: import('@/content/site').Project;
};
