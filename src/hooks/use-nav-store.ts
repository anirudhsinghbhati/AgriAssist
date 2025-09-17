
'use client';

import * as React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { navConfig } from '@/lib/nav-config';
import type { NavItem } from '@/lib/nav-config';

type Visibility = { [key: string]: boolean };
type Language = 'en' | 'hi';

// Create a default order based on the initial navConfig
const defaultOrder = navConfig.map(item => item.id);

type NavState = {
  visibility: Visibility;
  language: Language;
  navOrder: string[];
  setVisibility: (newVisibility: Visibility) => void;
  setLanguage: (newLanguage: Language) => void;
  setNavOrder: (newOrder: string[]) => void;
  getVisibleNavItems: () => NavItem[];
};

const getDefaultVisibility = (): Visibility => {
  const visibility: Visibility = {};
  navConfig.forEach(item => {
    visibility[item.id] = true;
  });
  return visibility;
};

export const useNavStore = create<NavState>()(
  persist(
    (set, get) => ({
      visibility: getDefaultVisibility(),
      language: 'en',
      navOrder: defaultOrder,
      setVisibility: (newVisibility: Visibility) => {
        set({ visibility: newVisibility });
      },
      setLanguage: (newLanguage: Language) => {
        set({ language: newLanguage });
      },
      setNavOrder: (newOrder: string[]) => {
        set({ navOrder: newOrder });
      },
      getVisibleNavItems: () => {
        const { visibility, navOrder } = get();
        
        // Ensure all items from navConfig are present in navOrder, even if new ones were added
        const currentOrder = [...navOrder];
        const orderedIds = new Set(currentOrder);
        navConfig.forEach(item => {
            if (!orderedIds.has(item.id)) {
                currentOrder.push(item.id);
            }
        });

        const itemMap = new Map(navConfig.map(item => [item.id, item]));

        return currentOrder
            .map(id => itemMap.get(id))
            .filter((item): item is NavItem => !!item && (visibility[item.id] ?? true));
      }
    }),
    {
      name: 'greenroots-nav-preferences',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
            const defaultVisibility = getDefaultVisibility();
            const mergedVisibility = { ...defaultVisibility, ...state.visibility };
            navConfig.forEach(item => {
                if (!(item.id in mergedVisibility)) {
                    mergedVisibility[item.id] = true;
                }
            });
            state.visibility = mergedVisibility;

            // Ensure order is up-to-date with navConfig
            const rehydratedOrder = state.navOrder || [];
            const allIds = new Set(rehydratedOrder);
            const newOrder = [...rehydratedOrder];
            defaultOrder.forEach(id => {
                if (!allIds.has(id)) {
                    newOrder.push(id);
                }
            });
            state.navOrder = newOrder.filter(id => navConfig.some(item => item.id === id));
        }
      }
    }
  )
);

export const useVisibleNavItems = () => {
    const [isMounted, setIsMounted] = React.useState(false);
    const { visibility, navOrder } = useNavStore(state => ({
        visibility: state.visibility,
        navOrder: state.navOrder
    }));

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const visibleItems = React.useMemo(() => {
        const itemMap = new Map(navConfig.map(item => [item.id, item]));
        return navOrder
            .map(id => itemMap.get(id))
            .filter((item): item is NavItem => !!item && (visibility[item.id] ?? true));
    }, [visibility, navOrder]);

    if (!isMounted) {
        // Return default state for SSR
        const itemMap = new Map(navConfig.map(item => [item.id, item]));
        return defaultOrder
            .map(id => itemMap.get(id))
            .filter((item): item is NavItem => !!item && (getDefaultVisibility()[item.id] ?? true));
    }
    
    return visibleItems;
};
