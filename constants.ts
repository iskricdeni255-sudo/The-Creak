import { ItemType, RoomType, HidingSpotType, HidingSpot, SpecialProp, CreakingZone, Language } from './types';

export const MAX_DAYS = 5;

// Colors
export const COLORS = {
  floor: 0x1a1a1a,
  wall: 0x555555,
  ceiling: 0x111111,
  granny: 0x880000,
  player: 0x00ff00
};

// Physics Constants
export const FLOOR_LEVELS = {
  SEWER: -20,
  BASEMENT: -10,
  GROUND: 0,
  UPPER: 10,
  ATTIC: 20
};

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  [Language.ENGLISH]: { PLAY: 'PLAY', OPTIONS: 'OPTIONS', CONTROLS: 'CONTROLS', DAY: 'DAY', OBJECTIVE: 'Objective', INTERACT: 'Interact', RUN: 'Run', CROUCH: 'Crouch', DROP: 'Drop', INVENTORY: 'Inventory', BACK: 'BACK', RESUME: 'RESUME', QUIT: 'QUIT TO MENU', GAMEOVER: 'GAME OVER', ESCAPED: 'ESCAPED', LOADING: 'LOADING', LEAVE: 'LEAVE', DIFFICULTY: 'DIFFICULTY', PRIVACY: 'Privacy Policy', CONTACT: 'Contact Us', NO_ADS: 'No Ads $5.99' },
  [Language.GERMAN]: { PLAY: 'SPIELEN', OPTIONS: 'OPTIONEN', CONTROLS: 'STEUERUNG', DAY: 'TAG', OBJECTIVE: 'Ziel', INTERACT: 'Interagieren', RUN: 'Rennen', CROUCH: 'Ducken', DROP: 'Fallenlassen', INVENTORY: 'Inventar', BACK: 'ZURÜCK', RESUME: 'FORTSETZEN', QUIT: 'BEENDEN', GAMEOVER: 'SPIEL VORBEI', ESCAPED: 'ENTKOMMEN', LOADING: 'LADEN', LEAVE: 'VERLASSEN', DIFFICULTY: 'SCHWIERIGKEIT', PRIVACY: 'Datenschutz', CONTACT: 'Kontakt', NO_ADS: 'Keine Werbung $5.99' },
  [Language.FRENCH]: { PLAY: 'JOUER', OPTIONS: 'OPTIONS', CONTROLS: 'CONTRÔLES', DAY: 'JOUR', OBJECTIVE: 'Objectif', INTERACT: 'Interagir', RUN: 'Courir', CROUCH: 'S\'accroupir', DROP: 'Lâcher', INVENTORY: 'Inventaire', BACK: 'RETOUR', RESUME: 'REPRENDRE', QUIT: 'QUITTER', GAMEOVER: 'JEU TERMINÉ', ESCAPED: 'ÉCHAPPÉ', LOADING: 'CHARGEMENT', LEAVE: 'QUITTER', DIFFICULTY: 'DIFFICULTÉ', PRIVACY: 'Confidentialité', CONTACT: 'Contact', NO_ADS: 'Pas de pubs $5.99' },
  [Language.KOREAN]: { PLAY: '게임 시작', OPTIONS: '설정', CONTROLS: '조작법', DAY: '일', OBJECTIVE: '목표', INTERACT: '상호작용', RUN: '달리기', CROUCH: '숙이기', DROP: '버리기', INVENTORY: '인벤토리', BACK: '뒤로', RESUME: '계속', QUIT: '나가기', GAMEOVER: '게임 오버', ESCAPED: '탈출 성공', LOADING: '로딩 중', LEAVE: '나가기', DIFFICULTY: '난이도', PRIVACY: '개인정보처리방침', CONTACT: '문의하기', NO_ADS: '광고 제거 $5.99' },
  [Language.JAPANESE]: { PLAY: 'プレイ', OPTIONS: '設定', CONTROLS: '操作', DAY: '日目', OBJECTIVE: '目的', INTERACT: 'インタラクト', RUN: '走る', CROUCH: 'しゃがむ', DROP: '落とす', INVENTORY: '持ち物', BACK: '戻る', RESUME: '再開', QUIT: '終了', GAMEOVER: 'ゲームオーバー', ESCAPED: '脱出成功', LOADING: '読み込み中', LEAVE: '去る', DIFFICULTY: '難易度', PRIVACY: 'プライバシー', CONTACT: '連絡先', NO_ADS: '広告なし $5.99' },
  [Language.CZECH]: { PLAY: 'HRÁT', OPTIONS: 'MOŽNOSTI', CONTROLS: 'OVLÁDÁNÍ', DAY: 'DEN', OBJECTIVE: 'Cíl', INTERACT: 'Interakce', RUN: 'Běh', CROUCH: 'Přikrčit', DROP: 'Zahodit', INVENTORY: 'Inventář', BACK: 'ZPĚT', RESUME: 'POKRAČOVAT', QUIT: 'UKONČIT', GAMEOVER: 'KONEC HRY', ESCAPED: 'ÚTĚK', LOADING: 'NAČÍTÁNÍ', LEAVE: 'ODEJÍT', DIFFICULTY: 'OBTÍŽNOST', PRIVACY: 'Soukromí', CONTACT: 'Kontakt', NO_ADS: 'Bez reklam $5.99' },
  [Language.CHINESE]: { PLAY: '开始游戏', OPTIONS: '选项', CONTROLS: '控制', DAY: '天', OBJECTIVE: '目标', INTERACT: '互动', RUN: '奔跑', CROUCH: '蹲下', DROP: '丢弃', INVENTORY: '库存', BACK: '返回', RESUME: '继续', QUIT: '退出', GAMEOVER: '游戏结束', ESCAPED: '逃脱', LOADING: '加载中', LEAVE: '离开', DIFFICULTY: '难度', PRIVACY: '隐私政策', CONTACT: '联系我们', NO_ADS: '无广告 $5.99' },
  [Language.ITALIAN]: { PLAY: 'GIOCA', OPTIONS: 'OPZIONI', CONTROLS: 'CONTROLLI', DAY: 'GIORNO', OBJECTIVE: 'Obiettivo', INTERACT: 'Interagisci', RUN: 'Corri', CROUCH: 'Accovacciati', DROP: 'Lascia', INVENTORY: 'Inventario', BACK: 'INDIETRO', RESUME: 'RIPRENDI', QUIT: 'ESCI', GAMEOVER: 'GAME OVER', ESCAPED: 'FUGGITO', LOADING: 'CARICAMENTO', LEAVE: 'ESCI', DIFFICULTY: 'DIFFICOLTÀ', PRIVACY: 'Privacy', CONTACT: 'Contatti', NO_ADS: 'No Pubblicità $5.99' },
  [Language.RUSSIAN]: { PLAY: 'ИГРАТЬ', OPTIONS: 'ОПЦИИ', CONTROLS: 'УПРАВЛЕНИЕ', DAY: 'ДЕНЬ', OBJECTIVE: 'Цель', INTERACT: 'Взять', RUN: 'Бежать', CROUCH: 'Присесть', DROP: 'Бросить', INVENTORY: 'Инвентарь', BACK: 'НАЗАД', RESUME: 'ПРОДОЛЖИТЬ', QUIT: 'ВЫЙТИ', GAMEOVER: 'ИГРА ОКОНЧЕНА', ESCAPED: 'СБЕЖАЛ', LOADING: 'ЗАГРУЗКА', LEAVE: 'УЙТИ', DIFFICULTY: 'СЛОЖНОСТЬ', PRIVACY: 'Конфиденциальность', CONTACT: 'Контакты', NO_ADS: 'Без рекламы $5.99' },
  [Language.VIETNAMESE]: { PLAY: 'CHƠI', OPTIONS: 'TÙY CHỌN', CONTROLS: 'ĐIỀU KHIỂN', DAY: 'NGÀY', OBJECTIVE: 'Mục tiêu', INTERACT: 'Tương tác', RUN: 'Chạy', CROUCH: 'Ngồi', DROP: 'Bỏ', INVENTORY: 'Túi đồ', BACK: 'QUAY LẠI', RESUME: 'TIẾP TỤC', QUIT: 'THOÁT', GAMEOVER: 'THUA CUỘC', ESCAPED: 'ĐÃ THOÁT', LOADING: 'ĐANG TẢI', LEAVE: 'RỜI KHỎI', DIFFICULTY: 'ĐỘ KHÓ', PRIVACY: 'Chính sách', CONTACT: 'Liên hệ', NO_ADS: 'Không QC $5.99' },
};

