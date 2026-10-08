'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { site } from '@/content/site';

export type LogoMark = 'aperture' | 'lens' | 'frame' | 'monogram' | 'custom';

export type Brand = {
  name: string;
  accent: string;
  ink: string;
  ink2: string;
  mark: LogoMark;
  /** data: URL for an uploaded logo, only used when mark === 'custom' */
  logoSrc?: string;
};

export const defaultBrand: Brand = {
  name: site.name,
  accent: site.preview.accents[0],
  ink: site.preview.grounds[0].ink,
  ink2: site.preview.grounds[0].ink2,
  mark: 'aperture',
};

type Ctx = {
  brand: Brand;
  /** False when the demo panel is switched off in site.ts. */
  editable: boolean;
  set: (patch: Partial<Brand>) => void;
  reset: () => void;
  shareUrl: () => string;
};

const PreviewContext = createContext<Ctx>({
  brand: defaultBrand,
  editable: false,
  set: () => {},
  reset: () => {},
  shareUrl: () => '',
});

const STORAGE_KEY = 'studio-brand-preview';

/** Brand state survives a reload and can be shared as a ?brand= link. */
function decode(raw: string): Partial<Brand> | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(raw))));
  } catch {
    return null;
  }
}
function encode(brand: Brand): string {
  // the uploaded logo is far too big for a URL — share the rest
  const { logoSrc, ...rest } = brand;
  void logoSrc;
  return btoa(unescape(encodeURIComponent(JSON.stringify(rest))));
}

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const editable = site.preview.enabled;
  const [brand, setBrand] = useState<Brand>(defaultBrand);

  // restore: ?brand= wins over localStorage so a shared link always shows its own theme
  useEffect(() => {
    if (!editable) return;
    const fromUrl = new URLSearchParams(window.location.search).get('brand');
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const patch = (fromUrl && decode(fromUrl)) || (stored ? (JSON.parse(stored) as Partial<Brand>) : null);
    if (patch) setBrand((b) => ({ ...b, ...patch }));
  }, [editable]);

  // paint: the design tokens are CSS custom properties, so this repaints everything
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-accent', brand.accent);
    root.style.setProperty('--color-ink', brand.ink);
    root.style.setProperty('--color-ink-2', brand.ink2);
    document.body.style.background = brand.ink;
  }, [brand.accent, brand.ink, brand.ink2]);

  const set = useCallback(
    (patch: Partial<Brand>) => {
      setBrand((b) => {
        const nextBrand = { ...b, ...patch };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBrand));
        } catch {
          /* quota — an uploaded logo can be large; the theme still applies this session */
        }
        return nextBrand;
      });
    },
    []
  );

  const reset = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setBrand(defaultBrand);
  }, []);

  const shareUrl = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('brand', encode(brand));
    return url.toString();
  }, [brand]);

  const value = useMemo(
    () => ({ brand, editable, set, reset, shareUrl }),
    [brand, editable, set, reset, shareUrl]
  );

  return <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>;
}

export const usePreview = () => useContext(PreviewContext);

/** The studio name as it should be displayed — preview override or site.ts. */
export const useBrandName = () => useContext(PreviewContext).brand.name;
