'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import GLBLoader from '../../threeD/GLBLoader';

interface ResultSceneProps {
  score: number;
}

export default function ResultScene({ score }: ResultSceneProps) {
  let modelPath = '/models/wolf.glb';

  if (score > 80) {
    modelPath = '/models/icecream.glb';
  } else if (score > 50) {
    modelPath = '/models/rainbow.glb';
  } else if (score > 20) {
    modelPath = '/models/penguin.glb';
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scale = isMobile ? 1.5 : 2.5;

  return (
    <div className="w-full h-72 relative my-8">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <GLBLoader
            path={modelPath}
            scale={scale}
            position={[0, 0, 0]}
            animate={{
              floating: true,
              rotation: true,
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
