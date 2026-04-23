import { api } from "@/redux/api/apiSlice";

export interface Country {
  _id: string;
  name: string;
}

export interface City {
  _id: string;
  name: string;
  geofenced: string;
  country: string | Country; // populated or id
  fixedCharges: number;
  cancelCharges: number;
  minimumDistance: number;
  minimumWeight: number;
  perDistanceCharge: number;
  perWeightCharge: number;
  commissionType: "fixed" | "percentage";
  adminCommission: number;
  status: "enable" | "disable";
  createdAt: string;
  updatedAt: string;
}

export interface CityInput {
  name: string;
  geofenced : [];
  country: string; // country ID
  fixedCharges: number;
  cancelCharges: number;
  minimumDistance: number;
  minimumWeight: number;
  perDistanceCharge: number;
  perWeightCharge: number;
  commissionType: "fixed" | "percentage";
  adminCommission: number;
  status: "enable" | "disable";
}

export const cityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => "get-cities",
    }),
    getCityById: builder.query<City, string>({
      query: (id) => `get-city/${id}`,
    }),
    addCity: builder.mutation({
      query: (city) => ({
        url: "create-city",
        method: "POST",
        body: city,
      }),
    }),
    updateCity: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `update-city/${id}`,
        method: "PUT",
        body: patch,
      }),
    }),
    deleteCity: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `delete-city/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useGetCityByIdQuery,
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = cityApi;
