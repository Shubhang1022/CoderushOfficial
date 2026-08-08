-- CodeRush PostgreSQL Database Schema for Supabase
-- Version 1.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    profile_photo TEXT,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    cover_image TEXT,
    poster TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Hackathon',
    mode VARCHAR(50) DEFAULT 'In-Person',
    venue VARCHAR(255) NOT NULL,
    city VARCHAR(100) DEFAULT 'Lucknow',
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    country VARCHAR(100) DEFAULT 'India',
    registration_link TEXT,
    feedback_link TEXT,
    reveal_date TIMESTAMPTZ,
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    event_start TIMESTAMPTZ NOT NULL,
    event_end TIMESTAMPTZ NOT NULL,
    publish_status BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    gallery_published BOOLEAN DEFAULT FALSE,
    registration_enabled BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'draft',
    meta_title VARCHAR(255),
    meta_description TEXT,
    keywords TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    year VARCHAR(50),
    photo TEXT,
    bio TEXT,
    linkedin TEXT,
    github TEXT,
    email VARCHAR(255),
    display_order INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    is_top_leader BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    badge VARCHAR(100) DEFAULT 'General',
    banner TEXT,
    button_text VARCHAR(100),
    button_link TEXT,
    publish_date TIMESTAMPTZ DEFAULT NOW(),
    expiry_date TIMESTAMPTZ,
    priority INT DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Albums Table
