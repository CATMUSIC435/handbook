import { useState } from 'react';

export function useTower3D() {
  const [selectedFloor, setSelectedFloor] = useState(null);

  const cameraControls = {
    camX: 89,
    camY: 106,
    camZ: 2368,
    farPlane: 30000,
  };

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
