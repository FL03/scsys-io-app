/*
  Appellation: page <notifications>
  Contrib: @FL03
*/
import { NotificationCenter } from '@/features/notifications';

export const runtime  = 'edge';

export default function Page() {
  return <NotificationCenter />;
}
Page.displayName = 'NotificationsPage';
