import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Image as ImageIcon,
  Bell,
  Mail,
  Plus,
  ArrowUpRight,
  Activity,
  Award,
  Sparkles,
} from 'lucide-react';
import { EventService } from '../../services/eventService';
import { TeamService } from '../../services/teamService';
import { GalleryService } from '../../services/galleryService';
import { AnnouncementService } from '../../services/announcementService';
import { ContactService } from '../../services/contactService';
import { StorageService } from '../../services/storageService';
import { CountdownTimer } from '../../components/ui/CountdownTimer';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const events = EventService.getAllEvents();
  const team = TeamService.getTeam();
  const albums = GalleryService.getAlbums();
  const announcements = AnnouncementService.getAnnouncements();
  const messages = ContactService.getMessages();
  const logs = StorageService.getLogs().slice(0, 6);

  const unreadCount = messages.filter((m) => m.status === 'unread').length;
  const upcomingEvents = events.filter((e) => ['coming_soon', 'registration_opening', 'registration_open', 'live'].includes(e.status));
  const nextEvent = upcomingEvents[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Dashboard Overview</h1>
          <p className="text-xs text-text-muted">Welcome to CodeRush CMS portal. Manage website content & events.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/events')}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
          >
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Link to="/admin/events" className="card-dark p-5 rounded-2xl border border-white/5 hover:border-brand-blue/40 transition-all space-y-2">
          <Calendar className="w-5 h-5 text-brand-blue" />
          <div className="text-2xl font-heading font-bold text-white">{events.length}</div>
          <div className="text-xs text-text-muted font-medium">Total Events</div>
        </Link>

        <Link to="/admin/team" className="card-dark p-5 rounded-2xl border border-white/5 hover:border-brand-cyan/40 transition-all space-y-2">
          <Users className="w-5 h-5 text-brand-cyan" />
          <div className="text-2xl font-heading font-bold text-white">{team.length}</div>
          <div className="text-xs text-text-muted font-medium">Team Members</div>
        </Link>

        <Link to="/admin/gallery" className="card-dark p-5 rounded-2xl border border-white/5 hover:border-purple-400/40 transition-all space-y-2">
          <ImageIcon className="w-5 h-5 text-purple-400" />
          <div className="text-2xl font-heading font-bold text-white">{albums.length}</div>
          <div className="text-xs text-text-muted font-medium">Gallery Albums</div>
        </Link>

        <Link to="/admin/announcements" className="card-dark p-5 rounded-2xl border border-white/5 hover:border-emerald-400/40 transition-all space-y-2">
          <Bell className="w-5 h-5 text-emerald-400" />
          <div className="text-2xl font-heading font-bold text-white">{announcements.length}</div>
          <div className="text-xs text-text-muted font-medium">Announcements</div>
        </Link>

        <Link to="/admin/messages" className="card-dark p-5 rounded-2xl border border-white/5 hover:border-rose-400/40 transition-all space-y-2 col-span-2 md:col-span-1">
          <Mail className="w-5 h-5 text-rose-400" />
          <div className="text-2xl font-heading font-bold text-white flex items-center justify-between">
            {messages.length}
            {unreadCount > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">{unreadCount} New</span>}
          </div>
          <div className="text-xs text-text-muted font-medium">Inquiries</div>
        </Link>
      </div>

      {/* Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Next Event Spotlight Widget */}
        <div className="lg:col-span-6 card-dark p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-lg">Next Upcoming Event</h3>
            <span className="text-xs text-brand-cyan font-mono font-semibold">Live Countdown</span>
          </div>

          {nextEvent ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-xs font-mono text-brand-blue uppercase">{nextEvent.category} • {nextEvent.mode}</div>
                <h4 className="font-heading font-bold text-white text-base">{nextEvent.title}</h4>
                <p className="text-xs text-text-muted">{nextEvent.short_description}</p>
              </div>

              <CountdownTimer
                targetDate={nextEvent.event_start}
                label="Event Starts In"
              />

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => navigate(`/admin/events`)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 text-center"
                >
                  Manage Events
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-muted py-6 text-center">No upcoming events scheduled right now.</p>
          )}
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="lg:col-span-6 card-dark p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-white text-lg">Quick CMS Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/admin/events')}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-brand-blue/20 text-left border border-white/5 hover:border-brand-blue/40 transition-all space-y-1 group"
            >
              <Calendar className="w-5 h-5 text-brand-blue group-hover:scale-110 transition-transform" />
              <div className="text-xs font-semibold text-white">Create New Event</div>
              <div className="text-[11px] text-text-muted">Draft or publish hackathons</div>
            </button>

            <button
              onClick={() => navigate('/admin/gallery')}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-brand-cyan/20 text-left border border-white/5 hover:border-brand-cyan/40 transition-all space-y-1 group"
            >
              <ImageIcon className="w-5 h-5 text-brand-cyan group-hover:scale-110 transition-transform" />
              <div className="text-xs font-semibold text-white">Upload Gallery Media</div>
              <div className="text-[11px] text-text-muted">Add album photos & videos</div>
            </button>

            <button
              onClick={() => navigate('/admin/team')}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-purple-500/20 text-left border border-white/5 hover:border-purple-500/40 transition-all space-y-1 group"
            >
              <Users className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-semibold text-white">Add Team Member</div>
              <div className="text-[11px] text-text-muted">Assign roles & display order</div>
            </button>

            <button
              onClick={() => navigate('/admin/statistics')}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/20 text-left border border-white/5 hover:border-emerald-500/40 transition-all space-y-1 group"
            >
              <Award className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-semibold text-white">Update Impact Stats</div>
              <div className="text-[11px] text-text-muted">Manually update metrics</div>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Stream Audit Log */}
      <div className="card-dark p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-cyan" /> Recent Activity Audit Log
          </h3>
          <Link to="/admin/activity-logs" className="text-xs font-semibold text-brand-cyan hover:text-white flex items-center gap-1">
            View Full Logs <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white mr-2">{log.action}:</span>
                <span className="text-text-secondary">{log.details}</span>
              </div>
              <div className="text-[10px] text-text-muted font-mono">{new Date(log.created_at).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
