/*
  Appellation: page <[alias]>
  Contrib: @FL03
*/
'use server';
// imports
import dynamic from 'next/dynamic';
// project
import { PagePropsWithParams, NextMetaGenerator } from '@/types';

type PageProps = PagePropsWithParams<{ alias: string }>;

export default async function Page() {
  const Screen = dynamic(() => import('@/features/profiles').then((mod) => mod.ProfileScreen), { ssr: true });
  return Screen ? <Screen/> : null;
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

