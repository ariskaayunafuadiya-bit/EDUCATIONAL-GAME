import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Play, Pause, RotateCcw, Volume2, Film, Settings, Video } from 'lucide-react';
import { MateriItem } from '../types';
import { ContentStore } from '../utils/contentStore';

interface BioskopModalProps {
  onClose: () => void;
  onComplete: () => void;
  alreadyCompleted: boolean;
  activeMateri?: MateriItem | null;
}

export const BioskopModal: React.FC<BioskopModalProps> = ({
  onClose,
  onComplete,
  alreadyCompleted,
  activeMateri,
}) => {
  const materi = activeMateri || ContentStore.getMateriList()[0];
  const subject = materi ? ContentStore.getSubjects().find((s) => s.id === materi.subjectId) : null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 24 seconds
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showTeacherConfig, setShowTeacherConfig] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [activeVideoUrl, setActiveVideoUrl] = useState(materi?.videoUrl || '');
  const totalDuration = 24;

  const timerRef = useRef<number | null>(null);

  // Dynamic scenes based on materi
  const scenes = [
    {
      time: 0,
      title: `Pengenalan: ${materi?.title || 'Dunia Pembelajaran'}`,
      caption: `Selamat datang di petualangan ilmu ${subject?.name || 'Eduverse'}! Mari kita mulai penjelajahan.`,
      bg: 'from-amber-400 to-orange-500',
      icon: subject?.emoji || '🌟',
      visual: `${materi?.description || 'Memulai petualangan belajar yang seru'} ✨`,
    },
    {
      time: 6,
      title: 'Konsep dan Pengamatan',
      caption: 'Perhatikan fakta-fakta penting di sekitar kita yang berhubungan dengan pelajaran ini.',
      bg: 'from-sky-400 to-teal-500',
      icon: '🔍',
      visual: 'Mengamati dan memahami konsep secara mendalam 📚💡',
    },
    {
      time: 12,
      title: 'Penerapan dalam Kehidupan',
      caption: 'Ilmu yang kita pelajari sangat berguna untuk memecahkan masalah sehari-hari.',
      bg: 'from-indigo-600 to-blue-700',
      icon: '⚡',
      visual: 'Menerapkan pengetahuan dengan bijak dan cermat 🎯🌈',
    },
    {
      time: 18,
      title: 'Hebat! Pengetahuanmu Semakin Luas!',
      caption: 'Kini kamu siap untuk mencoba game kuis dan menyelesaikan misi petualangan.',
      bg: 'from-emerald-500 to-teal-600',
      icon: '🏆',
      visual: 'Bersiap menghadapi tantangan di Hutan Pengetahuan 🏅✨',
    },
  ];

  useEffect(() => {
    if (isPlaying && !activeVideoUrl) {
      timerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeVideoUrl]);

  useEffect(() => {
    let sceneIdx = 0;
    for (let i = scenes.length - 1; i >= 0; i--) {
      if (progress >= scenes[i].time) {
        sceneIdx = i;
        break;
      }
    }
    setCurrentSceneIndex(sceneIdx);
  }, [progress, scenes]);

  const togglePlay = () => {
    sounds.playPop();
    if (progress >= totalDuration) {
      setProgress(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleFinish = () => {
    sounds.playFanfare();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    onComplete();
  };

  const handleApplyCustomVideo = () => {
    sounds.playPop();
    setActiveVideoUrl(customVideoUrl.trim());
    setShowTeacherConfig(false);
  };

  const currentScene = scenes[currentSceneIndex] || scenes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-slate-900 rounded-3xl max-w-2xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Cinema Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">🎬</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-['Fredoka',sans-serif] leading-tight flex items-center gap-2">
                <span>Bioskop Belajar</span>
                <span className="text-xs bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                  {subject ? `${subject.emoji} ${subject.name}` : 'Materi'}
                </span>
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                {materi?.title || 'Video Pembelajaran Interaktif'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playPop();
                setShowTeacherConfig(!showTeacherConfig);
              }}
              className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              title="Ganti Video (Guru)"
            >
              <Settings size={14} />
              <span className="hidden sm:inline">Ganti Video</span>
            </button>
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
        </div>

        {/* Teacher Video Config Collapse */}
        {showTeacherConfig && (
          <div className="bg-slate-800 border-b border-amber-400/40 p-3 sm:p-4 text-xs">
            <h4 className="font-black text-amber-300 flex items-center gap-1.5 mb-1.5">
              <Video size={14} />
              <span>Pengaturan Video Pembelajaran (Guru):</span>
            </h4>
            <p className="text-slate-300 mb-2">
              Guru dapat memasukkan link video YouTube Embed (misal: https://www.youtube.com/embed/...) atau link MP4:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                placeholder="Masukkan link video..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-3 py-1.5 text-white font-medium outline-none focus:border-amber-400 text-xs"
              />
              <button
                onClick={handleApplyCustomVideo}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-1.5 rounded-xl cursor-pointer"
              >
                Terapkan
              </button>
              {activeVideoUrl && (
                <button
                  onClick={() => {
                    setActiveVideoUrl('');
                    setCustomVideoUrl('');
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  Reset Animasi
                </button>
              )}
            </div>
          </div>
        )}

        {/* Video Player Display Screen */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
          {/* Cinema Screen Frame */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border-4 border-slate-700 bg-black flex flex-col items-center justify-between p-4 sm:p-6">
            {activeVideoUrl ? (
              <iframe
                src={activeVideoUrl}
                title={materi?.title || 'Video Pembelajaran'}
                className="w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                {/* Animated Scene Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${currentScene.bg} transition-all duration-1000 opacity-90`}
                />

                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-red-800 to-transparent pointer-events-none" />

                {/* Video Watermark / Tag */}
                <div className="relative z-10 w-full flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 text-xs font-black text-amber-300">
                    <Film size={14} />
                    <span>🎬 {materi?.title || 'Animasi Pembelajaran'}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-mono font-bold text-white">
                    <Volume2 size={13} className="text-emerald-400" />
                    <span>
                      0:{progress < 10 ? `0${progress}` : progress} / 0:{totalDuration}
                    </span>
                  </div>
                </div>

                {/* Center Animated Visual & Icon */}
                <div className="relative z-10 flex flex-col items-center text-center my-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/30 backdrop-blur-md border-2 border-white/50 flex items-center justify-center text-5xl sm:text-6xl shadow-xl animate-bounce">
                    {currentScene.icon}
                  </div>
                  <h4 className="mt-3 text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif] drop-shadow-md">
                    {currentScene.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-yellow-100 font-bold max-w-md mt-1 drop-shadow px-2">
                    {currentScene.caption}
                  </p>
                </div>

                {/* Subtitle / Caption Bar */}
                <div className="relative z-10 w-full bg-black/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 text-center">
                  <p className="text-xs sm:text-sm font-extrabold text-amber-200">
                    {currentScene.visual}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          {!activeVideoUrl && (
            <div className="mt-4 bg-slate-800/80 border border-slate-700 rounded-2xl p-3 sm:p-4">
              <div className="relative w-full h-2.5 bg-slate-700 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${(progress / totalDuration) * 100}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    id="btn-play-video"
                    onClick={togglePlay}
                    className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md active:scale-95 transition cursor-pointer"
                  >
                    {isPlaying ? '⏸️ PAUSE' : '▶️ PLAY'}
                  </button>

                  <button
                    onClick={() => {
                      sounds.playPop();
                      setProgress(0);
                      setIsPlaying(true);
                    }}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition cursor-pointer"
                    title="Ulangi Video"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>

                <button
                  id="btn-selesai-menonton"
                  onClick={handleFinish}
                  className="py-2 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition"
                >
                  <span>✅ SELESAI MENONTON</span>
                  <span className="text-xs bg-emerald-800/60 px-2 py-0.5 rounded-full border border-emerald-300/40">
                    ⭐ +10 XP
                  </span>
                </button>
              </div>
            </div>
          )}

          {activeVideoUrl && (
            <div className="mt-4 flex justify-end">
              <button
                id="btn-selesai-menonton-custom"
                onClick={handleFinish}
                className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm sm:text-base flex items-center gap-2 shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition"
              >
                <span>✅ SELESAI MENONTON</span>
                <span className="text-xs bg-emerald-800/60 px-2 py-0.5 rounded-full border border-emerald-300/40">
                  ⭐ +10 XP
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
