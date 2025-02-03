/*
  Appellation: page <shifts::<[id]>>
  Contrib: @FL03
*/
// project
import { shiftsTable, ShiftDetailScreen } from '@/features/shifts';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';

type PageProps = PagePropsWithParams<
  { alias: string; id: string },
  {
    action?: string;
    view?: string;
  }
>;

export default function Page() {
  return <ShiftDetailScreen />;
}
Page.displayName = 'ShiftDetailsPage';

export const generateMetadata: NextMetaGenerator<PageProps> = async (
  { params },
  parent
) => {
  // read route params
  const { id } = await params;
  // fetch data
  const { data } = await shiftsTable.fetch(id);
  // optionally access and extend (rather than replace) parent metadata
  const images = (await parent).openGraph?.images || [];

  const date = new Date(data?.date).toLocaleDateString();

  return {
    title: `Shift (${date})`,
    description: `View and manage your shift on ${date}.`,
    openGraph: {
      images: [...images],
    },
  };
};
