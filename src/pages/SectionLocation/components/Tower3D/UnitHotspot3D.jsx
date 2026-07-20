import React from 'react';
import { Html } from '@react-three/drei';
import { translateDirection, translateView, mockFloors } from './data';

export default function UnitHotspot3D({ selectedFloor }) {
  if (!selectedFloor) return null;

  let unitData = mockFloors[0].units.find(u => u.code === selectedFloor.name);
  if (!unitData) {
    const index = Math.abs(Math.floor((selectedFloor.point.x + selectedFloor.point.z) * 10)) % mockFloors[0].units.length;
    unitData = mockFloors[0].units[index];
  }

  return (
    <Html position={selectedFloor.point} zIndexRange={[100, 0]} distanceFactor={600} center>
      <div className="bg-white w-[260px]  shadow-2xl border border-slate-200 overflow-hidden origin-bottom animate-in fade-in zoom-in duration-200 -mt-[320px]">
        <div className="h-36 bg-slate-100 relative">
          <img 
            src={unitData.room3dImage} 
            alt={`Mặt bằng 3D ${unitData.type}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
            }}
          />

        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-slate-900 text-base">{unitData.type}</h4>
            <span className={`text-[9px] font-bold px-1.5 py-0.5  uppercase tracking-wider ${
              unitData.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
              unitData.status === 'sold' ? 'bg-rose-100 text-rose-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {unitData.status === 'available' ? 'Mở bán' : unitData.status === 'sold' ? 'Đã bán' : 'Booking'}
            </span>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Tim tường</span>
                <span className="font-bold text-slate-700">{unitData.builtUpArea} m²</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Thông thủy</span>
                <span className="font-bold text-slate-700">{unitData.carpetArea} m²</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Hướng</span>
                <span className="font-bold text-slate-700">{translateDirection(unitData.direction)}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">View</span>
                <span className="font-bold text-slate-700">{translateView(unitData.view)}</span>
              </div>
            </div>
          </div>
          

        </div>
        {/* Triangle pointer */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-slate-200"></div>
      </div>
    </Html>
  );
}
