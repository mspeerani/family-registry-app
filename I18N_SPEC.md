# Internationalization Specification

## 1. Supported Languages

Required for MVP:

- English: `en`
- Urdu: `ur`
- Gujarati: `gu`

## 2. Text Direction

```json
{
  "en": "ltr",
  "ur": "rtl",
  "gu": "ltr"
}
```

When Urdu is selected:

- Apply `dir="rtl"` at the app root.
- Align form labels and table text appropriately.
- Keep numbers and dates readable.
- Do not reverse graph/tree data semantics; only the UI layout direction changes.

## 3. Translation Files

Use JSON translation files:

```text
src/locales/en.json
src/locales/ur.json
src/locales/gu.json
```

The app must not hardcode user-facing strings in components.

## 4. Required Translation Keys

```json
{
  "app.name": "Family Registry",
  "nav.registry": "Registry",
  "nav.tree": "Family Tree",
  "nav.graph": "Knowledge Graph",
  "nav.reminders": "Reminders",
  "nav.importExport": "Import / Export",
  "nav.settings": "Settings",

  "action.addPerson": "Add Person",
  "action.edit": "Edit",
  "action.save": "Save",
  "action.cancel": "Cancel",
  "action.delete": "Delete",
  "action.archive": "Archive",
  "action.search": "Search",
  "action.import": "Import",
  "action.export": "Export",
  "action.backup": "Backup",
  "action.restore": "Restore",

  "field.fullName": "Full Name",
  "field.fatherName": "Father's Name",
  "field.surname": "Surname",
  "field.nativeName": "Native Name",
  "field.gender": "Gender",
  "field.birthDateGregorian": "Date of Birth (Gregorian)",
  "field.birthDateHijri": "Date of Birth (Hijri)",
  "field.birthPlace": "Place of Birth",
  "field.birthNote": "Birth Note",
  "field.deathDateGregorian": "Date of Death (Gregorian)",
  "field.deathDateHijri": "Date of Death (Hijri)",
  "field.deathPlace": "Place of Death",
  "field.burialPlace": "Burial Place",
  "field.spouse": "Spouse",
  "field.children": "Children",
  "field.grandchildren": "Grandchildren",
  "field.notes": "Notes",
  "field.source": "Source",
  "field.confidence": "Confidence",

  "reminder.birthdaysNext7": "Birthdays in the next 7 days",
  "reminder.deathsNext7": "Death anniversaries in the next 7 days",
  "reminder.past5": "Past 5 days",
  "reminder.next5": "Next 5 days",

  "message.duplicatePossible": "Possible duplicate record found.",
  "message.missingDataAllowed": "Missing data can be added later.",
  "message.saved": "Saved successfully.",
  "message.error": "Something went wrong."
}
```

## 5. Starter Urdu Labels

These translations should be reviewed by a fluent speaker before production release.

```json
{
  "app.name": "خاندانی رجسٹری",
  "nav.registry": "رجسٹری",
  "nav.tree": "خاندانی شجرہ",
  "nav.graph": "علمی گراف",
  "nav.reminders": "یاد دہانیاں",
  "nav.importExport": "درآمد / برآمد",
  "nav.settings": "ترتیبات",
  "action.addPerson": "فرد شامل کریں",
  "action.save": "محفوظ کریں",
  "action.search": "تلاش",
  "field.fullName": "پورا نام",
  "field.fatherName": "والد کا نام",
  "field.surname": "خاندانی نام",
  "field.nativeName": "مقامی نام",
  "field.birthDateGregorian": "تاریخ پیدائش (عیسوی)",
  "field.birthDateHijri": "تاریخ پیدائش (ہجری)",
  "field.birthPlace": "جائے پیدائش",
  "field.deathDateGregorian": "تاریخ وفات (عیسوی)",
  "field.deathDateHijri": "تاریخ وفات (ہجری)",
  "field.burialPlace": "جائے تدفین",
  "field.spouse": "زوج/زوجہ",
  "field.children": "اولاد",
  "field.grandchildren": "پوتے/نواسے",
  "field.notes": "نوٹس"
}
```

## 6. Starter Gujarati Labels

These translations should be reviewed by a fluent speaker before production release.

```json
{
  "app.name": "કુટુંબ રજિસ્ટ્રી",
  "nav.registry": "રજિસ્ટ્રી",
  "nav.tree": "કુટુંબ વૃક્ષ",
  "nav.graph": "જ્ઞાન ગ્રાફ",
  "nav.reminders": "યાદ અપાવણીઓ",
  "nav.importExport": "આયાત / નિકાસ",
  "nav.settings": "સેટિંગ્સ",
  "action.addPerson": "વ્યક્તિ ઉમેરો",
  "action.save": "સાચવો",
  "action.search": "શોધો",
  "field.fullName": "પૂરું નામ",
  "field.fatherName": "પિતાનું નામ",
  "field.surname": "અટક",
  "field.nativeName": "સ્થાનિક નામ",
  "field.birthDateGregorian": "જન્મ તારીખ (ગ્રેગોરિયન)",
  "field.birthDateHijri": "જન્મ તારીખ (હિજરી)",
  "field.birthPlace": "જન્મ સ્થળ",
  "field.deathDateGregorian": "મૃત્યુ તારીખ (ગ્રેગોરિયન)",
  "field.deathDateHijri": "મૃત્યુ તારીખ (હિજરી)",
  "field.burialPlace": "દફન સ્થળ",
  "field.spouse": "પતિ/પત્ની",
  "field.children": "સંતાનો",
  "field.grandchildren": "પૌત્રો/દોહિત્રો",
  "field.notes": "નોંધો"
}
```

## 7. Data Language Policy

The database field names are English. User-entered person data can be English, Urdu, Gujarati, or mixed script.

Recommended person fields:

- `full_name`: primary name, usually English or preferred display text.
- `native_name`: optional local-script name.

