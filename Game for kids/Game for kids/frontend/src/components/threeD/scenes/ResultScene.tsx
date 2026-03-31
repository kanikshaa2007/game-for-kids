"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

function Model({ path }: any) {
  const gltf = useGLTF(path) as any;
  const scene = gltf.scene || (gltf as any).scene;
  return <primitive object={scene} scale={2} />;
}

export default function ResultScene({ score }: any) {
  let model = "/models/rainbow.glb";

  if (score > 80) model = "/models/icecream.glb";
  else if (score > 50) model = "/models/rainbow.glb";
  else if (score > 20) model = "/models/penguin.glb";
  else model = "/models/wolf.glb";

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight />
      <Suspense fallback={null}>
        <Model path={model} />
      </Suspense>
    </Canvas>
  );
}