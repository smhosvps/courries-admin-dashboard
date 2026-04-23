import { api } from "@/redux/api/apiSlice";


export const faqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Public: Get all active FAQs
    getFaqs: builder.query({
      query: () => "get-faqs",
    }),

    // Admin: Get all FAQs (including inactive)
    getAllFaqsAdmin: builder.query({
      query: () => "get-admin-all-faqs",
    }),

    // Get single FAQ
    getFaqById: builder.query({
      query: (id) => `get-faq/${id}`,
    }),

    // Create FAQ
    createFaq: builder.mutation({
      query: (newFaq) => ({
        url: "create-faq",
        method: "POST",
        body: newFaq,
      }),
    }),

    // Update FAQ
    updateFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-faq/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Delete FAQ
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `delete-faq/${id}`,
        method: "DELETE",
      }),
    }),

    // Toggle FAQ status
    toggleFaqStatus: builder.mutation({
      query: (id) => ({
        url: `toggle-faq/${id}`,
        method: "PATCH",
      }),
    }),

    // Reorder FAQs
    reorderFaqs: builder.mutation({
      query: (data) => ({
        url: "reorder-faqs",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useGetAllFaqsAdminQuery,
  useGetFaqByIdQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useToggleFaqStatusMutation,
  useReorderFaqsMutation,
} = faqApi;
