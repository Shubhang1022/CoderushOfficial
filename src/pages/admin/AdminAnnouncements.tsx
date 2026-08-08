import React, { useState } from 'react';
import { Plus, Bell, Trash2, X } from 'lucide-react';
import { AnnouncementService } from '../../services/announcementService';
import { Announcement } from '../../types';

export const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(AnnouncementService.getAnnouncements());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnn, setNewAnn] = useState<Partial<Announcement>>({
    title: '',
    description: '',
    badge: 'Recruitment',
    button_text: 'Apply Now',
    button_link: 'https://forms.google.com/',
    published: true,
  });

  const refreshList = () => {
    setAnnouncements(AnnouncementService.getAnnouncements());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title) return;
    AnnouncementService.saveAnnouncement({
      ...newAnn,
      badge: newAnn.badge?.trim() || 'General',
    });
    setIsModalOpen(false);
    setNewAnn({ title: '', description: '', badge: 'General', published: true });
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete announcement?')) {
      AnnouncementService.deleteAnnouncement(id);
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Announcements Manager</h1>
          <p className="text-xs text-text-muted">Broadcast recruitment notices, hackathons, and news.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
        >
          <Plus className="w-4 h-4" /> Create Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="card-dark rounded-2xl p-5 border border-white/10 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                  {ann.badge}
                </span>
                <span className="text-[10px] text-text-muted font-mono">{new Date(ann.publish_date).toLocaleDateString()}</span>
              </div>
              <h3 className="font-heading font-bold text-white text-base">{ann.title}</h3>
              <p className="text-xs text-text-secondary line-clamp-2">{ann.description}</p>
            </div>

            <button onClick={() => handleDelete(ann.id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg card-dark rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-white text-base">New Announcement</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full bg-white/5 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Title *</label>
                <input
                  type="text"
                  required
                  value={newAnn.title || ''}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Recruitment, Workshop, Results"
                  value={newAnn.badge ?? ''}
                  onChange={(e) => setNewAnn({ ...newAnn, badge: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Description</label>
                <textarea
                  rows={3}
                  value={newAnn.description || ''}
                  onChange={(e) => setNewAnn({ ...newAnn, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Button Text</label>
                  <input
                    type="text"
                    value={newAnn.button_text || ''}
                    onChange={(e) => setNewAnn({ ...newAnn, button_text: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Action Link</label>
                  <input
                    type="text"
                    value={newAnn.button_link || ''}
                    onChange={(e) => setNewAnn({ ...newAnn, button_link: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue">
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
