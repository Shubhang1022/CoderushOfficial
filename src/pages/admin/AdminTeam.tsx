import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, X, Upload, Crown, CheckCircle2 } from 'lucide-react';
import { TeamService } from '../../services/teamService';
import { TeamMember } from '../../types';
import { uploadToSupabaseStorage } from '../../lib/supabase';

export const AdminTeam: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>(TeamService.getTeam());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const refreshTeam = () => {
    setTeam(TeamService.getTeam());
  };

  const handleOpenCreateModal = () => {
    setEditingMember({
      name: '',
      role: 'Core Member',
      department: 'CSE',
      year: '3rd Year',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      display_order: team.length + 1,
      featured: false,
      is_top_leader: false,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      TeamService.deleteMember(id);
      refreshTeam();
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingMember) return;

    setUploadingImage(true);
    try {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const supabaseUrl = await uploadToSupabaseStorage(dataUrl, 'team');
      const finalPhoto = supabaseUrl || dataUrl;

      setEditingMember({ ...editingMember, photo: finalPhoto });
    } catch (err) {
      alert('Error uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name) return;

    if (editingMember.is_top_leader) {
      const existingTopLeaders = team.filter((m) => m.is_top_leader && m.id !== editingMember.id);
      if (existingTopLeaders.length >= 2) {
        alert('Maximum 2 Top Community Leaders allowed. Please uncheck one of the existing top leaders first.');
        return;
      }
    }

    TeamService.saveMember(editingMember);
    setIsModalOpen(false);
    setEditingMember(null);
    refreshTeam();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Team Management</h1>
          <p className="text-xs text-text-muted">Manage top 2 community leaders, department leads, and core team members.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
        >
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      <div className="card-dark rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/5 text-text-muted uppercase font-mono">
              <tr>
                <th className="p-4">Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department & Year</th>
                <th className="p-4">Hierarchy Level</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 flex items-center gap-3">
                    <img src={m.photo} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-brand-cyan/40 shadow-glow-cyan/20 shrink-0" />
                    <div>
                      <span className="font-heading font-bold text-white block">{m.name}</span>
                      {m.email && <span className="text-[10px] text-text-muted font-mono">{m.email}</span>}
                    </div>
                  </td>
                  <td className="p-4 text-brand-cyan font-mono font-semibold">{m.role}</td>
                  <td className="p-4 text-text-secondary">{m.department} ({m.year})</td>
                  <td className="p-4">
                    {m.is_top_leader ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <Crown className="w-3 h-3 text-amber-400" />
                        Top Leader (1 of 2)
                      </span>
                    ) : m.featured ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-blue/20 text-brand-cyan border border-brand-blue/30 w-fit">
                        Lead Member
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 text-text-muted border border-white/10 w-fit">
                        Core Member
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEditModal(m)} className="p-2 rounded-lg bg-white/5 text-white hover:bg-brand-blue/20">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col card-dark rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <h3 className="font-heading font-bold text-white text-lg">
                {editingMember.id ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full bg-white/5 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto pr-2 space-y-4 pt-4">
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
                <img
                  src={editingMember.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-cyan/50 shadow-glow-cyan/20 shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-brand-cyan" />
                    Upload Circular Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-text-muted border border-white/10 rounded-xl p-2 bg-white/5 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-blue file:text-white"
                  />
                  {uploadingImage && <span className="text-[10px] text-brand-cyan animate-pulse">Uploading photo...</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Or Paste Photo URL (Optional)</label>
                <input
                  type="text"
                  value={editingMember.photo || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, photo: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="e.g. Shubhang Srivastava"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="e.g. Faculty Coordinator, Technical Lead, UI/UX Lead"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Department</label>
                  <input
                    type="text"
                    value={editingMember.department || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                    placeholder="e.g. CSE, IT, ECE"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Year / Designation</label>
                  <input
                    type="text"
                    value={editingMember.year || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, year: e.target.value })}
                    placeholder="e.g. 4th Year, Faculty"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Hierarchy Roles */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <h4 className="font-heading font-semibold text-white text-xs text-brand-cyan uppercase tracking-wider flex items-center justify-between">
                  <span>Hierarchy & Positioning</span>
                  <span className="text-[10px] font-mono text-amber-400 font-normal">
                    Top Leaders ({team.filter((m) => m.is_top_leader).length}/2)
                  </span>
                </h4>

                {(() => {
                  const otherTopLeadersCount = team.filter((m) => m.is_top_leader && m.id !== editingMember.id).length;
                  const isTopLeaderDisabled = otherTopLeadersCount >= 2 && !editingMember.is_top_leader;

                  return (
                    <label className={`flex items-start gap-2.5 text-xs text-white ${isTopLeaderDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        disabled={isTopLeaderDisabled}
                        checked={editingMember.is_top_leader || false}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            is_top_leader: e.target.checked,
                            featured: e.target.checked ? true : editingMember.featured,
                          })
                        }
                        className="rounded bg-white/5 w-4 h-4 text-amber-400 mt-0.5"
                      />
                      <div>
                        <span className="font-bold block text-amber-300 flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-amber-400" />
                          Top 2 Community Leader
                        </span>
                        <span className="text-[11px] text-text-muted block">
                          Display at the absolute top of the team page in top leadership spotlight.
                        </span>
                        {isTopLeaderDisabled && (
                          <span className="text-[10px] text-amber-400 font-mono block mt-1">
                            ⚠️ Maximum 2 Top Leaders limit reached. Uncheck an existing leader to assign a new one.
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })()}

                <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMember.featured || false}
                    onChange={(e) => setEditingMember({ ...editingMember, featured: e.target.checked })}
                    className="rounded bg-white/5 w-4 h-4 text-brand-blue"
                  />
                  <div>
                    <span className="font-semibold block">Lead Member</span>
                    <span className="text-[11px] text-text-muted">Display in the Lead Members section (e.g. Department / Domain Lead).</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/5 text-white">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all">
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
