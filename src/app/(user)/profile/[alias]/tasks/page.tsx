/*
  Appellation: page <module>
  Contrib: @FL03
*/
import * as React from 'react';
import dynamic from 'next/dynamic';
import { NextMetaGenerator, PagePropsWithParams } from '@/types';
import { TaskProvider } from '@/features/tasks';

type PageProps = PagePropsWithParams<{ alias: string }>;

export default async function Page({ params }: PageProps) {
  const { alias } = await params;
  const Dashboard = dynamic(async () => await import('@/features/tasks').then((mod) => mod.TaskDashboard), { ssr: true });

  return (
    <TaskProvider username={alias}>
      <Dashboard/>
    </TaskProvider>
  );
}
Page.displayName = 'Page';

export const generateMetadata: NextMetaGenerator<PageProps> = async ({ params, }, parent) => {

  return {
    title: 'Tasks',
    description: 'View and manage your tasks for the day.',
  };
}