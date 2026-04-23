/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import {
  useDeleteCountryMutation,
  useGetCountriesQuery,
  useUpdateCountryMutation,
} from "@/redux/features/countryApi/countryApi";
import {
  ChevronLeft,
  ChevronRight,
  Loader,
  LocateFixed,
  PenIcon,
  Trash2Icon,
  X,
} from "lucide-react";

const CountryList = ({ onAddClick, onEditClick }: any) => {
  const {
    data: countries,
    isLoading,
    isError,
    error,
    refetch,
  }: any = useGetCountriesQuery({});
  const [deleteCountry, { isLoading: isDeleting }] = useDeleteCountryMutation();
  const [updateCountry] = useUpdateCountryMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<any>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [countries]);

  const handleDeleteClick = (country: any) => {
    setCountryToDelete(country);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (countryToDelete) {
      try {
        await deleteCountry(countryToDelete._id).unwrap();
        await refetch();
        setDeleteModalOpen(false);
        setCountryToDelete(null);
      } catch (err: any) {
        console.error("Failed to delete country:", err);
        alert(err?.data?.message || "Failed to delete country");
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCountryToDelete(null);
  };

  const handleToggleStatus = async (country: any) => {
    const newStatus = country.status === "enable" ? "disable" : "enable";
    setUpdatingStatusId(country._id);
    try {
      await updateCountry({
        id: country._id,
        ...country,
        status: newStatus,
      }).unwrap();
      await refetch();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert(err?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  if (isLoading) {
    return (
    <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <Loader className="animate-spin text-blue-600" size={64} />
            </div>
          </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error?.data?.message || error.message}
      </div>
    );
  }

  const totalItems = countries?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCountries = countries?.slice(startIndex, endIndex) || [];

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl">
      {/* Header - responsive stacking */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Countries List
        </h1>
        <button
          onClick={onAddClick}
          className="bg-[#1969fe] text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm w-full sm:w-auto flex items-center justify-center"
        >
          <LocateFixed className="inline-block mr-2" size={18} />
          Add Country
        </button>
      </div>

      {totalItems === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No countries found. Click "Add Country" to create one.
        </div>
      ) : (
        <>
          {/* Table container - always horizontally scrollable on mobile */}
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[640px] sm:min-w-full">
              <table className="w-full bg-white border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      S/N
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      Name
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      Distance
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      Weight
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      Status
                    </th>
                    <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {currentCountries.map((country: any, index: number) => (
                    <tr key={country._id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap border border-gray-200 text-center text-sm">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap border border-gray-200 text-sm">
                        {country.name}
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap border border-gray-200 text-sm capitalize">
                        {country.distanceType}
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap border border-gray-200 text-sm capitalize">
                        {country.weightType}
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap border border-gray-200">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={country.status === "enable"}
                          onClick={() => handleToggleStatus(country)}
                          disabled={updatingStatusId === country._id}
                          className={`
                            relative inline-flex h-6 w-11 items-center rounded-full
                            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            ${
                              country.status === "enable"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }
                            ${
                              updatingStatusId === country._id
                                ? "opacity-50 cursor-wait"
                                : "cursor-pointer"
                            }
                          `}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                              ${
                                country.status === "enable"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }
                            `}
                          />
                        </button>
                      </td>
                      <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap border border-gray-200">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEditClick(country)}
                            className="text-blue-600 hover:text-blue-900 p-2 -m-2"
                            aria-label="Edit country"
                          >
                            <PenIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(country)}
                            className="text-red-600 hover:text-red-900 p-2 -m-2"
                            aria-label="Delete country"
                          >
                            <Trash2Icon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Responsive Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            {/* Left: Rows per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* Right: Page numbers + Prev/Next buttons */}
            <div className="flex-row flex gap-2">
              <div className="flex flex-wrap items-center justify-end gap-2">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === page
                        ? "bg-[#1969fe] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="text-sm text-gray-600 text-center md:text-left">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} entries
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && countryToDelete && (
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
              Are you sure you want to delete the country{" "}
              <strong>{countryToDelete.name}</strong>? This action cannot be
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

export default CountryList;