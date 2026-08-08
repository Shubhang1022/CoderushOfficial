import { TeamMember } from '../types';
import { StorageService } from './storageService';

export class TeamService {
  static getTeam(): TeamMember[] {
    const team = StorageService.getTeam();
    return team.sort((a, b) => a.display_order - b.display_order);
  }

  static getActiveTeam(): TeamMember[] {
    return this.getTeam().filter(m => m.is_active);
  }

  static saveMember(memberData: Partial<TeamMember>): TeamMember {
    const team = StorageService.getTeam();
    let updatedMember: TeamMember;

    if (memberData.id) {
      const index = team.findIndex(m => m.id === memberData.id);
      if (index !== -1) {
        updatedMember = { ...team[index], ...memberData };
        team[index] = updatedMember;
        StorageService.addLog('Team Member Updated', `Updated team member "${updatedMember.name}"`);
      } else {
        throw new Error('Member not found');
      }
    } else {
      updatedMember = {
        id: 'tm-' + Date.now(),
        name: memberData.name || 'New Member',
        role: memberData.role || 'Core Member',
        department: memberData.department || 'CSE',
        year: memberData.year || '3rd Year',
        photo: memberData.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
        bio: memberData.bio || '',
        linkedin: memberData.linkedin || '',
        github: memberData.github || '',
        email: memberData.email || '',
        display_order: memberData.display_order ?? (team.length + 1),
        featured: memberData.featured ?? false,
        is_active: memberData.is_active ?? true,
        created_at: new Date().toISOString(),
      };
      team.push(updatedMember);
      StorageService.addLog('Team Member Added', `Added team member "${updatedMember.name}"`);
    }

    StorageService.saveTeam(team);
    return updatedMember;
  }

  static deleteMember(id: string): void {
    let team = StorageService.getTeam();
    const member = team.find(m => m.id === id);
    team = team.filter(m => m.id !== id);
    StorageService.saveTeam(team);
    if (member) {
      StorageService.addLog('Team Member Deleted', `Deleted team member "${member.name}"`);
    }
  }
}
