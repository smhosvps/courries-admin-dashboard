import { api } from "@/redux/api/apiSlice";

// Types
export interface Geofence {
  _id: string;
  name: string;
  type: "circle" | "polygon";
  center?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  radius?: number;
  polygon?: {
    type: "Polygon";
    coordinates: number[][][];
  };
  isActive: boolean;
  createdAt: string;
}

export type CreateGeofenceDto = Omit<Geofence, "_id" | "createdAt" | "isActive">;
export type UpdateGeofenceDto = Partial<CreateGeofenceDto>;


export const geofenceApi = api.injectEndpoints({

  endpoints: (builder) => ({
    // GET all geofences
    getGeofences: builder.query<Geofence[], void>({
      query: () => "geofences",
    }),

    // CREATE a geofence
    createGeofence: builder.mutation<Geofence, CreateGeofenceDto>({
      query: (body) => ({
        url: "geofences",
        method: "POST",
        body,
      }),
    }),

    // UPDATE a geofence
    updateGeofence: builder.mutation<Geofence, { id: string; data: UpdateGeofenceDto }>({
      query: ({ id, data }) => ({
        url: `geofences/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // DELETE a geofence
    deleteGeofence: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `geofences/${id}`,
        method: "DELETE",
      }),
    }),

    // CHECK if a point is inside any geofence
    checkGeofence: builder.mutation<{ inside: boolean }, { lng: number; lat: number }>({
      query: (body) => ({
        url: "geofences/check",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetGeofencesQuery,
  useCreateGeofenceMutation,
  useUpdateGeofenceMutation,
  useDeleteGeofenceMutation,
  useCheckGeofenceMutation,
} = geofenceApi;
