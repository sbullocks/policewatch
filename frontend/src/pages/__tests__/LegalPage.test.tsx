import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import LegalPage from '../LegalPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <LegalPage />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('LegalPage', () => {
  it('renders the page title', () => {
    renderPage();
    expect(screen.getByText(/Legal & Privacy/i)).toBeInTheDocument();
  });

  it('shows the not-legal-advice warning', () => {
    renderPage();
    expect(screen.getByText(/Not legal advice/i)).toBeInTheDocument();
  });

  it('shows recording consent section', () => {
    renderPage();
    expect(screen.getByText(/Recording Consent/i)).toBeInTheDocument();
  });

  it('shows privacy policy section', () => {
    renderPage();
    expect(screen.getAllByText(/Privacy Policy/i).length).toBeGreaterThan(0);
  });

  it('shows terms of use section', () => {
    renderPage();
    expect(screen.getByText(/Terms of Use/i)).toBeInTheDocument();
  });
});
