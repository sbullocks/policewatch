import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import { PendingIncident } from '../../store/adminApi';

const mockIncidents: PendingIncident[] = [
  {
    id: '1', videoUrl: 'blob:mock', latitude: 33.749, longitude: -84.388,
    address: 'Peachtree St, Atlanta', violationType: 'speeding',
    incidentAt: new Date().toISOString(), createdAt: new Date().toISOString(),
    aiConfidence: 'uncertain', aiReasoning: 'Vehicle movement visible but speed unclear.',
  },
];

vi.mock('../../store/adminApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store/adminApi')>();
  return {
    ...actual,
    useGetPendingQuery: vi.fn(),
    useApproveIncidentMutation: vi.fn(),
    useRejectIncidentMutation: vi.fn(),
  };
});

import {
  useGetPendingQuery, useApproveIncidentMutation, useRejectIncidentMutation,
} from '../../store/adminApi';
import AdminPage from '../AdminPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <AdminPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetPendingQuery).mockReturnValue({
      data: undefined, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetPendingQuery>);
    vi.mocked(useApproveIncidentMutation).mockReturnValue([vi.fn(), {} as never]);
    vi.mocked(useRejectIncidentMutation).mockReturnValue([vi.fn(), {} as never]);
  });

  it('shows password gate before login', () => {
    renderPage();
    expect(screen.getByLabelText(/Admin Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('submits password and shows loading state', async () => {
    vi.mocked(useGetPendingQuery).mockReturnValue({
      data: undefined, isLoading: true, isError: false,
    } as unknown as ReturnType<typeof useGetPendingQuery>);

    renderPage();
    await userEvent.type(screen.getByLabelText(/Admin Password/i), 'policewatch-dev');
    await userEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  });

  it('shows incident cards after successful login', async () => {
    vi.mocked(useGetPendingQuery).mockReturnValue({
      data: mockIncidents, isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetPendingQuery>);

    renderPage();
    await userEvent.type(screen.getByLabelText(/Admin Password/i), 'policewatch-dev');
    await userEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('Peachtree St, Atlanta')).toBeInTheDocument();
      expect(screen.getByText('Vehicle movement visible but speed unclear.')).toBeInTheDocument();
    });
  });

  it('shows empty state when no pending incidents', async () => {
    vi.mocked(useGetPendingQuery).mockReturnValue({
      data: [], isLoading: false, isError: false,
    } as unknown as ReturnType<typeof useGetPendingQuery>);

    renderPage();
    await userEvent.type(screen.getByLabelText(/Admin Password/i), 'policewatch-dev');
    await userEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/No incidents pending review/i)).toBeInTheDocument();
    });
  });

  it('shows unauthorized error with wrong password', async () => {
    vi.mocked(useGetPendingQuery).mockReturnValue({
      data: undefined, isLoading: false, isError: true,
      error: { status: 401 },
    } as unknown as ReturnType<typeof useGetPendingQuery>);

    renderPage();
    await userEvent.type(screen.getByLabelText(/Admin Password/i), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Incorrect password/i)).toBeInTheDocument();
    });
  });
});
