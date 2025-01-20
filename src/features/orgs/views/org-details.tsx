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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';

/**
 * OrgDetails component
 */
export const OrgDetails: React.FC<React.ComponentProps<typeof Card>> = ({ className, ...props }) => {
  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader>
        <CardTitle>Org Details</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription></CardDescription>
      </CardContent>
    </Card>
  );
}
OrgDetails.displayName = 'OrgDetails';

export default OrgDetails;