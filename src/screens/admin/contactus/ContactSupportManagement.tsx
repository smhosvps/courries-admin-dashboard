/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useAddPhoneNumberMutation,
  useCreateContactSupportMutation,
  useGetContactSupportAdminQuery,
  useRemovePhoneNumberMutation,
  useToggleContactStatusMutation,
  useTogglePhoneStatusMutation,
  useUpdateContactSupportMutation,
} from "@/redux/features/contactusApi/contactSupportApi";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface PhoneNumber {
  _id?: string;
  number: string;
  label: string;
  isActive: boolean;
}

interface FormData {
  email: string;
  description: string;
  phoneNumbers: PhoneNumber[];
}


export default function ContactSupportManagement() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    description: "",
    phoneNumbers: [{ number: "", label: "Support", isActive: true }],
  });
  const [newPhoneNumber, setNewPhoneNumber] = useState({
    number: "",
    label: "Support",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPhone, setShowAddPhone] = useState(false);

  // RTK Query hooks
  const { data, isLoading, refetch } =
    useGetContactSupportAdminQuery(undefined, {
      skip: false,
    });
  const [createContact, { isLoading: isCreating }] =
    useCreateContactSupportMutation();
  const [updateContact, { isLoading: isUpdating }] =
    useUpdateContactSupportMutation();
  const [toggleStatus] = useToggleContactStatusMutation();
  const [togglePhone] = useTogglePhoneStatusMutation();
  const [addPhone] = useAddPhoneNumberMutation();
  const [removePhone] = useRemovePhoneNumberMutation();

  // Load existing data
  useEffect(() => {
    if (data?.contact) {
      setFormData({
        email: data.contact.email,
        description: data.contact.description,
        phoneNumbers: data.contact.phoneNumbers,
      });
    }
  }, [data]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle phone number change in form
  const handlePhoneChange = (
    index: number,
    field: keyof PhoneNumber,
    value: string | boolean
  ) => {
    const updatedPhones = [...formData.phoneNumbers];
    updatedPhones[index] = { ...updatedPhones[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: updatedPhones,
    }));
  };

  // Add phone field in form
  const addPhoneField = () => {
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: [
        ...prev.phoneNumbers,
        { number: "", label: "Support", isActive: true },
      ],
    }));
  };

  // Remove phone field from form
  const removePhoneField = (index: number) => {
    if (formData.phoneNumbers.length > 1) {
      setFormData((prev) => ({
        ...prev,
        phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index),
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (data?.contact) {
        // Update existing
        await updateContact({
          id: data.contact._id,
          data: formData,
        }).unwrap();
        toast.success("Contact support information updated successfully!");
      } else {
        // Create new
        await createContact(formData).unwrap();
        toast.success("Contact support information created successfully!");
      }
      await refetch();
      setIsEditing(false);
    } catch (err: any) {
      toast.error(data?.contact ? "Failed to update" : "Failed to create");
      console.error("Error:", err);
    }
  };

  // Handle toggle contact status
  const handleToggleStatus = async () => {
    if (!data?.contact) return;
    try {
      await toggleStatus(data.contact._id).unwrap();
      toast.success(
        `Contact support ${
          data.contact.isActive ? "deactivated" : "activated"
        } successfully!`
      );
      await refetch();
    } catch (err: any) {
      console.log(err)
      toast.error("Failed to toggle status");
    }
  };

  // Handle toggle phone status
  const handleTogglePhone = async (phoneId: string) => {
    if (!data?.contact) return;
    try {
      await togglePhone({ contactId: data.contact._id, phoneId }).unwrap();
      toast.success("Phone status updated successfully!");
      await refetch();
    } catch (err: any) {
         console.log(err)
      toast.error("Failed to toggle phone status");
    }
  };

  // Handle add new phone number
  const handleAddPhone = async () => {
    if (!data?.contact || !newPhoneNumber.number) return;
    try {
      await addPhone({
        id: data.contact._id,
        data: newPhoneNumber,
      }).unwrap();
      toast.success("Phone number added successfully!");
      setNewPhoneNumber({ number: "", label: "Support" });
      setShowAddPhone(false);
      await refetch();
    } catch (err) {
      console.log(err)
      toast.error("Failed to add phone number");
    }
  };

  // Handle remove phone number
  const handleRemovePhone = async (phoneId: string) => {
    if (
      !data?.contact ||
      !window.confirm("Are you sure you want to remove this phone number?")
    )
      return;
    try {
      await removePhone({ contactId: data.contact._id, phoneId }).unwrap();
      toast.success("Phone number removed successfully!");
      await refetch();
    } catch (err: any) {
         console.log(err)
      toast.error("Failed to remove phone number");
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


  return (
    <div className="min-h-screen">
      <div className="px-0 md:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row justify-between md:items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              Contact Support Management
            </h1>
          </div>
          {data?.contact && (
            <button
              onClick={handleToggleStatus}
              className={`w-full md:w-auto font-semibold py-2.5 sm:py-2 px-4 sm:px-5 rounded-full shadow transition ${
                data.contact.isActive
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {data.contact.isActive
                ? "Deactivate Contact"
                : "Activate Contact"}
            </button>
          )}
        </div>

        {/* Last updated */}
        <div className="text-xs text-gray-500 mb-4 text-right">
          Last updated: {new Date().toLocaleTimeString()}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Edit Form - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[16px] border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {data?.contact
                    ? "Edit Contact Information"
                    : "Create Contact Information"}
                </h2>
                {data?.contact && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                )}
              </div>

              {isEditing || !data?.contact ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="support@example.com"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe how users can contact support..."
                      required
                    />
                  </div>

                  {/* Phone Numbers */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Numbers *
                      </label>
                      <button
                        type="button"
                        onClick={addPhoneField}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        + Add Another
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.phoneNumbers.map((phone, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={phone.number}
                              onChange={(e) =>
                                handlePhoneChange(
                                  index,
                                  "number",
                                  e.target.value
                                )
                              }
                              className="px-4 py-2.5 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Phone number"
                              required
                            />
                            <input
                              type="text"
                              value={phone.label}
                              onChange={(e) =>
                                handlePhoneChange(
                                  index,
                                  "label",
                                  e.target.value
                                )
                              }
                              className="px-4 py-2.5 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Label (e.g., Support, Sales)"
                            />
                          </div>
                          {formData.phoneNumbers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePhoneField(index)}
                              className="p-2.5 text-red-600 hover:bg-red-50 rounded-full transition"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isCreating || isUpdating}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                    >
                      {isCreating || isUpdating
                        ? "Saving..."
                        : data?.contact
                        ? "Update Information"
                        : "Create Information"}
                    </button>
                  </div>
                </form>
              ) : (
                // View Mode
                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Support Email
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{data?.contact?.email}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Description
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">
                        {data?.contact?.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Phone Numbers List - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[12px] border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Phone Numbers
                </h2>
                <button
                  onClick={() => setShowAddPhone(!showAddPhone)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add
                </button>
              </div>

              {/* Add Phone Form */}
              {showAddPhone && (
                <div className="mb-4 p-4 bg-gray-50 rounded-[12px] border border-gray-200">
                  <input
                    type="text"
                    value={newPhoneNumber.number}
                    onChange={(e) =>
                      setNewPhoneNumber({
                        ...newPhoneNumber,
                        number: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-[12px] mb-2 "
                    placeholder="Phone number"
                  />
                  <input
                    type="text"
                    value={newPhoneNumber.label}
                    onChange={(e) =>
                      setNewPhoneNumber({
                        ...newPhoneNumber,
                        label: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-[12px] mb-3"
                    placeholder="Label"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddPhone}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowAddPhone(false)}
                      className="flex-1 border border-gray-300 py-2 rounded-full hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Phone Numbers List */}
              <div className="space-y-3">
                {data?.contact?.phoneNumbers.map((phone) => (
                  <div
                    key={phone._id}
                    className={`p-4 rounded-[12px] border ${
                      phone.isActive
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          phone.isActive
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {phone.label}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            phone._id && handleTogglePhone(phone._id)
                          }
                          className={`p-1 rounded transition ${
                            phone.isActive
                              ? "text-green-600 hover:bg-green-200"
                              : "text-gray-400 hover:bg-gray-200"
                          }`}
                          title={phone.isActive ? "Deactivate" : "Activate"}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            phone._id && handleRemovePhone(phone._id)
                          }
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                          title="Remove"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-900 font-medium mb-1">
                      {phone.number}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {phone.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                ))}

                {(!data?.contact?.phoneNumbers ||
                  data.contact.phoneNumbers.length === 0) && (
                  <p className="text-center text-gray-500 py-4">
                    No phone numbers added yet.
                  </p>
                )}
              </div>
            </div>

            {/* Status Card */}
            {data?.contact && (
              <div className="bg-white rounded-[12px] border border-gray-200 p-6 mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Contact Status
                </h3>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      data.contact.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {data.contact.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Created:{" "}
                    {new Date(data.contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {data.contact.updatedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Last updated:{" "}
                    {new Date(data.contact.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview Card - Matching React Native Screen */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Preview (Mobile View)
          </h2>
          <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex-row items-center mb-4 hidden md:flex">
                <button className="flex flex-row items-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="ml-2 text-gray-700">Back</span>
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Contact Support
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                {data?.contact?.description ||
                  "Stuck on something? Our support team is here to help with delivery issues, payments, or account questions."}
              </p>
            </div>

            <div className="px-4 py-6">
              {/* Email Section */}
              <h3 className="text-gray-900 font-semibold mb-2">
                Send Us an Email
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Prefer email? Share the details of your issue and we'll get back
                to you with a solution.
              </p>
              <div className="flex-row items-center gap-2 py-3 mb-6 flex">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-900 font-semibold">
                  {data?.contact?.email || "Not set"}
                </span>
              </div>

              {/* Phone Section */}
              <h3 className="text-gray-900 font-semibold mb-2">
                Call Our Support Line
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Need to speak to someone directly? Call our support team for
                urgent issues.
              </p>

              {data?.contact?.phoneNumbers
                .filter((p) => p.isActive)
                .map((phone, index) => (
                  <div
                    key={phone._id || index}
                    className="flex-row items-center gap-2 py-3 border-b border-gray-100 mb-3 flex"
                  >
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-gray-900 font-semibold">
                      {phone.number}
                    </span>
                    {phone.label !== "Support" && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({phone.label})
                      </span>
                    )}
                  </div>
                ))}

              {!data?.contact?.phoneNumbers.filter((p) => p.isActive)
                .length && (
                <p className="text-gray-500 text-center py-4">
                  No active phone numbers
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
