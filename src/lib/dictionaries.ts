import "server-only";

import type en from "@/dictionaries/en.json";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  es: () => import("@/dictionaries/es.json").then((m) => m.default),
};

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

/** The English file is the source of truth for the shape; es.json must match it. */
export type Dictionary = typeof en;

export const isLocale = (value: string): value is Locale => value in dictionaries;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();

export const otherLocale = (locale: Locale): Locale => (locale === "en" ? "es" : "en");
