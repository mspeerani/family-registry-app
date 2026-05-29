import type { Person, PersonPayload } from "./api";

export type PersonForm = {
  biography: string;
  birthDateGregorian: string;
  birthPlace: string;
  dataConfidence: string;
  deathDateGregorian: string;
  deathPlace: string;
  fatherName: string;
  fullName: string;
  id: string | null;
  surname: string;
};

export const emptyPersonForm: PersonForm = {
  biography: "",
  birthDateGregorian: "",
  birthPlace: "",
  dataConfidence: "unknown",
  deathDateGregorian: "",
  deathPlace: "",
  fatherName: "",
  fullName: "",
  id: null,
  surname: ""
};

function cleanOptional(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function formFromPerson(person: Person): PersonForm {
  return {
    biography: person.biography ?? "",
    birthDateGregorian: person.birthDateGregorian ?? "",
    birthPlace: person.birthPlace ?? "",
    dataConfidence: person.dataConfidence,
    deathDateGregorian: person.deathDateGregorian ?? "",
    deathPlace: person.deathPlace ?? "",
    fatherName: person.fatherName ?? "",
    fullName: person.fullName,
    id: person.id,
    surname: person.surname ?? ""
  };
}

export function toPersonPayload(form: PersonForm): PersonPayload {
  return {
    biography: cleanOptional(form.biography),
    birthDateGregorian: cleanOptional(form.birthDateGregorian),
    birthDateGregorianPrecision: cleanOptional(form.birthDateGregorian) ? "exact" : "unknown",
    birthPlace: cleanOptional(form.birthPlace),
    dataConfidence: form.dataConfidence,
    deathDateGregorian: cleanOptional(form.deathDateGregorian),
    deathDateGregorianPrecision: cleanOptional(form.deathDateGregorian) ? "exact" : "unknown",
    deathPlace: cleanOptional(form.deathPlace),
    fatherName: cleanOptional(form.fatherName),
    fullName: form.fullName.trim(),
    surname: cleanOptional(form.surname)
  };
}

