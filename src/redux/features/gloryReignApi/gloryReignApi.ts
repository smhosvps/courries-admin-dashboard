import { api } from "@/redux/api/apiSlice";


export const gloryReignApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitForm: builder.mutation({
      query: (formData) => ({
        url: 'submit-g-form',
        method: 'POST',
        body: formData,
      }),
    }),
    
    getAllForms: builder.query({
      query: () => 'all-g-form',
    }),
    
    getFormById: builder.query({
      query: (id) => `single-g-form/${id}`,
    }),
    
    updateFormStatus: builder.mutation({
      query: ({ id, status, remark }) => ({
        url: `edit-g-form/${id}/status`,
        method: 'PUT',
        body: { status, remark },
      }),
    }),
  }),
});

export const {
  useSubmitFormMutation,
  useGetAllFormsQuery,
  useGetFormByIdQuery,
  useUpdateFormStatusMutation,
} = gloryReignApi;
