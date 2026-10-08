import { HomeRoute, homeMetadata } from '@/components/layouts/HomeRoute';

export const metadata = homeMetadata(4);

export default function Page() {
  return <HomeRoute version={4} />;
}
