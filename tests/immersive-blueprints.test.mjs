import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = async path => readFile(new URL(path, root), "utf8");
const registry = JSON.parse(await read("data/templates.json"));
const blueprint = JSON.parse(await read("data/immersive-blueprints.json"));

test("all 21 Athena templates have unique immersive direction and honest delivery status", () => {
  assert.equal(blueprint.worlds.length, 21);
  const slugs = registry.map(entry => entry.slug);
  const scenes = blueprint.worlds.map(entry => entry.slug);
  assert.deepEqual([...scenes].sort(), [...slugs].sort());
  assert.equal(new Set(scenes).size, 21);
  const allowed = new Set(["prototype-webgl2", "existing-original", "planned"]);
  for (const scene of blueprint.worlds) {
    assert.ok(scene.title.length > 3, scene.slug);
    assert.ok(scene.scene.length > 20, scene.slug);
    assert.ok(scene.signatureInteraction.length > 20, scene.slug);
    assert.ok(allowed.has(scene.status), scene.slug);
  }
  const prototypes = blueprint.worlds.filter(scene => scene.status === "prototype-webgl2");
  assert.deepEqual(prototypes.map(scene => scene.slug).sort(), [
    "architecture-studio", "auto-showroom", "creative-studio",
  ]);
  assert.equal(blueprint.worlds.find(scene => scene.slug === "digital-creators").status, "existing-original");
});

test("first immersive scenes are WebGL2 with deterministic mobile safety guards", async () => {
  const [canvas, mesh, style, world] = await Promise.all([
    read("components/immersive/ImmersiveScene.tsx"),
    read("components/immersive/mesh-worlds.ts"),
    read("app/immersive-phase0.css"),
    read("components/templates/WorldImmersiveHome.tsx"),
  ]);
  assert.match(canvas, /getContext\("webgl2"/);
  assert.match(canvas, /prefers-reduced-motion/);
  assert.match(canvas, /webglcontextlost/);
  assert.match(canvas, /IntersectionObserver/);
  assert.match(canvas, /maxPixels|const cap=/);
  assert.match(canvas, /#version 300 es/);
  assert.match(mesh, /makeWorldMesh/);
  assert.match(mesh, /tubeRing/);
  assert.match(canvas, /drawArrays/);
  assert.match(style, /\.ix-3d-canvas\.is-active/);
  assert.match(world, /<WorldScene/);
});
