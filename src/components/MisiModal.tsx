import React from 'react';
import { sounds } from '../utils/audio';
import { X, CheckCircle2, Circle, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { MateriItem, GameItem, MisiItem } from '../types';

interface MisiModalProps {
  onClose: () => void;
  completedMateri: boolean;
  completedVideo: boolean;
  completedMission: boolean;
  onNavigateTo: (target: 'pondok' | 'bioskop' | 'pos_detektif' | 'map') => void;
  currentScreen: string;
  activeMateri?: MateriItem | null;
  activeGame?: GameItem | null;
  activeMisi?: MisiItem | null;
}

export const MisiModal: React.FC<MisiModalProps> = ({
  onClose,
  completedMateri,
  completedVideo,
  completedMission,
  onNavigateTo,
  currentScreen,
  activeMateri,
  activeGame,
  activeMisi,
}) => {
  const materiTitle = activeMateri?.title || 'Pondok Materi';
  const gameTitle = activeGame?.title || 'Pos Detektif / Game Arena';
  const materiXp = activeMateri?.xpReward || 20;
  const gameXp = activeGame?.xpReward || 30;

  const quests = [
    {
      id: 'materi',
      title: `Pondok Materi: ${materiTitle}`,
      desc: `Pelajari konsep materi kartu demi kartu dan raih +${materiXp} XP!`,
      isDone: completedMateri,
      target: 'pondok' as const,
      xp: materiXp,
    },
    {
      id: 'video',
      title: `Bioskop Belajar: Animasi Pembelajaran`,
      desc: 'Saksikan video pembelajaran interaktif dan dapatkan +10 XP.',
      isDone: completedVideo,
      target: 'bioskop' as const,
      xp: 10,
    },
    {
      id: 'detektif',
      title: `${activeGame?.type === 'quiz' ? 'Arena Kuis' : 'Pos Detektif'}: ${gameTitle}`,
      desc: activeGame?.instruction || 'Selesaikan tantangan kuis/detektif untuk membuka lencana prestasi!',
      isDone: completedMission,
      target: 'pos_detektif' as const,
      xp: gameXp,
    },
    {
      id: 'arena',
      title: 'Jelajahi Peta Petualangan EDUVERSE',
      desc: 'Buka arena dan lokasi baru di Peta Petualangan bersama Alya & Rafi.',
      isDone: completedMission,
      target: 'map' as const,
      xp: 15,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 px-5 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-['Fredoka',sans-serif] leading-tight">
                Daftar Misi Petualang
              </h3>
              <p className="text-xs text-amber-100 font-bold">
                Jejak Petualangan Pembelajaran
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quest List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {quests.map((q) => (
            <div
              key={q.id}
              className={`p-3.5 rounded-2xl border-2 transition ${
                q.isDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-400'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  {q.isDone ? (
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  ) : (
                    <Circle size={20} className="text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-black font-['Fredoka',sans-serif]">
                      {q.title}
                    </h4>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        q.isDone
                          ? 'bg-emerald-200 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      +{q.xp} XP
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mt-1">
                    {q.desc}
                  </p>

                  {!q.isDone && (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onClose();
                        onNavigateTo(q.target);
                      }}
                      className="mt-2 text-xs font-black text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Kerjakan Misi</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
