import { z } from "zod";

const nullableText = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}, z.string().nullable());

const optionalNullableText = nullableText.optional();

export const datePrecisionSchema = z
  .enum(["exact", "month", "year", "approximate", "unknown"])
  .default("unknown");

export const hijriSourceSchema = z.enum(["manual", "auto", "unknown"]).default("unknown");

export const confidenceSchema = z
  .enum(["confirmed", "likely", "approximate", "unknown"])
  .default("unknown");

export const genderSchema = z.enum(["male", "female", "other", "unknown"]).default("unknown");

export const createPersonSchema = z.object({
  biography: optionalNullableText,
  birthDateGregorian: optionalNullableText,
  birthDateGregorianPrecision: datePrecisionSchema.optional(),
  birthDateHijri: optionalNullableText,
  birthDateHijriPrecision: datePrecisionSchema.optional(),
  birthHijriSource: hijriSourceSchema.optional(),
  birthNote: optionalNullableText,
  birthPlace: optionalNullableText,
  burialPlace: optionalNullableText,
  dataConfidence: confidenceSchema.optional(),
  deathDateGregorian: optionalNullableText,
  deathDateGregorianPrecision: datePrecisionSchema.optional(),
  deathDateHijri: optionalNullableText,
  deathDateHijriPrecision: datePrecisionSchema.optional(),
  deathHijriSource: hijriSourceSchema.optional(),
  deathNote: optionalNullableText,
  deathPlace: optionalNullableText,
  fatherName: optionalNullableText,
  fullName: z.string().trim().min(1, "Full name is required."),
  gender: genderSchema.optional(),
  nativeName: optionalNullableText,
  sourceNote: optionalNullableText,
  surname: optionalNullableText
});

export const updatePersonSchema = createPersonSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required."
);

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;

