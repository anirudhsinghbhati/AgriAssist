
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-transparent py-4">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary-foreground font-headline">GreenRoots</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="#features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            Features
          </Link>
        </nav>
        <div className="flex items-center gap-2">
           <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
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
