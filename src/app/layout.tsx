/*
  Appellation: layout <root>
  Contrib: FL03 <jo3mccain@icloud.com>
*/
// imports
import * as React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
// features
import { AuthProvider } from '@/features/auth';

import '@/public/styles/tailwind.css';

export default async function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  const cookieStore = await cookies();

  const prefferedTheme = cookieStore.get('theme')?.value || 'system';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative antialiased bg-background text-foreground min-h-svh">
        <ThemeProvider
          enableColorScheme
          enableSystem
          attribute="class"
          defaultTheme={prefferedTheme}
        >
          <AuthProvider className="flex flex-1 flex-col gap-2 lg:gap-4">{children}</AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
RootLayout.displayName = 'RootLayout';

// Metadata
export const metadata: Metadata = {
  applicationName: 'Proton',
  authors: [
    {
      name: 'Joe McCain III',
      url: 'https://github.com/FL03',
    },
    {
      name: 'Scattered-Systems, LLC',
      url: 'https://scsys.io',
    },
  ],
  classification: 'application',
  creator: 'Joe McCain III',
  description:
    'This platform facilitates the flow of information between employees, managers, and decision-makers.',
  icons: [
    {
      url: '/logo.svg',
      sizes: '16x16',
      type: 'image/x-svg',
    },
  ],
  title: { absolute: 'Proton', template: 'Proton | %s' },
  twitter: {
    card: 'summary',
    creator: '@jo3mccain',
    site: '@rms.scsys.io',
  },
};