CREATE TABLE IF NOT EXISTS public.gallery_albums (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    cover_image TEXT NOT NULL,
    description TEXT,
    event_id VARCHAR(255),
    event_date TIMESTAMPTZ,
    display_order INT DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    media_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Media Table
CREATE TABLE IF NOT EXISTS public.gallery_media (
    id VARCHAR(255) PRIMARY KEY,
    album_id VARCHAR(255),
    media_type VARCHAR(20) DEFAULT 'image',
    file_url TEXT NOT NULL,
    thumbnail TEXT,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schema Migration Fixes for existing Supabase projects (Drop old foreign keys first)
ALTER TABLE IF EXISTS public.event_statistics DROP CONSTRAINT IF EXISTS event_statistics_event_id_fkey;
ALTER TABLE IF EXISTS public.event_gallery DROP CONSTRAINT IF EXISTS event_gallery_event_id_fkey;
ALTER TABLE IF EXISTS public.event_videos DROP CONSTRAINT IF EXISTS event_videos_event_id_fkey;
ALTER TABLE IF EXISTS public.event_winners DROP CONSTRAINT IF EXISTS event_winners_event_id_fkey;
ALTER TABLE IF EXISTS public.event_sponsors DROP CONSTRAINT IF EXISTS event_sponsors_event_id_fkey;
ALTER TABLE IF EXISTS public.event_timeline DROP CONSTRAINT IF EXISTS event_timeline_event_id_fkey;
ALTER TABLE IF EXISTS public.event_schedule DROP CONSTRAINT IF EXISTS event_schedule_event_id_fkey;
ALTER TABLE IF EXISTS public.event_faqs DROP CONSTRAINT IF EXISTS event_faqs_event_id_fkey;
ALTER TABLE IF EXISTS public.event_rules DROP CONSTRAINT IF EXISTS event_rules_event_id_fkey;
ALTER TABLE IF EXISTS public.gallery_albums DROP CONSTRAINT IF EXISTS gallery_albums_event_id_fkey;
ALTER TABLE IF EXISTS public.gallery_media DROP CONSTRAINT IF EXISTS gallery_media_album_id_fkey;
ALTER TABLE IF EXISTS public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_admin_id_fkey;

-- Alter column types to VARCHAR(255) across all existing tables
ALTER TABLE IF EXISTS public.events ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.team_members ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.team_members ADD COLUMN IF NOT EXISTS is_top_leader BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS public.announcements ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.gallery_albums ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.gallery_albums ADD COLUMN IF NOT EXISTS media_count INT DEFAULT 0;
ALTER TABLE IF EXISTS public.gallery_albums ALTER COLUMN event_id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.gallery_media ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.gallery_media ALTER COLUMN album_id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.community_statistics ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.community_settings ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.sponsors ALTER COLUMN id TYPE VARCHAR(255);

ALTER TABLE IF EXISTS public.event_statistics ALTER COLUMN id TYPE VARCHAR(255), ALTER COLUMN event_id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.event_gallery ALTER COLUMN id TYPE VARCHAR(255), ALTER COLUMN event_id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.event_videos ALTER COLUMN id TYPE VARCHAR(255), ALTER COLUMN event_id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.event_winners ALTER COLUMN id TYPE VARCHAR(255), ALTER COLUMN event_id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.event_sponsors ALTER COLUMN id TYPE VARCHAR(255), ALTER COLUMN event_id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.event_timeline ALTER COLUMN id TYPE VARCHAR(255), ALTER COLUMN event_id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.event_schedule ALTER COLUMN id TYPE VARCHAR(255), ALTER COLUMN event_id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.event_faqs ALTER COLUMN id TYPE VARCHAR(255), ALTER COLUMN event_id TYPE VARCHAR(255);
ALTER TABLE IF EXISTS public.event_rules ALTER COLUMN id TYPE VARCHAR(255), ALTER COLUMN event_id TYPE VARCHAR(255);

-- Community Statistics Table
CREATE TABLE IF NOT EXISTS public.community_statistics (
    id VARCHAR(255) PRIMARY KEY,
    students_reached INT DEFAULT 2500,
    community_members INT DEFAULT 1200,
    events INT DEFAULT 18,
    hackathons INT DEFAULT 6,
    workshops INT DEFAULT 12,
    organizers INT DEFAULT 45,
    projects INT DEFAULT 85,
    sponsors INT DEFAULT 15,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Settings Table
CREATE TABLE IF NOT EXISTS public.community_settings (
    id VARCHAR(255) PRIMARY KEY,
    website_name VARCHAR(255) DEFAULT 'CodeRush',
    tagline VARCHAR(255) DEFAULT 'Official Technical Community of BBDNIIT',
    about TEXT,
    email VARCHAR(255) DEFAULT 'coderush.bbdniit@gmail.com',
    phone VARCHAR(50),
    address TEXT DEFAULT 'BBDNIIT Campus, Faizabad Road, Lucknow',
    instagram VARCHAR(255) DEFAULT 'https://instagram.com/coderush_bbdniit',
    linkedin VARCHAR(255) DEFAULT 'https://linkedin.com/company/coderush-bbdniit',
    github VARCHAR(255) DEFAULT 'https://github.com/coderush-bbdniit',
    youtube VARCHAR(255),
    discord VARCHAR(255),
    logo TEXT,
    favicon TEXT,
    hero_title VARCHAR(255) DEFAULT 'CODERUSH',
    hero_subtitle VARCHAR(255) DEFAULT 'Official Technical Community of BBDNIIT',
    hero_description TEXT DEFAULT 'Building the future of technical innovation through hackathons, workshops, and developer communities.',
    footer_text TEXT DEFAULT 'Empowering students to innovate, build, and lead.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread', -- 'unread', 'read', 'replied'
    reply_content TEXT,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS  public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsors Table
CREATE TABLE IF NOT EXISTS public.sponsors (
    id VARCHAR(255) PRIMARY KEY,
    sponsor_name VARCHAR(255) NOT NULL,
    logo TEXT NOT NULL,
    website TEXT,
    tier VARCHAR(100) DEFAULT 'Community Partner',
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Public read and write access policies for Supabase Cloud DB sync
DROP POLICY IF EXISTS "Public Read Events" ON public.events;
DROP POLICY IF EXISTS "Public Read Team" ON public.team_members;
DROP POLICY IF EXISTS "Public Read Announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public Read Albums" ON public.gallery_albums;
DROP POLICY IF EXISTS "Public Read Gallery Media" ON public.gallery_media;
DROP POLICY IF EXISTS "Public Read Stats" ON public.community_statistics;
DROP POLICY IF EXISTS "Public Read Settings" ON public.community_settings;
DROP POLICY IF EXISTS "Public Read Sponsors" ON public.sponsors;
DROP POLICY IF EXISTS "Public Insert Messages" ON public.contact_messages;

CREATE POLICY "Public Read Events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Team" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Albums" ON public.gallery_albums FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Gallery Media" ON public.gallery_media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Stats" ON public.community_statistics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Settings" ON public.community_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Sponsors" ON public.sponsors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Insert Messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- Supabase Storage Bucket & RLS Policies for 'coderush-media'
INSERT INTO storage.buckets (id, name, public)
VALUES ('coderush-media', 'coderush-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Storage Select" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;

CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING (bucket_id = 'coderush-media');
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'coderush-media');
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'coderush-media');
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id = 'coderush-media');
