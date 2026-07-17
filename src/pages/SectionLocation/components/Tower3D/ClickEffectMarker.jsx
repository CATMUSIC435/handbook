import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';

export default function ClickEffectMarker({ position }) {
  const meshRef = useRef();
  
  // Debug values via Leva
  const { ringSize, ringThickness, ringColor, animationSpeed, animationIntensity } = useControls('Click Marker', {
    ringSize: { value: 15, min: 1, max: 100, step: 1 },
    ringThickness: { value: 5, min: 1, max: 50, step: 0.5 },
    ringColor: '#d4ae6f',
    animationSpeed: { value: 4, min: 1, max: 20, step: 1 },
    animationIntensity: { value: 0.2, min: 0.05, max: 1, step: 0.05 },
  });

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
