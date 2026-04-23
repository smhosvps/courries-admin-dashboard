"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAddFeatureMutation,
  useDeleteFeatureMutation,
  useGetFeatureSetByNameQuery,
  useUpdateFeatureMutation,
} from "@/redux/features/featureSlice/featureApi";

const FeatureSetDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const {
    data: featureSet,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFeatureSetByNameQuery<any>(name);

  const [addFeature, { isLoading: isAdding }] = useAddFeatureMutation();
  const [updateFeature, { isLoading: isUpdating }] = useUpdateFeatureMutation();
  const [deleteFeature, { isLoading: isDeleting }] = useDeleteFeatureMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<any>(null);
  const [formData, setFormData] = useState({
    icon: "",
    label: "",
    route: "",
    status: "active",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = async () => {
    try {
      await addFeature({
        name,
        feature: formData,
      }).unwrap();

      refetch();

      setFormData({
        icon: "",
        label: "",
        route: "",
        status: "active",
      });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add feature:", err);
    }
  };

  const handleEditFeature = async () => {
    try {
      await updateFeature({
        name,
        featureId: currentFeature._id,
        feature: formData,
      }).unwrap();

      setCurrentFeature(null);
      setFormData({
        icon: "",
        label: "",
        route: "",
        status: "active",
      });
      refetch();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update feature:", err);
    }
  };

  const handleDeleteFeature = async (featureId: any) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      try {
        await deleteFeature({
          name,
          featureId,
        }).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete feature:", err);
      }
    }
  };

  const openEditModal = (feature: any) => {
    setCurrentFeature(feature);
    setFormData({
      icon: feature.icon,
      label: feature.label,
      route: feature.route,
      status: feature.status || "active",
    });
    setIsEditModalOpen(true);
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate("/dashboard/feature-admin")}
            className="text-blue-600 hover:underline mb-2 flex items-center"
          >
            &larr; Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold capitalize">{name} Management</h1>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isAdding}
        >
          Add Feature
        </button>
      </div>

      {isLoading && <p className="text-center py-4">Loading...</p>}

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>
            {error?.data?.message || "An error occurred while fetching data"}
          </p>
        </div>
      )}

      {!isLoading && !isError && featureSet && (
        <>
          {featureSet?.data?.features?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No features found. Add one to get started.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Icon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Label
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {featureSet?.data?.features?.map((feature: any) => {
                    return (
                      <tr key={feature._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-gray-600">{feature.icon}</div>
                            <span className="ml-2 text-sm text-gray-500">
                              lucide-react-native
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {feature.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {feature.route}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              feature.status === "active"
                                ? "bg-green-100 text-green-800"
                                : feature.status === "maintenance"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {feature.status || "active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(feature)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            disabled={isUpdating}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFeature(feature._id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={isDeleting}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add Feature Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Feature</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Icon</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Label</label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Route</label>
              <input
                type="text"
                name="route"
                value={formData.route}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="new">New</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={
                  !formData.icon ||
                  !formData.label ||
                  !formData.route ||
                  isAdding
                }
              >
                {isAdding ? "Adding..." : "Add Feature"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Feature Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Feature</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Icon</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Label</label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Route</label>
              <input
                type="text"
                name="route"
                value={formData.route}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="new">New</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEditFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={
                  !formData.icon ||
                  !formData.label ||
                  !formData.route ||
                  isUpdating
                }
              >
                {isUpdating ? "Updating..." : "Update Feature"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureSetDetail;
