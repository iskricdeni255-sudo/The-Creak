import React, { useState } from 'react';
import { GameSettings, Difficulty, GameState, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MenuProps {
  onStart: (difficulty: Difficulty) => void;
  settings: GameSettings;
  setSettings: (s: GameSettings) => void;
  onOpenOptions: () => void;
  onOpenControls: () => void;
}

export const StartScreen: React.FC<MenuProps> = ({ onStart, settings, setSettings, onOpenOptions, onOpenControls }) => {
  const [showPlaySection, setShowPlaySection] = useState(false);
  const [hoveredDiff, setHoveredDiff] = useState<Difficulty | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const t = TRANSLATIONS[settings.language];

  const getDifficultyNote = (diff: Difficulty | null) => {
      switch(diff) {
          case Difficulty.PRACTICE: return "Note: The house is free of danger. Granny is gone.";
          case Difficulty.EASY: return "Note: Granny moves slowly. Creaking floors are silent.";
          case Difficulty.MEDIUM: return "Note: Standard horror. Don't let her hear you.";
          case Difficulty.HARD: return "Note: Granny is faster. Locks are more complex.";
          case Difficulty.EXTREME: return "Note: Faster than you. Two extra locks on the main door.";
          case Difficulty.NIGHTMARE: return "Note: Total darkness. One life. No mercy. Good luck.";
          default: return "Note: Select a difficulty to see details.";
      }
  };

  if (showPrivacy) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-black text-gray-300 font-mono p-12 overflow-y-auto">
              <h2 className="text-3xl text-red-600 mb-8 font-bold">PRIVACY POLICY</h2>
              <div className="max-w-3xl text-xs space-y-4">
                  <p>We do not collect any personal data. This is a simulation game.</p>
                  <p>All data is stored locally on your device.</p>
              </div>
              <button onClick={() => setShowPrivacy(false)} className="mt-8 px-6 py-2 border border-white hover:bg-white hover:text-black">BACK</button>
          </div>
      );
  }

  if (showContact) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-black text-gray-300 font-mono p-12">
              <h2 className="text-3xl text-red-600 mb-8 font-bold">CONTACT US</h2>
              <div className="text-center">
                  <p>support@thecreakgame.com</p>
                  <p>Follow us on Social Media</p>
              </div>
              <button onClick={() => setShowContact(false)} className="mt-8 px-6 py-2 border border-white hover:bg-white hover:text-black">BACK</button>
          </div>
      );
  }

  if (showPlaySection) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-red-600 font-sans bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover bg-blend-multiply overflow-y-auto">
        <div className="bg-black/95 p-8 rounded-lg border border-red-900 w-full max-w-5xl flex flex-col items-center shadow-2xl relative">
            <h2 className="text-6xl font-scary mb-8 text-red-600 drop-shadow-md">{t.PLAY}</h2>
            
            <div className="grid grid-cols-2 gap-12 w-full">
                {/* Left: Difficulties */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-2xl text-gray-300 mb-2 font-bold border-b border-gray-700 pb-2">{t.DIFFICULTY}</h3>
                    {[
                        { d: Difficulty.PRACTICE, label: 'PRACTICE' },
                        { d: Difficulty.EASY, label: 'EASY' },
                        { d: Difficulty.MEDIUM, label: 'MEDIUM' },
                        { d: Difficulty.HARD, label: 'HARD' },
                        { d: Difficulty.EXTREME, label: 'EXTREME' },
                        { d: Difficulty.NIGHTMARE, label: 'NIGHTMARE' },
                    ].map((item) => (
                        <button 
                            key={item.d}
                            onClick={() => onStart(item.d)}
                            onMouseEnter={() => setHoveredDiff(item.d)}
                            onMouseLeave={() => setHoveredDiff(null)}
                            className={`p-4 border transition text-left group hover:bg-red-900/40 relative overflow-hidden ${item.d === Difficulty.NIGHTMARE ? 'border-red-600 text-red-500 bg-red-900/10' : 'border-gray-700 text-gray-300 bg-gray-900/50'}`}
                        >
                            <div className="font-scary text-xl group-hover:text-white z-10 relative tracking-widest">{item.label}</div>
                        </button>
                    ))}
                    
                    <div className="mt-4 p-4 border border-yellow-900/50 bg-yellow-900/10 text-yellow-500 font-mono text-sm h-16 flex items-center">
                        {getDifficultyNote(hoveredDiff)}
                    </div>
                </div>

                {/* Right: Quick Settings */}
                <div className="flex flex-col gap-6">
                     <h3 className="text-2xl text-gray-300 mb-2 font-bold border-b border-gray-700 pb-2">MODIFIERS</h3>
                     
                     <label className="flex items-center justify-between text-gray-300 cursor-pointer hover:text-white group">
                        <span className="font-bold">Paranoid Mode</span>
                        <input type="checkbox" checked={settings.paranoidMode} onChange={e => setSettings({...settings, paranoidMode: e.target.checked})} className="w-6 h-6 accent-red-600 cursor-pointer"/>
                     </label>
                     <p className="text-xs text-gray-500 -mt-4">Hear things that aren't there.</p>

                     <label className="flex items-center justify-between text-gray-300 cursor-pointer hover:text-white group">
                        <span className="font-bold">Paradox Mode</span>
                        <input type="checkbox" checked={settings.paradoxMode} onChange={e => setSettings({...settings, paradoxMode: e.target.checked})} className="w-6 h-6 accent-red-600 cursor-pointer"/>
                     </label>
                     <p className="text-xs text-gray-500 -mt-4">Reality is unstable.</p>

                     <div className="flex flex-col gap-2">
                        <span className="text-gray-300 font-bold">Creaking Intensity</span>
                        <input type="range" min="0" max="1" step="0.1" value={settings.creakingIntensity} onChange={e => setSettings({...settings, creakingIntensity: parseFloat(e.target.value)})} className="w-full accent-red-600 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                     </div>
                </div>
            </div>

            <button 
                onClick={() => setShowPlaySection(false)}
                className="mt-12 px-12 py-4 border-2 border-red-800 text-red-600 font-scary text-2xl hover:bg-red-900 hover:text-white transition shadow-[0_0_15px_rgba(255,0,0,0.3)]"
            >
                {t.LEAVE}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-red-600 font-sans bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover bg-blend-multiply">
      <div className="absolute top-6 left-6 text-gray-400 text-sm bg-black/80 p-6 rounded-lg max-w-sm text-left border border-gray-800 shadow-lg backdrop-blur-sm z-50">
        <h3 className="font-bold text-white mb-2 text-lg">CHANGELOG v1.9.11.04</h3>
        <ul className="list-disc pl-4 space-y-1 text-xs text-gray-300 font-mono">
            <li>Title changed to "The Creak".</li>
            <li>Added Language Support (10 Languages).</li>
            <li>Added Privacy & Contact Info.</li>
            <li>Cleared Furniture & Fixed Item Positions.</li>
            <li>Added Flashlight & Removed 'I' Key Interaction.</li>
            <li>New Modes: Paranoid, Paradox.</li>
            <li>Creaking Intensity Slider.</li>
        </ul>
      </div>

      <div className="absolute top-6 right-6 flex flex-col items-end gap-2 z-50">
          <select 
            value={settings.language} 
            onChange={(e) => setSettings({...settings, language: e.target.value as Language})}
            className="bg-black/80 text-white border border-gray-600 p-2 rounded cursor-pointer hover:bg-gray-800"
          >
              {Object.values(Language).map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
              ))}
          </select>
          <button className="bg-yellow-600/90 text-black font-bold px-4 py-2 rounded hover:bg-yellow-500 shadow-lg border border-yellow-400">
              {t.NO_ADS}
          </button>
      </div>

      <h1 className="text-9xl font-scary mb-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] text-red-700 tracking-wider animate-pulse" style={{ textShadow: '0 0 30px rgba(150,0,0,0.8)' }}>THE CREAK</h1>
      <h3 className="text-4xl mb-20 text-gray-300 tracking-[0.5em] font-light uppercase border-b border-red-900 pb-2">The Escape</h3>
      
      <div className="flex flex-col gap-4 w-80 z-40">
        <button 
          onClick={() => setShowPlaySection(true)}
          className="px-8 py-4 text-3xl font-scary border-2 border-red-700 bg-black/70 hover:bg-red-900/80 hover:text-white hover:scale-105 transition duration-200 text-red-500 shadow-lg"
        >
          {t.PLAY}
        </button>
        <button 
          onClick={onOpenOptions}
          className="px-8 py-3 text-xl font-bold border border-gray-600 bg-black/60 text-gray-400 hover:bg-gray-800 hover:text-white transition uppercase"
        >
          {t.OPTIONS}
        </button>
        <button 
          onClick={onOpenControls}
          className="px-8 py-3 text-xl font-bold border border-gray-600 bg-black/60 text-gray-400 hover:bg-gray-800 hover:text-white transition uppercase"
        >
            {t.CONTROLS}
        </button>
      </div>
      
      <div className="absolute bottom-4 flex gap-6 text-gray-500 text-xs z-40">
          <button onClick={() => setShowPrivacy(true)} className="hover:text-white">{t.PRIVACY}</button>
          <span>|</span>
          <button onClick={() => setShowContact(true)} className="hover:text-white">{t.CONTACT}</button>
      </div>
      
      <div className="absolute bottom-1 right-4 text-gray-800 text-[10px]">Dvloper Clone v1.9.11.04</div>
    </div>
  );
};