export const ROOM_BOUNDS: Record<RoomType, { x: number, y: number, z: number, w: number, h: number, d: number, color: number }> = {
  // --- UPPER FLOOR (Y=10) ---
  [RoomType.STARTING_BEDROOM]: { x: -20, y: 10, z: -10, w: 15, h: 9, d: 20, color: 0x4a4a3a },
  [RoomType.BEDROOM_1]: { x: 20, y: 10, z: -10, w: 20, h: 9, d: 20, color: 0x3a3a4a },
  [RoomType.BEDROOM_2]: { x: 20, y: 10, z: 15, w: 20, h: 9, d: 20, color: 0x3a4a3a },
  [RoomType.BEDROOM_3]: { x: 0, y: 10, z: 25, w: 15, h: 9, d: 15, color: 0x2d2d2d }, 
  [RoomType.NURSERY]: { x: -20, y: 10, z: 25, w: 15, h: 9, d: 15, color: 0x442222 }, 
  [RoomType.BATHROOM]: { x: -20, y: 10, z: 10, w: 12, h: 9, d: 12, color: 0xeeeeee },
  [RoomType.WALK_IN_CLOSET]: { x: 32, y: 10, z: 2, w: 6, h: 9, d: 15, color: 0x221111 },

  // --- ATTIC (Y=20) ---
  [RoomType.MANNEQUIN_ROOM]: { x: 0, y: 20, z: 0, w: 30, h: 8, d: 30, color: 0x3d2b1f },
  [RoomType.ATTIC]: { x: -20, y: 20, z: 0, w: 20, h: 8, d: 30, color: 0x332211 },
  [RoomType.BEDROOM_4]: { x: 25, y: 20, z: -15, w: 15, h: 8, d: 15, color: 0x303030 }, 
  [RoomType.JAIL]: { x: 25, y: 20, z: 10, w: 15, h: 8, d: 15, color: 0x333333 },
  [RoomType.VENT_TUNNEL]: { x: -20, y: 21, z: 10, w: 8, h: 3, d: 8, color: 0x222222 },
  [RoomType.SPECIAL_ROOM]: { x: 0, y: 20, z: 25, w: 15, h: 8, d: 15, color: 0x220000 },

  // --- GROUND FLOOR (Y=0) ---
  [RoomType.FOYER]: { x: 0, y: 0, z: 0, w: 20, h: 9, d: 40, color: 0x333333 },
  [RoomType.LIVING_ROOM]: { x: -20, y: 0, z: -10, w: 20, h: 9, d: 20, color: 0x443333 },
  [RoomType.DINING_ROOM]: { x: -20, y: 0, z: 10, w: 20, h: 9, d: 20, color: 0x444433 },
  [RoomType.KITCHEN]: { x: -40, y: 0, z: 10, w: 15, h: 9, d: 20, color: 0x555555 },
  [RoomType.STUDY]: { x: 20, y: 0, z: 0, w: 15, h: 9, d: 15, color: 0x222211 },

  // --- BASEMENT / LOWER (Y=-10) ---
  [RoomType.BASEMENT]: { x: 0, y: -10, z: 0, w: 30, h: 9, d: 30, color: 0x221111 },
  [RoomType.GARAGE]: { x: 25, y: -10, z: 0, w: 20, h: 9, d: 25, color: 0x333333 },
  [RoomType.SECRET_AREA]: { x: -25, y: -10, z: 0, w: 15, h: 9, d: 40, color: 0x111111 },

  // --- SEWER (Y=-20) ---
  [RoomType.SEWER]: { x: 0, y: -20, z: 0, w: 60, h: 8, d: 60, color: 0x0a110a },

  // --- OUTSIDE (Y=0) ---
  [RoomType.BACKYARD]: { x: -50, y: 0, z: 0, w: 40, h: 20, d: 60, color: 0x051105 },
};

