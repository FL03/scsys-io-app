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

import '@/assets/styles/globals.css';

export default async function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  const cookieStore = await cookies();

  const prefferedTheme = cookieStore.get('theme')?.value || 'system';

  return (
    <html lang="en" suppressHydrationWarning data-theme={prefferedTheme}>
      <body className="relative antialiased bg-background text-foreground min-h-svh">
        <ThemeProvider
          enableColorScheme
          enableSystem
          attribute="class"
          defaultTheme={prefferedTheme}
        >
          {children}
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
  category: 'Business',
  classification: 'application',
  creator: 'FL03',
  description:
    'This platform enables users to manage their schedules, tips, and more.',
  icons: [
    {
      url: '/alt.svg',
      sizes: '16x16',
      type: 'image/x-svg',
    },
  ],
  keywords: ['scheduling', 'tips', 'shifts', 'management', 'platform'],
  publisher: 'Scattered-Systems',
  title: { absolute: 'Proton', template: 'Proton | %s' },
  twitter: {
    card: 'summary',
    creator: '@jo3mccain',
    site: '@app.scsys.io',
  },
};
