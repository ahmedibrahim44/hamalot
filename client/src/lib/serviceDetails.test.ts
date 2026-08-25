import { describe, expect, it } from "vitest";
import { getServiceDetails } from "./serviceDetails";

describe("service card details", () => {
  it("returns localized details for each service card", () => {
    expect(getServiceDetails("FR", 1)).toEqual(["Offre", "Visuel", "Page ou campagne"]);
    expect(getServiceDetails("EN", 3)).toContain("Next step");
  });

  it("returns no details for an unknown card", () => {
    expect(getServiceDetails("FR", 99)).toEqual([]);
  });
});
