// screens/admin/Dashboard.tsx
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  PlusCircle,
  UserCheck,
  MapPin,
  Package,
  Users,
  UserPlus,
  Wallet,
  CreditCard,
  BoxIcon,
  CalendarX2,
  DollarSign,
  CircleDollarSign,
  CreditCardIcon,
  Loader,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "./redux/features/dashboardApi/dashboardApi";
import { Link } from "react-router-dom";


const getStatusColor = (status: string) => {
  if (status === "Done" || status === "Approved" || status === "Completed")
    return "bg-green-100 text-green-700";
  if (status === "Rejected" || status === "Cancelled")
    return "bg-red-100 text-red-700";
  if (status === "Pending" || status === "In Progress")
    return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
};

export default function AdminDashboard() {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={64} />
        </div>
      </div>
    );
  }



  const stats = data?.data;

  // Extract data sections (fallback to empty objects/arrays)
  const todayStats = stats?.todayOrderStats || {
    totalOrder: 0,
    pendingOrder: 0,
    inProgressOrder: 0,
    completedOrder: 0,
    cancelledOrder: 0,
  };
  const orderStats = stats?.orderDetailStats || {
    totalOrder: 0,
    createdOrder: 0,
    assignedOrder: 0,
    acceptedOrder: 0,
    arrivedOrder: 0,
    pulledOrder: 0,
    departedOrder: 0,
    deliveredOrder: 0,
    cancelledOrder: 0,
    totalUser: 0,
    totalDeliveryPerson: 0,
  };
  const financialStats = stats?.financialStats || {
    totalCollection: 0,
    adminCommission: 0,
    deliveryCommission: 0,
    totalWalletBalance: 0,
    monthlyPaymentCount: 0,
  };
  const recentOrders = stats?.recentOrders || [];
  const recentWithdrawals = stats?.recentWithdrawals || [];
  const withdrawalDistribution = stats?.charts?.withdrawalDistribution || [];
  const weeklyOrderData = stats?.charts?.weeklyOrderData || [];
  const monthlyPaymentData = stats?.charts?.monthlyPaymentData || [];
  const monthlyOrderData = stats?.charts?.monthlyOrderData || [];
  const packagesTableData = stats?.packagesTableData || [];

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Today Order Counts Stats */}
        <section className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Today Order Counts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Order", value: todayStats.totalOrder, icon: BoxIcon, color: "text-blue-600" },
              { label: "Pending Order", value: todayStats.pendingOrder, icon: Clock, color: "text-blue-600" },
              { label: "In-Progress Order", value: todayStats.inProgressOrder, icon: Truck, color: "text-blue-600" },
              { label: "Completed Order", value: todayStats.completedOrder, icon: CheckCircle, color: "text-blue-600" },
              { label: "Cancelled Order", value: todayStats.cancelledOrder, icon: XCircle, color: "text-blue-600" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[6px] p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Detail Stats */}
        <section className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Order Detail
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
            {[
              { label: "Total Order", value: orderStats.totalOrder, icon: ShoppingCart, color: "text-blue-600" },
              { label: "Created Order", value: orderStats.createdOrder, icon: PlusCircle, color: "text-blue-600" },
              { label: "Assigned Order", value: orderStats.assignedOrder, icon: UserCheck, color: "text-blue-600" },
              { label: "Accepted Order", value: orderStats.acceptedOrder, icon: CheckCircle, color: "text-blue-600" },
              { label: "Arrived Order", value: orderStats.arrivedOrder, icon: MapPin, color: "text-blue-600" },
              { label: "Pulled Order", value: orderStats.pulledOrder, icon: Package, color: "text-blue-600" },
              { label: "Departed Order", value: orderStats.departedOrder, icon: Truck, color: "text-blue-600" },
              { label: "Delivered Order", value: orderStats.deliveredOrder, icon: CheckCircle, color: "text-blue-600" },
              { label: "Cancelled Order", value: orderStats.cancelledOrder, icon: CalendarX2, color: "text-blue-600" },
              { label: "Total User", value: orderStats.totalUser, icon: Users, color: "text-blue-500" },
              { label: "Total Delivery Person", value: orderStats.totalDeliveryPerson, icon: UserPlus, color: "text-blue-600" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[6px] p-3 sm:p-4 shadow-sm border border-gray-100  transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Financial Stats */}
        <section className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Financial Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Collection From Order", value: financialStats.totalCollection, icon: CreditCard, color: "text-blue-600", prefix: "₦" },
              { label: "Total Admin Commission", value: financialStats.adminCommission, icon: DollarSign, color: "text-blue-600", prefix: "₦" },
              { label: "Total Delivery Boy Commission", value: financialStats.deliveryCommission, icon: CircleDollarSign, color: "text-blue-600", prefix: "₦" },
              { label: "Total Wallet Balance", value: financialStats.totalWalletBalance, icon: Wallet, color: "text-blue-600", prefix: "₦" },
              { label: "Monthly Payment Count", value: financialStats.monthlyPaymentCount, icon: CreditCardIcon, color: "text-blue-600", prefix: "₦" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[6px] p-3 sm:p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-sm sm:text-base font-bold text-gray-900">{stat.prefix}{stat.value.toLocaleString()}</p>
                  </div>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Order Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Order</h2>
            <Link to="/dashboard-super-admin/all-order" className="text-blue-600 text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Id</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Delivery Man</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Pickup Date</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Created Date</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 sm:px-4 text-gray-900">{order.id}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-900">{order.name}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-900">{order.deliveryMan}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-600 whitespace-nowrap">{order.pickupDate}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-600 whitespace-nowrap">{order.createdDate}</td>
                    <td className="py-3 px-3 sm:px-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <a href="#" className="text-blue-600 font-medium hover:underline">View</a>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-4 text-gray-500">No recent orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Withdraw Request Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Withdraw Request</h2>
            <Link to="/dashboard-super-admin/manage-withdraw" className="text-blue-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">No</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Created Date</th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentWithdrawals.map((item) => (
                  <tr key={item.no} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 sm:px-4 text-gray-900">{item.no}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-900">{item.name}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-900 font-medium">{item.amount}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-600 whitespace-nowrap">{item.createdDate}</td>
                    <td className="py-3 px-3 sm:px-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentWithdrawals.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-4 text-gray-500">No withdrawal requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Withdrawal Distribution Chart */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              Withdrawal Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={withdrawalDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {withdrawalDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {withdrawalDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-gray-700">{item.name} ({item.value.toLocaleString()})</span>
                </div>
              ))}
            </div>
          </section>

          {/* All Recent Activities Table */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              All Recent Activities
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">City Name</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Total Number</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Parcel in Progress</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Delivered Package</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">Cancelled Package</th>
                  </tr>
                </thead>
                <tbody>
                  {packagesTableData.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 sm:px-4 text-gray-900">{item.city}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-900 font-medium">{item.total}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-900">{item.inProgress}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-900">{item.delivered}</td>
                      <td className="py-3 px-3 sm:px-4 text-gray-900">{item.cancelled}</td>
                    </tr>
                  ))}
                  {packagesTableData.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-4 text-gray-500">No activity data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-end gap-2 text-xs text-gray-600">
              <span>Showing 1 - {packagesTableData.length} out of {packagesTableData.length}</span>
              <div className="flex gap-1">
                <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">1</button>
              </div>
            </div>
          </section>
        </div>

        {/* Payment and Weekly Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Monthly Payment Chart */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              Monthly Payment Count
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyPaymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#1969fe" radius={[8, 8, 0, 0]} name="Monthly Payment" />
              </BarChart>
            </ResponsiveContainer>
            {/* <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyPaymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer> */}
          </section>

          {/* Weekly Order Chart */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              Weekly Order Count
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={weeklyOrderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {weeklyOrderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              {weeklyOrderData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Monthly Order Chart */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <AreaChart className="w-5 h-5 text-indigo-600" />
            Monthly Order Count
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyOrderData}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1969fe" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1969fe" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1969fe" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1969fe",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => [`${value} orders`, ""]}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#1969fe"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
}