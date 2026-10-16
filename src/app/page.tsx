'use client';

import React from 'react';
import { Fraunces } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

export default function Home(): React.JSX.Element {
  return (
    <main
      className={`relative min-h-screen w-full overflow-hidden bg-[#FAFAFA] text-neutral-900 flex items-center justify-center selection:bg-amber-500/20 ${fraunces.variable}`}
    >
      {/* Main content container */}
      <div className="relative z-10 text-center px-6">
        <h1 className="font-(family-name:--font-fraunces) text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[1.1] drop-shadow-sm">
          Minzo Healthcare
        </h1>
      </div>
    </main>
  );
}