export const ControlsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [tab, setTab] = useState<'PC' | 'MOBILE' | 'CONSOLE'>('PC');

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black/95 text-gray-200 font-sans z-50">
            <h2 className="text-5xl font-scary text-red-600 mb-8">CONTROLS</h2>
            
            <div className="flex gap-4 mb-8">
                {['PC', 'MOBILE', 'CONSOLE'].map(t => (
                    <button 
                        key={t}
                        onClick={() => setTab(t as any)}
                        className={`px-6 py-2 border ${tab === t ? 'border-red-600 bg-red-900/30 text-white' : 'border-gray-700 text-gray-500 hover:text-gray-300'} font-bold transition`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="bg-gray-900/50 p-8 rounded border border-gray-700 w-[700px] h-[450px]">
                {tab === 'PC' && (
                    <div className="grid grid-cols-2 gap-y-4 text-lg">
                        <div className="text-gray-400">Move</div><div className="font-bold text-white">W, A, S, D</div>
                        <div className="text-gray-400">Pickup Item</div><div className="font-bold text-white">Left Click</div>
                        <div className="text-gray-400">Run</div><div className="font-bold text-white">Right Click or 'R'</div>
                        <div className="text-gray-400">Crouch (Toggle)</div><div className="font-bold text-white">'C'</div>
                        <div className="text-gray-400">Drop Item</div><div className="font-bold text-white">'Q' or 'G'</div>
                        <div className="text-gray-400">Inventory</div><div className="font-bold text-white">Mouse UI</div>
                    </div>
                )}
                {tab === 'MOBILE' && (
                    <div className="text-center text-gray-400 mt-12">
                        <p>Virtual Joystick on Left.</p>
                        <p className="mt-4">Tap screen center to Interact.</p>
                        <p className="mt-4">Tap 'Run' Icon to sprint.</p>
                        <p className="mt-4">Tap 'Crouch' icon to toggle stealth.</p>
                    </div>
                )}
                {tab === 'CONSOLE' && (
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-blue-400 font-bold mb-4 border-b border-blue-900">PlayStation</h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <span className="text-gray-400">Move</span><span>L-Stick</span>
                                <span className="text-gray-400">Interact</span><span>X</span>
                                <span className="text-gray-400">Run</span><span>R1 / R2</span>
                                <span className="text-gray-400">Crouch</span><span>Circle</span>
                                <span className="text-gray-400">Drop</span><span>Triangle</span>
                                <span className="text-gray-400">Action</span><span>Square</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-green-400 font-bold mb-4 border-b border-green-900">Xbox</h3>
                             <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <span className="text-gray-400">Move</span><span>L-Stick</span>
                                <span className="text-gray-400">Interact</span><span>A</span>
                                <span className="text-gray-400">Run</span><span>RB / RT</span>
                                <span className="text-gray-400">Crouch</span><span>B</span>
                                <span className="text-gray-400">Drop</span><span>Y</span>
                                <span className="text-gray-400">Action</span><span>X</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button onClick={onBack} className="mt-8 px-10 py-3 border border-white hover:bg-white hover:text-black transition font-bold tracking-widest">BACK</button>
        </div>
    );
}

export const OptionsScreen: React.FC<{ settings: GameSettings, setSettings: (s: GameSettings) => void, onBack: () => void }> = ({ settings, setSettings, onBack }) => {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-gray-200 font-mono">
        <h2 className="text-4xl mb-8 text-red-600 font-scary">OPTIONS</h2>
        <div className="bg-black/80 p-8 border border-gray-700 w-96 space-y-6">
            <label className="flex items-center justify-between cursor-pointer">
                <span>Attract Granny</span>
                <input 
                    type="checkbox" 
                    checked={settings.attractGranny} 
                    onChange={e => setSettings({...settings, attractGranny: e.target.checked})} 
                    className="w-6 h-6 accent-red-600"
                />
            </label>
            <div className="text-xs text-gray-500 -mt-4">If On, Granny hears dropped items.</div>

            <label className="flex items-center justify-between cursor-pointer">
                <span>Close Door</span>
                <input 
                    type="checkbox" 
                    checked={settings.closeDoors} 
                    onChange={e => setSettings({...settings, closeDoors: e.target.checked})} 
                    className="w-6 h-6 accent-red-600"
                />
            </label>
            <div className="text-xs text-gray-500 -mt-4">Doors automatically close behind you.</div>
            
            <div className="h-px bg-gray-700 my-4"></div>

            <label className="flex items-center justify-between cursor-pointer">
                <span>Epilepsy Mode</span>
                <input 
                    type="checkbox" 
                    checked={settings.epilepsyMode} 
                    onChange={e => setSettings({...settings, epilepsyMode: e.target.checked})} 
                    className="w-6 h-6 accent-red-600"
                />
            </label>
        </div>
        <button onClick={onBack} className="mt-8 px-8 py-2 border border-white hover:bg-white hover:text-black transition">BACK</button>
      </div>
    );
};

export const PauseScreen: React.FC<{ onResume: () => void, onQuit: () => void }> = ({ onResume, onQuit }) => (
  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-50">
    <h2 className="text-7xl mb-12 font-scary text-red-600 drop-shadow-lg">PAUSED</h2>
    <div className="flex flex-col gap-6 w-72">
        <button onClick={onResume} className="px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition font-bold text-xl">RESUME</button>
        <button onClick={onQuit} className="px-8 py-4 border-2 border-red-900 text-red-500 hover:bg-red-900 hover:text-white transition font-bold text-xl">QUIT TO MENU</button>
    </div>
  </div>
);

export const DayTransition: React.FC<{ day: number, onComplete: () => void }> = ({ day, onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center z-50 animate-fade-in">
      <h1 className="text-9xl text-red-600 font-scary tracking-[0.2em] border-b-4 border-red-900 pb-8 animate-pulse">DAY {day}</h1>
    </div>
  );
};

export const GameOverScreen: React.FC<{ won: boolean, onRetry: () => void, onQuit: () => void }> = ({ won, onRetry, onQuit }) => (
  <div className={`absolute inset-0 flex flex-col items-center justify-center z-50 ${won ? 'bg-white/90 text-black' : 'bg-black text-red-600'}`}>
    <h1 className="text-8xl font-scary mb-6 drop-shadow-xl">{won ? 'ESCAPED!' : 'GAME OVER'}</h1>
    <p className="text-3xl mb-12 font-serif italic max-w-xl text-center">{won ? 'You ran away safely.' : 'Granny caught you. You will not leave this house.'}</p>
    
    <div className="flex gap-6">
      <button onClick={onRetry} className="px-10 py-4 border-4 border-current hover:bg-gray-200 hover:text-black font-bold text-xl uppercase tracking-widest">Try Again</button>
      <button onClick={onQuit} className="px-10 py-4 border-4 border-current hover:bg-gray-200 hover:text-black text-xl uppercase tracking-widest">Main Menu</button>
    </div>
  </div>
);