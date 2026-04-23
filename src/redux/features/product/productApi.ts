import { api } from "@/redux/api/apiSlice";

export const productApi =api.injectEndpoints({
    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (productPayload) => ({
                url: "create-product",
                method: "POST",
                body: productPayload,
                credentials: "include" as const
            })
        }),
        getAllProduct: builder.query({
            query: () => ({
                url: "all-product",
                method: "GET",
                credentials: "include" as const
            })
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `delete-product/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),
        editProductX: builder.mutation({
            query: ({ id, productPayload}) => ({
                url: `update-product/${id}`,
                method: "PUT",
                body: productPayload,
                credentials: "include" as const
            })
        }),
    })
})

export const {
useCreateProductMutation,
useGetAllProductQuery,
useDeleteProductMutation,
useEditProductXMutation
} = productApi;