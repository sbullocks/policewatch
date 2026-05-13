import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVideoRecorder } from '../useVideoRecorder';

function makeMockMediaRecorder() {
  return {
    start: vi.fn(),
    stop: vi.fn(function (this: MockRecorder) {
      this.onstop?.();
    }),
    ondataavailable: null as ((e: { data: { size: number } }) => void) | null,
    onstop: null as (() => void) | null,
    state: 'inactive',
  };
}

type MockRecorder = ReturnType<typeof makeMockMediaRecorder>;

describe('useVideoRecorder', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:mock'), revokeObjectURL: vi.fn() });
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useVideoRecorder());
    expect(result.current.state).toBe('idle');
    expect(result.current.videoBlob).toBeNull();
  });

  it('detects MediaRecorder support', () => {
    vi.stubGlobal('MediaRecorder', class {
      static isTypeSupported = () => false;
      start = vi.fn();
      stop = vi.fn();
      ondataavailable = null;
      onstop = null;
    });

    const { result } = renderHook(() => useVideoRecorder());
    expect(result.current.supportsMediaRecorder).toBe(true);
  });

  it('reports no MediaRecorder support when undefined', () => {
    vi.stubGlobal('MediaRecorder', undefined);
    const { result } = renderHook(() => useVideoRecorder());
    expect(result.current.supportsMediaRecorder).toBe(false);
  });

  it('sets stopped state and videoBlob after onFileSelect', () => {
    vi.stubGlobal('MediaRecorder', undefined);
    const { result } = renderHook(() => useVideoRecorder());
    const file = new File(['video'], 'test.mp4', { type: 'video/mp4' });

    act(() => { result.current.onFileSelect(file); });

    expect(result.current.state).toBe('stopped');
    expect(result.current.videoBlob).toBe(file);
    expect(result.current.videoUrl).toBe('blob:mock');
  });

  it('resets to idle state', () => {
    vi.stubGlobal('MediaRecorder', undefined);
    const { result } = renderHook(() => useVideoRecorder());
    const file = new File(['video'], 'test.mp4', { type: 'video/mp4' });

    act(() => { result.current.onFileSelect(file); });
    act(() => { result.current.reset(); });

    expect(result.current.state).toBe('idle');
    expect(result.current.videoBlob).toBeNull();
  });
});
