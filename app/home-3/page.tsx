import { HomeRoute, homeMetadata } from '@/components/layouts/HomeRoute';

export const metadata = homeMetadata(3);

export default function Page() {
  return <HomeRoute version={3} />;
}
