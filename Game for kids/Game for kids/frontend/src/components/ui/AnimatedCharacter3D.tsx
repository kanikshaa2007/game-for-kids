'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedCharacterProps {
  emotion?: 'happy' | 'thinking' | 'celebrating';
  scale?: number;
}

function Character({ emotion = 'happy', scale = 1 }: AnimatedCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle bobbing animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;

    // Head rotation based on emotion
    if (headRef.current) {
      if (emotion === 'thinking') {
        headRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.2;
      } else if (emotion === 'celebrating') {
        headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.3;
      }
    }

    // Body sway
    if (bodyRef.current) {
      bodyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, -0.5, 0]}>
        <boxGeometry args={[0.6, 1, 0.4]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFD93D" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.15, 1, 0.45]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.15, 1, 0.45]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* Smile */}
      {emotion !== 'thinking' && (
        <mesh position={[0, 0.6, 0.48]}>
          <torusGeometry args={[0.2, 0.05, 16, 100, Math.PI]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      )}

      {/* Arms */}
      <mesh position={[-0.4, 0.2, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>
      <mesh position={[0.4, 0.2, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, -1.2, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#4ECDC4" />
      </mesh>
      <mesh position={[0.15, -1.2, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#4ECDC4" />
      </mesh>
    </group>
  );
}

export default function AnimatedCharacter(props: AnimatedCharacterProps) {
  return (
    <div className="w-full h-64 bg-gradient-to-b from-blue-100 to-blue-50 rounded-2xl overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Character {...props} scale={1.5} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}
