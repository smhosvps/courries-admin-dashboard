import { api } from "@/redux/api/apiSlice";

export const marketingApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createMessage: builder.mutation({
            query: (data) => ({
                url: "send-general-email",
                method: "POST",
                body: data,
                credentials: "include" as const
            })
        }),
        getAllMessages: builder.query({
            query: () => ({
                url: "get-messages",
                method: "GET",
                credentials: "include" as const
            })
        }),
        deleteMessages: builder.mutation({
            query: (id) => ({
                url: `delete-message/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),
    })
})

export const {
  useCreateMessageMutation,
  useDeleteMessagesMutation,
  useGetAllMessagesQuery
} = marketingApi;