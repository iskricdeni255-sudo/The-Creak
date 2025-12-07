import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameSettings, ItemType, RoomType, ItemSpawn, Difficulty, Language } from './types';
import { MAX_DAYS } from './constants';
import { randomizeItems } from './services/gameLogic';
import { audioService } from './services/audioService';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import LoadingScreen from './components/LoadingScreen';
import { StartScreen, PauseScreen, DayTransition, GameOverScreen, OptionsScreen, ControlsScreen } from './components/Menus';

const DEFAULT_SETTINGS: GameSettings = {
  music: true,
  shadows: true,
  epilepsyMode: false,
  volume: 0.5,
  scaryTone: true,
  tutorial: true,
  attractGranny: true,
  closeDoors: false,
  language: Language.ENGLISH,
  paranoidMode: false,
  paradoxMode: false,
  creakingIntensity: 0.5
};

const App: React.FC = () => {
  // Start with Initial Loading
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING_INIT);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  
  // Game State
  const [day, setDay] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [inventory, setInventory] = useState<ItemType[]>([]);
  const [items, setItems] = useState<ItemSpawn[]>([]);
  const [currentRoom, setCurrentRoom] = useState<RoomType>(RoomType.LIVING_ROOM);
  const [isCrouching, setIsCrouching] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioService.setVolume(settings.volume);
  }, [settings.volume]);

  // Handle Initial Loading Completion
  const handleInitLoadComplete = () => {
    setGameState(GameState.START);
  };

  const startGameSequence = (diff: Difficulty) => {
    setDifficulty(diff);
    // Transition to Game Loading
    setGameState(GameState.LOADING_GAME);
  };

  const handleGameLoadComplete = () => {
    setDay(1);
    setInventory([]);
    setItems(randomizeItems());
    setGameState(GameState.TRANSITION);
    audioService.init();
    if (settings.music) {
       audioService.playAmbience();
    }
  };

  const handleDayComplete = () => {
    setGameState(GameState.PLAYING);
  };

  const handlePause = () => {
    setGameState(GameState.PAUSED);
  };

  const handleResume = () => {
    setGameState(GameState.PLAYING);
  };

  const handleQuit = () => {
      // Go to Retry Loading before Menu
      setGameState(GameState.LOADING_RETRY);
  };

  const handleRetry = () => {
      // Go to Retry Loading before restarting
      setGameState(GameState.LOADING_RETRY);
  };

  // We need specific callbacks for retry vs quit in the render loop
  const [retryTarget, setRetryTarget] = useState<'MENU' | 'GAME'>('MENU');

  const onQuitClick = () => {
      setRetryTarget('MENU');
      setGameState(GameState.LOADING_RETRY);
  }

  const onRetryClick = () => {
      setRetryTarget('GAME');
      setGameState(GameState.LOADING_RETRY);
  }

  const handleRetrySequenceComplete = () => {
      if (retryTarget === 'MENU') {
          setGameState(GameState.START);
      } else {
          // Restart game logic
          setDay(1);
          setInventory([]);
          setItems(randomizeItems());
          setGameState(GameState.TRANSITION);
      }
  }

  const handleCollectItem = useCallback((id: string) => {
    setItems(prev => {
      const newItems = [...prev];
      const item = newItems.find(i => i.id === id);
      if (item && !item.collected) {
        item.collected = true;
        setInventory(inv => [...inv, item.type]);
      }
      return newItems;
    });
  }, []);

  const handleGrannyCatch = useCallback(() => {
    if (day < MAX_DAYS) {
      setDay(d => d + 1);
      setGameState(GameState.TRANSITION);
    } else {
      setGameState(GameState.GAMEOVER);
    }
  }, [day]);

  const handleVictory = () => {
    setGameState(GameState.VICTORY);
  };

  const handleUseItemComplete = () => {
      if (inventory.includes(ItemType.MASTER_KEY)) {
          handleVictory();
      } else {
          console.log("Need Master Key");
      }
      setSelectedItem(null);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-sans select-none cursor-auto">
      
      {/* LOADING SCREENS */}
      {gameState === GameState.LOADING_INIT && (
          <LoadingScreen 
            duration={Math.random() * 5000 + 15000} // 15-20s random
            onComplete={handleInitLoadComplete} 
            text="INITIALIZING SYSTEM"
          />
      )}

      {gameState === GameState.LOADING_GAME && (
          <LoadingScreen 
            duration={10000} // 10s fixed
            onComplete={handleGameLoadComplete} 
            text="ENTERING HOUSE"
          />
      )}

      {gameState === GameState.LOADING_RETRY && (
          <LoadingScreen 
            duration={10000} // 10s fixed
            onComplete={handleRetrySequenceComplete} 
            text={retryTarget === 'GAME' ? "RESTARTING NIGHTMARE" : "RETURNING TO SAFETY"}
          />
      )}

      {/* 3D Layer */}
      {(gameState === GameState.PLAYING || gameState === GameState.PAUSED || gameState === GameState.TRANSITION) && (
        <GameCanvas 
          gameState={gameState}
          settings={settings}
          difficulty={difficulty}
          items={items}
          onCollectItem={handleCollectItem}
          onGrannyCatch={handleGrannyCatch}
          onPause={handlePause}
          setPlayerRoom={setCurrentRoom}
          setPlayerCrouch={setIsCrouching}
          setPlayerRun={setIsRunning}
          useItem={selectedItem}
          onUseItemComplete={handleUseItemComplete}
          onVictory={handleVictory}
        />
      )}

      {/* UI Layer */}
      <UIOverlay 
        day={day}
        inventory={inventory}
        currentObjective={inventory.includes(ItemType.MASTER_KEY) ? "Unlock the Main Door!" : "Find the Master Key"}
        gameState={gameState}
        onItemClick={(item) => setSelectedItem(item.toString())} 
        showBlood={false}
        isCrouching={isCrouching}
        isRunning={isRunning}
        language={settings.language}
      />

      {/* Menu Overlays */}
      {gameState === GameState.START && (
        <StartScreen 
          onStart={startGameSequence} 
          settings={settings} 
          setSettings={setSettings} 
          onOpenOptions={() => setGameState(GameState.OPTIONS)}
          onOpenControls={() => setGameState(GameState.CONTROLS)}
        />
      )}

      {gameState === GameState.OPTIONS && (
        <OptionsScreen 
          settings={settings} 
          setSettings={setSettings} 
          onBack={() => setGameState(GameState.START)} 
        />
      )}

      {gameState === GameState.CONTROLS && (
        <ControlsScreen onBack={() => setGameState(GameState.START)} />
      )}
      
      {gameState === GameState.PAUSED && (
        <PauseScreen onResume={handleResume} onQuit={onQuitClick} />
      )}

      {gameState === GameState.TRANSITION && (
        <DayTransition day={day} onComplete={handleDayComplete} />
      )}

      {(gameState === GameState.GAMEOVER || gameState === GameState.VICTORY) && (
        <GameOverScreen 
          won={gameState === GameState.VICTORY} 
          onRetry={onRetryClick} 
          onQuit={onQuitClick} 
        />
      )}
    </div>
  );
};

export default App;