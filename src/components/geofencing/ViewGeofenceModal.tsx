/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { X } from 'lucide-react';
import { Geofence } from '@/redux/features/geofencingApi/geofencingApi';

interface ViewGeofenceModalProps {
  geofence: Geofence | null;
  onClose: () => void;
}

const FitBounds: React.FC<{ geofence: Geofence }> = ({ geofence }) => {
  const map = useMap();

  useEffect(() => {
    if (!geofence) return;

    if (geofence.type === 'circle' && geofence.center) {
      const lat = geofence.center.coordinates[1];
      const lng = geofence.center.coordinates[0];
      map.setView([lat, lng], 13);
    } else if (geofence.type === 'polygon' && geofence.polygon) {
      const coords:any = geofence.polygon.coordinates[0].map((c) => [c[1], c[0]]);
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geofence, map]);

  return null;
};

const ViewGeofenceModal: React.FC<ViewGeofenceModalProps> = ({ geofence, onClose }) => {
  const mapRef = useRef<L.Map | null>(null);

  const handleClose = () => {
    onClose();
  };

  if (!geofence) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={handleClose}>
      <div
        className="bg-white rounded-xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Geofence: {geofence.name}</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Map */}
        <div className="h-[800px] w-full">
          <MapContainer
            ref={mapRef}
            center={[4.8156, 7.0498]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {geofence.type === 'circle' && geofence.center && (
              <Circle
                center={[geofence.center.coordinates[1], geofence.center.coordinates[0]]}
                radius={geofence.radius!}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }}
              />
            )}

            {geofence.type === 'polygon' && geofence.polygon && (
              <Polygon
                positions={geofence.polygon.coordinates[0].map((c) => [c[1], c[0]])}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }}
              />
            )}

            <FitBounds geofence={geofence} />
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewGeofenceModal;