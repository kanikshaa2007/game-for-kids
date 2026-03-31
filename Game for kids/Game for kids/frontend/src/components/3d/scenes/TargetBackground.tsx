'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import GLBLoader from '../../../components/threeD/GLBLoader';

export default function TargetBackground() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 opacity-15 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[2, 1, 5]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Suspense fallback={null}>
          <GLBLoader
            path="/models/target.glb"
            scale={2}
            position={[1, 0, 0]}
            animate={{ rotation: true, speed: 0.5 }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
