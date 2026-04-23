"use client";

import {
  useCreateFeatureSetMutation,
  useDeleteFeatureSetMutation,
  useGetFeatureSetsQuery,
} from "@/redux/features/featureSlice/featureApi";
import { useState } from "react";
import { Link } from "react-router-dom";

const FeatureDashboard = () => {
  const {
    data: featureSets,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFeatureSetsQuery<any>({});
  const [createFeatureSet, { isLoading: isCreating }] =
    useCreateFeatureSetMutation();
  const [deleteFeatureSet, { isLoading: isDeleting }] =
    useDeleteFeatureSetMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeatureSetName, setNewFeatureSetName] = useState("");

  const handleCreateFeatureSet = async () => {
    if (!newFeatureSetName) return;
    try {
      await createFeatureSet({
        name: newFeatureSetName,
        features: [],
      }).unwrap();
      refetch();
      setNewFeatureSetName("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create feature set:", err);
    }
  };

  const handleDeleteFeatureSet = async (name: any) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteFeatureSet(name).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete feature set:", err);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Home Feature Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isCreating}
        >
          Create Feature Set
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

      {!isLoading && !isError && featureSets?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No feature sets found. Create one to get started.
          </p>
        </div>
      )}

      {!isLoading && !isError && featureSets?.data?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureSets?.data?.map((featureSet: any) => (
            <div
              key={featureSet._id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold capitalize">
                  {featureSet.name}
                </h2>
                <div className="flex space-x-2">
                  <Link 
                    to={`/dashboard/feature-set/${featureSet.name}`}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteFeatureSet(featureSet.name)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                {featureSet.features.length} features
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {featureSet.features.slice(0, 6).map((feature: any) => (
                  <div
                    key={feature._id}
                    className="bg-gray-100 p-2 rounded flex items-center"
                  >
                    <span className="truncate">{feature.label}</span>
                  </div>
                ))}

                {featureSet.features.length > 6 && (
                  <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                    <span className="text-gray-500">
                      +{featureSet.features.length - 6} more
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Feature Set Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Feature Set</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Feature Set Name
              </label>
              <select
                value={newFeatureSetName}
                onChange={(e) => setNewFeatureSetName(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a name</option>
                <option value="feature1">feature1</option>
                <option value="feature2">feature2</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFeatureSet}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!newFeatureSetName || isCreating}
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureDashboard;
