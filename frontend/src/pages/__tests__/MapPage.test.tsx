import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import { Incident } from '../../store/incidentsApi';

const mockIncidents: Incident[] = [
  {
    id: '1', latitude: 33.749, longitude: -84.388,
    address: 'Peachtree St, Atlanta', violationType: 'running_red_light',
    incidentAt: new Date().toISOString(), videoUrl: 'blob:mock', createdAt: new Date().toISOString(),
  },
  {
    id: '2', latitude: 34.0, longitude: -84.0,
    address: 'Main St, Marietta', violationType: 'speeding',
    incidentAt: new Date().toISOString(), videoUrl: 'blob:mock2', createdAt: new Date().toISOString(),
  },
];

vi.mock('../../store/incidentsApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store/incidentsApi')>();
  return { ...actual, useGetIncidentsQuery: vi.fn() };
});

vi.mock('../../components/IncidentMap', () => ({
  default: ({ incidents, onSelect }: { incidents: Incident[]; onSelect: (i: Incident) => void }) => (
    <div data-testid="incident-map">
      {incidents.map((i) => (
        <button key={i.id} data-testid={`marker-${i.id}`} onClick={() => onSelect(i)}>
          {i.violationType}
        </button>
      ))}
    </div>
  ),
}));

import { useGetIncidentsQuery } from '../../store/incidentsApi';
import MapPage from '../MapPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <MapPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('MapPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the map with incidents', () => {
    vi.mocked(useGetIncidentsQuery).mockReturnValue({
      data: mockIncidents, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentsQuery>);

    renderPage();
    expect(screen.getByTestId('incident-map')).toBeInTheDocument();
    expect(screen.getByText('running_red_light')).toBeInTheDocument();
    expect(screen.getByText('speeding')).toBeInTheDocument();
  });

  it('shows loading spinner', () => {
    vi.mocked(useGetIncidentsQuery).mockReturnValue({
      data: undefined, isLoading: true, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentsQuery>);

    renderPage();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows empty state when no incidents', () => {
    vi.mocked(useGetIncidentsQuery).mockReturnValue({
      data: [], isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentsQuery>);

    renderPage();
    expect(screen.getByText(/No incidents reported yet/i)).toBeInTheDocument();
  });

  it('shows error alert when fetch fails', () => {
    vi.mocked(useGetIncidentsQuery).mockReturnValue({
      data: undefined, isLoading: false, isError: true,
    } as unknown as ReturnType<typeof useGetIncidentsQuery>);

    renderPage();
    expect(screen.getByText(/Could not load incidents/i)).toBeInTheDocument();
  });

  it('filters incidents when violation type chip is toggled', async () => {
    vi.mocked(useGetIncidentsQuery).mockReturnValue({
      data: mockIncidents, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentsQuery>);

    renderPage();
    await userEvent.click(screen.getByText(/Running Red Light/i));
    expect(screen.queryByText('speeding')).not.toBeInTheDocument();
    expect(screen.getByText('running_red_light')).toBeInTheDocument();
  });

  it('opens drawer when a marker is clicked', async () => {
    vi.mocked(useGetIncidentsQuery).mockReturnValue({
      data: mockIncidents, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentsQuery>);

    renderPage();
    await userEvent.click(screen.getByTestId('marker-1'));
    expect(screen.getByText('Peachtree St, Atlanta')).toBeInTheDocument();
  });

  it('renders date range filter chips', () => {
    vi.mocked(useGetIncidentsQuery).mockReturnValue({
      data: mockIncidents, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentsQuery>);

    renderPage();
    expect(screen.getByText('All time')).toBeInTheDocument();
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('30 days')).toBeInTheDocument();
    expect(screen.getByText('90 days')).toBeInTheDocument();
  });

  it('activates date range chip on click', async () => {
    vi.mocked(useGetIncidentsQuery).mockReturnValue({
      data: mockIncidents, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetIncidentsQuery>);

    renderPage();
    const chip = screen.getByText('30 days');
    await userEvent.click(chip);
    expect(useGetIncidentsQuery).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}/));
  });
});
