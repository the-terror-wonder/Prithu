import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useDashboard } from '../hooks/useDashboard';
import MapEvents from '../components/MapEvents';

// --- Icons & Helpers ---
const blueIcon = new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]});
const goldIcon = new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]});
const highlightIcon = new L.Icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [35, 55], iconAnchor: [17, 55], popupAnchor: [1, -48], shadowSize: [55, 55]});
const formatDuration = (seconds) => { const hours = Math.floor(seconds / 3600); const minutes = Math.round((seconds % 3600) / 60); return `${hours > 0 ? `${hours} hr ` : ''}${minutes} min`; };
const bhilaiPosition = [21.21, 81.38];

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const LoadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 8.25V3m0 5.25-4.5-4.5M16.5 8.25 12 12.75" /></svg>;

// --- NEW: Loading Spinner Component ---
const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[1000]">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-4 border-t-cyan-400 border-slate-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-white font-semibold text-lg">Optimizing Route...</p>
        </div>
    </div>
);

const DashboardPage = () => {
    const {
        activeTab, setActiveTab, markers, optimizedResult, isLoading, panels, savedPlaces, savedRoutes, sessionHistory,
        highlightedSegment, setHighlightedSegment, hoveredIndex, setHoveredIndex, editingIndex, setEditingIndex,
        runOptimization, addMarker, handleRemoveMarker, handleRenameMarker, handleMapClick, handleSaveStop, handleDeletePlace,
        handleLoadRoute, handleLoadFromHistory, handleSaveFromHistory, handleDeleteRoute, togglePanel,
        handleReset, handleLogout, orderedMarkers
    } = useDashboard();

    const getMarkerIcon = (marker, index) => {
        if (index === hoveredIndex) return highlightIcon;
        return marker.type === 'saved' ? goldIcon : blueIcon;
    };

    const tabClass = (tabName) => `flex-1 py-2.5 text-sm font-semibold text-center transition-colors duration-200 rounded-md ${activeTab === tabName ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`;

    return (
        <div className="flex h-screen w-screen bg-slate-100 font-sans relative">
            <div className="w-full max-w-sm p-4 md:p-6 bg-slate-800 border-r border-slate-700 z-[1000] flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
                    <img src="/logo-full.png" alt="Prithu Logo" className="h-12" />
                    <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors">Logout</button>
                </div>
                <div className="flex flex-col space-y-3">
                    <button onClick={() => runOptimization(markers)} disabled={isLoading || markers.length < 2} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center">
                        {isLoading ? 'Optimizing...' : 'Optimize Now'}
                    </button>
                    <button onClick={handleReset} className="w-full bg-slate-700 text-slate-300 font-bold py-2.5 px-4 rounded-lg hover:bg-slate-600 transition-colors">Reset</button>
                </div>
                <div className="flex mt-6 p-1 bg-slate-900/60 rounded-lg gap-1">
                    <div onClick={() => setActiveTab('planner')} className={tabClass('planner')}>Planner</div>
                    <div onClick={() => setActiveTab('history')} className={tabClass('history')}>History</div>
                </div>
                <div className="mt-4 flex-grow overflow-y-auto pr-2 -mr-2 text-slate-300">
                    {activeTab === 'planner' && (
                        <div className="space-y-4">
                            <div>
                                <h3 onClick={() => togglePanel('currentRoute')} className="text-lg font-bold text-slate-200 pb-2 cursor-pointer flex justify-between items-center"><span>Current Route ({markers.length})</span><span className={`transition-transform duration-300 text-slate-500 ${panels.currentRoute ? '' : '-rotate-90'}`}>▼</span></h3>
                                {panels.currentRoute && (<ol className="space-y-2 mt-2">{markers.map((marker, idx) => (<li key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)} className="bg-slate-700/50 p-2.5 rounded-lg border border-slate-700 text-sm flex justify-between items-center group transition-colors hover:border-blue-500">{editingIndex === idx ? (<input type="text" defaultValue={marker.name} className="w-full p-1 bg-slate-600 border border-slate-500 rounded-md text-white" autoFocus onBlur={(e) => handleRenameMarker(idx, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleRenameMarker(idx, e.target.value) }} />) : (<span className="truncate pr-2 cursor-pointer" title="Click to rename" onClick={() => setEditingIndex(idx)}><span className="font-bold text-cyan-400">{`${idx + 1}. `}</span>{marker.name}</span>)}<div className="flex items-center space-x-3 flex-shrink-0">{marker.type !== 'saved' && <button onClick={() => handleSaveStop(marker.pos, marker.name)} className="text-slate-400 hover:text-green-400 transition-colors" title="Save Stop"><SaveIcon/></button>}<button onClick={() => handleRemoveMarker(idx)} className="text-slate-400 hover:text-red-500 transition-colors" title="Remove Stop"><TrashIcon/></button></div></li>))}</ol>)}
                            </div>
                            <div>
                                <h3 onClick={() => togglePanel('savedPlaces')} className="text-lg font-bold text-slate-200 pb-2 cursor-pointer flex justify-between items-center"><span>Saved Places</span><span className={`transition-transform duration-300 text-slate-500 ${panels.savedPlaces ? '' : '-rotate-90'}`}>▼</span></h3>
                                {panels.savedPlaces && (<ul className="mt-2 space-y-2">{savedPlaces.map(place => (<li key={place._id} className="bg-slate-700/50 p-2.5 rounded-lg border border-slate-700 text-sm flex justify-between items-center group transition-colors hover:border-blue-500"><span>{place.name}</span><div className="flex items-center space-x-3"><button onClick={() => addMarker([place.location.lat, place.location.lng], 'saved', place.name)} className="text-cyan-400 hover:text-cyan-300 transition-colors" title="Add to Route"><PlusIcon/></button><button onClick={() => handleDeletePlace(place._id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete Saved Place"><TrashIcon/></button></div></li>))}</ul>)}
                            </div>
                        </div>
                    )}
                    {activeTab === 'history' && (
                        <div className="space-y-4">
                           <div>
                                <h3 onClick={() => togglePanel('sessionHistory')} className="text-lg font-bold text-slate-200 pb-2 cursor-pointer flex justify-between items-center"><span>Session History</span><span className={`transition-transform duration-300 text-slate-500 ${panels.sessionHistory ? '' : '-rotate-90'}`}>▼</span></h3>
                                {panels.sessionHistory && (<ul className="mt-2 space-y-2">{sessionHistory.map((item, idx) => (<li key={idx} className="bg-slate-700/50 p-2.5 rounded-lg border border-slate-700 text-sm flex justify-between items-center group transition-colors hover:border-blue-500"><span>{`${item.markers.length} stops @ ${item.timestamp.toLocaleTimeString()}`}</span><div className="flex items-center space-x-3"><button onClick={() => handleLoadFromHistory(item)} className="text-cyan-400 hover:text-cyan-300 transition-colors" title="Load this Route"><LoadIcon/></button><button onClick={() => handleSaveFromHistory(item)} className="text-slate-400 hover:text-green-400 transition-colors" title="Save this Route"><SaveIcon/></button></div></li>))}</ul>)}
                            </div>
                            <div>
                                <h3 onClick={() => togglePanel('savedRoutes')} className="text-lg font-bold text-slate-200 pb-2 cursor-pointer flex justify-between items-center"><span>Saved Routes</span><span className={`transition-transform duration-300 text-slate-500 ${panels.savedRoutes ? '' : '-rotate-90'}`}>▼</span></h3>
                                {panels.savedRoutes && (<ul className="mt-2 space-y-2">{savedRoutes.map(route => (<li key={route._id} className="bg-slate-700/50 p-2.5 rounded-lg border border-slate-700 text-sm flex justify-between items-center group transition-colors hover:border-blue-500"><span>{route.name}</span><div className="flex items-center space-x-3"><button onClick={() => handleLoadRoute(route)} className="text-cyan-400 hover:text-cyan-300 transition-colors" title="Load Route"><LoadIcon/></button><button onClick={() => handleDeleteRoute(route._id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete Route"><TrashIcon/></button></div></li>))}</ul>)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- UPDATED: Map Area --- */}
            <div className="flex-grow relative" onMouseLeave={() => setHighlightedSegment(null)}>
                {isLoading && <LoadingSpinner />}
                <MapContainer center={bhilaiPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <MapEvents onMapClick={handleMapClick} />
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {orderedMarkers.map((marker, i) => <Marker key={i} position={marker.pos} icon={getMarkerIcon(marker, orderedMarkers.findIndex(m => m === marker))} /> )}
                    {optimizedResult && (<>{optimizedResult.segments.map((segment, index) => {const segmentSteps = segment.steps; const startPointIndex = segmentSteps[0].way_points[0]; const endPointIndex = segmentSteps[segmentSteps.length - 1].way_points[1]; const segmentPath = optimizedResult.path.slice(startPointIndex, endPointIndex + 1); let color = '#4f46e5'; if (highlightedSegment !== null) {if (index < highlightedSegment) color = '#22c55e'; if (index === highlightedSegment) color = '#facc15';} return <Polyline key={index} positions={segmentPath} pathOptions={{ color, weight: 6, opacity: 0.85 }} />;})}</>)}
                </MapContainer>
            </div>
            
            {optimizedResult && (
                <div className="absolute bottom-4 right-4 z-[1000] p-4 bg-slate-800/80 backdrop-blur-sm shadow-2xl rounded-xl border border-slate-700 max-h-[45vh] overflow-y-auto w-80">
                     <div className="mb-3">
                        <h3 onClick={() => togglePanel('routeDetails')} className="text-md font-bold text-slate-200 border-b border-slate-700 pb-2 mb-2 cursor-pointer flex justify-between items-center">
                            <span>Route Details</span><span className={`transition-transform duration-300 text-slate-400 ${panels.routeDetails ? '' : '-rotate-90'}`}>▼</span>
                        </h3>
                        {panels.routeDetails && (
                            <ul className="space-y-1 text-xs text-slate-300">
                                {optimizedResult.segments.map((segment, idx) => {
                                    const startMarker = orderedMarkers[idx];
                                    const endMarker = orderedMarkers[idx+1];
                                    return (
                                        <li key={idx} 
                                            onMouseEnter={() => setHighlightedSegment(idx)}
                                            className={`p-1.5 rounded-lg flex justify-between cursor-pointer transition-colors ${highlightedSegment === idx ? 'bg-amber-400/20' : 'hover:bg-slate-700/50'}`}>
                                            <span className="font-bold text-slate-100">{startMarker?.name || 'Start'} → {endMarker?.name || 'End'}: </span> 
                                            <span className="font-mono">{(segment.distance / 1000).toFixed(1)} km | {formatDuration(segment.duration)}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                    <h3 className="text-md font-bold text-slate-200 text-center mb-2 pt-3 border-t border-slate-700">Total Summary</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        <div className="font-semibold text-slate-400 text-right">Stops:</div><div className="font-mono text-lg text-white">{markers.length}</div>
                        <div className="font-semibold text-slate-400 text-right">Distance:</div><div className="font-mono text-lg text-white">{(optimizedResult.summary.distance / 1000).toFixed(1)} km</div>
                        <div className="font-semibold text-slate-400 text-right">Time:</div><div className="font-mono text-lg text-white">{formatDuration(optimizedResult.summary.duration)}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;