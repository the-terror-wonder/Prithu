import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useDashboard } from '../hooks/useDashboard';
import MapEvents from '../components/MapEvents';

// --- Custom Marker Icons & Helper Functions ---
const blueIcon = new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]});
const goldIcon = new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]});
const highlightIcon = new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [35, 55], iconAnchor: [17, 55], popupAnchor: [1, -48], shadowSize: [55, 55]});

const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours > 0 ? `${hours} hr ` : ''}${minutes} min`;
};

const bhilaiPosition = [21.21, 81.38];

const DashboardPage = () => {
    const {
        activeTab, setActiveTab,
        markers,
        optimizedResult,
        isLoading,
        panels,
        savedPlaces,
        savedRoutes,
        sessionHistory,
        highlightedSegment, setHighlightedSegment,
        hoveredIndex, setHoveredIndex,
        editingIndex, setEditingIndex, // Added
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
    } = useDashboard();

    const getMarkerIcon = (marker, index) => {
        if (index === hoveredIndex) return highlightIcon;
        return marker.type === 'saved' ? goldIcon : blueIcon;
    };

    const tabClass = (tabName) => `w-full py-2 text-center cursor-pointer ${activeTab === tabName ? 'bg-blue-600 text-white' : 'bg-gray-200'}`;

    return (
        <div className="flex h-screen w-screen bg-gray-50 relative">
            <div className="w-full max-w-sm p-6 bg-white shadow-xl z-[1000] flex flex-col">
                <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-gray-900">Prithu</h2><button onClick={handleLogout} className="text-sm bg-red-500 text-white py-1 px-3 rounded">Logout</button></div>
                <div className="flex flex-col space-y-3"><button onClick={() => runOptimization(markers)} disabled={isLoading || markers.length < 2} className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400">{isLoading ? 'Optimizing...' : 'Optimize Now'}</button><button onClick={handleReset} className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Reset</button></div>
                <div className="flex mt-4 border-b"><div onClick={() => setActiveTab('planner')} className={tabClass('planner')}>Planner</div><div onClick={() => setActiveTab('history')} className={tabClass('history')}>History</div></div>
                
                <div className="mt-4 flex-grow overflow-y-auto">
                    {activeTab === 'planner' && (
                        <>
                            <div className="mb-4">
                                <h3 onClick={() => togglePanel('currentRoute')} className="text-lg font-semibold text-gray-800 border-b pb-2 cursor-pointer flex justify-between items-center"><span>Current Route ({markers.length})</span><span>{panels.currentRoute ? '▼' : '▲'}</span></h3>
                                {panels.currentRoute && (
                                    <ol className="list-decimal list-inside mt-2 space-y-2">
                                        {markers.map((marker, idx) => (
                                            <li key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)} className="bg-gray-50 p-2 rounded-md border text-sm flex justify-between items-center">
                                                {editingIndex === idx ? (
                                                    <input type="text" defaultValue={marker.name} className="w-full p-1 border rounded" autoFocus onBlur={(e) => handleRenameMarker(idx, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleRenameMarker(idx, e.target.value) }} />
                                                ) : (
                                                    <span className="truncate pr-2 cursor-pointer" title="Click to rename" onClick={() => setEditingIndex(idx)}><span className="font-bold">{`${idx + 1}. `}</span>{marker.name}</span>
                                                )}
                                                <div className="flex items-center space-x-2 flex-shrink-0">
                                                    {marker.type !== 'saved' && <button onClick={() => handleSaveStop(marker.pos, marker.name)} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Save</button>}
                                                    <button onClick={() => handleRemoveMarker(idx)} className="text-xs bg-red-500 text-white font-bold w-5 h-5 rounded-full hover:bg-red-600">X</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                            <div>
                                <h3 onClick={() => togglePanel('savedPlaces')} className="text-lg font-semibold text-gray-800 border-b pb-2 cursor-pointer flex justify-between items-center"><span>Saved Places</span><span>{panels.savedPlaces ? '▼' : '▲'}</span></h3>
                                {panels.savedPlaces && (<ul className="mt-2 space-y-2">{savedPlaces.map(place => (<li key={place._id} className="bg-gray-50 p-2 rounded-md border text-sm flex justify-between items-center"><span>{place.name}</span><div className="flex items-center space-x-2"><button onClick={() => addMarker([place.location.lat, place.location.lng], 'saved', place.name)} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Add</button><button onClick={() => handleDeletePlace(place._id)} className="text-xs bg-gray-600 text-white font-bold w-5 h-5 rounded-full hover:bg-gray-700">X</button></div></li>))}</ul>)}
                            </div>
                        </>
                    )}
                    {activeTab === 'history' && (
                        <>
                           <div className="mb-4">
                                <h3 onClick={() => togglePanel('sessionHistory')} className="text-lg font-semibold text-gray-800 border-b pb-2 cursor-pointer flex justify-between items-center"><span>Session History</span><span>{panels.sessionHistory ? '▼' : '▲'}</span></h3>
                                {panels.sessionHistory && (<ul className="mt-2 space-y-2">{sessionHistory.map((item, idx) => (<li key={idx} className="bg-gray-50 p-2 rounded-md border text-sm flex justify-between items-center"><span>{`${item.markers.length} stops @ ${item.timestamp.toLocaleTimeString()}`}</span><div className="flex items-center space-x-2"><button onClick={() => handleLoadFromHistory(item)} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Load</button><button onClick={() => handleSaveFromHistory(item)} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Save</button></div></li>))}</ul>)}
                            </div>
                            <div>
                                <h3 onClick={() => togglePanel('savedRoutes')} className="text-lg font-semibold text-gray-800 border-b pb-2 cursor-pointer flex justify-between items-center"><span>Saved Routes</span><span>{panels.savedRoutes ? '▼' : '▲'}</span></h3>
                                {panels.savedRoutes && (<ul className="mt-2 space-y-2">{savedRoutes.map(route => (<li key={route._id} className="bg-gray-50 p-2 rounded-md border text-sm flex justify-between items-center"><span>{route.name}</span><div className="flex items-center space-x-2"><button onClick={() => handleLoadRoute(route)} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Load</button><button onClick={() => handleDeleteRoute(route._id)} className="text-xs bg-gray-600 text-white font-bold w-5 h-5 rounded-full hover:bg-gray-700">X</button></div></li>))}</ul>)}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-grow" onMouseLeave={() => setHighlightedSegment(null)}>
                <MapContainer center={bhilaiPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <MapEvents onMapClick={handleMapClick} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    
                    {orderedMarkers.map((marker, i) => {
                        const originalIndex = markers.findIndex(m => m.pos === marker.pos);
                        return (
                            <Marker key={i} position={marker.pos} icon={getMarkerIcon(marker, originalIndex)}>
                                <Tooltip sticky>
                                    <div className="font-sans">
                                        <p className="font-bold text-base">{marker.name}</p>
                                        {optimizedResult && (
                                            <>
                                                {optimizedResult.segments[i] ? (
                                                    <p className="text-sm mt-1">
                                                        To next: <span className="font-semibold">{(optimizedResult.segments[i].distance / 1000).toFixed(1)} km</span> | <span className="font-semibold">{formatDuration(optimizedResult.segments[i].duration)}</span>
                                                    </p>
                                                ) : (<p className="text-sm mt-1">Final Destination</p>)}
                                            </>
                                        )}
                                    </div>
                                </Tooltip>
                            </Marker>
                        );
                    })}

                    {optimizedResult && (
                        <>
                            {optimizedResult.segments.map((segment, index) => {
                                const segmentSteps = segment.steps;
                                const startPointIndex = segmentSteps[0].way_points[0];
                                const endPointIndex = segmentSteps[segmentSteps.length - 1].way_points[1];
                                const segmentPath = optimizedResult.path.slice(startPointIndex, endPointIndex + 1);
                                
                                let color = '#1D4ED8';
                                if (highlightedSegment !== null) {
                                    if (index < highlightedSegment) color = '#16a34a'; 
                                    if (index === highlightedSegment) color = '#facc15';
                                }

                                return <Polyline key={index} positions={segmentPath} pathOptions={{ color, weight: 6, opacity: 0.85 }} />;
                            })}
                        </>
                    )}
                </MapContainer>
            </div>
            
            {optimizedResult && (
                <div className="absolute bottom-4 right-4 z-[1000] p-4 bg-white shadow-xl rounded-lg border max-h-[45vh] overflow-y-auto">
                     <div className="mb-3">
                        <h3 onClick={() => togglePanel('routeDetails')} className="text-md font-bold text-gray-800 border-b pb-1 mb-2 cursor-pointer flex justify-between items-center">
                            <span>Route Details</span><span>{panels.routeDetails ? '▼' : '▲'}</span>
                        </h3>
                        {panels.routeDetails && (
                            <ul className="space-y-1 text-xs text-gray-600">
                                {optimizedResult.segments.map((segment, idx) => {
                                    const startMarkerIndex = optimizedResult.order[idx];
                                    const endMarkerIndex = optimizedResult.order[idx+1];
                                    return (
                                        <li key={idx} 
                                            onMouseEnter={() => setHighlightedSegment(idx)}
                                            className={`p-1.5 rounded-md flex justify-between cursor-pointer transition-colors ${highlightedSegment === idx ? 'bg-yellow-200' : 'hover:bg-gray-100'}`}>
                                            <span className="font-bold">{startMarkerIndex + 1} → {endMarkerIndex + 1}: </span> 
                                            <span className="font-mono">{(segment.distance / 1000).toFixed(1)} km | {formatDuration(segment.duration)}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                    <h3 className="text-md font-bold text-gray-800 text-center mb-2 pt-2 border-t">Total Summary</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        <div className="font-semibold text-gray-600 text-right">Stops:</div>
                        <div className="font-mono text-lg">{markers.length}</div>
                        <div className="font-semibold text-gray-600 text-right">Distance:</div>
                        <div className="font-mono text-lg">{(optimizedResult.summary.distance / 1000).toFixed(1)} km</div>
                        <div className="font-semibold text-gray-600 text-right">Time:</div>
                        <div className="font-mono text-lg">{formatDuration(optimizedResult.summary.duration)}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;