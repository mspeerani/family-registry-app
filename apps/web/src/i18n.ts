export type Locale = "en" | "ur" | "gu";
export type TextDirection = "ltr" | "rtl";

export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export const localeStorageKey = "family-registry.locale";

export const localeMeta: Record<Locale, { dir: TextDirection; label: string }> = {
  en: { dir: "ltr", label: "English" },
  gu: { dir: "ltr", label: "Gujarati" },
  ur: { dir: "rtl", label: "Urdu" }
};

export const translations = {
  en: {
    addPerson: "Add Person",
    appName: "Family Registry",
    archive: "Archive",
    backup: "Backup",
    birthDate: "Birth Date",
    birthPlace: "Birth Place",
    biography: "Biography",
    cancel: "Cancel",
    children: "Children",
    confidence: "Confidence",
    confidenceApproximate: "Approximate",
    confidenceConfirmed: "Confirmed",
    confidenceLikely: "Likely",
    confidenceUnknown: "Unknown",
    deathDate: "Death Date",
    deathPlace: "Death Place",
    edit: "Edit",
    error: "Error",
    export: "Export",
    exportGraph: "Export Graph",
    fatherName: "Father's Name",
    filters: "Filters",
    fullName: "Full Name",
    grandchildren: "Grandchildren",
    graph: "Knowledge Graph",
    graphDepth: "Graph Depth",
    graphLimited: "Graph limited to keep it responsive.",
    import: "Import",
    language: "Language",
    loading: "Loading",
    login: "Login",
    loginRequired: "Login required to access family registry data.",
    logout: "Logout",
    missingBirthDate: "Missing Birth Date",
    missingFatherName: "Missing Father's Name",
    next5: "Next 5 Days",
    noRecords: "No records",
    parents: "Parents",
    past5: "Past 5 Days",
    password: "Password",
    profile: "Profile",
    registry: "Registry",
    relatedPerson: "Related Person",
    relationshipChild: "Child",
    relationshipFather: "Father",
    relationshipGuardian: "Guardian",
    relationshipMother: "Mother",
    relationshipOther: "Other",
    relationshipSibling: "Sibling",
    relationshipSpouse: "Spouse",
    relationshipType: "Relationship Type",
    relationships: "Relationships",
    reminders: "Reminders",
    save: "Save",
    search: "Search",
    spouse: "Spouse",
    surname: "Surname",
    tree: "Family Tree"
  },
  ur: {
    addPerson: "\u0641\u0631\u062f \u0634\u0627\u0645\u0644 \u06a9\u0631\u06cc\u06ba",
    appName: "\u062e\u0627\u0646\u062f\u0627\u0646\u06cc \u0631\u062c\u0633\u0679\u0631\u06cc",
    archive: "\u0645\u062d\u0641\u0648\u0638 \u062e\u0627\u0646\u06c1",
    backup: "\u0628\u06cc\u06a9 \u0627\u067e",
    birthDate: "\u062a\u0627\u0631\u06cc\u062e \u067e\u06cc\u062f\u0627\u0626\u0634",
    birthPlace: "\u062c\u0627\u0626\u06d2 \u067e\u06cc\u062f\u0627\u0626\u0634",
    biography: "\u0633\u0648\u0627\u0646\u062d",
    cancel: "\u0645\u0646\u0633\u0648\u062e",
    children: "\u0627\u0648\u0644\u0627\u062f",
    confidence: "\u0627\u0639\u062a\u0645\u0627\u062f",
    confidenceApproximate: "\u062a\u062e\u0645\u06cc\u0646\u06cc",
    confidenceConfirmed: "\u062a\u0635\u062f\u06cc\u0642 \u0634\u062f\u06c1",
    confidenceLikely: "\u0645\u0645\u06a9\u0646\u06c1",
    confidenceUnknown: "\u0646\u0627\u0645\u0639\u0644\u0648\u0645",
    deathDate: "\u062a\u0627\u0631\u06cc\u062e \u0648\u0641\u0627\u062a",
    deathPlace: "\u062c\u0627\u0626\u06d2 \u0648\u0641\u0627\u062a",
    edit: "\u062a\u0631\u0645\u06cc\u0645",
    error: "\u062e\u0631\u0627\u0628\u06cc",
    export: "\u0628\u0631\u0622\u0645\u062f",
    exportGraph: "\u06af\u0631\u0627\u0641 \u0628\u0631\u0622\u0645\u062f \u06a9\u0631\u06cc\u06ba",
    fatherName: "\u0648\u0627\u0644\u062f \u06a9\u0627 \u0646\u0627\u0645",
    filters: "\u0641\u0644\u0679\u0631\u0632",
    fullName: "\u067e\u0648\u0631\u0627 \u0646\u0627\u0645",
    grandchildren: "\u067e\u0648\u062a\u06d2/\u0646\u0648\u0627\u0633\u06d2",
    graph: "\u0639\u0644\u0645\u06cc \u06af\u0631\u0627\u0641",
    graphDepth: "\u06af\u06c1\u0631\u0627\u0626\u06cc",
    graphLimited: "\u06af\u0631\u0627\u0641 \u06a9\u0648 \u062a\u06cc\u0632 \u0631\u06a9\u06be\u0646\u06d2 \u06a9\u06d2 \u0644\u06cc\u06d2 \u0645\u062d\u062f\u0648\u062f \u06a9\u06cc\u0627 \u06af\u06cc\u0627 \u06c1\u06d2\u06d4",
    import: "\u062f\u0631\u0622\u0645\u062f",
    language: "\u0632\u0628\u0627\u0646",
    loading: "\u0644\u0648\u0688 \u06c1\u0648 \u0631\u06c1\u0627 \u06c1\u06d2",
    login: "\u0644\u0627\u06af \u0627\u0646",
    loginRequired: "\u062e\u0627\u0646\u062f\u0627\u0646\u06cc \u0631\u062c\u0633\u0679\u0631\u06cc \u0688\u06cc\u0679\u0627 \u062a\u06a9 \u0631\u0633\u0627\u0626\u06cc \u06a9\u06d2 \u0644\u06cc\u06d2 \u0644\u0627\u06af \u0627\u0646 \u06a9\u0631\u06cc\u06ba\u06d4",
    logout: "\u0644\u0627\u06af \u0622\u0624\u0679",
    missingBirthDate: "\u062a\u0627\u0631\u06cc\u062e \u067e\u06cc\u062f\u0627\u0626\u0634 \u0646\u0627\u0645\u0639\u0644\u0648\u0645",
    missingFatherName: "\u0648\u0627\u0644\u062f \u06a9\u0627 \u0646\u0627\u0645 \u0646\u0627\u0645\u0639\u0644\u0648\u0645",
    next5: "\u0627\u06af\u0644\u06d2 5 \u062f\u0646",
    noRecords: "\u06a9\u0648\u0626\u06cc \u0631\u06cc\u06a9\u0627\u0631\u0688 \u0646\u06c1\u06cc\u06ba",
    parents: "\u0648\u0627\u0644\u062f\u06cc\u0646",
    past5: "\u06af\u0632\u0634\u062a\u06c1 5 \u062f\u0646",
    password: "\u067e\u0627\u0633 \u0648\u0631\u0688",
    profile: "\u067e\u0631\u0648\u0641\u0627\u0626\u0644",
    registry: "\u0631\u062c\u0633\u0679\u0631\u06cc",
    relatedPerson: "\u0645\u062a\u0639\u0644\u0642\u06c1 \u0641\u0631\u062f",
    relationshipChild: "\u0627\u0648\u0644\u0627\u062f",
    relationshipFather: "\u0648\u0627\u0644\u062f",
    relationshipGuardian: "\u0633\u0631\u067e\u0631\u0633\u062a",
    relationshipMother: "\u0648\u0627\u0644\u062f\u06c1",
    relationshipOther: "\u062f\u06cc\u06af\u0631",
    relationshipSibling: "\u0628\u06be\u0627\u0626\u06cc/\u0628\u06c1\u0646",
    relationshipSpouse: "\u0632\u0648\u062c/\u0632\u0648\u062c\u06c1",
    relationshipType: "\u0631\u0634\u062a\u06d2 \u06a9\u06cc \u0642\u0633\u0645",
    relationships: "\u0631\u0634\u062a\u06d2",
    reminders: "\u06cc\u0627\u062f \u062f\u06c1\u0627\u0646\u06cc\u0627\u06ba",
    save: "\u0645\u062d\u0641\u0648\u0638 \u06a9\u0631\u06cc\u06ba",
    search: "\u062a\u0644\u0627\u0634",
    spouse: "\u0632\u0648\u062c/\u0632\u0648\u062c\u06c1",
    surname: "\u062e\u0627\u0646\u062f\u0627\u0646\u06cc \u0646\u0627\u0645",
    tree: "\u062e\u0627\u0646\u062f\u0627\u0646\u06cc \u0634\u062c\u0631\u06c1"
  },
  gu: {
    addPerson: "\u0ab5\u0acd\u0aaf\u0a95\u0acd\u0aa4\u0abf \u0a89\u0aae\u0ac7\u0ab0\u0acb",
    appName: "\u0a95\u0ac1\u0a9f\u0ac1\u0a82\u0aac \u0ab0\u0a9c\u0abf\u0ab8\u0acd\u0a9f\u0acd\u0ab0\u0ac0",
    archive: "\u0a86\u0ab0\u0acd\u0a95\u0abe\u0a87\u0ab5",
    backup: "\u0aac\u0ac7\u0a95\u0a85\u0aaa",
    birthDate: "\u0a9c\u0aa8\u0acd\u0aae \u0aa4\u0abe\u0ab0\u0ac0\u0a96",
    birthPlace: "\u0a9c\u0aa8\u0acd\u0aae \u0ab8\u0acd\u0aa5\u0ab3",
    biography: "\u0a9c\u0ac0\u0ab5\u0aa8 \u0aa8\u0acb\u0a82\u0aa7",
    cancel: "\u0ab0\u0aa6 \u0a95\u0ab0\u0acb",
    children: "\u0ab8\u0a82\u0aa4\u0abe\u0aa8\u0acb",
    confidence: "\u0ab5\u0abf\u0ab6\u0acd\u0ab5\u0abe\u0ab8",
    confidenceApproximate: "\u0a85\u0a82\u0aa6\u0abe\u0a9c\u0abf\u0aa4",
    confidenceConfirmed: "\u0aaa\u0ac1\u0ab7\u0acd\u0a9f\u0abf \u0aa5\u0aaf\u0ac7\u0ab2",
    confidenceLikely: "\u0ab8\u0a82\u0aad\u0ab5\u0abf\u0aa4",
    confidenceUnknown: "\u0a85\u0a9c\u0acd\u0a9e\u0abe\u0aa4",
    deathDate: "\u0aae\u0ac3\u0aa4\u0acd\u0aaf\u0ac1 \u0aa4\u0abe\u0ab0\u0ac0\u0a96",
    deathPlace: "\u0aae\u0ac3\u0aa4\u0acd\u0aaf\u0ac1 \u0ab8\u0acd\u0aa5\u0ab3",
    edit: "\u0ab8\u0a82\u0aaa\u0abe\u0aa6\u0abf\u0aa4 \u0a95\u0ab0\u0acb",
    error: "\u0aad\u0ac2\u0ab2",
    export: "\u0aa8\u0abf\u0a95\u0abe\u0ab8",
    exportGraph: "\u0a97\u0acd\u0ab0\u0abe\u0aab \u0aa8\u0abf\u0a95\u0abe\u0ab8 \u0a95\u0ab0\u0acb",
    fatherName: "\u0aaa\u0abf\u0aa4\u0abe\u0aa8\u0ac1\u0a82 \u0aa8\u0abe\u0aae",
    filters: "\u0aab\u0abf\u0ab2\u0acd\u0a9f\u0ab0\u0acd\u0ab8",
    fullName: "\u0aaa\u0ac2\u0ab0\u0ac1\u0a82 \u0aa8\u0abe\u0aae",
    grandchildren: "\u0aaa\u0acc\u0aa4\u0acd\u0ab0\u0acb/\u0aa6\u0acb\u0ab9\u0abf\u0aa4\u0acd\u0ab0\u0acb",
    graph: "\u0a9c\u0acd\u0a9e\u0abe\u0aa8 \u0a97\u0acd\u0ab0\u0abe\u0aab",
    graphDepth: "\u0a8a\u0a82\u0aa1\u0abe\u0a88",
    graphLimited: "\u0a9d\u0aa1\u0aaa \u0a9c\u0abe\u0ab3\u0ab5\u0ab5\u0abe \u0aae\u0abe\u0a9f\u0ac7 \u0a97\u0acd\u0ab0\u0abe\u0aab \u0aae\u0ab0\u0acd\u0aaf\u0abe\u0aa6\u0abf\u0aa4 \u0a95\u0ab0\u0abe\u0aaf\u0acb \u0a9b\u0ac7.",
    import: "\u0a86\u0aaf\u0abe\u0aa4",
    language: "\u0aad\u0abe\u0ab7\u0abe",
    loading: "\u0ab2\u0acb\u0aa1 \u0aa5\u0a88 \u0ab0\u0ab9\u0acd\u0aaf\u0ac1\u0a82 \u0a9b\u0ac7",
    login: "\u0ab2\u0acb\u0a97\u0abf\u0aa8",
    loginRequired: "\u0a95\u0ac1\u0a9f\u0ac1\u0a82\u0aac \u0ab0\u0a9c\u0abf\u0ab8\u0acd\u0a9f\u0acd\u0ab0\u0ac0 \u0aa1\u0ac7\u0a9f\u0abe \u0aae\u0abe\u0a9f\u0ac7 \u0ab2\u0acb\u0a97\u0abf\u0aa8 \u0a9c\u0ab0\u0ac2\u0ab0\u0ac0 \u0a9b\u0ac7.",
    logout: "\u0ab2\u0acb\u0a97\u0a86\u0a89\u0a9f",
    missingBirthDate: "\u0a9c\u0aa8\u0acd\u0aae \u0aa4\u0abe\u0ab0\u0ac0\u0a96 \u0a96\u0ac2\u0a9f\u0ac7 \u0a9b\u0ac7",
    missingFatherName: "\u0aaa\u0abf\u0aa4\u0abe\u0aa8\u0ac1\u0a82 \u0aa8\u0abe\u0aae \u0a96\u0ac2\u0a9f\u0ac7 \u0a9b\u0ac7",
    next5: "\u0a86\u0a97\u0ab2\u0abe 5 \u0aa6\u0abf\u0ab5\u0ab8",
    noRecords: "\u0a95\u0acb\u0a88 \u0ab0\u0ac7\u0a95\u0acb\u0ab0\u0acd\u0aa1 \u0aa8\u0aa5\u0ac0",
    parents: "\u0aae\u0abe\u0aa4\u0abe-\u0aaa\u0abf\u0aa4\u0abe",
    past5: "\u0aaa\u0abe\u0a9b\u0ab2\u0abe 5 \u0aa6\u0abf\u0ab5\u0ab8",
    password: "\u0aaa\u0abe\u0ab8\u0ab5\u0ab0\u0acd\u0aa1",
    profile: "\u0aaa\u0acd\u0ab0\u0acb\u0aab\u0abe\u0a87\u0ab2",
    registry: "\u0ab0\u0a9c\u0abf\u0ab8\u0acd\u0a9f\u0acd\u0ab0\u0ac0",
    relatedPerson: "\u0ab8\u0a82\u0aac\u0a82\u0aa7\u0abf\u0aa4 \u0ab5\u0acd\u0aaf\u0a95\u0acd\u0aa4\u0abf",
    relationshipChild: "\u0ab8\u0a82\u0aa4\u0abe\u0aa8",
    relationshipFather: "\u0aaa\u0abf\u0aa4\u0abe",
    relationshipGuardian: "\u0ab5\u0abe\u0ab2\u0ac0",
    relationshipMother: "\u0aae\u0abe\u0aa4\u0abe",
    relationshipOther: "\u0a85\u0aa8\u0acd\u0aaf",
    relationshipSibling: "\u0aad\u0abe\u0a88/\u0aac\u0ab9\u0ac7\u0aa8",
    relationshipSpouse: "\u0aaa\u0aa4\u0abf/\u0aaa\u0aa4\u0acd\u0aa8\u0ac0",
    relationshipType: "\u0ab8\u0a82\u0aac\u0a82\u0aa7 \u0aaa\u0acd\u0ab0\u0a95\u0abe\u0ab0",
    relationships: "\u0ab8\u0a82\u0aac\u0a82\u0aa7\u0acb",
    reminders: "\u0aaf\u0abe\u0aa6 \u0a85\u0aaa\u0abe\u0ab5\u0aa3\u0ac0\u0a93",
    save: "\u0ab8\u0abe\u0a9a\u0ab5\u0acb",
    search: "\u0ab6\u0acb\u0aa7\u0acb",
    spouse: "\u0aaa\u0aa4\u0abf/\u0aaa\u0aa4\u0acd\u0aa8\u0ac0",
    surname: "\u0a85\u0a9f\u0a95",
    tree: "\u0a95\u0ac1\u0a9f\u0ac1\u0a82\u0aac \u0ab5\u0ac3\u0a95\u0acd\u0ab7"
  }
} satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof typeof translations.en;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && value in localeMeta;
}

export function getStoredLocale(storage: StorageLike | undefined, fallback: Locale = "en"): Locale {
  try {
    const value = storage?.getItem(localeStorageKey);
    return isLocale(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function persistLocale(locale: Locale, storage: StorageLike | undefined): void {
  try {
    storage?.setItem(localeStorageKey, locale);
  } catch {
    // Storage can be unavailable in private browsing or locked-down environments.
  }
}

export function applyDocumentLocale(
  locale: Locale,
  root: { dir: TextDirection | string; lang: string }
): void {
  root.lang = locale;
  root.dir = localeMeta[locale].dir;
}

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] ?? translations.en[key];
}
