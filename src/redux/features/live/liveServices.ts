import { api } from "@/redux/api/apiSlice";


export interface Settings {
    _id?: string;
    paystackKey: string;
    oneSignalPlayerId: string;
    webClientId: string;
    iosClientId: string;
    googleMapsApiKey: string;
    googleMapsIosApiKey: string;
    googleMapsAndroidApiKey: string;
}

export const settingsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query<Settings, void>({
            query: () => 'key-settings',
        }),
        updateSettings: builder.mutation<Settings, Partial<Settings>>({
            query: (settings) => ({
                url: 'update-keys',
                method: 'PUT',
                body: settings,
            }),
        }),
    }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;