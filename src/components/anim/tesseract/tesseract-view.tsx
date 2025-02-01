/*
  Appellation: tesseract-view <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';

export const TesseractAnimation: React.FC = () => {
  const TesseractCanvas = dynamic(() => import('./tesseract-canvas'), {
    ssr: false,
  });

  return (
    <div className="w-full h-full">
      <TesseractCanvas />
    </div>
  );
};
TesseractAnimation.displayName = 'TesseractAnimation';

export default TesseractAnimation;