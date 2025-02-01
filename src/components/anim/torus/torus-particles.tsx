/*
  Appellation: torus-particles <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const PARTICLE_COUNT = 1000; // Reduced from 2000
const TORUS_RADIUS = 3.75;
const TUBE_RADIUS = 1.5;

export const TorusParticles: React.FC = () => {
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const dummy = React.useMemo(() => new THREE.Object3D(), []);

  const particles = React.useMemo(() => {
    const temp = [];
    const colorArray = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random() * Math.PI * 2;
      const p = Math.random() * Math.PI * 2;
      const radius = TUBE_RADIUS * (0.5 + Math.random() * 0.5);

      // Assign a color to each particle
      const color = new THREE.Color();
      color.setRGB(Math.random(), 1, 0.5 + Math.random() * 0.3, 'srgb-linear'); //(Math.random(), 0.8, 0.5 + Math.random() * 0.3);
      colorArray[i * 3] = 219;
      colorArray[i * 3 + 1] = 34 // color.g;
      colorArray[i * 3 + 2] = 24 //color.b;

      temp.push({
        t,
        p,
        radius,
        speed: Math.random() * 0.002 + 0.001,
        swirl: Math.random() * 0.002 + 0.001,
      });
    }
    return { particles: temp, colors: colorArray };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      particles.particles.forEach((particle, i) => {
        particle.t += particle.speed;
        particle.p += particle.swirl;

        // Gradually move particles from inner to outer radius
        particle.radius += 0.0001;
        if (particle.radius > TUBE_RADIUS) {
          particle.radius = TUBE_RADIUS * 0.5;
        }

        const x =
          (TORUS_RADIUS + particle.radius * Math.cos(particle.p)) *
          Math.cos(particle.t);
        const y =
          (TORUS_RADIUS + particle.radius * Math.cos(particle.p)) *
          Math.sin(particle.t);
        const z = particle.radius * Math.sin(particle.p);

        dummy.position.set(x, y, z);
        dummy.scale.setScalar(0.5 + (particle.radius / TUBE_RADIUS) * 0.5);
        dummy.updateMatrix();
        meshRef.current?.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial vertexColors />
      <bufferAttribute
        attach="geometry-attributes-color"
        args={[particles.colors, 3]}
      />
    </instancedMesh>
  );
}

export default TorusParticles;