/*
  Appellation: dashbar <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
// project
import { useIsMobile } from '@/hooks/use-mobile';
// components
import { AppLogo, ThemeToggle } from '@/components/common';
import {
  Toolbar,
  ToolbarAction,
  ToolbarActionGroup,
  ToolbarContent,
  ToolbarLeading,
  ToolbarTrailing,
} from '@/common/toolbar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
import { sitemap } from '@/config';

import { ToolbarCombobox } from './commands';
import { CustomSidebarTrigger } from './sidebar';

type ToolbarProps = {
  title?: string;
};

/**
 * Dashboard Toolbar
 */
export const DashboardToolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ToolbarProps
>(({ children, className, onClick, title = 'Dashboard', ...props }, ref) => {
  
  const isMobile = useIsMobile();
  const DigitalClock = dynamic(async () => import('@/common/clock'), { ssr: false });

  return (
    <Toolbar
      ref={ref}
      className="bg-secondary text-secondary-foreground"
      variant={isMobile ? "bottom" : "bottomCenter"}
      {...props}
    >
      <ToolbarLeading>
        <CustomSidebarTrigger
          aria-label="Toggle Sidebar"/>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild >
              <Link href={sitemap.pages.dashboard.href}>
                <AppLogo />
                <span className="sr-only">{title}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ToolbarCombobox />
      </ToolbarLeading>
      <ToolbarContent />
      <ToolbarTrailing>
        <DigitalClock
          className="text-nowrap"
          options={{ hour: 'numeric', minute: 'numeric', hour12: true }}
        />
        <ToolbarActionGroup>
          <ToolbarAction>
            <ThemeToggle />
          </ToolbarAction>
          {children}
        </ToolbarActionGroup>
      </ToolbarTrailing>
    </Toolbar>
  );
});
DashboardToolbar.displayName = 'DashboardToolbar';

export default DashboardToolbar;
