import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, ArrowRight, ArrowLeft, CheckCircle, Sparkles, BookOpen, Zap, Sun } from 'lucide-react';
import { MateriItem } from '../types';
import { ContentStore } from '../utils/contentStore';

interface PondokMateriModalProps {
  onClose: () => void;
  onComplete: () => void;
  alreadyCompleted: boolean;
  activeMateri?: MateriItem | null;
}

export const PondokMateriModal: React.FC<PondokMateriModalProps> = ({
  onClose,
  onComplete,
  alreadyCompleted,
  activeMateri,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompletedState, setIsCompletedState] = useState(alreadyCompleted);

  // Ambil data materi aktif atau fallback demo
  const materi = activeMateri || ContentStore.getMateriList()[0];
  const subject = materi ? ContentStore.getSubjects().find((s) => s.id === materi.subjectId) : null;

  // Build cards from structured cards OR dynamically split content by sections/paragraphs
  const cards = React.useMemo(() => {
    if (materi?.cards && materi.cards.length > 1) {
      return materi.cards;
    }
    if (materi?.content) {
      // Split content by numbered sections or double line breaks
      const sections = materi.content
        .split(/(?:\r?\n){2,}/)
        .map((sec) => sec.trim())
        .filter(Boolean);

      if (sections.length > 1) {
        return sections.map((sec, idx) => {
          const lines = sec.split('\n').map((l) => l.trim()).filter(Boolean);
          const title = lines[0] ? lines[0].replace(/^[\d\.\-\*\#\s]+/, '') : `Bagian ${idx + 1}`;
          const body = lines.slice(1).join(' ') || lines[0];
          return {
            id: `c_${idx}`,
            title: title.length > 40 ? title.slice(0, 40) + '...' : title,
            subtitle: `Bagian ${idx + 1} dari ${sections.length}`,
            emoji: idx === 0 ? '💡' : idx === sections.length - 1 ? '🎯' : '📖',
            explanation: body,
            points: lines.filter((l) => l.startsWith('-') || l.startsWith('•')).map((l) => l.replace(/^[\-\•\s]+/, '')),
          };
        });
      }
    }
    if (materi?.cards && materi.cards.length === 1) {
      return materi.cards;
    }
    return [
      {
        id: 'c_default',
        title: materi?.title || 'Materi Pembelajaran',
        subtitle: 'Pengenalan Materi',
        emoji: '📖',
        explanation: materi?.content || materi?.description || 'Selamat datang di dunia pembelajaran Eduverse.',
        points: materi?.description ? [materi.description] : ['Pahami materi dengan seksama.'],
      },
    ];
  }, [materi]);

  const currentCard = cards[currentIndex] || cards[0];
  const isLastCard = currentIndex === cards.length - 1;

  const handleNext = () => {
    sounds.playPop();
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    sounds.playPop();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = () => {
    sounds.playUnlock();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setIsCompletedState(true);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-100 bg-amber-700/40 px-2 py-0.5 rounded-full inline-block">
                  Pondok Materi • Kelas {materi?.classGrade || 4}
                </span>
                {subject && (
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-100 bg-emerald-700/50 px-2 py-0.5 rounded-full inline-block">
                    {subject.emoji} {subject.name}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black font-['Fredoka',sans-serif] leading-tight">
                {materi?.title || 'Pondok Materi Eduverse'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
            title="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Card Indicator Tabs */}
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wide">
              {currentCard.subtitle || `Kartu ${currentIndex + 1} dari ${cards.length}`}
            </span>
            <div className="flex items-center gap-1.5">
              {cards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playPop();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-8 bg-amber-500 shadow-sm'
                      : idx < currentIndex
                      ? 'w-2.5 bg-amber-300'
                      : 'w-2.5 bg-slate-200'
                  }`}
                  title={`Kartu ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Active Card Content */}
          <div
            className="p-5 sm:p-6 rounded-3xl border-3 border-amber-300 bg-amber-50/70 shadow-sm transition-all duration-300 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-4">
              {/* Card Title & Icon */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-amber-700 flex items-center justify-center text-3xl shadow-sm shrink-0 border-2 border-amber-200">
                  {currentCard.emoji || '📖'}
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700 block">
                    {currentCard.subtitle || `Bagian ${currentIndex + 1}`}
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-amber-950 font-['Fredoka',sans-serif] leading-snug">
                    {currentCard.title}
                  </h4>
                </div>
              </div>

              {/* Card Image if available on first card or single card */}
              {materi?.imageUrl && currentIndex === 0 && (
                <div className="rounded-2xl overflow-hidden border-2 border-amber-200 shadow-xs max-h-48">
                  <img
                    src={materi.imageUrl}
                    alt={materi.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Main Explanation */}
              <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/80 shadow-xs">
                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-line">
                  {currentCard.explanation}
                </p>
              </div>

              {/* Card Video if available on last card or single card */}
              {materi?.videoUrl && (isLastCard || cards.length === 1) && (
                <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-2">
                  <span className="text-xs font-black text-purple-900 block">
                    🎥 Video Pembelajaran Pendukung:
                  </span>
                  {materi.videoUrl.includes('embed') ? (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5">
                      <iframe
                        src={materi.videoUrl}
                        title={materi.title}
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a
                      href={materi.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs inline-flex items-center gap-1.5"
                    >
                      Buka Video Materi ↗
                    </a>
                  )}
                </div>
              )}

              {/* Points / Examples List */}
              {currentCard.points && currentCard.points.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-black text-amber-900 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles size={14} className="text-amber-600" />
                    <span>Poin Pemahaman Penting:</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentCard.points.map((pt, pIdx) => (
                      <div
                        key={pIdx}
                        className="bg-white/80 p-2.5 rounded-xl border border-amber-200/70 flex items-start gap-2 shadow-xs"
                      >
                        <span className="text-xs font-black text-amber-700 bg-amber-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </span>
                        <p className="text-xs font-bold text-slate-700 leading-snug">
                          {pt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reward Alert when Finished */}
          {isCompletedState && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between text-emerald-900 animate-fade-in shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xl shrink-0">
                  🌟
                </div>
                <div>
                  <h5 className="text-sm font-black font-['Fredoka',sans-serif]">
                    Hebat! Pengetahuanmu Bertambah!
                  </h5>
                  <p className="text-xs font-bold text-emerald-700">
                    Kamu telah menyelesaikan materi {materi?.title || 'ini'}.
                  </p>
                </div>
              </div>
              <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full border border-emerald-400 shrink-0">
                ⭐ +{materi?.xpReward || 20} XP
              </span>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-400'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 cursor-pointer'
              }`}
            >
              <span>← KEMBALI</span>
            </button>

            {isLastCard ? (
              <button
                onClick={handleFinish}
                className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm sm:text-base shadow-lg flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95 transition"
              >
                <CheckCircle size={18} />
                <span>SELESAI BELAJAR</span>
                <span className="text-xs bg-emerald-800/60 px-2 py-0.5 rounded-full border border-emerald-300/40">
                  ⭐ +{materi?.xpReward || 20} XP
                </span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm sm:text-base shadow flex items-center gap-1.5 cursor-pointer transform hover:scale-105 active:scale-95 transition"
              >
                <span>BERIKUTNYA →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
