
'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-900/50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
           <Leaf className="h-6 w-6 text-primary" />
           <span className="text-lg font-semibold text-white">GreenRoots</span>
        </div>
        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} GreenRoots Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="#" className="text-white/60 hover:text-white">
            Terms of Service
          </Link>
          <Link href="#" className="text-white/60 hover:text-white">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
