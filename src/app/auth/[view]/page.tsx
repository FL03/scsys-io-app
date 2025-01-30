/*
  Appellation: page <auth::<[view]>>
  Contrib: @FL03
*/
import * as React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { AuthGate, AuthView } from '@/features/auth';
import { PagePropsWithParams } from '@/types';

type PageParams = { view: AuthView };

export const runtime = 'edge';

export default async function Page({
  params,
}: PagePropsWithParams<PageParams>) {
  const { view } = await params;

  return <AuthGate view={view} />;
}
Page.displayName = 'AuthPage';

export const generateMetadata = async (
  { params }: PagePropsWithParams<PageParams>,
  _parent: ResolvingMetadata
): Promise<Metadata> => {
  // read route params
  const { view } = await params;


  if (view === 'register') {
    return {
      title: "Register",
    };
  }

  return {
    title: "Login",
  };
};
