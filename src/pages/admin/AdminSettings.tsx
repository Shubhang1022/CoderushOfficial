import React, { useState } from 'react';
import { Save, CheckCircle2, Settings as SettingsIcon } from 'lucide-react';
import { SettingsService } from '../../services/settingsService';
import { CommunitySettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<CommunitySettings>(SettingsService.getSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    SettingsService.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Website & Branding Settings</h1>
        <p className="text-xs text-text-muted">Manage global community text, hero copy, contact details, and social links.</p>
      </div>

      <form onSubmit={handleSave} className="card-dark p-6 rounded-3xl border border-white/10 space-y-6">
        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Global settings updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Community Name</label>
            <input
              type="text"
              value={settings.website_name}
              onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Hero Title</label>
          <input
            type="text"
            value={settings.hero_title}
            onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Hero Description</label>
          <textarea
            rows={3}
            value={settings.hero_description}
            onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Official Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Campus Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Instagram URL</label>
            <input
              type="text"
              value={settings.instagram || ''}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">LinkedIn URL</label>
            <input
              type="text"
              value={settings.linkedin || ''}
              onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">GitHub URL</label>
            <input
              type="text"
              value={settings.github || ''}
              onChange={(e) => setSettings({ ...settings, github: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
          >
            <Save className="w-4 h-4" /> Save Global Settings
          </button>
        </div>
      </form>
    </div>
  );
};
