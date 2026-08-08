import React, { useState } from 'react';
import { Save, CheckCircle2, BarChart3 } from 'lucide-react';
import { SettingsService } from '../../services/settingsService';
import { CommunityStatistics } from '../../types';

export const AdminStatistics: React.FC = () => {
  const [stats, setStats] = useState<CommunityStatistics>(SettingsService.getStatistics());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    SettingsService.updateStatistics(stats);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Community Statistics</h1>
        <p className="text-xs text-text-muted">
          Manually update community metrics shown on the public homepage. (Never calculated automatically).
        </p>
      </div>

      <div className="card-dark p-6 rounded-3xl border border-white/10 space-y-6">
        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Statistics saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Students Reached</label>
            <input
              type="number"
              value={stats.students_reached}
              onChange={(e) => setStats({ ...stats, students_reached: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Community Members</label>
            <input
              type="number"
              value={stats.community_members}
              onChange={(e) => setStats({ ...stats, community_members: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Total Events</label>
            <input
              type="number"
              value={stats.events}
              onChange={(e) => setStats({ ...stats, events: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Hackathons Conducted</label>
            <input
              type="number"
              value={stats.hackathons}
              onChange={(e) => setStats({ ...stats, hackathons: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Workshops Conducted</label>
            <input
              type="number"
              value={stats.workshops}
              onChange={(e) => setStats({ ...stats, workshops: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Projects Built</label>
            <input
              type="number"
              value={stats.projects}
              onChange={(e) => setStats({ ...stats, projects: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="col-span-2 pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
            >
              <Save className="w-4 h-4" /> Save Impact Statistics
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
