/*
  Appellation: layout <(dashboard)>
  Contrib: @FL03
*/
import * as React from 'react';

export default function Template({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <>
      {children}
    </>
  );
}
Template.displayName = 'AppTemplate';
