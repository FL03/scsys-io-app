/*
  Appellation: sidebar <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import * as Lucide from 'lucide-react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
// project
import { sitemap, SiteLink } from '@/config/sitemap';
import { SignOutButton } from '@/features/auth';
import { CheckoutButton } from '@/features/billing';
import { ProfileCard, useProfile } from '@/features/profiles';
import { cn } from '@/utils';
// components
import { Button } from '@/ui/button';
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent>Navigate to {name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
  className,
  collapsible = 'icon',
  side = 'right',
  variant = 'inset',
  ...props
}) => {
  // get the pathname
  const pathname = usePathname();
  // get the user profile
  const { profile } = useProfile();
  // setup the sidebar context
  const { open, openMobile, state, toggleSidebar } = useSidebar();
  // determine if the sidebar is open or not
  const isOpen = open || openMobile || state === 'expanded';

  const username = profile?.username;

  const isProfilePage = [`/${username}`].find(
    (i) => i === pathname
  );

  const showProfileHeader = !isProfilePage || isOpen;
  return (
    <Sidebar
      collapsible={collapsible}
      side={side}
      variant={variant}
      className={cn('h-full bg-secondary/90', className)}
      {...props}
    >
      <SidebarHeader className="bg-secondary/90">
        {showProfileHeader && (
          <Link
            href={{
              pathname: `/${username}`,
              query: {
                view: 'details',
              },
            }}
          >
            <ProfileCard isOpen={isOpen} />
          </Link>
        )}
        {openMobile && (
          <VisuallyHidden>
            <DialogTitle>Sidebar</DialogTitle>
          </VisuallyHidden>
        )}
      </SidebarHeader>
      {/* Sidebar Content */}
      <SidebarContent className="bg-secondary/90">
        {/* Navigation Group */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink
                {...sitemap.pages.shifts}
                icon={<Lucide.LayoutDashboard />}
                href={{
                  pathname: `/${username}/shifts`,
                  query: { view: 'dashboard' },
                }}
              />
              <SidebarLink
                {...sitemap.pages.shifts}
                href={{
                  pathname: `/${username}/shifts`,
                  query: { view: 'table' },
                }}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        {/* Account Group */}
        <SidebarGroup className="flex-shrink">
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Profile */}
              <SidebarLink
                {...sitemap.pages.profile}
                href={{
                  pathname: `/${username}`,
                  query: { view: 'details' },
                }}
              />
              {/* Notifications */}
              <SidebarLink
                {...sitemap.pages.notifications}
                href={{
                  pathname: `/${username}/notifications`,
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
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="bg-secondary/90">
        {/* trailing menu */}
        <SidebarMenu>
          <SidebarLink
            {...sitemap.pages.settings}
            href={{
              pathname: `/${username}/settings`,
              query: { tab: 'profile' },
            }}
          />
        </SidebarMenu>
        {/* actions */}
        <SignOutButton
          onClick={toggleSidebar}
          size={isOpen ? 'default' : 'sm'}
        />
        {children}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
DashboardSidebar.displayName = 'DashboardSidebar';
