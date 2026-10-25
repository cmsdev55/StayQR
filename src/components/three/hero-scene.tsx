"use client";

import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import * as THREE from "three";
import { qrMatrix } from "@/lib/qr";
import { CubeQR } from "./cube-qr";

const Effects = dynamic(() => import("./effects"), { ssr: false });

export type HeroSceneProps = {
  tier: "high" | "low";
  theme: "dark" | "light";
  active: boolean;
  onScan?: () => void;
  onReady?: () => void;
};

/** Loaded with next/dynamic({ ssr: false }) — never part of the initial JS. */
export default function HeroScene({ tier, theme, active, onScan, onReady }: HeroSceneProps) {
  const high = tier === "high";
  // Real, scannable code. v4 = 33×33 modules on desktop, v2 = 25×25 on phones.
  const matrix = useMemo(() => qrMatrix("https://stayqr.com", high ? 4 : 2), [high]);
  const dark = theme === "dark";
  // Post-processing needs an opaque buffer (alpha + bloom tints the clear colour).
  const opaque = high && dark;

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={high ? [1, 2] : [1, 1.5]}
      gl={{ antialias: !high, alpha: !opaque, powerPreference: "high-performance", preserveDrawingBuffer: false }}
      camera={{ position: [0, 0, 42], fov: 32, near: 1, far: 200 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        if (opaque) gl.setClearColor(0x07080b, 1);
        else gl.setClearColor(0x000000, 0);
        onReady?.();
      }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      {opaque && <color attach="background" args={["#07080B"]} />}
      <ambientLight intensity={dark ? 0.35 : 1.1} />
      <directionalLight position={[8, 14, 20]} intensity={dark ? 3.2 : 2.4} color="#ffffff" />
      {/* blue-violet depth rim from behind-left */}
      <directionalLight position={[-18, 10, -12]} intensity={dark ? 5 : 1.6} color={dark ? "#6E7BFF" : "#4B57E6"} />
      <pointLight position={[0, -6, 10]} intensity={dark ? 40 : 10} distance={60} color="#6E7BFF" />

      <CubeQR matrix={matrix} theme={theme} quality={tier} onScan={onScan} />

      {opaque && <Effects />}
    </Canvas>
  );
}
