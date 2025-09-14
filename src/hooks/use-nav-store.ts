
'use client';

import * as React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { navConfig } from '@/lib/nav-config';

type Visibility = { [key: string]: boolean };

type NavVisibilityState = {
  visibility: Visibility;
  setVisibility: (newVisibility: Visibility) => void;
  getVisibleNavItems: () => typeof navConfig;
};

const getDefaultVisibility = (): Visibility => {
  const visibility: Visibility = {};
  navConfig.forEach(item => {
    visibility[item.id] = true;
  });
  return visibility;
};

export const useNavStore = create<NavVisibilityState>()(
  persist(
    (set, get) => ({
      visibility: getDefaultVisibility(),
      setVisibility: (newVisibility: Visibility) => {
        set({ visibility: newVisibility });
      },
      getVisibleNavItems: () => {
        const { visibility } = get();
        return navConfig.filter(item => visibility[item.id] ?? true);
      }
    }),
    {
      name: 'greenroots-nav-visibility', 
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
        }
      }
    }
  )
);

export const useVisibleNavItems = () => {
    const visibility = useNavStore((state) => state.visibility);
    const [visibleItems, setVisibleItems] = React.useState(() => navConfig.filter(item => visibility[item.id] ?? true));
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);
    
    React.useEffect(() => {
      if (isMounted) {
        setVisibleItems(navConfig.filter(item => visibility[item.id] ?? true));
      }
    }, [visibility, isMounted]);


    return isMounted ? visibleItems : navConfig;
};
