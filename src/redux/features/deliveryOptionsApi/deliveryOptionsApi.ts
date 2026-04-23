import { api } from "@/redux/api/apiSlice";

export const deliveryOptionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryOptions: builder.query({
      query: () => 'get-all-delivery-option',
    }),
    addDeliveryOption: builder.mutation({
      query: (option) => ({
        url: 'create-delivery-option',
        method: 'POST',
        body: option,
      }),
    }),
    updateDeliveryOption: builder.mutation({
      query: ({ id, option }) => ({
        url: `edit-delivery-option/${id}`,
        method: 'PUT',
        body: option,
      }),
    }),
    deleteDeliveryOption: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `delete-delivery-option/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetDeliveryOptionsQuery,
  useAddDeliveryOptionMutation,
  useUpdateDeliveryOptionMutation,
  useDeleteDeliveryOptionMutation,
} = deliveryOptionsApi;