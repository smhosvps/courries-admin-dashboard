import { api } from '@/redux/api/apiSlice';

export interface EarningSetting {
  _id: string;
  adminPercentage: number;
  riderPercentage: number;
  updatedAt: string;
  updatedBy?: string;
}

export const earningSettingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEarningSettings: builder.query<{ success: boolean; data: EarningSetting }, void>({
      query: () => '/earning-settings',
    }),
    updateEarningSettings: builder.mutation<
      { success: boolean; data: EarningSetting },
      { adminPercentage?: number; riderPercentage?: number }
    >({
      query: (body) => ({
        url: '/earning-settings',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useGetEarningSettingsQuery, useUpdateEarningSettingsMutation } = earningSettingApi;