'use client';

import type React from 'react';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { cn } from '@/utils';
import * as THREE from 'three';

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null!);
  const particleCount = 2500;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const distance = Math.random() * 2 + 1;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      positions[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = distance * Math.cos(theta);

      color.setHSL(0.6, 0.8, Math.random() * 0.3 + 0.7);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        const distance = Math.sqrt(x * x + y * y + z * z);

        if (distance < 0.1) {
          // Reset particle to the edge when it gets too close to the center
          const theta = THREE.MathUtils.randFloatSpread(360);
          const phi = THREE.MathUtils.randFloatSpread(360);
          positions[i3] = 2 * Math.sin(theta) * Math.cos(phi);
          positions[i3 + 1] = 2 * Math.sin(theta) * Math.sin(phi);
          positions[i3 + 2] = 2 * Math.cos(theta);
        } else {
          // Move particle towards the center
          // Reduce the speed factor to slow down the particles
          const speed = 0.05 / (distance * distance); // Adjusted speed calculation
          positions[i3] -= x * speed * delta;
          positions[i3 + 1] -= y * speed * delta;
          positions[i3 + 2] -= z * speed * delta;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y += delta * 0.02; // Slowed down the overall rotation
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

export const BlackHoleAnimation: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  return (
    <div className={cn("fixed inset-0 w-full h-full bg-black", className)} {...props}>
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default BlackHoleAnimation;
