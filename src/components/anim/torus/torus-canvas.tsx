/*
  Appellation: torus-canvas <module>
  Contrib: @FL03
*/
'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
// feature-specific
import { TorusParticles } from './torus-particles';



export const TorusParticleFlowCanvas: React.FC<Omit<React.ComponentProps<typeof Canvas>, "children">> = ({ ...props }) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }} {...props}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <TorusParticles />
      </Suspense>
    </Canvas>
  );
}
TorusParticleFlowCanvas.displayName = 'TorusParticleFlowCanvas';

export default TorusParticleFlowCanvas;