import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, ArrowRight, MessageCircle, Loader2 } from 'lucide-react';
import { GoogleService } from '../services/googleService';

export default function AgendaScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const items = await GoogleService.listEvents(10);
        setEvents(items);
      } catch (err: any) {
        console.error("Failed to load calendar events", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const upNext = events[0];

  return (
    <div className="flex flex-col h-full px-4 pt-4 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl tracking-tight text-white/90">Agenda</h2>
        <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]">
          {new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[#D4AF37]" size={24} />
        </div>
      ) : error ? (
        <div className="glass-panel-heavy rounded-3xl p-6 border-rose-400/20 text-center">
           <p className="text-xs text-rose-400">Please sign in with Google to view your real agenda.</p>
        </div>
      ) : upNext ? (
        <div className="glass-panel-heavy rounded-3xl p-6 relative overflow-hidden border-[#D4AF37]/20">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CalendarIcon size={100} />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-medium">Up Next</span>
          </div>
          
          <h3 className="font-serif text-2xl leading-tight mb-2 truncate pr-12">{upNext.summary}</h3>
          
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-2 text-white/60">
              <Clock size={12} />
              <span className="text-xs font-light tracking-wide">
                {upNext.start?.dateTime ? new Date(upNext.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All Day'}
              </span>
            </div>
            {upNext.attendees && (
              <div className="flex items-center gap-2 text-white/60">
                <Users size={12} />
                <span className="text-xs font-light tracking-wide truncate max-w-[200px]">
                  {upNext.attendees.map((a: any) => a.displayName || a.email).join(', ')}
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/50 leading-relaxed font-light mb-4 italic">
              "Beatrice is ready to prepare you for this session."
            </p>
            <button className="w-full glass-panel py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border-white/5 text-[#D4AF37]">
              <MessageCircle size={14} />
              <span>Prepare for this meeting</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 glass-panel rounded-2xl border-dashed border-white/10">
           <p className="text-xs text-white/30 uppercase tracking-widest">No upcoming events</p>
        </div>
      )}

      {/* Timeline of remaining events */}
      {!loading && !error && events.length > 1 && (
        <div className="flex flex-col gap-3 mt-2">
           <h3 className="text-[10px] uppercase tracking-widest text-white/40 px-1 border-b border-white/10 pb-2">Later Today</h3>
           <div className="flex flex-col gap-0 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/10" />
              {events.slice(1).map((event, idx) => (
                <div key={idx} className="flex items-start gap-4 relative py-3">
                   <div className="w-8 h-8 rounded-full glass-panel-heavy flex items-center justify-center shrink-0 z-10 border border-white/10">
                     <span className="text-[9px] text-white/50 text-center leading-tight">
                       {event.start?.dateTime ? new Date(event.start.dateTime).getHours() : 'All'}h
                     </span>
                   </div>
                   <div className="flex-1 glass-panel rounded-xl p-4 border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
                     <h4 className="text-sm font-medium mb-1 truncate">{event.summary}</h4>
                     {event.location && <span className="text-[10px] text-white/40 font-light truncate block">{event.location}</span>}
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

    </div>
  );
}
