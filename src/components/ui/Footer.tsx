import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Instagram, Linkedin, Github, Youtube, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { SettingsService } from '../../services/settingsService';
import { AuthService } from '../../services/authService';

export const Footer: React.FC = () => {
  const settings = SettingsService.getSettings();
  const isAdmin = AuthService.isAuthenticated();

  return (
    <footer className="relative bg-[#04060A] border-t border-white/5 pt-16 pb-12 overflow-hidden">
      {/* Background ambient glow */}
      <div className="glow-ambient-blue bottom-0 left-1/2 -translate-x-1/2 opacity-30" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan p-[1px] flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-[#080B12] rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/coderush_logo.jpg" alt="CodeRush Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-white tracking-wide block leading-none">
                  CODERUSH
                </span>
                <span className="text-[10px] text-text-muted font-medium tracking-wider uppercase block">
                  BBDNIIT
                </span>
              </div>
            </Link>
            <p className="text-text-secondary text-xs leading-relaxed max-w-md">
              {settings.about || 'CodeRush is the official technical community of BBDNIIT, establishing technical excellence through hackathons, workshops, and student engineering communities.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-brand-blue hover:bg-brand-blue/10 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-brand-blue hover:bg-brand-blue/10 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.github && (
                <a
                  href={settings.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-brand-blue hover:bg-brand-blue/10 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-brand-blue hover:bg-brand-blue/10 transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-text-secondary hover:text-brand-cyan transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary hover:text-brand-cyan transition-colors">About CodeRush</Link>
              </li>
              <li>
                <Link to="/events" className="text-text-secondary hover:text-brand-cyan transition-colors">Technical Events</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-text-secondary hover:text-brand-cyan transition-colors">Media Gallery</Link>
              </li>
              <li>
                <Link to="/team" className="text-text-secondary hover:text-brand-cyan transition-colors">Organizing Team</Link>
              </li>
              <li>
                <Link to="/updates" className="text-text-secondary hover:text-brand-cyan transition-colors">Community Updates</Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-secondary hover:text-brand-cyan transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Info */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Community Contact
            </h4>
            <ul className="space-y-3 text-xs text-text-secondary">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                <span>{settings.address || 'BBDNIIT Campus, Faizabad Road, Lucknow'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-cyan shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} CodeRush BBDNIIT. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Official Coding Club of BBDNIIT
          </p>
        </div>
      </div>
    </footer>
  );
};
