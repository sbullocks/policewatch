import { Component, ReactNode } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            An unexpected error occurred. Reload the page to continue.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Reload
            </Button>
            <Button variant="outlined" onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}>
              Go to Map
            </Button>
          </Box>
        </Container>
      );
    }
    return this.props.children;
  }
}
