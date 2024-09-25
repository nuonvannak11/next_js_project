"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "../../public/locales/en/translation.json";
import khTranslation from "../../public/locales/kh/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    kh: {
      translation: khTranslation,
    },
  },
  lng: "kh",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
