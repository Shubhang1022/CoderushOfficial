/**
 * Compresses a video file by downscaling resolution (e.g. 720p) and re-encoding
 * via HTML5 Canvas + MediaRecorder API. Reduces raw 50MB+ camera videos by 70%-90%.
 * Supports optional mute/unmute audio option during compression.
 */
export async function compressVideoFile(
  file: File,
  maxDimension = 720,
  targetBitrate = 1200000, // 1.2 Mbps for lightweight 70%+ reduction
  onProgress?: (progressPercent: number) => void,
  keepAudio = true
): Promise<File | Blob> {
  if (!file.type.startsWith('video/')) {
    return file;
  }

  // Check MediaRecorder & canvas captureStream support
  const canCompress =
    typeof window !== 'undefined' &&
    'MediaRecorder' in window &&
    typeof HTMLCanvasElement.prototype.captureStream === 'function';

  if (!canCompress) {
    console.warn('Browser does not support MediaRecorder canvas encoding. Returning original video.');
    return file;
  }

  return new Promise<File | Blob>((resolve) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.muted = !keepAudio;
    video.playsInline = true;
    video.preload = 'auto';

    video.onloadedmetadata = () => {
      let width = video.videoWidth || 1280;
      let height = video.videoHeight || 720;

      // Scale resolution down to max 720p proportionally
      if (width > maxDimension || height > maxDimension) {
        if (width >= height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      // Force even numbers for encoder compatibility
      width = width % 2 === 0 ? width : width - 1;
      height = height % 2 === 0 ? height : height - 1;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        return resolve(file);
      }

      const canvasStream = canvas.captureStream(25); // 25 fps
      let stream = canvasStream;

      if (keepAudio && 'captureStream' in video) {
        try {
          const origStream = (video as any).captureStream(25);
          const audioTrack = origStream ? origStream.getAudioTracks()[0] : null;
          if (audioTrack) {
            canvasStream.addTrack(audioTrack);
          }
        } catch (e) {
          console.warn('Could not extract audio track during video compression:', e);
        }
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: targetBitrate,
        });
      } catch (err) {
        console.warn('Failed to initialize MediaRecorder:', err);
        URL.revokeObjectURL(objectUrl);
        return resolve(file);
      }

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        URL.revokeObjectURL(objectUrl);
        const compressedBlob = new Blob(chunks, { type: mimeType });

        // Verify if compression yielded smaller size
        if (compressedBlob.size > 0 && compressedBlob.size < file.size) {
          const compressedFile = new File(
            [compressedBlob],
            file.name.replace(/\.[^/.]+$/, '') + '-compressed.webm',
            { type: mimeType }
          );
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      };

      let animationFrameId: number;
      const renderFrame = () => {
        if (video.paused || video.ended) return;

        ctx.drawImage(video, 0, 0, width, height);

        if (onProgress && video.duration) {
          const percent = Math.min(99, Math.round((video.currentTime / video.duration) * 100));
          onProgress(percent);
        }

        animationFrameId = requestAnimationFrame(renderFrame);
      };

      video.onplay = () => {
        mediaRecorder.start(100);
        renderFrame();
      };

      video.onended = () => {
        cancelAnimationFrame(animationFrameId);
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      };

      video.onerror = () => {
        cancelAnimationFrame(animationFrameId);
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      // Play video to trigger canvas encoding
      video.play().catch(() => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
  });
}
