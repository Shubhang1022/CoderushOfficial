import React from 'react';
import { Bell, ExternalLink, Calendar } from 'lucide-react';
import { AnnouncementService } from '../services/announcementService';
import { format } from 'date-fns';

export const Updates: React.FC = () => {
  const announcements = AnnouncementService.getActiveAnnouncements();

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-cyan">
          <Bell className="w-3.5 h-3.5" />
          COMMUNITY UPDATES & ANNOUNCEMENTS
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-white">
          Official Broadcasts
        </h1>
        <p className="text-text-secondary text-sm">
          Stay informed with team recruitment openings, hackathon releases, and competition results.
        </p>
      </div>

      {/* Announcements List */}
      {announcements.length > 0 ? (
        <div className="space-y-6">
          {announcements.map((ann) => (
            <div key={ann.id} className="card-dark rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                  {ann.badge}
                </span>
                <span className="text-xs text-text-muted font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                  {format(new Date(ann.publish_date), 'PPP')}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">{ann.title}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{ann.description}</p>

              {ann.button_link && (
                <div className="pt-2">
                  <a
                    href={ann.button_link}
                    target={ann.button_link.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-brand-blue hover:bg-brand-glow text-white transition-all shadow-glow-blue"
                  >
                    {ann.button_text || 'Learn More'}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-panel rounded-3xl">
          <p className="text-text-muted text-sm">No active announcements at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
};
