import React from 'react';
import { ItemType, GameState, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface UIOverlayProps {
  day: number;
  inventory: ItemType[];
  currentObjective: string;
  gameState: GameState;
  onItemClick: (item: ItemType) => void;
  showBlood: boolean;
  isCrouching: boolean;
  isRunning: boolean;
  language: Language;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ 
  day, 
  inventory, 
  currentObjective, 
  gameState,
  onItemClick,
  showBlood,
  isCrouching,
  isRunning,
  language
}) => {
  if (gameState !== GameState.PLAYING) return null;

  const t = TRANSLATIONS[language];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10">
      {/* Blood Overlay */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          boxShadow: showBlood ? 'inset 0 0 100px 50px rgba(255,0,0,0.5)' : 'none',
          opacity: showBlood ? 1 : 0
        }}
      />

      {/* Top Bar */}
      <div className="flex justify-between items-start z-10">
        <div className="bg-black/70 p-4 rounded-sm text-red-600 font-scary text-2xl border border-red-900 shadow-lg">
          {t.DAY} {day}
        </div>
        <div className="bg-black/70 p-3 rounded-sm text-white font-sans text-sm border border-gray-700 max-w-xs text-right shadow-lg">
          {t.OBJECTIVE}: <span className="text-yellow-400 font-bold">{currentObjective}</span>
        </div>
      </div>

      {/* Center Reticle - VISIBLE MOUSE CURSOR */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white/60 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-exclusion border border-black/50 shadow-[0_0_5px_white]" />
      <div className="absolute top-1/2 left-1/2 w-8 h-8 border border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Indicators */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-4">
          {isCrouching && (
            <div className="bg-black/50 p-2 rounded border border-gray-500 animate-pulse">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-80">
                    <path d="M12 2a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V6a4 4 0 0 1 4-4z" />
                    <path d="M16 10v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4" />
                    <path d="M6 22l2-4" />
                    <path d="M18 22l-2-4" />
                </svg>
                <div className="text-white text-[10px] text-center mt-1 uppercase font-bold tracking-wider">{t.CROUCH}</div>
            </div>
          )}

          {isRunning && (
            <div className="bg-red-900/50 p-2 rounded border border-red-500 animate-pulse">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-90">
                    <path d="M13 4v6m-2 4L8.5 20M14 13l4-2m-3 9l-4-5m9-11a2 2 0 1 1-2.8 2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                 <div className="text-red-300 text-[10px] text-center mt-1 uppercase font-bold tracking-wider">{t.RUN}</div>
            </div>
          )}
      </div>

      {/* Inventory Bar */}
      <div className="flex justify-center gap-2 mb-4 pointer-events-auto z-10">
        {inventory.length === 0 ? (
          <div className="text-gray-500 text-sm italic bg-black/50 p-2 rounded">Empty Pockets</div>
        ) : (
          inventory.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onItemClick(item)}
              className="bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-600 p-2 rounded w-20 h-20 flex flex-col items-center justify-center text-xs transition-colors shadow-lg group"
            >
              <div className="mb-1 text-2xl group-hover:scale-110 transition-transform">🔧</div>
              <span className="text-center font-bold">{item}</span>
            </button>
          ))
        )}
      </div>

      {/* Controls Hint */}
      <div className="absolute bottom-4 left-4 text-white/40 text-xs z-0 font-mono">
        <span className="bg-white/10 px-1 rounded">WASD</span> {t.RUN} | <span className="bg-white/10 px-1 rounded">R</span> {t.RUN} | <span className="bg-white/10 px-1 rounded">C</span> {t.CROUCH} | <span className="bg-white/10 px-1 rounded">L-CLICK</span> {t.INTERACT}
      </div>
    </div>
  );
};

export default UIOverlay;