import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import AboutPage from '../AboutPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <AboutPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('AboutPage', () => {
  it('renders the mission headline', () => {
    renderPage();
    expect(screen.getByText(/community accountability/i)).toBeInTheDocument();
  });

  it('shows all three how-it-works steps', () => {
    renderPage();
    expect(screen.getByText(/Record or Upload/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Validates/i)).toBeInTheDocument();
    expect(screen.getByText(/Appears on the Map/i)).toBeInTheDocument();
  });

  it('shows privacy section', () => {
    renderPage();
    expect(screen.getByText(/Your privacy/i)).toBeInTheDocument();
  });

  it('shows submit report button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Submit a Report/i })).toBeInTheDocument();
  });
});
