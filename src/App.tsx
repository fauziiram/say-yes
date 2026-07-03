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

    // Redirect to github repository if anyone wants the source code
    const pathname = window.location.pathname.toLowerCase();
    const isSourceRedirect = params.has('source') || params.has('github') || params.has('code') || 
                             pathname.endsWith('/source') || pathname.endsWith('/github') || pathname.endsWith('/code');
    if (isSourceRedirect) {
      window.location.replace('https://github.com/fauziiram/say-yes');
      return;
    }

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
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-1.5 text-[#FF748D] text-[10px] md:text-xs font-bold bg-[#FFF0F2] px-3 md:px-4 py-2 rounded-full border border-pink-100 shadow-xs">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 animate-pulse shrink-0" />
              <span>Kirim Prank Pertanyaan Gak Bisa Ditolak! 😉</span>
            </div>
            <a
              href="https://github.com/fauziiram/say-yes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#FF748D] text-[10px] md:text-xs font-bold bg-white hover:bg-[#FFF0F2] px-3 md:px-4 py-2 rounded-full border border-gray-200 hover:border-pink-100 shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Source Code</span>
            </a>
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
      {screen === 'CREATE' && (
        <footer className="w-full px-4 sm:px-12 py-4 md:py-6 flex flex-col items-center justify-center gap-3 border-t border-pink-100/30 relative z-10 mt-4 md:mt-6 animate-fade-in">
          <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] md:tracking-[0.25em] flex flex-wrap items-center justify-center gap-1.5">
            <span>Dibuat oleh</span>
            <a
              href="https://instagram.com/fauzirammm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF748D] hover:underline normal-case font-extrabold"
            >
              @fauzirammm
            </a>
            <span className="text-[#FF748D] animate-pulse">💝</span>
            <span>© {new Date().getFullYear()} SayYes!</span>
          </p>
          <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold text-gray-500">
            <a
              href="https://github.com/fauziiram/say-yes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF748D] transition-colors flex items-center gap-1 bg-[#FFF0F2] text-[#FF748D] px-2.5 py-1 rounded-full border border-pink-100"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Source Code</span>
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://www.linkedin.com/in/fauzi-ramdani-747978249/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-600 transition-colors flex items-center gap-1 bg-sky-50 text-sky-600 px-2.5 py-1 rounded-full border border-sky-100"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}

