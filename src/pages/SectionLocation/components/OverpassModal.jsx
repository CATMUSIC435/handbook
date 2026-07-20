import React from 'react';
import { Terminal, X, Loader2 } from "lucide-react";

export default function OverpassModal({
  showOverpassModal,
  setShowOverpassModal,
  overpassQuery,
  setOverpassQuery,
  isOverpassLoading,
  handleRunOverpassQuery
}) {
  if (!showOverpassModal) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl mx-4  shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Terminal className="text-indigo-600" />
            Chạy lệnh Overpass Turbo
          </h2>
          <button onClick={() => setShowOverpassModal(false)} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 flex-1">
          <p className="text-sm text-slate-600 mb-2">Dán mã lệnh Overpass Query của bạn vào đây (nhớ kèm theo [out:json]):</p>
          <textarea
            className="w-full h-64 p-3 border border-slate-200  text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            placeholder="[out:json];&#10;node(10.8,106.7,10.9,106.8);&#10;out;"
            value={overpassQuery}
            onChange={(e) => setOverpassQuery(e.target.value)}
          />
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={() => setShowOverpassModal(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200  transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleRunOverpassQuery}
            disabled={isOverpassLoading || !overpassQuery.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium  transition-colors disabled:opacity-50"
          >
            {isOverpassLoading ? <Loader2 size={16} className="animate-spin" /> : <Terminal size={16} />}
            Chạy lệnh
          </button>
        </div>
      </div>
    </div>
  );
}
