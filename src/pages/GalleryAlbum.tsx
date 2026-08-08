import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Film, X } from 'lucide-react';
import { GalleryService } from '../services/galleryService';
import { GalleryMedia } from '../types';

export const GalleryAlbum: React.FC = () => {
  const { album: slug } = useParams<{ album: string }>();
  const navigate = useNavigate();
  const album = slug ? GalleryService.getAlbumBySlug(slug) : undefined;
  const media = album ? GalleryService.getMediaForAlbum(album.id) : [];

  const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null);

  const isVideoItem = (item: { media_type?: string; file_url: string }) => {
    if (item.media_type === 'video') return true;
    return (
      /\.(mp4|webm|mov|m4v|mkv)(\?.*)?$/i.test(item.file_url) ||
      item.file_url.startsWith('data:video') ||
      item.file_url.includes('youtube.com') ||
      item.file_url.includes('vimeo.com')
    );
  };

  if (!album) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold text-white">Album Not Found</h2>
        <button
          onClick={() => navigate('/gallery')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-blue text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-10">
      <div>
        <button
          onClick={() => navigate('/gallery')}
          className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Albums
        </button>
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-heading font-extrabold text-white">{album.title}</h1>
        <p className="text-text-secondary text-sm">{album.description}</p>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {media.map((item) => (
          <div
            key={item.id}
            className="break-inside-avoid rounded-2xl overflow-hidden border border-white/10 card-dark group relative"
          >
            {isVideoItem(item) ? (
              <div className="relative">
                <video
                  src={item.file_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-2xl object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur text-brand-cyan text-[11px] font-mono font-bold flex items-center gap-1.5 border border-white/10 pointer-events-none">
                  <Film className="w-3.5 h-3.5 text-brand-cyan" /> VIDEO
                </div>
              </div>
            ) : (
              <div onClick={() => setSelectedMedia(item)} className="cursor-pointer">
                <img
                  src={item.file_url}
                  alt={item.caption || 'Album Photo'}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            {item.caption && (
              <div className="p-3 text-xs text-text-secondary font-medium bg-[#0F1623]/90">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          {isVideoItem(selectedMedia) ? (
            <video
              src={selectedMedia.file_url}
              controls
              autoPlay
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
          ) : (
            <img
              src={selectedMedia.file_url}
              alt="Enlarged preview"
              className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
            />
          )}
        </div>
      )}
    </div>
  );
};
