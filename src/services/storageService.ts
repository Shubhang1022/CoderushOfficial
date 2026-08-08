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
    } catch (e: any) {
      console.error(`Error writing ${key} to localStorage:`, e);
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        console.warn('LocalStorage quota limit reached for offline storage.');
      }
    }
  }

  // Events
  static getEvents() {
    return this.getItem(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }
  static saveEvents(events: any[]) {
    this.setItem(STORAGE_KEYS.EVENTS, events);
  }

  // Team
  static getTeam() {
    return this.getItem(STORAGE_KEYS.TEAM, INITIAL_TEAM);
  }
  static saveTeam(team: any[]) {
    this.setItem(STORAGE_KEYS.TEAM, team);
  }

  // Announcements
  static getAnnouncements() {
    return this.getItem(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }
  static saveAnnouncements(items: any[]) {
    this.setItem(STORAGE_KEYS.ANNOUNCEMENTS, items);
  }

  // Albums
  static getAlbums() {
    return this.getItem(STORAGE_KEYS.ALBUMS, INITIAL_ALBUMS);
  }
  static saveAlbums(albums: any[]) {
    this.setItem(STORAGE_KEYS.ALBUMS, albums);
  }

  // Gallery Media
  static getGalleryMedia() {
    return this.getItem(STORAGE_KEYS.GALLERY_MEDIA, INITIAL_GALLERY_MEDIA);
  }
  static saveGalleryMedia(media: any[]) {
    this.setItem(STORAGE_KEYS.GALLERY_MEDIA, media);
  }

  // Statistics
  static getStatistics() {
    return this.getItem(STORAGE_KEYS.STATISTICS, INITIAL_STATISTICS);
  }
  static saveStatistics(stats: any) {
    this.setItem(STORAGE_KEYS.STATISTICS, stats);
  }

  // Settings
  static getSettings() {
    return this.getItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
  static saveSettings(settings: any) {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // Sponsors
  static getSponsors() {
    return this.getItem(STORAGE_KEYS.SPONSORS, INITIAL_SPONSORS);
  }
  static saveSponsors(sponsors: any[]) {
    this.setItem(STORAGE_KEYS.SPONSORS, sponsors);
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
