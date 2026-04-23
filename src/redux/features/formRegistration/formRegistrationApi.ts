import { api } from "@/redux/api/apiSlice";

export const registrationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRegistration: builder.mutation({
      query: (formData) => ({
        url: '/registration-form',
        method: 'POST',
        body: formData,
      }), 
    }),
    getRegistrations: builder.query({
      query: () => '/get-all-form-records',
    }),
    deleteRegistration: builder.mutation({
      query: (id) => ({
        url: `/delete-all-form-record/${id}`,
        method: 'DELETE',
      }),
    }),
    getRegistrationById: builder.query({
      query: (id) => `get-detail-form-record/${id}`,
    }),
  }),
});

export const {
  useCreateRegistrationMutation,
  useGetRegistrationsQuery,
  useDeleteRegistrationMutation,
  useGetRegistrationByIdQuery
} = registrationApi;