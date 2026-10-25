"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ease } from "@/lib/motion";
import { createCubeGeometry, createCubeMaterial, createGlowAttribute, FREEZE, MAX_DT } from "./cube-material";
import { SCAN_EVERY, ScanBeam, scanAt } from "./scan-beam";

/** The 3×3 StayQR mark (same glyph as components/logo.tsx). */
const MARK = [1, 1, 0, 1, 0, 1, 0, 1, 1];

// Timeline (seconds)
const HOLD = 1.6; // the QR, with one scan pass
const EXPLODE = [1.9, 3.6] as const; // QR → particle field
const REFORM = [4.4, 6.4] as const; // field → mark
const MARK_SCANS = 7.2; // beam starts sweeping the mark

export type ParticleFieldProps = {
  /** The QR the field starts from (dark modules become cubes). */
  matrix: boolean[][];
  theme: "dark" | "light";
  quality: "high" | "low";
  paused?: boolean;
};

/**
 * Final-CTA scene: the hero's cube QR returns, gently explodes into a drifting particle field,
 * then reforms into the StayQR mark, which the scan beam keeps lighting.
 * Shares geometry/material with CubeQR so both scenes live in one chunk and look identical.
 */
export function ParticleField({ matrix, theme, quality, paused = false }: ParticleFieldProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const tilt = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const { viewport } = useThree();
  const n = matrix.length;

  const data = useMemo(() => {
    const qr: [number, number][] = [];
    matrix.forEach((row, r) => row.forEach((on, c) => on && qr.push([c - (n - 1) / 2, (n - 1) / 2 - r])));
    // mark: each lit glyph cell is a k×k block of cubes, sized to use about as many cubes as the QR
    const cells = MARK.filter(Boolean).length;
    const k = Math.max(4, Math.round(Math.sqrt(qr.length / cells)));
    const gap = Math.round(k * 0.4);
    const span = 3 * k + 2 * gap;
    const mark: [number, number][] = [];
    MARK.forEach((on, i) => {
      if (!on) return;
      const cx = (i % 3) * (k + gap), cy = Math.floor(i / 3) * (k + gap);
      for (let y = 0; y < k; y++) for (let x = 0; x < k; x++) mark.push([cx + x - (span - 1) / 2, (span - 1) / 2 - (cy + y)]);
    });
    const count = Math.max(qr.length, mark.length);
    let seed = 4242;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const from = new Float32Array(count * 3), field = new Float32Array(count * 3), to = new Float32Array(count * 3);
    const spin = new Float32Array(count * 3), phase = new Float32Array(count), delay = new Float32Array(count);
    const hasFrom = new Uint8Array(count), hasTo = new Uint8Array(count);
    // pair QR and mark cubes by vertical order so the reform reads as a gentle drift, not a shuffle
    const order = (a: [number, number][]) => a.map((p, i) => ({ p, i, s: p[1] * 1000 - p[0] + rnd() * 400 })).sort((x, y) => y.s - x.s);
    const qs = order(qr), ms = order(mark);
    for (let i = 0; i < count; i++) {
      const q = qs[i]?.p, m = ms[i]?.p;
      hasFrom[i] = q ? 1 : 0;
      hasTo[i] = m ? 1 : 0;
      const qq = q ?? m!, mm = m ?? q!;
      from.set([qq[0], qq[1], 0], i * 3);
      to.set([mm[0], mm[1], 0], i * 3);
      // the field: a wide, shallow cloud around the code, pushed outward from where each cube was
      const ang = Math.atan2(qq[1], qq[0]) + (rnd() - 0.5) * 1.2;
      const rad = n * (0.55 + rnd() * 0.75);
      field.set([Math.cos(ang) * rad * 1.5, Math.sin(ang) * rad * 0.8, (rnd() - 0.5) * n * 0.9], i * 3);
      spin.set([(rnd() - 0.5) * 6, (rnd() - 0.5) * 6, (rnd() - 0.5) * 6], i * 3);
      phase[i] = rnd() * Math.PI * 2;
      delay[i] = rnd() * 0.5;
    }
    return { count, from, field, to, spin, phase, delay, hasFrom, hasTo, span };
  }, [matrix, n]);

  const geometry = useMemo(() => createCubeGeometry(quality), [quality]);
  const material = useMemo(() => createCubeMaterial(theme), [theme]);
  const glow = useMemo(() => new Float32Array(data.count), [data.count]);
  const glowAttr = useMemo(() => createGlowAttribute(glow), [glow]);
  const lastHit = useMemo(() => new Float32Array(data.count).fill(-100), [data.count]);
  useLayoutEffect(() => {
    geometry.setAttribute("aGlow", glowAttr);
  }, [geometry, glowAttr]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const half = Math.max(n, data.span) / 2;

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m || !tilt.current || paused) return;
    const t = FREEZE ?? (clock.current += Math.min(delta, MAX_DT));
    const { count, from, field, to, spin, phase, delay, hasFrom, hasTo } = data;

    // one beam over the QR, then repeating passes over the finished mark
    const qrScan = scanAt(t, 0.3, half + 2.5, -half - 2.5, 999);
    const markScan = scanAt(t, MARK_SCANS, half + 2.5, -half - 2.5, SCAN_EVERY);
    const beamY = qrScan.y ?? markScan.y;
    if (beam.current) {
      beam.current.visible = beamY !== null;
      if (beamY !== null) beam.current.position.y = beamY;
    }

    for (let i = 0; i < count; i++) {
      const e = ease((t - EXPLODE[0] - delay[i]) / (EXPLODE[1] - EXPLODE[0]));
      const r = ease((t - REFORM[0] - delay[i] * 0.6) / (REFORM[1] - REFORM[0]));
      const drift = (e - r) > 0 ? Math.min(e, 1 - r) : 0; // 1 while floating in the field
      const fx = field[i * 3] + Math.sin(t * 0.5 + phase[i]) * 1.2 * drift;
      const fy = field[i * 3 + 1] + Math.cos(t * 0.4 + phase[i]) * 1.2 * drift;
      const fz = field[i * 3 + 2];
      // from → field → to
      const ax = from[i * 3] + (fx - from[i * 3]) * e, ay = from[i * 3 + 1] + (fy - from[i * 3 + 1]) * e, az = fz * e;
      const x = ax + (to[i * 3] - ax) * r, y = ay + (to[i * 3 + 1] - ay) * r, z = az * (1 - r);

      const y0 = r < 1 ? from[i * 3 + 1] : to[i * 3 + 1];
      if (beamY !== null && Math.abs(y0 - beamY) < 0.75 && (r >= 1 || e <= 0)) lastHit[i] = t;
      const since = t - lastHit[i];
      const pulse = since < 3 ? Math.exp(-since * 6) : 0;
      // QR: faint tint once scanned · field: softly lit sparks · mark: steadily lit
      const base = e <= 0 ? (lastHit[i] > 0 ? 0.03 : 0) : 0.06 * drift + 0.045 * r;
      glow[i] = Math.max(base, (lastHit[i] > 0 ? 1.1 : 0) * pulse);

      // cubes that only exist in one shape grow in or fade out
      // in the mark, cubes grow until each glyph cell reads as one bevelled tile
      const size = (hasFrom[i] ? 1 - (hasTo[i] ? 0 : r) : r) * (1 - 0.45 * drift) * (1 + 0.17 * r);
      dummy.position.set(x, y, z + (pulse * 0.4));
      dummy.rotation.set(spin[i * 3] * drift, spin[i * 3 + 1] * drift, spin[i * 3 + 2] * drift);
      dummy.scale.setScalar(Math.max(0.0001, size));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    glowAttr.needsUpdate = true;

    // lying back like the hero QR, then turning toward the viewer as the mark forms
    const facing = ease((t - REFORM[0]) / (REFORM[1] - REFORM[0] + 1));
    const tgtX = pointer.current.y * 0.12 - 0.42 + 0.24 * facing;
    const tgtY = pointer.current.x * 0.2 + Math.sin(t * 0.25) * 0.06;
    tilt.current.rotation.x += (tgtX - tilt.current.rotation.x) * 0.06;
    tilt.current.rotation.y += (tgtY - tilt.current.rotation.y) * 0.06;
  });

  const fit = Math.min(viewport.width / (half * 2 * 1.9), viewport.height / (half * 2 * 1.3));
  return (
    <group scale={fit}>
      <group ref={tilt} rotation={[-0.42, 0, 0]}>
        <instancedMesh ref={mesh} args={[geometry, material, data.count]} frustumCulled={false} />
        <ScanBeam ref={beam} width={half * 2 + 5} theme={theme} />
      </group>
    </group>
  );
}
