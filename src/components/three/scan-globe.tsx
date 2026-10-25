"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ease } from "@/lib/motion";
import { FREEZE, MAX_DT } from "./cube-material";
import { LAND_BITS, LAND_H, LAND_W } from "./land-mask";

export const SCAN_CITIES = [
  { name: "London", lat: 51.5, lon: -0.12 },
  { name: "Austin", lat: 30.27, lon: -97.74 },
  { name: "Lahore", lat: 31.55, lon: 74.34 },
  { name: "São Paulo", lat: -23.55, lon: -46.63 },
  { name: "Berlin", lat: 52.52, lon: 13.4 },
  { name: "Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Lagos", lat: 6.52, lon: 3.38 },
  { name: "Toronto", lat: 43.65, lon: -79.38 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "Sydney", lat: -33.87, lon: 151.21 },
  { name: "Madrid", lat: 40.42, lon: -3.7 },
  { name: "Mexico City", lat: 19.43, lon: -99.13 },
  { name: "Mumbai", lat: 19.07, lon: 72.88 },
  { name: "Nairobi", lat: -1.29, lon: 36.82 },
  { name: "Seoul", lat: 37.57, lon: 126.98 },
  { name: "Cape Town", lat: -33.92, lon: 18.42 },
];

const PING_EVERY = 0.9; // seconds between scans
const PING_LIFE = 1.8;
const STRIDE = 7; // walk the city list in a spread-out order

function toVec(lat: number, lon: number, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const th = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-Math.sin(phi) * Math.cos(th) * r, Math.cos(phi) * r, Math.sin(phi) * Math.sin(th) * r);
}

function landPoints(count: number) {
  const bits = Uint8Array.from(atob(LAND_BITS), (c) => c.charCodeAt(0));
  const isLand = (lat: number, lon: number) => {
    const x = Math.min(LAND_W - 1, Math.floor(((lon + 180) / 360) * LAND_W));
    const y = Math.min(LAND_H - 1, Math.floor(((90 - lat) / 180) * LAND_H));
    const i = y * LAND_W + x;
    return (bits[i >> 3] >> (i & 7)) & 1;
  };
  const out: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const x = Math.cos(th) * rad, z = Math.sin(th) * rad;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = ((Math.atan2(z, -x) * 180) / Math.PI + 360) % 360 - 180;
    if (isLand(lat, lon)) out.push(x, y, z);
  }
  return new Float32Array(out);
}

export type ScanGlobeProps = {
  theme: "dark" | "light";
  quality: "high" | "low";
  paused?: boolean;
  /** Fires at each new scan with the city name (for the DOM feed). */
  onPing?: (city: string) => void;
};

/** A dotted globe of land with lime scan pings; scanned cities stay softly lit. */
export function ScanGlobe({ theme, quality, paused = false, onPing }: ScanGlobeProps) {
  const dark = theme === "dark";
  const spin = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const dots = useRef<(THREE.Mesh | null)[]>([]);
  const clock = useRef(0);
  const lastK = useRef(-1);
  const onPingRef = useRef(onPing);
  onPingRef.current = onPing;
  const { gl, viewport } = useThree();

  const positions = useMemo(() => landPoints(quality === "high" ? 26000 : 14000), [quality]);
  const cities = useMemo(() => SCAN_CITIES.map((c) => ({ ...c, v: toVec(c.lat, c.lon, 1.004) })), []);

  const pointsMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color(dark ? "#AEB6C6" : "#4A5263") },
          uSize: { value: (quality === "high" ? 2.6 : 2.2) * Math.min(gl.getPixelRatio(), 2) },
          uBack: { value: dark ? 0.07 : 0.1 },
        },
        vertexShader: /* glsl */ `
          uniform float uSize; varying float vFacing;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vFacing = normalize(normalMatrix * position).z;
            gl_PointSize = uSize;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uBack; varying float vFacing;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = mix(uBack, 0.95, smoothstep(-0.05, 0.55, vFacing));
            gl_FragColor = vec4(uColor, a * smoothstep(0.5, 0.3, d));
          }`,
      }),
    [dark, quality, gl],
  );

  // soft blue-violet rim (depth glow only)
  const rimMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color(dark ? "#6E7BFF" : "#4B57E6") }, uStrength: { value: dark ? 0.32 : 0.14 } },
        vertexShader: /* glsl */ `
          varying float vRim;
          void main() {
            vec3 n = normalize(normalMatrix * normal);
            vRim = pow(1.0 - clamp(n.z, 0.0, 1.0), 4.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uStrength; varying float vRim;
          void main() { gl_FragColor = vec4(uColor, vRim * uStrength); }`,
      }),
    [dark],
  );

  const ping = dark ? "#B6FF3B" : "#3F6B00";
  useEffect(() => () => { pointsMat.dispose(); rimMat.dispose(); }, [pointsMat, rimMat]);

  useFrame((_, delta) => {
    if (paused || !spin.current) return;
    const t = FREEZE ?? (clock.current += Math.min(delta, MAX_DT));
    // starts over Europe/Africa (-1.92) and turns east so Asia comes into view
    spin.current.rotation.y = -1.92 - t * 0.05;

    const k = Math.floor(t / PING_EVERY);
    if (k !== lastK.current && FREEZE === null) {
      lastK.current = k;
      onPingRef.current?.(cities[(k * STRIDE) % cities.length].name);
    }
    // rings: one per recent scan, from a small pool
    rings.current.forEach((ring, slot) => {
      if (!ring) return;
      const kk = k - slot;
      const age = t - kk * PING_EVERY;
      const city = cities[(((kk * STRIDE) % cities.length) + cities.length) % cities.length];
      const live = kk >= 0 && age < PING_LIFE;
      ring.visible = live;
      if (!live) return;
      ring.position.copy(city.v);
      ring.lookAt(city.v.clone().multiplyScalar(2));
      ring.scale.setScalar(0.01 + ease(age / PING_LIFE) * 0.13);
      (ring.material as THREE.MeshBasicMaterial).opacity = 1 - age / PING_LIFE;
    });
    // city dots: bright on a scan, then stay softly lit
    dots.current.forEach((dot, i) => {
      if (!dot) return;
      let lastHit = -Infinity;
      for (let kk = k; kk >= Math.max(0, k - cities.length * 2); kk--) {
        if ((kk * STRIDE) % cities.length === i) {
          lastHit = kk * PING_EVERY;
          break;
        }
      }
      const since = t - lastHit;
      dot.visible = since !== Infinity;
      (dot.material as THREE.MeshBasicMaterial).opacity = 0.45 + 0.55 * Math.exp(-since * 2);
    });
  });

  // globe sits low in its box, rising like a horizon
  const r = Math.min(viewport.width, viewport.height * 1.15) * 0.42;
  return (
    <group position={[0, -viewport.height * 0.12, 0]} scale={r}>
      <group rotation={[0.38, 0, -0.12]}>
        <mesh material={rimMat} scale={1.06}>
          <sphereGeometry args={[1, 64, 64]} />
        </mesh>
        <group ref={spin}>
          <points material={pointsMat}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
          </points>
          {cities.map((c, i) => (
            <mesh key={c.name} ref={(m) => { dots.current[i] = m; }} position={c.v} visible={false}>
              <sphereGeometry args={[0.014, 10, 10]} />
              <meshBasicMaterial color={ping} transparent toneMapped={false} />
            </mesh>
          ))}
          {[0, 1].map((slot) => (
            <mesh key={slot} ref={(m) => { rings.current[slot] = m; }} visible={false}>
              <ringGeometry args={[0.82, 1, 48]} />
              <meshBasicMaterial color={ping} transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
