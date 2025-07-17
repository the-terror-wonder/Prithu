import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import axios from 'axios';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import MapEvents from '../components/MapEvents'; // Make sure you have this component from the previous step

const bhilaiPosition = [21.21, 81.38];

const DashboardPage = () => {
  const [markers, setMarkers] = useState([]);
  const [routePath, setRoutePath] = useState([]); // Renamed from optimizedPath
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // (NEW) This function now snaps clicks to the nearest road
  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    try {
      // OSRM nearest service URL
      const url = `http://router.project-osrm.org/nearest/v1/driving/${lng},${lat}`;
      const response = await axios.get(url);
      
      if (response.data.code === 'Ok' && response.data.waypoints.length > 0) {
        const snappedLocation = response.data.waypoints[0].location;
        const [snappedLng, snappedLat] = snappedLocation;
        // Add the SNAPPED coordinates to our markers
        setMarkers(prev => [...prev, [snappedLat, snappedLng]]);
      } else {
        // If no road found, add the original click location
        setMarkers(prev => [...prev, [lat, lng]]);
      }
    } catch (error) {
      console.error("Failed to snap to road:", error);
      // Fallback to original click location on error
      setMarkers(prev => [...prev, [lat, lng]]);
    }
  };

  const handleOptimize = async () => {
    if (markers.length < 2) return alert("Add at least 2 stops.");
    setIsLoading(true);
    try {
      const res = await api.post('/optimize', { coordinates: markers });
      const geojsonGeometry = res.data.routeGeometry;

      // (NEW) OSRM GeoJSON is [lng, lat], Leaflet Polyline needs [lat, lng]. We must convert it.
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

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white shadow-xl z-[1000] flex flex-col">
          {/* ... The entire control panel UI remains the same ... */}
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
              {markers.map((pos, idx) => (
                <li key={idx} className="bg-gray-50 p-2 rounded-md border border-gray-200 text-sm">
                  <span className="font-medium">{`Stop ${idx + 1}:`}</span>{` (${pos[0].toFixed(3)}, ${pos[1].toFixed(3)})`}
                </li>
              ))}
            </ol>
          </div>
      </div>
      <div className="flex-grow">
        <MapContainer center={bhilaiPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
          <MapEvents onMapClick={handleMapClick} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
          {markers.map((p, i) => <Marker key={i} position={p} />)}
          {routePath.length > 0 && <Polyline pathOptions={{ color: '#1D4ED8', weight: 5, opacity: 0.8 }} positions={routePath} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default DashboardPage;