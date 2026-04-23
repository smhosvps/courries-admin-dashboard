/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  useDeleteUserAdminMutation,
  useGetAllUsersQuery,
} from "@/redux/features/user/userApi";
import { EyeIcon, PlusCircle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "jspdf-autotable";

export default function SuperAdminPage() {
  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [deleteUserAdmin, { isSuccess, error, isLoading: isDeleting }] =
    useDeleteUserAdminMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");

  console.log(setEntriesPerPage)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Filter users - only show super admins
  const filteredUsers = (data?.users || []).filter((user: any) => {
    if (user.userType !== "super admin") return false;

    const searchTerm = searchName.trim().toLowerCase();
    if (searchTerm === "") return true;

    const firstName = user?.firstName?.toLowerCase().trim() || "";
    const lastName = user?.lastName?.toLowerCase().trim() || "";
    const email = user?.email?.toLowerCase().trim() || "";
    const phone = user?.phone?.toLowerCase().trim() || "";

    return (
      firstName.includes(searchTerm) ||
      lastName.includes(searchTerm) ||
      `${firstName} ${lastName}`.includes(searchTerm) ||
      email.includes(searchTerm) ||
      phone.includes(searchTerm)
    );
  });

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredUsers.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

  // Open delete confirmation modal
  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUserAdmin(userToDelete._id);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // CSV Download - only for super admins
  const handleDownloadCSV = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Status", "User Type"],
      ...filteredUsers.map((user: any) => [
        `"${user?.firstName || ""} ${user?.lastName || ""}"`,
        `"${user?.email || ""}"`,
        `"${user?.phone || ""}"`,
        `"${user?.isVerified ? "Verified" : "Not Verified"}"`,
        `"${user?.userType || ""}"`,
      ]),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "super_admins.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="">
        {/* Header Section - Fully Responsive */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-gray-200">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Super Admins
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={handleDownloadCSV}
                className="w-full sm:w-auto border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-50"
              >
                Download CSV
              </Button>
              <Link
                to="/dashboard-super-admin/add-admin-account"
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto bg-[#1969fe] hover:bg-blue-600 text-white rounded-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="p-4 space-y-4">
            <div className="w-full">
              <input
                type="text"
                placeholder="Search super admins by name, email, or phone"
                className="w-full p-3 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setCurrentPage(1); // reset to first page on search
                }}
              />
            </div>

            {/* Table Section */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                No super admins found
              </div>
            ) : (
              <>
                {/* Responsive Table Container */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                            S.No
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                            Name
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                            Status
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                            Email
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                            Phone
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                            User Type
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {currentEntries.map((user: any, index: number) => (
                          <tr
                            key={user._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border border-gray-200 text-sm">
                              {indexOfFirstEntry + index + 1}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border border-gray-200 text-sm font-medium text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border border-gray-200">
                              <span
                                className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${user.isVerified
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {user.isVerified ? "Verified" : "Not Verified"}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border border-gray-200 text-sm text-gray-600">
                              {user?.email}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border border-gray-200 text-sm text-gray-600">
                              {user?.phone || "-"}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border border-gray-200 text-sm text-gray-600">
                              {user?.userType || "-"}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap border border-gray-200">
                              <div className="flex flex-wrap items-center gap-2">
                                <Link
                                  to={`/dashboard-super-admin/user-detail/${user._id}`}
                                >
                                  <Button
                                    size="sm"
                                    className="gap-1 rounded-[6px] text-[#1969fe]"
                                  >
                                    <EyeIcon className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <button
                                  onClick={() => handleDeleteClick(user)}
                                  className="text-red-600"
                                >
                                  <Trash2 size={16} />
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
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-600 order-2 sm:order-1">
                    Showing {indexOfFirstEntry + 1} to{" "}
                    {Math.min(indexOfLastEntry, filteredUsers.length)} of{" "}
                    {filteredUsers.length} super admins
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 order-1 sm:order-2">
                    <Button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="px-3 py-1 rounded-2xl"
                    >
                      Previous
                    </Button>
                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
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
                            <Button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              className={`w-8 h-8 p-0 rounded-full text-white ${currentPage === pageNum
                                  ? "bg-[#1969fe] hover:bg-blue-600"
                                  : "bg-[#1969fe] hover:bg-blue-600"
                                }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>
                    <Button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="px-3 py-1 rounded-full"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Confirm Delete
              </h3>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={isDeleting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete the account of{" "}
                <span className="font-semibold text-gray-900">
                  {userToDelete?.firstName} {userToDelete?.lastName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-6 border-t rounded-b-xl border-gray-200 bg-gray-50">
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
  );
}
