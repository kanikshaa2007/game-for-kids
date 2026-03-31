"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Lightning() {
  const ref = useRef<any>();
  const { scene } = useGLTF("/models/lightning.glb");

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.02;
      ref.current.scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.1;
    }
  });

  return <primitive ref={ref} object={scene} scale={2} />;
}

export default function LightningScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight />
      <Suspense fallback={null}>
        <Lightning />
      </Suspense>
    </Canvas>
  );
}