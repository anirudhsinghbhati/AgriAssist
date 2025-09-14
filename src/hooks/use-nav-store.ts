
'use client';

import * as React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { navConfig } from '@/lib/nav-config';

type Visibility = { [key: string]: boolean };
type Language = 'en' | 'hi';

type NavState = {
  visibility: Visibility;
  language: Language;
  setVisibility: (newVisibility: Visibility) => void;
  setLanguage: (newLanguage: Language) => void;
  getVisibleNavItems: () => typeof navConfig;
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
      setVisibility: (newVisibility: Visibility) => {
        set({ visibility: newVisibility });
      },
      setLanguage: (newLanguage: Language) => {
        set({ language: newLanguage });
      },
      getVisibleNavItems: () => {
        const { visibility } = get();
        return navConfig.filter(item => visibility[item.id] ?? true);
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
        }
      }
    }
  )
);

export const useVisibleNavItems = () => {
    const [isMounted, setIsMounted] = React.useState(false);
    const visibility = useNavStore((state) => state.visibility);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const visibleItems = React.useMemo(() => {
        return navConfig.filter(item => visibility[item.id] ?? true);
    }, [visibility]);

    if (!isMounted) {
        return navConfig.filter(item => getDefaultVisibility()[item.id] ?? true);
    }
    
    return visibleItems;
};
