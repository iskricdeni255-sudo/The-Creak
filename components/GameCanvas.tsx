import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { GameSettings, GameState, ItemSpawn, RoomType, Difficulty, HidingSpotType, ItemType } from '../types';
import { ROOM_BOUNDS, COLORS, HIDING_SPOTS, SPECIAL_PROPS, CREAKING_ZONES, FLOOR_LEVELS } from '../constants';
import { audioService } from '../services/audioService';

interface GameCanvasProps {
  gameState: GameState;
  settings: GameSettings;
  difficulty: Difficulty;
  items: ItemSpawn[];
  onCollectItem: (id: string) => void;
  onGrannyCatch: () => void;
  onPause: () => void;
  setPlayerRoom: (room: RoomType) => void;
  setPlayerCrouch: (isCrouching: boolean) => void;
  setPlayerRun: (isRunning: boolean) => void;
  useItem: string | null;
  onUseItemComplete: () => void;
  onVictory: () => void;
}

// Player height constants
const PLAYER_HEIGHT_STANDING = 5.0;
const PLAYER_HEIGHT_CROUCHING = 2.5;

// --- Procedural Textures ---
const createTexture = (colorHex: number, noise: boolean = true) => {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const color = new THREE.Color(colorHex);
  ctx.fillStyle = `#${color.getHexString()}`;
  ctx.fillRect(0, 0, size, size);

  if (noise) {
    for (let i = 0; i < 30000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const shade = Math.random() > 0.5 ? 255 : 0;
      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.08)`;
      ctx.fillRect(x, y, 2, 2);
    }
    // Grime & Blood Stains
    ctx.filter = 'blur(2px)';
    ctx.fillStyle = 'rgba(50,0,0,0.1)'; // Subtle red hue
    for(let i=0; i<30; i++) {
         ctx.beginPath();
         ctx.arc(Math.random()*size, Math.random()*size, Math.random()*30, 0, Math.PI*2);
         ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

// --- Item Geometry Factory (Realistic) ---
const createItemMesh = (type: ItemType): THREE.Object3D => {
    const group = new THREE.Group();
    
    switch(type) {
        case ItemType.MASTER_KEY: {
            const handle = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 20), new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.2 }));
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
            shaft.rotation.z = Math.PI/2;
            shaft.position.x = 0.6;
            const teeth = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.05), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
            teeth.position.x = 1;
            teeth.position.y = -0.1;
            group.add(handle, shaft, teeth);
            break;
        }
        case ItemType.HAMMER: {
            const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5), new THREE.MeshStandardMaterial({ color: 0x5c4033 })); 
            const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.4), new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7 }));
            head.position.y = 0.7;
            head.rotation.z = Math.PI/2;
            const claw = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7 }));
            claw.position.set(0, 0.7, 0.25);
            claw.rotation.x = -Math.PI/4;
            group.add(handle, head, claw);
            break;
        }
        case ItemType.MEAT: {
            const meat = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4), new THREE.MeshStandardMaterial({ color: 0x8a3324, roughness: 0.6 }));
            meat.scale.set(1, 0.6, 1.2);
            // Bone
            const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
            bone.rotation.x = Math.PI/2;
            group.add(bone, meat);
            break;
        }
        case ItemType.PLIERS: {
            const h1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
            h1.rotation.z = -0.2;
            const h2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
            h2.rotation.z = 0.2;
            const jaws = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.1), new THREE.MeshStandardMaterial({ color: 0x555555 }));
            jaws.position.y = 0.5;
            group.add(h1, h2, jaws);
            break;
        }
        case ItemType.SHOTGUN: {
             const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 }));
             barrel.rotation.z = Math.PI/2;
             const stock = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.15), new THREE.MeshStandardMaterial({ color: 0x3d2b1f }));
             stock.position.x = -1.5;
             const grip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.15), new THREE.MeshStandardMaterial({ color: 0x3d2b1f }));
             grip.position.set(-0.8, -0.3, 0);
             group.add(barrel, stock, grip);
             break;
        }
        case ItemType.TEDDY: {
             const body = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
             const head = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
             head.position.y = 0.5;
             const ear1 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshStandardMaterial({ color: 0x8b5a2b })); ear1.position.set(0.2, 0.7, 0);
             const ear2 = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshStandardMaterial({ color: 0x8b5a2b })); ear2.position.set(-0.2, 0.7, 0);
             group.add(body, head, ear1, ear2);
             break;
        }
        default: {
            const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x00ffff }));
            group.add(box);
        }
    }
    group.scale.set(1.5, 1.5, 1.5);
    return group;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  settings,
  difficulty,
  items,
  onCollectItem,
  onGrannyCatch,
  onPause,
  setPlayerRoom,
  setPlayerCrouch,
  setPlayerRun,
  useItem,
  onUseItemComplete,
  onVictory
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<PointerLockControls | null>(null);
  const grannyRef = useRef<THREE.Group | null>(null);
  
  // Game Logic
  const playerVelocity = useRef(new THREE.Vector3());
  const playerDirection = useRef(new THREE.Vector3());
  const isCrouching = useRef(false);
  const isRunning = useRef(false);
  const isHidden = useRef(false); 
  const hidingSpotRef = useRef<THREE.Vector3 | null>(null);
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const raycaster = useRef(new THREE.Raycaster());
  const lastTime = useRef(performance.now());
  const itemMeshes = useRef<Map<string, THREE.Object3D>>(new Map());
  const grannyState = useRef<'PATROL' | 'CHASE' | 'INVESTIGATE'>('PATROL');
  const noiseLocation = useRef<THREE.Vector3 | null>(null);
  const texturesRef = useRef<any>(null);
  const creakingCooldown = useRef(0);
  const paranoidTimer = useRef(0);

  // --- INIT ---
  useEffect(() => {
    if (!containerRef.current) return;

    texturesRef.current = {
      wall: createTexture(0x999999),
      floor: createTexture(0x666666),
      wood: createTexture(0x8b5a2b),
      metal: createTexture(0xa0a0a0, false),
      fabric: createTexture(0xcc4444)
    };

    const scene = new THREE.Scene();
    const isNightmare = difficulty === Difficulty.NIGHTMARE;
    const bgColor = isNightmare ? 0x000000 : 0x050505; 
    scene.background = new THREE.Color(bgColor); 

    const fogDensity = isNightmare ? 0.04 : 0.01;
    if (!settings.epilepsyMode) scene.fog = new THREE.FogExp2(bgColor, fogDensity);
    
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-20, 15, -10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = settings.shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;
    controls.addEventListener('unlock', () => {
      if (gameState === GameState.PLAYING) onPause();
    });

    const ambientIntensity = isNightmare ? 0.05 : 0.2;
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);

    if (!isNightmare) {
        const hemiLight = new THREE.HemisphereLight(0x222233, 0x111111, 0.3);
        scene.add(hemiLight);
    }
    
    // Improved Flashlight
    const flashlight = new THREE.SpotLight(0xffffff, 3.0);
    flashlight.position.set(0, 0, 0);
    flashlight.target = camera;
    flashlight.angle = Math.PI / 4; 
    flashlight.penumbra = 0.2;
    flashlight.decay = 1.5;
    flashlight.distance = isNightmare ? 40 : 80;
    flashlight.castShadow = settings.shadows;
    camera.add(flashlight);
    // Visual ring for flashlight
    const fRing = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.06, 32), new THREE.MeshBasicMaterial({color: 0xffff00, opacity: 0.5, transparent: true}));
    fRing.position.z = -1;
    camera.add(fRing);
    
    scene.add(camera.children[0].target!);
    scene.add(camera);

    buildMultiStoryHouse(scene);
    renderHidingSpots(scene);
    renderSpecialProps(scene);
    // Removed Furniture rendering as requested ("Clear furniture")

    if (difficulty !== Difficulty.PRACTICE) {
        const granny = createGranny();
        granny.position.set(0, -10, 0);
        scene.add(granny);
        grannyRef.current = granny;
    }

    renderItems(scene, items);

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if(containerRef.current && renderer.domElement) containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sceneRef.current) renderItems(sceneRef.current, items);
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = true; break;
        case 'KeyS': moveState.current.backward = true; break;
        case 'KeyA': moveState.current.left = true; break;
        case 'KeyD': moveState.current.right = true; break;
        case 'KeyC': toggleCrouch(); break;
        // Key 'I' Removed
        case 'KeyR': toggleRun(true); break; 
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = false; break;
        case 'KeyS': moveState.current.backward = false; break;
        case 'KeyA': moveState.current.left = false; break;
        case 'KeyD': moveState.current.right = false; break;
        case 'KeyR': toggleRun(false); break; 
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (gameState === GameState.PLAYING) {
        if (!controlsRef.current?.isLocked) controlsRef.current?.lock();
        else {
            if (e.button === 0) interact(); 
            if (e.button === 2) toggleRun(true); 
        }
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
        if (e.button === 2) toggleRun(false); 
    };
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // Main Loop
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (gameState !== GameState.PLAYING || !rendererRef.current) return;

      const time = performance.now();
      const delta = (time - lastTime.current) / 1000;
      lastTime.current = time;

      if (creakingCooldown.current > 0) creakingCooldown.current -= delta;

      // Paranoid Mode Logic
      if (settings.paranoidMode) {
          paranoidTimer.current -= delta;
          if (paranoidTimer.current <= 0) {
              if (Math.random() < 0.1) {
                  // Fake footstep
                  audioService.playFootstep();
              }
              paranoidTimer.current = Math.random() * 10 + 5;
          }
      }

      // Paradox Mode Logic
      if (settings.paradoxMode && rendererRef.current) {
          if (Math.random() < 0.01) {
              sceneRef.current!.background = new THREE.Color(Math.random() * 0xffffff);
              setTimeout(() => {
                 sceneRef.current!.background = new THREE.Color(0x050505);
              }, 100);
          }
      }

      updatePlayer(delta);
      if (difficulty !== Difficulty.PRACTICE) updateGranny(delta);

      rendererRef.current.render(sceneRef.current!, cameraRef.current!);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, settings, difficulty]);

  // --- BUILDERS ---

  const buildMultiStoryHouse = (scene: THREE.Scene) => {
    const { wall, floor, wood } = texturesRef.current;
    
    // Adjust colors for Nightmare
    const isNightmare = difficulty === Difficulty.NIGHTMARE;
    const wallColor = isNightmare ? 0x2a2a2a : 0xcccccc; 
    const floorColor = isNightmare ? 0x1a1a1a : 0xaaaaaa;

    const wallMat = new THREE.MeshStandardMaterial({ map: wall, roughness: 0.9, color: wallColor });
    const floorMat = new THREE.MeshStandardMaterial({ map: floor, roughness: 0.9, color: floorColor });
    const ceilingMat = new THREE.MeshStandardMaterial({ color: isNightmare ? 0x050505 : 0x333333 });
    
    Object.entries(ROOM_BOUNDS).forEach(([key, r]) => {
      const fGeo = new THREE.PlaneGeometry(r.w, r.d);
      const fMesh = new THREE.Mesh(fGeo, floorMat);
      fMesh.rotation.x = -Math.PI / 2;
      fMesh.position.set(r.x, r.y, r.z);
      fMesh.receiveShadow = true;
      scene.add(fMesh);

      const cMesh = new THREE.Mesh(fGeo, ceilingMat);
      cMesh.rotation.x = Math.PI / 2;
      cMesh.position.set(r.x, r.y + r.h, r.z);
      scene.add(cMesh);

      const wGeoN = new THREE.PlaneGeometry(r.w, r.h);
      const wGeoE = new THREE.PlaneGeometry(r.d, r.h);
      
      const walls = [
         { pos: [r.x, r.y + r.h/2, r.z - r.d/2], rot: [0, 0, 0], geo: wGeoN }, 
         { pos: [r.x, r.y + r.h/2, r.z + r.d/2], rot: [0, Math.PI, 0], geo: wGeoN },
         { pos: [r.x - r.w/2, r.y + r.h/2, r.z], rot: [0, Math.PI/2, 0], geo: wGeoE },
         { pos: [r.x + r.w/2, r.y + r.h/2, r.z], rot: [0, -Math.PI/2, 0], geo: wGeoE },
      ];

      walls.forEach(w => {
         const mesh = new THREE.Mesh(w.geo, wallMat);
         mesh.position.set(w.pos[0] as number, w.pos[1] as number, w.pos[2] as number);
         mesh.rotation.set(w.rot[0] as number, w.rot[1] as number, w.rot[2] as number);
         scene.add(mesh);
      });
    });

    // ROOF
    const roofGeo = new THREE.ConeGeometry(80, 25, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1a0a0a, roughness: 1.0 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 40, 0); 
    roof.rotation.y = Math.PI/4;
    scene.add(roof);

    // ENHANCED STAIRS
    const createStaircase = (x: number, yBottom: number, z: number, yTop: number, width: number = 8) => {
        const height = yTop - yBottom;
        const rampLen = 15;
        const rampGroup = new THREE.Group();
        
        const rampGeo = new THREE.BoxGeometry(width, 0.5, rampLen); 
        const ramp = new THREE.Mesh(rampGeo, new THREE.MeshStandardMaterial({ map: wood, color: 0x5c4033 }));
        const angle = Math.atan2(height, rampLen);
        ramp.rotation.x = -angle;
        rampGroup.add(ramp);

        const railGeo = new THREE.BoxGeometry(0.2, 0.2, rampLen);
        const railLeft = new THREE.Mesh(railGeo, new THREE.MeshStandardMaterial({ color: 0x333333 }));
        railLeft.position.set(-width/2, 2, 0);
        railLeft.rotation.x = -angle;
        const railRight = new THREE.Mesh(railGeo, new THREE.MeshStandardMaterial({ color: 0x333333 }));
        railRight.position.set(width/2, 2, 0);
        railRight.rotation.x = -angle;
        
        for(let i=-1; i<=1; i+=0.5) {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.5), new THREE.MeshStandardMaterial({ color: 0x222222 }));
            post.position.set(-width/2, i*height/2 + 1, i*rampLen/3); 
            rampGroup.add(post);
            const postR = post.clone();
            postR.position.set(width/2, i*height/2 + 1, i*rampLen/3);
            rampGroup.add(postR);
        }

        rampGroup.add(railLeft, railRight);
        rampGroup.position.set(x, yBottom + height/2, z);
        scene.add(rampGroup);
    };

    createStaircase(0, -10, 0, 0); 
    createStaircase(0, 0, 0, 10); 
    createStaircase(0, 10, -5, 20); 
    createStaircase(0, -20, 10, -10); 

    const mainDoor = new THREE.Mesh(new THREE.BoxGeometry(4, 8, 0.5), new THREE.MeshStandardMaterial({ map: wood, color: 0x3d2b1f }));
    mainDoor.position.set(0, 4, 20); 
    mainDoor.name = "EXIT_DOOR";
    scene.add(mainDoor);
  };

  const renderHidingSpots = (scene: THREE.Scene) => {
    const { wood, fabric } = texturesRef.current;
    HIDING_SPOTS.forEach(spot => {
        const group = new THREE.Group();
        group.position.set(...spot.position);
        group.rotation.y = spot.rotation;
        
        if (spot.type === HidingSpotType.BED) {
            const frame = new THREE.Mesh(new THREE.BoxGeometry(5, 2, 8), new THREE.MeshStandardMaterial({ map: wood, color: 0x555555 }));
            frame.position.y = 1;
            const mattress = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1, 7.8), new THREE.MeshStandardMaterial({ map: fabric, color: 0xcc9999 }));
            mattress.position.y = 2.5;
            group.add(frame, mattress);
        } else if (spot.type === HidingSpotType.WARDROBE) {
            const box = new THREE.Mesh(new THREE.BoxGeometry(4, 9, 3), new THREE.MeshStandardMaterial({ map: wood, color: 0x4a3c31 }));
            box.position.y = 4.5;
            group.add(box);
        } else if (spot.type === HidingSpotType.CHEST) {
             const box = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 3), new THREE.MeshStandardMaterial({ map: wood, color: 0x332211 }));
             box.position.y = 1.5;
             group.add(box);
        } else if (spot.type === HidingSpotType.CAR_TRUNK) {
             const trunk = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 4), new THREE.MeshStandardMaterial({ color: 0x222222 }));
             trunk.position.y = 1.5;
             group.add(trunk);
        } else if (spot.type === HidingSpotType.COFFIN) {
             const coffin = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 8), new THREE.MeshStandardMaterial({ map: wood, color: 0x110500 }));
             coffin.position.y = 1;
             group.add(coffin);
        }

        const triggerGeo = new THREE.BoxGeometry(6, 6, 6);
        const triggerMat = new THREE.MeshBasicMaterial({ visible: false });
        const trigger = new THREE.Mesh(triggerGeo, triggerMat);
        trigger.position.y = 3;
        trigger.userData = { isHidingSpot: true, spotData: spot };
        group.add(trigger);

        scene.add(group);
    });
  };

  const renderSpecialProps = (scene: THREE.Scene) => {
    const { metal } = texturesRef.current;
    SPECIAL_PROPS.forEach(prop => {
        const group = new THREE.Group();
        group.position.set(...prop.position);
        group.rotation.set(...prop.rotation);
        
        if (prop.type === 'JAIL_BARS' && prop.size) {
            for(let i = -prop.size[0]/2; i < prop.size[0]/2; i+=1.5) {
                const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, prop.size[1]), new THREE.MeshStandardMaterial({ map: metal, color: 0x888888 }));
                bar.position.set(i, prop.size[1]/2, prop.size[2]/2);
                group.add(bar);
            }
        }
        scene.add(group);
    });
  };

  const renderItems = (scene: THREE.Scene, itemsData: ItemSpawn[]) => {
    itemMeshes.current.forEach(mesh => scene.remove(mesh));
    itemMeshes.current.clear();
    itemsData.forEach(item => {
      if (!item.collected) {
        const mesh = createItemMesh(item.type);
        mesh.position.set(...item.position);
        mesh.userData = { id: item.id, type: item.type, isItem: true };
        
        const intensity = difficulty === Difficulty.NIGHTMARE ? 0.3 : 0.8;
        const light = new THREE.PointLight(0xffffff, intensity, 5);
        mesh.add(light);
        
        scene.add(mesh);
        itemMeshes.current.set(item.id, mesh);
      }
    });
  };

  const createGranny = () => {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLORS.granny, roughness: 1 });
    // Total Height: 3.5 length + 0.8*2 radius = 5.1 units. Matches player height ~5.0
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 3.5, 4, 8), mat); 
    body.position.y = 2.55; 
    
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.7), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    head.position.y = 4.6; 
    
    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.1);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); 
    if (difficulty === Difficulty.NIGHTMARE) {
        eyeMat.color.setHex(0xff0000);
        eyeMat.toneMapped = false;
    }
    const e1 = new THREE.Mesh(eyeGeo, eyeMat); e1.position.set(0.3, 4.7, 0.6);
    const e2 = new THREE.Mesh(eyeGeo, eyeMat); e2.position.set(-0.3, 4.7, 0.6);
    
    // Bat
    const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.08, 1.8), new THREE.MeshStandardMaterial({ color: 0x2a1c11, roughness: 0.8 }));
    bat.position.set(1.2, 3.0, 0.5);
    bat.rotation.x = Math.PI/2;
    const bloodTip = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.5), new THREE.MeshStandardMaterial({ color: 0x880000 }));
    bloodTip.position.set(0, 0.6, 0);
    bat.add(bloodTip);

    g.add(body, head, e1, e2, bat);
    return g;
  };

  const makeNoise = (pos: THREE.Vector3) => {
      if (!settings.attractGranny) return;
      noiseLocation.current = pos.clone();
      grannyState.current = 'INVESTIGATE';
  };

  const interact = () => {
    if (!cameraRef.current || !sceneRef.current) return;

    if (isHidden.current) {
        isHidden.current = false;
        if (hidingSpotRef.current) {
            cameraRef.current.position.copy(hidingSpotRef.current).add(new THREE.Vector3(5, 0, 0));
        }
        return;
    }

    raycaster.current.setFromCamera(new THREE.Vector2(0, 0), cameraRef.current);
    const intersects = raycaster.current.intersectObjects(sceneRef.current.children, true);

    for (let i = 0; i < intersects.length; i++) {
        let obj = intersects[i].object;
        while(obj.parent && obj.parent !== sceneRef.current) {
            if (obj.userData.isItem || obj.userData.isHidingSpot) break;
            obj = obj.parent;
        }

        if (intersects[i].distance > 10) continue; 

        if (obj.userData.isItem) {
            onCollectItem(obj.userData.id);
            audioService.playPickup();
            return;
        }

        if (obj.userData.isHidingSpot) {
            const spot = obj.userData.spotData;
            isHidden.current = true;
            hidingSpotRef.current = new THREE.Vector3(...spot.position);
            let camY = 1.0; 
            if (spot.type === HidingSpotType.WARDROBE) camY = 4;
            cameraRef.current.position.set(spot.position[0], spot.position[1] + camY, spot.position[2]);
            return;
        }

        if (obj.name === "EXIT_DOOR") {
            if (useItem) onUseItemComplete();
            else console.log("Locked");
        }
    }
  };

  const toggleCrouch = () => {
      if (isHidden.current) return;
      isCrouching.current = !isCrouching.current;
      setPlayerCrouch(isCrouching.current);
      if (isCrouching.current) toggleRun(false); 
  };

  const toggleRun = (run: boolean) => {
      if (isHidden.current) return;
      if (isCrouching.current && run) return; 
      isRunning.current = run;
      setPlayerRun(run);
  };

  const updatePlayer = (delta: number) => {
    if (isHidden.current || !controlsRef.current?.isLocked) return;

    const velocity = playerVelocity.current;
    const direction = playerDirection.current;

    velocity.x -= velocity.x * 15.0 * delta; 
    velocity.z -= velocity.z * 15.0 * delta;

    const pos = cameraRef.current!.position;
    
    // Floor Logic
    let currentFloorY = FLOOR_LEVELS.GROUND; 
    
    if (Math.abs(pos.y - FLOOR_LEVELS.SEWER) < 8) currentFloorY = FLOOR_LEVELS.SEWER;
    else if (Math.abs(pos.y - FLOOR_LEVELS.BASEMENT) < 8) currentFloorY = FLOOR_LEVELS.BASEMENT;
    else if (Math.abs(pos.y - FLOOR_LEVELS.UPPER) < 8) currentFloorY = FLOOR_LEVELS.UPPER;
    else if (Math.abs(pos.y - FLOOR_LEVELS.ATTIC) < 8) currentFloorY = FLOOR_LEVELS.ATTIC;

    if (pos.x > -24 && pos.x < -16 && pos.z > 6 && pos.z < 14 && pos.y > 15) {
        currentFloorY = FLOOR_LEVELS.UPPER; 
    }

    velocity.y -= 9.8 * 30.0 * delta; 

    direction.z = Number(moveState.current.forward) - Number(moveState.current.backward);
    direction.x = Number(moveState.current.right) - Number(moveState.current.left);
    direction.normalize();

    // SPEED CALCULATION
    let baseSpeed = 60.0;
    if (isCrouching.current) baseSpeed = 25.0;
    else if (isRunning.current) baseSpeed = 100.0; 

    if (moveState.current.forward || moveState.current.backward) velocity.z -= direction.z * baseSpeed * delta;
    if (moveState.current.left || moveState.current.right) velocity.x -= direction.x * baseSpeed * delta;

    controlsRef.current.moveRight(-velocity.x * delta);
    controlsRef.current.moveForward(-velocity.z * delta);
    
    const targetHeight = isCrouching.current ? PLAYER_HEIGHT_CROUCHING : PLAYER_HEIGHT_STANDING;
    const actualHeight = pos.y - currentFloorY;
    if (actualHeight < targetHeight) {
        velocity.y = 0;
        pos.y = currentFloorY + targetHeight;
    }
    
    // Noise Generation (Adjusted by Creaking Intensity)
    if (!isCrouching.current && velocity.length() > 0.1) {
        let noiseChance = 0.005 * (settings.creakingIntensity + 0.1); // Scaled
        if (isRunning.current) noiseChance = 0.05 * (settings.creakingIntensity + 0.1); 

        if (Math.random() < noiseChance) {
             makeNoise(pos);
             audioService.playFootstep();
        }
        
        if (creakingCooldown.current <= 0) {
            for(const zone of CREAKING_ZONES) {
                if(Math.abs(pos.x - zone.position[0]) < zone.size[0]/2 && 
                   Math.abs(pos.z - zone.position[2]) < zone.size[2]/2 && 
                   Math.abs(pos.y - zone.position[1]) < 5) {
                       makeNoise(pos);
                       creakingCooldown.current = 2.0; 
                }
            }
        }
    }

    let r = RoomType.SEWER;
    Object.entries(ROOM_BOUNDS).forEach(([key, b]) => {
         if (Math.abs(pos.x - b.x) < b.w/2 && Math.abs(pos.y - b.y) < 5 && Math.abs(pos.z - b.z) < b.d/2) {
             r = key as RoomType;
         }
    });
    setPlayerRoom(r);
  };

  const updateGranny = (delta: number) => {
    if (!grannyRef.current || !cameraRef.current) return;
    const g = grannyRef.current;
    const pPos = cameraRef.current.position;
    const dist = g.position.distanceTo(pPos);

    let spd = 5.0;
    let detRange = 30;

    switch(difficulty) {
        case Difficulty.EASY: spd = 3.0; detRange = 15; break;
        case Difficulty.MEDIUM: spd = 5.5; detRange = 30; break;
        case Difficulty.HARD: spd = 8.0; detRange = 40; break;
        case Difficulty.EXTREME: spd = 10.0; detRange = 50; break;
        case Difficulty.NIGHTMARE: spd = 13.0; detRange = 70; break;
    }

    if (noiseLocation.current) {
        const distToNoise = g.position.distanceTo(noiseLocation.current);
        if (distToNoise < 1) {
            noiseLocation.current = null; 
            grannyState.current = 'PATROL';
        } else {
            g.lookAt(noiseLocation.current);
            g.translateZ(spd * delta);
        }
    } else if (dist < detRange && !isHidden.current) {
        g.lookAt(pPos.x, g.position.y, pPos.z);
        g.translateZ(spd * 1.5 * delta);
        if (dist < 3.0) onGrannyCatch(); 
    } else {
        g.translateZ(spd * 0.5 * delta);
        if (Math.random() < 0.01) g.rotateY(Math.PI/2);
    }
    
    let grannyFloorY = FLOOR_LEVELS.GROUND;
    if (Math.abs(g.position.y - FLOOR_LEVELS.UPPER) < 8) grannyFloorY = FLOOR_LEVELS.UPPER;
    else if (Math.abs(g.position.y - FLOOR_LEVELS.ATTIC) < 8) grannyFloorY = FLOOR_LEVELS.ATTIC;
    else if (Math.abs(g.position.y - FLOOR_LEVELS.BASEMENT) < 8) grannyFloorY = FLOOR_LEVELS.BASEMENT;
    else if (Math.abs(g.position.y - FLOOR_LEVELS.SEWER) < 8) grannyFloorY = FLOOR_LEVELS.SEWER;

    g.position.y = grannyFloorY + 1.75; 
  };

  return <div ref={containerRef} className="w-full h-full" />;
};

export default GameCanvas;