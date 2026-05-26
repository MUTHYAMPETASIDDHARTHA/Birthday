import React, { useMemo } from 'react';

export default function FloatingHearts() {
  const elements = useMemo(() => {
    const arr = [];
    const symbols = ['💖', '❤️', '🌸', '✨', '💕', '💘'];
    for (let i = 0; i < 20; i++) {
      const left = Math.random() * 100; // random percentage
      const delay = Math.random() * 15; // random animation delay
      const size = Math.random() * 1.5 + 0.8; // random scale
      const duration = Math.random() * 8 + 12; // random duration between 12s and 20s
      const char = symbols[Math.floor(Math.random() * symbols.length)];
      arr.push({ id: i, left, delay, size, duration, char });
    }
    return arr;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute bottom-0 text-opacity-40 animate-float-heart select-none"
          style={{
            left: `${el.left}%`,
            animationDelay: `${el.delay}s`,
            animationDuration: `${el.duration}s`,
            transform: `scale(${el.size})`,
            fontSize: `${el.size * 1.2}rem`,
            filter: 'blur(0.5px) drop-shadow(0 2px 5px rgba(201, 76, 76, 0.15))',
          }}
        >
          {el.char}
        </div>
      ))}
    </div>
  );
}
