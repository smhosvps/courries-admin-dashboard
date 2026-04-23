import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetAllFaqsAdminQuery,
  useToggleFaqStatusMutation,
  useUpdateFaqMutation,
} from "@/redux/features/fag/faqApi";
import { Edit2, Eye, Loader, PlusIcon, Trash2, X } from "lucide-react";

// Type definitions
interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: "general" | "account" | "billing" | "technical" | "support";
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "account", label: "Account" },
  { value: "billing", label: "Billing" },
  { value: "technical", label: "Technical" },
  { value: "support", label: "Support" },
];

const categoryColors: Record<string, string> = {
  general: "bg-gray-100 text-gray-800",
  account: "bg-blue-100 text-blue-800",
  billing: "bg-green-100 text-green-800",
  technical: "bg-purple-100 text-purple-800",
  support: "bg-yellow-100 text-yellow-800",
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
};

export default function FaqManagement() {
  // State
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [viewingItem, setViewingItem] = useState<FaqItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    question: "",
    answer: "",
    category: "general",
    order: 0,
    isActive: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // RTK Query hooks
  const { data, isLoading, isError, error, refetch } = useGetAllFaqsAdminQuery(
    {}
  );
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();
  const [toggleStatus, { isLoading: isToggling }] =
    useToggleFaqStatusMutation();

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleQuillChange = (value: string) => {
    setFormData((prev) => ({ ...prev, answer: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateFaq({ id: editingItem._id, data: formData }).unwrap();
        toast.success("FAQ updated successfully!");
      } else {
        await createFaq(formData).unwrap();
        toast.success("FAQ created successfully!");
      }
      await refetch();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(
        editingItem ? "Failed to update FAQ" : "Failed to create FAQ"
      );
      console.error(err);
    }
  };

  const handleView = (item: FaqItem) => {
    setViewingItem(item);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item: FaqItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
      order: item.order,
      isActive: item.isActive,
    });
    setIsModalOpen(true);
  };

  // Delete modal handlers
  const handleDeleteClick = (item: FaqItem) => {
    setFaqToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!faqToDelete) return;
    try {
      await deleteFaq(faqToDelete._id).unwrap();
      toast.success("FAQ deleted successfully!");
      setDeleteModalOpen(false);
      setFaqToDelete(null);
      await refetch();
    } catch (err) {
      toast.error("Failed to delete FAQ");
      console.error(err);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setFaqToDelete(null);
  };

  // Toggle status using switch (like coupon list)
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success(
        `FAQ ${currentStatus ? "deactivated" : "activated"} successfully!`
      );
      await refetch();
    } catch (err) {
      toast.error("Failed to toggle status");
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      question: "",
      answer: "",
      category: "general",
      order: 0,
      isActive: true,
    });
  };

  const handleCreateNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const stripHtmlTags = (html: string): string => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Pagination calculations
  const allFaqs = data?.faqs || [];
  const totalItems = allFaqs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFaqs = allFaqs.slice(startIndex, endIndex);

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
    const apiError = error as ApiError;
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center text-red-600 p-4">
          Error:{" "}
          {apiError?.data?.message ||
            apiError?.message ||
            "Failed to load FAQs"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">FAQ Management</h1>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> Create New FAQ
          </button>
        </div>

        {/* Desktop Table with Borders & Pagination */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-2 py-2 text-left">
                  S/N
                </th>
                <th className="border px-2 py-2 text-left">
                  Category
                </th>
                <th className="border px-2 py-2 text-left">
                  Question
                </th>
                <th className="border px-2 py-2 text-left">
                  Answer
                </th>
                <th className="border px-2 py-2 text-left">
                  Order
                </th>
                <th className="border px-2 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentFaqs.map((item: FaqItem, index: number) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap border border-gray-200 text-sm text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap border border-gray-200">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColors[item.category]
                        }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 border border-gray-200">
                    <div
                      className="text-sm text-gray-900 max-w-xs truncate cursor-pointer hover:text-blue-600"
                      onClick={() => handleView(item)}
                    >
                      {item.question}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 border border-gray-200">
                    <div
                      className="text-sm text-gray-500 max-w-xs truncate cursor-pointer hover:text-blue-600"
                      onClick={() => handleView(item)}
                    >
                      {stripHtmlTags(item.answer) || "No answer"}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap border border-gray-200 text-sm">
                    {item.order}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap border border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentFaqs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 border border-gray-200"
                  >
                    No FAQs found. Click "Create New FAQ" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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

        {/* Mobile Card View (pagination included) */}
        <div className="block md:hidden space-y-6">
          {currentFaqs.map((item: FaqItem) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full ${categoryColors[item.category]
                    }`}
                >
                  {item.category}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={item.isActive}
                  onClick={() => handleToggleStatus(item._id, item.isActive)}
                  disabled={isToggling}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.isActive ? "bg-green-600" : "bg-gray-300"
                    } ${isToggling ? "opacity-50 cursor-wait" : "cursor-pointer"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>
              <h3
                className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                onClick={() => handleView(item)}
              >
                {item.question}
              </h3>
              <p
                className="text-sm text-gray-600 mb-2 line-clamp-2"
                onClick={() => handleView(item)}
              >
                {stripHtmlTags(item.answer) || "No answer"}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Order: {item.order}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleView(item)}
                    className="text-blue-600"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {currentFaqs.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                No FAQs found. Click "Create New FAQ" to add one.
              </p>
            </div>
          )}

          {/* Pagination for mobile */}
          {totalItems > 0 && (
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border rounded-full px-2 py-1 text-sm"
                >
                  <option>5</option>
                  <option>10</option>
                  <option>20</option>
                </select>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-full text-sm"
                >
                  Previous
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 border rounded-full text-sm ${currentPage === page ? "bg-blue-600 text-white" : ""
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-full text-sm"
                >
                  Next
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems}
              </div>
            </div>
          )}
        </div>

        {/* Create/Edit Modal (unchanged except using react-quill-new) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editingItem ? "Edit FAQ" : "Create New FAQ"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border rounded-[12px] px-4 py-2.5"
                    required
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Question
                  </label>
                  <input
                    type="text"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    className="w-full border rounded-[12px] px-4 py-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Answer
                  </label>
                  <div className="border rounded-[12px] overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={formData.answer}
                      onChange={handleQuillChange}
                      modules={modules}
                      placeholder="Enter answer"
                      className="h-48 mb-12"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full border rounded-[12px] px-4 py-2.5"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded"
                      />
                      Active
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border rounded-full w-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full disabled:opacity-50 w-full"
                  >
                    {isCreating || isUpdating
                      ? "Saving..."
                      : editingItem
                        ? "Update FAQ"
                        : "Create FAQ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal (unchanged) */}
        {isViewModalOpen && viewingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">FAQ Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${viewingItem.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {viewingItem.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-sm text-gray-500">
                    Order: {viewingItem.order}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Category
                  </h3>
                  <span
                    className={`px-3 py-1.5 text-sm font-semibold rounded-full inline-block ${categoryColors[viewingItem.category]
                      }`}
                  >
                    {viewingItem.category.charAt(0).toUpperCase() +
                      viewingItem.category.slice(1)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Question
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-[12px] border">
                    <p className="text-gray-900">{viewingItem.question}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Answer
                  </h3>
                  <div
                    className="p-4 bg-gray-50 rounded-[12px] border prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: viewingItem.answer }}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleEdit(viewingItem);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full w-full"
                  >
                    Edit FAQ
                  </button>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-6 py-2 border rounded-full w-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && faqToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="border-b px-6 py-4">
                <h2 className="text-xl font-bold">Confirm Delete</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600">
                  Are you sure you want to delete the FAQ "
                  <strong>{faqToDelete.question}</strong>"? This action cannot
                  be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border rounded-full w-full"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-full disabled:opacity-50 w-full"
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
