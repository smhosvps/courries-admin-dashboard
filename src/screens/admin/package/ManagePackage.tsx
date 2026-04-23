/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { IoCubeOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  useCreatePackageTypeMutation,
  useDeletePackageTypeMutation,
  useGetPackageTypesAdminQuery,
  useSeedDefaultPackageTypesMutation,
  useUpdatePackageTypeMutation,
} from "@/redux/features/packageTypesApi/packageApi";
import { PlusIcon } from "lucide-react";

// Types
interface PackageType {
  _id: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  value: string;
  label: string;
  description: string;
  icon: string;
}

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export default function ManagePackage() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<PackageType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    value: "",
    label: "",
    description: "",
    icon: "cube-outline",
  });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [packageToDelete, setPackageToDelete] = useState<PackageType | null>(null);

  const {
    data: packageTypesData,
    isLoading,
    refetch,
  } = useGetPackageTypesAdminQuery({});
  const [createPackageType, { isLoading: isCreating }] =
    useCreatePackageTypeMutation();
  const [updatePackageType, { isLoading: isUpdating }] =
    useUpdatePackageTypeMutation();
  const [deletePackageType, { isLoading: isDeleting }] =
    useDeletePackageTypeMutation();
  const [seedDefaultTypes, { isLoading: isSeeding }]: any =
    useSeedDefaultPackageTypesMutation();

  const packageTypes: PackageType[] = packageTypesData?.data || [];

  const handleOpenModal = (type: PackageType | null = null): void => {
    if (type) {
      setEditingType(type);
      setFormData({
        value: type.value,
        label: type.label,
        description: type.description || "",
        icon: type.icon || "cube-outline",
      });
    } else {
      setEditingType(null);
      setFormData({
        value: "",
        label: "",
        description: "",
        icon: "cube-outline",
      });
    }
    setModalVisible(true);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!formData.value.trim() || !formData.label.trim()) {
      toast.error("Value and label are required");
      return;
    }

    try {
      if (editingType) {
        await updatePackageType({
          id: editingType._id,
          ...formData,
        }).unwrap();
        toast.success("Package type updated successfully");
      } else {
        await createPackageType(formData).unwrap();
        toast.success("Package type created successfully");
      }
      setModalVisible(false);
      refetch();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Operation failed");
    }
  };

  // Open delete confirmation modal instead of window.confirm
  const handleDeleteClick = (pkg: PackageType): void => {
    setPackageToDelete(pkg);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!packageToDelete) return;
    try {
      await deletePackageType(packageToDelete._id).unwrap();
      toast.success("Package type deleted successfully");
      setIsDeleteModalOpen(false);
      setPackageToDelete(null);
      refetch();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || "Delete failed");
    }
  };

  const cancelDelete = (): void => {
    setIsDeleteModalOpen(false);
    setPackageToDelete(null);
  };

  const handleSeedDefault = (): void => {
    if (
      window.confirm(
        "This will create default package types if they don't exist. Continue?"
      )
    ) {
      seedDefaultTypes()
        .unwrap()
        .then(() => {
          toast.success("Default package types seeded successfully");
          refetch();
        })
        .catch((error: ApiError) => {
          toast.error(error.data?.message || "Seeding failed");
        });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white p-4 rounded-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Package Types</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> Add New
          </button>
        </div>

        {/* Seed Button */}
        <div className="px-6 py-4">
          <button
            onClick={handleSeedDefault}
            disabled={isSeeding}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSeeding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Seeding...</span>
              </>
            ) : (
              <>
                <FiRefreshCw className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600 font-medium">
                  Seed Default Types
                </span>
              </>
            )}
          </button>
        </div>

        {/* Package Types List */}
        <div className="px-6">
          {packageTypes.length === 0 ? (
            <div className="text-center py-12">
              <IoCubeOutline className="w-16 h-16 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-500">No package types found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Added S/N column */}
                    <th className="border px-2 py-2 text-left">S/N</th>
                    <th className="border px-2 py-2 text-left">Package Type</th>
                    <th className="border px-2 py-2 text-left">Value</th>
                    <th className="border px-2 py-2 text-left">Description</th>
                    <th className="border px-2 py-2 text-left">Status</th>
                    <th className="border px-2 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {packageTypes.map((item: PackageType, index: number) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      {/* Serial Number */}
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200 text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-xl">
                              {item.icon ? (
                                <i className={`icon-${item.icon}`} />
                              ) : (
                                <IoCubeOutline className="w-5 h-5" />
                              )}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.label}
                            </div>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <div className="text-sm text-gray-500">{item.value}</div>
                      </td>
                      <td className="px-6 py-4 border border-gray-200">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {item.description || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        {!item.isActive && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border border-gray-200">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Modal (centered) */}
        {modalVisible && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => setModalVisible(false)}
              ></div>

              <div className="inline-block align-bottom bg-white rounded-[12px] text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {editingType
                          ? "Edit Package Type"
                          : "Create Package Type"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setModalVisible(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="text-2xl">&times;</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Value Field */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Value <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="value"
                          className="w-full border border-gray-300 rounded-[12px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          value={formData.value}
                          onChange={handleInputChange}
                          placeholder="e.g., document"
                          disabled={!!editingType}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Unique identifier (lowercase, no spaces)
                        </p>
                      </div>

                      {/* Label Field */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Label <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="label"
                          className="w-full border border-gray-300 rounded-[12px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.label}
                          onChange={handleInputChange}
                          placeholder="e.g., Document"
                        />
                      </div>

                      {/* Description Field */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          className="w-full border border-gray-300 rounded-[12px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter description (optional)"
                          rows={3}
                        />
                      </div>

                      {/* Icon Field */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Icon
                        </label>
                        <input
                          type="text"
                          name="icon"
                          className="w-full border border-gray-300 rounded-[12px] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.icon}
                          onChange={handleInputChange}
                          placeholder="icon-name (optional)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Icon name (e.g., document-outline, cube-outline)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isCreating || isUpdating}
                      className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:text-sm disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      {isCreating || isUpdating ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <span>{editingType ? "Update" : "Create"}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalVisible(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal (centered) */}
        {isDeleteModalOpen && packageToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={cancelDelete}
              ></div>

              <div className="inline-block align-bottom bg-white rounded-[12px] text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FiTrash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Delete Package Type
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete the package type{" "}
                          <span className="font-semibold">{packageToDelete.label}</span>?
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-300 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span>Deleting...</span>
                      </div>
                    ) : (
                      "Delete"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className="mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}