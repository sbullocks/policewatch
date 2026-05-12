import { Routes, Route } from 'react-router-dom';
import MapPage from './pages/MapPage';
import RecordPage from './pages/RecordPage';
import IncidentPage from './pages/IncidentPage';
import AdminPage from './pages/AdminPage';
import NavBar from './components/NavBar';

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/incident/:id" element={<IncidentPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}
