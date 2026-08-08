import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xhhpxwsozvhvkgzxoazb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaHB4d3NvenZodmtnenhvYXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjQxNzIsImV4cCI6MjEwMTYwMDE3Mn0.-XOpu0zMcIpGboVtxVCniGjPFkCMbY7q8MjBkbPGpZk';

const isRealUrl =
  Boolean(supabaseUrl) &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('example');

const isRealKey =
  Boolean(supabaseAnonKey) &&
  !supabaseAnonKey.includes('your-supabase-anon-key');

export const isSupabaseConfigured = isRealUrl && isRealKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads a file (or base64 Data URL) to Supabase Storage bucket 'coderush-media'.
 * Returns the public URL if successful, or null if unconfigured/failed.
 */
export async function uploadToSupabaseStorage(
  fileOrDataUrl: File | Blob | string,
  folder: string = 'gallery'
): Promise<string | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    let fileToUpload: File;
    let fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (typeof fileOrDataUrl === 'string') {
      if (!fileOrDataUrl.startsWith('data:')) return fileOrDataUrl; // Already an http URL

      const arr = fileOrDataUrl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const ext = mime.split('/')[1] || 'jpg';
      fileToUpload = new File([u8arr], `upload.${ext}`, { type: mime });
      fileName += `.${ext}`;
    } else if (fileOrDataUrl instanceof File) {
      fileToUpload = fileOrDataUrl;
      const ext = fileOrDataUrl.name.split('.').pop() || 'webm';
      fileName += `.${ext}`;
    } else {
      const ext = fileOrDataUrl.type.split('/')[1] || 'webm';
      fileToUpload = new File([fileOrDataUrl], `video.${ext}`, { type: fileOrDataUrl.type });
      fileName += `.${ext}`;
    }

    // Race upload with a 6-second timeout so offline/invalid networks don't hang batch uploads
    const uploadPromise = supabase.storage
      .from('coderush-media')
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: true,
      });

    const timeoutPromise = new Promise<{ data: null; error: { message: string } }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: { message: 'Storage timeout' } }), 6000)
    );

    const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

    if (error || !data) {
      console.warn('Supabase storage fallback to local storage:', error?.message || 'Timeout');
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('coderush-media')
      .getPublicUrl(data.path);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Supabase upload exception:', err);
    return null;
  }
}
