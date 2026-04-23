import { api } from "@/redux/api/apiSlice";

export const altarCallApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAltarCallStats: builder.query({
      query: () => 'souls-stats',
    }),
    getAllAltarCallSouls: builder.query({
        query: () => 'all-alter-calls',
      }),
  }),
});

export const { useGetAltarCallStatsQuery, useGetAllAltarCallSoulsQuery } = altarCallApi;