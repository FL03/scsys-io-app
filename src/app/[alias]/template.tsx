/*
  Appellation: layout <(dashboard)>
  Contrib: @FL03
*/
import * as React from 'react';

export default function Template({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <div className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
Template.displayName = 'AppTemplate';
