/*
  Appellation: page <notifications>
  Contrib: @FL03
*/
import dynamic from 'next/dynamic';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';

type PageProps = PagePropsWithParams<{
  alias: string;
}>;

/**
 * Notification center
 */
export default async function Page({ params }: PageProps) {
  const { alias } = await params;
  const NotificationCenter = dynamic(() => import('@/features/notifications/screens/notification-center'));
  return <NotificationCenter username={alias}/>;
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
