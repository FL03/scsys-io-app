/*
  Appellation: page <shifts>
  Contrib: @FL03
*/
import { ShiftsDisplay } from '@/features/shifts';

export const runtime = 'edge';

export default function Page() {
  return <ShiftsDisplay title="Shifts" />;
}
Page.displayName = 'ShiftPage';
