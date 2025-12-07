import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  duration: number; // ms
  onComplete: () => void;
  text?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ duration, onComplete, text = "LOADING" }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    
    const animate = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, onComplete]);

  return (
    <div className="absolute inset-0 bg-black z-[100] flex flex-col items-center justify-center select-none cursor-none">
       {/* Removed Image, only Black */}
       <div className="z-10 flex flex-col items-center">
         <h1 className="text-6xl font-scary text-red-600 mb-4 tracking-widest animate-pulse">{text}</h1>
         
         <div className="w-96 h-2 bg-gray-900 border border-gray-700 rounded-full overflow-hidden relative">
            <div 
                className="h-full bg-red-800 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
            />
         </div>
         
         <div className="mt-4 font-mono text-gray-400 text-xl">
            {Math.floor(progress)}%
         </div>

         {progress > 80 && (
            <div className="mt-8 text-xs text-gray-600 font-sans tracking-widest animate-bounce">
                PREPARING ENVIRONMENT...
            </div>
         )}
       </div>
    </div>
  );
};

export default LoadingScreen;