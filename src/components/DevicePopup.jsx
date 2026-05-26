import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Heart } from 'lucide-react';

export default function DevicePopup({ onSelect }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-panel-glow rounded-3xl p-8 text-center relative overflow-hidden"
      >
        {/* Soft atmospheric gradient behind the content */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-romantic-accent/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-romantic-dark/10 rounded-full blur-2xl pointer-events-none" />

        {/* Decorative Top Heart Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-14 h-14 bg-romantic-pastel/60 rounded-full flex items-center justify-center border border-romantic-accent/40"
          >
            <Heart className="w-6 h-6 text-romantic-dark fill-romantic-dark/20" />
          </motion.div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-romantic-dark">
          Welcome, Beautiful
        </h2>
        <p className="text-romantic-text text-sm md:text-base mb-8 max-w-xs mx-auto">
          To ensure the most perfect, magical visual rendering, how are you viewing this today?
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {/* Mobile Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('mobile')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl border border-romantic-accent/40 bg-white/60 hover:bg-romantic-warm/40 text-romantic-dark transition-all group hover:border-romantic-dark/40 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-romantic-pastel/50 flex items-center justify-center mb-3 group-hover:bg-romantic-accent/50 transition-colors">
              <Smartphone className="w-5 h-5 text-romantic-dark" />
            </div>
            <span className="font-semibold text-sm">Mobile</span>
            <span className="text-xs text-romantic-text/60 mt-1">Sleek & Compact</span>
          </motion.button>

          {/* Laptop Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('laptop')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl border border-romantic-accent/40 bg-white/60 hover:bg-romantic-warm/40 text-romantic-dark transition-all group hover:border-romantic-dark/40 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-romantic-pastel/50 flex items-center justify-center mb-3 group-hover:bg-romantic-accent/50 transition-colors">
              <Monitor className="w-5 h-5 text-romantic-dark" />
            </div>
            <span className="font-semibold text-sm">Laptop / PC</span>
            <span className="text-xs text-romantic-text/60 mt-1">Cinematic Screen</span>
          </motion.button>
        </div>

        {/* Small Elegant Footer note */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-romantic-text/50">
          <span>Best with audio turned on</span>
          <span>•</span>
          <span>Made for you</span>
        </div>
      </motion.div>
    </div>
  );
}
