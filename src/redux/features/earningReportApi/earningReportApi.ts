import { api } from "@/redux/api/apiSlice";

export interface StatusCount {
    status: string;
    count: number;
}

export interface MonthlyTrend {
    month: string;
    deliveries: number;
    revenue: number;
}

export interface RecentDelivery {
    _id: string;
    trackingId: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    customer: { firstName: string; lastName: string; email: string };
    deliveryPartner?: { firstName: string; lastName: string; email: string };
}

export interface StatsResponse {
    success: boolean;
    data: {
        totalDeliveriesByStatus: StatusCount[];
        monthlyTrend: MonthlyTrend[];
        recentDeliveries: RecentDelivery[];
    };
}

export interface Earning {
    _id: string;
    delivery: {
        _id: string;
        trackingId: string;
        totalAmount: number;
        status: string;
        createdAt: string;
    };
    recipient?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        avatar?: { url: string };
    };
    type: 'admin' | 'delivery';
    amount: number;
    percentage: number;
    createdAt: string;
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

interface EarningsQueryParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    recipientId?: string; // only for delivery earnings
}

export const earningReportApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdminEarnings: builder.query<PaginatedResponse<Earning>, EarningsQueryParams>({
            query: (params) => ({ url: 'earnings-admin', params })
        }),
        getDeliveryEarnings: builder.query<PaginatedResponse<Earning>, EarningsQueryParams>({
            query: (params) => ({ url: 'earnings-delivery', params }),
        }),
        getStatsAndRevenue: builder.query<StatsResponse, { status?: string }>({
            query: ({ status }) => ({
                url: 'stats-revenue',
                params: status ? { status } : {},
            }),
        }),
    }),
});

export const { useGetAdminEarningsQuery, useGetDeliveryEarningsQuery, useGetStatsAndRevenueQuery } = earningReportApi;