// --- HIDING SPOTS ---
export const HIDING_SPOTS: HidingSpot[] = [
  { id: 'bed-start', type: HidingSpotType.BED, position: [-20, 11, -15], rotation: 0, room: RoomType.STARTING_BEDROOM },
  { id: 'cabinet-start', type: HidingSpotType.WARDROBE, position: [-15, 10, -5], rotation: -Math.PI/2, room: RoomType.STARTING_BEDROOM },
  { id: 'bed-bed1', type: HidingSpotType.BED, position: [20, 11, -15], rotation: 0, room: RoomType.BEDROOM_1 },
  { id: 'bed-bed3', type: HidingSpotType.BED, position: [0, 11, 28], rotation: 0, room: RoomType.BEDROOM_3 },
  { id: 'crib-nursery', type: HidingSpotType.BED, position: [-20, 11, 28], rotation: 0, room: RoomType.NURSERY },
  { id: 'cabinet-kitchen', type: HidingSpotType.WARDROBE, position: [-40, 0, 15], rotation: Math.PI/2, room: RoomType.KITCHEN },
  { id: 'coffin-backyard', type: HidingSpotType.COFFIN, position: [-55, 1, 0], rotation: 0, room: RoomType.BACKYARD },
  { id: 'trunk-garage', type: HidingSpotType.CAR_TRUNK, position: [25, -9, 0], rotation: 0, room: RoomType.GARAGE },
];

