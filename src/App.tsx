import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { Gallery } from './pages/Gallery';
import { GalleryAlbum } from './pages/GalleryAlbum';
import { Team } from './pages/Team';
import { Updates } from './pages/Updates';
import { Contact } from './pages/Contact';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminTeam } from './pages/admin/AdminTeam';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminStatistics } from './pages/admin/AdminStatistics';
import { AdminSponsors } from './pages/admin/AdminSponsors';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminActivityLogs } from './pages/admin/AdminActivityLogs';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:slug" element={<EventDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery/:album" element={<GalleryAlbum />} />
          <Route path="team" element={<Team />} />
          <Route path="updates" element={<Updates />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin CMS Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="sponsors" element={<AdminSponsors />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="activity-logs" element={<AdminActivityLogs />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
