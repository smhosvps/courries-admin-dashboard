import { api } from "@/redux/api/apiSlice";


export const newsletterApi = api.injectEndpoints({
    endpoints: (builder) => ({
        addNewsletter: builder.mutation({
            query: ({email}) => ({
                url: 'subscribe',
                method: 'POST',
                body: {email}
            }),

        })
    })
})

export const {
    useAddNewsletterMutation,
} = newsletterApi



