/*
  Appellation: page <module>
  Contrib: @FL03
*/

import * as React from 'react';
import dynamic from 'next/dynamic';


// type PageProps = import("@/types").PagePropsWithParams<{ id: string }>;

export default function Page() {
  const TaskDetails = dynamic(async () => await import('@/features/tasks').then((mod) => mod.InjectedTaskDetails), { ssr: true });

  return TaskDetails ? <TaskDetails/> : null;
}
Page.displayName = 'Page';

