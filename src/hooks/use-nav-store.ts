
'use client';

import { useState, useEffect } from 'react';
import { navConfig } from '@/lib/nav-config';

const NAV_VISIBILITY_KEY = 'agriassist-nav-visibility';

// Helper function to get the default visibility state
const getDefaultVisibility = () => {
  const visibility: { [key: string]: boolean } = {};
  navConfig.forEach(item => {
    visibility[item.id] = true;
  });
  return visibility;
};

export function useNavStore() {
  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>(getDefaultVisibility());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedItem = window.localStorage.getItem(NAV_VISIBILITY_KEY);
      if (storedItem) {
        const storedVisibility = JSON.parse(storedItem);
        const initialVisibility: { [key: string]: boolean } = {};
        navConfig.forEach(item => {
          initialVisibility[item.id] = storedVisibility[item.id] ?? true;
        });
        setVisibility(initialVisibility);
      }
    } catch (error) {
      console.error('Error reading from localStorage', error);
    }
  }, []);

  const toggleVisibility = (id: string) => {
    const newVisibility = { ...visibility, [id]: !visibility[id] };
    setVisibility(newVisibility);
    try {
      window.localStorage.setItem(NAV_VISIBILITY_KEY, JSON.stringify(newVisibility));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  };
  
  const visibleNavItems = navConfig.filter(item => isMounted ? visibility[item.id] : true);

  return {
    allNavItems: navConfig,
    visibleNavItems,
    visibility,
    toggleVisibility,
  };
}
