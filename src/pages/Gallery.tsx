import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Sparkles, Folder, Calendar, Film } from 'lucide-react';
import { GalleryService } from '../services/galleryService';
import { GalleryMedia } from '../types';

export const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const albums = GalleryService.getPublicAlbums();
  const allMedia = GalleryService.getAllPublicMedia();
  const [activeTab, setActiveTab] = useState<'albums' | 'all'>('albums');

  const isVideoItem = (item: GalleryMedia) => {
    if (item.media_type === 'video') return true;
    return (
      /\.(mp4|webm|mov|m4v|mkv)(\?.*)?$/i.test(item.file_url) ||
      item.file_url.startsWith('data:video') ||
      item.file_url.includes('youtube.com') ||
      item.file_url.includes('vimeo.com')
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-cyan">
          <ImageIcon className="w-3.5 h-3.5" />
          COMMUNITY MEDIA ARCHIVE
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-white">
          Event Highlights & Photos
        </h1>
        <p className="text-text-secondary text-sm">
          Relive memories from CodeRush hackathons, bootcamps, workshops, and student awards ceremonies.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab('albums')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'albums'
              ? 'bg-brand-blue text-white shadow-glow-blue'
              : 'bg-white/5 text-text-secondary hover:text-white'
          }`}
        >
          <Folder className="w-4 h-4" />
          Event Albums ({albums.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-brand-blue text-white shadow-glow-blue'
              : 'bg-white/5 text-text-secondary hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          All Media ({allMedia.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'albums' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => navigate(`/gallery/${album.slug}`)}
              className="cursor-pointer card-dark rounded-3xl overflow-hidden group border border-white/5 hover:border-brand-blue/40 transition-all"
            >
              <div className="aspect-[16/10] relative overflow-hidden bg-black/40">
                <img
                  src={album.cover_image}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-brand-blue/80 backdrop-blur text-white border border-brand-blue/30 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {album.event_date ? new Date(album.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Event Archive'}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur text-white border border-white/10">
                  {album.media_count || 0} Media Files
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-heading font-bold text-lg text-white group-hover:text-brand-cyan transition-colors">
                  {album.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2">{album.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Masonry Media Grid */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {allMedia.map((media) => (
            <div key={media.id} className="break-inside-avoid rounded-2xl overflow-hidden border border-white/10 card-dark group">
              {isVideoItem(media) ? (
                <div className="relative">
                  <video
                    src={media.file_url}
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
                <img
                  src={media.file_url}
                  alt={media.caption || 'CodeRush photo'}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              {media.caption && (
                <div className="p-3 text-xs text-text-secondary font-medium bg-[#0F1623]/90">
                  {media.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
