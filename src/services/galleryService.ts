import { GalleryAlbum, GalleryMedia } from '../types';
import { StorageService } from './storageService';

export class GalleryService {
  static getAlbums(): GalleryAlbum[] {
    const albums = StorageService.getAlbums();
    return albums.sort((a, b) => a.display_order - b.display_order);
  }

  static getPublicAlbums(): GalleryAlbum[] {
    return this.getAlbums().filter(a => a.published);
  }

  static getAlbumBySlug(slug: string): GalleryAlbum | undefined {
    return this.getAlbums().find(a => a.slug === slug);
  }

  static getAlbumForEvent(eventId: string, eventSlug?: string): GalleryAlbum | undefined {
    const albums = this.getAlbums();
    return (
      albums.find(a => a.event_id === eventId) ||
      albums.find(a => a.slug === eventSlug) ||
      (eventSlug ? albums.find(a => a.title.toLowerCase().includes(eventSlug.replace(/-/g, ' ').toLowerCase())) : undefined)
    );
  }

  static getMediaForAlbum(albumId: string): GalleryMedia[] {
    const media = StorageService.getGalleryMedia();
    return media
      .filter(m => m.album_id === albumId)
      .map(m => ({
        ...m,
        caption: m.caption ? m.caption.replace(/\s*\(File \d+\)/gi, '') : m.caption,
      }))
      .sort((a, b) => a.display_order - b.display_order);
  }

  static getAllPublicMedia(): GalleryMedia[] {
    const publicAlbums = this.getPublicAlbums().map(a => a.id);
    const media = StorageService.getGalleryMedia();
    return media
      .filter(m => publicAlbums.includes(m.album_id))
      .map(m => ({
        ...m,
        caption: m.caption ? m.caption.replace(/\s*\(File \d+\)/gi, '') : m.caption,
      }));
  }

  static saveAlbum(albumData: Partial<GalleryAlbum>): GalleryAlbum {
    const albums = StorageService.getAlbums();
    let updatedAlbum: GalleryAlbum;

    if (albumData.id) {
      const index = albums.findIndex(a => a.id === albumData.id);
      if (index !== -1) {
        updatedAlbum = { ...albums[index], ...albumData };
        albums[index] = updatedAlbum;
        StorageService.addLog('Gallery Album Updated', `Updated album "${updatedAlbum.title}"`);
      } else {
        throw new Error('Album not found');
      }
    } else {
      updatedAlbum = {
        id: 'alb-' + Date.now(),
        title: albumData.title || 'Untitled Album',
        slug: albumData.slug || `album-${Date.now()}`,
        cover_image: albumData.cover_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
        description: albumData.description || '',
        event_id: albumData.event_id,
        display_order: albumData.display_order ?? (albums.length + 1),
        published: albumData.published ?? true,
        created_at: new Date().toISOString(),
        media_count: 0,
      };
      albums.unshift(updatedAlbum);
      StorageService.addLog('Gallery Album Created', `Created album "${updatedAlbum.title}"`);
    }

    StorageService.saveAlbums(albums);
    return updatedAlbum;
  }

  static deleteAlbum(id: string): void {
    let albums = StorageService.getAlbums();
    albums = albums.filter(a => a.id !== id);
    StorageService.saveAlbums(albums);

    // Also delete media for this album
    let media = StorageService.getGalleryMedia();
    media = media.filter(m => m.album_id !== id);
    StorageService.saveGalleryMedia(media);
    StorageService.addLog('Gallery Album Deleted', `Deleted album ID ${id}`);
  }

  static saveMediaBatch(albumId: string, mediaType: 'image' | 'video', items: { file_url: string; caption?: string }[]): GalleryMedia[] {
    const mediaList = StorageService.getGalleryMedia();
    const existingAlbumMedia = mediaList.filter(m => m.album_id === albumId);
    const startOrder = existingAlbumMedia.length + 1;

    const newItems: GalleryMedia[] = items.map((item, idx) => ({
      id: `gm-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      album_id: albumId,
      media_type: mediaType,
      file_url: item.file_url,
      caption: item.caption || '',
      display_order: startOrder + idx,
      created_at: new Date().toISOString(),
    }));

    const updatedMediaList = [...newItems, ...mediaList];
    StorageService.saveGalleryMedia(updatedMediaList);

    // Update album count
    const albums = StorageService.getAlbums();
    const album = albums.find(a => a.id === albumId);
    if (album) {
      album.media_count = updatedMediaList.filter(m => m.album_id === album.id).length;
      StorageService.saveAlbums(albums);
    }

    return newItems;
  }

  static saveMediaItem(mediaData: Partial<GalleryMedia>): GalleryMedia {
    const mediaList = StorageService.getGalleryMedia();
    let updatedMedia: GalleryMedia;

    if (mediaData.id) {
      const index = mediaList.findIndex(m => m.id === mediaData.id);
      if (index !== -1) {
        updatedMedia = { ...mediaList[index], ...mediaData };
        mediaList[index] = updatedMedia;
      } else {
        throw new Error('Media item not found');
      }
    } else {
      updatedMedia = {
        id: 'gm-' + Date.now(),
        album_id: mediaData.album_id || '',
        media_type: mediaData.media_type || 'image',
        file_url: mediaData.file_url || '',
        caption: mediaData.caption || '',
        display_order: mediaData.display_order ?? (mediaList.length + 1),
        created_at: new Date().toISOString(),
      };
      mediaList.unshift(updatedMedia);
    }

    StorageService.saveGalleryMedia(mediaList);

    // Update album count
    const albums = StorageService.getAlbums();
    const album = albums.find(a => a.id === updatedMedia.album_id);
    if (album) {
      album.media_count = mediaList.filter(m => m.album_id === album.id).length;
      StorageService.saveAlbums(albums);
    }

    return updatedMedia;
  }

  static deleteMediaItem(id: string): void {
    let mediaList = StorageService.getGalleryMedia();
    const item = mediaList.find(m => m.id === id);
    mediaList = mediaList.filter(m => m.id !== id);
    StorageService.saveGalleryMedia(mediaList);

    if (item) {
      const albums = StorageService.getAlbums();
      const album = albums.find(a => a.id === item.album_id);
      if (album) {
        album.media_count = mediaList.filter(m => m.album_id === album.id).length;
        StorageService.saveAlbums(albums);
      }
    }
  }
}
