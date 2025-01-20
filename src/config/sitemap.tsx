/*
  Appellation: sitemap <lib>
  Contrib: @FL03
*/
import * as Lucide from 'lucide-react';
import * as React from 'react';
import { UrlObject } from 'url';

type Url = string | UrlObject;

const endpoint = (base: Url , ...path: string[]) => {
  let basepath = base.toString();
  if (!path) {
    return basepath;
  }
  if (!Array.isArray(path)) {
    path = [path];
  }
  return `${basepath}/${path.join('/')}`;
};

export type SiteLink = {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  name: string;
  href: Url;
  views?: string[];
};

abstract class SiteRoute implements SiteLink {
  icon?: React.ReactNode;
  name: string = '';
  href: Url = '/';
  views?: string[] = [];

  pages: SiteLink[] = [];

  constructor({ href, icon, name, ...entry }: SiteLink) {
    this.href = href;
    this.icon = icon;
    this.name = name;
    this.views = entry.views || [];
  }

  route(...path: string[]): string {
    return endpoint(this.href, ...path);
  }
}

class SitePoint extends SiteRoute {
  constructor(entry: SiteLink) {
    super(entry);
  }
}

const authRouter = new SitePoint({
  href: '/auth',
  name: 'Auth',
  views: ['login', 'forgot-password', 'reset-password', 'sign-up'],
});

const profileRouter = new SitePoint({
  href: '/profile',
  icon: <Lucide.UserRoundIcon />,
  label: 'Profile',
  name: 'Profile',
});

const notificationsRouter = new SitePoint({
  href: '/notifications',
  icon: <Lucide.BellDotIcon />,
  label: 'Notifications',
  name: 'Notifications',
});

const orgRouter = new SitePoint({
  href: '/org',
  icon: <Lucide.UsersIcon />,
  label: 'Organization',
  name: 'Organization',
});

const settingsRouter = new SitePoint({
  href: '/settings',
  icon: <Lucide.SettingsIcon />,
  label: 'Settings',
  name: 'Settings',
});

const shiftsRouter = new SitePoint({
  href: '/shifts',
  icon: <Lucide.CalendarIcon />,
  label: 'Shifts',
  name: 'Shifts',
});

const tasksRouter = new SitePoint({
  href: '/tasks',
  icon: <Lucide.CheckCircleIcon />,
  label: 'Tasks',
  name: 'Tasks',
});

const supportRouter = new SitePoint({
  href: '/support',
  icon: <Lucide.LucideMessageCircleQuestion />,
  label: 'Support',
  name: 'Support',
});

const dashboardRouter = new SitePoint({
  href: '/',
  icon: <Lucide.LayoutDashboardIcon />,
  label: 'Dashboard',
  name: 'Dashboard',
});

export const pages = {
  auth: authRouter,
  dashboard: dashboardRouter,
  notifications: notificationsRouter,
  orgs: orgRouter,
  profile: profileRouter,
  settings: settingsRouter,
  shifts: shiftsRouter,
  support: supportRouter,
  tasks: tasksRouter,
};

export const sitemap = {
  pages,
};

export default sitemap;
