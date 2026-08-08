import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, Instagram, Linkedin, Github } from 'lucide-react';
import { SettingsService } from '../services/settingsService';
import { ContactService } from '../services/contactService';

export const Contact: React.FC = () => {
  const settings = SettingsService.getSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      ContactService.sendMessage(formData.name, formData.email, formData.subject || 'General Inquiry', formData.message);
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-cyan">
          <Mail className="w-3.5 h-3.5" />
          GET IN TOUCH
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-white">
          Contact CodeRush
        </h1>
        <p className="text-text-secondary text-sm">
          Have a question regarding hackathons, sponsorships, workshops, or community partnerships? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details */}
        <div className="lg:col-span-5 card-dark rounded-3xl p-8 border border-white/10 space-y-6">
          <h3 className="text-2xl font-heading font-bold text-white">Contact Information</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Our organizing leads typically respond within 24 hours.
          </p>

          <div className="space-y-4 text-xs text-text-secondary pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-brand-blue/20 text-brand-cyan shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-white">Campus Address</strong>
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-blue/20 text-brand-cyan shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-white">Email Us</strong>
                <a href={`mailto:${settings.email}`} className="hover:text-brand-cyan transition-colors">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <h4 className="font-heading font-semibold text-white text-sm">Official Channels</h4>
            <div className="flex items-center gap-3">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-brand-blue/20 text-text-secondary hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-brand-blue/20 text-text-secondary hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {settings.github && (
                <a href={settings.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-brand-blue/20 text-text-secondary hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7 card-dark rounded-3xl p-8 border border-white/10">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Thank you for reaching out to CodeRush. Our community leads will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-text-muted focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Your Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-text-muted focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Subject</label>
                <input
                  type="text"
                  placeholder="Hackathon inquiry, sponsorship, etc."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-text-muted focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-text-muted focus:outline-none focus:border-brand-blue"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-glow-blue hover:shadow-glow-cyan transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
