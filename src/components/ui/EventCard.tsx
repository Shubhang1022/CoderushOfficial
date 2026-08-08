import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, ArrowRight, Radio } from 'lucide-react';
import { Event, EventStatus } from '../../types';
import { CountdownTimer } from './CountdownTimer';
import { format } from 'date-fns';
import { renderFormattedText } from '../../utils/formatText';
import { GalleryService } from '../../services/galleryService';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, featured = false }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'coming_soon':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-500/20 text-gray-300 border border-gray-500/30">Coming Soon</span>;
      case 'registration_opening':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">Reg Opens Soon</span>;
      case 'registration_open':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Registration Open</span>;
      case 'registration_closed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">Reg Closed</span>;
      case 'live':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
            <Radio className="w-3 h-3 text-rose-500 animate-ping" />
            LIVE NOW
          </span>
        );
      case 'published':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Highlights Ready</span>;
      case 'completed':
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-text-muted border border-white/10">Completed</span>;
    }
  };

  const getTargetDateForCountdown = () => {
    if (event.status === 'coming_soon' && event.reveal_date) return event.reveal_date;
    if (event.status === 'registration_opening' && event.registration_start) return event.registration_start;
    if (event.status === 'registration_open' && event.registration_end) return event.registration_end;
    if (event.status === 'live') return event.event_end;
    return null;
  };

  const countdownTarget = getTargetDateForCountdown();

  // IMPORTANT SPEC RULE: Highlights button appears ONLY when the event is completed/published AND admin explicitly enables gallery_published!
  const isCompletedOrPublished = event.status === 'completed' || event.status === 'published';
  const showHighlightsButton = isCompletedOrPublished && Boolean(event.gallery_published);

  if (featured) {
    return (
      <div className="relative group card-dark rounded-3xl overflow-hidden border border-brand-blue/30 bg-[#0C111D] p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Media Poster */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[16/10] bg-black/40 border border-white/10">
            <img
              src={event.poster}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
              {getStatusBadge(event.status)}
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur text-white border border-white/10 uppercase tracking-wider">
                {event.category}
              </span>
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                  {format(new Date(event.event_start), 'MMM dd, yyyy')}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                  {event.venue} ({event.mode})
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-heading font-bold text-white group-hover:text-brand-cyan transition-colors">
                {event.title}
              </h3>

              <div className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-3">
                {renderFormattedText(event.short_description)}
              </div>
            </div>

            {countdownTarget && (
              <div className="pt-2 max-w-sm">
                <CountdownTimer
                  targetDate={countdownTarget}
                  label={
                    event.status === 'registration_open'
                      ? 'Registration Closes In'
                      : event.status === 'live'
                      ? 'Event Ends In'
                      : 'Countdown'
                  }
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/events/${event.slug}`)}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-glow-blue hover:shadow-glow-cyan hover:scale-[1.02] transition-all"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>

              {showHighlightsButton && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const album = GalleryService.getAlbumForEvent(event.id, event.slug);
                    if (album) {
                      navigate(`/gallery/${album.slug}`);
                    } else {
                      navigate('/gallery');
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/20 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-brand-cyan" />
                  ✨ Event Highlights
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group card-dark rounded-3xl overflow-hidden flex flex-col h-full border border-white/5 hover:border-brand-blue/30 transition-all duration-300">
      {/* Media Poster */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black/40 border-b border-white/5">
        <img
          src={event.poster}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {getStatusBadge(event.status)}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur text-white border border-white/10 uppercase tracking-wider">
            {event.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-text-muted font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-blue" />
              {format(new Date(event.event_start), 'MMM dd, yyyy')}
            </span>
            <span className="flex items-center gap-1 text-text-secondary">
              <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
              {event.mode}
            </span>
          </div>

          <h3 className="font-heading font-bold text-lg text-white group-hover:text-brand-cyan transition-colors line-clamp-1">
            {event.title}
          </h3>

          <div className="text-text-secondary text-xs line-clamp-2 leading-relaxed min-h-[36px]">
            {renderFormattedText(event.short_description)}
          </div>
        </div>

        {countdownTarget && (
          <div className="py-1">
            <CountdownTimer targetDate={countdownTarget} compact />
          </div>
        )}

        {/* Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => navigate(`/events/${event.slug}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-brand-blue/20 hover:text-white border border-white/10 hover:border-brand-blue/40 text-text-secondary transition-all"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {showHighlightsButton && (
            <button
              onClick={() => navigate(`/events/${event.slug}#highlights`)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/20 transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              Highlights
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
