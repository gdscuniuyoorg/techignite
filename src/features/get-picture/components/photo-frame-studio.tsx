import { motion } from 'framer-motion';
import { Download, ImagePlus, Trash2, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import {
  compositePhoto,
  loadArtwork,
  loadNameFont,
  MAX_UPLOAD_BYTES,
  TEMPLATE_SIZE,
} from '@/lib/photo-frame';

type StudioStatus = 'idle' | 'working' | 'ready' | 'error';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function isAccepted(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type);
}

/**
 * Upload → preview → download for the "I Will Be Attending" photo frame.
 *
 * All image work happens in the browser: the artwork is fetched once, the
 * user's photo is composited into the artwork's yellow panel, the name is
 * drawn into the name bar, and the result is exported as a PNG. Nothing is
 * uploaded to a server.
 */
export function PhotoFrameStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoRef = useRef<ImageBitmap | null>(null);
  const [status, setStatus] = useState<StudioStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [name, setName] = useState('');

  const releaseDownload = useCallback((url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setMessage(null);
    setFileName(null);
    setName('');
    setDownloadUrl(null);
    photoRef.current?.close();
    photoRef.current = null;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  /**
   * Rebuilds the composite from the stored photo and the current name, then
   * publishes the result to the preview canvas and the download link.
   */
  const renderFrame = useCallback(async (photo: ImageBitmap, displayName: string) => {
    const artwork = await loadArtwork();
    await loadNameFont();
    const composite = compositePhoto(artwork, photo, displayName);

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      throw new Error('Canvas is unavailable');
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(composite, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      composite.toBlob(resolve, 'image/png');
    });
    if (!blob) {
      throw new Error('Could not export the image');
    }

    setDownloadUrl(URL.createObjectURL(blob));
  }, []);

  const renderPhoto = useCallback(
    async (file: File) => {
      setStatus('working');
      setMessage(null);
      setDownloadUrl(null);

      try {
        const photo = await createImageBitmap(file, { imageOrientation: 'from-image' });
        photoRef.current?.close();
        photoRef.current = photo;

        await renderFrame(photo, name);
        setFileName(file.name);
        setStatus('ready');
      } catch (error: unknown) {
        const reason = error instanceof Error ? error.message : 'Unknown error';
        setStatus('error');
        setMessage(`We could not process that photo. ${reason}`);
      }
    },
    [name, renderFrame],
  );

  const acceptFile = useCallback(
    (file: File) => {
      if (!isAccepted(file)) {
        setStatus('error');
        setMessage('Please upload a JPG, PNG or WebP image.');
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setStatus('error');
        setMessage('That photo is larger than 15 MB. Please pick a smaller one.');
        return;
      }
      void renderPhoto(file);
    },
    [renderPhoto],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files.item(0);
      if (file) acceptFile(file);
    },
    [acceptFile],
  );

  // Redraw the frame when the name changes, so the bar updates live.
  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      const photo = photoRef.current;
      if (!photo) return;

      setStatus('working');
      void renderFrame(photo, value)
        .then(() => {
          setStatus('ready');
        })
        .catch((error: unknown) => {
          const reason = error instanceof Error ? error.message : 'Unknown error';
          setStatus('error');
          setMessage(`We could not process that name. ${reason}`);
        });
    },
    [renderFrame],
  );

  // Show the bare frame artwork until a photo is uploaded.
  useEffect(() => {
    let cancelled = false;

    const drawArtwork = async () => {
      try {
        const artwork = await loadArtwork();
        if (cancelled) return;
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(artwork, 0, 0);
      } catch {
        // The preview stays empty; the upload path reports its own errors.
      }
    };

    void drawArtwork();
    return () => {
      cancelled = true;
    };
  }, []);

  // Revoke the previous download URL whenever it is replaced, and on unmount.
  useEffect(() => {
    return () => {
      releaseDownload(downloadUrl);
    };
  }, [downloadUrl, releaseDownload]);

  useEffect(() => {
    return () => {
      photoRef.current?.close();
      photoRef.current = null;
    };
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
      {/* Preview */}
      <div className="order-2 lg:order-1">
        <div className="overflow-hidden rounded-panel border border-line bg-ink-raised p-4 sm:p-6">
          <canvas
            ref={canvasRef}
            width={TEMPLATE_SIZE}
            height={TEMPLATE_SIZE}
            aria-label="Preview of your photo inside the Tech Ignite '26 frame"
            className="w-full rounded-xs bg-ink"
          />
        </div>
        <p className="mt-4 text-sm text-muted">
          {status === 'ready' && fileName
            ? `Showing “${fileName}” in the frame.`
            : 'Your framed photo appears here once you upload a picture.'}
        </p>
      </div>

      {/* Controls */}
      <div className="order-1 flex flex-col gap-6 lg:order-2">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => {
            setIsDragging(false);
          }}
          onDrop={onDrop}
          className={`flex flex-col items-center gap-4 rounded-panel border border-dashed px-6 py-10 text-center transition-colors ${
            isDragging ? 'border-brand-blue bg-brand-blue/10' : 'border-line bg-ink-raised'
          }`}
        >
          <span aria-hidden="true" className="text-brand-blue-soft">
            <ImagePlus className="size-10" strokeWidth={1.5} />
          </span>
          <p className="text-label text-paper">Drop your photo here</p>
          <p className="max-w-[34ch] text-sm text-muted">
            A clear, front-facing photo works best. It is resized and cropped to
            fit the frame automatically.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xs bg-primary px-6 text-button font-normal whitespace-nowrap text-primary-foreground shadow-none transition-colors hover:bg-brand-blue-strong"
          >
            <Upload aria-hidden="true" className="size-4" />
            Choose a photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.item(0);
              if (file) acceptFile(file);
              event.target.value = '';
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="photo-frame-name" className="text-label text-paper">
            Your name
          </label>
          <input
            id="photo-frame-name"
            type="text"
            value={name}
            onChange={(event) => {
              handleNameChange(event.target.value);
            }}
            placeholder="e.g. Ada Lovelace"
            autoComplete="name"
            maxLength={60}
            className="h-11 w-full rounded-xs border border-line bg-ink-raised px-4 text-label text-paper outline-none placeholder:text-muted focus-visible:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue/40"
          />
          <p className="text-sm text-muted">
            Printed in the bar beside your photo. Leave it empty to leave the
            bar blank.
          </p>
        </div>

        <div aria-live="polite" className="min-h-[1.5rem]">
          {status === 'working' ? (
            <p className="text-sm text-muted">Building your frame…</p>
          ) : null}
          {status === 'error' && message ? (
            <p className="text-sm text-brand-red">{message}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={downloadUrl ?? '#'}
            download="techignite-26-my-picture.png"
            aria-disabled={downloadUrl === null}
            onClick={(event) => {
              if (!downloadUrl) event.preventDefault();
            }}
            className={`flex h-11 items-center gap-2 rounded-xs px-6 text-button font-normal whitespace-nowrap shadow-none transition-colors ${
              downloadUrl
                ? 'bg-primary text-primary-foreground hover:bg-brand-blue-strong'
                : 'pointer-events-none bg-ink-soft text-muted'
            }`}
          >
            <Download aria-hidden="true" className="size-4" />
            Download my picture
          </a>
          <button
            type="button"
            onClick={() => {
              reset();
              const input = fileInputRef.current;
              if (input) input.value = '';
            }}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xs border border-line px-6 text-button font-normal whitespace-nowrap text-paper shadow-none transition-colors hover:bg-ink-soft"
          >
            <Trash2 aria-hidden="true" className="size-4" />
            Start over
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm leading-relaxed text-muted"
        >
          Everything happens on your device — your photo never leaves your
          browser.
        </motion.p>
      </div>
    </div>
  );
}
