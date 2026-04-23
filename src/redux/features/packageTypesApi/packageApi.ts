import { api } from "@/redux/api/apiSlice";

export const packageTypesApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // Admin endpoints
    getPackageTypesAdmin: builder.query({
      query: () => 'package-get-admin',
    }),

    getPackageType: builder.query({
      query: (id) => `package-get/${id}`,
    }),

    createPackageType: builder.mutation({
      query: (data) => ({
        url: 'package-create',
        method: 'POST',
        body: data,
      }),
    }),

    updatePackageType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `package-update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    deletePackageType: builder.mutation({
      query: (id) => ({
        url: `package-delete/${id}`,
        method: 'DELETE',
      }),
    }),

    seedDefaultPackageTypes: builder.mutation({
      query: () => ({
        url: 'seed/default',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetPackageTypesAdminQuery,
  useGetPackageTypeQuery,
  useCreatePackageTypeMutation,
  useUpdatePackageTypeMutation,
  useDeletePackageTypeMutation,
  useSeedDefaultPackageTypesMutation,
} = packageTypesApi;