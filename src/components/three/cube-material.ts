import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";

/**
 * The StayQR module cube, shared by CubeQR and ParticleField so both scenes look identical
 * and webpack keeps the code in one shared chunk.
 */
export function createCubeGeometry(quality: "high" | "low") {
  return new RoundedBoxGeometry(0.84, 0.84, 0.62, quality === "high" ? 3 : 2, 0.12);
}

/** Per-instance glow buffer (0 = dark cube, ~1 = fully lit), bound to the `aGlow` attribute. */
export function createGlowAttribute(glow: Float32Array) {
  const a = new THREE.InstancedBufferAttribute(glow, 1);
  a.setUsage(THREE.DynamicDrawUsage);
  return a;
}

/** Standard material whose colour and emissive are pushed toward lime by the `aGlow` instance attribute. */
export function createCubeMaterial(theme: "dark" | "light") {
  const dark = theme === "dark";
  const m = new THREE.MeshStandardMaterial({
    color: dark ? "#2B303B" : "#C9CED6",
    roughness: dark ? 0.42 : 0.5,
    metalness: dark ? 0.25 : 0.05,
  });
  const uniforms = {
    uGlowColor: { value: new THREE.Color("#B6FF3B") },
    uGlowStrength: { value: dark ? 2.2 : 0.35 },
  };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aGlow;\nvarying float vGlow;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvGlow = aGlow;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform vec3 uGlowColor;\nuniform float uGlowStrength;\nvarying float vGlow;",
      )
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uGlowColor, clamp((vGlow - 0.06) * 0.95, 0.0, 1.0));",
      )
      .replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\ntotalEmissiveRadiance += uGlowColor * max(vGlow, 0.0) * uGlowStrength;",
      );
  };
  m.customProgramCacheKey = () => `cubeqr-${theme}`;
  return m;
}

/** Screenshot/QA flags shared by every scene: ?capture lets the clock follow real time at low FPS, ?freeze=3.1 pins it. */
const QS = typeof window !== "undefined" ? new URLSearchParams(location.search) : null;
export const MAX_DT = QS?.has("capture") ? 0.6 : 1 / 20;
export const FREEZE = QS?.get("freeze") ? Number(QS.get("freeze")) : null;
