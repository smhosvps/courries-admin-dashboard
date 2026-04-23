import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { StatusBadge } from '@/components/orderDeliverySatus/StatusBadge';
import { useGetStatsAndRevenueQuery } from '@/redux/features/earningReportApi/earningReportApi';
import { Loader } from 'lucide-react';

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'request_accepted', label: 'Request Accepted' },
    { value: 'cancelled', label: 'Cancelled' },
];


export default function OrderReport() {
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const { data, isLoading } = useGetStatsAndRevenueQuery({ status: selectedStatus || undefined });

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
    };

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

    return (
        <div className="space-y-6 lg:px-4">
            <h1 className="text-2xl font-semibold text-gray-900">Order Report</h1>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {stats?.totalDeliveriesByStatus.map((item) => (
                    <div key={item.status} className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500 capitalize">{item.status.replace(/_/g, ' ')}</p>
                        <p className="text-2xl font-bold">{item.count}</p>
                    </div>
                ))}
            </div>

            {/* Filter for Monthly Charts */}
            <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Monthly Trends</h2>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Filter by status:</label>
                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-md font-medium text-center mb-2">Monthly Deliveries</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats?.monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="deliveries" fill="#1969fe" name="Deliveries" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <h3 className="text-md font-medium text-center mb-2">Monthly Revenue (₦)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats?.monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                                <YAxis />
                                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#1969fe" name="Revenue" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Deliveries Table */}
            <div className="bg-white rounded-lg overflow-hidden">
                <h2 className="text-lg font-medium p-4 border-b">Recent Deliveries</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats?.recentDeliveries.map((delivery) => (
                                <tr key={delivery._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{delivery.trackingId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.customer?.firstName} {delivery.customer?.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={delivery.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦{delivery.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(delivery.createdAt), 'dd MMM yyyy')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};