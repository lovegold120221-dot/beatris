import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Waves, Loader2, Sparkles, Files, Briefcase, Globe, Plane, User, LayoutGrid } from 'lucide-react';
import { useLiveAPI, TalkContext } from '../hooks/useLiveAudio';

export default function TalkScreen() {
  const [activeContext, setActiveContext] = useState<TalkContext>(() => {
    return (localStorage.getItem('beatrice_active_context') as TalkContext) || 'Work';
  });
  const { connect, disconnect, connected, speaking, detectedLanguage } = useLiveAPI(activeContext);
  const [orbState, setOrbState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [showMicPrompt, setShowMicPrompt] = useState(false);

  useEffect(() => {
    if (!connected) {
      setOrbState('idle');
    } else if (speaking) {
      setOrbState('speaking');
    } else {
      setOrbState('listening');
    }
  }, [connected, speaking]);

  const handleOrbClick = () => {
    if (!connected) {
      if (localStorage.getItem('beatrice_mic_granted') === 'true') {
        connect();
      } else {
        setShowMicPrompt(true);
      }
    } else {
      disconnect();
    }
  };

  const handleGrantMic = () => {
    setShowMicPrompt(false);
    localStorage.setItem('beatrice_mic_granted', 'true');
    connect();
  };

  const contexts: { id: TalkContext; icon: any; label: string; color: string }[] = [
    { id: 'Work', icon: Briefcase, label: 'Work', color: 'text-blue-400' },
    { id: 'Personal', icon: User, label: 'Personal', color: 'text-green-400' },
    { id: 'Travel', icon: Plane, label: 'Travel', color: 'text-orange-400' },
  ];

  const handleContextChange = (newContext: TalkContext) => {
    if (newContext === activeContext) return;
    setActiveContext(newContext);
    localStorage.setItem('beatrice_active_context', newContext);
    // If currently connected, we force a reconnect or let the user do it manually
    if (connected) {
      disconnect();
      // Add a small delay then reconnect with new context
      setTimeout(() => {
        connect();
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {showMicPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel-heavy rounded-3xl p-6 max-w-sm w-full border border-[#D4AF37]/30 shadow-2xl flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[#D4AF37] mb-2">
                <Mic size={24} />
              </div>
              <h3 className="font-serif text-2xl text-white/90">Microphone Access</h3>
              <p className="text-sm font-light leading-relaxed text-white/70">
                Beatrice requires access to your microphone to capture your voice commands, transcribe your speech, and converse with you in real-time.
              </p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowMicPrompt(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-xs uppercase tracking-wider font-medium hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={handleGrantMic} className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-black text-xs uppercase tracking-wider font-bold hover:bg-[#D4AF37]/90 transition-colors">
                  Allow
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pt-4">
        
        {/* Context Switcher Toolbar */}
        <div className="px-6 relative z-30 mb-2">
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-xl">
            {contexts.map((ctx) => {
              const Icon = ctx.icon;
              const isActive = activeContext === ctx.id;
              return (
                <button
                  key={ctx.id}
                  onClick={() => handleContextChange(ctx.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all duration-300 ${
                    isActive ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 relative' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Icon size={12} className={isActive ? 'text-black' : ctx.color} />
                  {ctx.label}
                  {isActive && connected && (
                    <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Detection overlay when available */}
        <AnimatePresence>
          {detectedLanguage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-2 pointer-events-none"
            >
              <div className="glass-panel-heavy rounded-2xl p-3 border border-[#D4AF37]/30 shadow-lg backdrop-blur-2xl bg-black/60 mx-auto max-w-xs w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="text-[#D4AF37]" size={16} />
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-white/50">Input </span>
                    <span className="text-xs font-semibold text-white">{detectedLanguage.input}</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-white/10 mx-2" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-white/50">Voice</span>
                  <span className="text-xs font-semibold text-[#D4AF37]">{detectedLanguage.output}</span>
                </div>
                <div className="h-6 w-px bg-white/10 mx-2" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-white/50">Conf.</span>
                  <span className="text-xs font-semibold text-white/80">{detectedLanguage.confidence}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Orb Area (Sleek Theme) */}
        <div className="relative flex flex-col items-center justify-center py-8 flex-1">
          <div className="absolute w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[60px]"></div>
          
          <button 
            onClick={handleOrbClick} 
            className={`w-48 h-48 rounded-full border border-white/10 flex items-center justify-center shadow-inner relative focus:outline-none transition-colors duration-500 ${connected ? 'bg-gradient-to-tr from-[#D4AF37]/20 via-black to-[#1a1a1a]' : 'bg-gradient-to-tr from-black via-black to-[#1a1a1a]'}`}
          >
            <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-[#D4AF37]/40 via-black to-transparent p-[1px] flex items-center justify-center ${connected ? 'shadow-[0_0_80px_rgba(212,175,55,0.3)]' : 'shadow-[0_0_30px_rgba(212,175,55,0.1)]'} transition-shadow duration-500`}>
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                 <div className="w-32 h-32 flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }}>
                   <motion.div 
                     animate={{ 
                       rotate: orbState === 'listening' ? 360 : orbState === 'speaking' ? -360 : 0,
                       scale: orbState === 'speaking' ? [1, 1.15, 1, 1.05, 1] : orbState === 'listening' ? [1, 1.05, 1] : 1
                     }}
                     transition={{ repeat: Infinity, duration: orbState === 'speaking' ? 1.5 : 4, ease: "easeInOut" }}
                     className={`w-12 h-12 rounded-full border-2 ${orbState === 'idle' ? 'border-[#D4AF37]/40' : 'border-[#D4AF37]'} border-t-transparent opacity-60`}
                   />
                 </div>
              </div>
            </div>
            
            {!connected && (
              <div className="absolute bottom-6 flex flex-col items-center gap-1 opacity-60">
                 <Mic size={14} className="text-[#D4AF37]" />
                 <span className="text-[8px] uppercase tracking-widest text-[#D4AF37]">Tap to Connect</span>
              </div>
            )}
          </button>

          <div className="mt-8 flex flex-col items-center h-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-2 font-medium">
              {orbState === 'idle' && 'Offline'}
              {orbState === 'listening' && 'Listening...'}
              {orbState === 'speaking' && 'Beatrice Speaking'}
            </span>
            {orbState !== 'idle' && (
              <div className="flex gap-1.5">
                <motion.div animate={{ height: orbState === 'speaking' ? [4, 12, 4] : [4, 6, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1 h-4 rounded-full bg-[#D4AF37]"></motion.div>
                <motion.div animate={{ height: orbState === 'speaking' ? [4, 16, 4] : [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 h-4 rounded-full bg-[#D4AF37]"></motion.div>
                <motion.div animate={{ height: orbState === 'speaking' ? [4, 12, 4] : [4, 6, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 h-4 rounded-full bg-[#D4AF37]"></motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Context Panel */}
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl p-4 space-y-3 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2 relative z-10">
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold flex items-center gap-2">
              <Sparkles size={10} className="text-[#D4AF37]" /> Connected Context
            </span>
            <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="grid grid-cols-2 gap-2 relative z-10">
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center gap-2 group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:shadow-[0_0_8px_#60a5fa] transition-shadow"></div>
              <span className="text-[10px] font-medium text-white/80">Agenda 11:00</span>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center gap-2 group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-2 h-2 rounded-full bg-orange-400 group-hover:shadow-[0_0_8px_#fb923c] transition-shadow"></div>
              <span className="text-[10px] font-medium text-white/80">NDA_Draft.pdf</span>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center gap-2 group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-2 h-2 rounded-full bg-green-400 group-hover:shadow-[0_0_8px_#4ade80] transition-shadow"></div>
              <span className="text-[10px] font-medium text-white/80">Inbox (2)</span>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center gap-2 group hover:border-[#D4AF37]/40 transition-colors">
              <div className="w-2 h-2 rounded-full bg-purple-400 group-hover:shadow-[0_0_8px_#c084fc] transition-shadow"></div>
              <span className="text-[10px] font-medium text-white/80">WhatsApp</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
