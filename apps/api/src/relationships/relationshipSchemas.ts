import { z } from "zod";

export const relationshipTypeSchema = z.enum([
  "father",
  "mother",
  "spouse",
  "child",
  "sibling",
  "guardian",
  "adoptive_parent",
  "adoptive_child",
  "other"
]);

export const relationshipConfidenceSchema = z
  .enum(["confirmed", "likely", "possible", "unknown"])
  .default("unknown");

const nullableText = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}, z.string().nullable());

export const createRelationshipSchema = z.object({
  confidence: relationshipConfidenceSchema.optional(),
  endDateGregorian: nullableText.optional(),
  notes: nullableText.optional(),
  personId: z.string().trim().min(1),
  relatedPersonId: z.string().trim().min(1),
  relationshipType: relationshipTypeSchema,
  startDateGregorian: nullableText.optional()
});

export type CreateRelationshipInput = z.infer<typeof createRelationshipSchema>;

