'use client';
import dynamic from 'next/dynamic';
import { usePreview } from '@/lib/preview';
import CollageHome from './home/CollageHome';

/**
 * Picks the home layout. The default ships in the main bundle; the other
 * three are code-split, so a visitor who never opens the settings panel
 * downloads only the layout they are looking at.
 */
const EditorialHome = dynamic(() => import('./home/EditorialHome'));
const CinematicHome = dynamic(() => import('./home/CinematicHome'));
const GridHome = dynamic(() => import('./home/GridHome'));

export default function HomeRouter() {
  const { brand } = usePreview();
  switch (brand.homeLayout) {
    case 'editorial':
      return <EditorialHome />;
    case 'cinematic':
      return <CinematicHome />;
    case 'grid':
      return <GridHome />;
    default:
      return <CollageHome />;
  }
}
