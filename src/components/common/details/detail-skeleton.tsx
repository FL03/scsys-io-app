/*
  Appellation: details_scaffold <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/utils';
// components
import { Appbar, AppbarLeading } from '@/common/appbar';
import { BackButton } from '@/common/buttons';
import { DetailHeader } from './detail-header';

// DetailScaffold
export const DetailSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
      description?: React.ReactNode;
      title?: React.ReactNode;
    }
>(
  (
    { className, children,  description, title, ...props },
    ref
  ) => {
    const showHeader = title || description;
    return (
      <div
        ref={ref}
        className={cn('relative h-full w-full', className)}
        {...props}
      >
        <Appbar variant="inherit">
          <AppbarLeading>
            <BackButton />
          </AppbarLeading>
        </Appbar>
        <section className="h-full w-full flex flex-1 flex-col">
          {showHeader && (
            <DetailHeader title={title} description={description} />
          )}
          <div className="h-full w-full flex flex-1 flex-col gap-2">
            {children}
          </div>
        </section>
      </div>
    );
  }
);
DetailSkeleton.displayName = 'DetailSkeleton';

export default DetailSkeleton;
