import { useState } from 'react';
import { useControls } from 'leva';

export function useTower3D() {
  const [selectedFloor, setSelectedFloor] = useState(null);

  const cameraControls = useControls('Camera', {
    camX: { value: 1000, min: 100, max: 5000, step: 100 },
    camY: { value: 800, min: 100, max: 5000, step: 100 },
    camZ: { value: 1500, min: 100, max: 5000, step: 100 },
    farPlane: { value: 30000, min: 5000, max: 100000, step: 1000 },
  });

  const handleFloorSelect = (floorData) => {
    setSelectedFloor(floorData);
  };

  const handleCloseSideSheet = () => {
    setSelectedFloor(null);
  };

  return {
    selectedFloor,
    cameraControls,
    handleFloorSelect,
    handleCloseSideSheet
  };
}
