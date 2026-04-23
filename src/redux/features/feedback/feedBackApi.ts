import { api } from "@/redux/api/apiSlice"


export const feedbackApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFeedbacks: builder.query({
            query: () => "get-all-feedback"
        }),
        deleteFeedback: builder.mutation({
            query: (id) => ({
                url: `delete-feedback/${id}`,
                method: "DELETE",
            }),
        }),
    }),
})

export const { useGetFeedbacksQuery, useDeleteFeedbackMutation } = feedbackApi

