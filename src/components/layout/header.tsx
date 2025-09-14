'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LineChart,
  Package,
  PanelLeft,
  Settings,
  ShoppingCart,
  Users,
  Sprout,
  Bug,
  CloudSun,
  Leaf,
  MessageSquare,
  ClipboardList,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Fragment } from 'react';

const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/crop-recommendations', icon: Sprout, label: 'Crop Advisory' },
    { href: '/pest-detection', icon: Bug, label: 'Pest Detection' },
    { href: '/market-prices', icon: LineChart, label: 'Market Prices' },
    { href: '/weather', icon: CloudSun, label: 'Weather Alerts' },
    { href: '/community', icon: Users, label: 'Community Forum' },
    { href: '/consultation', icon: MessageSquare, label: 'Expert Consultation' },
    { href: '/reports', icon: ClipboardList, label: 'Reports' },
    { href: '#', icon: Settings, label: 'Settings' },
];

export function Header() {
  const pathname = usePathname();
  const avatar = PlaceHolderImages.find((img) => img.id === 'avatar');

  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbSegments = pathSegments.filter(segment => segment !== 'dashboard');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Leaf className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">AgriAssist</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbSegments.slice(0, breadcrumbSegments.length -1).map((segment, index) => (
             <Fragment key={segment}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={`/${breadcrumbSegments.slice(0, index + 1).join('/')}`}>
                            {segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')}
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
             </Fragment>
          ))}
            {breadcrumbSegments.length > 0 && (
                <Fragment>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            {breadcrumbSegments[breadcrumbSegments.length - 1].charAt(0).toUpperCase() + breadcrumbSegments[breadcrumbSegments.length - 1].slice(1).replace(/-/g, ' ')}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </Fragment>
            )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Search can go here if needed */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            {avatar && (
              <Image
                src={avatar.imageUrl}
                width={36}
                height={36}
                alt="Avatar"
                data-ai-hint={avatar.imageHint}
                className="overflow-hidden rounded-full"
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/login">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
