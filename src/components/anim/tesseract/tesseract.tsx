import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 4D coordinates of a tesseract
const tesseractVertices = [
  [-1, -1, -1, -1],
  [1, -1, -1, -1],
  [1, 1, -1, -1],
  [-1, 1, -1, -1],
  [-1, -1, 1, -1],
  [1, -1, 1, -1],
  [1, 1, 1, -1],
  [-1, 1, 1, -1],
  [-1, -1, -1, 1],
  [1, -1, -1, 1],
  [1, 1, -1, 1],
  [-1, 1, -1, 1],
  [-1, -1, 1, 1],
  [1, -1, 1, 1],
  [1, 1, 1, 1],
  [-1, 1, 1, 1],
];

// Edges of the tesseract
const edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 8],
  [12, 13],
  [13, 14],
  [14, 15],
  [15, 12],
  [8, 12],
  [9, 13],
  [10, 14],
  [11, 15],
  [0, 8],
  [1, 9],
  [2, 10],
  [3, 11],
  [4, 12],
  [5, 13],
  [6, 14],
  [7, 15],
];

function rotatePoint4D(
  point: number[],
  angle1: number,
  angle2: number,
  angle3: number
): number[] {
  const [x, y, z, w] = point;

  // Rotation in XY plane
  const x1 = x * Math.cos(angle1) - y * Math.sin(angle1);
  const y1 = x * Math.sin(angle1) + y * Math.cos(angle1);

  // Rotation in XZ plane
  const x2 = x1 * Math.cos(angle2) - z * Math.sin(angle2);
  const z1 = x1 * Math.sin(angle2) + z * Math.cos(angle2);

  // Rotation in XW plane
  const x3 = x2 * Math.cos(angle3) - w * Math.sin(angle3);
  const w1 = x2 * Math.sin(angle3) + w * Math.cos(angle3);

  return [x3, y1, z1, w1];
}

function projectTo3D(point: number[]): THREE.Vector3 {
  const [x, y, z, w] = point;
  const factor = 1 / (3 - w); // Changed from 4 to 3 to make it bigger
  return new THREE.Vector3(x * factor, y * factor, z * factor);
}

export const Tesseract: React.FC = () => {
  const lineRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(tesseractVertices.length * 3);
    const colors = new Float32Array(tesseractVertices.length * 3);
    tesseractVertices.forEach((vertex, i) => {
      const projected = projectTo3D(vertex);
      positions[i * 3] = projected.x;
      positions[i * 3 + 1] = projected.y;
      positions[i * 3 + 2] = projected.z;

      // Assign a unique color to each vertex
      colors[i * 3] = Math.sin(i * 0.1) * 0.5 + 0.5;
      colors[i * 3 + 1] = Math.sin(i * 0.2) * 0.5 + 0.5;
      colors[i * 3 + 2] = Math.sin(i * 0.3) * 0.5 + 0.5;
    });
    return { positions, colors };
  }, []);

  const edgeColors = useMemo(() => {
    const colors = new Float32Array(edges.length * 6);
    edges.forEach((edge, i) => {
      const color1 = new THREE.Color().setHSL(i / edges.length, 1, 0.5);
      const color2 = new THREE.Color().setHSL((i + 1) / edges.length, 1, 0.5);
      colors[i * 6] = color1.r;
      colors[i * 6 + 1] = color1.g;
      colors[i * 6 + 2] = color1.b;
      colors[i * 6 + 3] = color2.r;
      colors[i * 6 + 4] = color2.g;
      colors[i * 6 + 5] = color2.b;
    });
    return colors;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const rotatedVertices = tesseractVertices.map((vertex) =>
      rotatePoint4D(vertex, t * 0.3, t * 0.2, t * 0.1)
    );

    if (lineRef.current && pointsRef.current) {
      const linePositions = lineRef.current.geometry.attributes.position
        .array as Float32Array;
      const pointPositions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;

      rotatedVertices.forEach((vertex, i) => {
        const projected = projectTo3D(vertex);
        pointPositions[i * 3] = projected.x;
        pointPositions[i * 3 + 1] = projected.y;
        pointPositions[i * 3 + 2] = projected.z;
      });

      edges.forEach((edge, i) => {
        const start = projectTo3D(rotatedVertices[edge[0]]);
        const end = projectTo3D(rotatedVertices[edge[1]]);
        linePositions[i * 6] = start.x;
        linePositions[i * 6 + 1] = start.y;
        linePositions[i * 6 + 2] = start.z;
        linePositions[i * 6 + 3] = end.x;
        linePositions[i * 6 + 4] = end.y;
        linePositions[i * 6 + 5] = end.z;
      });

      lineRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group scale={[2, 2, 2]}>
      {' '}
      {/* Scaled up the entire group */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[positions, 3]}
            attach="attributes-position"
            count={positions.length / 3}
          />
          <bufferAttribute
            args={[positions, 3]}
            attach="attributes-color"
            count={colors.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.15} vertexColors /> {/* Increased point size */}
      </points>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            args={[new Float32Array(edges.length * 6), 3]}
            attach="attributes-position"
            count={edges.length * 2}
          />
          <bufferAttribute
            args={[edgeColors, 3]}
            attach="attributes-color"
            count={edgeColors.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial vertexColors linewidth={2} />{' '}
        {/* Increased line width */}
      </lineSegments>
    </group>
  );
}
Tesseract.displayName = 'Tesseract';

export default Tesseract;
