import { describe, expect, it } from "vitest";

import { localeMeta, t, translations, type Locale } from "./i18n";

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
    expect(t("ur", "fatherName")).toBe("والد کا نام");
    expect(t("gu", "fatherName")).toBe("પિતાનું નામ");
  });
});

