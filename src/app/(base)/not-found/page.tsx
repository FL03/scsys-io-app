/*
  Appellation: not-found <page>
  Contrib: @FL03
*/
'use client';
// imports
import Link from 'next/link';

export default function Page() {
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
Page.displayName = 'NotFound';
