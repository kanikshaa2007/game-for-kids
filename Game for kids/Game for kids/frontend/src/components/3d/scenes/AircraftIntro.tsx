'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useEffect } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import GLBLoader from '../../../components/threeD/GLBLoader';

function AircraftAnimator() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = state.clock.elapsedTime % 4; // Loop every 4 seconds
    
    // Smooth curved flight path with continuous arcs
    const t = elapsed / 4; // Normalize 0-1
    
    // Create smooth curve using sine/cosine for natural arc motion
    const curve = Math.sin(t * Math.PI); // Arc from 0 to 1 and back
    
    // Position along curved path (kept higher to avoid overlap)
    groupRef.current.position.x = 8 - t * 18.5; // Start right, end left
    groupRef.current.position.y = 3 - curve * 1.2; // Higher arc, less dip to avoid content
    groupRef.current.position.z = 15 - t * 13.5; // Come forward from back
    
    // Smooth rotation following the curve
    const bendAmount = Math.sin(t * Math.PI * 2) * 0.5; // Bending left-right
    groupRef.current.rotation.x = -curve * 0.5; // Pitch follows the arc
    groupRef.current.rotation.z = bendAmount * 0.3; // Roll left and right with bend
    groupRef.current.rotation.y = t * Math.PI * 0.8; // Gradual yaw from right to left
  });

  return (
    <group ref={groupRef}>
      <GLBLoader path="/models/aircraft.glb" scale={1.5} />
    </group>
  );
}

export default function AircraftIntro() {
  return (
    <div className="w-full h-[50vh] md:h-[70vh] relative overflow-hidden bg-gradient-to-b from-blue-300 via-blue-200 to-transparent">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <AircraftAnimator />
        </Suspense>
      </Canvas>
    </div>
  );
}
