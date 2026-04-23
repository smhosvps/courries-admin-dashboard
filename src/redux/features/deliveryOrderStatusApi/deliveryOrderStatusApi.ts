import { api } from "@/redux/api/apiSlice";


export interface Delivery {
    _id: string;
    trackingId: string;
    deliveryCode: string;
    status: string;
    customer: { _id: string; name: string; email: string; phone: string };
    deliveryPartner?: { _id: string; name: string; email: string; phone: string };
    pickup: { address: string; contactName: string; contactPhone: string };
    delivery: { address: string; contactName: string; contactPhone: string };
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    cancellationReason?: string;
    cancelledBy?: { _id: string; name: string };
    // ... other fields as needed
}

interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface QueryParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    trackingId?: string;
    status?: string | string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}


export const deliveryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // All orders (with extensive filters)
        getAllOrders: builder.query<PaginatedResponse<Delivery>, QueryParams>({
            query: (params) => ({
                url: 'deliveries-all',
                params,
            }),
        }),
        getPendingDeliveries: builder.query<PaginatedResponse<Delivery>, QueryParams>({
            query: (params) => ({ url: 'deliveries-pending', params })
        }),
        getAssignedDeliveries: builder.query<PaginatedResponse<Delivery>, QueryParams>({
            query: (params) => ({ url: 'deliveries-assigned', params })
        }),
        getPickedUpAndInTransit: builder.query<PaginatedResponse<Delivery>, QueryParams>({
            query: (params) => ({ url: 'deliveries-picked-up-in-transit', params }),
        }),
        getDeliveredDeliveries: builder.query<PaginatedResponse<Delivery>, QueryParams>({
            query: (params) => ({ url: 'deliveries-delivered', params })
        }),
        getCanceledDeliveries: builder.query<PaginatedResponse<Delivery>, QueryParams>({
            query: (params) => ({ url: 'deliveries-canceled', params }),
        }),
        getTodayOrders: builder.query<PaginatedResponse<Delivery>, QueryParams>({
            query: (params) => ({ url: 'deliveries-today', params }),
        }),
        getDeliveryById: builder.query<Delivery, string>({
            query: (id) => `deliveries-order-detail/${id}`,
        }),
        adminAssignDelivery: builder.mutation({
            query: ({ deliveryId, riderId }) => ({
                url: 'admin-assign',
                method: 'POST',
                body: { deliveryId, riderId },
            }),
        }),
    }),
});

export const {
    useGetAllOrdersQuery,
    useGetPendingDeliveriesQuery,
    useGetAssignedDeliveriesQuery,
    useGetPickedUpAndInTransitQuery,
    useGetDeliveredDeliveriesQuery,
    useGetCanceledDeliveriesQuery,
    useGetTodayOrdersQuery,
    useGetDeliveryByIdQuery,
    useAdminAssignDeliveryMutation
} = deliveryApi;