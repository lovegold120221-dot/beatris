import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Waves, Loader2, Sparkles, Files, Briefcase, Globe, Plane, User, LayoutGrid } from 'lucide-react';
import { useTalk } from '../contexts/TalkContext';
import { TalkContext } from '../hooks/useLiveAudio';

export default function TalkScreen() {
  const { 
    connect, 
    disconnect, 
    connected, 
    speaking, 
    detectedLanguage, 
    transcript, 
    lastGeneratedImage,
    activeContext,
    setActiveContext
  } = useTalk();
  const [orbState, setOrbState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [showMicPrompt, setShowMicPrompt] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

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
                  onClick={() => setActiveContext(ctx.id)}
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

        {/* Interactive Layout Area */}
        <div className="flex-1 flex flex-col relative min-h-0">
          {/* Voice Orb Area (Sleek Theme) */}
          <motion.div layout className={`relative flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${transcript.length > 0 ? 'justify-start pt-2 pb-4 shrink-0 scale-90' : 'justify-center py-8 flex-1 scale-100'}`}>
            <div className="absolute w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[60px] pointer-events-none"></div>
            
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

            <motion.div layout className="mt-6 flex flex-col items-center h-12">
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
            </motion.div>
          </motion.div>

          {/* Live Transcription Area (Moved to bottom panel) */}
          <div className="flex-1 flex flex-col justify-center items-center relative z-10 pointer-events-none">
            {/* Keeping this space flexible for the orb to move */}
          </div>
        </div>

        {/* Dynamic Transcription Monitor (Repurposed from Context Panel) */}
        <motion.div layout className="mb-6 mx-6 bg-black/60 backdrop-blur-2xl border border-[#D4AF37]/30 rounded-2xl p-5 relative overflow-hidden shrink-0 shadow-2xl">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`}></div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                Live Transcription
              </span>
            </div>
            {connected && (
              <span className="text-[9px] font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 flex items-center gap-1.5 leading-none">
                <Waves size={10} /> STREAMING
              </span>
            )}
          </div>

          <div ref={scrollRef} className="space-y-4 max-h-32 overflow-y-auto hide-scrollbar relative z-10 scroll-smooth">
            <AnimatePresence mode="popLayout" initial={false}>
              {transcript.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-center justify-center py-4"
                >
                  <span className="text-[10px] text-white/20 uppercase tracking-widest italic">Waiting for connection...</span>
                </motion.div>
              ) : (
                transcript.map((t, i) => (
                  <motion.div 
                    layout
                    key={`${i}-${t.time}`}
                    initial={{ opacity: 0, x: t.role === 'jo' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[8px] uppercase tracking-widest font-bold ${t.role === 'beatrice' ? 'text-[#D4AF37]' : 'text-blue-400'}`}>
                        {t.role === 'beatrice' ? 'Beatrice Agent' : 'User (Maneer Jo)'}
                      </span>
                      <span className="text-[8px] text-white/20 font-mono">{t.time}</span>
                    </div>
                    <p className={`text-xs leading-relaxed font-serif ${t.role === 'jo' ? 'text-white/80' : 'text-white'}`}>
                      {t.text}
                      {i === transcript.length - 1 && connected && (
                        <motion.span 
                          animate={{ opacity: [1, 0, 1] }} 
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-1.5 h-3 ml-1 bg-[#D4AF37] align-middle"
                        />
                      )}
                    </p>
                    {t.image && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-2 rounded-xl border border-white/10 overflow-hidden shadow-lg"
                      >
                         <img src={t.image} alt="Generative Output" className="w-full h-auto" referrerPolicy="no-referrer" />
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            <div className="h-2" /> {/* Buffer for scrolling */}
          </div>

          {/* Technical Accents */}
          <div className="absolute bottom-2 right-4 flex gap-1 opacity-20">
            <div className="w-0.5 h-0.5 rounded-full bg-white"></div>
            <div className="w-0.5 h-0.5 rounded-full bg-white"></div>
            <div className="w-0.5 h-0.5 rounded-full bg-white"></div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
