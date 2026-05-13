import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import { Incident } from '../../store/incidentsApi';

const mockIncident: Incident = {
  id: 'abc123',
  latitude: 33.749,
  longitude: -84.388,
  address: 'Peachtree St & 5th Ave, Atlanta, GA',
  violationType: 'running_red_light',
  vehicleDesc: 'Police cruiser #47',
  incidentAt: '2026-05-12T20:00:00.000Z',
  videoUrl: 'https://pub-xxx.r2.dev/videos/test.webm',
  createdAt: '2026-05-12T20:01:00.000Z',
};

vi.mock('../../store/incidentsApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store/incidentsApi')>();
  return { ...actual, useGetIncidentQuery: vi.fn() };
});

vi.mock('../../components/IncidentReportMap', () => ({
  default: () => <div data-testid="incident-map" />,
}));

import { useGetIncidentQuery } from '../../store/incidentsApi';
import IncidentPage from '../IncidentPage';

function renderPage(id = 'abc123') {
  return render(
    <MemoryRouter initialEntries={[`/incident/${id}`]}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/incident/:id" element={<IncidentPage />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('IncidentPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner while fetching', () => {
    vi.mocked(useGetIncidentQuery).mockReturnValue({
      data: undefined, isLoading: true, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentQuery>);

    renderPage();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error when incident not found', () => {
    vi.mocked(useGetIncidentQuery).mockReturnValue({
      data: undefined, isLoading: false, isError: true,
    } as unknown as ReturnType<typeof useGetIncidentQuery>);

    renderPage();
    expect(screen.getByText(/Incident not found/i)).toBeInTheDocument();
  });

  it('renders incident details', () => {
    vi.mocked(useGetIncidentQuery).mockReturnValue({
      data: mockIncident, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentQuery>);

    renderPage();
    // Both screen and print layouts render — use getAllByText
    expect(screen.getAllByText('Running Red Light').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Peachtree St & 5th Ave, Atlanta, GA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Police cruiser #47').length).toBeGreaterThan(0);
  });

  it('renders the map', () => {
    vi.mocked(useGetIncidentQuery).mockReturnValue({
      data: mockIncident, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentQuery>);

    renderPage();
    expect(screen.getByTestId('incident-map')).toBeInTheDocument();
  });

  it('copies link to clipboard on share click', async () => {
    vi.mocked(useGetIncidentQuery).mockReturnValue({
      data: mockIncident, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentQuery>);

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, writable: true });

    renderPage();
    await userEvent.click(screen.getByText('Copy Link'));
    expect(writeText).toHaveBeenCalled();
  });
});
