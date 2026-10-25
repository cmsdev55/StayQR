"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ease } from "@/lib/motion";
import { createCubeGeometry, createCubeMaterial, createGlowAttribute, FREEZE, MAX_DT } from "./cube-material";
import { SCAN_EVERY, SWEEP, ScanBeam, scanAt } from "./scan-beam";

export type CubeQRProps = {
  matrix: boolean[][];
  theme: "dark" | "light";
  quality: "high" | "low";
  /** Called once at the start of every scan sweep (for the DOM toast). */
  onScan?: () => void;
  /** Seconds between scan sweeps. */
  scanEvery?: number;
  /** Stop advancing the timeline (the canvas may still render). */
  paused?: boolean;
};

const ASSEMBLE = 1.1; // per-cube flight time
const ROW_STAGGER = 0.035;

/**
 * A QR code made of extruded rounded cubes (one InstancedMesh).
 * Beats: assemble from a particle cloud → hold + tilt → scan sweeps light the cubes,
 * which then stay softly lit ("codes that never die").
 */
export function CubeQR({ matrix, theme, quality, onScan, scanEvery = SCAN_EVERY, paused = false }: CubeQRProps) {
  const n = matrix.length;
  const group = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const beam = useRef<THREE.Group>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const { viewport, size } = useThree();

  // ── Per-instance data ───────────────────────────────────────────────
  const data = useMemo(() => {
    const cells: { r: number; c: number }[] = [];
    matrix.forEach((row, r) => row.forEach((on, c) => on && cells.push({ r, c })));
    const count = cells.length;
    const target = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const spin = new Float32Array(count * 3);
    const delay = new Float32Array(count);
    let seed = 1337;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const half = (n - 1) / 2;
    cells.forEach(({ r, c }, i) => {
      target[i * 3] = c - half;
      target[i * 3 + 1] = half - r;
      target[i * 3 + 2] = 0;
      // particle cloud: a wide, shallow ellipsoid in front of the code
      const th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1), rad = 14 + rnd() * 22;
      scatter[i * 3] = Math.sin(ph) * Math.cos(th) * rad * 1.6;
      scatter[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * rad * 0.9 + 6;
      scatter[i * 3 + 2] = Math.cos(ph) * rad * 0.6 + 10;
      spin[i * 3] = (rnd() - 0.5) * 8;
      spin[i * 3 + 1] = (rnd() - 0.5) * 8;
      spin[i * 3 + 2] = (rnd() - 0.5) * 8;
      delay[i] = r * ROW_STAGGER + rnd() * 0.18;
    });
    const assembledAt = (n - 1) * ROW_STAGGER + 0.18 + ASSEMBLE;
    return { count, target, scatter, spin, delay, assembledAt };
  }, [matrix, n]);

  const glow = useMemo(() => new Float32Array(data.count), [data.count]);
  const lastHit = useMemo(() => new Float32Array(data.count).fill(-100), [data.count]);

  // ── Geometry + material (emissive driven per instance via aGlow) ─────
  const geometry = useMemo(() => createCubeGeometry(quality), [quality]);
  const material = useMemo(() => createCubeMaterial(theme), [theme]);
  const glowAttr = useMemo(() => createGlowAttribute(glow), [glow]);

  useLayoutEffect(() => {
    geometry.setAttribute("aGlow", glowAttr);
  }, [geometry, glowAttr]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  // ── Pointer + gyroscope tilt ────────────────────────────────────────
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const orient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      pointer.current.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("deviceorientation", orient, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("deviceorientation", orient);
    };
  }, []);

  // ── Frame loop ──────────────────────────────────────────────────────
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const clock = useRef(0);
  const scanIndex = useRef(-1);
  const scannedOnce = useRef(false);
  const half = (n - 1) / 2;

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m || !tilt.current || !group.current || paused) return;
    const t = FREEZE ?? (clock.current += Math.min(delta, MAX_DT));
    const { count, target, scatter, spin, delay, assembledAt } = data;

    // Scan schedule
    const scanStart0 = assembledAt + 0.35;
    const scan = scanAt(t, scanStart0, half + 2.5, -half - 2.5, scanEvery);
    if (scan.index >= 0 && scan.index !== scanIndex.current) {
      scanIndex.current = scan.index;
      onScanRef.current?.();
    }
    const beamY = scan.y ?? Infinity;
    if (scan.y !== null) scannedOnce.current = true;

    const settled = scannedOnce.current || t > scanStart0 + SWEEP ? 0.014 : 0;
    const assembling = t < assembledAt + 0.05;

    for (let i = 0; i < count; i++) {
      const tx = target[i * 3], ty = target[i * 3 + 1];
      if (beamY !== Infinity && Math.abs(ty - beamY) < 0.75) lastHit[i] = t;
      // frozen frames: derive the hit time analytically so the trail behind the beam renders
      if (FREEZE !== null && beamY !== Infinity && ty > beamY) lastHit[i] = t - ((ty - beamY) / (n + 5)) * SWEEP;
      const since = t - lastHit[i];
      const pulse = since < 3 ? Math.exp(-since * 6) : 0;
      glow[i] = Math.max(settled, lastHit[i] > 0 ? settled + (1.1 - settled) * pulse : 0);
      const pop = since < 2 ? 0.45 * Math.exp(-since * 3.5) : 0;

      if (assembling) {
        const p = ease((t - delay[i]) / ASSEMBLE);
        const q = 1 - p;
        dummy.position.set(
          scatter[i * 3] * q + tx * p,
          scatter[i * 3 + 1] * q + ty * p,
          scatter[i * 3 + 2] * q,
        );
        dummy.rotation.set(spin[i * 3] * q, spin[i * 3 + 1] * q, spin[i * 3 + 2] * q);
        const s = 0.25 + 0.75 * p;
        dummy.scale.setScalar(s);
      } else {
        dummy.position.set(tx, ty, pop);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(1);
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    glowAttr.needsUpdate = true;

    // Beam
    if (beam.current) {
      beam.current.visible = beamY !== Infinity;
      if (beamY !== Infinity) beam.current.position.y = beamY;
    }

    // Weighty tilt toward pointer (lerp 0.08, max ≈ 12°)
    const maxTilt = 0.21;
    const tgtX = pointer.current.y * maxTilt * 0.6;
    const tgtY = pointer.current.x * maxTilt;
    tilt.current.rotation.x += (tgtX - tilt.current.rotation.x) * 0.08;
    tilt.current.rotation.y += (tgtY - tilt.current.rotation.y) * 0.08;
    // gentle float
    group.current.position.z = Math.sin(t * 0.6) * 0.25;
  });

  // Fit the code to the canvas: lying back like a lit floor, filling ~70% of the width.
  const isPortrait = size.height > size.width || size.width < 640;
  const fit = isPortrait
    ? Math.min(viewport.width / (n * 1.18), viewport.height / (n * 0.95))
    : Math.min(viewport.width / (n * 1.9), viewport.height / (n * 0.95));

  return (
    <group scale={fit} position={[0, isPortrait ? viewport.height * 0.06 : -viewport.height * 0.02, 0]}>
      <group ref={tilt}>
        <group ref={group} rotation={[isPortrait ? -0.62 : -0.72, 0, isPortrait ? -0.1 : -0.14]}>
          <instancedMesh ref={mesh} args={[geometry, material, data.count]} frustumCulled={false} />
          <ScanBeam ref={beam} width={n + 5} theme={theme} />
        </group>
      </group>
    </group>
  );
}
