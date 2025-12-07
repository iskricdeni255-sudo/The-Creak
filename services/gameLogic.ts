import { ItemType, ItemSpawn } from '../types';
import { ITEM_SPAWN_LOCATIONS, ALL_ITEMS, ROOM_BOUNDS } from '../constants';

export const randomizeItems = (): ItemSpawn[] => {
  const spawns: ItemSpawn[] = [];
  const locations = [...ITEM_SPAWN_LOCATIONS];
  
  // Shuffle locations
  for (let i = locations.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [locations[i], locations[j]] = [locations[j], locations[i]];
  }

  ALL_ITEMS.forEach((itemType, index) => {
    if (index < locations.length) {
      const loc = locations[index];
      const roomData = ROOM_BOUNDS[loc.room];
      
      // Calculate absolute position based on room bounds
      // Bug Fix: Previously used loc.offset[1] directly as Y, causing floating items downstairs.
      // Now adds room floor Y level.
      const x = roomData.x + loc.offset[0];
      const y = roomData.y + loc.offset[1];
      const z = roomData.z + loc.offset[2];

      spawns.push({
        id: `item-${index}`,
        type: itemType,
        position: [x, y, z],
        room: loc.room,
        collected: false
      });
    }
  });

  return spawns;
};