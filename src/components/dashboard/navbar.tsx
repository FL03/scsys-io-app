/*
  Appellation: navbar <module>
  Contrib: @FL03
*/
'use client';
import * as React from 'react';
import { Appbar, AppbarContent, AppbarLeading, AppbarTitle } from '@/common/appbar';
import { AppLogo } from '@/common/icons';

export const DashboardNavbar: React.FC<React.PropsWithChildren & { title?: string; }> = ({
  children,
  title = 'pzzld',
}) => {
  return (
    <Appbar>
      <AppbarLeading>
        <AppLogo />
        <AppbarTitle>{title}</AppbarTitle>
      </AppbarLeading>
      <AppbarContent className="collapse lg:visible transition-colors">
        {children}
      </AppbarContent>
    </Appbar>
  );
};
DashboardNavbar.displayName = 'DashboardNavbar';

export default DashboardNavbar;