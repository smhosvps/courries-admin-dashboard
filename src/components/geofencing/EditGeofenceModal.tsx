import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Geofence, useUpdateGeofenceMutation } from '@/redux/features/geofencingApi/geofencingApi';

interface EditGeofenceModalProps {
  geofence: Geofence | null;
  onClose: () => void; 
}

const DraggableMarker: React.FC<{
  center: { lat: number; lng: number };
  setCenter: (c: { lat: number; lng: number }) => void;
}> = ({ center, setCenter }) => {
  return (
    <Marker
      position={[center.lat, center.lng]}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setCenter({ lat, lng });
        },
      }}
    />
  );
};

const EditGeofenceModal: React.FC<EditGeofenceModalProps> = ({ geofence, onClose }) => {
  const [name, setName] = useState('');
  const [radius, setRadius] = useState('');
  const [center, setCenter] = useState({ lat: 4.8156, lng: 7.0498 });
  const [mapKey, setMapKey] = useState(Date.now());
  const [updateGeofence] = useUpdateGeofenceMutation();

  // Load geofence data when it changes
  useEffect(() => {
    if (geofence && geofence.type === 'circle' && geofence.center) {
      setName(geofence.name);
      setRadius(geofence.radius?.toString() || '');
      setCenter({
        lat: geofence.center.coordinates[1],
        lng: geofence.center.coordinates[0],
      });
      setMapKey(Date.now()); // force new map instance when geofence changes
    }
  }, [geofence]);

  const handleSave = async () => {
    if (!geofence) return;

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!radius || isNaN(Number(radius))) {
      toast.error('Valid radius is required');
      return;
    }

    // Send ONLY circle‑relevant fields (no polygon)
    const updateData = {
      name: name.trim(),
      radius: Number(radius),
      center: {
        type: 'Point' as const,
        coordinates: [center.lng, center.lat] as [number, number],
      },
    };

    try {
      await updateGeofence({
        id: geofence._id,
        data: updateData,
      }).unwrap();

      toast.success('Geofence updated successfully');
      window.location.reload();
      onClose();
    } catch (err) {
      toast.error('Failed to update geofence');
      console.error(err);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!geofence || geofence.type !== 'circle') return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={handleClose}>
      <div
        className="bg-white rounded-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Edit Geofence</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Radius (meters)</label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Center (drag marker to adjust)
            </label>
            <div className="h-[600px] w-full rounded-[12px] overflow-hidden border border-gray-200 mt-1">
              <MapContainer
                key={mapKey}
                center={[center.lat, center.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <DraggableMarker center={center} setCenter={setCenter} />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition w-full"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGeofenceModal;