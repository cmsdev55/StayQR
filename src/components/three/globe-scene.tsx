"use client";

import { Canvas } from "@react-three/fiber";
import { ScanGlobe } from "./scan-globe";

export type GlobeSceneProps = {
  tier: "high" | "low";
  theme: "dark" | "light";
  active: boolean;
  onPing?: (city: string) => void;
  onReady?: () => void;
};

/** The features-bento globe. One canvas, loaded with next/dynamic({ ssr: false }) when near view. */
export default function GlobeScene({ tier, theme, active, onPing, onReady }: GlobeSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={tier === "high" ? [1, 2] : [1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 30, near: 0.1, far: 50 }}
      onCreated={() => onReady?.()}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <ScanGlobe theme={theme} quality={tier} paused={!active} onPing={onPing} />
    </Canvas>
  );
}
