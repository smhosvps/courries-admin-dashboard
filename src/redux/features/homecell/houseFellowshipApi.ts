import { api } from "@/redux/api/apiSlice";


export const homecellApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createGuide: builder.mutation({
            query: ({ title, category, detail, date, url }) => ({
                url: "create-manual",
                method: "POST",
                body: { title, detail, date, url, category },
                credentials: "include" as const
            })
        }),
        getGuide: builder.query({
            query: () => ({
                url: "get-guide",
                method: "GET",
                credentials: "include" as const
            })
        }),
        editGuide: builder.mutation({
            query: ({ idx, data }) => ({
                url: `update-manual/${idx}`,
                method: "PUT",
                body: data,
                credentials: "include" as const
            })
        }),

    })
})

export const {
    useCreateGuideMutation,
    useEditGuideMutation,
    useGetGuideQuery
} = homecellApi;