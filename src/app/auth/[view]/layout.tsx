/*
  Appellation: layout <module>
  Contrib: @FL03
*/
'use client';

export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <div
      className="relative flex flex-col flex-1 items-center justify-items-center w-full min-h-svh"
    >
      {children}
    </div>
  );
};
Layout.displayName = 'AuthLayout';