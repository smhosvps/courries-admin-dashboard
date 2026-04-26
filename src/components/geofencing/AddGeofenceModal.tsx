/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useRef } from 'react'; 
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
  const [open, setOpen] = useState(isOpen);
  const [name, setName] = useState('');
  const [polygonLayer, setPolygonLayer] = useState<L.Polygon | null>(null);
  const [mapKey, setMapKey] = useState(Date.now());
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [createGeofence] = useCreateGeofenceMutation();

  // Sync internal open state with prop
  useEffect(() => {
    setOpen(isOpen);
    if (isOpen) {
      setMapKey(Date.now()); // force new map instance
      setName('');
      setPolygonLayer(null);
    }
  }, [isOpen]);

  // Close handler that updates internal state and calls parent
  const handleClose = () => {
    setOpen(false);
    onClose(); // notify parent after internal close
  };

  const onCreated = (e: L.LeafletEvent) => {
    const layer = e.layer as L.Polygon;
    if (layer instanceof L.Polygon) {
      if (polygonLayer && featureGroupRef.current) {
        featureGroupRef.current.removeLayer(polygonLayer);
      }
      setPolygonLayer(layer);
      toast.info('Polygon drawn. You can edit or delete it using the toolbar.');
    } else {
      toast.warning('Please draw a polygon to define the geofence boundary.');
    }
  };

  const onEdited = (e: L.LeafletEvent) => {
    const layers = (e as any).layers;
    layers.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Polygon) {
        setPolygonLayer(layer);
        toast.info('Polygon updated.');
      }
    });
  };

  const onDeleted = (e: L.LeafletEvent) => {
    const layers = (e as any).layers;
    layers.eachLayer((layer: L.Layer) => {
      if (layer === polygonLayer) {
        setPolygonLayer(null);
        toast.info('Polygon removed.');
      }
    });
  };

  // CORRECTED: Returns GeoJSON Polygon coordinates as [[[lng, lat], ...]]
 const getPolygonCoordinates = (polygon: L.Polygon): number[][][] => {
  const rings = polygon.getLatLngs();
  let ring = rings[0];
  if (Array.isArray(ring) && ring.length > 0 && !(ring[0] instanceof L.LatLng)) {
    ring = ring[0];
  }
  const latLngs = ring as L.LatLng[];
  if (!latLngs.length) return [[]];

  // Convert to [lng, lat]
  const coordinates = latLngs.map((latlng) => [latlng.lng, latlng.lat]);
  
  // Check if the ring is closed (first equals last)
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    coordinates.push([first[0], first[1]]);
  }
  
  return [coordinates];
};

  const handleSave = async () => {
    if (!polygonLayer) {
      toast.error('Please draw a polygon on the map.');
      return;
    }
    if (!name.trim()) {
      toast.error('Please provide a name for the geofence.');
      return;
    }

    const coordinates = getPolygonCoordinates(polygonLayer);
    const geofence:any = {
      name: name.trim(),
      type: 'polygon',
      polygon: {
        type: 'Polygon',
        coordinates: coordinates,
      },
    };

    console.log(geofence, "geofence");

    try {
      await createGeofence(geofence).unwrap();
      toast.success('Geofence created successfully');
      window.location.reload();
      handleClose();
    } catch (err) {
      toast.error('Failed to create geofence');
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add New Geofence</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition" type="button">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Warehouse Zone"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Draw polygon boundary on the map
            </label>
            <div className="h-[600px] w-full rounded-[12px] overflow-hidden border border-gray-200 mt-1">
              <MapContainer
                key={mapKey}
                center={[4.8156, 7.0498]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FeatureGroup ref={featureGroupRef}>
                  <EditControl
                    position="topright"
                    onCreated={onCreated}
                    onEdited={onEdited}
                    onDeleted={onDeleted}
                    draw={{
                      rectangle: false,
                      polygon: true,
                      polyline: false,
                      circle: false,
                      marker: false,
                      circlemarker: false,
                    }}
                  />
                </FeatureGroup>
              </MapContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click the polygon button, then draw the boundary on the map. You can edit or delete it with the toolbar.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
            type="button"
          >
            Save Geofence
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGeofenceModal;