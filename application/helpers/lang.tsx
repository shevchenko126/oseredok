import React from 'react';
import en from '../locales/en.json';
import uk from '../locales/uk.json';

const dictionaries = {
  en,
  uk,
} as const;

type DictionaryKey = keyof typeof dictionaries;

// export const LANGUAGE_CODES = ['en', 'uk', 'de', 'it'] as const;
export const LANGUAGE_CODES = ['en', 'uk'] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export const DEFAULT_LANGUAGE: DictionaryKey = 'en';

const hasDictionary = (code: string): code is DictionaryKey =>
  Object.prototype.hasOwnProperty.call(dictionaries, code);

export const resolveLanguageCode = (code?: string | null): LanguageCode => {
  if (!code) return DEFAULT_LANGUAGE;
  const normalised = code.toLowerCase() as LanguageCode;
  return (LANGUAGE_CODES.includes(normalised) ? normalised : DEFAULT_LANGUAGE);
};

export const translate = (language: string, key: string): string => {
  const dictionary = hasDictionary(language)
    ? dictionaries[language]
    : dictionaries[DEFAULT_LANGUAGE];

  if (key in dictionary) {
    return dictionary[key as keyof typeof dictionary];
  }

  const fallbackDictionary = dictionaries[DEFAULT_LANGUAGE];
  return fallbackDictionary[key as keyof typeof fallbackDictionary] ?? key;
};

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: React.Dispatch<React.SetStateAction<LanguageCode>>;
}

export const LanguageContext = React.createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => undefined,
});

export const useTranslation = () => {
  const { language } = React.useContext(LanguageContext);
  return React.useCallback((key: string) => translate(language, key), [language]);
};

export const languageNameKeys: Record<LanguageCode, string> = {
  en: 'languageEnglish',
  uk: 'languageUkrainian',
  // de: 'languageGerman',
  // it: 'languageItalian',
};

export const availableLanguageCodes: LanguageCode[] = [...LANGUAGE_CODES];



let currentLanguage: LanguageCode = DEFAULT_LANGUAGE;

export const getCurrentLanguage = () => currentLanguage;

export const setCurrentLanguage = (lang: LanguageCode) => {
  currentLanguage = lang;
};
