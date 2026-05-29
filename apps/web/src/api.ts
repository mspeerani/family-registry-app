const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export type Person = {
  biography: string | null;
  birthDateGregorian: string | null;
  birthPlace: string | null;
  children?: number;
  dataConfidence: string;
  deathDateGregorian: string | null;
  deathPlace: string | null;
  fatherName: string | null;
  fullName: string;
  id: string;
  isArchived: boolean;
  surname: string | null;
};

export type PersonPayload = {
  biography?: string | null;
  birthDateGregorian?: string | null;
  birthDateGregorianPrecision?: string;
  birthPlace?: string | null;
  dataConfidence?: string;
  deathDateGregorian?: string | null;
  deathDateGregorianPrecision?: string;
  deathPlace?: string | null;
  fatherName?: string | null;
  fullName: string;
  surname?: string | null;
};

export type FamilyProfile = {
  children: Person[];
  grandchildren: Person[];
  parents: Person[];
  person: Person;
  spouses: Person[];
};

export type RelationshipPayload = {
  confidence?: string;
  notes?: string | null;
  personId: string;
  relatedPersonId: string;
  relationshipType: string;
};

export type AdvancedSearchPayload = {
  missingBirthDate?: boolean;
  missingFatherName?: boolean;
  query?: string;
};

export type ReminderEvent = {
  eventType: "birth" | "death";
  fatherName: string | null;
  gregorianDate: string;
  hijriDate: string | null;
  occurrenceDate: string;
  personId: string;
  personName: string;
};

export type ReminderWindow = {
  future: ReminderEvent[];
  past: ReminderEvent[];
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchPeople(query = ""): Promise<Person[]> {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("q", query.trim());
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  const result = await requestJson<{ people: Person[] }>(`/api/people${suffix}`);
  return result.people;
}

export async function advancedSearchPeople(payload: AdvancedSearchPayload): Promise<Person[]> {
  const result = await requestJson<{ people: Person[] }>("/api/search/advanced", {
    body: JSON.stringify(payload),
    method: "POST"
  });
  return result.people;
}

export async function createPerson(payload: PersonPayload): Promise<Person> {
  const result = await requestJson<{ person: Person }>("/api/people", {
    body: JSON.stringify(payload),
    method: "POST"
  });
  return result.person;
}

export async function updatePerson(id: string, payload: PersonPayload): Promise<Person> {
  const result = await requestJson<{ person: Person }>(`/api/people/${id}`, {
    body: JSON.stringify(payload),
    method: "PATCH"
  });
  return result.person;
}

export async function archivePerson(id: string): Promise<void> {
  await requestJson<{ archived: boolean }>(`/api/people/${id}`, {
    method: "DELETE"
  });
}

export async function fetchFamilyProfile(id: string): Promise<FamilyProfile> {
  const result = await requestJson<{ profile: FamilyProfile }>(`/api/people/${id}/profile`);
  return result.profile;
}

export async function createRelationship(payload: RelationshipPayload): Promise<void> {
  await requestJson<{ relationship: unknown }>("/api/relationships", {
    body: JSON.stringify(payload),
    method: "POST"
  });
}

export async function fetchReminderWindow(): Promise<ReminderWindow> {
  return requestJson<ReminderWindow>("/api/reminders/window?pastDays=5&futureDays=5");
}
