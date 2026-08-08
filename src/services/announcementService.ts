import { Announcement } from '../types';
import { StorageService } from './storageService';

export class AnnouncementService {
  static getAnnouncements(): Announcement[] {
    const list = StorageService.getAnnouncements();
    return list.sort((a, b) => b.priority - a.priority);
  }

  static getActiveAnnouncements(): Announcement[] {
    const now = new Date();
    return this.getAnnouncements().filter(ann => {
      if (!ann.published) return false;
      const pubDate = new Date(ann.publish_date);
      if (now < pubDate) return false;
      if (ann.expiry_date) {
        const expDate = new Date(ann.expiry_date);
        if (now > expDate) return false;
      }
      return true;
    });
  }

  static saveAnnouncement(data: Partial<Announcement>): Announcement {
    const list = StorageService.getAnnouncements();
    let updated: Announcement;

    if (data.id) {
      const index = list.findIndex(a => a.id === data.id);
      if (index !== -1) {
        updated = { ...list[index], ...data };
        list[index] = updated;
        StorageService.addLog('Announcement Updated', `Updated announcement "${updated.title}"`);
      } else {
        throw new Error('Announcement not found');
      }
    } else {
      updated = {
        id: 'ann-' + Date.now(),
        title: data.title || 'Untitled Announcement',
        description: data.description || '',
        badge: data.badge || 'General',
        button_text: data.button_text,
        button_link: data.button_link,
        publish_date: data.publish_date || new Date().toISOString(),
        expiry_date: data.expiry_date,
        priority: data.priority ?? 0,
        published: data.published ?? true,
        created_at: new Date().toISOString(),
      };
      list.unshift(updated);
      StorageService.addLog('Announcement Created', `Published announcement "${updated.title}"`);
    }

    StorageService.saveAnnouncements(list);
    return updated;
  }

  static deleteAnnouncement(id: string): void {
    let list = StorageService.getAnnouncements();
    const item = list.find(a => a.id === id);
    list = list.filter(a => a.id !== id);
    StorageService.saveAnnouncements(list);
    if (item) {
      StorageService.addLog('Announcement Deleted', `Deleted announcement "${item.title}"`);
    }
  }
}
