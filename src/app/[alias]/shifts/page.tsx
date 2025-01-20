/*
  Appellation: page <shifts>
  Contrib: @FL03
*/
'use server';
import dynamic from 'next/dynamic';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';


type PageProps = PagePropsWithParams<{ alias: string }>;

export default async function Page() {
  // const { alias } = params;
  const Screen = dynamic(async () => (await import('@/features/shifts/views')).ShiftDashboard, { ssr: true });
  return Screen ? <Screen title="Shifts"/> : null;
}
Page.displayName = 'ShiftPage';

export const generateMetadata: NextMetaGenerator<PageProps> = async (
  { params },
  _parent
) => {
  const { alias: _username } = await params;
  return {
    title: 'Shifts',
    description: 'View and manage your shifts and tips.',
  };
};
