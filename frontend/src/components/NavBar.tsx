import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/')}>
          PoliceWatch
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" onClick={() => navigate('/')}>Map</Button>
          <Button color="inherit" onClick={() => navigate('/patterns')}>Patterns</Button>
          <Button variant="contained" color="primary" onClick={() => navigate('/record')}>
            Report
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
