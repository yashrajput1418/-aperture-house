'use client';
import dynamic from 'next/dynamic';
import { usePreview } from '@/lib/preview';
import EditorialCase from './case/EditorialCase';
import type { Project } from '@/content/site';

const SplitCase = dynamic(() => import('./case/SplitCase'));
const IndexCase = dynamic(() => import('./case/IndexCase'));
const ReelCase = dynamic(() => import('./case/ReelCase'));

export default function CaseRouter({ p, next }: { p: Project; next: Project }) {
  const { brand } = usePreview();
  switch (brand.caseLayout) {
    case 'split':
      return <SplitCase p={p} next={next} />;
    case 'index':
      return <IndexCase p={p} next={next} />;
    case 'reel':
      return <ReelCase p={p} next={next} />;
    default:
      return <EditorialCase p={p} next={next} />;
  }
}
