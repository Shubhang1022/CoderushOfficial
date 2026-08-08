import React, { useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import { EventService } from '../services/eventService';
import { EventCard } from '../components/ui/EventCard';

export const Events: React.FC = () => {
  const [, setSyncTick] = useState(0);

  React.useEffect(() => {
    const handleSync = () => setSyncTick((prev) => prev + 1);
    window.addEventListener('coderush_storage_sync', handleSync);
    return () => window.removeEventListener('coderush_storage_sync', handleSync);
  }, []);

  const publicEvents = EventService.getPublicEvents();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Upcoming', 'Live', 'Completed', 'Hackathon', 'Workshop', 'Coding Contest'];

  const filteredEvents = publicEvents.filter((evt) => {
    // Search query filter
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category / status filter
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Upcoming') return ['coming_soon', 'registration_opening', 'registration_open'].includes(evt.status);
    if (activeCategory === 'Live') return evt.status === 'live';
    if (activeCategory === 'Completed') return ['completed', 'published'].includes(evt.status);
    return evt.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-cyan">
          <Calendar className="w-3.5 h-3.5" />
          TECHNICAL EVENTS & HACKATHONS
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-white">
          Explore CodeRush Initiatives
        </h1>
        <p className="text-text-secondary text-sm">
          Discover upcoming competitions, workshops, and browse through past event highlights.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, topics, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
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

      {/* Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-panel rounded-3xl space-y-3">
          <Calendar className="w-8 h-8 text-text-muted mx-auto" />
          <h3 className="text-white font-heading font-semibold text-base">No Events Match Your Filter</h3>
          <p className="text-text-muted text-xs">Try selecting a different category or search term.</p>
        </div>
      )}
    </div>
  );
};
