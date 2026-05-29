import { describe, expect, it } from "vitest";

import {
  applyDocumentLocale,
  getStoredLocale,
  localeMeta,
  localeStorageKey,
  persistLocale,
  t,
  translations,
  type Locale,
  type StorageLike
} from "./i18n";

describe("i18n scaffold", () => {
  it("keeps translation keys aligned across supported languages", () => {
    const baseKeys = Object.keys(translations.en).sort();
    const locales: Locale[] = ["en", "ur", "gu"];

    for (const locale of locales) {
      expect(Object.keys(translations[locale]).sort()).toEqual(baseKeys);
    }
  });

  it("sets Urdu as right-to-left and keeps English/Gujarati left-to-right", () => {
    expect(localeMeta.en.dir).toBe("ltr");
    expect(localeMeta.gu.dir).toBe("ltr");
    expect(localeMeta.ur.dir).toBe("rtl");
  });

  it("returns translated labels", () => {
    expect(t("en", "fatherName")).toBe("Father's Name");
    expect(t("ur", "fatherName")).toBe("\u0648\u0627\u0644\u062f \u06a9\u0627 \u0646\u0627\u0645");
    expect(t("gu", "fatherName")).toBe(
      "\u0aaa\u0abf\u0aa4\u0abe\u0aa8\u0ac1\u0a82 \u0aa8\u0abe\u0aae"
    );
  });

  it("does not contain common mojibake markers in Urdu or Gujarati translations", () => {
    const mojibakePattern = /[ÃÂØÙÚÛà]/;

    for (const locale of ["ur", "gu"] satisfies Locale[]) {
      for (const value of Object.values(translations[locale])) {
        expect(value).not.toMatch(mojibakePattern);
      }
    }
  });

  it("persists and restores supported locales", () => {
    const values = new Map<string, string>();
    const storage: StorageLike = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value)
    };

    persistLocale("ur", storage);

    expect(values.get(localeStorageKey)).toBe("ur");
    expect(getStoredLocale(storage)).toBe("ur");

    values.set(localeStorageKey, "fr");
    expect(getStoredLocale(storage)).toBe("en");
  });

  it("applies document language and direction for every locale", () => {
    const root = { dir: "", lang: "" };

    applyDocumentLocale("ur", root);
    expect(root).toEqual({ dir: "rtl", lang: "ur" });

    applyDocumentLocale("gu", root);
    expect(root).toEqual({ dir: "ltr", lang: "gu" });
  });
});
