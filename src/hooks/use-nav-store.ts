'use client';

import { useState, useEffect } from 'react';
import { navConfig } from '@/lib/nav-config';

const NAV_VISIBILITY_KEY = 'agriassist-nav-visibility';

// Helper function to get initial state from localStorage
const getInitialVisibility = () => {
  if (typeof window === 'undefined') {
    // Return default visibility for server-side rendering
    const visibility: { [key: string]: boolean } = {};
    navConfig.forEach(item => {
      visibility[item.id] = true;
    });
    return visibility;
  }
  
  try {
    const storedItem = window.localStorage.getItem(NAV_VISIBILITY_KEY);
    if (storedItem) {
      const storedVisibility = JSON.parse(storedItem);
      // Ensure all nav items from config are present in the state
      const initialVisibility: { [key: string]: boolean } = {};
       navConfig.forEach(item => {
        initialVisibility[item.id] = storedVisibility[item.id] ?? true;
      });
      return initialVisibility;
    }
  } catch (error) {
    console.error('Error reading from localStorage', error);
  }

  // Default to all visible if nothing in storage
  const defaultVisibility: { [key: string]: boolean } = {};
  navConfig.forEach(item => {
    defaultVisibility[item.id] = true;
  });
  return defaultVisibility;
};


export function useNavStore() {
  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>(getInitialVisibility());

  // Use useEffect to ensure localStorage is only accessed on the client-side
  useEffect(() => {
    setVisibility(getInitialVisibility());
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

  const visibleNavItems = navConfig.filter(item => visibility[item.id]);

  return {
    allNavItems: navConfig,
    visibleNavItems,
    visibility,
    toggleVisibility,
  };
}
