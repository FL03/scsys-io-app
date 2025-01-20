/*
  Appellation: scaffold <dashboard>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { Toaster } from 'sonner';
// project
import { cn } from '@/utils';
// components
import { SidebarInset, SidebarProvider } from '@/ui/sidebar';
// features-specific
import { DashboardSidebar } from './sidebar';
import { DashboardToolbar } from './toolbar';

type ScaffoldProps = {
  title?: string;
};

export const DashboardScaffold = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ScaffoldProps
>(({ children, className, title, ...props }, ref) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardSidebar collapsible="icon" variant="inset" side="left" />
      <div
        ref={ref}
        className={cn(
          'w-full flex flex-1 bg-background text-foreground',

          className
        )}
        {...props}
      >
        <SidebarInset>
          <main
            className={cn('flex flex-col flex-1 gap-2 lg:gap-4', 'px-4 py-2')}
          >
            {children}
          </main>
          <Toaster />
          <DashboardToolbar title={title} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
});
DashboardScaffold.displayName = 'DashboardScaffold';

export default DashboardScaffold;
