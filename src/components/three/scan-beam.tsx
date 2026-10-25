"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";

/** Seconds for one beam pass (DESIGN.md §5: every 4.5s, 1.1s sweep). */
export const SWEEP = 1.1;
export const SCAN_EVERY = 4.5;

/**
 * Where the beam is at time `t`. Sweeps start at `start` and repeat every `every` seconds,
 * travelling from `top` to `bottom` (in the parent's units). `y` is null between sweeps.
 */
export function scanAt(t: number, start: number, top: number, bottom: number, every = SCAN_EVERY, sweep = SWEEP) {
  if (t < start) return { index: -1, y: null as number | null };
  const index = Math.floor((t - start) / every);
  const local = t - start - index * every;
  return { index, y: local < sweep ? THREE.MathUtils.lerp(top, bottom, local / sweep) : null };
}

export type ScanBeamProps = {
  /** Beam length, in the parent's units (usually the code width plus a margin). */
  width: number;
  theme: "dark" | "light";
  /** Height of the soft trail above the bright line. */
  trail?: number;
};

/**
 * The scan line: a bright core plus a faint lime trail. The parent owns the schedule
 * (see `scanAt`) and moves this group via the forwarded ref, so it never re-renders per frame.
 */
export const ScanBeam = forwardRef<THREE.Group, ScanBeamProps>(function ScanBeam({ width, theme, trail = 2.8 }, ref) {
  const dark = theme === "dark";
  const core = useMemo(() => new THREE.Color("#E6FFB8").multiplyScalar(dark ? 4 : 1.2), [dark]);
  return (
    <group ref={ref} visible={false}>
      <mesh position={[0, 0, 0.75]}>
        <planeGeometry args={[width, 0.14]} />
        <meshBasicMaterial color={core} toneMapped={false} />
      </mesh>
      <mesh position={[0, trail / 2, 0.72]}>
        <planeGeometry args={[width, trail]} />
        <meshBasicMaterial
          color="#B6FF3B"
          transparent
          opacity={dark ? 0.07 : 0.12}
          depthWrite={false}
          blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
});
