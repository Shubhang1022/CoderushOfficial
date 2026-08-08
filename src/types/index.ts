export type EventCategory = 
  | 'Hackathon'
  | 'Workshop'
  | 'Bootcamp'
  | 'Coding Contest'
  | 'Seminar'
  | 'Meetup'
  | 'Conference'
  | 'Tech Talk'
  | string;

export type EventStatus = 
  | 'draft'
  | 'coming_soon'
  | 'registration_opening'
  | 'registration_open'
  | 'registration_closed'
  | 'live'
  | 'completed'
  | 'published';

export interface Event {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_image?: string;
  poster: string;
  category: EventCategory;
  mode: 'In-Person' | 'Online' | 'Hybrid';
  venue: string;
  city?: string;
  state?: string;
  country?: string;
  registration_link?: string;
  feedback_link?: string;
  reveal_date?: string;
  registration_start?: string;
  registration_end?: string;
  event_start: string;
  event_end: string;
  publish_status: boolean;
  featured: boolean;
  gallery_published: boolean;
  registration_enabled: boolean;
  status: EventStatus;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  statistics?: EventStatistics;
  gallery?: EventGalleryItem[];
  videos?: EventVideo[];
  winners?: EventWinner[];
  sponsors?: EventSponsor[];
  timeline?: EventTimelineItem[];
  schedule?: EventScheduleItem[];
  faqs?: EventFAQ[];
  rules?: EventRule[];
}

export interface EventStatistics {
  id: string;
  event_id: string;
  participants: number;
  volunteers: number;
  organizers: number;
  judges: number;
  mentors: number;
  projects: number;
  teams: number;
  colleges: number;
  sponsors: number;
  certificates: number;
  hours: number;
  prize_pool: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventGalleryItem {
  id: string;
  event_id: string;
  media_type: 'image' | 'video';
  title?: string;
  caption?: string;
  file_url: string;
  thumbnail?: string;
  display_order: number;
  featured: boolean;
  created_at?: string;
}

export interface EventVideo {
  id: string;
  event_id: string;
  title: string;
  youtube_link?: string;
  video_file?: string;
  thumbnail?: string;
  duration?: string;
  display_order: number;
}

export interface EventWinner {
  id: string;
  event_id: string;
  position: string; // e.g. "Winner", "1st Runner Up", "Best UI"
  team_name: string;
  members?: string;
  college?: string;
  project?: string;
  photo?: string;
  description?: string;
}

export interface EventSponsor {
  id: string;
  event_id?: string;
  sponsor_name: string;
  logo: string;
  website?: string;
  tier: 'Title Sponsor' | 'Gold' | 'Silver' | 'Bronze' | 'Community Partner' | string;
  description?: string;
  display_order: number;
}

export interface EventTimelineItem {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  event_time: string;
  display_order: number;
}

export interface EventScheduleItem {
  id: string;
  event_id: string;
  day: string;
  time: string;
  session_title: string;
  speaker?: string;
  venue?: string;
  display_order: number;
}

export interface EventFAQ {
  id: string;
  event_id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface EventRule {
  id: string;
  event_id: string;
  rule: string;
  display_order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  year?: string;
  photo: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  email?: string;
  display_order: number;
  featured: boolean;
  is_top_leader?: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  badge: 'Recruitment' | 'Workshop' | 'Registration' | 'Gallery' | 'Results' | 'General' | string;
  banner?: string;
  button_text?: string;
  button_link?: string;
  publish_date: string;
  expiry_date?: string;
  priority: number;
  published: boolean;
  created_at?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  description?: string;
  event_id?: string;
  event_date?: string;
  display_order: number;
  published: boolean;
  created_at?: string;
  media_count?: number;
}

export interface GalleryMedia {
  id: string;
  album_id: string;
  media_type: 'image' | 'video';
  file_url: string;
  thumbnail?: string;
  caption?: string;
  display_order: number;
  created_at?: string;
}

export interface CommunityStatistics {
  id?: string;
  students_reached: number;
  community_members: number;
  events: number;
  hackathons: number;
  workshops: number;
  organizers: number;
  projects: number;
  sponsors: number;
  updated_at?: string;
}

export interface CommunitySettings {
  id?: string;
  website_name: string;
  tagline: string;
  about: string;
  email: string;
  phone?: string;
  address: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  discord?: string;
  logo?: string;
  favicon?: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  footer_text: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  reply_content?: string;
  replied_at?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  profile_photo?: string;
  role: 'super_admin' | 'admin';
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  admin_name: string;
  created_at: string;
}
