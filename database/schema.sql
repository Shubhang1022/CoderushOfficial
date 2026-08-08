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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Event Statistics Table
CREATE TABLE IF NOT EXISTS public.event_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    participants INT DEFAULT 0,
    volunteers INT DEFAULT 0,
    organizers INT DEFAULT 0,
    judges INT DEFAULT 0,
    mentors INT DEFAULT 0,
    projects INT DEFAULT 0,
    teams INT DEFAULT 0,
    colleges INT DEFAULT 0,
    sponsors INT DEFAULT 0,
    certificates INT DEFAULT 0,
    hours INT DEFAULT 0,
    prize_pool VARCHAR(100) DEFAULT '₹0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Gallery Table
CREATE TABLE IF NOT EXISTS public.event_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    media_type VARCHAR(20) DEFAULT 'image', -- 'image' or 'video'
    title VARCHAR(255),
    caption TEXT,
    file_url TEXT NOT NULL,
    thumbnail TEXT,
    display_order INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Videos Table
CREATE TABLE IF NOT EXISTS public.event_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    youtube_link TEXT,
    video_file TEXT,
    thumbnail TEXT,
    duration VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Winners Table
CREATE TABLE IF NOT EXISTS public.event_winners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    position VARCHAR(100) NOT NULL, -- Winner, Runner Up, 2nd Runner Up, Special Mention
    team_name VARCHAR(255) NOT NULL,
    members TEXT,
    college VARCHAR(255),
    project VARCHAR(255),
    photo TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Sponsors Table
CREATE TABLE IF NOT EXISTS public.event_sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    sponsor_name VARCHAR(255) NOT NULL,
    logo TEXT NOT NULL,
    website TEXT,
    tier VARCHAR(100) DEFAULT 'Community Partner',
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Timeline Table
CREATE TABLE IF NOT EXISTS public.event_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_time TIMESTAMPTZ NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Schedule Table
CREATE TABLE IF NOT EXISTS public.event_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    day VARCHAR(100) NOT NULL,
    time VARCHAR(100) NOT NULL,
    session_title VARCHAR(255) NOT NULL,
    speaker VARCHAR(255),
    venue VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event FAQs Table
CREATE TABLE IF NOT EXISTS public.event_faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Rules Table
CREATE TABLE IF NOT EXISTS public.event_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    rule TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    cover_image TEXT NOT NULL,
    description TEXT,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    event_date TIMESTAMPTZ,
    display_order INT DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Media Table
CREATE TABLE IF NOT EXISTS public.gallery_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    media_type VARCHAR(20) DEFAULT 'image', -- 'image' or 'video'
    file_url TEXT NOT NULL,
    thumbnail TEXT,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Statistics Table
CREATE TABLE IF NOT EXISTS public.community_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
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

-- Public read and write access policies for Supabase Cloud DB sync
DROP POLICY IF EXISTS "Public Read Events" ON public.events;
DROP POLICY IF EXISTS "Public Read Team" ON public.team_members;
DROP POLICY IF EXISTS "Public Read Announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public Read Albums" ON public.gallery_albums;
DROP POLICY IF EXISTS "Public Read Gallery Media" ON public.gallery_media;
DROP POLICY IF EXISTS "Public Read Stats" ON public.community_statistics;
DROP POLICY IF EXISTS "Public Read Settings" ON public.community_settings;
DROP POLICY IF EXISTS "Public Insert Messages" ON public.contact_messages;

CREATE POLICY "Public Read Events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Team" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Albums" ON public.gallery_albums FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Gallery Media" ON public.gallery_media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Stats" ON public.community_statistics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read Settings" ON public.community_settings FOR ALL USING (true) WITH CHECK (true);
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
