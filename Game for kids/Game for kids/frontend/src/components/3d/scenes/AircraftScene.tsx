'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useEffect } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import GLBLoader from '../../threeD/GLBLoader';

function AircraftAnimation() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.elapsedTime;
    // Aircraft trajectory - diagonal motion from bottom-left to top-right
    if (elapsed < 3) {
      groupRef.current.position.x = -5 + elapsed * 3;
      groupRef.current.position.y = -2 + elapsed * 1.5;
      groupRef.current.rotation.z = 0.3; // Slight tilt
    }
  });

  return (
    <group ref={groupRef}>
      <GLBLoader
        path="/models/aircraft.glb"
        scale={2}
        position={[0, 0, 0]}
      />
    </group>
  );
}

interface AircraftSceneProps {
  hideOnSmallScreen?: boolean;
}

export default function AircraftScene({ hideOnSmallScreen = false }: AircraftSceneProps) {
  return (
    <div
      className={`w-full h-screen bg-gradient-to-b from-blue-300 via-blue-200 to-pink-100 relative overflow-hidden ${
        hideOnSmallScreen ? 'hidden md:block' : ''
      }`}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <AircraftAnimation />
        </Suspense>
      </Canvas>
    </div>
  );
}
