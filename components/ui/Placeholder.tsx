import React from 'react';

export type AspectRatioType = '9:16' | '4:5' | '1:1';

interface PlaceholderProps {
  label: string;
  ratio?: AspectRatioType;
  className?: string;
}

export function Placeholder({ label, ratio = '9:16', className = '' }: PlaceholderProps) {
  const ratioClasses = {
    '9:16': 'aspect-[9/16]',
    '4:5': 'aspect-[4/5]',
    '1:1': 'aspect-square',
  };

  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-[var(--color-warmgrey)]/30 [background-image:var(--backgroundImage-grad-hai)] p-4 text-center ${ratioClasses[ratio]} ${className}`}
    >
      <div className="z-10 flex flex-col items-center gap-2">
        <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
          {label}
        </span>
        <span className="font-mono text-[0.625rem] text-[var(--color-warmgrey)]/70">
          [{ratio}]
        </span>
      </div>
    </div>
  );
}
