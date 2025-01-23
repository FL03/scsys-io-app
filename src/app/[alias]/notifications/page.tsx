/*
  Appellation: page <notifications>
  Contrib: @FL03
*/
import { NotificationCenter } from '@/features/notifications';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';

type PageProps = PagePropsWithParams<{
  alias: string;
}>;

/**
 * Notification center
 */
export default async function Page({ params }: PageProps) {
  const { alias } = await params;
  return <NotificationCenter username={alias} />;
}
Page.displayName = 'NotificationsPage';

export const generateMetadata: NextMetaGenerator<PageProps> = async (
  _props,
  _parent
) => {
  return {
    title: 'Notifications',
    description: 'The notification center for your account.',
  };
};
