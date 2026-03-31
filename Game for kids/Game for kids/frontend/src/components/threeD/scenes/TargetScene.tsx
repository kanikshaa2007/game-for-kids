"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

function Target() {
  const { scene } = useGLTF("/models/target.glb");

  return <primitive object={scene} scale={2} />;
}

export default function TargetScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight />
      <Suspense fallback={null}>
        <Target />
      </Suspense>
    </Canvas>
  );
}