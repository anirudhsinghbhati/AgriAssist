
'use client';

import * as React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { navConfig } from '@/lib/nav-config';

type NavVisibilityState = {
  visibility: { [key: string]: boolean };
  toggleVisibility: (id: string) => void;
  getVisibleNavItems: () => typeof navConfig;
};

const getDefaultVisibility = () => {
  const visibility: { [key: string]: boolean } = {};
  navConfig.forEach(item => {
    visibility[item.id] = true;
  });
  return visibility;
};

export const useNavStore = create<NavVisibilityState>()(
  persist(
    (set, get) => ({
      visibility: getDefaultVisibility(),
      toggleVisibility: (id: string) => {
        const item = navConfig.find(item => item.id === id);
        if (item?.isLocked) return; 
        set((state) => ({
          visibility: {
            ...state.visibility,
            [id]: !state.visibility[id],
          },
        }));
      },
      getVisibleNavItems: () => {
        const { visibility } = get();
        return navConfig.filter(item => visibility[item.id] ?? true);
      }
    }),
    {
      name: 'agriassist-nav-visibility', 
      storage: createJSONStorage(() => localStorage), 
      onRehydrateStorage: () => (state) => {
        if (state) {
            // Ensure all nav items from config are present in the persisted state
            const defaultVisibility = getDefaultVisibility();
            const mergedVisibility = { ...defaultVisibility, ...state.visibility };
            navConfig.forEach(item => {
                if (!(item.id in mergedVisibility)) {
                    mergedVisibility[item.id] = true;
                }
            });
            state.visibility = mergedVisibility;
        }
      }
    }
  )
);

export const useVisibleNavItems = () => {
    const getVisibleNavItems = useNavStore((state) => state.getVisibleNavItems);
    const [visibleItems, setVisibleItems] = React.useState(navConfig);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        if (isMounted) {
            const updateItems = () => setVisibleItems(getVisibleNavItems());
            updateItems(); 
            const unsubscribe = useNavStore.subscribe(
                (state) => state.visibility,
                updateItems
            );
            return () => unsubscribe();
        }
    }, [isMounted, getVisibleNavItems]);

    // On the server, or before the client has mounted, return the full default nav config
    // to ensure the server and client render the same initial HTML.
    return isMounted ? visibleItems : navConfig;
};
