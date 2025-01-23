/*
  Appellation: sidebar <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import * as Lucide from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
// project
import { sitemap, SiteLink } from '@/config/sitemap';
import { CheckoutButton } from '@/features/billing';
import { ProfileCard, useProfile } from '@/features/profiles';
// import { useUserProfile } from '@/hooks/use-profile';
import { cn } from '@/utils';
import { createBrowserClient } from '@/utils/supabase';
// components
import { Button } from '@/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible';
import { DialogTitle } from '@/ui/dialog';
import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';

const SidebarLink: React.FC<
  React.ComponentProps<typeof SidebarMenuItem> & SiteLink
> = ({ href, icon, name, ...props }) => {
  const { openMobile, toggleSidebar } = useSidebar();
  return (
    <SidebarMenuItem {...props}>
      <SidebarMenuButton asChild>
        <Link
          href={href}
          onClick={() => {
            // close the sidebar on mobile
            if (openMobile) toggleSidebar();
          }}
        >
          {icon}
          <span className="text-foreground">{name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const CustomSidebarTrigger: React.FC<
  React.ComponentProps<typeof Button> & {
    icon?: React.ReactNode;
    iconClose?: React.ReactNode;
  }
> = ({
  className,
  icon = <Lucide.SidebarIcon />,
  iconClose = <Lucide.SidebarCloseIcon />,
  onClick,
  size = 'icon',
  variant = 'ghost',
  ...props
}) => {
  const { open, openMobile, toggleSidebar } = useSidebar();

  const isOpen = open || openMobile;

  const TriggerIcon = () => {
    if (isOpen) return iconClose;
    return icon;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              'items-center justify-center min-w-8',
              'hover:bg-primary/80 hover:text-primary-foreground/90',
              className
            )}
            onClick={(event) => {
              onClick?.(event);
              toggleSidebar();
            }}
            size={size}
            variant={variant}
            {...props}
          >
            <TriggerIcon />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isOpen ? 'Close' : 'Open'} the sidebar</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
CustomSidebarTrigger.displayName = 'CustomSidebarTrigger';

export const DashboardSidebar: React.FC<
  React.ComponentProps<typeof Sidebar>
> = ({
  children,
  collapsible = 'icon',
  side = 'right',
  variant = 'inset',
  ...props
}) => {
  const supabase = createBrowserClient();
  const router = useRouter();
  // setup the sidebar context
  const { open, openMobile, state, toggleSidebar } = useSidebar();

  const { profile } = useProfile();
  // const { profile } = useUserProfile();

  const isOpen = open || openMobile || state === 'expanded';

  const isAuth = !!profile;

  const profileEndpoint = (...p: string[]) => {
    return `/${profile?.username}/${p.join('/')}`;
  };

  return (
    <Sidebar collapsible={collapsible} side={side} variant={variant} {...props}>
      <SidebarHeader>
        <Link
          href={{
            pathname: profileEndpoint(),
            query: {
              view: 'details',
            },
          }}
        >
          <ProfileCard isOpen={isOpen} />
        </Link>
        {openMobile && (
          <VisuallyHidden>
            <DialogTitle>Sidebar</DialogTitle>
          </VisuallyHidden>
        )}
      </SidebarHeader>
      {/* Sidebar Content */}
      <SidebarContent>
        {/* Navigation Group */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink
                {...sitemap.pages.dashboard}
                href={{
                  pathname: profileEndpoint(),
                  query: { view: 'dashboard' },
                }}
              />
              <SidebarLink
                {...sitemap.pages.shifts}
                href={{
                  pathname: profileEndpoint('shifts'),
                  query: { view: 'dashboard' },
                }}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        {/* Account Group */}
        {isAuth && (
          <SidebarGroup className="flex-shrink">
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarLink
                  {...sitemap.pages.notifications}
                  href={{
                    pathname: profileEndpoint('notifications'),
                    query: { view: 'inbox' },
                  }}
                />
                {/* Checkout */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <CheckoutButton variant="ghost" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {/* Help Group */}
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Help
                <Lucide.ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarLink {...sitemap.pages.support} />
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        {/* trailing menu */}
        <SidebarMenu>
          <SidebarLink
            {...sitemap.pages.settings}
            href={{
              pathname: profileEndpoint('settings'),
              query: { tab: 'profile' },
            }}
          />
        </SidebarMenu>
        {/* actions */}
        <Button
          className="items-center justify-center"
          variant="destructive"
          onClick={async () => {
            await supabase.auth.signOut();
            // close the sidebar on mobile
            if (openMobile) toggleSidebar();
            router.replace('/auth');
          }}
        >
          <Lucide.LogOutIcon />
          <span className="[[data-state=collapsed]_&]:sr-only transition-colors">
            Sign Out
          </span>
        </Button>
        {children}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
DashboardSidebar.displayName = 'DashboardSidebar';

export const InjectedDashboardSidebar: React.FC<
  React.ComponentProps<typeof Sidebar>
> = ({ ...props }) => {
  return <DashboardSidebar {...props} />;
};
InjectedDashboardSidebar.displayName = 'InjectedDashboardSidebar';

export default InjectedDashboardSidebar;
