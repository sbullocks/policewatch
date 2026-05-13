import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import MapPage from './pages/MapPage';
import RecordPage from './pages/RecordPage';
import IncidentPage from './pages/IncidentPage';
import AdminPage from './pages/AdminPage';
import PatternsPage from './pages/PatternsPage';
import AboutPage from './pages/AboutPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar />
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/record" element={<RecordPage />} />
            <Route path="/incident/:id" element={<IncidentPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/patterns" element={<PatternsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ErrorBoundary>
  );
}
