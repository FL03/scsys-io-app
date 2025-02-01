/*
  Appellation: torus <module>
  Contrib: @FL03
*/
'use client';
// imports
import dynamic from 'next/dynamic';
import React from 'react';


export const TorusParticleFlow: React.FC = ({ ...props }) => {
  const TorusParticleFlowCanvas = dynamic(async () => await import('./torus-canvas'), {
    ssr: false,
  });
  return <TorusParticleFlowCanvas {...props}/>;
}
TorusParticleFlow.displayName = 'TorusParticleFlow';

export default TorusParticleFlow;