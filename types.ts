export enum GameState {
  LOADING_INIT = 'LOADING_INIT',
  START = 'START',
  SETTINGS = 'SETTINGS',
  CONTROLS = 'CONTROLS',
  OPTIONS = 'OPTIONS',
  LOADING_GAME = 'LOADING_GAME',
  PLAYING = 'PLAYING',
  TRANSITION = 'TRANSITION', // Day transition
  PAUSED = 'PAUSED',
  GAMEOVER = 'GAMEOVER',
  VICTORY = 'VICTORY',
  LOADING_RETRY = 'LOADING_RETRY'
}

export enum Difficulty {
  PRACTICE = 'PRACTICE',
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXTREME = 'EXTREME',
  NIGHTMARE = 'NIGHTMARE'
}

export enum Language {
  ENGLISH = 'English',
  GERMAN = 'Deutsch',
  FRENCH = 'Français',
  KOREAN = '한국어',
  JAPANESE = '日本語',
  CZECH = 'Čeština',
  CHINESE = '中文',
  ITALIAN = 'Italiano',
  RUSSIAN = 'Русский',
  VIETNAMESE = 'Tiếng Việt'
}

export enum ItemType {
  MASTER_KEY = 'Master Key',
  PLIERS = 'Pliers',
  MEAT = 'Meat',
  HAMMER = 'Hammer',
  WRENCH = 'Wrench',
  PADLOCK_KEY = 'Padlock Key',
  WEAPON_KEY = 'Weapon Key',
  SHOTGUN = 'Shotgun',
  CROSSBOW = 'Crossbow',
  TEDDY = 'Teddy',
  NONE = 'None'
}

export enum RoomType {
  // Upper Floor (Y=10)
  STARTING_BEDROOM = 'Starting Bedroom',
  BEDROOM_1 = 'Bedroom 1',
  BEDROOM_2 = 'Bedroom 2',
  BEDROOM_3 = 'Bedroom 3',
  NURSERY = 'Nursery',
  BATHROOM = 'Bathroom',
  WALK_IN_CLOSET = 'Walk-In Closet',
  
  // Ground Floor (Y=0)
  LIVING_ROOM = 'Living Room',
  DINING_ROOM = 'Dining Room',
  KITCHEN = 'Kitchen',
  STUDY = 'Study',
  FOYER = 'Foyer',
  
  // Outside (Y=0)
  BACKYARD = 'Backyard',
  
  // Lower Levels (Y=-10)
  BASEMENT = 'Basement',
  GARAGE = 'Garage',
  SECRET_AREA = 'Secret Area',
  SEWER = 'Sewer', // Y=-20
  
  // Attic (Y=20)
  ATTIC = 'Attic', 
  MANNEQUIN_ROOM = 'Mannequin Room',
  BEDROOM_4 = 'Bedroom 4',
  JAIL = 'Jail',
  VENT_TUNNEL = 'Vent Tunnel',
  SPECIAL_ROOM = 'Special Room'
}

export enum HidingSpotType {
  BED = 'Bed',
  WARDROBE = 'Wardrobe',
  CHEST = 'Chest',
  COFFIN = 'Coffin',
  CAR_TRUNK = 'Car Trunk',
  TABLE = 'Table' // Hide under
}

export interface GameSettings {
  music: boolean;
  shadows: boolean;
  epilepsyMode: boolean;
  volume: number;
  scaryTone: boolean;
  tutorial: boolean;
  attractGranny: boolean;
  closeDoors: boolean;
  // New Settings
  language: Language;
  paranoidMode: boolean;
  paradoxMode: boolean;
  creakingIntensity: number; // 0 to 1
}

export interface PlayerState {
  health: number;
  inventory: ItemType[];
  day: number;
  isCrouching: boolean;
  isHidden: boolean; 
  currentRoom: RoomType;
}

export interface ItemSpawn {
  id: string;
  type: ItemType;
  position: [number, number, number]; 
  room: RoomType;
  collected: boolean;
}

export interface HidingSpot {
  id: string;
  type: HidingSpotType;
  position: [number, number, number];
  rotation: number;
  room: RoomType;
}

export interface SpecialProp {
  type: 'MANNEQUIN' | 'JAIL_BARS' | 'VENT_COVER' | 'BOOKSHELF' | 'TABLE_LONG';
  position: [number, number, number];
  rotation: [number, number, number];
  size?: [number, number, number];
}

export interface CreakingZone {
  position: [number, number, number];
  size: [number, number, number]; 
  room: RoomType;
}