"use client";

import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Object3D } from 'three';

interface GLBLoaderProps {
  path: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  animate?: {
    rotation?: boolean;
    floating?: boolean;
    scaling?: boolean;
    speed?: number;
  };
}

export default function GLBLoader({
  path,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animate = { speed: 1 },
}: GLBLoaderProps) {
  const gltf = useGLTF(path);
  const { scene } = gltf as any;
  const groupRef = useRef<Group>(null);
  const cloned = useRef<Object3D | null>(null);

  if (!cloned.current && scene) {
    try {
      cloned.current = scene.clone() as Object3D;
    } catch {
      cloned.current = scene as Object3D;
    }
  }

  useFrame((state) => {
    if (!groupRef.current) return;

    const speed = animate?.speed || 1;

    if (animate?.floating) {
      groupRef.current.position.y =
        (position[1] || 0) + Math.sin(state.clock.elapsedTime * 1.5 * speed) * 0.4;
    }

    if (animate?.rotation) {
      groupRef.current.rotation.y += 0.003 * speed;
    }

    if (animate?.scaling) {
      const scaleAmount = 1 + Math.sin(state.clock.elapsedTime * 2 * speed) * 0.15;
      if (Array.isArray(scale)) {
        groupRef.current.scale.set(
          scaleAmount * scale[0],
          scaleAmount * scale[1],
          scaleAmount * scale[2]
        );
      } else {
        const s = scale as number;
        groupRef.current.scale.set(scaleAmount * s, scaleAmount * s, scaleAmount * s);
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={cloned.current || scene} />
    </group>
  );
}

/* Preload all models */
useGLTF.preload('/models/aircraft.glb');
useGLTF.preload('/models/target.glb');
useGLTF.preload('/models/lightning.glb');
useGLTF.preload('/models/icecream.glb');
useGLTF.preload('/models/rainbow.glb');
useGLTF.preload('/models/penguin.glb');
useGLTF.preload('/models/wolf.glb');