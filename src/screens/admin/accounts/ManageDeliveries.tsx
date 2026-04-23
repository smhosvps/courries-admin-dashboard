/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  Filter,
  RefreshCw,
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Truck,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';


import { useGetAdminDeliveryStatsQuery, useGetPendingPaidDeliveriesQuery } from '@/redux/features/adminDeliveryApi.ts/adminDeliveryApi';
import { formatDate, formatDistance } from '@/utils/formatters';


export default function ManageDeliveries() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading, isFetching, refetch } = useGetPendingPaidDeliveriesQuery({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  console.log(data, "data")

  const { data: statsData } = useGetAdminDeliveryStatsQuery({});

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const deliveries = data?.data?.deliveries || [];
  const pagination = data?.data?.pagination || { page: 1, total: 0, pages: 1 };

  return (
    <div className="py-6 px-0 lg:px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Deliveries</h1>
        <p className="text-gray-600 mt-1">
          Manage and assign deliveries that are pending with paid payment
        </p>
      </div>

      {/* Stats Cards */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-[6px] shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Paid</p>
                <p className="text-2xl font-bold text-blue-600">{statsData.data.pendingPaidCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[6px] shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Deliveries</p>
                <p className="text-2xl font-bold text-green-600">{statsData.data.totalDeliveriesToday}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[6px] shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Delivery Time</p>
                <p className="text-2xl font-bold text-purple-600">{statsData.data.averageDeliveryTime} min</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[6px] shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue Today</p>
                <p className="text-2xl font-bold text-yellow-600">₦{statsData.data.revenueToday?.toLocaleString() || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code, address, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => refetch()}
            className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isFetching}
          >
            <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="h-5 w-5 text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup → Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-gray-500">Loading deliveries...</span>
                    </div>
                  </td>
                </tr>
              ) : deliveries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No pending deliveries with paid payment found</p>
                  </td>
                </tr>
              ) : (
                deliveries.map((delivery:any) => (
                  <tr key={delivery._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{delivery.deliveryCode}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(delivery.createdAt)}
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-1">
                            {delivery.trackingId}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {delivery.customer.avatar ? (
                          <img
                            src={delivery.customer.avatar}
                            alt={delivery.customer.name}
                            className="h-8 w-8 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {delivery.customer.name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="h-3 w-3" />
                            {delivery.customer.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-start gap-1 mb-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-gray-900">From:</span>
                            <p className="text-gray-600 max-w-xs truncate text-sm">
                              {delivery.pickup.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-1">
                          <div className="h-2 w-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-gray-900">To:</span>
                            <p className="text-gray-600 max-w-xs truncate text-sm">
                              {delivery.delivery.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {delivery.package.type}
                          </div>
                          <div className="text-xs text-gray-600">
                            {delivery.package.weight}kg
                          </div>
                          <div className="text-xs text-gray-500 max-w-[150px] truncate">
                            {delivery.package.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            ₦{delivery.totalAmount?.toLocaleString()}
                          </div>
                          <div className="text-xs text-green-600 capitalize">
                            {delivery.paymentMethod}
                          </div>
                          {delivery.distance && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3" />
                              {formatDistance(delivery.distance)} km
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <Link
                        to={`/dashboard-super-admin/deliveries/${delivery._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-[7px] hover:bg-blue-700 transition-colors"
                      >
                        View & Assign
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 order-2 sm:order-1">
              Showing {((pagination.page - 1) * 10) + 1} to{' '}
              {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} deliveries
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="px-3 py-1 text-sm bg-gray-100 rounded-md">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}