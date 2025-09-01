// client/src/hooks/useDashboard.js
import { useAuth } from '../context/AuthContext';
import {
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import {
    useNavigate
} from 'react-router-dom';
import debounce from 'lodash/debounce';
import api from '../services/api';

export const useDashboard = () => {
    const [activeTab, setActiveTab] = useState('planner');
    const [markers, setMarkers] = useState([]);
    const [optimizedResult, setOptimizedResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [panels, setPanels] = useState({
        currentRoute: true,
        savedPlaces: true,
        sessionHistory: true,
        savedRoutes: true,
        routeDetails: true
    });

    const [savedPlaces, setSavedPlaces] = useState([]);
    const [savedRoutes, setSavedRoutes] = useState([]);
    const [sessionHistory, setSessionHistory] = useState([]);

    
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [highlightedSegment, setHighlightedSegment] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    useEffect(() => {
        const wakeUpServer = async () => {
            try {
                console.log("Pinging server to wake it up...");
                await api.get('/health');
                console.log("Server is awake.");
            } catch (err) {
                console.error("Server ping failed:", err.message);
            }
        };
        wakeUpServer();
    }, []); // Empty array ensures this runs only once when the dashboard loads

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [placesRes, routesRes] = await Promise.all([api.get('/places'), api.get('/routes')]);
                setSavedPlaces(placesRes.data);
                setSavedRoutes(routesRes.data);
            } catch (err) {
                console.error("Could not fetch data", err);
            }
        };
        fetchData();
    }, []);

    const runOptimization = useCallback(async (currentMarkers) => {
        if (currentMarkers.length < 2) {
            setOptimizedResult(null);
            return;
        }
        setIsLoading(true);
        try {
            const coordinates = currentMarkers.map(marker => marker.pos);
            const res = await api.post('/optimize', {
                coordinates
            });

            const result = {
                order: res.data.optimizedOrder,
                path: res.data.routeGeometry.coordinates.map(p => [p[1], p[0]]),
                summary: res.data.routeSummary,
                segments: res.data.routeSegments,
            };
            setOptimizedResult(result);
            setSessionHistory(prev => [{
                markers: currentMarkers,
                result,
                timestamp: new Date()
            }, ...prev].slice(0, 10));
        } catch (error) {
            console.error("Could not optimize route:", error);
        }
        setIsLoading(false);
    }, []);

    const debouncedOptimize = useMemo(() => debounce(runOptimization, 1000), [runOptimization]);
    useEffect(() => () => debouncedOptimize.cancel(), [debouncedOptimize]);

    const addMarker = (pos, type = 'current', name = `Stop @ ${pos[0].toFixed(3)}`) => {
        if (markers.some(m => m.pos[0] === pos[0] && m.pos[1] === pos[1])) {
            alert('This stop is already in your current route.'); // Added feedback
            return;
        }
        setOptimizedResult(null);
        setMarkers(prev => [...prev, {
            pos,
            type,
            name
        }]);
    };

    const handleRemoveMarker = (indexToRemove) => {
        const newMarkers = markers.filter((_, index) => index !== indexToRemove);
        setMarkers(newMarkers);
        debouncedOptimize(newMarkers);
    };

    const handleRenameMarker = (indexToRename, newName) => {
        const newMarkers = markers.map((marker, index) => {
            if (index === indexToRename) {
                return {
                    ...marker,
                    name: newName
                };
            }
            return marker;
        });
        setMarkers(newMarkers);
        setEditingIndex(null);
    };

    const handleMapClick = async (e) => {
        const {
            lat,
            lng
        } = e.latlng;
        try {
            const response = await api.post('/optimize/nearest', {
                lat,
                lng
            });
            const snappedLocation = response.data.location;
            const locationName = response.data.name;
            const [snappedLng, snappedLat] = snappedLocation;
            addMarker([snappedLat, snappedLng], 'current', locationName);
        } catch (error) {
            console.error("Failed to snap to road:", error);
            addMarker([lat, lng]);
        }
    };

    const handleSaveStop = async (pos, currentName) => {
        const name = prompt("Enter a name for this location:", currentName);
        if (name) {
            try {
                const newPlace = {
                    name,
                    location: {
                        lat: pos[0],
                        lng: pos[1]
                    }
                };
                const res = await api.post('/places', newPlace);
                setSavedPlaces(prev => [res.data, ...prev]);
                setMarkers(prev => prev.map(m => (m.pos[0] === pos[0] && m.pos[1] === pos[1]) ? {
                    ...m,
                    type: 'saved',
                    name: name
                } : m));
            } catch (err) {
                alert("Could not save place.");
            }
        }
    };

    const handleDeletePlace = async (placeId) => {
        if (window.confirm("Delete this saved place permanently?")) {
            const placeToDelete = savedPlaces.find(p => p._id === placeId);
            if (!placeToDelete) return;
            try {
                await api.delete(`/places/${placeId}`);
                setSavedPlaces(prev => prev.filter(p => p._id !== placeId));
                setMarkers(prevMarkers =>
                    prevMarkers.map(marker => {
                        if (marker.type === 'saved' && marker.pos[0] === placeToDelete.location.lat && marker.pos[1] === placeToDelete.location.lng) {
                            return {
                                ...marker,
                                type: 'current'
                            };
                        }
                        return marker;
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

    const handleLoadFromHistory = (historyItem) => {
        setMarkers(historyItem.markers);
        setOptimizedResult(historyItem.result);
        setActiveTab('planner');
    };

    const handleSaveFromHistory = async (historyItem) => {
        const name = prompt("Enter a name for this route:", `Route @ ${historyItem.timestamp.toLocaleTimeString()}`);
        if (name) {
            try {
                const res = await api.post('/routes', {
                    name,
                    locations: historyItem.markers
                });
                setSavedRoutes(prev => [res.data, ...prev]);
                alert("Route saved successfully!");
            } catch (err) {
                alert("Could not save route.");
            }
        }
    };

    const handleDeleteRoute = async (routeId) => {
        if (window.confirm("Delete this route permanently?")) {
            try {
                await api.delete(`/routes/${routeId}`);
                setSavedRoutes(prev => prev.filter(r => r._id !== routeId));
            } catch (err) {
                alert("Could not delete route.");
            }
        }
    };

    const togglePanel = (panelName) => setPanels(prev => ({
        ...prev,
        [panelName]: !prev[panelName]
    }));

    const handleReset = () => {
        setMarkers([]);
        setOptimizedResult(null);
        setSessionHistory([]);
    };
   const handleLogout = async () => {
        try {
            await api.post('/auth/logout'); // Call the backend to clear the cookie
        } catch (error) {
            console.error("Logout API call failed", error);
        } finally {
            logout(); // Clear the frontend authenticated state
            navigate('/login');
        }
    };

    const orderedMarkers = useMemo(() => {
        if (!optimizedResult) return markers;
        return optimizedResult.order.map(index => markers[index]).filter(Boolean);
    }, [markers, optimizedResult]);

    return {
        activeTab,
        setActiveTab,
        markers,
        optimizedResult,
        isLoading,
        panels,
        savedPlaces,
        savedRoutes,
        sessionHistory,
        highlightedSegment,
        setHighlightedSegment,
        hoveredIndex,
        setHoveredIndex,
        editingIndex,
        setEditingIndex, // Added
        runOptimization,
        addMarker,
        handleRemoveMarker,
        handleRenameMarker, // Added
        handleMapClick,
        handleSaveStop,
        handleDeletePlace,
        handleLoadRoute,
        handleLoadFromHistory,
        handleSaveFromHistory,
        handleDeleteRoute,
        togglePanel,
        handleReset,
        handleLogout,
        orderedMarkers
    };
};