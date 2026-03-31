'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import GLBLoader from '../../../components/threeD/GLBLoader';

interface ResultDisplayProps {
  score: number;
}

export default function ResultDisplay({ score }: ResultDisplayProps) {
  let modelPath = '/models/wolf.glb';
  let resultText = 'Great try!';
  let resultColor = 'from-purple-500 to-pink-500';

  if (score > 80) {
    modelPath = '/models/icecream.glb';
    resultText = '🎉 Amazing!';
    resultColor = 'from-yellow-500 to-orange-500';
  } else if (score > 50) {
    modelPath = '/models/rainbow.glb';
    resultText = '✨ Awesome!';
    resultColor = 'from-blue-500 to-purple-500';
  } else if (score > 20) {
    modelPath = '/models/penguin.glb';
    resultText = '👏 Good Job!';
    resultColor = 'from-cyan-500 to-blue-500';
  }

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* 3D Model */}
      <div className="w-full h-72 relative">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <GLBLoader
              path={modelPath}
              scale={2}
              position={[0, 0, 0]}
              animate={{
                floating: true,
                rotation: true,
                speed: 1,
              }}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Score Display */}
      <div className={`text-center p-8 rounded-3xl bg-gradient-to-r ${resultColor} shadow-2xl`}>
        <div className="text-6xl font-bold text-white mb-2">{score}</div>
        <div className="text-2xl font-bold text-white">{resultText}</div>
      </div>
    </div>
  );
}
