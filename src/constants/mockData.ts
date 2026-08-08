import {
  Event,
  TeamMember,
  Announcement,
  GalleryAlbum,
  GalleryMedia,
  CommunityStatistics,
  CommunitySettings,
  EventSponsor,
  ContactMessage,
  ActivityLog,
} from '../types';

export const INITIAL_SETTINGS: CommunitySettings = {
  id: '1',
  website_name: 'CodeRush',
  tagline: 'Official Technical Community of BBDNIIT',
  about: 'CodeRush is the flagship technical community at Babu Banarasi Das Northern India Institute of Technology (BBDNIIT), Lucknow. We foster student developer ecosystems, host flagship hackathons, conduct hands-on workshops, and bridge academia with tech industry standards.',
  email: 'coderush.bbdniit@gmail.com',
  phone: '+91 98765 43210',
  address: 'BBDNIIT Campus, BBD Educational City, Faizabad Road, Lucknow, UP - 226028',
  instagram: 'https://instagram.com/coderush_bbdniit',
  linkedin: 'https://linkedin.com/company/coderush-bbdniit',
  github: 'https://github.com/coderush-bbdniit',
  youtube: 'https://youtube.com/@coderush_bbdniit',
  hero_title: 'CODERUSH',
  hero_subtitle: 'Official Technical Community of BBDNIIT',
  hero_description: 'Empowering student developers, innovators, and creators through national hackathons, technical bootcamps, and industry mentorship.',
  footer_text: 'Building professional digital identities & empowering future engineering leaders at BBDNIIT.',
};

export const INITIAL_STATISTICS: CommunityStatistics = {
  id: '11111111-1111-1111-1111-111111111111',
  students_reached: 700,
  community_members: 10,
  events: 2,
  hackathons: 1,
  workshops: 1,
  organizers: 10,
  projects: 5,
  sponsors: 2,
};

export const INITIAL_EVENTS: Event[] = [];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Dr. Anurag Shrivastava',
    role: 'Faculty Coordinator',
    department: 'Computer Science & Engineering',
    year: 'Faculty',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    bio: 'Guiding CodeRush vision and driving academic-industry partnerships at BBDNIIT.',
    linkedin: 'https://linkedin.com',
    email: 'anurag.shrivastava@bbdniit.ac.in',
    display_order: 1,
    featured: true,
    is_top_leader: true,
    is_active: true,
  },
  {
    id: 'tm-2',
    name: 'Shubhang Srivastava',
    role: 'Technical Lead & Lead Architect',
    department: 'Information Technology',
    year: '4th Year',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    bio: 'Full-stack software engineer & community lead. Architected CodeRush digital platform.',
    linkedin: 'https://linkedin.com/in/shubhang-srivastava',
    github: 'https://github.com/shubhang-srivastava',
    email: 'shubhang.dev@gmail.com',
    display_order: 2,
    featured: true,
    is_top_leader: true,
    is_active: true,
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

export const INITIAL_ALBUMS: GalleryAlbum[] = [];

export const INITIAL_GALLERY_MEDIA: GalleryMedia[] = [];

export const INITIAL_SPONSORS: EventSponsor[] = [];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Siddharth Roy',
    email: 'siddharth@example.com',
    subject: 'Sponsorship Inquiry for CodeRush 3.0',
    message: 'Hello CodeRush team, our company would like to explore gold tier sponsorship for your upcoming hackathon. Please get in touch.',
    status: 'unread',
    created_at: '2026-08-05T14:30:00Z',
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    action: 'Event Updated',
    details: 'CodeRush 3.0 registration link updated by Super Admin',
    admin_name: 'CoderushOfficials',
    created_at: '2026-08-06T12:00:00Z',
  }
];
