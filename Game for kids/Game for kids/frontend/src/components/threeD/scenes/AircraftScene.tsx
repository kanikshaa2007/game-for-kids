"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Aircraft() {
  const ref = useRef<any>();
  const { scene } = useGLTF("/models/aircraft.glb");

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += 0.03;
      ref.current.position.y += 0.01;
      ref.current.rotation.z += 0.002;
    }
  });

  return <primitive ref={ref} object={scene} scale={1.5} />;
}

export default function AircraftScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <Aircraft />
      </Suspense>
    </Canvas>
  );
}