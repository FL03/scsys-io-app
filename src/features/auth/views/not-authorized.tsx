/*
  Appellation: not_authorized <module>
  Contrib: @FL03
*/
import * as React from 'react';
import { cn } from '@/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';

type Props = {
  title?: string;
  description?: string;
}

export const NotAuthorized: React.FC<React.ComponentProps<'div'> & Props> = ({ className, description, title, ...props }) => {
  const showHeader = () => title || description;
  return (
    <div className={cn("flex flex-col flex-1 w-full", className)} {...props }>
      <Card className="m-auto">
        {showHeader() && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className="flex flex-col flex-1 items-center justify-center justify-items-center space-y-2 lg:space-y-4">
          <span>Not authorized to perform this actions.</span>
        </CardContent>
      </Card>
    </div>
  );
}