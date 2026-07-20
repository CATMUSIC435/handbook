import React, { useState } from 'react';
import { Palette, Download, Upload, Terminal } from "lucide-react";

export default function MapToolbar({
  mapMode,
  showStyleMenu,
  setShowStyleMenu,
  drawStyle,
  handleDrawStyleChange,
  setShowOverpassModal,
  fileInputRef,
  exportGeoJSON,
  exportImage
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  if (mapMode !== "interactive") return null;

  return (
    <div className="hidden md:flex absolute top-4 right-4 sm:top-6 sm:right-6 flex-col sm:flex-row gap-2 z-[400]">
      <div className="relative">
        <button
          onClick={() => setShowStyleMenu(!showStyleMenu)}
          className={`flex items-center gap-2 px-4 py-2 text-slate-700 shadow-lg border border-slate-100 font-medium transition-colors ${showStyleMenu ? 'bg-indigo-50 text-indigo-600' : 'bg-white hover:text-indigo-600'}`}
          title="Tùy chỉnh vẽ"
        >
          <Palette size={16} /> Tùy chỉnh
        </button>
        {showStyleMenu && (
          <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl border border-slate-100 transition-all  overflow-hidden p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Màu viền</label>
                <input 
                  type="color" 
                  value={drawStyle.color} 
                  onChange={(e) => handleDrawStyleChange('color', e.target.value)}
                  className="w-full h-8 cursor-pointer "
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Màu nền</label>
                <input 
                  type="color" 
                  value={drawStyle.fillColor} 
                  onChange={(e) => handleDrawStyleChange('fillColor', e.target.value)}
                  className="w-full h-8 cursor-pointer "
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Độ dày viền: {drawStyle.weight}px</label>
                <input 
                  type="range" 
                  min="1" max="10" 
                  value={drawStyle.weight} 
                  onChange={(e) => handleDrawStyleChange('weight', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => setShowOverpassModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-indigo-600 shadow-lg border border-slate-100 font-medium transition-colors"
        title="Chạy lệnh Overpass Turbo"
      >
        <Terminal size={16} /> Lệnh Overpass
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-indigo-600 shadow-lg border border-slate-100 font-medium transition-colors"
        title="Nhập dữ liệu từ file JSON"
      >
        <Upload size={16} /> Nhập
      </button>
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-[#d4ae6f] text-slate-900 shadow-lg border border-[#d4ae6f] font-medium transition-colors hover:bg-[#c39f61]"
          title="Xuất file"
        >
          <Download size={16} /> Xuất
        </button>
        {showExportMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl border border-slate-100 transition-all  overflow-hidden">
            <button onClick={() => { exportGeoJSON(); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700">Dữ liệu (JSON)</button>
            <button onClick={() => { exportImage(); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 border-t border-slate-100">Hình ảnh (PNG)</button>
          </div>
        )}
      </div>
    </div>
  );
}
