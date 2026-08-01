import { notFound } from 'next/navigation';
import React from 'react';

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <>{children}</>;
}
