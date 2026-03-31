'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, ReactNode } from 'react';
import { PerspectiveCamera } from '@react-three/drei';

interface Scene3DWrapperProps {
  children: ReactNode;
  height?: string;
  className?: string;
  cameraPosition?: [number, number, number];
}

const Loader = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100">
    <div className="text-gray-500">Loading 3D Scene...</div>
  </div>
);

export default function Scene3DWrapper({
  children,
  height = 'h-96',
  className = '',
  cameraPosition = [0, 0, 5],
}: Scene3DWrapperProps) {
  return (
    <div className={`w-full ${height} relative ${className}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={cameraPosition} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={<Loader />}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
