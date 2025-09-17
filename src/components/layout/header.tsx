
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PanelLeft,
  Settings,
  Leaf,
  Moon,
  Sun,
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import React, { Fragment, useState } from 'react';
import { useTheme } from 'next-themes';
import { useVisibleNavItems, useNavStore } from '@/hooks/use-nav-store';
import { useTranslation } from '@/hooks/use-translation';
import { navConfig } from '@/lib/nav-config';

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const avatar = PlaceHolderImages.find((img) => img.id === 'avatar');
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const visibleNavItems = useVisibleNavItems();
  const { language, setLanguage } = useNavStore();


  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.reduce((acc, segment, index) => {
    if (segment === 'dashboard') return acc;
    if (segment === '(app)') return acc;

    let href = '';
    const navItem = navConfig.find(item => item.href.includes(segment));
    let label = navItem ? t(`nav.${navItem.id}`) : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

    const currentPath = `/${pathSegments.slice(0, index + 1).join('/')}`;

    // Special handling for nested routes that don't map 1:1 to navConfig
    if (pathname.startsWith('/my-crops/')) {
        if(segment === 'my-crops') label = t('nav.my_crops');
    } else if (pathname.startsWith('/settings/')) {
        if(segment === 'settings') label = t('nav.settings');
        if(segment === 'navigation') label = t('settings.customize_nav.title');
        if(segment === 'language') label = t('settings.language.title');
        if(segment === 'navigation-order') label = 'Navigation Order';
    }

    acc.push({ href: currentPath, label });
    return acc;
  }, [] as { href: string; label: string }[]);


  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">{t('header.toggle_menu')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Leaf className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">GreenRoots</span>
            </Link>
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-5 w-5" />
                {t(`nav.${item.id}`)}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">{t('nav.dashboard')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Search can go here if needed */}
      </div>
       <Button variant="outline" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t('header.toggle_theme')}</span>
        </Button>
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
          <DropdownMenuLabel>{t('header.dropdown.my_account')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">{t('header.dropdown.settings')}</Link>
          </DropdownMenuItem>
           <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>{t('header.dropdown.language')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setLanguage('en')}>{t('settings.language.english')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('hi')}>{t('settings.language.hindi')}</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>{t('header.dropdown.support')}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login">{t('header.dropdown.logout')}</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
