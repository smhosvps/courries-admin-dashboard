import { api } from "@/redux/api/apiSlice";


export const transfersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET all transactions
    getTransactions: builder.query({
      query: () => 'get-all-transactions',
    }),
    // POST initiate a transfer (admin only)
    initiateTransfer: builder.mutation({
      query: (body) => ({
        url: 'create-payment',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetTransactionsQuery, useInitiateTransferMutation } = transfersApi;