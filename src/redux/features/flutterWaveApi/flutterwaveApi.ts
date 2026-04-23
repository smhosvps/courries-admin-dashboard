import { api } from "@/redux/api/apiSlice";

export const flutterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFlutterKey: builder.query({
      query: () => "get-key",
    }),
    createFlutterKey: builder.mutation({
      query: (body) => ({
        url: "create-fluter-key",
        method: "POST",
        body,
      }),
    }),
    updateFlutterKey: builder.mutation({
      query: (body) => ({
        url: 'update-fluter-key',
        method: "PUT",
        body,
      }),
    }),
    
  }),         
});

export const { useCreateFlutterKeyMutation, useGetFlutterKeyQuery, useUpdateFlutterKeyMutation } =
  flutterApi;
