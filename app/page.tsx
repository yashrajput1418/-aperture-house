import { defaultVersion } from '@/lib/version';
import { homeFor } from '@/components/layouts/versionHomes';

/**
 * `/` renders whichever version `site.versions.default` points at — see
 * lib/version.ts. Nothing needs deleting to ship a single layout.
 */
export default async function Page() {
  const { default: Home } = await homeFor[defaultVersion]();
  return <Home />;
}
