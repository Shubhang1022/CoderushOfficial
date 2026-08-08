import {
  INITIAL_EVENTS,
  INITIAL_TEAM,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ALBUMS,
  INITIAL_GALLERY_MEDIA,
  INITIAL_STATISTICS,
  INITIAL_SETTINGS,
  INITIAL_SPONSORS,
  INITIAL_MESSAGES,
  INITIAL_ACTIVITY_LOGS,
} from '../constants/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  EVENTS: 'coderush_events_v1',
  TEAM: 'coderush_team_v1',
  ANNOUNCEMENTS: 'coderush_announcements_v1',
  ALBUMS: 'coderush_albums_v1',
  GALLERY_MEDIA: 'coderush_gallery_media_v1',
  STATISTICS: 'coderush_statistics_v1',
  SETTINGS: 'coderush_settings_v1',
  SPONSORS: 'coderush_sponsors_v1',
  MESSAGES: 'coderush_messages_v1',
  LOGS: 'coderush_logs_v1',
  AUTH: 'coderush_auth_session_v1',
};

export class StorageService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('coderush_storage_sync', { detail: { key } }));
      }
    } catch (e: any) {
      console.error(`Error writing ${key} to localStorage:`, e);
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        console.warn('LocalStorage quota limit reached for offline storage.');
      }
    }
  }

  /**
   * Pushes all current local admin data to Supabase Cloud DB tables.
   */
  static async pushAllToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
    if (!supabase || !isSupabaseConfigured) {
      return { success: false, count: 0, error: 'Supabase is not configured' };
    }

    try {
      const events = this.getEvents();
      const team = this.getTeam();
      const albums = this.getAlbums();
      const media = this.getGalleryMedia();
      const announcements = this.getAnnouncements();
      const sponsors = this.getSponsors();
      const statistics = this.getStatistics();

      let pushedCount = 0;
      const errors: string[] = [];

      if (events.length > 0) {
        const { error } = await supabase.from('events').upsert(events, { onConflict: 'id' });
        if (error) errors.push(`Events: ${error.message}`);
        else pushedCount += events.length;
      }
      if (team.length > 0) {
        const { error } = await supabase.from('team_members').upsert(team, { onConflict: 'id' });
        if (error) errors.push(`Team: ${error.message}`);
        else pushedCount += team.length;
      }
      if (albums.length > 0) {
        const { error } = await supabase.from('gallery_albums').upsert(albums, { onConflict: 'id' });
        if (error) errors.push(`Albums: ${error.message}`);
        else pushedCount += albums.length;
      }
      if (media.length > 0) {
        const { error } = await supabase.from('gallery_media').upsert(media, { onConflict: 'id' });
        if (error) errors.push(`Media: ${error.message}`);
        else pushedCount += media.length;
      }
      if (announcements.length > 0) {
        const { error } = await supabase.from('announcements').upsert(announcements, { onConflict: 'id' });
        if (error) errors.push(`Announcements: ${error.message}`);
        else pushedCount += announcements.length;
      }
      if (sponsors.length > 0) {
        const { error } = await supabase.from('sponsors').upsert(sponsors, { onConflict: 'id' });
        if (error) errors.push(`Sponsors: ${error.message}`);
        else pushedCount += sponsors.length;
      }
      if (statistics) {
        const { error } = await supabase.from('community_statistics').upsert(statistics, { onConflict: 'id' });
        if (error) errors.push(`Statistics: ${error.message}`);
        else pushedCount += 1;
      }

      if (errors.length > 0) {
        return { success: false, count: pushedCount, error: errors.join(' | ') };
      }

      return { success: true, count: pushedCount };
    } catch (err: any) {
      console.error('Error pushing data to Supabase DB:', err);
      return { success: false, count: 0, error: err?.message || 'Push failed' };
    }
  }

  /**
   * Fetches latest live data from Supabase Cloud DB and populates local storage on all devices.
   */
  static async syncFromSupabase(): Promise<void> {
    if (!supabase || !isSupabaseConfigured) return;

    try {
      const [
        { data: events },
        { data: team },
        { data: albums },
        { data: media },
        { data: announcements },
        { data: sponsors },
        { data: statistics },
      ] = await Promise.all([
        supabase.from('events').select('*'),
        supabase.from('team_members').select('*'),
        supabase.from('gallery_albums').select('*'),
        supabase.from('gallery_media').select('*'),
        supabase.from('announcements').select('*'),
        supabase.from('sponsors').select('*'),
        supabase.from('community_statistics').select('*'),
      ]);

      if (events && events.length > 0) this.setItem(STORAGE_KEYS.EVENTS, events);
      if (team && team.length > 0) this.setItem(STORAGE_KEYS.TEAM, team);
      if (albums && albums.length > 0) this.setItem(STORAGE_KEYS.ALBUMS, albums);
      if (media && media.length > 0) this.setItem(STORAGE_KEYS.GALLERY_MEDIA, media);
      if (announcements && announcements.length > 0) this.setItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
      if (sponsors && sponsors.length > 0) this.setItem(STORAGE_KEYS.SPONSORS, sponsors);
      if (statistics && statistics.length > 0) this.setItem(STORAGE_KEYS.STATISTICS, statistics[0]);
    } catch (err) {
      console.warn('Supabase DB auto-sync error:', err);
    }
  }

  // Events
  static getEvents() {
    return this.getItem(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }
  static async saveEvents(events: any[]) {
    this.setItem(STORAGE_KEYS.EVENTS, events);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('events').upsert(events, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase events sync warning:', e);
      }
    }
  }

  // Team
  static getTeam() {
    return this.getItem(STORAGE_KEYS.TEAM, INITIAL_TEAM);
  }
  static async saveTeam(team: any[]) {
    this.setItem(STORAGE_KEYS.TEAM, team);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('team_members').upsert(team, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase team sync warning:', e);
      }
    }
  }

  // Announcements
  static getAnnouncements() {
    return this.getItem(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }
  static async saveAnnouncements(items: any[]) {
    this.setItem(STORAGE_KEYS.ANNOUNCEMENTS, items);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('announcements').upsert(items, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase announcements sync warning:', e);
      }
    }
  }

  // Albums
  static getAlbums() {
    return this.getItem(STORAGE_KEYS.ALBUMS, INITIAL_ALBUMS);
  }
  static async saveAlbums(albums: any[]) {
    this.setItem(STORAGE_KEYS.ALBUMS, albums);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('gallery_albums').upsert(albums, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase albums sync warning:', e);
      }
    }
  }

  // Gallery Media
  static getGalleryMedia() {
    return this.getItem(STORAGE_KEYS.GALLERY_MEDIA, INITIAL_GALLERY_MEDIA);
  }
  static async saveGalleryMedia(media: any[]) {
    this.setItem(STORAGE_KEYS.GALLERY_MEDIA, media);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('gallery_media').upsert(media, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase gallery media sync warning:', e);
      }
    }
  }

  // Statistics
  static getStatistics() {
    return this.getItem(STORAGE_KEYS.STATISTICS, INITIAL_STATISTICS);
  }
  static async saveStatistics(stats: any) {
    this.setItem(STORAGE_KEYS.STATISTICS, stats);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('community_statistics').upsert(stats, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase statistics sync warning:', e);
      }
    }
  }

  // Settings
  static getSettings() {
    return this.getItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
  static async saveSettings(settings: any) {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('community_settings').upsert(settings, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase settings sync warning:', e);
      }
    }
  }

  // Sponsors
  static getSponsors() {
    return this.getItem(STORAGE_KEYS.SPONSORS, INITIAL_SPONSORS);
  }
  static async saveSponsors(sponsors: any[]) {
    this.setItem(STORAGE_KEYS.SPONSORS, sponsors);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('sponsors').upsert(sponsors, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase sponsors sync warning:', e);
      }
    }
  }

  // Contact Messages
  static getMessages() {
    return this.getItem(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  }
  static saveMessages(messages: any[]) {
    this.setItem(STORAGE_KEYS.MESSAGES, messages);
  }

  // Activity Logs
  static getLogs() {
    return this.getItem(STORAGE_KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
  }
  static addLog(action: string, details: string, adminName: string = 'CoderushOfficials') {
    const logs = this.getLogs();
    const newLog = {
      id: 'log-' + Date.now(),
      action,
      details,
      admin_name: adminName,
      created_at: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.LOGS, [newLog, ...logs]);
  }

  // Auth Session
  static getAuthSession() {
    return this.getItem(STORAGE_KEYS.AUTH, null);
  }
  static saveAuthSession(session: any) {
    this.setItem(STORAGE_KEYS.AUTH, session);
  }
  static clearAuthSession() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
}
