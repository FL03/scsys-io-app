/*
  Appellation: page <settings>
  Contrib: @FL03
*/
import * as React from 'react';
// project
import { SettingsTabs } from '@/features/settings';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';

type PageProps = PagePropsWithParams<{ alias: string }>;
//
export default async function Page({ searchParams }: PageProps) {
  const search = await searchParams;
  const tab = search?.tab as string ?? 'profile';

  return <SettingsTabs defaultTab={tab} />;
  
}
Page.displayName = 'SettingsPage';

export const generateMetadata: NextMetaGenerator<PageProps> = async ({ params, }, parent) => {

  return {
    title: 'Settings',
    description: 'View and manage your settings.',
  };
}