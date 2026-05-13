import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  lat: number;
  lng: number;
  color: string;
}

export default function IncidentReportMap({ lat, lng, color }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[lat, lng]}
        radius={12}
        pathOptions={{ fillColor: color, fillOpacity: 1, color: '#fff', weight: 3 }}
      />
    </MapContainer>
  );
}
