'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import GLBLoader from '../../threeD/GLBLoader';

export default function TargetScene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scale = isMobile ? 1 : 2;

  return (
    <div className="absolute inset-0 w-full h-full -z-10 opacity-20 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <Suspense fallback={null}>
          <GLBLoader
            path="/models/target.glb"
            scale={scale}
            position={[1.5, 0.5, 0]}
            animate={{ rotation: true }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
