'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import GLBLoader from '../../../components/threeD/GLBLoader';

export default function LightningFX() {
  return (
    <div className="fixed top-0 right-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none z-0 md:opacity-80 opacity-40">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <ambientLight intensity={1} />
        <pointLight position={[0, 0, 5]} intensity={2} color="#ffff00" />
        <Suspense fallback={null}>
          <GLBLoader
            path="/models/lightning.glb"
            scale={1.2}
            position={[0, 0, 0]}
            animate={{ scaling: true, rotation: true, speed: 1.5 }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
