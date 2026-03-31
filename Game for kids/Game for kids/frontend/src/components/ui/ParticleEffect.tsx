'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleEffectProps {
  type: 'success' | 'error' | 'neutral';
  trigger?: boolean;
}

function Particles({ type }: { type: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  useEffect(() => {
    if (!pointsRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 4;

      velocities[i] = (Math.random() - 0.5) * 0.1;
      velocities[i + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i + 2] = (Math.random() - 0.5) * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    (geometry as any).velocities = velocities;
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = (pointsRef.current.geometry as any).velocities as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      if (Math.abs(positions[i]) > 5) velocities[i] *= -1;
      if (Math.abs(positions[i + 1]) > 5) velocities[i + 1] *= -1;
      if (Math.abs(positions[i + 2]) > 5) velocities[i + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const getColor = () => {
    switch (type) {
      case 'success':
        return '#4ECDC4';
      case 'error':
        return '#FF6B6B';
      default:
        return '#FFE66D';
    }
  };

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial size={0.1} color={getColor()} sizeAttenuation />
    </points>
  );
}

export default function ParticleEffect({ type = 'neutral', trigger = true }: ParticleEffectProps) {
  if (!trigger) return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <Particles type={type} />
      </Canvas>
    </div>
  );
}
