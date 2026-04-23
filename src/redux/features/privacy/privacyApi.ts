import { api } from "@/redux/api/apiSlice";

export const privacyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPrivacy: builder.query({
      query: () => 'get-admin-all-privacy',
    }),
    getPrivacyById: builder.query({
      query: (id) => `get-privacy/${id}`,
    }),
    createPrivacy: builder.mutation({
      query: (newPrivacy) => ({
        url: 'create-privacy',
        method: 'POST',
        body: newPrivacy,
      }),
    }),
    updatePrivacy: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `update-privacy/${id}`,
        method: 'PUT',
        body: patch,
      }),
    }),
    deletePrivacy: builder.mutation({
      query: (id) => ({
        url: `delete-privacy/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllPrivacyQuery,
  useGetPrivacyByIdQuery,
  useCreatePrivacyMutation,
  useUpdatePrivacyMutation,
  useDeletePrivacyMutation,
} = privacyApi;