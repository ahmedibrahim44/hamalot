import { describe, expect, it } from "vitest";
import { isCurrentPage } from "./pageNavigation";

describe("page navigation state", () => {
  it("marks only the current page as active", () => {
    expect(isCurrentPage("services", "services")).toBe(true);
    expect(isCurrentPage("services", "process")).toBe(false);
  });
});
