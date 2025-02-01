/*
  Appellation: tesseract-canvas <module>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import { Tesseract } from './tesseract';

export const TesseractCanvas: React.FC<Omit<React.ComponentProps<typeof Canvas>, "children">> = ({ ...props }) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }} {...props}>
      <React.Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Tesseract />
      </React.Suspense>
    </Canvas>
  );
}
TesseractCanvas.displayName = 'TesseractCanvas';

export default TesseractCanvas;