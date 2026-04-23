import { api } from "../../api/apiSlice";

export const withdrawalApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin-get-all (admin)
    getWithdrawals: builder.query({
      query: (params) => ({
        url: 'admin-get-all',
        params,
      }),
    }),
    // PATCH /admin-process-withdraw/:id
    processWithdrawal: builder.mutation({
      query: ({ id, body, adminId }) => ({
        url: `admin-process-withdraw/${id}/userid/${adminId}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useGetWithdrawalsQuery,
  useProcessWithdrawalMutation,
} = withdrawalApi;