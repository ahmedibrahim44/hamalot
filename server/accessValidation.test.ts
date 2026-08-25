import { describe, expect, it } from "vitest";
import { accessRequestSchema } from "./accessValidation";

describe("accessRequestSchema", () => {
  it("accepts a complete public access request", () => {
    const result = accessRequestSchema.safeParse({ name: "Marie", business: "Atelier Nord", email: "marie@example.com", message: "J’aimerais clarifier la présence de mon atelier.", locale: "FR" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email addresses and short messages", () => {
    const result = accessRequestSchema.safeParse({ name: "Marie", business: "Atelier Nord", email: "not-an-email", message: "Court", locale: "FR" });
    expect(result.success).toBe(false);
  });
});
