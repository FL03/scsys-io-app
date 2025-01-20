/*
  Appellation: page <[alias]>
  Contrib: @FL03
*/
import * as React from 'react';
import { ProfileDetails, profileTable } from '@/features/profiles';
import { NextMetaGenerator } from '@/types';

type PageProps = import('@/types').PagePropsWithParams<{ alias: string }>;

export default function Page() {
  return <ProfileDetails />;
}
Page.displayName = 'ProfilePage';

export const generateMetadata: NextMetaGenerator<PageProps> = async (
  { params },
  parent
) => {
  const { alias } = await params;

  const data = await profileTable.fetchByUsername(alias);
  // optionally access and extend (rather than replace) parent metadata
  const images = (await parent).openGraph?.images || [];

  if (data?.avatar_url) {
    images.push({
      url: data?.avatar_url,
      alt: data?.username,
    });
  }
  return {
    title: alias,
    description: `The profile details for ${alias}`,
  };
};
