/*
  Appellation: page <[alias]>
  Contrib: @FL03
*/
'use server';
// project
import { ProfileScreen } from '@/features/profiles';
import { PagePropsWithParams, NextMetaGenerator } from '@/types';

type PageProps = PagePropsWithParams<{ alias: string }>;

export default async function Page() {
  return <ProfileScreen />;
}
Page.displayName = 'ProfilePage';

export const generateMetadata: NextMetaGenerator<PageProps> = async (
  { params },
  parent
) => {
  const { alias } = await params;

  // optionally access and extend (rather than replace) parent metadata
  const images = (await parent).openGraph?.images || [];

  if (false) {
    images.push({
      url: '',
      alt: alias
    });
  }
  return {
    title: alias,
    description: `The user profile for ${alias}`,
  };
};

