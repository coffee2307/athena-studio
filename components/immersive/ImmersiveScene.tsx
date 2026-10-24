"use client";

import {useEffect, useRef, useState} from "react";
import {immersiveFragmentShader, immersiveVertexShader} from "./scene-shaders";

type WorldSlug = "creative-studio" | "architecture-studio" | "auto-showroom";
type StageStatus = "loading" | "ready" | "fallback";

const sceneIds: Record<WorldSlug, number> = {
  "creative-studio": 0,
  "architecture-studio": 1,
  "auto-showroom": 2,
};

function compileShader(gl: WebGL2RenderingContext, kind: number, source: string) {
  const shader = gl.createShader(kind);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, immersiveVertexShader);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, immersiveFragmentShader);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.detachShader(program, vertex);
  gl.detachShader(program, fragment);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/**
 * Standalone WebGL2 proof-of-concept renderer, no third-party CDN dependencies.
 * Leaves the original photograph visible when WebGL is unavailable, context is
 * lost, or the visitor requests reduced motion.
 */
export function ImmersiveScene({slug, preset, enabled = true}: {slug: WorldSlug; preset: number; enabled?: boolean}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const presetRef = useRef(preset);
  const [status, setStatus] = useState<StageStatus>("loading");
  presetRef.current = preset;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!enabled) {
      setStatus("fallback");
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      setStatus("fallback");
      return;
    }

    const gl = canvas.getContext("webgl2", {
      alpha: false, antialias: false, depth: false, stencil: false,
      powerPreference: "low-power", preserveDrawingBuffer: false,
    });
    if (!gl) {
      setStatus("fallback");
      return;
    }

    const program = createProgram(gl);
    if (!program) {
      setStatus("fallback");
      return;
    }
    gl.useProgram(program);
    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      time: gl.getUniformLocation(program, "uTime"),
      progress: gl.getUniformLocation(program, "uProgress"),
      preset: gl.getUniformLocation(program, "uPreset"),
      scene: gl.getUniformLocation(program, "uScene"),
    };
    gl.uniform1i(uniforms.scene, sceneIds[slug]);

    let frame = 0;
    let active = true;
    let onScreen = true;
    let drawn = false;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    let scroll = 0, targetScroll = 0;
    let lastFrame = -1000;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const minInterval = mobile ? 1000 / 24 : 1000 / 40;

    const schedule = () => {
      if (active && onScreen && !document.hidden && !frame) {
        frame = requestAnimationFrame(draw);
      }
    };
    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) return;
      targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    };
    const syncScroll = () => {
      const rect = canvas.getBoundingClientRect();
      targetScroll = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
    };

    function draw(now: number) {
      frame = 0;
      if (!active || !onScreen || document.hidden) return;
      if (now - lastFrame < minInterval) { schedule(); return; }
      lastFrame = now;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) { schedule(); return; }

      // Cap pixel cost; avoid rendering full devicePixelRatio on low-end phones.
      const cap = mobile ? 1 : 1.35;
      const scale = Math.min(window.devicePixelRatio || 1, cap);
      const rawWidth = rect.width * scale;
      const rawHeight = rect.height * scale;
      const pixelBudget = mobile ? 130000 : 320000;
      const fit = Math.min(1, Math.sqrt(pixelBudget / Math.max(1, rawWidth * rawHeight)));
      const width = Math.max(1, Math.floor(rawWidth * fit));
      const height = Math.max(1, Math.floor(rawHeight * fit));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      x += (targetX - x) * 0.075;
      y += (targetY - y) * 0.075;
      scroll += (targetScroll - scroll) * 0.12;
      gl!.viewport(0, 0, width, height);
      gl!.uniform2f(uniforms.resolution, width, height);
      gl!.uniform2f(uniforms.pointer, x, y);
      gl!.uniform1f(uniforms.time, now / 1000);
      gl!.uniform1f(uniforms.progress, scroll);
      gl!.uniform1f(uniforms.preset, presetRef.current);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!drawn) {
        drawn = true;
        setStatus("ready");
      }
      schedule();
    }

    const observer = new IntersectionObserver(entries => {
      onScreen = entries.some(entry => entry.isIntersecting);
      if (onScreen) {
        syncScroll();
        schedule();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, {rootMargin: "80px"});
    observer.observe(canvas);

    const visibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      active = false;
      cancelAnimationFrame(frame);
      setStatus("fallback");
    };
    const motionChange = () => {
      if (motion.matches) {
        active = false;
        cancelAnimationFrame(frame);
        setStatus("fallback");
      }
    };

    window.addEventListener("pointermove", pointerMove, {passive: true});
    window.addEventListener("scroll", syncScroll, {passive: true});
    document.addEventListener("visibilitychange", visibilityChange);
    canvas.addEventListener("webglcontextlost", contextLost);
    motion.addEventListener("change", motionChange);
    syncScroll();
    schedule();

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("scroll", syncScroll);
      document.removeEventListener("visibilitychange", visibilityChange);
      canvas.removeEventListener("webglcontextlost", contextLost);
      motion.removeEventListener("change", motionChange);
      gl.deleteProgram(program);
    };
  }, [slug, enabled]);

  return <canvas
    ref={canvasRef}
    className={"ix-3d-canvas" + (status === "ready" ? " is-active" : "")}
    data-renderer={status}
    data-scene-type={slug}
    aria-hidden="true"
  />;
}
