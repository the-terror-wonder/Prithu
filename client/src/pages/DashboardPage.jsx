import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import debounce from 'lodash/debounce';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import MapEvents from '../components/MapEvents';

// --- Custom Marker Icons ---
const blueIcon = new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]});
const goldIcon = new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]});

const bhilaiPosition = [21.21, 81.38];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('planner');
  const [markers, setMarkers] = useState([]);
  const [routePath, setRoutePath] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const navigate = useNavigate();

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesRes, routesRes] = await Promise.all([api.get('/places'), api.get('/routes')]);
        setSavedPlaces(placesRes.data);
        setSavedRoutes(routesRes.data);
      } catch (err) { console.error("Could not fetch data", err); }
    };
    fetchData();
  }, []);

  // --- Core Optimization Logic ---
  const runOptimization = useCallback(async (currentMarkers) => {
    if (currentMarkers.length < 2) {
      setRoutePath([]);
      return;
    }
    setIsLoading(true);
    try {
      const coordinates = currentMarkers.map(marker => marker.pos);
      const res = await api.post('/optimize', { coordinates });
      const leafletPath = res.data.routeGeometry.coordinates.map(p => [p[1], p[0]]);
      setRoutePath(leafletPath);
      setSessionHistory(prev => [{ markers: currentMarkers, routePath: leafletPath, timestamp: new Date() }, ...prev].slice(0, 10));
    } catch (error) { console.error("Could not optimize route:", error); }
    setIsLoading(false);
  }, []);

  const debouncedOptimize = useMemo(() => debounce(runOptimization, 1000), [runOptimization]);
  useEffect(() => () => debouncedOptimize.cancel(), [debouncedOptimize]);

  // --- Handlers ---
  const addMarker = (pos, type = 'current') => {
    if (markers.some(m => m.pos[0] === pos[0] && m.pos[1] === pos[1])) return;
    setMarkers(prev => [...prev, { pos, type }]);
  };

  const handleRemoveMarker = (indexToRemove) => {
    const newMarkers = markers.filter((_, index) => index !== indexToRemove);
    setMarkers(newMarkers);
    debouncedOptimize(newMarkers);
  };
  
  const handleMapClick = (e) => addMarker([e.latlng.lat, e.latlng.lng]);

  const handleSaveStop = async (pos) => {
    const name = prompt("Enter a name for this location:", `Stop @ ${pos[0].toFixed(3)}`);
    if (name) {
        try {
            const newPlace = { name, location: { lat: pos[0], lng: pos[1] } };
            const res = await api.post('/places', newPlace);
            setSavedPlaces(prev => [res.data, ...prev]);
            setMarkers(prev => prev.map(m => (m.pos[0] === pos[0] && m.pos[1] === pos[1]) ? { ...m, type: 'saved' } : m));
        } catch (err) { alert("Could not save place."); }
    }
  };

  const handleDeletePlace = async (placeId) => {
  if (window.confirm("Are you sure you want to permanently delete this saved place?")) {
    // First, find the place to get its coordinates before we delete it
    const placeToDelete = savedPlaces.find(p => p._id === placeId);
    if (!placeToDelete) return;

    try {
      // 1. Delete the place from the database
      await api.delete(`/places/${placeId}`);

      // 2. Remove it from the "Saved Places" list in the UI
      setSavedPlaces(prev => prev.filter(p => p._id !== placeId));

      // 3. Update any markers on the map that correspond to this place
      setMarkers(prevMarkers => 
        prevMarkers.map(marker => {
          if (marker.type === 'saved' && 
              marker.pos[0] === placeToDelete.location.lat && 
              marker.pos[1] === placeToDelete.location.lng) {
            // If the position matches, revert its type to 'current'
            return { ...marker, type: 'current' };
          }
          return marker; // Otherwise, leave it as is
        })
      );
    } catch (err) { 
      alert("Could not delete place."); 
    }
  }
};

  const handleLoadRoute = (route) => {
    setMarkers(route.locations);
    runOptimization(route.locations);
    setActiveTab('planner');
  };

  // --- NEW: Handler to load from session history ---
  const handleLoadFromHistory = (historyItem) => {
    setMarkers(historyItem.markers);
    setRoutePath(historyItem.routePath);
    setActiveTab('planner');
  };

  const handleSaveFromHistory = async (historyItem) => {
    const name = prompt("Enter a name for this route:", `Route @ ${historyItem.timestamp.toLocaleTimeString()}`);
    if (name) {
      try {
        const res = await api.post('/routes', { name, locations: historyItem.markers });
        setSavedRoutes(prev => [res.data, ...prev]);
        alert("Route saved successfully!");
      } catch (err) { alert("Could not save route."); }
    }
  };
  
  const handleDeleteRoute = async (routeId) => {
    if (window.confirm("Delete this route permanently?")) {
      try {
        await api.delete(`/routes/${routeId}`);
        setSavedRoutes(prev => prev.filter(r => r._id !== routeId));
      } catch (err) { alert("Could not delete route."); }
    }
  };

  const getMarkerIcon = (type) => (type === 'saved' ? goldIcon : blueIcon);
  const handleReset = () => { setMarkers([]); setRoutePath([]); setSessionHistory([]); };
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  const tabClass = (tabName) => `w-full py-2 text-center cursor-pointer ${activeTab === tabName ? 'bg-blue-600 text-white' : 'bg-gray-200'}`;

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white shadow-xl z-[1000] flex flex-col">
        {/* Header and Action Buttons */}
        <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-gray-900">Prithu</h2><button onClick={handleLogout} className="text-sm bg-red-500 text-white py-1 px-3 rounded">Logout</button></div>
        <div className="flex flex-col space-y-3"><button onClick={() => runOptimization(markers)} disabled={isLoading || markers.length < 2} className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400">{isLoading ? 'Optimizing...' : 'Optimize Now'}</button><button onClick={handleReset} className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Reset</button></div>
        
        {/* Tab Navigation */}
        <div className="flex mt-4 border-b">
          <div onClick={() => setActiveTab('planner')} className={tabClass('planner')}>Planner</div>
          <div onClick={() => setActiveTab('history')} className={tabClass('history')}>History</div>
        </div>

        {/* Tab Content */}
        <div className="mt-4 flex-grow overflow-y-auto">
          {activeTab === 'planner' && (
            <>
              <div className="mb-4"><h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Current Route ({markers.length})</h3><ol className="list-decimal list-inside mt-2 space-y-2">{markers.map((marker, idx) => ( <li key={idx} className="bg-gray-50 p-2 rounded-md border text-sm flex justify-between items-center"><span>{`Stop ${idx + 1}`}</span><div className="flex items-center space-x-2">{marker.type !== 'saved' && <button onClick={() => handleSaveStop(marker.pos)} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Save</button>}<button onClick={() => handleRemoveMarker(idx)} className="text-xs bg-red-500 text-white font-bold w-5 h-5 rounded-full hover:bg-red-600">X</button></div></li>))}</ol></div>
              <div><h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Saved Places</h3><ul className="mt-2 space-y-2">{savedPlaces.map(place => (<li key={place._id} className="bg-gray-50 p-2 rounded-md border text-sm flex justify-between items-center"><span>{place.name}</span><div className="flex items-center space-x-2"><button onClick={() => addMarker([place.location.lat, place.location.lng], 'saved')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Add</button><button onClick={() => handleDeletePlace(place._id)} className="text-xs bg-gray-600 text-white font-bold w-5 h-5 rounded-full hover:bg-gray-700">X</button></div></li>))}</ul></div>
            </>
          )}
          {activeTab === 'history' && (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Session History</h3>
                {/* --- UPDATED UI for Session History --- */}
                <ul className="mt-2 space-y-2">{sessionHistory.map((item, idx) => (<li key={idx} className="bg-gray-50 p-2 rounded-md border text-sm flex justify-between items-center"><span>{`${item.markers.length} stops @ ${item.timestamp.toLocaleTimeString()}`}</span><div className="flex items-center space-x-2"><button onClick={() => handleLoadFromHistory(item)} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Load</button><button onClick={() => handleSaveFromHistory(item)} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Save</button></div></li>))}</ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Saved Routes</h3>
                <ul className="mt-2 space-y-2">{savedRoutes.map(route => (<li key={route._id} className="bg-gray-50 p-2 rounded-md border text-sm flex justify-between items-center"><span>{route.name}</span><div className="flex items-center space-x-2"><button onClick={() => handleLoadRoute(route)} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Load</button><button onClick={() => handleDeleteRoute(route._id)} className="text-xs bg-gray-600 text-white font-bold w-5 h-5 rounded-full hover:bg-gray-700">X</button></div></li>))}</ul>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Map */}
      <div className="flex-grow">
        <MapContainer center={bhilaiPosition} zoom={13} style={{ height: '100%', width: '100%' }}><MapEvents onMapClick={handleMapClick} /><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />{markers.map((marker, i) => <Marker key={i} position={marker.pos} icon={getMarkerIcon(marker.type)} />)}{routePath.length > 0 && <Polyline pathOptions={{ color: '#1D4ED8', weight: 5, opacity: 0.8 }} positions={routePath} />}</MapContainer>
      </div>
    </div>
  );
};

export default DashboardPage;