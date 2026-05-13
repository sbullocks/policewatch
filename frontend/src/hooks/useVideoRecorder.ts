import { useState, useRef, useCallback, useEffect } from 'react';

export type RecordState = 'idle' | 'requesting' | 'recording' | 'stopped';

export interface UseVideoRecorderReturn {
  state: RecordState;
  videoBlob: Blob | null;
  videoUrl: string | null;
  secondsLeft: number;
  error: string | null;
  supportsMediaRecorder: boolean;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
  onFileSelect: (file: File) => void;
}

const MAX_SECONDS = 60;

function getSupportedMimeType(): string {
  const types = ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
}

export function useVideoRecorder(): UseVideoRecorderReturn {
  const [state, setState] = useState<RecordState>('idle');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(MAX_SECONDS);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const supportsMediaRecorder =
    typeof MediaRecorder !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia;

  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
  };

  const stop = useCallback(() => {
    clearTimers();
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setState('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoBlob(blob);
        setVideoUrl(url);
        setState('stopped');
      };

      recorder.start(250);
      setState('recording');
      setSecondsLeft(MAX_SECONDS);

      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return s - 1;
        });
      }, 1000);

      autoStopRef.current = setTimeout(() => stop(), MAX_SECONDS * 1000);
    } catch (err) {
      setState('idle');
      setError(err instanceof Error ? err.message : 'Camera access denied.');
    }
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoBlob(null);
    setVideoUrl(null);
    setSecondsLeft(MAX_SECONDS);
    setError(null);
    setState('idle');
  }, [stop, videoUrl]);

  const onFileSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setVideoBlob(file);
    setVideoUrl(url);
    setState('stopped');
  }, []);

  useEffect(() => () => { clearTimers(); stop(); }, [stop]);

  return { state, videoBlob, videoUrl, secondsLeft, error, supportsMediaRecorder, start, stop, reset, onFileSelect };
}
