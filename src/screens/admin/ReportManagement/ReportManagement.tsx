/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  useDeleteReportMutation,
  useGetAllReportsAdminQuery,
  useUpdateReportStatusMutation,
} from "@/redux/features/report/reportApi";
import { CirclePowerIcon, EyeIcon, Loader, Trash2 } from "lucide-react";

interface ReportItem {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  deliveryId: string;
  deliveryType: string;
  description: string;
  images: string[];
  status: "pending" | "in-progress" | "resolved" | "rejected";
  resolvedNote?: string;
  adminNote?: string;
  resolvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ReportManagement() {
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: "",
    resolvedNote: "",
    adminNote: "",
  });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<ReportItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // RTK Query hooks
  const { data, isLoading, refetch } = useGetAllReportsAdminQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateReportStatusMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Handle view report
  const handleView = (report: ReportItem) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  // Handle status update
  const handleStatusUpdate = (report: ReportItem) => {
    setSelectedReport(report);
    setStatusForm({
      status: report.status,
      resolvedNote: report.resolvedNote || "",
      adminNote: report.adminNote || "",
    });
    setIsStatusModalOpen(true);
  };

  // Submit status update
  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      await updateStatus({
        id: selectedReport._id,
        data: statusForm,
      }).unwrap();

      toast.success(`Report ${statusForm.status} successfully!`);
      setIsStatusModalOpen(false);
      await refetch();
    } catch (err) {
      toast.error("Failed to update report status");
      console.error(err);
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (report: ReportItem) => {
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!reportToDelete) return;
    try {
      await deleteReport(reportToDelete._id).unwrap();
      toast.success("Report deleted successfully!");
      setIsDeleteModalOpen(false);
      setReportToDelete(null);
      await refetch();
    } catch (err) {
      toast.error("Failed to delete report");
      console.error(err);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setReportToDelete(null);
  };

  // Pagination calculations
  const allReports = data?.reports || [];
  const totalItems = allReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = allReports.slice(startIndex, endIndex);

  // Group reports by status for stats
  const reportsByStatus: any = allReports.reduce(
    (acc: Record<string, ReportItem[]>, report: ReportItem) => {
      if (!acc[report.status]) acc[report.status] = [];
      acc[report.status].push(report);
      return acc;
    },
    {}
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={64} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white p-4 rounded-xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row justify-between md:items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Report Management</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-blue-50 rounded-[6px] shadow-sm border border-blue-200 p-4">
            <p className="text-sm text-blue-800 mb-1">Total Reports</p>
            <p className="text-2xl font-bold text-blue-900">{totalItems}</p>
          </div>
          <div className="bg-blue-50 rounded-[6px] shadow-sm border border-blue-200 p-4">
            <p className="text-sm text-blue-800 mb-1">Pending</p>
            <p className="text-2xl font-bold text-blue-900">
              {reportsByStatus?.pending?.length || 0}
            </p>
          </div>
          <div className="bg-blue-50 rounded-[6px] shadow-sm border border-blue-200 p-4">
            <p className="text-sm text-blue-800 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-900">
              {reportsByStatus?.["in-progress"]?.length || 0}
            </p>
          </div>
          <div className="bg-blue-50 rounded-[6px] shadow-sm border border-blue-200 p-4">
            <p className="text-sm text-blue-800 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-blue-900">
              {reportsByStatus?.resolved?.length || 0}
            </p>
          </div>
        </div>

        {/* View Report Modal */}
        {isViewModalOpen && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Report Details
                </h2>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedReport(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[selectedReport.status]
                      }`}
                  >
                    {selectedReport.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    ID: {selectedReport._id.slice(-6)}
                  </span>
                </div>

                {/* User Info */}
                <div className="bg-gray-50 rounded-[12px] p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    User Information
                  </h3>
                  <p className="text-gray-900 font-medium">
                    {selectedReport.userId?.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {selectedReport.userId?.email}
                  </p>
                </div>

                {/* Delivery Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Delivery ID
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {selectedReport.deliveryId}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Delivery Type
                    </h3>
                    <p className="text-gray-900 font-medium capitalize">
                      {selectedReport.deliveryType}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Description
                  </h3>
                  <div className="bg-gray-50 rounded-[12px] p-4 border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedReport.description}
                    </p>
                  </div>
                </div>

                {/* Images */}
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Attached Images ({selectedReport.images.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedReport.images.map((image, index) => (
                        <a
                          key={index}
                          href={image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={image}
                            alt={`Report image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {selectedReport.adminNote && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Admin Note
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-gray-900">
                        {selectedReport.adminNote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resolution Note */}
                {selectedReport.resolvedNote && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Resolution Note
                    </h3>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-gray-900">
                        {selectedReport.resolvedNote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resolved By */}
                {selectedReport.resolvedBy && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Resolved By
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {selectedReport.resolvedBy.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedReport.resolvedBy.email}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {selectedReport.resolvedAt &&
                        format(new Date(selectedReport.resolvedAt), "PPP p")}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Created At
                    </h4>
                    <p className="text-sm text-gray-900">
                      {format(new Date(selectedReport.createdAt), "PPP p")}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Last Updated
                    </h4>
                    <p className="text-sm text-gray-900">
                      {format(new Date(selectedReport.updatedAt), "PPP p")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleStatusUpdate(selectedReport);
                    }}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                    }}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition bg-white font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {isStatusModalOpen && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-xl">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Update Report Status
                </h2>
                <button
                  onClick={() => {
                    setIsStatusModalOpen(false);
                    setSelectedReport(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={handleStatusSubmit}
                className="p-4 sm:p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={statusForm.status}
                    onChange={(e) =>
                      setStatusForm({ ...statusForm, status: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Admin Note
                  </label>
                  <textarea
                    value={statusForm.adminNote}
                    onChange={(e) =>
                      setStatusForm({
                        ...statusForm,
                        adminNote: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    placeholder="Add internal note (visible to admin only)"
                  />
                </div>

                {(statusForm.status === "resolved" ||
                  statusForm.status === "rejected") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Resolution Note <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={statusForm.resolvedNote}
                        onChange={(e) =>
                          setStatusForm({
                            ...statusForm,
                            resolvedNote: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        placeholder="Explain how this issue was resolved or why it was rejected"
                        required={
                          statusForm.status === "resolved" ||
                          statusForm.status === "rejected"
                        }
                      />
                    </div>
                  )}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStatusModalOpen(false);
                      setSelectedReport(null);
                    }}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition bg-white font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && reportToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600">
                  Are you sure you want to delete this report? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition bg-white font-medium w-full"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports Table with Borders and Pagination */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {/* Added S/N column */}
                  <th className="border px-2 py-2 text-left">S/N</th>
                  <th className="border px-2 py-2 text-left">Status</th>
                  <th className="border px-2 py-2 text-left">User</th>
                  <th className="border px-2 py-2 text-left">Delivery ID</th>
                  <th className="border px-2 py-2 text-left">Description</th>
                  <th className="border px-2 py-2 text-left">Images</th>
                  <th className="border px-2 py-2 text-left">Created</th>
                  <th className="border px-2 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentReports.map((report: ReportItem, index: number) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    {/* Serial Number */}
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap border border-gray-200">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap border border-gray-200">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${statusColors[report.status]
                          }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap border border-gray-200">
                      <div className="text-sm font-medium text-gray-900">
                        {report.userId?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {report.userId?.email}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap border border-gray-200">
                      <div className="text-sm text-gray-900">
                        {report.deliveryId}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {report.deliveryType}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 border border-gray-200">
                      <div
                        className="text-sm text-gray-500 max-w-xs truncate cursor-pointer hover:text-blue-600"
                        onClick={() => handleView(report)}
                      >
                        {report.description}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap border border-gray-200">
                      {report.images && report.images.length > 0 ? (
                        <span className="text-sm text-blue-600">
                          {report.images.length} image(s)
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">No images</span>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap border border-gray-200">
                      <div className="text-sm text-gray-900">
                        {format(new Date(report.createdAt), "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(report.createdAt), "hh:mm a")}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium border border-gray-200">
                      <div className="flex flex-row items-center">
                        <button
                          onClick={() => handleView(report)}
                          className="text-blue-600 hover:text-blue-900 mr-3 transition"
                        >
                          <EyeIcon className="w-5 h-5 inline" />
                        </button>
                        {report.userId &&
                          <button
                            onClick={() => handleStatusUpdate(report)}
                            className="text-blue-600 hover:text-blue-900 mr-3 transition"
                          >
                            <CirclePowerIcon className="w-5 h-5 inline" />
                          </button>
                        }
                        <button
                          onClick={() => handleDeleteClick(report)}
                          className="text-red-600 hover:text-red-900 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentReports.length === 0 && (
                  <tr>
                    <td
                      colSpan={8} // Updated from 7 to 8 because we added S/N column
                      className="px-6 py-8 text-center text-gray-500 border border-gray-200"
                    >
                      No reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border rounded-full px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm"
                >
                  Previous
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 border rounded-full text-sm ${currentPage === page
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm"
                >
                  Next
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} entries
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}