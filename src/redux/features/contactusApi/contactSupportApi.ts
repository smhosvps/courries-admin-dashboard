import { api } from "@/redux/api/apiSlice";

export interface PhoneNumber {
  _id?: string;
  number: string;
  label: string;
  isActive: boolean;
}

export interface ContactSupportItem {
  _id: string;
  email: string;
  phoneNumbers: PhoneNumber[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContactFormData {
  email: string;
  phoneNumbers: Omit<PhoneNumber, "_id">[];
  description: string;
  isActive?: boolean;
}

interface ContactResponse {
  success: boolean;
  message: string;
  contact: ContactSupportItem;
}

export const contactSupportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public: Get active contact info
    getContactSupport: builder.query<ContactResponse, void>({
      query: () => "get-contact",
    }),

    // Admin: Get full contact info
    getContactSupportAdmin: builder.query<ContactResponse, void>({
      query: () => "get-admin-contact",
    }),

    // Create contact info
    createContactSupport: builder.mutation<ContactResponse, ContactFormData>({
      query: (data) => ({
        url: "create-contact",
        method: "POST",
        body: data,
      }),
    }),

    // Update contact info
    updateContactSupport: builder.mutation<
      ContactResponse,
      { id: string; data: Partial<ContactFormData> }
    >({
      query: ({ id, data }) => ({
        url: `update-contact/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Toggle contact status
    toggleContactStatus: builder.mutation<ContactResponse, string>({
      query: (id) => ({
        url: `toggle-status/${id}`,
        method: "PUT",
      }),
    }),

    // Toggle phone status
    togglePhoneStatus: builder.mutation<
      ContactResponse,
      { contactId: string; phoneId: string }
    >({
      query: ({ contactId, phoneId }) => ({
        url: `toggle-phone/${contactId}/${phoneId}`,
        method: "PUT",
      }),
    }),

    // Add phone number
    addPhoneNumber: builder.mutation<
      ContactResponse,
      { id: string; data: { number: string; label: string } }
    >({
      query: ({ id, data }) => ({
        url: `add-phone/${id}`,
        method: "POST",
        body: data,
      }),
    }),

    // Remove phone number
    removePhoneNumber: builder.mutation<
      ContactResponse,
      { contactId: string; phoneId: string }
    >({
      query: ({ contactId, phoneId }) => ({
        url: `remove-phone/${contactId}/${phoneId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetContactSupportQuery,
  useGetContactSupportAdminQuery,
  useCreateContactSupportMutation,
  useUpdateContactSupportMutation,
  useToggleContactStatusMutation,
  useTogglePhoneStatusMutation,
  useAddPhoneNumberMutation,
  useRemovePhoneNumberMutation,
} = contactSupportApi;