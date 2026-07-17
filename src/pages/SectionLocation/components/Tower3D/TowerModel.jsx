import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function TowerModel({ url, onFloorSelect }) {
  const { scene } = useGLTF(url);

  const handleClick = (e) => {
    e.stopPropagation();
    const name = e.object.name || "Khối kiến trúc";
    const yPos = e.point.y;
    const estimatedFloor = Math.max(1, Math.floor((yPos + 30) / 3.5)); 
    
    onFloorSelect({
      point: e.point,
      name: name,
      floor: estimatedFloor,
      y: yPos.toFixed(1)
    });
  };

  return (
    <group onPointerMissed={() => onFloorSelect(null)}>
      <primitive 
        object={scene} 
        scale={1} 
        position={[0, -1, 0]} 
        onClick={handleClick}
      />
    </group>
  );
}

useGLTF.preload('/assets/project-opt.glb');
