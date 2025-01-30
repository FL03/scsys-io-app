/*
  Appellation: not-found <page>
  Contrib: @FL03
*/
import Link from 'next/link';

export const runtime = 'edge';

export default function NotFound() {
  return (
    <div>
      <div className="container mx-auto">
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">Return Home</Link>
      </div>
    </div>
  );
}
NotFound.displayName = 'NotFound';
