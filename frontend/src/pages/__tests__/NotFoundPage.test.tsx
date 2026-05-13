import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import NotFoundPage from '../NotFoundPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <NotFoundPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('NotFoundPage', () => {
  it('renders 404', () => {
    renderPage();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('shows navigation buttons', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /View Map/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Report/i })).toBeInTheDocument();
  });
});
