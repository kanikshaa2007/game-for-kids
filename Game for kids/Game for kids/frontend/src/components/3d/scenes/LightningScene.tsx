'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import GLBLoader from '../../threeD/GLBLoader';

export default function LightningScene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scale = isMobile ? 0.8 : 1.5;

  return (
    <div className="absolute top-8 right-8 w-48 h-48 pointer-events-none z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <ambientLight intensity={1} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#ffff00" />
        <Suspense fallback={null}>
          <GLBLoader
            path="/models/lightning.glb"
            scale={scale}
            position={[0, 0, 0]}
            animate={{
              rotation: true,
              scaling: true,
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
