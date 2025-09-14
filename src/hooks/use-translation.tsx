
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavStore } from './use-nav-store';

type Translations = { [key: string]: any };

interface TranslationContextType {
  translations: Translations;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useNavStore();
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`@/locales/${language}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Could not load translation file for language: ${language}`, error);
        // Fallback to English if the selected language file is not found
        const fallbackModule = await import(`@/locales/en.json`);
        setTranslations(fallbackModule.default);
      }
    };
    loadTranslations();
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // Return the key itself if not found
      }
    }
    return typeof result === 'string' ? result : key;
  };

  return (
    <TranslationContext.Provider value={{ translations, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
