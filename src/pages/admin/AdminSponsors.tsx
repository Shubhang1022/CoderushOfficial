import React, { useState } from 'react';
import { Plus, Trash2, Award } from 'lucide-react';
import { SettingsService } from '../../services/settingsService';
import { EventSponsor } from '../../types';

export const AdminSponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<EventSponsor[]>(SettingsService.getSponsors());
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('https://github.githubassets.com/assets/GitHub-Mark-ea2971500d4d.png');
  const [tier, setTier] = useState('Title Sponsor');

  const refreshSponsors = () => {
    setSponsors(SettingsService.getSponsors());
  };

  const handleAddSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    SettingsService.saveSponsor({ sponsor_name: name, logo, tier });
    setName('');
    refreshSponsors();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete sponsor?')) {
      SettingsService.deleteSponsor(id);
      refreshSponsors();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Sponsors & Partners</h1>
        <p className="text-xs text-text-muted">Manage global and event sponsorship tiers.</p>
      </div>

      <div className="card-dark p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="font-heading font-semibold text-white text-sm">Add New Sponsor</h3>
        <form onSubmit={handleAddSponsor} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-xs text-text-muted">Sponsor Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-text-muted">Logo URL</label>
            <input
              type="text"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-text-muted">Tier</label>
            <input
              type="text"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <button type="submit" className="py-2.5 px-4 rounded-xl bg-brand-blue text-white text-xs font-semibold shadow-glow-blue flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" /> Add Sponsor
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sponsors.map((sp) => (
          <div key={sp.id} className="card-dark p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={sp.logo} alt="" className="w-8 h-8 object-contain" />
              <div>
                <h4 className="font-heading font-bold text-white text-xs">{sp.sponsor_name}</h4>
                <span className="text-[10px] text-brand-cyan font-mono">{sp.tier}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(sp.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
