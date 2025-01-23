/*
  Appellation: page <shifts>
  Contrib: @FL03
*/
'use server';
import { ShiftScreen } from '@/features/shifts';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';


type PageProps = PagePropsWithParams<{ alias: string }>;

export default async function Page() {
  // const { alias } = params;
  return <ShiftScreen title="Shifts" />;
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
