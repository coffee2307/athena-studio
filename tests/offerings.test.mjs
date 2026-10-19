import test from "node:test";
import assert from "node:assert/strict";
import { offerings, getOffering } from "../lib/offerings.ts";

test("there are exactly four unique service routes", () => {
  assert.equal(offerings.length, 4);
  assert.deepEqual(offerings.map((o) => o.slug), [
    "web-development", "website-care", "ai-integration", "micro-saas",
  ]);
  assert.equal(new Set(offerings.map((o) => o.slug)).size, offerings.length);
});

test("published services have sufficient content for a landing page", () => {
  for (const o of offerings) {
    assert.match(o.slug, /^[a-z0-9-]+$/);
    for (const k of ["title", "shortTitle", "description", "details", "startingAt"]) {
      assert.ok(typeof o[k] === "string" && o[k].trim(), o.slug + " has missing " + k);
    }
    assert.ok(o.features.length >= 3, o.slug + " has too few features");
    assert.ok(o.deliverables.length >= 3, o.slug + " has too few deliverables");
    assert.equal(getOffering(o.slug), o);
  }
});

test("invalid service routes are never mapped to real services", () => {
  for (const slug of ["", "../contact", "not-implemented", "ai-integration/../../admin"]) {
    assert.equal(getOffering(slug), undefined);
  }
});
