import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import { PatternsData } from '../../store/incidentsApi';

const mockData: PatternsData = {
  total: 42,
  thisMonth: 8,
  byType: [
    { violationType: 'speeding', count: 20 },
    { violationType: 'running_red_light', count: 15 },
    { violationType: 'illegal_u_turn', count: 7 },
  ],
  hotSpots: [
    { address: 'Peachtree St, Atlanta', count: 5 },
    { address: 'MLK Dr, Atlanta', count: 3 },
  ],
};

vi.mock('../../store/incidentsApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store/incidentsApi')>();
  return { ...actual, useGetPatternsQuery: vi.fn() };
});

import { useGetPatternsQuery } from '../../store/incidentsApi';
import PatternsPage from '../PatternsPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <PatternsPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('PatternsPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner', () => {
    vi.mocked(useGetPatternsQuery).mockReturnValue({
      data: undefined, isLoading: true, isError: false,
    } as unknown as ReturnType<typeof useGetPatternsQuery>);

    renderPage();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useGetPatternsQuery).mockReturnValue({
      data: undefined, isLoading: false, isError: true,
    } as unknown as ReturnType<typeof useGetPatternsQuery>);

    renderPage();
    expect(screen.getByText(/Could not load pattern data/i)).toBeInTheDocument();
  });

  it('shows total and this-month counts', () => {
    vi.mocked(useGetPatternsQuery).mockReturnValue({
      data: mockData, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetPatternsQuery>);

    renderPage();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Total Confirmed')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
  });

  it('shows violation type breakdown', () => {
    vi.mocked(useGetPatternsQuery).mockReturnValue({
      data: mockData, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetPatternsQuery>);

    renderPage();
    expect(screen.getByText('By Violation Type')).toBeInTheDocument();
    expect(screen.getAllByText('Speeding').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Running Red Light').length).toBeGreaterThan(0);
  });

  it('shows hot spots when repeat locations exist', () => {
    vi.mocked(useGetPatternsQuery).mockReturnValue({
      data: mockData, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetPatternsQuery>);

    renderPage();
    expect(screen.getByText('Repeat Locations')).toBeInTheDocument();
    expect(screen.getByText('Peachtree St, Atlanta')).toBeInTheDocument();
    expect(screen.getByText('5 incidents')).toBeInTheDocument();
  });

  it('hides hot spots section when none exist', () => {
    vi.mocked(useGetPatternsQuery).mockReturnValue({
      data: { ...mockData, hotSpots: [] }, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetPatternsQuery>);

    renderPage();
    expect(screen.queryByText('Repeat Locations')).not.toBeInTheDocument();
  });
});
