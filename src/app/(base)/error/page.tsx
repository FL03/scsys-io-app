/*
  Appellation: error <page>
  Contrib: @FL03
*/
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';


export default function Page() {
  return (
    <div className="flex flex-col w-full items-center justify-center justify-items-center min-h-svh">
      <Card className="m-auto">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Something went wrong...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Sorry, we couldn&apos;t find the page you were looking for.</p>
        </CardContent>
      </Card>
    </div>
  );
};
Page.displayName = 'ErrorPage';
