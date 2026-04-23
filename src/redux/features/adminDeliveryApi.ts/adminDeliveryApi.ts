import { api } from "@/redux/api/apiSlice";


export const adminDeliveryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all pending paid deliveries
    getPendingPaidDeliveries: builder.query({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: 'admin-pending-paid-deliveries',
        params: { page, limit, search },
      }),
    }),

    // Get single delivery details
    getDeliveryDetails: builder.query({
      query: (deliveryId) => `admin-delivery/${deliveryId}`,
    }),

    // Get all available partners
    getAvailablePartners: builder.query({
      query: () => 'admin-delivery-partners',
    }),

    // Assign delivery to partner (admin)
    assignDeliveryToPartner: builder.mutation({
      query: ({ deliveryId, partnerId }:any) => ({
        url: `admin-assign-delivery/${deliveryId}`,
        method: 'POST',
        body: { partnerId },
      }),
    }),

    // Get admin stats
    getAdminDeliveryStats: builder.query({
      query: () => 'admin-delivery-stats',
    }),

        getAdminPendingDeliveries: builder.query({
      query: ({ page = 1, limit = 10 }) => 
        `/admin/deliveries/pending?page=${page}&limit=${limit}`,
      providesTags: (result) => 
        result?.data
          ? [...result.data.map(({ id }: { id: string }) => ({ type: 'AdminDeliveries', id })), 'AdminDeliveries']
          : ['AdminDeliveries'],
    }),

    getAdminPickedUpDeliveries: builder.query({
      query: ({ page = 1, limit = 10 }) => 
        `picked-up?page=${page}&limit=${limit}`,
    }),

    getAdminInTransitDeliveries: builder.query({
      query: ({ page = 1, limit = 10 }) => 
        `in-transit?page=${page}&limit=${limit}`,
    }),

    getAdminDeliveredDeliveries: builder.query({
      query: ({ page = 1, limit = 10 }) => 
        `delivered?page=${page}&limit=${limit}`,
    }),

    getAdminCancelledDeliveries: builder.query({
      query: ({ page = 1, limit = 10 }) => 
        `cancelled?page=${page}&limit=${limit}`,
    }),

    // ---------- CUSTOMER DELIVERIES (my deliveries) ----------
    getMyDeliveries: builder.query({
      query: ({ status, page = 1, limit = 10 }) => {
        let url = `deliveries/my?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
    }),

    // ---------- PARTNER DELIVERIES (assigned to me) ----------
    getPartnerDeliveries: builder.query({
      query: ({ status, page = 1, limit = 10 }) => {
        let url = `partner?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }: { id: string }) => ({ type: 'MyDeliveries', id })), 'MyDeliveries']
          : ['MyDeliveries'],
    }),

    // Update delivery status (partner actions)
    updateDeliveryStatus: builder.mutation({
      query: ({ deliveryId, status, location }) => ({
        url: `deliveries/${deliveryId}/status`,
        method: 'PATCH',
        body: { status, location },
      }),
    }),

  }),
});

export const {
  useGetPendingPaidDeliveriesQuery,
  useGetDeliveryDetailsQuery,
  useGetAvailablePartnersQuery,
  useAssignDeliveryToPartnerMutation,
  useGetAdminDeliveryStatsQuery,
// hhhf
  useGetAdminPendingDeliveriesQuery,
  useGetAdminPickedUpDeliveriesQuery,
  useGetAdminInTransitDeliveriesQuery,
  useGetAdminDeliveredDeliveriesQuery,
  useGetAdminCancelledDeliveriesQuery,
} = adminDeliveryApi;