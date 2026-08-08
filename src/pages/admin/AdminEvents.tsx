import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Sparkles, ExternalLink, X, Search, CheckCircle, Upload, Bold } from 'lucide-react';
import { EventService } from '../../services/eventService';
import { Event } from '../../types';
import { uploadToSupabaseStorage } from '../../lib/supabase';

const toInputDateTime = (isoString?: string) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  } catch {
    return '';
  }
};

const fromInputDateTime = (localString: string) => {
  if (!localString) return undefined;
  try {
    return new Date(localString).toISOString();
  } catch {
    return undefined;
  }
};

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(EventService.getAllEvents());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingPoster, setUploadingPoster] = useState(false);

  const applyBoldToField = (field: 'short_description' | 'full_description', textareaId: string) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (!textarea || !editingEvent) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = editingEvent[field] || '';
    const selected = value.substring(start, end);

    const before = value.substring(0, start);
    const after = value.substring(end);
    let newValue = '';
    let newStart = start;
    let newEnd = end;

    if (selected.startsWith('**') && selected.endsWith('**') && selected.length >= 4) {
      const unbolded = selected.slice(2, -2);
      newValue = before + unbolded + after;
      newStart = start;
      newEnd = start + unbolded.length;
    } else {
      const textToBold = selected || 'bold text';
      newValue = `${before}**${textToBold}**${after}`;
      newStart = start + 2;
      newEnd = start + 2 + textToBold.length;
    }

    setEditingEvent({ ...editingEvent, [field]: newValue });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const handleKeyDownBold = (e: React.KeyboardEvent<HTMLTextAreaElement>, field: 'short_description' | 'full_description', textareaId: string) => {
    if (e.key.toLowerCase() === 'b' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      applyBoldToField(field, textareaId);
    }
  };

  const handlePosterFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingEvent) return;

    setUploadingPoster(true);
    try {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const supabaseUrl = await uploadToSupabaseStorage(dataUrl, 'events');
      const finalPoster = supabaseUrl || dataUrl;

      setEditingEvent({ ...editingEvent, poster: finalPoster });
    } catch (err) {
      alert('Error uploading event cover image.');
    } finally {
      setUploadingPoster(false);
    }
  };

  const refreshEvents = () => {
    setEvents(EventService.getAllEvents());
  };

  const handleOpenCreateModal = () => {
    const now = new Date();
    const regStart = new Date(now.getTime() + 86400000); // tomorrow
    const regEnd = new Date(now.getTime() + 86400000 * 7); // +7 days
    const eventStart = new Date(now.getTime() + 86400000 * 10); // +10 days
    const eventEnd = new Date(now.getTime() + 86400000 * 11); // +11 days

    setEditingEvent({
      title: '',
      short_description: '',
      full_description: '',
      poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
      category: 'Hackathon',
      mode: 'In-Person',
      venue: 'Main Auditorium, BBDNIIT Campus',
      registration_link: 'https://forms.google.com/example',
      registration_start: regStart.toISOString(),
      registration_end: regEnd.toISOString(),
      event_start: eventStart.toISOString(),
      event_end: eventEnd.toISOString(),
      publish_status: true,
      gallery_published: false,
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt: Event) => {
    setEditingEvent({ ...evt });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      EventService.deleteEvent(id);
      refreshEvents();
    }
  };

  const handleToggleVisibility = (id: string, current: boolean) => {
    EventService.togglePublicVisibility(id, !current);
    refreshEvents();
  };

  const handleToggleHighlights = (id: string, current: boolean) => {
    EventService.toggleGalleryPublished(id, !current);
    refreshEvents();
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.title) return;

    EventService.saveEvent(editingEvent);
    setIsModalOpen(false);
    setEditingEvent(null);
    refreshEvents();
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Events Management</h1>
          <p className="text-xs text-text-muted">Create, edit, and publish community technical initiatives.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-brand-blue"
            />
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
          >
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="card-dark rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/5 text-text-muted uppercase font-mono">
              <tr>
                <th className="p-4">Event</th>
                <th className="p-4">Category</th>
                <th className="p-4">Mode & Venue</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Status</th>
                <th className="p-4">Highlights</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 flex items-center gap-3">
                    <img src={evt.poster} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <div className="font-heading font-bold text-white">{evt.title}</div>
                      <div className="text-[10px] text-text-muted font-mono">{evt.slug}</div>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary">{evt.category}</td>
                  <td className="p-4 text-text-secondary">{evt.venue} ({evt.mode})</td>
                  <td className="p-4 text-text-muted font-mono">{new Date(evt.event_start).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/5 border border-white/10 text-brand-cyan">
                      {evt.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleVisibility(evt.id, evt.publish_status)}
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                        evt.publish_status
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {evt.publish_status ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleHighlights(evt.id, evt.gallery_published)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                        evt.gallery_published
                          ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30'
                          : 'bg-white/5 text-text-muted border-white/10'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      {evt.gallery_published ? 'Highlights Published' : 'No Highlights'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(evt)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-brand-blue/20 text-white transition-colors"
                      title="Edit Event"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col card-dark rounded-3xl p-6 border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <h3 className="font-heading font-bold text-white text-lg">
                {editingEvent.id ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveForm} className="flex flex-col flex-1 overflow-hidden pt-4">
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Category</label>
                    <select
                      value={editingEvent.category || 'Hackathon'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                      className="w-full bg-[#0F1623] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                    >
                      <option value="Hackathon">Hackathon</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Bootcamp">Bootcamp</option>
                      <option value="Coding Contest">Coding Contest</option>
                      <option value="Seminar">Seminar</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Mode</label>
                    <select
                      value={editingEvent.mode || 'In-Person'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, mode: e.target.value as any })}
                      className="w-full bg-[#0F1623] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                    >
                      <option value="In-Person">In-Person</option>
                      <option value="Online">Online</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Venue</label>
                  <input
                    type="text"
                    value={editingEvent.venue || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-text-secondary">Short Description</label>
                    <button
                      type="button"
                      onClick={() => applyBoldToField('short_description', 'event-short-desc')}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-brand-blue/20 text-brand-cyan text-[11px] font-bold flex items-center gap-1 border border-white/10"
                      title="Make selected text bold (Ctrl+B)"
                    >
                      <Bold className="w-3 h-3" /> Bold (Ctrl+B)
                    </button>
                  </div>
                  <textarea
                    id="event-short-desc"
                    rows={2}
                    value={editingEvent.short_description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, short_description: e.target.value })}
                    onKeyDown={(e) => handleKeyDownBold(e, 'short_description', 'event-short-desc')}
                    className="w-full max-h-40 min-h-[70px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white resize-y focus:outline-none focus:border-brand-blue"
                    placeholder="Brief summary shown on cards... Select text & press Ctrl+B for bold (**text**)"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-text-secondary">Full Description</label>
                    <button
                      type="button"
                      onClick={() => applyBoldToField('full_description', 'event-full-desc')}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-brand-blue/20 text-brand-cyan text-[11px] font-bold flex items-center gap-1 border border-white/10"
                      title="Make selected text bold (Ctrl+B)"
                    >
                      <Bold className="w-3 h-3" /> Bold (Ctrl+B)
                    </button>
                  </div>
                  <textarea
                    id="event-full-desc"
                    rows={4}
                    value={editingEvent.full_description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, full_description: e.target.value })}
                    onKeyDown={(e) => handleKeyDownBold(e, 'full_description', 'event-full-desc')}
                    className="w-full max-h-56 min-h-[100px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white resize-y focus:outline-none focus:border-brand-blue"
                    placeholder="Detailed event breakdown... Select text & press Ctrl+B for bold (**text**)"
                  />
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-brand-cyan" />
                    Upload Event Cover / Poster Image from Device
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterFileChange}
                    className="w-full text-xs text-text-muted border border-white/10 rounded-xl p-2 bg-white/5 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-blue file:text-white"
                  />
                  {uploadingPoster && <span className="text-[10px] text-brand-cyan animate-pulse">Uploading cover image...</span>}
                  {editingEvent.poster && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={editingEvent.poster} alt="Poster preview" className="w-16 h-12 rounded-lg object-cover border border-white/10" />
                      <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Cover image ready
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Or Paste Poster Image URL (Optional)</label>
                  <input
                    type="text"
                    value={editingEvent.poster || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, poster: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <h4 className="font-heading font-semibold text-white text-xs text-brand-cyan uppercase tracking-wider">
                    Registration & Event Timings (Automates Lifecycle Status)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Registration Start Date & Time *</label>
                      <input
                        type="datetime-local"
                        required
                        value={toInputDateTime(editingEvent.registration_start)}
                        onChange={(e) => setEditingEvent({ ...editingEvent, registration_start: fromInputDateTime(e.target.value) })}
                        className="w-full bg-[#0F1623] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Registration End Date & Time *</label>
                      <input
                        type="datetime-local"
                        required
                        value={toInputDateTime(editingEvent.registration_end)}
                        onChange={(e) => setEditingEvent({ ...editingEvent, registration_end: fromInputDateTime(e.target.value) })}
                        className="w-full bg-[#0F1623] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Event Start Date & Time *</label>
                      <input
                        type="datetime-local"
                        required
                        value={toInputDateTime(editingEvent.event_start)}
                        onChange={(e) => setEditingEvent({ ...editingEvent, event_start: fromInputDateTime(e.target.value) })}
                        className="w-full bg-[#0F1623] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Event End Date & Time *</label>
                      <input
                        type="datetime-local"
                        required
                        value={toInputDateTime(editingEvent.event_end)}
                        onChange={(e) => setEditingEvent({ ...editingEvent, event_end: fromInputDateTime(e.target.value) })}
                        className="w-full bg-[#0F1623] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Teaser Reveal Date & Time (Optional)</label>
                    <input
                      type="datetime-local"
                      value={toInputDateTime(editingEvent.reveal_date)}
                      onChange={(e) => setEditingEvent({ ...editingEvent, reveal_date: fromInputDateTime(e.target.value) })}
                      className="w-full bg-[#0F1623] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Google Forms Registration Link</label>
                  <input
                    type="text"
                    value={editingEvent.registration_link || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, registration_link: e.target.value })}
                    placeholder="https://forms.google.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                  <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEvent.publish_status ?? true}
                      onChange={(e) => setEditingEvent({ ...editingEvent, publish_status: e.target.checked })}
                      className="rounded bg-white/5 w-4 h-4 text-brand-blue"
                    />
                    <div>
                      <span className="font-semibold block">Publish Event to Website</span>
                      <span className="text-[11px] text-text-muted">Uncheck to save as Admin Draft (hidden from public view).</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEvent.featured || false}
                      onChange={(e) => setEditingEvent({ ...editingEvent, featured: e.target.checked })}
                      className="rounded bg-white/5 w-4 h-4 text-brand-blue"
                    />
                    <div>
                      <span className="font-semibold block">Featured Spotlight Event</span>
                      <span className="text-[11px] text-text-muted">Display as main horizontal spotlight card on homepage.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEvent.gallery_published || false}
                      onChange={(e) => setEditingEvent({ ...editingEvent, gallery_published: e.target.checked })}
                      className="rounded bg-white/5 w-4 h-4 text-brand-blue"
                    />
                    <div>
                      <span className="font-semibold block text-brand-cyan">Show ✨ Event Highlights Button</span>
                      <span className="text-[11px] text-text-muted">Only enable after event ends and photos/videos are uploaded.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Fixed Footer Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 shrink-0 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
