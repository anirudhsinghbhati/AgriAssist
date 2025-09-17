import {
  Home,
  Package,
  Users,
  LineChart,
  Settings,
  BrainCircuit,
  CloudSun,
  MessageSquare,
  ClipboardList,
  BookOpen,
  IndianRupee,
  Calendar,
  Newspaper,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
  isLocked?: boolean; // Cannot be disabled
};

export const navConfig: NavItem[] = [
  { id: 'dashboard', href: '/dashboard', icon: Home, label: 'Dashboard', isLocked: true },
  { id: 'calendar', href: '/calendar', icon: Calendar, label: 'Calendar' },
  { id: 'ai-tools', href: '/ai-tools', icon: BrainCircuit, label: 'AI Tools' },
  { id: 'market-prices', href: '/market-prices', icon: LineChart, label: 'Market Prices' },
  { id: 'financial-tracker', href: '/financial-tracker', icon: IndianRupee, label: 'Financial Tracker' },
  { id: 'inventory', href: '/inventory', icon: Package, label: 'Inventory' },
  { id: 'weather', href: '/weather', icon: CloudSun, label: 'Weather Alerts' },
  { id: 'news-schemes', href: '/news-schemes', icon: Newspaper, label: 'News & Schemes' },
  { id: 'resource-hub', href: '/resource-hub', icon: BookOpen, label: 'Resource Hub' },
  { id: 'community', href: '/community', icon: Users, label: 'Community Forum' },
  { id: 'consultation', href: '/consultation', icon: MessageSquare, label: 'Expert Consultation' },
  { id: 'reports', href: '/reports', icon: ClipboardList, label: 'Reports' },
  { id: 'settings', href: '/settings', icon: Settings, label: 'Settings', isLocked: true },
];
