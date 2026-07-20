import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ClickEffectMarker({ position }) {
  const meshRef = useRef();
  
  // Hardcoded values instead of Leva controls
  const ringSize = 15;
  const ringThickness = 5;
  const ringColor = '#d4ae6f';
  const animationSpeed = 4;
  const animationIntensity = 0.2;

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * animationSpeed) * animationIntensity;
      meshRef.current.scale.x = scale;
      meshRef.current.scale.y = scale;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[ringSize, ringSize + ringThickness, 32]} />
      <meshBasicMaterial color={ringColor} transparent opacity={0.8} />
    </mesh>
  );
}
