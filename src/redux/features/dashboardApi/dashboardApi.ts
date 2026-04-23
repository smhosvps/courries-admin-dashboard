import { api } from "@/redux/api/apiSlice";

export interface DashboardData {
  todayOrderStats: {
    totalOrder: number;
    pendingOrder: number;
    inProgressOrder: number;
    completedOrder: number;
    cancelledOrder: number;
  };
  orderDetailStats: {
    totalOrder: number;
    createdOrder: number;
    assignedOrder: number;
    acceptedOrder: number;
    arrivedOrder: number;
    pulledOrder: number;
    departedOrder: number;
    deliveredOrder: number;
    cancelledOrder: number;
    totalUser: number;
    totalDeliveryPerson: number;
  };
  financialStats: {
    totalCollection: number;
    adminCommission: number;
    deliveryCommission: number;
    totalWalletBalance: number;
    monthlyPaymentCount: number;
  };
  recentOrders: Array<{
    id: string;
    name: string;
    deliveryMan: string;
    pickupDate: string;
    createdDate: string;
    status: string;
  }>;
  recentWithdrawals: Array<{
    no: number;
    name: string;
    amount: string;
    createdDate: string;
    status: string;
  }>;
  charts: {
    withdrawalDistribution: Array<{ name: string; value: number; fill: string }>;
    weeklyOrderData: Array<{ name: string; value: number; fill: string }>;
    monthlyPaymentData: Array<{ month: string; amount: number }>;
    monthlyOrderData: Array<{ date: string; orders: number }>;
  };
  packagesTableData: Array<{
    city: string;
    total: number;
    inProgress: number;
    delivered: number;
    cancelled: number;
  }>;
}


export const dashboardBoardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<{ success: boolean; data: DashboardData }, void>({
      query: () => 'get-admin-stats',
    }),
  }),
})

export const {
  useGetDashboardStatsQuery
} = dashboardBoardApi

