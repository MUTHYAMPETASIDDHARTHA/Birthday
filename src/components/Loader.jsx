import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const quotes = [
  "Gathering stardust to paint our memories...",
  "Assembling the puzzle of our beautiful days...",
  "Weaving cherry blossoms and sunset dreams...",
  "Creating the canvas of you and me..."
];

export default function Loader() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFBFB]">
      {/* Background soft lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-romantic-accent/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Heart Drawing Animation */}
      <div className="relative mb-8 w-28 h-28 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-20 h-20 text-romantic-dark stroke-linecap-round stroke-linejoin-round"
        >
          <motion.path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            initial={{ pathLength: 0, fill: "rgba(201, 76, 76, 0)" }}
            animate={{ 
              pathLength: [0, 1, 1],
              fill: ["rgba(201, 76, 76, 0)", "rgba(201, 76, 76, 0)", "rgba(201, 76, 76, 0.1)"]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
        <motion.div 
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-xl">💖</span>
        </motion.div>
      </div>

      {/* Interactive Staggered Dots */}
      <div className="flex gap-2.5 mb-6">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-3.5 h-3.5 rounded-full bg-romantic-dark"
            animate={{ y: ["0%", "-100%", "0%"] }}
            transition={{
              ...dotTransition,
              delay: i * 0.15
            }}
            style={{
              boxShadow: '0 0 8px rgba(201, 76, 76, 0.3)'
            }}
          />
        ))}
      </div>

      {/* Text Rotating Cinematic Subtitle */}
      <motion.p
        key={quoteIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.5 }}
        className="text-romantic-text font-serif italic text-base md:text-lg text-center tracking-wide px-6 max-w-sm"
      >
        {quotes[quoteIndex]}
      </motion.p>
    </div>
  );
}
