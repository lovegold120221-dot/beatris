import React from 'react';
import { Calendar as CalendarIcon, Clock, Users, ArrowRight, MessageCircle } from 'lucide-react';

export default function AgendaScreen() {
  return (
    <div className="flex flex-col h-full px-4 pt-4 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl tracking-tight text-white/90">Agenda</h2>
        <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]">Today, 15 Oct</span>
      </div>

      {/* Up Next Card */}
      <div className="glass-panel-heavy rounded-3xl p-6 relative overflow-hidden border-[#D4AF37]/20">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CalendarIcon size={100} />
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-medium">Up Next</span>
        </div>
        
        <h3 className="font-serif text-2xl leading-tight mb-2">French Team Sync</h3>
        
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-white/60">
            <Clock size={12} />
            <span className="text-xs font-light tracking-wide">11:00 AM — 12:00 PM</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Users size={12} />
            <span className="text-xs font-light tracking-wide">Jean-Luc, Marie, Paul</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/50 leading-relaxed font-light mb-4">
            Beatrice notes: The primary objective is to review the Q3 projections. Jean-Luc expressed concerns about the marketing budget in yesterday's email.
          </p>
          <button className="w-full glass-panel py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border-white/5 text-[#D4AF37]">
            <MessageCircle size={14} />
            <span>"Prépare-moi pour cette réunion"</span>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-0 mt-2 relative">
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/10" />
        
        <div className="flex items-start gap-4 relative py-2">
           <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center shrink-0 z-10 border-white/20">
             <span className="text-[9px] text-[#D4AF37]">Now</span>
           </div>
           <div className="flex-1 pt-2">
             <div className="h-px w-full bg-white/5" />
           </div>
        </div>

        <div className="flex items-start gap-4 relative py-4">
           <div className="w-8 h-8 rounded-full glass-panel-heavy flex items-center justify-center shrink-0 z-10">
             <span className="text-[9px] text-white/50">14h</span>
           </div>
           <div className="flex-1 glass-panel rounded-xl p-4">
             <h4 className="text-sm font-medium mb-1">Legal Review: Horizon Contract</h4>
             <span className="text-xs text-white/40 font-light">Claire Dubois</span>
           </div>
        </div>

      </div>

    </div>
  );
}
