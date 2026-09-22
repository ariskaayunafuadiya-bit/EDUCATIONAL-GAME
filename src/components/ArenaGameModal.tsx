import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Gamepad2, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';

interface ArenaGameModalProps {
  onClose: () => void;
  onAddBonusXp: (amount: number) => void;
  studentName: string;
}

interface QuizItem {
  question: string;
  sourceEnergy: string;
  targetEnergy: string;
  options: { text: string; isCorrect: boolean; emoji: string }[];
  explanation: string;
}

const ARENA_QUIZZES: QuizItem[] = [
  {
    question: 'Benda apa yang mengubah Energi Listrik menjadi Energi Panas untuk merapikan seragam sekolah?',
    sourceEnergy: '⚡ Listrik',
    targetEnergy: '🔥 Panas',
    options: [
      { text: 'Setrika Baju', isCorrect: true, emoji: '👔' },
      { text: 'Kipas Angin', isCorrect: false, emoji: '🌀' },
      { text: 'Lampu Belajar', isCorrect: false, emoji: '💡' },
    ],
    explanation: 'Hebat! Setrika mengalirkan energi listrik dan mengubahnya menjadi panas untuk merapikan pakaian.',
  },
  {
    question: 'Benda apa yang mengubah Energi Listrik menjadi Energi Gerak untuk menghaluskan buah dan membuat jus segar?',
    sourceEnergy: '⚡ Listrik',
    targetEnergy: '🌬️ Gerak',
    options: [
      { text: 'Blender Buah', isCorrect: true, emoji: '🥤' },
      { text: 'Panci Masak', isCorrect: false, emoji: '🍳' },
      { text: 'Radio Musik', isCorrect: false, emoji: '📻' },
    ],
    explanation: 'Benar sekali! Pisau blender berputar kencang karena digerakkan oleh motor listrik.',
  },
];

export const ArenaGameModal: React.FC<ArenaGameModalProps> = ({
  onClose,
  onAddBonusXp,
  studentName,
}) => {
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [completedAll, setCompletedAll] = useState(false);

  const quiz = ARENA_QUIZZES[currentQuizIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOptionIdx(idx);
    setIsAnswered(true);

    const isCorrect = quiz.options[idx].isCorrect;
    if (isCorrect) {
      sounds.playCorrect();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onAddBonusXp(15);
    } else {
      sounds.playWrong();
    }
  };

  const handleNextQuiz = () => {
    sounds.playPop();
    if (currentQuizIdx < ARENA_QUIZZES.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
    } else {
      sounds.playFanfare();
      setCompletedAll(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-rose-400 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-5 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🎮</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-['Fredoka',sans-serif] leading-tight">
                Arena Game EDUVERSE
              </h3>
              <p className="text-xs text-rose-100 font-bold">
                Tantangan Sains: Perubahan Energi
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {completedAll ? (
            <div className="text-center py-6 space-y-4 animate-scale-up">
              <div className="text-5xl animate-bounce">🏆</div>
              <h4 className="text-2xl font-black text-slate-800 font-['Fredoka',sans-serif]">
                Juara Arena Sains!
              </h4>
              <p className="text-sm font-bold text-slate-600">
                Luar biasa, {studentName}! Kamu berhasil menaklukkan tantangan di Arena Game yang baru saja kamu buka!
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 inline-block font-black text-amber-900">
                ⭐ +15 Bonus XP Berhasil Diraih!
              </div>
              <button
                onClick={() => {
                  sounds.playPop();
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-base shadow-md cursor-pointer"
              >
                Kembali ke Peta Petualangan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Energy transformation badge */}
              <div className="flex items-center justify-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-900 text-xs font-black rounded-full border border-yellow-300">
                  {quiz.sourceEnergy}
                </span>
                <span className="text-rose-500 font-black">➔ DIUBAH KE ➔</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-900 text-xs font-black rounded-full border border-orange-300">
                  {quiz.targetEnergy}
                </span>
              </div>

              {/* Question */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <h4 className="text-sm sm:text-base font-black text-slate-800 leading-snug">
                  {quiz.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {quiz.options.map((opt, idx) => {
                  const isSelected = selectedOptionIdx === idx;
                  let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';

                  if (isAnswered) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black ring-2 ring-emerald-400';
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-black';
                    } else {
                      btnStyle = 'opacity-50 bg-slate-100 border-slate-200 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition transform active:scale-98 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-sm font-bold">{opt.text}</span>
                      </div>
                      {isAnswered && opt.isCorrect && (
                        <span className="text-emerald-600 font-black text-xs">✓ BENAR (+15 XP)</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {isAnswered && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 animate-fade-in">
                  {quiz.explanation}
                </div>
              )}

              {/* Next button */}
              {isAnswered && (
                <button
                  onClick={handleNextQuiz}
                  className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <span>Lanjut Tantangan</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
