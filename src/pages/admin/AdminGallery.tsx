import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Trash2, X, FolderPlus, ArrowLeft, Upload, Link as LinkIcon, Film, CheckCircle2 } from 'lucide-react';
import { GalleryService } from '../../services/galleryService';
import { GalleryAlbum, GalleryMedia } from '../../types';
import { uploadToSupabaseStorage } from '../../lib/supabase';
import { compressImageFile } from '../../utils/imageCompressor';
import { compressVideoFile } from '../../utils/videoCompressor';

export const AdminGallery: React.FC = () => {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(GalleryService.getAlbums());
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [albumMedia, setAlbumMedia] = useState<GalleryMedia[]>([]);

  // Modals
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // New Album Form
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumCover, setNewAlbumCover] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumDate, setNewAlbumDate] = useState(new Date().toISOString().slice(0, 10));

  // New Media Form
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [keepVideoAudio, setKeepVideoAudio] = useState(true);

  const refreshGallery = () => {
    const updatedAlbums = GalleryService.getAlbums();
    setAlbums(updatedAlbums);
    if (selectedAlbum) {
      const refreshedAlbum = updatedAlbums.find(a => a.id === selectedAlbum.id);
      if (refreshedAlbum) {
        setSelectedAlbum(refreshedAlbum);
        setAlbumMedia(GalleryService.getMediaForAlbum(refreshedAlbum.id));
      } else {
        setSelectedAlbum(null);
        setAlbumMedia([]);
      }
    }
  };

  const handleOpenAlbum = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    setAlbumMedia(GalleryService.getMediaForAlbum(album.id));
  };

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle) return;

    let finalCoverUrl = newAlbumCover || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200';

    if (coverFile) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(coverFile);
      });

      const supabaseUrl = await uploadToSupabaseStorage(dataUrl, 'covers');
      finalCoverUrl = supabaseUrl || dataUrl;
    }

    const created = GalleryService.saveAlbum({
      title: newAlbumTitle,
      slug: newAlbumTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `album-${Date.now()}`,
      cover_image: finalCoverUrl,
      description: newAlbumDesc || 'Official CodeRush event album',
      event_date: newAlbumDate,
    });
    setIsAlbumModalOpen(false);
    setNewAlbumTitle('');
    setNewAlbumDesc('');
    setNewAlbumCover('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200');
    setCoverFile(null);
    setNewAlbumDate(new Date().toISOString().slice(0, 10));
    refreshGallery();
    handleOpenAlbum(created);
  };

  const handleDeleteAlbum = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this album and all media inside it?')) {
      GalleryService.deleteAlbum(id);
      if (selectedAlbum?.id === id) {
        setSelectedAlbum(null);
      }
      refreshGallery();
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum) return;

    if (selectedFiles.length === 0 && !mediaUrl.trim()) {
      alert('Please choose file(s) from your device or paste a URL.');
      return;
    }

    setUploading(true);

    try {
      if (selectedFiles.length > 0) {
        const itemsToSave: { file_url: string; caption?: string }[] = [];

        for (let idx = 0; idx < selectedFiles.length; idx++) {
          const file = selectedFiles[idx];
          let processedFileOrDataUrl: File | Blob | string;
          const isVideoFile = file.type.startsWith('video/') || (file.name && /\.(mp4|webm|mov|m4v|mkv)$/i.test(file.name));

          if (isVideoFile || mediaType === 'video') {
            setUploadProgress(`Compressing video ${idx + 1} of ${selectedFiles.length} (${keepVideoAudio ? 'Unmuted' : 'Muted'}, reducing size by 70%+)...`);
            processedFileOrDataUrl = await compressVideoFile(
              file,
              720,
              1200000,
              (pct) => setUploadProgress(`Compressing video ${idx + 1}/${selectedFiles.length}: ${pct}%`),
              keepVideoAudio
            );
          } else {
            setUploadProgress(`Compressing photo ${idx + 1} of ${selectedFiles.length}...`);
            processedFileOrDataUrl = await compressImageFile(file, 1080, 1080, 0.70);
          }

          setUploadProgress(`Uploading ${idx + 1} of ${selectedFiles.length} to storage...`);
          // Dual upload: Attempt Supabase Storage upload + save locally
          const supabasePublicUrl = await uploadToSupabaseStorage(processedFileOrDataUrl, 'gallery');
          const finalUrl = supabasePublicUrl || (typeof processedFileOrDataUrl === 'string' ? processedFileOrDataUrl : URL.createObjectURL(processedFileOrDataUrl));

          GalleryService.saveMediaItem({
            album_id: selectedAlbum.id,
            media_type: isVideoFile || mediaType === 'video' ? 'video' : 'image',
            file_url: finalUrl,
            caption: mediaCaption || '',
            display_order: albumMedia.length + idx + 1,
          });
        }
      } else if (mediaUrl.trim()) {
        const isVideoUrl = mediaType === 'video' || /\.(mp4|webm|mov|m4v|mkv)(\?.*)?$/i.test(mediaUrl) || mediaUrl.includes('youtube.com') || mediaUrl.includes('vimeo.com');
        GalleryService.saveMediaItem({
          album_id: selectedAlbum.id,
          media_type: isVideoUrl ? 'video' : 'image',
          file_url: mediaUrl.trim(),
          caption: mediaCaption || '',
          display_order: albumMedia.length + 1,
        });
      }

      setMediaUrl('');
      setMediaCaption('');
      setSelectedFiles([]);
      setUploadProgress('');
      setIsMediaModalOpen(false);
      refreshGallery();
    } catch (err) {
      alert('Failed to process selected media files. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm('Remove this photo/video from album?')) {
      GalleryService.deleteMediaItem(id);
      refreshGallery();
    }
  };

  const isVideoItem = (item: GalleryMedia) => {
    if (item.media_type === 'video') return true;
    return /\.(mp4|webm|mov|m4v|mkv)(\?.*)?$/i.test(item.file_url) || item.file_url.startsWith('data:video') || item.file_url.includes('youtube.com') || item.file_url.includes('vimeo.com');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {selectedAlbum ? (
            <button
              onClick={() => setSelectedAlbum(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-cyan hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Albums
            </button>
          ) : null}
          <h1 className="text-2xl font-heading font-bold text-white">
            {selectedAlbum ? selectedAlbum.title : 'Gallery Albums'}
          </h1>
          <p className="text-xs text-text-muted">
            {selectedAlbum
              ? `Managing ${albumMedia.length} media items inside this album`
              : 'Click any album card to view and upload media files.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedAlbum ? (
            <button
              onClick={() => {
                setSelectedFiles([]);
                setMediaUrl('');
                setIsMediaModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
            >
              <Upload className="w-4 h-4" /> Add Photo / Video
            </button>
          ) : (
            <button
              onClick={() => setIsAlbumModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all"
            >
              <FolderPlus className="w-4 h-4" /> Create New Album
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {selectedAlbum ? (
        /* Inside Selected Album View */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={selectedAlbum.cover_image} alt="" className="w-16 h-12 object-cover rounded-xl border border-white/10" />
              <div>
                <h3 className="font-heading font-bold text-white text-sm">{selectedAlbum.title}</h3>
                <p className="text-xs text-text-muted">{selectedAlbum.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedFiles([]);
                  setMediaUrl('');
                  setIsMediaModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 text-xs font-semibold hover:bg-brand-cyan/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Batch Upload Media
              </button>
            </div>
          </div>

          {albumMedia.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {albumMedia.map((item) => (
                <div key={item.id} className="card-dark rounded-2xl overflow-hidden border border-white/10 relative group">
                  <div className="aspect-[4/3] bg-black relative flex items-center justify-center">
                    {isVideoItem(item) ? (
                      <div className="w-full h-full relative">
                        <video
                          src={item.file_url}
                          controls
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur text-brand-cyan text-[10px] font-mono font-bold flex items-center gap-1 border border-white/10 pointer-events-none">
                          <Film className="w-3 h-3" /> VIDEO
                        </div>
                      </div>
                    ) : (
                      <img src={item.file_url} alt="" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Remove Media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {item.caption && (
                    <div className="p-3 text-xs text-text-secondary line-clamp-1">{item.caption}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 card-dark rounded-3xl space-y-3">
              <ImageIcon className="w-8 h-8 text-text-muted mx-auto" />
              <h4 className="text-white font-heading font-semibold text-sm">No photos or videos in this album yet</h4>
              <p className="text-text-muted text-xs">Click "Add Photo / Video" above to upload media files.</p>
              <button
                onClick={() => {
                  setSelectedFiles([]);
                  setMediaUrl('');
                  setIsMediaModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue"
              >
                <Upload className="w-4 h-4" /> Upload First Photo
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Albums Grid View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => handleOpenAlbum(album)}
              className="cursor-pointer card-dark rounded-3xl overflow-hidden border border-white/10 hover:border-brand-blue/40 relative group transition-all"
            >
              <div className="aspect-[16/10] relative overflow-hidden bg-black">
                <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur text-white border border-white/10">
                  {album.media_count || 0} Media Files
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-white text-base group-hover:text-brand-cyan transition-colors">
                    {album.title}
                  </h3>
                  <span className="text-xs text-brand-blue font-semibold flex items-center gap-1 mt-1">
                    Click to Open & Upload →
                  </span>
                </div>
                <button
                  onClick={(e) => handleDeleteAlbum(e, album.id)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  title="Delete Album"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Album */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-dark rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-white text-base">Create New Album</h3>
              <button onClick={() => setIsAlbumModalOpen(false)} className="p-1 rounded-full bg-white/5 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Album Title *</label>
                <input
                  type="text"
                  required
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  placeholder="e.g. CodeRush 3.0 Finals"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Album Description</label>
                <input
                  type="text"
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  placeholder="e.g. Photos from main auditorium"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Date of Event</label>
                <input
                  type="date"
                  value={newAlbumDate}
                  onChange={(e) => setNewAlbumDate(e.target.value)}
                  className="w-full bg-[#0F1623] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
                <label className="text-xs font-medium text-white flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-brand-cyan" />
                  Upload Cover Image File from Device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  className="w-full text-xs text-text-muted border border-white/10 rounded-xl p-2 bg-white/5 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-blue file:text-white"
                />
                {coverFile && (
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {coverFile.name} selected
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Or Paste Cover Image URL (Optional)</label>
                <input
                  type="text"
                  value={newAlbumCover}
                  onChange={(e) => setNewAlbumCover(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAlbumModalOpen(false)} className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue">
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Batch Upload Media to Selected Album */}
      {isMediaModalOpen && selectedAlbum && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-dark rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-white text-base">
                Upload to "{selectedAlbum.title}"
              </h3>
              <button onClick={() => setIsMediaModalOpen(false)} className="p-1 rounded-full bg-white/5 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Media Type</label>
                <select
                  value={mediaType}
                  onChange={(e) => {
                    setMediaType(e.target.value as any);
                    setSelectedFiles([]);
                  }}
                  className="w-full bg-[#0F1623] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                >
                  <option value="image">Photos (Images)</option>
                  <option value="video">Videos (MP4 / WebM / Embed URL)</option>
                </select>
              </div>

              {/* Upload Files Section */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
                <label className="text-xs font-medium text-white flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-brand-cyan" />
                  Upload {mediaType === 'image' ? 'Image' : 'Video'} Files from Device (Multiple Allowed)
                </label>
                <input
                  type="file"
                  multiple
                  accept={mediaType === 'image' ? 'image/*' : 'video/*,.mp4,.webm'}
                  onChange={handleFilesChange}
                  className="w-full text-xs text-text-muted border border-white/10 rounded-xl p-2 bg-white/5 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-blue file:text-white"
                />
                {selectedFiles.length > 0 && (
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedFiles.length} file(s) selected
                  </div>
                )}
              </div>

              {/* Video Audio Setting Option */}
              {mediaType === 'video' && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/10">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white block">Video Sound / Audio Track</span>
                    <span className="text-[11px] text-text-muted block">
                      {keepVideoAudio ? 'Unmuted (Include original sound)' : 'Muted (Strip sound for silent video)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setKeepVideoAudio(!keepVideoAudio)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      keepVideoAudio
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                    }`}
                  >
                    {keepVideoAudio ? '🔊 Sound On' : '🔇 Muted'}
                  </button>
                </div>
              )}

              {/* Or Optional URL Section */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Or Paste {mediaType === 'image' ? 'Image' : 'Video'} URL (Optional)
                </label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={mediaType === 'image' ? 'https://images.unsplash.com/...' : 'https://youtube.com/watch?...'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Caption / Tagline (Optional)</label>
                <input
                  type="text"
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  placeholder="e.g. Hackathon round 1 highlights"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              {uploadProgress && (
                <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono flex items-center gap-2 animate-pulse">
                  <Film className="w-4 h-4 shrink-0" />
                  <span>{uploadProgress}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => setIsMediaModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-brand-blue text-white shadow-glow-blue hover:bg-brand-glow transition-all disabled:opacity-50"
                >
                  {uploading ? 'Processing...' : 'Upload Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
