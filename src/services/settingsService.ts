import { CommunitySettings, CommunityStatistics, EventSponsor } from '../types';
import { StorageService } from './storageService';

export class SettingsService {
  static getSettings(): CommunitySettings {
    return StorageService.getSettings();
  }

  static updateSettings(newSettings: Partial<CommunitySettings>): CommunitySettings {
    const current = this.getSettings();
    const updated = {
      ...current,
      ...newSettings,
      updated_at: new Date().toISOString(),
    };
    StorageService.saveSettings(updated);
    StorageService.addLog('Settings Updated', 'Updated global community website settings');
    return updated;
  }

  static getStatistics(): CommunityStatistics {
    return StorageService.getStatistics();
  }

  static updateStatistics(newStats: Partial<CommunityStatistics>): CommunityStatistics {
    const current = this.getStatistics();
    const updated = {
      ...current,
      ...newStats,
      updated_at: new Date().toISOString(),
    };
    StorageService.saveStatistics(updated);
    StorageService.addLog('Statistics Updated', 'Manually updated community impact statistics');
    return updated;
  }

  static getSponsors(): EventSponsor[] {
    const list = StorageService.getSponsors();
    return list.sort((a, b) => a.display_order - b.display_order);
  }

  static saveSponsor(data: Partial<EventSponsor>): EventSponsor {
    const list = StorageService.getSponsors();
    let updated: EventSponsor;

    if (data.id) {
      const index = list.findIndex(s => s.id === data.id);
      if (index !== -1) {
        updated = { ...list[index], ...data };
        list[index] = updated;
      } else {
        throw new Error('Sponsor not found');
      }
    } else {
      updated = {
        id: 'sp-' + Date.now(),
        sponsor_name: data.sponsor_name || 'New Sponsor',
        logo: data.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
        website: data.website || '',
        tier: data.tier || 'Community Partner',
        description: data.description || '',
        display_order: data.display_order ?? (list.length + 1),
      };
      list.push(updated);
    }

    StorageService.saveSponsors(list);
    return updated;
  }

  static deleteSponsor(id: string): void {
    let list = StorageService.getSponsors();
    list = list.filter(s => s.id !== id);
    StorageService.saveSponsors(list);
  }
}
