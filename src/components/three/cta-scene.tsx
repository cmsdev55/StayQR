"use client";

import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import * as THREE from "three";
import { qrMatrix } from "@/lib/qr";
import { ParticleField } from "./particle-field";

const Effects = dynamic(() => import("./effects"), { ssr: false });

export type CtaSceneProps = {
  tier: "high" | "low";
  theme: "dark" | "light";
  active: boolean;
  onReady?: () => void;
};

/** Final CTA: same lights, cubes and post-processing as the hero, so it reuses the hero's chunks. */
export default function CtaScene({ tier, theme, active, onReady }: CtaSceneProps) {
  const high = tier === "high";
  const matrix = useMemo(() => qrMatrix("https://stayqr.com", high ? 4 : 2), [high]);
  const dark = theme === "dark";
  const opaque = high && dark;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={high ? [1, 2] : [1, 1.5]}
      gl={{ antialias: !high, alpha: !opaque, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 42], fov: 32, near: 1, far: 200 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.setClearColor(opaque ? 0x07080b : 0x000000, opaque ? 1 : 0);
        onReady?.();
      }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      {opaque && <color attach="background" args={["#07080B"]} />}
      <ambientLight intensity={dark ? 0.35 : 1.1} />
      <directionalLight position={[8, 14, 20]} intensity={dark ? 3.2 : 2.4} />
      <directionalLight position={[-18, 10, -12]} intensity={dark ? 5 : 1.6} color={dark ? "#6E7BFF" : "#4B57E6"} />
      <pointLight position={[0, -6, 10]} intensity={dark ? 40 : 10} distance={60} color="#6E7BFF" />
      <ParticleField matrix={matrix} theme={theme} quality={tier} paused={!active} />
      {opaque && <Effects />}
    </Canvas>
  );
}
