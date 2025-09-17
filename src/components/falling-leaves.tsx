
'use client';

import { Leaf } from 'lucide-react';
import React from 'react';

// Using a simple seedable random number generator for consistency
const mulberry32 = (a: number) => {
  return () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export const FallingLeaves = () => {
  const leaves = React.useMemo(() => {
    const random = mulberry32(12345); // Seed for consistent "randomness"
    return Array.from({ length: 15 }).map((_, i) => {
      const style = {
        left: `${random() * 100}%`,
        animationDuration: `${5 + random() * 5}s`,
        animationDelay: `${random() * 5}s`,
        opacity: 0.5 + random() * 0.5,
        transform: `scale(${0.6 + random() * 0.4})`,
      };
      return <Leaf key={i} className="leaf text-primary/70" style={style} />;
    });
  }, []);

  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{leaves}</div>;
};
