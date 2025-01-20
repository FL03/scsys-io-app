/*
  Appellation: page <notifications>
  Contrib: @FL03
*/
import * as React from 'react';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';
import { NotificationCenter } from '@/features/notifications';

type PageProps = PagePropsWithParams<{
  alias: string;
}>;

/**
 * Notification center
 */
export default async function Page() {
  return <NotificationCenter />;
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
