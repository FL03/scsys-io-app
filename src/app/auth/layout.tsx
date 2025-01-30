/*
  Appellation: layout <module>
  Contrib: @FL03
*/
import { cn } from '@/utils';

export const runtime = 'edge';

export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <div
      className={cn(
        'min-h-svh w-full flex flex-1 flex-col items-center justify-center'
      )}
    >
      {children}
    </div>
  );
};
Layout.displayName = 'AuthLayout';