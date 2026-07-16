import React from 'react';
import { X } from "lucide-react";

export default function PropertySidebar({ selectedLayer, setSelectedLayer, sidebarData, handleSidebarChange }) {
  if (!selectedLayer) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-[500] flex flex-col h-full animate-in slide-in-from-right duration-300">
       <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Thông tin vùng chọn</h3>
          <button onClick={() => setSelectedLayer(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
       </div>
       <div className="p-4 flex-1 overflow-y-auto space-y-4">
         <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4ae6f]/50"
              placeholder="Ví dụ: Khu đất A"
              value={sidebarData.title}
              onChange={(e) => handleSidebarChange('title', e.target.value)}
            />
         </div>
         
         <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Màu viền</label>
              <input 
                type="color" 
                value={sidebarData.color} 
                onChange={(e) => handleSidebarChange('color', e.target.value)}
                className="w-full h-8 cursor-pointer rounded-sm"
              />
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Màu nền</label>
              <input 
                type="color" 
                value={sidebarData.fillColor} 
                onChange={(e) => handleSidebarChange('fillColor', e.target.value)}
                className="w-full h-8 cursor-pointer rounded-sm"
              />
           </div>
         </div>

         <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Độ dày viền: {sidebarData.weight}px</label>
           <input 
             type="range" 
             min="1" max="10" 
             value={sidebarData.weight} 
             onChange={(e) => handleSidebarChange('weight', parseInt(e.target.value))}
             className="w-full"
           />
         </div>

         <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-200 rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-[#d4ae6f]/50 resize-none"
              placeholder="Nhập thông tin chi tiết về khu vực này..."
              value={sidebarData.description}
              onChange={(e) => handleSidebarChange('description', e.target.value)}
            />
         </div>
       </div>
    </div>
  );
}
