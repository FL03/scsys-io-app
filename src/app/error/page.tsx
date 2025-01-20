/*
  Appellation: page <error>
  Contrib: @FL03
*/
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const runtime = 'edge';

const Page: React.FC = () => {
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

export default Page;
