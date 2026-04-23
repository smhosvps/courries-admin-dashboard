/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useCreatePrivacyMutation,
  useDeletePrivacyMutation,
  useGetAllPrivacyQuery,
  useUpdatePrivacyMutation,
} from "@/redux/features/privacy/privacyApi";
import { useState } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new"; // ✅ Use react-quill-new instead
import "react-quill-new/dist/quill.snow.css";
import { Edit2, PlusIcon, Trash2 } from "lucide-react";

// Type definitions
interface PrivacyItem {
  _id: string;
  title: string;
  detail: string;
  type: "privacy" | "terms of use";
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  detail: string;
  type: "privacy" | "terms of use";
}

// Quill modules – same as FAQ component
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

export default function PublicPrivacy() {
  const [editingItem, setEditingItem] = useState<PrivacyItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    detail: "",
    type: "privacy",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PrivacyItem | null>(null);

  // RTK Query hooks
  const { data, isLoading, refetch } = useGetAllPrivacyQuery({});
  const [createPrivacy, { isLoading: isCreating }] = useCreatePrivacyMutation();
  const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyMutation();
  const [deletePrivacy, { isLoading: isDeleting }] = useDeletePrivacyMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (value: string) => {
    setFormData((prev) => ({ ...prev, detail: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updatePrivacy({ id: editingItem._id, ...formData }).unwrap();
        toast.success("Term updated successfully!");
      } else {
        await createPrivacy(formData).unwrap();
        toast.success("Term created successfully!");
      }
      await refetch();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(editingItem ? "Failed to update term" : "Failed to create term");
      console.error(err);
    }
  };

  const handleEdit = (item: PrivacyItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      detail: item.detail,
      type: item.type,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: PrivacyItem) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deletePrivacy(itemToDelete._id).unwrap();
      toast.success("Term deleted successfully!");
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await refetch();
    } catch (err) {
      toast.error("Failed to delete term");
      console.error(err);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      detail: "",
      type: "privacy",
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Privacy & Terms Management</h1>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> Create New
          </button>
        </div>

        {/* Create/Edit Modal - using react-quill-new */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingItem ? "Edit Term" : "Create New Term"}</h2>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border rounded-[12px] px-4 py-2.5" required>
                    <option value="privacy">Privacy Policy</option>
                    <option value="terms of use">Terms of Use</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full border rounded-[12px] px-4 py-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Detail</label>
                  <div className="border rounded-[12px] overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={formData.detail}
                      onChange={handleQuillChange}
                      modules={modules}
                      placeholder="Enter details"
                      className="h-48 mb-12"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-6 py-2 border rounded-full w-full">Cancel</button>
                  <button type="submit" disabled={isCreating || isUpdating} className="px-6 py-2 bg-blue-600 text-white rounded-full disabled:opacity-50 w-full">
                    {isCreating || isUpdating ? "Saving..." : editingItem ? "Update Term" : "Create Term"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && itemToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="border-b px-6 py-4">
                <h2 className="text-xl font-bold">Confirm Delete</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600">Are you sure you want to delete the term "<strong>{itemToDelete.title}</strong>"? This action cannot be undone.</p>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <button onClick={cancelDelete} className="px-4 py-2 border rounded-full" disabled={isDeleting}>Cancel</button>
                <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-full disabled:opacity-50">
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {data?.privacy?.map((item: any) => (
            <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${item.type === "privacy" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                  {item.type === "privacy" ? "Privacy Policy" : "Terms of Use"}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="text-indigo-600">Edit</button>
                  <button onClick={() => handleDeleteClick(item)} className="text-red-600">Delete</button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{stripHtmlTags(item.detail) || "No content"}</p>
              <div className="text-xs text-gray-500 mt-2">{new Date(item.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
          {data?.privacy?.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">No terms found. Click "Create New" to add one.</div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {/* Added S/N column */}
                  <th className="border px-2 py-2 text-left">S/N</th>
                  <th className="border px-2 py-2 text-left">Type</th>
                  <th className="border px-2 py-2 text-left">Title</th>
                  <th className="border px-2 py-2 text-left">Detail</th>
                  <th className="border px-2 py-2 text-left">Created</th>
                  <th className="border px-2 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.privacy?.map((item: any, index: number) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    {/* Serial Number */}
                    <td className="border px-4 lg:px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="border px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${item.type === "privacy" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                        {item.type === "privacy" ? "Privacy" : "Terms"}
                      </span>
                    </td>
                    <td className="border px-4 lg:px-6 py-4">{item.title}</td>
                    <td className="border px-4 lg:px-6 py-4 max-w-xs truncate">{stripHtmlTags(item.detail) || "No content"}</td>
                    <td className="border px-4 lg:px-6 py-4 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="border px-4 lg:px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(item)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {data?.privacy?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No terms found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}