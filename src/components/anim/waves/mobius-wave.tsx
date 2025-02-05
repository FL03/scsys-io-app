'use client';
// imports
import * as React from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { cn } from '@/utils';

export const MobiusWave: React.FC = () => {
  const points = React.useRef<THREE.Points>(null);

  // Create particles
  const particlesCount = 7500;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const angle = (i / particlesCount) * Math.PI * 2;
      const radius = THREE.MathUtils.randFloat(1, 3.5);
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [particlesCount]);

  // Custom shader material
  const shaderMaterial = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#0891b2') }, // Teal color
      },
      vertexShader: `
        uniform float uTime;
        
        void main() {
          vec3 pos = position;
          
          // Calculate base angle and radius
          float angle = atan(pos.x, pos.z);
          float radius = length(pos.xz);
          
          // Möbius strip transformation
          float twist = angle + radius * sin(uTime * 0.5);
          float mX = radius * cos(twist);
          float mY = radius * sin(twist) * cos(angle * 0.5);
          float mZ = radius * sin(twist) * sin(angle * 0.5);
          
          // Apply wave deformation
          float wave = sin(angle * 4.0 + uTime * 2.0) * 0.3;
          mY += wave * sin(radius - uTime * 3.0);
          
          // Additional motion
          mY += sin(uTime + radius * 2.0) * 0.1;
          
          pos = vec3(mX, mY, mZ);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Smaller particles with distance-based size variation
          gl_PointSize = (200.0 / -mvPosition.z) * (0.3 + 0.2 * sin(angle * 2.0 + uTime));
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.3, 0.4, dist);
          
          gl_FragColor = vec4(uColor, alpha * 0.6);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0005;
      shaderMaterial.uniforms.uTime.value = state.clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
          count={particlesCount}
        />
      </bufferGeometry>
      <primitive object={shaderMaterial} attach="material" />
    </points>
  );
}
MobiusWave.displayName = 'MobiusWave';

export const MobiusWaveCanvas: React.FC<Omit<React.ComponentProps<typeof Canvas>, "children">> = ({
  className,
  ...props
}) => {
  return (
    <React.Suspense fallback={null}>
      <Canvas
        className={cn("h-full w-full", className)}
        camera={{
          position: [0, 2, 6],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        {...props}
      >
        <color attach="background" args={['#000000']} />
        <MobiusWave />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </React.Suspense>
  );
};
MobiusWaveCanvas.displayName = 'MobiusWaveCanvas';

export default MobiusWaveCanvas;
