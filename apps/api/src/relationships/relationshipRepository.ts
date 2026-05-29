import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

import { getPerson, type Person } from "../people/personRepository.js";
import type { CreateRelationshipInput } from "./relationshipSchemas.js";

export type Relationship = {
  confidence: string;
  createdAt: string;
  endDateGregorian: string | null;
  id: string;
  notes: string | null;
  person: Pick<Person, "fatherName" | "fullName" | "id">;
  personId: string;
  relatedPerson: Pick<Person, "fatherName" | "fullName" | "id">;
  relatedPersonId: string;
  relationshipType: string;
  startDateGregorian: string | null;
  updatedAt: string;
};

export type FamilyProfile = {
  children: Person[];
  grandchildren: Person[];
  parents: Person[];
  person: Person;
  spouses: Person[];
};

export type FamilyGraphNode = {
  depth: number;
  fatherName: string | null;
  fullName: string;
  id: string;
};

export type FamilyGraphEdge = {
  id: string;
  relationshipType: string;
  source: string;
  target: string;
};

export type FamilyGraph = {
  edges: FamilyGraphEdge[];
  nodes: FamilyGraphNode[];
  rootId: string;
};

type RelationshipRow = {
  confidence: string;
  created_at: string;
  end_date_gregorian: string | null;
  id: string;
  notes: string | null;
  person_father_name: string | null;
  person_full_name: string;
  person_id: string;
  related_father_name: string | null;
  related_full_name: string;
  related_person_id: string;
  relationship_type: string;
  start_date_gregorian: string | null;
  updated_at: string;
};

export class RelationshipError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}

const relationshipSelect = `
  SELECT
    relationships.*,
    person.full_name AS person_full_name,
    person.father_name AS person_father_name,
    related.full_name AS related_full_name,
    related.father_name AS related_father_name
  FROM relationships
  INNER JOIN people AS person ON person.id = relationships.person_id
  INNER JOIN people AS related ON related.id = relationships.related_person_id
`;

function nowIso(): string {
  return new Date().toISOString();
}

function toRelationship(row: RelationshipRow): Relationship {
  return {
    confidence: row.confidence,
    createdAt: row.created_at,
    endDateGregorian: row.end_date_gregorian,
    id: row.id,
    notes: row.notes,
    person: {
      fatherName: row.person_father_name,
      fullName: row.person_full_name,
      id: row.person_id
    },
    personId: row.person_id,
    relatedPerson: {
      fatherName: row.related_father_name,
      fullName: row.related_full_name,
      id: row.related_person_id
    },
    relatedPersonId: row.related_person_id,
    relationshipType: row.relationship_type,
    startDateGregorian: row.start_date_gregorian,
    updatedAt: row.updated_at
  };
}

function personExists(database: DatabaseSync, id: string): boolean {
  const row = database.prepare("SELECT id FROM people WHERE id = ? AND is_archived = 0").get(id);
  return Boolean(row);
}

export function listRelationships(database: DatabaseSync, personId?: string): Relationship[] {
  const where = personId
    ? "WHERE relationships.person_id = ? OR relationships.related_person_id = ?"
    : "";
  const params = personId ? [personId, personId] : [];
  const rows = database
    .prepare(`${relationshipSelect} ${where} ORDER BY relationships.created_at DESC`)
    .all(...params) as RelationshipRow[];

  return rows.map(toRelationship);
}

