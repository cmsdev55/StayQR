"use client";

import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo } from "react";
import * as THREE from "three";

/** Desktop-only post-processing. Its own chunk, so phones never download it. */
export default function Effects() {
  const offset = useMemo(() => new THREE.Vector2(0.0006, 0.0006), []);
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={0.65} luminanceSmoothing={0.2} intensity={0.85} radius={0.75} />
      <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={offset} radialModulation={false} modulationOffset={0} />
    </EffectComposer>
  );
}
