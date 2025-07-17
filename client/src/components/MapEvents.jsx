// client/src/components/MapEvents.jsx
import { useMapEvents } from 'react-leaflet';

function MapEvents({ onMapClick }) {
  // This hook listens for map events.
  useMapEvents({
    click(e) {
      // When a click event happens, call the function we passed in as a prop.
      onMapClick(e);
    },
  });

  // This component doesn't render any visible HTML, so it returns null.
  return null;
}

export default MapEvents;