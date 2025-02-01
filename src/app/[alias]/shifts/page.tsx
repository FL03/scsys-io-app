/*
  Appellation: page <shifts>
  Contrib: @FL03
*/
import { ShiftScreen } from '@/features/shifts';

export const runtime = 'edge';

export default function Page() {
  return <ShiftScreen title="Shifts" />;
}
Page.displayName = 'ShiftPage';
