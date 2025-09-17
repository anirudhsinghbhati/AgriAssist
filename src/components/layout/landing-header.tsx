
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-transparent py-4 animate-slide-in-from-top">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-white font-headline">GreenRoots</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="#features" className="text-white/80 hover:text-white transition-colors">
            Features
          </Link>
        </nav>
        <div className="flex items-center gap-2">
           <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
                <Link href="/login">Sign In</Link>
           </Button>
           <Button asChild>
                <Link href="/login">Get Started</Link>
           </Button>
        </div>
      </div>
    </header>
  );
}
