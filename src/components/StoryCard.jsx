import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Heart, MessageCircleHeart, MailOpen, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StoryCard({ title, chapter, iconType, storyText, interactiveContent, index }) {
  const [revealed, setRevealed] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  // Trigger romantic colored heart/star confetti explosion
  const handleConfettiHeart = () => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C94C4C', '#EAB8B8', '#F2D6D6']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C94C4C', '#EAB8B8', '#F2D6D6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const getIcon = () => {
    switch (iconType) {
      case 'sparkles':
        return <Sparkles className="w-6 h-6 text-romantic-dark" />;
      case 'book':
        return <BookOpen className="w-6 h-6 text-romantic-dark" />;
      case 'heart':
        return <Heart className="w-6 h-6 text-romantic-dark fill-romantic-dark/30 animate-pulse" />;
      default:
        return <Compass className="w-6 h-6 text-romantic-dark" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto my-24 p-6 md:p-8 rounded-3xl glass-panel relative"
    >
      {/* Dynamic Soft Pink Grid Background Element */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-romantic-pastel/40 rounded-full blur-md" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-romantic-accent/15 rounded-full blur-xl" />

      {/* Chapter Metadata */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-romantic-pastel/60 flex items-center justify-center border border-romantic-accent/40">
          {getIcon()}
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-romantic-dark font-semibold font-sans">
            {chapter}
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-romantic-dark">
            {title}
          </h2>
        </div>
      </div>

      {/* Main Narrative Text */}
      <p className="text-romantic-text font-sans leading-relaxed text-sm md:text-base mb-6 text-left whitespace-pre-line">
        {storyText}
      </p>

      {/* Section-Specific Micro-Interactions */}
      <div className="mt-8 border-t border-romantic-accent/20 pt-6">
        
        {/* CHAPTER 1 (Childhood) INTERACTIVE */}
        {index === 0 && (
          <div className="text-center">
            <button
              onClick={() => setRevealed(!revealed)}
              className="px-5 py-2.5 rounded-full bg-romantic-accent/30 hover:bg-romantic-accent/50 text-romantic-dark font-semibold text-xs md:text-sm transition-all inline-flex items-center gap-2 border border-romantic-accent/60"
            >
              <MessageCircleHeart className="w-4 h-4" />
              {revealed ? "Hide Secret Memory" : "Reveal A Secret Childhood Memory"}
            </button>
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-4 text-left"
                >
                  <div className="p-4 rounded-2xl bg-romantic-warm/60 border border-romantic-accent/30 italic text-xs md:text-sm text-romantic-text">
                    "Even back then, in a world full of crayons and playground games, there was a quiet magic waiting. Little did I know, every starry wish was slowly leading me toward you."
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* CHAPTER 2 (Schooling) INTERACTIVE */}
        {index === 1 && (
          <div className="text-center">
            <button
              onClick={() => setLetterOpen(!letterOpen)}
              className="px-5 py-2.5 rounded-full bg-romantic-accent/30 hover:bg-romantic-accent/50 text-romantic-dark font-semibold text-xs md:text-sm transition-all inline-flex items-center gap-2 border border-romantic-accent/60"
            >
              <MailOpen className="w-4 h-4" />
              {letterOpen ? "Fold Nostalgia Letter" : "Open The High School Desk Letter"}
            </button>
            <AnimatePresence>
              {letterOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-4 text-left"
                >
                  <div className="p-5 rounded-2xl bg-[#FFFDFD] border border-romantic-accent/40 shadow-sm relative font-serif italic text-xs md:text-sm text-romantic-text leading-relaxed">
                    <div className="absolute top-2 right-3 text-lg opacity-25">✏️</div>
                    <p className="mb-2">Dear You,</p>
                    <p className="mb-2">
                      Between textbook assignments and lunch-hour bell rings, our hearts were dreaming of the future. We scribbled notes in margins, hoping for a fairy tale that felt real.
                    </p>
                    <p className="text-right font-bold text-romantic-dark">- From Nostalgia</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* CHAPTER 3 (Life with Him) INTERACTIVE */}
        {index === 2 && (
          <div className="text-center flex flex-col items-center gap-4">
            <p className="text-xs text-romantic-text/60 italic">Tap the heart to celebrate our love</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleConfettiHeart}
              className="w-14 h-14 rounded-full bg-romantic-dark text-white flex items-center justify-center hover:bg-romantic-dark/95 transition-all shadow-md group border border-romantic-dark mb-2"
              title="Celebrate our love"
            >
              <Heart className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
            </motion.button>
            
            <motion.a
              href="https://drive.google.com/drive/u/2/my-drive"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full bg-romantic-dark hover:bg-romantic-dark/90 text-white font-semibold shadow-md border border-romantic-dark transition-all text-xs md:text-sm tracking-wide mt-2 inline-flex items-center gap-2"
            >
              Click here to relive our memories ❤️
            </motion.a>
          </div>
        )}

      </div>
    </motion.div>
  );
}
