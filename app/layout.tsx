import type { Metadata, Viewport } from 'next';
import './globals.css';
import { site } from '@/content/site';
import SmoothScroll from '@/components/ui/SmoothScroll';
import SiteLoader from '@/components/ui/SiteLoader';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — Wedding, Portrait & Film Studio`,
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: 'website' },
};

export const viewport: Viewport = { themeColor: '#0a0a0c' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
        />
      </head>
      <body className="grain">
        {/* JS off: never gate the site behind a loader that cannot run */}
        <noscript>
          <style>{`#site-loader{display:none!important}`}</style>
        </noscript>
        <SiteLoader />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
