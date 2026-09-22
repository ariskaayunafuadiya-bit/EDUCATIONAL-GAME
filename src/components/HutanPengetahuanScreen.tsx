import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CharacterId, MateriItem, GameItem } from '../types';
import { CharacterView } from './Characters';
import { sounds } from '../utils/audio';
import { Lock, Unlock, Play, Sparkles, Footprints, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { GAME_ASSETS } from '../assets/gameAssets';

interface HutanPengetahuanProps {
  characterId: CharacterId;
  studentName: string;
  completedMateri: boolean;
  completedVideo: boolean;
  completedMission: boolean;
  onOpenPondok: () => void;
  onOpenBioskop: () => void;
  onOpenPosDetektif: () => void;
  justUnlockedDetektif: boolean;
  onDismissUnlockBanner: () => void;
  activeMateri?: MateriItem | null;
  activeGame?: GameItem | null;
  onOpenWorldPicker?: () => void;
}

interface BuildingTarget {
  id: 'pondok' | 'bioskop' | 'pos_detektif';
  name: string;
  subtitle: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  actionLabel: string;
}

const BUILDINGS: BuildingTarget[] = [
  {
    id: 'pondok',
    name: 'PONDOK MATERI',
    subtitle: 'Temukan pengetahuan baru!',
    x: 26,
    y: 35,
    actionLabel: 'MASUK',
  },
  {
    id: 'bioskop',
    name: 'BIOSKOP BELAJAR',
    subtitle: 'Belajar melalui video!',
    x: 72,
    y: 30,
    actionLabel: 'MASUK',
  },
  {
    id: 'pos_detektif',
    name: 'POS DETEKTIF',
    subtitle: 'Misi Detektif Energi!',
    x: 76,
    y: 74,
    actionLabel: 'MASUK',
  },
];

export const HutanPengetahuanScreen: React.FC<HutanPengetahuanProps> = ({
  characterId,
  studentName,
  completedMateri,
  completedVideo,
  completedMission,
  onOpenPondok,
  onOpenBioskop,
  onOpenPosDetektif,
  justUnlockedDetektif,
  onDismissUnlockBanner,
  activeMateri,
  activeGame,
  onOpenWorldPicker,
}) => {
  // Character position in world percentage (0 - 100)
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 22, y: 72 });
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);
  const [targetDestination, setTargetDestination] = useState<{ x: number; y: number } | null>(null);
  const [nearBuilding, setNearBuilding] = useState<BuildingTarget | null>(null);

  const worldRef = useRef<HTMLDivElement>(null);
  const walkTimeoutRef = useRef<number | null>(null);

  // Proximity check distance calculation
  const checkProximity = useCallback((px: number, py: number) => {
    let nearest: BuildingTarget | null = null;
    let minDist = 18; // trigger radius percentage

    for (const b of BUILDINGS) {
      const dist = Math.hypot(px - b.x, py - b.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = b;
      }
    }
    setNearBuilding(nearest);
  }, []);

  // Step movement helper
  const moveBy = useCallback((dx: number, dy: number) => {
    setPlayerPos((prev) => {
      const nextX = Math.max(8, Math.min(92, prev.x + dx));
      const nextY = Math.max(16, Math.min(88, prev.y + dy));
      if (dx < 0) setFacing('left');
      if (dx > 0) setFacing('right');
      setIsWalking(true);
      sounds.playStep();

      if (walkTimeoutRef.current) window.clearTimeout(walkTimeoutRef.current);
      walkTimeoutRef.current = window.setTimeout(() => {
        setIsWalking(false);
      }, 300);

      checkProximity(nextX, nextY);
      return { x: nextX, y: nextY };
    });
  }, [checkProximity]);

  // Keyboard navigation (W, A, S, D & Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const step = 3.5;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          moveBy(0, -step);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          moveBy(0, step);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveBy(-step, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveBy(step, 0);
          break;
        case 'Enter':
        case ' ':
          if (nearBuilding) {
            e.preventDefault();
            handleInteract(nearBuilding);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveBy, nearBuilding]);

  // Click on world to walk there smoothly
  const handleWorldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!worldRef.current) return;
    const rect = worldRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(8, Math.min(92, clickX));
    const clampedY = Math.max(16, Math.min(88, clickY));

    setTargetDestination({ x: clampedX, y: clampedY });
    sounds.playPop();

    if (clampedX < playerPos.x) setFacing('left');
    else setFacing('right');

    setIsWalking(true);
    setPlayerPos({ x: clampedX, y: clampedY });
    checkProximity(clampedX, clampedY);

    if (walkTimeoutRef.current) window.clearTimeout(walkTimeoutRef.current);
    walkTimeoutRef.current = window.setTimeout(() => {
      setIsWalking(false);
      setTargetDestination(null);
    }, 450);
  };

  const [lockedFeedbackMessage, setLockedFeedbackMessage] = useState<string | null>(null);

  // Interact with a building
  const handleInteract = (b: BuildingTarget) => {
    sounds.playPop();
    if (b.id === 'pondok') {
      onOpenPondok();
    } else if (b.id === 'bioskop') {
      onOpenBioskop();
    } else if (b.id === 'pos_detektif') {
      if (completedMateri) {
        onOpenPosDetektif();
      } else {
        sounds.playWrong();
        setLockedFeedbackMessage('🔒 Selesaikan materi terlebih dahulu.');
        setTimeout(() => setLockedFeedbackMessage(null), 3000);
      }
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] min-h-[560px] overflow-hidden bg-slate-950 select-none flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Locked Feedback Toast */}
      {lockedFeedbackMessage && (
        <div className="absolute top-4 z-50 px-5 py-2.5 rounded-2xl bg-rose-600 border-2 border-rose-300 text-white font-black text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <span>{lockedFeedbackMessage}</span>
        </div>
      )}

      {/* Unlock Notice Banner when Pos Detektif newly opens */}
      {justUnlockedDetektif && (
        <div className="absolute top-3 z-40 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-4 border-amber-200 text-amber-950 shadow-2xl flex items-center gap-3 animate-bounce max-w-md">
          <span className="text-3xl">🔓</span>
          <div>
            <h4 className="text-sm sm:text-base font-black font-['Fredoka',sans-serif]">
              Pos Detektif telah terbuka!
            </h4>
            <p className="text-xs font-bold text-amber-900">
              Materi selesai! Sekarang kamu bisa masuk ke Pos Detektif dan memecahkan misi sains!
            </p>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onDismissUnlockBanner();
            }}
            className="ml-auto text-xs font-black bg-white/80 hover:bg-white text-slate-800 px-2 py-1 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Game World Stage with Real 3D Nature Backdrop */}
      <div
        ref={worldRef}
        onClick={handleWorldClick}
        className="relative w-full max-w-5xl h-full rounded-3xl sm:rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-4 sm:border-8 border-amber-900/80 bg-slate-900 cursor-crosshair"
      >
        {/* Real 3D Enchanted Forest High-Resolution Render */}
        <div className="absolute inset-0 z-0">
          <img
            src={GAME_ASSETS.backgrounds.forest}
            alt="Hutan Pengetahuan"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-95 contrast-110 select-none pointer-events-none"
          />
          {/* Subtle Ambient Sunlight Beams & Canopy Shadow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-amber-100/20 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,46,22,0.45)_100%)] pointer-events-none" />
        </div>

        {/* Floating Clouds & Sky Mist */}
        <div className="absolute top-2 inset-x-0 h-14 bg-gradient-to-b from-sky-400/20 to-transparent pointer-events-none z-1" />
        <div className="absolute top-3 left-10 text-2xl opacity-50 animate-pulse pointer-events-none z-1">☁️</div>
        <div className="absolute top-6 right-16 text-3xl opacity-40 pointer-events-none z-1">☁️</div>

        {/* Animated Forest Light Particles / Fireflies */}
        <div className="absolute top-[20%] left-[18%] text-amber-200 text-sm animate-ping pointer-events-none z-10">✨</div>
        <div className="absolute top-[45%] right-[28%] text-yellow-200 text-sm animate-ping pointer-events-none z-10">✨</div>
        <div className="absolute top-[68%] left-[42%] text-emerald-200 text-sm animate-ping pointer-events-none z-10">✨</div>
        <div className="absolute top-[78%] right-[18%] text-amber-100 text-sm animate-ping pointer-events-none z-10">✨</div>

        {/* Top Floating World Realm Signpost */}
        {onOpenWorldPicker && (
          <div className="absolute top-3 left-4 z-30 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playPop();
                onOpenWorldPicker();
              }}
              className="bg-amber-950/85 hover:bg-amber-900 border-2 border-amber-400/80 px-3.5 py-1.5 rounded-2xl text-white shadow-xl backdrop-blur-md flex items-center gap-2 transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="text-xl">🧭</span>
              <div className="text-left">
                <span className="text-[9px] uppercase font-black tracking-widest text-amber-300 block">
                  Peta Belajar MI
                </span>
                <span className="text-xs font-black text-white">
                  {activeMateri ? `${activeMateri.title}` : 'Pilih Materi & Kelas'} ▾
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Fluttering Butterflies */}
        <div className="absolute top-[35%] left-[36%] text-2xl animate-bounce pointer-events-none z-10">🦋</div>
        <div className="absolute top-[55%] right-[22%] text-xl animate-bounce pointer-events-none z-10">🦋</div>

        {/* Subtle Semi-Transparent Cobblestone Path Guides */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
          {/* Village Gate to Pondok */}
          <path
            d="M 12% 82% Q 20% 75% 26% 48%"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="18"
            strokeLinecap="round"
            className="opacity-40"
          />
          <path
            d="M 12% 82% Q 20% 75% 26% 48%"
            fill="none"
            stroke="#B45309"
            strokeWidth="4"
            strokeDasharray="4 8"
            className="opacity-50"
          />

          {/* Pondok to Bioskop */}
          <path
            d="M 26% 48% Q 44% 40% 55% 42% Q 64% 42% 72% 42%"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="16"
            strokeLinecap="round"
            className="opacity-40"
          />
          <path
            d="M 26% 48% Q 44% 40% 55% 42% Q 64% 42% 72% 42%"
            fill="none"
            stroke="#B45309"
            strokeWidth="4"
            strokeDasharray="4 8"
            className="opacity-50"
          />

          {/* Central Crossing to Pos Detektif */}
          <path
            d="M 55% 42% Q 64% 58% 76% 74%"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="16"
            strokeLinecap="round"
            className="opacity-40"
          />
          <path
            d="M 55% 42% Q 64% 58% 76% 74%"
            fill="none"
            stroke="#B45309"
            strokeWidth="4"
            strokeDasharray="4 8"
            className="opacity-50"
          />
        </svg>

        {/* Click Destination Ripple Marker */}
        {targetDestination && (
          <div
            style={{
              left: `${targetDestination.x}%`,
              top: `${targetDestination.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-15 pointer-events-none flex items-center justify-center"
          >
            <div className="w-10 h-10 rounded-full border-2 border-amber-300 bg-amber-400/40 animate-ping" />
            <Footprints size={16} className="text-amber-200 absolute" />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIBRANT NATURE ELEMENTS (Pohon, Sungai, Bunga, Batu)     */}
        {/* ======================================================== */}

        {/* 🌊 Sungai Kecil Berkelok & Jembatan Kayu */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-3">
          {/* River water body */}
          <path
            d="M 0% 50% Q 18% 54% 34% 62% T 65% 58% T 100% 64%"
            fill="none"
            stroke="#0284c7"
            strokeWidth="32"
            strokeLinecap="round"
            className="opacity-80"
          />
          {/* Sparkling River Stream Inner Highlight */}
          <path
            d="M 0% 50% Q 18% 54% 34% 62% T 65% 58% T 100% 64%"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="14"
            strokeLinecap="round"
            className="opacity-90"
          />
          {/* Animated Water foam/sparkles */}
          <path
            d="M 0% 50% Q 18% 54% 34% 62% T 65% 58% T 100% 64%"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeDasharray="6 18"
            className="opacity-80 animate-pulse"
          />
        </svg>

        {/* 🪵 Wooden Bridge across the River */}
        <div
          style={{ left: '30%', top: '59%', transform: 'translate(-50%, -50%)' }}
          className="absolute z-6 pointer-events-none flex flex-col items-center"
        >
          <div className="w-12 h-8 bg-amber-800 border-2 border-amber-950 rounded-md shadow-md flex justify-between px-1 items-center">
            <div className="w-0.5 h-full bg-amber-950/60" />
            <div className="w-0.5 h-full bg-amber-950/60" />
            <div className="w-0.5 h-full bg-amber-950/60" />
            <div className="w-0.5 h-full bg-amber-950/60" />
          </div>
          <span className="text-[10px] -mt-1 font-bold text-amber-200 drop-shadow">🌉 Jembatan</span>
        </div>

        {/* 🌳 Pohon-Pohon Hutan (Trees) */}
        <div style={{ left: '6%', top: '22%' }} className="absolute z-10 pointer-events-none flex flex-col items-center">
          <span className="text-4xl sm:text-5xl filter drop-shadow-lg">🌳</span>
          <div className="w-8 h-2 bg-black/30 rounded-full blur-xs" />
        </div>
        <div style={{ left: '16%', top: '15%' }} className="absolute z-10 pointer-events-none flex flex-col items-center">
          <span className="text-3xl sm:text-4xl filter drop-shadow-md">🌲</span>
        </div>
        <div style={{ left: '46%', top: '16%' }} className="absolute z-10 pointer-events-none flex flex-col items-center">
          <span className="text-4xl sm:text-5xl filter drop-shadow-lg">🌳</span>
        </div>
        <div style={{ left: '88%', top: '20%' }} className="absolute z-10 pointer-events-none flex flex-col items-center">
          <span className="text-4xl sm:text-5xl filter drop-shadow-lg">🌲</span>
        </div>
        <div style={{ left: '92%', top: '50%' }} className="absolute z-10 pointer-events-none flex flex-col items-center">
          <span className="text-3xl sm:text-4xl filter drop-shadow-md">🌳</span>
        </div>
        <div style={{ left: '6%', top: '65%' }} className="absolute z-10 pointer-events-none flex flex-col items-center">
          <span className="text-4xl sm:text-5xl filter drop-shadow-lg">🌳</span>
        </div>
        <div style={{ left: '48%', top: '78%' }} className="absolute z-10 pointer-events-none flex flex-col items-center">
          <span className="text-3xl sm:text-4xl filter drop-shadow-md">🌲</span>
        </div>

        {/* 🌿 Rumput & 🌺 Bunga (Grass & Flowers) */}
        <div style={{ left: '14%', top: '42%' }} className="absolute z-8 pointer-events-none flex items-center gap-1">
          <span className="text-base">🌿</span>
          <span className="text-sm">🌸</span>
        </div>
        <div style={{ left: '38%', top: '38%' }} className="absolute z-8 pointer-events-none flex items-center gap-1">
          <span className="text-base">🌺</span>
          <span className="text-sm">🌿</span>
        </div>
        <div style={{ left: '60%', top: '48%' }} className="absolute z-8 pointer-events-none flex items-center gap-1">
          <span className="text-base">🌼</span>
          <span className="text-sm">🌿</span>
        </div>
        <div style={{ left: '82%', top: '45%' }} className="absolute z-8 pointer-events-none flex items-center gap-1">
          <span className="text-base">🌷</span>
          <span className="text-sm">🌿</span>
        </div>
        <div style={{ left: '22%', top: '76%' }} className="absolute z-8 pointer-events-none flex items-center gap-1">
          <span className="text-base">🌿</span>
          <span className="text-sm">🌻</span>
        </div>
        <div style={{ left: '68%', top: '82%' }} className="absolute z-8 pointer-events-none flex items-center gap-1">
          <span className="text-base">🌺</span>
          <span className="text-sm">🌿</span>
        </div>

        {/* 🪨 Batu-batu Sungai & Alam (Rocks) */}
        <div style={{ left: '22%', top: '56%' }} className="absolute z-8 pointer-events-none text-xl filter drop-shadow">🪨</div>
        <div style={{ left: '50%', top: '64%' }} className="absolute z-8 pointer-events-none text-lg filter drop-shadow">🪨</div>
        <div style={{ left: '74%', top: '54%' }} className="absolute z-8 pointer-events-none text-2xl filter drop-shadow">🪨</div>
        <div style={{ left: '84%', top: '70%' }} className="absolute z-8 pointer-events-none text-lg filter drop-shadow">🪨</div>

        {/* ======================================================== */}
        {/* IN-WORLD BUILDING 1: 🏡 PONDOK MATERI                     */}
        {/* ======================================================== */}
        <div
          id="building-pondok-materi"
          style={{ left: '26%', top: '35%', transform: 'translate(-50%, -50%)' }}
          onClick={(e) => {
            e.stopPropagation();
            handleInteract(BUILDINGS[0]);
          }}
          className="absolute z-20 group cursor-pointer flex flex-col items-center"
        >
          {/* Ground Soft Shadow */}
          <div className="absolute -bottom-2 w-32 h-6 bg-black/40 rounded-full blur-xs pointer-events-none" />

          <div className="relative">
            {completedMateri && (
              <div className="absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[10px] shadow-lg z-30 flex items-center gap-0.5 border border-white">
                <span>✓ SELESAI</span>
              </div>
            )}

            {/* Cozy 3D Wooden Lodge Structure */}
            <div className="relative w-28 sm:w-36 h-28 sm:h-32 bg-amber-100 rounded-3xl border-4 border-amber-900 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-200 ring-4 ring-amber-400/40">
              {/* Wooden Tiled Roof with Chimney */}
              <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-b-2 border-amber-950 flex items-center justify-center">
                {/* Chimney with cute smoke puff */}
                <div className="absolute -top-2 right-4 w-3.5 h-6 bg-rose-900 border border-rose-950 rounded-t">
                  <div className="absolute -top-3 left-0 text-[10px] opacity-70 animate-bounce">
                    💨
                  </div>
                </div>
                <span className="text-2xl filter drop-shadow">🏡</span>
              </div>

              {/* Wooden Cabin Walls */}
              <div className="absolute bottom-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-b from-amber-200 to-amber-300 flex flex-col items-center justify-end p-1">
                {/* Warm Windows with Glowing Interior */}
                <div className="w-full flex justify-around px-2 mb-1.5">
                  <div className="w-5 h-5 bg-yellow-300 border-2 border-amber-800 rounded shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                  <div className="w-5 h-5 bg-yellow-300 border-2 border-amber-800 rounded shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                </div>
                {/* Sturdy Wood Door */}
                <div className="w-7 h-8 bg-amber-900 rounded-t border-t-2 border-x-2 border-amber-950 flex items-center justify-end pr-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Wooden Plaque Signpost */}
          <div className="mt-1.5 px-3 py-1 bg-amber-900 text-amber-100 border-2 border-amber-950 rounded-xl text-xs font-black shadow-lg flex items-center gap-1 group-hover:bg-amber-800 transition">
            <span>🏡</span>
            <span>PONDOK MATERI</span>
          </div>

          {/* Proximity / Interaction Bubble */}
          {nearBuilding?.id === 'pondok' && (
            <div className="mt-1 bg-white border-2 border-emerald-500 px-3 py-1 rounded-xl shadow-2xl animate-bounce text-center z-30">
              <span className="text-[11px] font-black text-emerald-800 block">
                Temukan pengetahuan baru!
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPondok();
                }}
                className="mt-0.5 px-3 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-full shadow"
              >
                MASUK
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* IN-WORLD BUILDING 2: 🎬 BIOSKOP BELAJAR                   */}
        {/* ======================================================== */}
        <div
          id="building-bioskop-belajar"
          style={{ left: '72%', top: '30%', transform: 'translate(-50%, -50%)' }}
          onClick={(e) => {
            e.stopPropagation();
            handleInteract(BUILDINGS[1]);
          }}
          className="absolute z-20 group cursor-pointer flex flex-col items-center"
        >
          {/* Ground Soft Shadow */}
          <div className="absolute -bottom-2 w-32 h-6 bg-black/40 rounded-full blur-xs pointer-events-none" />

          <div className="relative">
            {completedVideo && (
              <div className="absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[10px] shadow-lg z-30 flex items-center gap-0.5 border border-white">
                <span>✓ SELESAI</span>
              </div>
            )}

            {/* Cinema Theater Structure */}
            <div className="relative w-28 sm:w-36 h-28 sm:h-32 bg-slate-900 rounded-3xl border-4 border-slate-950 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-200 ring-4 ring-sky-400/40">
              {/* Marquee Canopy */}
              <div className="absolute top-0 inset-x-0 h-11 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border-b-2 border-red-950 flex items-center justify-center">
                <span className="text-2xl filter drop-shadow">🎬</span>
                <span className="text-[10px] font-black text-yellow-300 ml-1 tracking-wider">CINEMA</span>
              </div>

              {/* Theater Entrance & Poster */}
              <div className="absolute bottom-0 inset-x-0 h-17 bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-end p-1">
                <div className="w-18 h-7 bg-black/80 rounded border border-amber-400/70 flex items-center justify-center text-[11px] text-yellow-300 font-bold mb-1 shadow-inner">
                  ⚡ ENERGI
                </div>
                <div className="w-10 h-7 bg-red-900 border-t-2 border-x-2 border-red-950 rounded-t flex justify-around items-center">
                  <div className="w-0.5 h-full bg-red-950" />
                </div>
              </div>
            </div>
          </div>

          {/* Signpost */}
          <div className="mt-1.5 px-3 py-1 bg-red-800 text-white border-2 border-red-950 rounded-xl text-xs font-black shadow-lg flex items-center gap-1 group-hover:bg-red-700 transition">
            <span>🎬</span>
            <span>BIOSKOP BELAJAR</span>
          </div>

          {/* Proximity Bubble */}
          {nearBuilding?.id === 'bioskop' && (
            <div className="mt-1 bg-white border-2 border-sky-500 px-3 py-1 rounded-xl shadow-2xl animate-bounce text-center z-30">
              <span className="text-[11px] font-black text-sky-800 block">
                Belajar melalui video!
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBioskop();
                }}
                className="mt-0.5 px-3 py-0.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-full shadow"
              >
                MASUK
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* IN-WORLD BUILDING 3: 🔎 POS DETEKTIF                     */}
        {/* ======================================================== */}
        <div
          id="building-pos-detektif"
          style={{ left: '76%', top: '74%', transform: 'translate(-50%, -50%)' }}
          onClick={(e) => {
            e.stopPropagation();
            handleInteract(BUILDINGS[2]);
          }}
          className="absolute z-20 group cursor-pointer flex flex-col items-center"
        >
          {/* Ground Soft Shadow */}
          <div className="absolute -bottom-2 w-32 h-6 bg-black/40 rounded-full blur-xs pointer-events-none" />

          <div className="relative">
            {/* Lock / Unlock Status Badge */}
            <div
              className={`absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full font-black text-[10px] shadow-lg z-30 flex items-center gap-1 border border-white/60 ${
                completedMateri
                  ? completedMission
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-400 text-amber-950 animate-pulse'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              {completedMateri ? (
                <>
                  <Unlock size={11} strokeWidth={3} />
                  <span>{completedMission ? '✓ MISI SELESAI' : 'TERBUKA'}</span>
                </>
              ) : (
                <>
                  <Lock size={11} strokeWidth={3} />
                  <span>TERKUNCI</span>
                </>
              )}
            </div>

            {/* Watchtower / Detective Cabin */}
            <div
              className={`relative w-28 sm:w-36 h-28 sm:h-32 rounded-3xl border-4 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-200 ${
                completedMateri
                  ? 'bg-purple-100 border-purple-950 ring-4 ring-purple-400/60'
                  : 'bg-slate-400 border-slate-700 opacity-90'
              }`}
            >
              {/* Roof */}
              <div
                className={`absolute top-0 inset-x-0 h-11 border-b-2 flex items-center justify-center ${
                  completedMateri
                    ? 'bg-gradient-to-r from-purple-800 to-indigo-900 border-purple-950 text-white'
                    : 'bg-slate-700 border-slate-800 text-slate-300'
                }`}
              >
                <span className="text-2xl filter drop-shadow">🔎</span>
                {completedMateri && <Sparkles size={14} className="text-yellow-300 ml-1 animate-spin" />}
              </div>

              {/* Cabin Walls */}
              <div
                className={`absolute bottom-0 inset-x-0 h-17 flex flex-col items-center justify-end p-1 ${
                  completedMateri ? 'bg-gradient-to-b from-purple-200 to-indigo-200' : 'bg-slate-500'
                }`}
              >
                <div className="w-14 h-6 bg-white/90 rounded border border-purple-400 flex items-center justify-center text-[10px] font-black text-purple-950 mb-1 shadow-xs">
                  POS MISI
                </div>
                <div
                  className={`w-7 h-8 border-t-2 border-x-2 rounded-t ${
                    completedMateri
                      ? 'bg-purple-900 border-purple-950'
                      : 'bg-slate-700 border-slate-800'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Signpost */}
          <div
            className={`mt-1.5 px-3 py-1 border-2 rounded-xl text-xs font-black shadow-lg flex items-center gap-1 transition ${
              completedMateri
                ? 'bg-purple-900 text-purple-100 border-purple-950 group-hover:bg-purple-800'
                : 'bg-slate-800 text-slate-300 border-slate-900'
            }`}
          >
            <span>{completedMateri ? '🔓' : '🔒'}</span>
            <span>POS DETEKTIF</span>
          </div>

          {/* Proximity Bubble */}
          {nearBuilding?.id === 'pos_detektif' && (
            <div className="mt-1 bg-white border-2 border-purple-500 px-3 py-1 rounded-xl shadow-2xl animate-bounce text-center z-30">
              {completedMateri ? (
                <>
                  <span className="text-[11px] font-black text-purple-800 block">
                    Misi Detektif Energi!
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPosDetektif();
                    }}
                    className="mt-0.5 px-3 py-0.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-full shadow"
                  >
                    MASUK
                  </button>
                </>
              ) : (
                <span className="text-[11px] font-black text-rose-700 block">
                  🔒 Selesaikan materi terlebih dahulu.
                </span>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* PLAYER CHARACTER IN THE FOREST WORLD                     */}
        {/* ======================================================== */}
        <div
          id="player-character-avatar"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            transform: 'translate(-50%, -85%)',
          }}
          className="absolute z-30 transition-all duration-300 ease-out pointer-events-none flex flex-col items-center"
        >
          {/* Name Tag Pill floating above character */}
          <div className="mb-0.5 px-2.5 py-0.5 bg-slate-950/85 backdrop-blur-md text-white font-bold text-[10px] sm:text-xs rounded-full border border-amber-300/60 shadow-lg flex items-center gap-1 whitespace-nowrap">
            <span className="text-amber-300">★</span>
            <span>{studentName || 'Petualang'}</span>
          </div>

          {/* 3D Character View Sprite */}
          <CharacterView
            id={characterId}
            size="sm"
            isWalking={isWalking}
            facing={facing}
            className="filter drop-shadow-xl"
          />
        </div>

        {/* ======================================================== */}
        {/* IN-GAME CONTROLS HINT (Desktop & Mobile)                 */}
        {/* ======================================================== */}
        {/* Desktop Hint Bottom Left */}
        <div className="absolute bottom-3 left-3 z-30 hidden sm:flex items-center gap-2 bg-slate-950/80 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold border border-white/20 backdrop-blur-md pointer-events-none shadow-xl">
          <span>🎮 Kontrol Gerak:</span>
          <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 font-mono text-amber-300">W A S D</span>
          <span>/</span>
          <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600 font-mono text-amber-300">Arah Panah</span>
          <span>atau</span>
          <span className="text-amber-200">Klik Tanah</span>
        </div>

        {/* Mobile On-Screen Virtual D-Pad Bottom Left */}
        <div className="absolute bottom-3 left-3 z-30 sm:hidden flex flex-col items-center bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border-2 border-amber-400 shadow-2xl">
          <button
            onClick={() => moveBy(0, -6)}
            className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 flex items-center justify-center shadow active:scale-95 transition cursor-pointer"
            aria-label="Atas"
          >
            <ChevronUp size={20} strokeWidth={3} />
          </button>
          <div className="flex items-center gap-2 my-1">
            <button
              onClick={() => moveBy(-6, 0)}
              className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 flex items-center justify-center shadow active:scale-95 transition cursor-pointer"
              aria-label="Kiri"
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-600" />
            <button
              onClick={() => moveBy(6, 0)}
              className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 flex items-center justify-center shadow active:scale-95 transition cursor-pointer"
              aria-label="Kanan"
            >
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
          <button
            onClick={() => moveBy(0, 6)}
            className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 flex items-center justify-center shadow active:scale-95 transition cursor-pointer"
            aria-label="Bawah"
          >
            <ChevronDown size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Center Proximity Quick Action Button on Mobile when near building */}
        {nearBuilding && (
          <div className="absolute bottom-3 inset-x-0 mx-auto w-fit z-30 sm:hidden">
            <button
              onClick={() => handleInteract(nearBuilding)}
              className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-xs shadow-2xl border-2 border-white flex items-center gap-1.5 animate-bounce cursor-pointer"
            >
              <span>{nearBuilding.name}</span>
              <Play size={12} fill="currentColor" />
              <span>MASUK</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
