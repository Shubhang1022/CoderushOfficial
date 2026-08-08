import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Sparkles,
  Trophy,
  HelpCircle,
  FileText,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { EventService } from '../services/eventService';
import { GalleryService } from '../services/galleryService';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { format } from 'date-fns';
import { renderFormattedText } from '../utils/formatText';

export const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const event = slug ? EventService.getEventBySlug(slug) : undefined;

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <h2 className="text-3xl font-heading font-bold text-white">Event Not Found</h2>
        <p className="text-text-secondary text-sm">The event you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-blue text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>
      </div>
    );
  }

  const isRegistrationOpen = event.status === 'registration_open';
  const showHighlights = event.publish_status || event.gallery_published;

  const handleRegisterClick = () => {
    if (event.registration_link) {
      window.open(event.registration_link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFeedbackClick = () => {
    if (event.feedback_link) {
      window.open(event.feedback_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-16">
      {/* Back Link */}
      <div>
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events List
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden card-dark border border-white/10">
        <div className="h-64 sm:h-80 relative overflow-hidden bg-black">
          <img
            src={event.cover_image || event.poster}
            alt={event.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1623] via-[#0F1623]/60 to-transparent" />
        </div>

        <div className="p-6 md:p-10 -mt-20 relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blue/30 text-brand-cyan border border-brand-blue/40 uppercase tracking-wider">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/10">
              {event.mode} Mode
            </span>
            {showHighlights && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> ✨ Event Highlights Published
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-text-secondary font-mono border-t border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-blue" />
              <span>{format(new Date(event.event_start), 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-cyan" />
              <span>{event.venue}, {event.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{format(new Date(event.event_start), 'p')} - {format(new Date(event.event_end), 'p')}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            {event.status === 'registration_open' && event.registration_link && (
              <button
                onClick={handleRegisterClick}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-glow-blue hover:shadow-glow-cyan hover:scale-[1.02] transition-all"
              >
                Register Now (Google Form)
                <ExternalLink className="w-4 h-4" />
              </button>
            )}

            {event.status === 'registration_closed' && (
              <div className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                🔒 Registration Closed
              </div>
            )}

            {event.status === 'registration_opening' && (
              <div className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                ⏳ Registration Opens Soon
              </div>
            )}

            {event.status === 'coming_soon' && (
              <div className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-300 border border-gray-500/30">
                ✨ Coming Soon
              </div>
            )}

            {event.status === 'live' && (
              <div className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                🔴 Event Live Now
              </div>
            )}

            {showHighlights && (
              <button
                onClick={() => {
                  const album = GalleryService.getAlbumForEvent(event.id, event.slug);
                  if (album) {
                    navigate(`/gallery/${album.slug}`);
                  } else {
                    navigate('/gallery');
                  }
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 hover:bg-brand-cyan/30 shadow-glow-cyan transition-all"
              >
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                ✨ View Event Gallery Album
              </button>
            )}

            {event.feedback_link && (
              <button
                onClick={handleFeedbackClick}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-brand-cyan" />
                Event Feedback Form
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Event Specs */}
        <div className="lg:col-span-8 space-y-12">
          {/* Overview */}
          <section className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-white">Event Overview</h3>
            <div className="text-text-secondary text-sm md:text-base leading-relaxed">
              {renderFormattedText(event.full_description || event.short_description)}
            </div>
          </section>

          {/* Timeline */}
          {event.timeline && event.timeline.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-2xl font-heading font-bold text-white">Event Timeline</h3>
              <div className="space-y-4 border-l-2 border-brand-blue/30 pl-6 ml-3">
                {event.timeline.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-brand-cyan border-2 border-[#04060A]" />
                    <h4 className="font-heading font-bold text-white text-base">{item.title}</h4>
                    <p className="text-xs text-text-muted font-mono">{format(new Date(item.event_time), 'PPP p')}</p>
                    {item.description && <p className="text-xs text-text-secondary mt-1">{item.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Winners Section (If published) */}
          {showHighlights && event.winners && event.winners.length > 0 && (
            <section id="highlights" className="space-y-6 pt-4">
              <div className="flex items-center gap-2 text-amber-400 font-heading font-bold text-2xl">
                <Trophy className="w-6 h-6" />
                Event Winners & Podium
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.winners.map((winner) => (
                  <div key={winner.id} className="card-dark rounded-2xl p-6 border border-amber-500/30 space-y-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {winner.position}
                    </span>
                    <h4 className="text-lg font-heading font-bold text-white">{winner.team_name}</h4>
                    <p className="text-xs text-brand-cyan font-mono">Project: {winner.project || 'N/A'}</p>
                    <p className="text-xs text-text-muted">Members: {winner.members}</p>
                    {winner.description && <p className="text-xs text-text-secondary pt-1">{winner.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rules */}
          {event.rules && event.rules.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-heading font-bold text-white">Guidelines & Rules</h3>
              <ul className="space-y-3">
                {event.rules.map((rule) => (
                  <li key={rule.id} className="flex items-start gap-3 text-xs text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule.rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs */}
          {event.faqs && event.faqs.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-cyan" /> Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {event.faqs.map((faq) => (
                  <div key={faq.id} className="card-dark rounded-2xl p-5 border border-white/5 space-y-2">
                    <h4 className="font-heading font-semibold text-white text-sm">{faq.question}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Statistics Card & Sponsors */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stats Card */}
          {event.statistics && (
            <div className="card-dark rounded-3xl p-6 border border-white/10 space-y-4">
              <h4 className="font-heading font-bold text-white text-lg">Event Statistics</h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-xl font-bold text-white">{event.statistics.participants}</div>
                  <div className="text-[10px] text-text-muted uppercase">Participants</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-xl font-bold text-brand-cyan">{event.statistics.prize_pool}</div>
                  <div className="text-[10px] text-text-muted uppercase">Prize Pool</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-xl font-bold text-emerald-400">{event.statistics.projects}</div>
                  <div className="text-[10px] text-text-muted uppercase">Projects</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-xl font-bold text-amber-400">{event.statistics.hours}h</div>
                  <div className="text-[10px] text-text-muted uppercase">Duration</div>
                </div>
              </div>
            </div>
          )}

          {/* Sponsors */}
          {event.sponsors && event.sponsors.length > 0 && (
            <div className="card-dark rounded-3xl p-6 border border-white/10 space-y-4">
              <h4 className="font-heading font-bold text-white text-lg">Event Sponsors</h4>
              <div className="space-y-3">
                {event.sponsors.map((sp) => (
                  <div key={sp.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                    <img src={sp.logo} alt={sp.sponsor_name} className="w-8 h-8 object-contain" />
                    <div>
                      <h5 className="font-bold text-xs text-white">{sp.sponsor_name}</h5>
                      <span className="text-[10px] text-brand-cyan">{sp.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
