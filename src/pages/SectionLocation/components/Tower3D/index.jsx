import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { Leva } from 'leva';

import { useTower3D } from './useTower3D';
import TowerModel from './TowerModel';
import ClickEffectMarker from './ClickEffectMarker';
import UnitHotspot3D from './UnitHotspot3D';
import TowerSideSheet from './TowerSideSheet';

import { mockFloors } from './data';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-rose-50 text-rose-600 p-4">
          <div className="max-w-md bg-white p-6 rounded-xl shadow-xl">
            <AlertTriangle size={32} className="mb-4" />
            <h2 className="font-bold text-lg mb-2">Canvas Crash:</h2>
            <pre className="text-xs overflow-auto bg-slate-100 p-2 rounded">{this.state.error?.toString()}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Tower3DViewer() {
  const { selectedFloor, cameraControls, handleFloorSelect, handleCloseSideSheet } = useTower3D();
  const { camX, camY, camZ, farPlane } = cameraControls;

  const isApartmentClicked = selectedFloor && mockFloors[0].units.some(u => u.code === selectedFloor.name);

  return (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center relative overflow-hidden cursor-move">
      <div className="absolute top-4 left-4 z-[500] hidden md:block">
        <Leva hidden theme={{ colors: { accent1: '#d4ae6f', accent2: '#d4ae6f' } }} />
      </div>
      <ErrorBoundary>
        <Canvas 
          camera={{ position: [camX, camY, camZ], fov: 45, near: 1, far: farPlane }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={['#f8fafc']} />
          
          {/* Lights */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-10, 10, -5]} intensity={1} color="#d4ae6f" />
          
          <Suspense fallback={null}>
            <Center>
              <TowerModel url="/assets/project-opt.glb" onFloorSelect={handleFloorSelect} />
            </Center>
            
            {selectedFloor && <ClickEffectMarker position={selectedFloor.point} />}
            <UnitHotspot3D selectedFloor={selectedFloor} />
            
            <Environment preset="city" />
          </Suspense>

          {/* Controls */}
          <OrbitControls 
            target={[0, 0, 0]}
            makeDefault
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
            maxDistance={10000}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={0} 
          />
        </Canvas>
      </ErrorBoundary>

      <div className={`absolute top-4 transition-all duration-500 ${selectedFloor ? 'right-4 md:right-[26rem]' : 'right-4'} bg-white/90 backdrop-blur px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-sm text-xs md:text-sm font-medium text-slate-700 z-[300]`}>
        Cuộn để thu phóng • Kéo để xoay
      </div>

      {/* Side Sheet */}
      <AnimatePresence>
        {selectedFloor && (
          <TowerSideSheet selectedFloor={selectedFloor} onClose={handleCloseSideSheet} />
        )}
      </AnimatePresence>
    </div>
  );
}
