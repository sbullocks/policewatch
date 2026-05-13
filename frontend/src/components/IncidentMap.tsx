import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Incident } from '../store/incidentsApi';
import { VIOLATION_COLORS } from './ViolationFilterBar';

interface Props {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
}

function AutoFit({ incidents }: { incidents: Incident[] }) {
  const map = useMap();
  useEffect(() => {
    if (incidents.length === 0) return;
    const bounds = incidents.map((i) => [i.latitude, i.longitude] as [number, number]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }, [incidents, map]);
  return null;
}

export default function IncidentMap({ incidents, onSelect }: Props) {
  return (
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AutoFit incidents={incidents} />
      {incidents.map((incident) => (
        <CircleMarker
          key={incident.id}
          center={[incident.latitude, incident.longitude]}
          radius={8}
          pathOptions={{
            fillColor: VIOLATION_COLORS[incident.violationType] ?? '#888',
            fillOpacity: 0.9,
            color: '#fff',
            weight: 2,
          }}
          eventHandlers={{ click: () => onSelect(incident) }}
        />
      ))}
    </MapContainer>
  );
}
