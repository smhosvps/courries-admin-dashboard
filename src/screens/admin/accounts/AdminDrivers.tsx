/* eslint-disable @typescript-eslint/no-explicit-any */

import { useDeleteUserAdminMutation, useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { useEffect, useState } from 'react';
import {
  FaSearch,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function AdminDrivers() {
  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [deleteUserAdmin, { isSuccess, error, isLoading: isDeleting }] = useDeleteUserAdminMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Filter users - show only delivery_partner with adminRiders = "Yes"
  const filteredUsers = (data?.users || []).filter((user: any) => {
    return user.userType === 'delivery_partner' && user.adminRiders === 'Yes';
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("User successfully deleted.");
      refetch();
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
    if (error) {
      const errorData = error as any;
      toast.error(errorData.data?.message || "Failed to delete user");
    }
  }, [isSuccess, error, refetch]);

  // Open delete modal
  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUserAdmin(userToDelete._id);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Apply search filter if needed
  const searchedUsers = filteredUsers.filter((user: any) => {
    if (!searchName) return true;
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchName.toLowerCase());
  });

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = searchedUsers.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(searchedUsers.length / entriesPerPage);

  return (
    <div className=" min-h-screen">
      {/* Header */}
      <div className='bg-white rounded-xl py-6 px-0 lg:px-4'>
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 gap-3">
            Admin Drivers Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage delivery partners with admin access privileges
          </p>
        </div>

        {/* Stats Card */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-1">Total Admin Drivers</p>
            <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-1">Active Drivers</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredUsers.filter((u: any) => u.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-sm text-gray-600 mb-1">Total Pages</p>
            <p className="text-2xl font-bold text-blue-600">{totalPages || 1}</p>
          </div>
        </div>

        {/* Controls Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Entries Per Page */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Show:</label>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value={5}>5 entries</option>
                <option value={10}>10 entries</option>
                <option value={25}>25 entries</option>
                <option value={50}>50 entries</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200">S/N</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200">Admin Riders</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center border border-gray-200">
                      <div className="flex justify-center items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-gray-600">Loading drivers...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentEntries.length > 0 ? (
                  currentEntries.map((user: any, index: number) => (
                    <tr key={user._id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-gray-600 border border-gray-200">
                        {indexOfFirstEntry + index + 1}
                      </td>
                      <td className="px-6 py-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500">ID: {user._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 text-sm" />
                          <span className="text-gray-700">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400 text-sm" />
                          <span className="text-gray-700">{user.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border border-gray-200">
                        {user.adminRiders === 'Yes' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FaCheckCircle className="text-xs" />
                            Admin Access
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <FaTimesCircle className="text-xs" />
                            No Access
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 border border-gray-200">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-orange-100 text-orange-800'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-orange-500'
                            }`}></span>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 border border-gray-200">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 hover:text-red-700 transition-all duration-200 font-medium text-sm border border-red-200 hover:border-red-300"
                        >
                          <FaTrash className="text-xs" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center border border-gray-200">
                      <div className="flex flex-col items-center gap-3">
                        <FaUserShield className="text-5xl text-gray-300" />
                        <p className="text-gray-500 text-lg">No delivery partners with admin access found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Summary */}
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{indexOfFirstEntry + 1}</span> to{' '}
                <span className="font-semibold text-gray-900">
                  {Math.min(indexOfLastEntry, searchedUsers.length)}
                </span>{' '}
                of <span className="font-semibold text-gray-900">{searchedUsers.length}</span> entries
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                  >
                    <FaChevronLeft className="text-xs" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                  >
                    Next
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Confirm Delete</h3>
                <button
                  onClick={cancelDelete}
                  className="text-gray-400 hover:text-gray-600 transition"
                  disabled={isDeleting}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600">
                  Are you sure you want to delete the admin driver account of{" "}
                  <span className="font-semibold text-gray-900">
                    {userToDelete?.firstName} {userToDelete?.lastName}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-6 border-t border-gray-200 rounded-b-xl bg-gray-50">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition w-full"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}