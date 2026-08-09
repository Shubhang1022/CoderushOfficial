import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Code, ShieldCheck } from 'lucide-react';
import { AuthService } from '../../services/authService';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = AuthService.isAuthenticated();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Team', path: '/team' },
    { name: 'Updates', path: '/updates' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        <nav
          className={`relative flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'glass-nav shadow-2xl border-white/10'
              : 'bg-[#080B12]/80 backdrop-blur-md border border-white/5'
          }`}
        >
          {/* Logo Left */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan p-[1px] flex items-center justify-center shadow-glow-blue group-hover:scale-105 transition-transform overflow-hidden">
              <div className="w-full h-full bg-[#04060A] rounded-full flex items-center justify-center overflow-hidden">
                <img src="/coderush_logo.jpg" alt="CodeRush Logo" className="w-full h-full object-contain p-[1px]" />
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

          {/* Navigation Center */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 relative ${
                  isActive(link.path)
                    ? 'text-white bg-brand-blue/20 border border-brand-blue/40 shadow-glow-blue'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Right */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/events')}
              className="group flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-glow-blue hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Explore Events
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 z-50 glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-brand-blue/20 text-white border border-brand-blue/30'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/events');
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-glow-blue"
            >
              Explore Events
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
