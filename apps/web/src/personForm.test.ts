import { describe, expect, it } from "vitest";

import { emptyPersonForm, toPersonPayload } from "./personForm";

describe("person form mapping", () => {
  it("keeps missing optional data as null", () => {
    const payload = toPersonPayload({
      ...emptyPersonForm,
      fullName: " Sample Person "
    });

    expect(payload).toMatchObject({
      birthDateGregorian: null,
      birthDateGregorianPrecision: "unknown",
      fatherName: null,
      fullName: "Sample Person"
    });
  });
});

