import { DatabaseSync } from "node:sqlite";

import { listPeople, type Person } from "../people/personRepository.js";
import type { AdvancedSearchInput } from "./searchSchemas.js";

export function advancedSearchPeople(
  database: DatabaseSync,
  input: AdvancedSearchInput
): Person[] {
  let people = listPeople(database, { query: input.query });

  if (input.missingBirthDate) {
    people = people.filter((person) => !person.birthDateGregorian);
  }

  if (input.missingFatherName) {
    people = people.filter((person) => !person.fatherName);
  }

  if (input.bornInPlace?.trim()) {
    const place = input.bornInPlace.trim().toLowerCase();
    people = people.filter((person) => person.birthPlace?.toLowerCase().includes(place));
  }

  return people;
}

