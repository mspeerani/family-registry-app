import { z } from "zod";

export const advancedSearchSchema = z.object({
  bornInPlace: z.string().trim().optional(),
  missingBirthDate: z.boolean().optional(),
  missingFatherName: z.boolean().optional(),
  query: z.string().trim().optional()
});

export type AdvancedSearchInput = z.infer<typeof advancedSearchSchema>;