export function createRelationship(
  database: DatabaseSync,
  input: CreateRelationshipInput
): Relationship {
  if (input.personId === input.relatedPersonId) {
    throw new RelationshipError("A person cannot be related to self.", "self_relationship", 400);
  }

  if (!personExists(database, input.personId) || !personExists(database, input.relatedPersonId)) {
    throw new RelationshipError("Both people must exist before linking them.", "person_missing", 404);
  }

  const duplicate = database
    .prepare(
      `
        SELECT id FROM relationships
        WHERE person_id = ? AND related_person_id = ? AND relationship_type = ?
      `
    )
    .get(input.personId, input.relatedPersonId, input.relationshipType);

  if (duplicate) {
    throw new RelationshipError("This relationship already exists.", "duplicate_relationship", 409);
  }

  const id = randomUUID();
  const timestamp = nowIso();

  database
    .prepare(
      `
        INSERT INTO relationships (
          id,
          person_id,
          related_person_id,
          relationship_type,
          start_date_gregorian,
          end_date_gregorian,
          confidence,
          notes,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      id,
      input.personId,
      input.relatedPersonId,
      input.relationshipType,
      input.startDateGregorian ?? null,
      input.endDateGregorian ?? null,
      input.confidence ?? "unknown",
      input.notes ?? null,
      timestamp,
      timestamp
    );

  const created = database
    .prepare(`${relationshipSelect} WHERE relationships.id = ?`)
    .get(id) as RelationshipRow | undefined;

  if (!created) {
    throw new Error("Relationship creation failed.");
  }

  return toRelationship(created);
}

export function deleteRelationship(database: DatabaseSync, id: string): boolean {
  const result = database.prepare("DELETE FROM relationships WHERE id = ?").run(id);
  return result.changes > 0;
}

function peopleFromRows(database: DatabaseSync, ids: string[]): Person[] {
  const people: Person[] = [];

  for (const id of ids) {
    const person = getPerson(database, id);
    if (person) {
      people.push(person);
    }
  }

  return people;
}

export function getFamilyProfile(database: DatabaseSync, personId: string): FamilyProfile | null {
  const person = getPerson(database, personId);

  if (!person) {
    return null;
  }

  const parentRows = database
    .prepare(
      `
        SELECT related_person_id AS id FROM relationships
        WHERE person_id = ? AND relationship_type IN ('father', 'mother', 'adoptive_parent', 'guardian')
        UNION
        SELECT person_id AS id FROM relationships
        WHERE related_person_id = ? AND relationship_type IN ('child', 'adoptive_child')
      `
    )
    .all(personId, personId) as { id: string }[];

  const spouseRows = database
    .prepare(
      `
        SELECT
          CASE
            WHEN person_id = ? THEN related_person_id
            ELSE person_id
          END AS id
        FROM relationships
        WHERE relationship_type = 'spouse'
          AND (person_id = ? OR related_person_id = ?)
      `
    )
    .all(personId, personId, personId) as { id: string }[];

  const childRows = database
    .prepare(
      `
        SELECT person_id AS id FROM relationships
        WHERE related_person_id = ? AND relationship_type IN ('father', 'mother', 'adoptive_parent', 'guardian')
        UNION
        SELECT related_person_id AS id FROM relationships
        WHERE person_id = ? AND relationship_type IN ('child', 'adoptive_child')
      `
    )
    .all(personId, personId) as { id: string }[];

  const children = peopleFromRows(
    database,
    Array.from(new Set(childRows.map((row) => row.id)))
  );

  const grandchildIds = new Set<string>();
  for (const child of children) {
    const rows = database
      .prepare(
        `
          SELECT person_id AS id FROM relationships
          WHERE related_person_id = ? AND relationship_type IN ('father', 'mother', 'adoptive_parent', 'guardian')
          UNION
          SELECT related_person_id AS id FROM relationships
          WHERE person_id = ? AND relationship_type IN ('child', 'adoptive_child')
        `
      )
      .all(child.id, child.id) as { id: string }[];
    rows.forEach((row) => grandchildIds.add(row.id));
  }

  return {
    children,
    grandchildren: peopleFromRows(database, Array.from(grandchildIds)),
    parents: peopleFromRows(
      database,
      Array.from(new Set(parentRows.map((row) => row.id)))
    ),
    person,
    spouses: peopleFromRows(
      database,
      Array.from(new Set(spouseRows.map((row) => row.id)))
    )
  };
}

export function getFamilyGraph(
  database: DatabaseSync,
  personId: string,
  maxDepth: number
): FamilyGraph | null {
  const root = getPerson(database, personId);

  if (!root) {
    return null;
  }

  const depthLimit = Math.max(0, Math.min(maxDepth, 4));
  const nodeDepths = new Map<string, number>([[personId, 0]]);
  const edges = new Map<string, FamilyGraphEdge>();
  const queue: Array<{ depth: number; id: string }> = [{ depth: 0, id: personId }];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current || current.depth >= depthLimit) {
      continue;
    }

    const relationships = listRelationships(database, current.id);

    for (const relationship of relationships) {
      const neighborId =
        relationship.personId === current.id ? relationship.relatedPersonId : relationship.personId;
      const neighbor = getPerson(database, neighborId);

      if (!neighbor) {
        continue;
      }

      edges.set(relationship.id, {
        id: relationship.id,
        relationshipType: relationship.relationshipType,
        source: relationship.personId,
        target: relationship.relatedPersonId
      });

      if (!nodeDepths.has(neighborId)) {
        const nextDepth = current.depth + 1;
        nodeDepths.set(neighborId, nextDepth);
        queue.push({ depth: nextDepth, id: neighborId });
      }
    }
  }

  const nodes: FamilyGraphNode[] = [];

  for (const [id, depth] of nodeDepths) {
    const person = getPerson(database, id);
    if (person) {
      nodes.push({
        depth,
        fatherName: person.fatherName,
        fullName: person.fullName,
        id: person.id
      });
    }
  }

  return {
    edges: Array.from(edges.values()),
    nodes: nodes.sort((a, b) => a.depth - b.depth || a.fullName.localeCompare(b.fullName)),
    rootId: personId
  };
}
