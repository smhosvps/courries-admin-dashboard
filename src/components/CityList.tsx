/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Loader,
} from "lucide-react";
import {
  City,
  useDeleteCityMutation,
  useGetCitiesQuery,
  useUpdateCityMutation,
} from "@/redux/features/cityApi/cityApi";
import { useGetGeofencesQuery } from '@/redux/features/geofencingApi/geofencingApi';

interface CityListProps {
  onAddClick: () => void;
  onEditClick: (city: City) => void;
}

const CityList: React.FC<CityListProps> = ({ onAddClick, onEditClick }) => {
  const { data: cities, isLoading, error, refetch } = useGetCitiesQuery();
  const { data: geofences, isLoading: geofencesLoading } = useGetGeofencesQuery();
  const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();
  const [updateCity] = useUpdateCityMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);

  // Create a lookup map from geofence ID to name
  const geofenceNameMap = useMemo(() => {
    const map = new Map<string, string>();
    if (geofences && Array.isArray(geofences)) {
      geofences.forEach((gf: any) => {
        if (gf._id && gf.name) {
          map.set(gf._id, gf.name);
        }
      });
    }
    return map;
  }, [geofences]);

  useEffect(() => {
    setCurrentPage(1);
  }, [cities]);

  const handleDeleteClick = (city: City) => {
    setCityToDelete(city);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (cityToDelete) {
      await deleteCity(cityToDelete._id);
      refetch();
      setDeleteModalOpen(false);
      setCityToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCityToDelete(null);
  };

  const handleToggleStatus = async (city: City) => {
    const newStatus = city.status === "enable" ? "disable" : "enable";
    setUpdatingStatusId(city._id);
    await updateCity({ id: city._id, status: newStatus });
    setUpdatingStatusId(null);
    refetch();
  };

  // Display geofenced names using the lookup map
  const getGeofencedDisplay = (city: any) => {
    if (!city.geofenced || city.geofenced.length === 0) return "—";
    // If the backend already populated full objects, handle gracefully
    if (typeof city.geofenced[0] === "object") {
      return city.geofenced?.map((g: any) => g.name || g._id).join(", ");
    }
    // Otherwise, assume array of IDs and resolve names from the map
    const names = city.geofenced
      .map((id: string) => geofenceNameMap.get(id) || id)
      .filter(Boolean);
    return names.length > 0 ? names.join(", ") : "—";
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={64} />
      </div>
    </div>
  );
  if (error) return <div className="text-red-500">Error loading cities</div>;

  const totalItems = cities?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentCities = cities?.slice(start, start + itemsPerPage) || [];

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Cities</h1>
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <MapPin size={18} /> Add City
        </button>
      </div>

      {totalItems === 0 ? (
        <div className="text-center py-8 text-gray-500">No cities found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2 text-left">S/N</th>
                  <th className="border px-2 py-2 text-left">Name</th>
                  <th className="border px-2 py-2 text-left">Country</th>
                  <th className="border px-2 py-2 text-left">Geofenced</th>
                  <th className="border px-2 py-2 text-left">Fixed</th>
                  <th className="border px-2 py-2 text-left">Cancel</th>
                  <th className="border px-2 py-2 text-left">Min Dist</th>
                  <th className="border px-2 py-2 text-left">Min Wt</th>
                  <th className="border px-2 py-2 text-left">Per Dist</th>
                  <th className="border px-2 py-2 text-left">Per Wt</th>
                  <th className="border px-2 py-2 text-left">Comm Type</th>
                  <th className="border px-2 py-2 text-left">Admin Comm</th>
                  <th className="border px-2 py-2 text-left">Status</th>
                  <th className="border px-2 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCities.map((city, idx) => (
                  <tr key={city._id} className="hover:bg-gray-50">
                    <td className="border px-2 py-2">{start + idx + 1}</td>
                    <td className="border px-2 py-2">{city.name}</td>
                    <td className="border px-2 py-2">
                      {(city.country as any)?.name || city.country}
                    </td>
                    <td className="border px-2 py-2">
                      {geofencesLoading ? "Loading..." : getGeofencedDisplay(city)}
                    </td>
                    <td className="border px-2 py-2">{city.fixedCharges}</td>
                    <td className="border px-2 py-2">{city.cancelCharges}</td>
                    <td className="border px-2 py-2">{city.minimumDistance}</td>
                    <td className="border px-2 py-2">{city.minimumWeight}</td>
                    <td className="border px-2 py-2">{city.perDistanceCharge}</td>
                    <td className="border px-2 py-2">{city.perWeightCharge}</td>
                    <td className="border px-2 py-2 capitalize">
                      {city.commissionType}
                    </td>
                    <td className="border px-2 py-2">{city.adminCommission}</td>
                    <td className="border px-2 py-2">
                      <button
                        onClick={() => handleToggleStatus(city)}
                        disabled={updatingStatusId === city._id}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${city.status === "enable" ? "bg-blue-600" : "bg-gray-300"
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 mt-1 bg-white rounded-full transition-transform ${city.status === "enable"
                              ? "translate-x-6"
                              : "translate-x-1"
                            }`}
                        />
                      </button>
                    </td>
                    <td className="border px-2 py-2">
                      <button
                        onClick={() => onEditClick(city)}
                        className="text-blue-600 mr-2"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(city)}
                        className="text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
            </div>
            <div className="flex-row flex gap-2">
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1 border rounded ${p === currentPage
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 border rounded"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 border rounded"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="text-sm">
                Showing {start + 1} to{" "}
                {Math.min(start + itemsPerPage, totalItems)} of {totalItems}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && cityToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[12px] shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Confirm Delete</h3>
              <button
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the city{" "}
              <strong>{cityToDelete.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border rounded-full hover:bg-gray-50 w-full"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 w-full"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityList;