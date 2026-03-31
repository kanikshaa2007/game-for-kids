'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface Shape3DProps {
  type: 'cube' | 'sphere' | 'pyramid' | 'cylinder';
  color?: string;
  count?: number;
  interactive?: boolean;
}

function RotatingShape({ type, color = '#FF6B6B' }: { type: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getGeometry = () => {
    switch (type) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.7, 32, 32]} />;
      case 'pyramid':
        return <coneGeometry args={[1, 1.5, 4]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.7, 0.7, 1.5, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef}>
      {getGeometry()}
      <meshStandardMaterial color={color} wireframe={false} />
    </mesh>
  );
}

function ShapeGroup({ type, color, count = 1 }: { type: string; color: string; count: number }) {
  const shapes = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = 2;
    return {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      key: i,
    };
  });

  return (
    <>
      {shapes.map((shape) => (
        <group key={shape.key} position={[shape.x, 0, shape.z]}>
          <RotatingShape type={type} color={color} />
        </group>
      ))}
    </>
  );
}

export default function Shape3D({ type = 'cube', color = '#FF6B6B', count = 1 }: Shape3DProps) {
  return (
    <div className="w-full h-64 bg-gradient-to-b from-purple-100 to-purple-50 rounded-2xl overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#4ECDC4" />
        <ShapeGroup type={type} color={color} count={count} />
      </Canvas>
    </div>
  );
}
