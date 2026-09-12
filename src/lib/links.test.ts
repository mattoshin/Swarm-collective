import { describe, expect, it } from "vitest";
import { normalizeHttpUrl, normalizeInstagram } from "./links";

describe("normalizeHttpUrl", () => {
  it("returns null for empty input", () => {
    expect(normalizeHttpUrl("")).toBeNull();
    expect(normalizeHttpUrl("   ")).toBeNull();
    expect(normalizeHttpUrl(null)).toBeNull();
  });

  it("adds https to bare domains", () => {
    expect(normalizeHttpUrl("linkedin.com/in/jane")).toBe("https://linkedin.com/in/jane");
  });

  it("keeps full http(s) links", () => {
    expect(normalizeHttpUrl("https://jane.dev")).toBe("https://jane.dev/");
    expect(normalizeHttpUrl("http://jane.dev/work")).toBe("http://jane.dev/work");
  });

  it("rejects script and data schemes", () => {
    expect(normalizeHttpUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeHttpUrl("data:text/html,<b>x</b>")).toBeNull();
  });

  it("rejects text that is not a link", () => {
    expect(normalizeHttpUrl("not a url")).toBeNull();
  });
});

describe("normalizeInstagram", () => {
  it("turns a handle into a profile link", () => {
    expect(normalizeInstagram("@jane.doe")).toBe("https://instagram.com/jane.doe");
    expect(normalizeInstagram("jane_doe")).toBe("https://instagram.com/jane_doe");
  });

  it("accepts profile links with or without a scheme", () => {
    expect(normalizeInstagram("https://instagram.com/jane")).toBe("https://instagram.com/jane");
    expect(normalizeInstagram("instagram.com/jane")).toBe("https://instagram.com/jane");
  });

  it("rejects script schemes and empty input", () => {
    expect(normalizeInstagram("javascript:alert(1)")).toBeNull();
    expect(normalizeInstagram("")).toBeNull();
  });
});
