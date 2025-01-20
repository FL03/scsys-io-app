/*
  Appellation: org-details <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/utils';
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';

type DashboardProps = {
  description?: React.ReactNode;
  title?: React.ReactNode;
} & React.ComponentProps<typeof Card>;

/**
 * OrgDetails component
 */
export const OrgDashboard: React.FC<DashboardProps> = ({
  className,
  description,
  title = 'Organizations',
  ...props
}) => {
  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  );
};
OrgDashboard.displayName = 'OrgDashboard';

export default OrgDashboard;
