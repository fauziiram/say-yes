/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import CreateQuestion from './components/CreateQuestion';
import AnswerQuestion from './components/AnswerQuestion';
import { decodePrank, DecodedPrank } from './utils';

type ActiveScreen = 'CREATE' | 'ANSWER';

export default function App() {
  const [screen, setScreen] = useState<ActiveScreen>('CREATE');
  const [loadedPrank, setLoadedPrank] = useState<DecodedPrank | null>(null);
  const [prankCode, setPrankCode] = useState('');

  // Detect query parameters on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pCode = params.get('p');
    if (pCode) {
      const decoded = decodePrank(pCode);
      if (decoded) {
        setLoadedPrank(decoded);
        setPrankCode(pCode);
        setScreen('ANSWER');
      }
    }
  }, []);

  const handleCreateClick = () => {
    setScreen('CREATE');
  };

  const handleGoBack = () => {
    // Clear URL parameters to return to clean homepage
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setLoadedPrank(null);
    setPrankCode('');
    setScreen('CREATE');
  };

  // Base app URL is dynamic based on current window location
  const appUrl = `${window.location.origin}${window.location.pathname}`;

  return (
    <div className="min-h-screen w-full bg-[#FFF8F9] bg-dots flex flex-col selection:bg-pink-200 selection:text-pink-900 transition-colors duration-500">
      {/* Visual background ambient blobs from Geometric Balance */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-48 h-48 bg-[#FFD1D1] rounded-full opacity-30 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#FFE4E1] rounded-full opacity-40 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-20 text-4xl opacity-15 select-none animate-float">✨</div>
        <div className="absolute bottom-1/4 right-20 text-4xl opacity-15 select-none animate-float-delayed">💖</div>
      </div>

      {/* Navigation Bar from Geometric Balance - Only visible on builder screen */}
      {screen === 'CREATE' && (
        <nav className="w-full px-4 sm:px-6 md:px-12 py-4 md:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 z-10 max-w-6xl mx-auto animate-fade-in">
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={handleGoBack}>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-[#FF748D] rounded-xl flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-pink-200">
              💝
            </div>
            <span className="text-xl md:text-2xl font-bold text-[#4A4A4A] tracking-tight">Say<span className="text-[#FF748D]">Yes!</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-[#FF748D] text-[10px] md:text-xs font-bold bg-[#FFF0F2] px-3 md:px-4 py-2 rounded-full border border-pink-100 shadow-xs">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 animate-pulse shrink-0" />
            <span>Kirim Prank Pertanyaan Gak Bisa Ditolak! 😉</span>
          </div>
        </nav>
      )}

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center w-full relative z-10 py-2 md:py-0">
        <AnimatePresence mode="wait">
          {screen === 'CREATE' && (
            <motion.div
              key="create-prank"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full"
            >
              <CreateQuestion appUrl={appUrl} />
            </motion.div>
          )}

          {screen === 'ANSWER' && loadedPrank && (
            <motion.div
              key="answer-prank"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <AnswerQuestion
                question={loadedPrank.question}
                memeId={loadedPrank.memeId}
                customYesMsg={loadedPrank.customYesMsg}
                onGoBack={handleGoBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer from Geometric Balance */}
      <footer className="w-full px-4 sm:px-12 py-4 md:py-6 flex justify-center border-t border-pink-100/30 relative z-10 mt-4 md:mt-6">
        <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] md:tracking-[0.25em] flex flex-wrap items-center justify-center gap-1.5">
          <span>Dibuat dengan cinta & keisengan</span>
          <span className="text-[#FF748D] animate-pulse">💝</span>
          <span>© {new Date().getFullYear()} SayYes!</span>
        </p>
      </footer>
    </div>
  );
}

