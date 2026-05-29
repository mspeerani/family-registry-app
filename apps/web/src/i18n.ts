export type Locale = "en" | "ur" | "gu";

export const localeMeta: Record<Locale, { dir: "ltr" | "rtl"; label: string }> = {
  en: { dir: "ltr", label: "English" },
  gu: { dir: "ltr", label: "Gujarati" },
  ur: { dir: "rtl", label: "Urdu" }
};

export const translations = {
  en: {
    addPerson: "Add Person",
    appName: "Family Registry",
    birthDate: "Birth Date",
    birthPlace: "Birth Place",
    children: "Children",
    confidence: "Confidence",
    deathDate: "Death Date",
    export: "Export",
    fatherName: "Father's Name",
    filters: "Filters",
    fullName: "Full Name",
    graph: "Knowledge Graph",
    import: "Import",
    language: "Language",
    next5: "Next 5 Days",
    past5: "Past 5 Days",
    registry: "Registry",
    reminders: "Reminders",
    search: "Search",
    spouse: "Spouse",
    surname: "Surname",
    tree: "Family Tree"
  },
  ur: {
    addPerson: "فرد شامل کریں",
    appName: "خاندانی رجسٹری",
    birthDate: "تاریخ پیدائش",
    birthPlace: "جائے پیدائش",
    children: "اولاد",
    confidence: "اعتماد",
    deathDate: "تاریخ وفات",
    export: "برآمد",
    fatherName: "والد کا نام",
    filters: "فلٹرز",
    fullName: "پورا نام",
    graph: "علمی گراف",
    import: "درآمد",
    language: "زبان",
    next5: "اگلے 5 دن",
    past5: "گزشتہ 5 دن",
    registry: "رجسٹری",
    reminders: "یاد دہانیاں",
    search: "تلاش",
    spouse: "زوج/زوجہ",
    surname: "خاندانی نام",
    tree: "خاندانی شجرہ"
  },
  gu: {
    addPerson: "વ્યક્તિ ઉમેરો",
    appName: "કુટુંબ રજિસ્ટ્રી",
    birthDate: "જન્મ તારીખ",
    birthPlace: "જન્મ સ્થળ",
    children: "સંતાનો",
    confidence: "વિશ્વાસ",
    deathDate: "મૃત્યુ તારીખ",
    export: "નિકાસ",
    fatherName: "પિતાનું નામ",
    filters: "ફિલ્ટર્સ",
    fullName: "પૂરું નામ",
    graph: "જ્ઞાન ગ્રાફ",
    import: "આયાત",
    language: "ભાષા",
    next5: "આગલા 5 દિવસ",
    past5: "પાછલા 5 દિવસ",
    registry: "રજિસ્ટ્રી",
    reminders: "યાદ અપાવણીઓ",
    search: "શોધો",
    spouse: "પતિ/પત્ની",
    surname: "અટક",
    tree: "કુટુંબ વૃક્ષ"
  }
} satisfies Record<Locale, Record<string, string>>;

export function t(locale: Locale, key: keyof typeof translations.en): string {
  return translations[locale][key] ?? translations.en[key];
}

