import React, { useState } from "react";
import { Plus } from "lucide-react";

import GeofenceTable from "@/components/geofencing/GeofenceTable";
import { Geofence } from "@/redux/features/geofencingApi/geofencingApi";
import EditGeofenceModal from "@/components/geofencing/EditGeofenceModal";
import AddGeofenceModal from "@/components/geofencing/AddGeofenceModal";
import ViewGeofenceModal from "@/components/geofencing/ViewGeofenceModal";

const GeofencingPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewGeofence, setViewGeofence] = useState<Geofence | null>(null);
  const [editGeofence, setEditGeofence] = useState<Geofence | null>(null);

  return (
    <div className="min-h-screen rounded-2xl">
      {/* Responsive container with max-width for large screens */}
      <div className="w-full px-4 lg:px-4 py-8 bg-white rounded-2xl">
        {/* Header - responsive stacking */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Geofence Management
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700 transition w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus className="w-5 h-5" />
            Add New Area
          </button>
        </div>

        {/* Main content – table wrapper with responsive overflow handling */}
        <div className="w-full overflow-x-auto">
          <GeofenceTable
            onViewOnMap={(gf) => setViewGeofence(gf)}
            onEdit={(gf) => setEditGeofence(gf)}
          />
        </div>
      </div>

      {/* Modals – they are already responsive if built with Tailwind */}
      <AddGeofenceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      <ViewGeofenceModal
        geofence={viewGeofence}
        onClose={() => setViewGeofence(null)}
      />
      <EditGeofenceModal
        geofence={editGeofence}
        onClose={() => setEditGeofence(null)}
      />
    </div>
  );
};

export default GeofencingPage;