// --- CREAKING FLOORS ---
export const CREAKING_ZONES: CreakingZone[] = [
  { position: [-20, 10, 10], size: [4, 1, 4], room: RoomType.BATHROOM },
  { position: [20, 10, -5], size: [4, 1, 4], room: RoomType.BEDROOM_1 },
  { position: [-35, 0, 10], size: [4, 1, 4], room: RoomType.KITCHEN },
];

// --- SPECIAL PROPS ---
export const SPECIAL_PROPS: SpecialProp[] = [
  { type: 'JAIL_BARS', position: [25, 20, 10], rotation: [0, 0, 0], size: [10, 6, 10] },
  { type: 'MANNEQUIN', position: [0, 20, 0], rotation: [0, Math.PI, 0] },
  { type: 'VENT_COVER', position: [-20, 20, 10], rotation: [0, 0, 0] },
  { type: 'TABLE_LONG', position: [-20, 10, -10], rotation: [0, 0, 0] },
];

export const ITEM_SPAWN_LOCATIONS = [
  { room: RoomType.STARTING_BEDROOM, offset: [-2, 1, -2] }, 
  { room: RoomType.BEDROOM_1, offset: [5, 1, 5] }, 
  { room: RoomType.BEDROOM_3, offset: [0, 1, -3] },
  { room: RoomType.KITCHEN, offset: [0, 2, 0] },
  { room: RoomType.GARAGE, offset: [-4, 1, 0] }, 
  { room: RoomType.NURSERY, offset: [2, 1, 2] }, 
  { room: RoomType.MANNEQUIN_ROOM, offset: [-5, 1, 0] },
  { room: RoomType.BATHROOM, offset: [2, 1, 0] }, 
  { room: RoomType.SECRET_AREA, offset: [0, 1, 0] },
  { room: RoomType.BACKYARD, offset: [5, 1, 0] },
];

export const ALL_ITEMS = [
  ItemType.MASTER_KEY,
  ItemType.PLIERS,
  ItemType.MEAT,
  ItemType.HAMMER,
  ItemType.WRENCH,
  ItemType.PADLOCK_KEY,
  ItemType.WEAPON_KEY,
  ItemType.SHOTGUN,
  ItemType.CROSSBOW,
  ItemType.TEDDY
];