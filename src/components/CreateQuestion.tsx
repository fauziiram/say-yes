import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Check, Send, Heart, Eye, RefreshCw, MessageCircle, AlertCircle } from 'lucide-react';
import { QUESTION_TEMPLATES, MEME_PRESETS, SUCCESS_MESSAGES } from '../templates';
import { encodePrank, getShareUrls } from '../utils';

interface CreateQuestionProps {
  appUrl: string;
}

export default function CreateQuestion({ appUrl }: CreateQuestionProps) {
  const [question, setQuestion] = useState(QUESTION_TEMPLATES[0]);
  const [memeId, setMemeId] = useState(MEME_PRESETS[0].id);
  const [customYesMsg, setCustomYesMsg] = useState('');
  
  // States for link generation
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Template randomizer
  const randomizeQuestion = () => {
    const currentIndex = QUESTION_TEMPLATES.indexOf(question);
    let nextIndex = Math.floor(Math.random() * QUESTION_TEMPLATES.length);
    while (nextIndex === currentIndex && QUESTION_TEMPLATES.length > 1) {
      nextIndex = Math.floor(Math.random() * QUESTION_TEMPLATES.length);
    }
    setQuestion(QUESTION_TEMPLATES[nextIndex]);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsGenerating(true);
    
    // Simulate slight delay for ultra-cute loading animation
    setTimeout(() => {
      const code = encodePrank(question.trim(), memeId, customYesMsg.trim());
      // Create shareable link
      // If appUrl doesn't have trail slash, add it
      const base = appUrl.endsWith('/') ? appUrl : `${appUrl}/`;
      const link = `${base}?p=${encodeURIComponent(code)}`;
      setGeneratedLink(link);
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin link:", err);
    }
  };

  const currentPreset = MEME_PRESETS.find(p => p.id === memeId) || MEME_PRESETS[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 md:py-10">
      {/* Beautiful Welcome Header */}
      <div className="text-center mb-6 md:mb-10 max-w-xl mx-auto space-y-2 md:space-y-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block bg-[#FFF0F2] text-[#FF748D] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs border border-pink-100"
        >
          Prank Pertanyaan Interaktif 🎀
        </motion.div>
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-4xl font-black tracking-tight text-[#4A4A4A] font-display"
        >
          Buat Prank <span className="text-[#FF748D]">SayYes!</span> 💝
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-[11px] md:text-sm leading-relaxed px-2"
        >
          Tulis pertanyaan jebakan kocak yang <strong className="text-[#FF748D]">tidak bisa ditolak</strong> oleh pacar, gebetan, atau temanmu! Salin linknya lalu kirim lewat chat! 😂🔒
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor (7 cols) - Styled with Geometric Balance */}
        <div className="lg:col-span-7 bg-white rounded-[40px] p-6 md:p-8 shadow-geometric border-b-8 border-pink-50 relative">
          <h2 className="text-2xl font-extrabold text-[#4A4A4A] mb-6 font-display flex items-center gap-2">
            Desain Prank Kamu 📝✨
          </h2>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Input Question */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-bold text-sm flex items-center gap-1">
                  <span>1. Tulis Pertanyaanmu</span>
                  <span className="text-[#FF748D]">*</span>
                </label>
                <button
                  type="button"
                  onClick={randomizeQuestion}
                  className="text-xs text-[#FF748D] hover:text-[#ff5f7c] flex items-center gap-1 transition-colors font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
                  Acak Pertanyaan
                </button>
              </div>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={100}
                placeholder="Contoh: Mau nonton bioskop bareng aku besok? 🍿"
                rows={2}
                id="input-custom-question"
                className="w-full border-2 border-pink-100 focus:border-[#FF748D] rounded-2xl p-4 text-sm font-semibold outline-hidden transition-all text-gray-700 placeholder-pink-200 resize-none bg-[#FFF8F9]/50"
                required
              />

              {/* Template quick picks */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-gray-400 block mb-1.5">Klik template cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {QUESTION_TEMPLATES.slice(0, 5).map((t, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setQuestion(t)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all text-left truncate max-w-xs cursor-pointer font-medium ${
                        question === t
                          ? 'bg-[#FFF0F2] text-[#FF748D] border-[#FF748D] font-bold shadow-xs'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-[#FFF0F2] hover:text-[#FF748D] hover:border-pink-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Success Message */}
            <div className="space-y-2">
              <label className="text-gray-700 font-bold text-sm flex items-center gap-1">
                <span>2. Pesan setelah pilih "Iya" ❤️</span>
                <span className="text-gray-400 text-xs font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                value={customYesMsg}
                onChange={(e) => setCustomYesMsg(e.target.value)}
                maxLength={80}
                placeholder="Contoh: Aaaa so sweet! Aku tunggu ya besok! 🥰🚀"
                id="input-success-msg"
                className="w-full border-2 border-pink-100 focus:border-[#FF748D] rounded-2xl px-4 py-3 text-sm font-medium outline-hidden transition-all text-gray-700 placeholder-pink-200 bg-[#FFF8F9]/50"
              />
              <p className="text-[11px] text-gray-400 leading-normal">
                Jika dikosongkan, akan memakai pesan manis acak yang sudah disiapkan otomatis!
              </p>
            </div>

            {/* Meme Reaction Preset Grid */}
            <div className="space-y-3">
              <label className="text-gray-700 font-bold text-sm block">
                3. Pilih Animasi Perayaan & Meme 🎉
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {MEME_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setMemeId(p.id)}
                    className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                      memeId === p.id
                        ? 'bg-gradient-to-br from-[#FFF0F2] to-rose-50 border-[#FF748D] shadow-xs font-bold'
                        : 'bg-white border-gray-100 hover:border-pink-200'
                    }`}
                  >
                    <div className="text-2xl bg-[#FFF0F2] w-12 h-12 rounded-xl flex items-center justify-center border border-pink-50 shrink-0">
                      {p.emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{p.name}</p>
                      <p className="text-gray-400 text-[11px] leading-tight truncate">{p.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              id="btn-generate-prank-link"
              className={`w-full bg-gradient-to-r from-[#FF748D] to-rose-500 hover:from-[#ff5f7c] hover:to-rose-600 text-white font-extrabold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Sedang Menyiapkan Jebakan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Link Prank 💖</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Real-time Live Preview (5 cols) - Styled with Geometric Balance */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/50 rounded-[32px] p-5 border-2 border-pink-100 shadow-sm">
            <span className="text-xs font-bold text-gray-400 mb-4 block flex items-center gap-1 tracking-wider uppercase">
              <Eye className="w-3.5 h-3.5 text-[#FF748D]" /> LIVE PREVIEW (TAMPILAN PASANGAN/TEMAN)
            </span>
            
            {/* Prank card live mock matched with design style */}
            <div className="bg-white rounded-[40px] p-6 md:p-8 shadow-geometric border-b-8 border-pink-50 flex flex-col justify-between min-h-[320px] md:min-h-[380px] relative overflow-hidden bg-dots">
              {/* Floating Status Label from Geometric Balance */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF748D] text-white px-5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xs z-10">
                Urgent Question! 🥺
              </div>

              {/* Decorative Elements from Geometric Balance */}
              <div className="absolute -bottom-5 -right-5 w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-xl rotate-12 shadow-inner border-2 border-white select-none">
                🐱
              </div>
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-lg -rotate-12 shadow-inner border-2 border-white select-none">
                🍬
              </div>

              {/* Card top */}
              <div className="text-center pt-3">
                <span className="inline-block bg-[#FFF0F2] text-[#FF748D] text-[9px] md:text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  💌 Spesial Buat Kamu
                </span>
              </div>

              {/* Question body */}
              <div className="text-center px-2 py-3 md:py-4 my-auto relative z-10">
                <h3 className="text-base md:text-xl font-bold text-[#4A4A4A] leading-tight tracking-tight drop-shadow-xs break-words">
                  {question || "Tulis pertanyaanmu di sebelah kiri... 💭"}
                </h3>
              </div>

              {/* Visual Meme selection preview */}
              <div className="text-center my-1 z-10">
                <div className="bg-[#FFF0F2] inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-pink-50 text-[11px] text-[#FF748D] font-bold">
                  <span>Animasi:</span>
                  <strong>{currentPreset.emoji} {currentPreset.name.split(' ').slice(1).join(' ')}</strong>
                </div>
              </div>

              {/* Action Buttons styled like Geometric Balance buttons */}
              <div className="flex justify-center items-center gap-4 mt-3 relative z-10">
                <div className="bg-[#FF748D] text-white rounded-xl py-2.5 md:py-3 px-5 md:px-6 text-center font-bold text-xs shadow-md shadow-pink-200">
                  Iya ❤️
                </div>
                <div className="bg-gray-100 text-gray-400 rounded-xl py-2 md:py-2.5 px-4 md:px-5 text-center font-bold text-xs border border-dashed border-gray-200">
                  Tidak ❌
                </div>
              </div>
            </div>
          </div>

          {/* Tips box */}
          <div className="bg-pink-50/50 border border-pink-100 rounded-[24px] p-5 text-xs text-pink-900 space-y-1.5 shadow-xs">
            <h4 className="font-bold flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" /> Tips Seru:
            </h4>
            <p className="leading-relaxed">
              Tombol <strong className="text-rose-500">"Tidak"</strong> didesain dengan kecerdasan kabur otomatis. Makin dikejar, makin lincah lari, muter-muter, melompat, dan mengecil! Dijamin doi frustasi dan ngakak sampai menyerah lalu tekan <strong className="text-emerald-600">"Iya"</strong>! 😹🏆
            </p>
          </div>
        </div>
      </div>

      {/* Share Overlay Modal */}
      <AnimatePresence>
        {generatedLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-6 md:p-8 max-w-lg w-full shadow-geometric border-b-8 border-pink-100 relative overflow-hidden"
            >
              {/* Floating ribbon */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#FFF0F2] rounded-full -z-0 opacity-80" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-pink-100/20 rounded-full -z-0 opacity-80" />

              <div className="relative text-center space-y-6">
                <div className="text-5xl">🎉✨💌</div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#4A4A4A] font-display">Link Prank Siap Dikirim!</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto leading-normal">
                    Salin link di bawah ini lalu kirim ke pacar atau temanmu melalui chat sosial mediamu!
                  </p>
                </div>

                {/* Input box to show and copy link */}
                <div className="bg-[#FFF8F9] border-2 border-pink-100 rounded-2xl p-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    id="output-generated-link"
                    className="flex-1 bg-transparent border-0 outline-hidden text-xs md:text-sm font-bold text-[#FF748D] select-all overflow-ellipsis truncate"
                  />
                  <button
                    onClick={copyToClipboard}
                    id="btn-copy-link"
                    className={`p-2.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                      copied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-[#FF748D] border border-pink-200 hover:bg-[#FFF0F2]'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-bold">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-xs font-bold">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Social Share grid */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Kirim Langsung Lewat:</span>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Share WhatsApp */}
                    <a
                      href={getShareUrls(generatedLink, question).whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#1ebd57] text-white py-3 px-4 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Share Telegram */}
                    <a
                      href={getShareUrls(generatedLink, question).telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0088cc] hover:bg-[#0077b3] text-white py-3 px-4 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Telegram</span>
                    </a>
                  </div>

                  <div className="pt-2 text-[11px] text-gray-400 leading-normal">
                    Tip: Klik tombol salin link dan kirim ke obrolan <strong>Discord, Instagram, Line</strong> atau platform favoritmu lainnya!
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setGeneratedLink('')}
                  className="w-full bg-[#FFF0F2] text-[#FF748D] hover:bg-[#ffe0e4] font-bold py-3.5 px-6 rounded-2xl transition-all text-sm cursor-pointer"
                >
                  Buat Pertanyaan Lain
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
