import React, { useState, useEffect } from "react";

import {
  Ticket,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Loader,
} from "lucide-react";
import {
  Coupon,
  useDeleteCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
} from "@/redux/features/couponApi/couponApi";

interface CouponListProps {
  onAddClick: () => void;
  onEditClick: (coupon: Coupon) => void;
}

const CouponList: React.FC<CouponListProps> = ({ onAddClick, onEditClick }) => {
  const { data: coupons, isLoading, refetch } = useGetCouponsQuery();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [coupons]);

  const handleDeleteClick = (coupon: Coupon) => {
    setCouponToDelete(coupon);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (couponToDelete) {
      await deleteCoupon(couponToDelete._id);
      refetch();
      setDeleteModalOpen(false);
      setCouponToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCouponToDelete(null);
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    const newStatus = coupon.status === "enable" ? "disable" : "enable";
    setUpdatingStatusId(coupon._id);
    await updateCoupon({ id: coupon._id, status: newStatus });
    setUpdatingStatusId(null);
    refetch();
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


  const totalItems = coupons?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentCoupons = coupons?.slice(start, start + itemsPerPage) || [];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString();

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <Ticket size={18} /> Add Coupon
        </button>
      </div>

      {totalItems === 0 ? (
        <div className="text-center py-8 text-gray-500">No coupons found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2 text-left">S/N</th>
                  <th className="border px-2 py-2 text-left">Start Date</th>
                  <th className="border px-2 py-2 text-left">End Date</th>
                  <th className="border px-2 py-2 text-left">Value Type</th>
                  <th className="border px-2 py-2 text-left">Discount</th>
                  <th className="border px-2 py-2 text-left">City Type</th>
                  <th className="border px-2 py-2 text-left">Cities</th>
                  <th className="border px-2 py-2 text-left">Status</th>
                  <th className="border px-2 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCoupons.map((coupon, idx) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="border px-2 py-2">{start + idx + 1}</td>
                    <td className="border px-2 py-2">
                      {formatDate(coupon.startDate)}
                    </td>
                    <td className="border px-2 py-2">
                      {formatDate(coupon.endDate)}
                    </td>
                    <td className="border px-2 py-2 capitalize">
                      {coupon.valueType}
                    </td>
                    <td className="border px-2 py-2">
                      {coupon.discountAmount}
                      {coupon.valueType === "percentage" ? "%" : ""}
                    </td>
                    <td className="border px-2 py-2 capitalize">
                      {coupon.cityType}
                    </td>
                    <td className="border px-2 py-2">
                      {coupon.cityType === "all"
                        ? "All Cities"
                        : coupon.city
                            .map((c) => (typeof c === "string" ? c : c.name))
                            .join(", ")}
                    </td>
                    <td className="border px-2 py-2">
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        disabled={updatingStatusId === coupon._id}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                          coupon.status === "enable"
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 mt-1 bg-white rounded-full transition-transform ${
                            coupon.status === "enable"
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="border px-2 py-2">
                      <button
                        onClick={() => onEditClick(coupon)}
                        className="text-blue-600 mr-2"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(coupon)}
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
                className="border rounded-full px-2 py-1"
              >
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
            </div>
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
                    className={`px-3 py-1 text-sm border rounded-full ${
                      p === currentPage
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
                className="p-1 border rounded-full"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1 border rounded-full"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="text-sm">
              Showing {start + 1} to{" "}
              {Math.min(start + itemsPerPage, totalItems)} of {totalItems}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && couponToDelete && (
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
              Are you sure you want to delete this coupon? This action cannot be
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

export default CouponList;
