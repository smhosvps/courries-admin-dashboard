import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useCreateGeofenceMutation } from '@/redux/features/geofencingApi/geofencingApi';

interface AddGeofenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGeofenceModal: React.FC<AddGeofenceModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [drawLayer, setDrawLayer] = useState<L.Circle | null>(null);
  const [mapKey, setMapKey] = useState(Date.now());
  const [createGeofence] = useCreateGeofenceMutation();

  // Reset state when modal opens and force a fresh map
  useEffect(() => {
    if (isOpen) {
      setMapKey(Date.now());
      setName('');
      setDrawLayer(null);
    }
  }, [isOpen]);

  const onCreated = (e: L.LeafletEvent) => {
    const layer = e.layer as L.Circle;
    if (layer instanceof L.Circle) {
      setDrawLayer(layer);
    } else {
      toast.warning('Only circles are supported in this version.');
    }
  };

  const handleSave = async () => {
    if (!drawLayer) {
      toast.error('Please draw a circle on the map.');
      return;
    }
    if (!name.trim()) {
      toast.error('Please provide a name for the geofence.');
      return;
    }

    const latlng = drawLayer.getLatLng();
    const radius = drawLayer.getRadius();

    // Send ONLY circle‑relevant fields (no polygon)
    const geofenceData = {
      name: name.trim(),
      type: 'circle' as const,
      center: {
        type: 'Point' as const,
        coordinates: [latlng.lng, latlng.lat] as [number, number],
      },
      radius,
    };

    try {
      await createGeofence(geofenceData).unwrap();
      toast.success('Geofence created successfully');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create geofence');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add New Geofence</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Downtown Port Harcourt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Draw a circle on the map (radius in meters)
            </label>
            <div className="h-80 w-full rounded-lg overflow-hidden border border-gray-200 mt-1">
              <MapContainer
                key={mapKey}
                center={[4.8156, 7.0498]} // Port Harcourt center
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FeatureGroup>
                  <EditControl
                    position="topright"
                    onCreated={onCreated}
                    draw={{
                      rectangle: false,
                      polygon: false,
                      polyline: false,
                      circle: true,
                      marker: false,
                      circlemarker: false,
                    }}
                  />
                </FeatureGroup>
              </MapContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click the circle button in the top‑right corner, then draw a circle on the map.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Save Geofence
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGeofenceModal;