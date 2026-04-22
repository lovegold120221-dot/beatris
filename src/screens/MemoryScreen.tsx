import React from 'react';
import { Mail, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MemoryScreen() {
  return (
    <div className="flex flex-col h-full px-4 pt-4 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl tracking-tight text-white/90">Memory</h2>
        <span className="text-[10px] uppercase tracking-wider text-white/40">Last 24h</span>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {['All Context', 'Emails', 'WhatsApp', 'Follow-ups'].map((f, i) => (
          <button key={i} className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider border ${i === 0 ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 text-white/50 glass-panel'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        
        {/* Email Summary Block */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={12} className="text-[#D4AF37]" />
            <h3 className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium">Inbox Synthesis</h3>
          </div>
          <p className="text-sm font-serif leading-relaxed text-white/80">
            Received 3 emails from <span className="text-white bg-white/10 px-1 rounded">Pierre (Tech Lead)</span> regarding the Horizon integration. He needs the finalized API keys by Friday.
          </p>
          <div className="flex items-center gap-2 mt-2 pt-3 border-t border-white/10">
            <AlertCircle size={12} className="text-rose-400" />
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Action Required: Generate API Keys</span>
          </div>
        </div>

        {/* WhatsApp Summary Block */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle size={12} className="text-[#D4AF37]" />
            <h3 className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium">WhatsApp Sync</h3>
          </div>
          <p className="text-sm font-serif leading-relaxed text-white/80">
            <span className="text-white bg-white/10 px-1 rounded">Marc Dubois</span> confirmed the venue for the offsite. The catering budget needs your approval.
          </p>
          <div className="flex items-center gap-2 mt-2 pt-3 border-t border-white/10">
            <CheckCircle2 size={12} className="text-white/40" />
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Followed up at 09:30 AM</span>
          </div>
        </div>

      </div>
    </div>
  );
}
