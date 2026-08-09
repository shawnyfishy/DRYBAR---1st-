'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#FCF9F2] p-6 text-[#262523] text-center font-sans antialiased">
        <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-[#8C867A]/20 bg-white p-8 shadow-sm">
          <span className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-[#8C867A]">
            SYSTEM ERROR
          </span>
          <h1 className="text-2xl font-normal leading-tight">
            Something went wrong.
          </h1>
          <p className="text-sm text-[#8C867A]">
            A critical rendering issue occurred. Click below to restore the application.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-full bg-[#FEDD30] px-8 py-3.5 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[#262523] cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
