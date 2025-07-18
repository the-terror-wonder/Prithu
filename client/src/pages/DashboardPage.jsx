import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import MapEvents from '../components/MapEvents';

const bhilaiPosition = [21.21, 81.38];

const DashboardPage = () => {
  // 1. STATE DECLARATIONS
  const [markers, setMarkers] = useState([]);
  const [routePath, setRoutePath] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 2. HELPER FUNCTIONS (MOVED INSIDE)
  const addMarker = (pos, type = 'current') => {
    const newMarker = { pos: [pos[0], pos[1]], type };
    // This now works because setMarkers is in the same scope
    setMarkers(prev => [...prev, newMarker]);
  };

  // 3. EVENT HANDLERS
  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    try {
      const response = await api.post('/optimize/nearest', { lat, lng });
      if (response.data.code === 'Ok' && response.data.waypoints.length > 0) {
        const snappedLocation = response.data.waypoints[0].location;
        const [snappedLng, snappedLat] = snappedLocation;
        addMarker([snappedLat, snappedLng]);
      } else {
        addMarker([lat, lng]);
      }
    } catch (error) {
      console.error("Failed to snap to road:", error);
      addMarker([lat, lng]);
    }
  };

  const handleOptimize = async () => {
    if (markers.length < 2) return alert("Add at least 2 stops.");
    setIsLoading(true);
    try {
      // FIX: Extract just the coordinates from the marker objects
      const coordinates = markers.map(marker => marker.pos);
      const res = await api.post('/optimize', { coordinates: coordinates });

      const geojsonGeometry = res.data.routeGeometry;
      const leafletPath = geojsonGeometry.coordinates.map(p => [p[1], p[0]]);
      setRoutePath(leafletPath);
    } catch (error) {
      alert("Could not optimize route. Your session might have expired.");
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setMarkers([]);
    setRoutePath([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 4. JSX TO RENDER
  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white shadow-xl z-[1000] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Prithu</h2>
          <button onClick={handleLogout} className="text-sm bg-red-500 text-white py-1 px-3 rounded">Logout</button>
        </div>
        <div className="flex flex-col space-y-3">
          <button onClick={handleOptimize} disabled={isLoading || markers.length < 2} className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">
            {isLoading ? 'Optimizing...' : 'Optimize Route'}
          </button>
          <button onClick={handleReset} className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
            Reset
          </button>
        </div>
        <div className="mt-6 flex-grow overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800">Stops ({markers.length})</h3>
          <ol className="list-decimal list-inside mt-2 space-y-2">
            {/* FIX: Use marker.pos to get coordinates */}
            {markers.map((marker, idx) => (
              <li key={idx} className="bg-gray-50 p-2 rounded-md border border-gray-200 text-sm">
                <span className="font-medium">{`Stop ${idx + 1}:`}</span>{` (${marker.pos[0].toFixed(3)}, ${marker.pos[1].toFixed(3)})`}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="flex-grow">
        <MapContainer center={bhilaiPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
          <MapEvents onMapClick={handleMapClick} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
          {/* FIX: Use marker.pos to set the Marker position */}
          {markers.map((marker, i) => <Marker key={i} position={marker.pos} />)}
          {routePath.length > 0 && <Polyline pathOptions={{ color: '#1D4ED8', weight: 5, opacity: 0.8 }} positions={routePath} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default DashboardPage;