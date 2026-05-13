import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { configureStore } from '@reduxjs/toolkit';
import RecordPage from '../RecordPage';
import { incidentsApi } from '../../store/incidentsApi';
import { theme } from '../../theme';

vi.mock('../../hooks/useVideoRecorder', () => ({
  useVideoRecorder: () => ({
    state: 'stopped',
    videoBlob: new Blob(['video'], { type: 'video/webm' }),
    videoUrl: 'blob:mock',
    secondsLeft: 60,
    error: null,
    supportsMediaRecorder: true,
    start: vi.fn(),
    stop: vi.fn(),
    reset: vi.fn(),
    onFileSelect: vi.fn(),
  }),
}));

vi.mock('../../hooks/useGeolocation', () => ({
  useGeolocation: () => ({
    location: { latitude: 33.749, longitude: -84.388, address: 'Peachtree St, Atlanta', speed: 12.5 },
    loading: false,
    error: null,
    capture: vi.fn().mockResolvedValue(null),
  }),
}));

function makeStore() {
  return configureStore({
    reducer: { [incidentsApi.reducerPath]: incidentsApi.reducer },
    middleware: (g) => g().concat(incidentsApi.middleware),
  });
}

function renderPage() {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <RecordPage />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
}

describe('RecordPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the form when video is ready', () => {
    renderPage();
    expect(screen.getByText('Report an Incident')).toBeInTheDocument();
    expect(screen.getByText('Submit Report')).toBeInTheDocument();
  });

  it('shows violation type select', () => {
    renderPage();
    expect(screen.getByLabelText(/Violation Type/i)).toBeInTheDocument();
  });

  it('pre-fills location field when location is available', () => {
    renderPage();
    expect(screen.getByDisplayValue('Peachtree St, Atlanta')).toBeInTheDocument();
  });

  it('shows re-record button when video is captured', () => {
    renderPage();
    expect(screen.getByText('Use Different Footage')).toBeInTheDocument();
  });
});
