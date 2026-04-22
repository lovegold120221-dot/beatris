import React, { useState } from 'react';
import { Languages, Wifi, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TopBar() {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [language, setLanguage] = useState('FR');
  const userLanguages = [
    { code: 'FR', label: 'French (Executive Mode)' },
    { code: 'EN', label: 'English' },
    { code: 'NL', label: 'Dutch/Flemish' },
    { code: 'TL', label: 'Tagalog' },
  ];

  return (
    <div className="pt-8 px-6 pb-4 flex justify-between items-center bg-gradient-to-b from-black to-transparent z-10 w-full relative">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">Project</span>
        <h1 className="text-xl font-serif tracking-tight">Beatrice</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
          <span className="text-[10px] font-medium tracking-wide uppercase">Live</span>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="bg-[#D4AF37] text-black px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter hover:bg-[#D4AF37]/90 transition-colors"
          >
            {language}
          </button>
          
          <AnimatePresence>
            {langMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-64 glass-panel-heavy rounded-2xl p-3 shadow-2xl flex flex-col gap-1 border border-white/20 origin-top-right text-left z-50"
              >
                <div className="px-2 pb-2 mb-2 border-b border-white/10 flex flex-col gap-1 text-[9px] text-white/50 tracking-wider">
                  <span className="font-serif italic text-white/70 tracking-normal text-xs">Rooted in Jo Lernout:</span>
                  <span>EN • NL/BE</span>
                  <span className="mt-1 font-serif italic text-white/70 tracking-normal text-xs">Executive-ready in:</span>
                  <span>FR • TL & 200+ languages</span>
                </div>
                
                <div className="px-2 py-1 mb-1 text-[9px] text-white/40 uppercase tracking-widest">
                  Target Identity
                </div>
                {userLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2 py-1.5 text-xs rounded-md text-left transition-colors flex items-center justify-between ${language === lang.code ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[9px] uppercase tracking-wider">{lang.code}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
