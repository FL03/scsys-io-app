/*
  Appellation: page <[alias]>
  Contrib: @FL03
*/
import { getProfile, ProfileScreen } from '@/features/profiles';
import { PagePropsWithParams, NextMetaGenerator } from '@/types';

type PageProps = PagePropsWithParams<{ alias: string }>;

export default function Page() {
  return <ProfileScreen />;
}
Page.displayName = 'ProfilePage';

export const generateMetadata: NextMetaGenerator<PageProps> = async (
  props,
  parent
) => {
  const { alias } = await props?.params;

  const profile = await getProfile(alias);

  // optionally access and extend (rather than replace) parent metadata
  const images = (await parent)?.openGraph?.images || [];

  if (profile?.avatar_url) {
    images.push({
      url: profile?.avatar_url,
      alt: alias
    });
  }
  return {
    title: alias,
    description: `The user profile for ${alias}`,
    openGraph: {
      images
    }
  };
};

