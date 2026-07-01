import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, HelpCircle, RefreshCw, Sparkles, Smile, X, ShieldAlert, Award } from 'lucide-react';
import { ESCAPE_PHRASES, SUCCESS_MESSAGES, MEME_PRESETS } from '../templates';
import ConfettiEffect from './Confetti';

interface AnswerQuestionProps {
  question: string;
  memeId: string;
  customYesMsg?: string;
  onGoBack: () => void;
}

export default function AnswerQuestion({ question, memeId, customYesMsg, onGoBack }: AnswerQuestionProps) {
  const [isYes, setIsYes] = useState(false);
  const [tidakPos, setTidakPos] = useState({ x: 0, y: 0 });
  const [tidakScale, setTidakScale] = useState(1);
  const [tidakRotate, setTidakRotate] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showPhrase, setShowPhrase] = useState(false);

  const [isCheaterPopup, setIsCheaterPopup] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (customYesMsg && customYesMsg.trim() !== '') {
      setSuccessMessage(customYesMsg);
    } else {
      const randomMsg = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
      setSuccessMessage(randomMsg);
    }
  }, [customYesMsg]);

  const preset = MEME_PRESETS.find(p => p.id === memeId) || MEME_PRESETS[0];

  const moveTidakButton = () => {
    setNoAttempts(prev => prev + 1);
    setPhraseIndex((prev) => (prev + 1) % ESCAPE_PHRASES.length);
    setShowPhrase(true);

    if (cardRef.current && noButtonRef.current) {
      const card = cardRef.current.getBoundingClientRect();
      const maxX = card.width * 0.38;
      const maxY = 90;

      let newX = (Math.random() - 0.5) * maxX * 2;
      let newY = (Math.random() - 0.5) * maxY * 2;

      if (Math.abs(newX) < 30 && Math.abs(newY) < 30) {
        newX = newX > 0 ? newX + 45 : newX - 45;
        newY = newY > 0 ? newY + 45 : newY - 45;
      }

      const randomScale = 0.6 + Math.random() * 0.6;
      const randomRotation = (Math.random() - 0.5) * 60;

      setTidakPos({ x: newX, y: newY });
      setTidakScale(randomScale);
      setTidakRotate(randomRotation);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isYes || !noButtonRef.current) return;

      const button = noButtonRef.current;
      const rect = button.getBoundingClientRect();

      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - btnCenterX;
      const dy = e.clientY - btnCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 85) {
        moveTidakButton();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isYes]);

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCheaterPopup(true);
    moveTidakButton();
  };

  const handleYesClick = () => {
    setIsYes(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 md:py-10 relative">
      {isYes && <ConfettiEffect type={preset.animationType === 'heart' ? 'heart' : 'all'} />}

      <AnimatePresence mode="wait">
        {!isYes ? (
          <motion.div
            key="question-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border-2 border-pink-100 rounded-[40px] p-5 md:p-8 shadow-geometric border-b-8 border-pink-50 relative bg-dots flex flex-col"
            ref={cardRef}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF748D] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md z-20 whitespace-nowrap">
              Urgent Question! 🥺
            </div>

            <div className="absolute -bottom-5 -right-5 w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-2xl rotate-12 shadow-inner border-2 border-white select-none z-10">
              🐱
            </div>
            <div className="absolute -top-5 -left-5 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-lg -rotate-12 shadow-inner border-2 border-white select-none z-10">
              🍬
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 font-bold border-b border-pink-50 pb-3 mb-4 mt-3">
              <span className="flex items-center gap-1.5 text-[#FF748D] z-10">
                <Heart className="w-4 h-4 fill-[#FF748D] text-[#FF748D] animate-pulse" />
                <span className="hidden sm:inline">Pesan Spesial Buatmu</span>
              </span>
              <span className="bg-[#FFF0F2] text-[#FF748D] px-2.5 py-0.5 rounded-full text-[10px] z-10 whitespace-nowrap">
                Prank Interaktif 🤫
              </span>
            </div>

            <div className="h-8 flex items-center justify-center z-10">
              <AnimatePresence mode="wait">
                {showPhrase && (
                  <motion.div
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                    className="bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1"
                  >
                    <span>💬</span>
                    <span>{ESCAPE_PHRASES[phraseIndex]}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-center px-2 py-6 md:py-8 my-auto z-10">
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-xl md:text-3xl font-black text-[#4A4A4A] font-display leading-snug tracking-tight drop-shadow-xs break-words"
              >
                {question || "Mau nonton bioskop bareng aku? 🎬🍿"}
              </motion.h2>
            </div>

            {noAttempts > 0 && (
              <div className="text-center mb-4 z-10">
                <span className="text-[10px] bg-pink-50 text-[#FF748D] font-bold px-3 py-1 rounded-full border border-pink-100 shadow-xs">
                  Gagal Nolak: {noAttempts}x 😜
                </span>
              </div>
            )}

            <div className="relative min-h-[80px] mt-auto pt-4 border-t border-pink-50">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYesClick}
                id="btn-answer-yes"
                className="bg-[#FF748D] hover:bg-[#ff5f7c] text-white font-black text-sm md:text-lg py-3 md:py-4 px-5 md:px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-rose-600 z-10"
              >
                <Heart className="w-4 h-4 md:w-5 md:h-5 fill-white text-white animate-pulse" />
                <span>Iya ❤️</span>
              </motion.button>

              <motion.button
                ref={noButtonRef}
                animate={{
                  x: tidakPos.x,
                  y: tidakPos.y,
                  scale: tidakScale,
                  rotate: tidakRotate,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                onMouseEnter={moveTidakButton}
                onTouchStart={(e) => {
                  e.preventDefault();
                  moveTidakButton();
                }}
                onClick={handleNoClick}
                id="btn-answer-no"
                className="bg-[#4A4A4A] hover:bg-neutral-800 text-white font-extrabold text-sm md:text-base py-3 md:py-4 px-4 md:px-5 rounded-2xl shadow-md cursor-pointer border-b-4 border-neutral-700 select-none absolute right-2 top-4 z-10"
                style={{ touchAction: 'none' }}
              >
                <span>Tidak ❌</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-gradient-to-b ${preset.bgColor} border-2 border-pink-100 rounded-[40px] p-5 md:p-10 shadow-geometric border-b-8 border-pink-100 relative overflow-hidden text-center`}
          >
            <div className="absolute top-6 left-6 text-xl md:text-2xl animate-float">✨</div>
            <div className="absolute top-10 right-8 text-xl md:text-2xl animate-float-delayed">💖</div>
            <div className="absolute bottom-12 left-10 text-lg md:text-xl animate-float-delayed">⭐</div>

            <div className="space-y-5 md:space-y-8 py-4 md:py-6">
              <div className="inline-flex items-center gap-1.5 bg-white/90 border border-pink-200 px-4 py-1.5 rounded-full text-xs font-bold text-[#FF748D] shadow-xs">
                <Award className="w-4 h-4 text-[#FF748D] fill-pink-100" />
                <span>Mission Accomplished! 🏆</span>
              </div>

              <div className="relative inline-block mx-auto">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }}
                  className="w-28 h-28 md:w-44 md:h-44 bg-white rounded-full shadow-lg border-4 border-pink-200 flex items-center justify-center text-6xl md:text-8xl relative z-10"
                >
                  {preset.emoji}
                </motion.div>

                {preset.animationType === 'cat' && (
                  <div className="absolute inset-0 z-0">
                    <span className="absolute -top-4 -left-4 text-xl md:text-2xl animate-bounce">🎵</span>
                    <span className="absolute top-1/2 -right-6 text-2xl md:text-3xl animate-pulse">😻</span>
                    <span className="absolute -bottom-2 left-1/4 text-xl md:text-2xl">🐾</span>
                  </div>
                )}
                {preset.animationType === 'heart' && (
                  <div className="absolute inset-0 z-0">
                    <span className="absolute -top-3 left-10 text-2xl md:text-3xl animate-bounce">💕</span>
                    <span className="absolute bottom-4 -right-4 text-2xl md:text-3xl animate-pulse">💋</span>
                    <span className="absolute top-1/2 -left-8 text-xl md:text-2xl">🌹</span>
                  </div>
                )}
                {preset.animationType === 'star' && (
                  <div className="absolute inset-0 z-0 animate-spin-slow">
                    <span className="absolute top-0 left-0 text-2xl md:text-3xl">⭐</span>
                    <span className="absolute bottom-0 right-0 text-2xl md:text-3xl">✨</span>
                    <span className="absolute top-1/2 -right-4 text-xl md:text-2xl">🔥</span>
                  </div>
                )}
                {preset.animationType === 'bear' && (
                  <div className="absolute inset-0 z-0">
                    <span className="absolute -top-4 right-2 text-xl md:text-2xl animate-bounce">💝</span>
                    <span className="absolute bottom-2 -left-4 text-2xl md:text-3xl">🧸</span>
                    <span className="absolute top-1/2 -right-8 text-xl md:text-2xl">🥰</span>
                  </div>
                )}
                {preset.animationType === 'dino' && (
                  <div className="absolute inset-0 z-0">
                    <span className="absolute -top-2 -left-4 text-2xl md:text-3xl">🦕</span>
                    <span className="absolute bottom-2 -right-2 text-2xl md:text-3xl animate-bounce">🦖</span>
                    <span className="absolute top-1/3 right-1/2 text-xl md:text-2xl">🌴</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 px-2">
                <h3 className="text-2xl md:text-3xl font-black font-display text-[#4A4A4A] drop-shadow-xs leading-tight">
                  {preset.title} 🎉
                </h3>

                <div className="bg-white/95 border border-pink-100 rounded-3xl p-4 md:p-5 shadow-xs inline-block max-w-sm">
                  <p className="text-gray-700 font-extrabold text-sm md:text-lg leading-relaxed">
                    {successMessage}
                  </p>
                </div>
              </div>

              {noAttempts > 0 && (
                <p className="text-xs text-gray-500 font-bold px-2">
                  *Fakta seru: Kamu sempat mencoba menolak sebanyak <strong>{noAttempts} kali</strong> sebelum akhirnya pasrah! 😂🏆
                </p>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={onGoBack}
                  className="bg-[#FFF0F2] hover:bg-[#ffe0e4] text-[#FF748D] font-extrabold py-3 px-6 rounded-2xl transition-all text-xs md:text-sm shadow-xs flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Smile className="w-4 h-4 text-[#FF748D]" />
                  <span>Bikin Prank Baru</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheaterPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl p-5 max-w-xs w-full text-center shadow-2xl border-2 border-rose-300 relative overflow-hidden"
            >
              <div className="text-4xl mb-3 animate-bounce">🛡️🤪</div>
              <h4 className="text-lg font-black text-rose-600 mb-2 font-display flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-5 h-5" />
                <span>Cheater Detected!</span>
              </h4>
              <p className="text-gray-600 text-xs font-semibold leading-relaxed mb-4">
                Wah, jari kamu lincah banget! Tapi mohon maaf, pilihan <strong className="text-rose-500">"Tidak"</strong> sedang mudik ke luar negeri atau tidak tersedia di galaksi ini. Silakan pilih "Iya" ya! 😂🚀
              </p>
              <button
                onClick={() => setIsCheaterPopup(false)}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Kembali & Pilih Iya 💖
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
