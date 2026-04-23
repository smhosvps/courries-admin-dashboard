import { api } from "@/redux/api/apiSlice";

export const countryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => 'get-countries',
    }),
    getCountryById: builder.query({
      query: (id) => `get-country/${id}`,
    }),
    addCountry: builder.mutation({
      query: (country) => ({
        url: 'create-country',
        method: 'POST',
        body: country,
      }),
    }),
    updateCountry: builder.mutation({
      query: ({ id, ...country }) => ({
        url: `update-country/${id}`,
        method: 'PUT',
        body: country,
      }),
    }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `delete-country/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetCountryByIdQuery,
  useAddCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} = countryApi;