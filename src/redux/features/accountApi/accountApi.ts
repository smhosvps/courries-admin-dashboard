import { api } from "@/redux/api/apiSlice";

export const accountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query({
      query: () => 'get-accounts',
    }),
    getAccount: builder.query({
      query: (id) => `get-account/${id}`,
    }),
    createAccount: builder.mutation({
      query: (body) => ({
        url: 'create-account',
        method: 'POST',
        body
      }),
    }),
    updateAccount: builder.mutation({
      query: ({ id, changes }) => ({
        url: `edit-account/${id}`,
        method: 'PUT',
        body: changes
      }),
    }),
    deleteAccount: builder.mutation({
      query: (id) => ({
        url: `delete-account/${id}`,
        method: 'DELETE'
      }),
    })
  })
});

export const {
  useGetAccountsQuery,
  useGetAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation
} = accountApi;