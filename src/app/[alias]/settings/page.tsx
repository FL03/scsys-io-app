/*
  Appellation: page <settings>
  Contrib: @FL03
*/
import * as React from 'react';
// project
import { ConfigurationPanel } from '@/features/settings';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';

//
export default function Page() {

  return <ConfigurationPanel/>;
  
}
Page.displayName = 'SettingsPage';

export const generateMetadata: NextMetaGenerator<{ params: Promise<{ alias: string }>}> = async ({ params, }, parent) => {

  return {
    title: 'Settings',
    description: 'View and manage your settings.',
  };
}