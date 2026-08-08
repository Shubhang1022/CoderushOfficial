import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code,
  Sparkles,
  ArrowRight,
  Calendar,
  Users,
  Trophy,
  Rocket,
  Layers,
  Terminal,
  ExternalLink,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { EventService } from '../services/eventService';
import { TeamService } from '../services/teamService';
import { GalleryService } from '../services/galleryService';
import { AnnouncementService } from '../services/announcementService';
import { SettingsService } from '../services/settingsService';
import { EventCard } from '../components/ui/EventCard';
import coderushAssetImage from '../assets/IMG_20260413_165317.jpg';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [, setSyncTick] = useState(0);

  React.useEffect(() => {
    const handleSync = () => setSyncTick((prev) => prev + 1);
    window.addEventListener('coderush_storage_sync', handleSync);
    return () => window.removeEventListener('coderush_storage_sync', handleSync);
  }, []);

  const settings = SettingsService.getSettings();
  const stats = SettingsService.getStatistics();
  const featuredEvent = EventService.getFeaturedEvent();
  const publicEvents = EventService.getPublicEvents();
  const teamMembers = TeamService.getActiveTeam().slice(0, 4);
  const announcements = AnnouncementService.getActiveAnnouncements();
  const albums = GalleryService.getPublicAlbums().slice(0, 3);

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Upcoming', 'Live', 'Completed', 'Hackathon', 'Workshop', 'Coding Contest'];

  const filteredEvents = publicEvents.filter((evt) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Upcoming') return ['coming_soon', 'registration_opening', 'registration_open'].includes(evt.status);
    if (activeCategory === 'Live') return evt.status === 'live';
    if (activeCategory === 'Completed') return ['completed', 'published'].includes(evt.status);
    return evt.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 overflow-hidden">
        {/* Background Mesh Grid & Ambient Glows */}
        <div className="absolute inset-0 bg-mesh-grid opacity-30 pointer-events-none" />
        <div className="glow-ambient-red top-10 left-1/4 opacity-35" />
        <div className="glow-ambient-blue top-10 left-10 opacity-40" />
        <div className="glow-ambient-cyan bottom-10 right-10 opacity-30" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-semibold text-rose-300 shadow-glow-red backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>OFFICIAL CODING CLUB OF BBDNIIT</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.05]">
                {(() => {
                  const title = settings.hero_title || 'CODERUSH';
                  if (title.toUpperCase().includes('RUSH')) {
                    const parts = title.split(/(RUSH)/i);
                    return (
                      <span className="block tracking-tight">
                        {parts.map((part, i) =>
                          part.toUpperCase() === 'RUSH' ? (
                            <span
                              key={i}
                              className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(244,63,94,0.7)] font-black"
                            >
                              {part}
                            </span>
                          ) : (
                            <span key={i} className="text-gradient-blue">
                              {part}
                            </span>
                          )
                        )}
                      </span>
                    );
                  }
                  return <span className="block text-gradient-blue">{title}</span>;
                })()}
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-secondary block mt-2">
                  Build. Innovate. Lead.
                </span>
              </h1>

              <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                {settings.hero_description ||
                  'The premier developer community at BBDNIIT hosting national hackathons, technical bootcamps, and open-source initiatives.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => navigate('/events')}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-glow-blue hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Explore Events
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/about')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Hero Right: Premium Developer Preview Window */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl glass-panel p-6 border border-white/10 shadow-2xl space-y-4 animate-float">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-[11px] font-mono text-text-muted flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-brand-cyan" /> coderush-cli v3.0
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs text-text-secondary">
                  <div className="text-emerald-400">$ coderush init --community bbdniit</div>
                  <div className="text-text-muted">✓ Initializing student developer ecosystem...</div>
                  <div className="text-text-muted">✓ Synchronizing national hackathons...</div>
                </div>

                {/* Floating Preview Card */}
                {featuredEvent && (
                  <div
                    onClick={() => navigate(`/events/${featuredEvent.slug}`)}
                    className="cursor-pointer p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-brand-blue/30 transition-all"
                  >
                    <div className="flex items-center gap-2 text-[10px] text-brand-cyan font-semibold uppercase tracking-wider mb-1">
                      <Flame className="w-3 h-3 text-amber-400" /> Featured Event Spotlight
                    </div>
                    <div className="text-sm font-heading font-bold text-white line-clamp-1">
                      {featuredEvent.title}
                    </div>
                    <div className="text-xs text-text-muted flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-brand-blue" />
                      <span>{new Date(featuredEvent.event_start).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Announcements Ticker */}
      {announcements.length > 0 && (
        <section className="max-w-6xl mx-auto px-6">
          <div className="glass-panel p-4 rounded-2xl border border-brand-blue/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shrink-0">
                ANNOUNCEMENT
              </span>
              <p className="text-sm font-medium text-white line-clamp-1">
                {announcements[0].title}
              </p>
            </div>
            {announcements[0].button_link && (
              <a
                href={announcements[0].button_link}
                target={announcements[0].button_link.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-brand-cyan hover:text-white transition-colors shrink-0"
              >
                {announcements[0].button_text || 'View Details'}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </section>
      )}

      {/* About Teaser */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-text-secondary">
              <Layers className="w-3.5 h-3.5 text-brand-blue" />
              WHO WE ARE
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white leading-tight">
              Fostering Technical Innovation at BBDNIIT
            </h2>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              CodeRush serves as the official technical backbone of BBDNIIT. Designed to mirror modern student organizations like Google Developer Groups and GitHub Campus Experts, we empower developers through real-world software engineering, hackathons, and industry mentorship.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="font-heading font-semibold text-white text-sm">Industry Standard</h4>
                <p className="text-xs text-text-muted mt-1">Real-world coding and project architecture workflows.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-brand-cyan mb-2" />
                <h4 className="font-heading font-semibold text-white text-sm">Inclusive Ecosystem</h4>
                <p className="text-xs text-text-muted mt-1">Open for beginner coders to elite competitive hackers.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative group">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 card-dark aspect-[4/3] bg-black">
              <img
                src={coderushAssetImage}
                alt="CodeRush BBDNIIT Community"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white font-mono">
                <span className="font-heading font-bold text-brand-cyan uppercase tracking-wider">
                  Official BBDNIIT CodeRush Community
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Statistics */}
      <section className="max-w-6xl mx-auto px-6 ">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center  gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-cyan">
            <Trophy className="w-3.5 h-3.5" />
            OUR COMMUNITY IMPACT
          </div>
          <h2 className="text-3xl font-heading font-bold text-white">Engineering Growth in Numbers</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl card-dark text-center space-y-2 border border-white/10 hover:border-brand-blue/30 transition-all">
            <Users className="w-6 h-6 text-brand-blue mx-auto" />
            <div className="text-3xl font-heading font-extrabold text-white">{stats.students_reached.toLocaleString()}+</div>
            <div className="text-xs text-text-muted uppercase tracking-wider font-medium">Students Reached</div>
          </div>
          <div className="p-6 rounded-2xl card-dark text-center space-y-2 border border-white/10 hover:border-brand-cyan/30 transition-all">
            <Calendar className="w-6 h-6 text-brand-cyan mx-auto" />
            <div className="text-3xl font-heading font-extrabold text-white">{stats.events}+</div>
            <div className="text-xs text-text-muted uppercase tracking-wider font-medium">Events Conducted</div>
          </div>
          <div className="p-6 rounded-2xl card-dark text-center space-y-2 border border-white/10 hover:border-brand-purple/30 transition-all">
            <Users className="w-6 h-6 text-brand-purple mx-auto" />
            <div className="text-3xl font-heading font-extrabold text-white">{stats.community_members}+</div>
            <div className="text-xs text-text-muted uppercase tracking-wider font-medium">Community Members</div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-cyan mb-2">
              <Calendar className="w-3.5 h-3.5" />
              COMMUNITY EVENTS
            </div>
            <h2 className="text-3xl font-heading font-bold text-white">Upcoming & Past Initiatives</h2>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-blue text-white shadow-glow-blue'
                    : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Spotlight Card if available */}
        {featuredEvent && activeCategory === 'All' && (
          <div className="mb-8">
            <EventCard event={featuredEvent} featured />
          </div>
        )}

        {/* Event Cards Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-panel rounded-2xl">
            <p className="text-text-muted text-sm">No events found in this category.</p>
          </div>
        )}
      </section>

      {/* Organizing Team Preview */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-cyan mb-2">
              <Users className="w-3.5 h-3.5" />
              MEET THE LEADERSHIP
            </div>
            <h2 className="text-3xl font-heading font-bold text-white">People Behind CodeRush</h2>
          </div>
          <Link to="/team" className="text-xs font-semibold text-brand-cyan hover:text-white flex items-center gap-1">
            View Full Team <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="card-dark rounded-2xl p-5 text-center space-y-3 group">
              <img
                src={member.photo}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-white/10 group-hover:border-brand-cyan transition-colors"
              />
              <div>
                <h4 className="font-heading font-bold text-white text-base group-hover:text-brand-cyan transition-colors">
                  {member.name}
                </h4>
                <p className="text-xs text-brand-blue font-mono mt-0.5">{member.role}</p>
                <p className="text-[11px] text-text-muted mt-1">{member.department} • {member.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
