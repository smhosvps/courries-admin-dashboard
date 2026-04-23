/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAdminPendingDeliveriesQuery } from '@/redux/features/adminDeliveryApi.ts/adminDeliveryApi';
import { useState } from 'react';



export default function PendingDeliveries() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useGetAdminPendingDeliveriesQuery({ page, limit });

  if (isLoading) return <div className="text-center p-4">Loading deliveries...</div>;
  if (isError) return <div className="text-red-500 p-4">Error: {JSON.stringify(error)}</div>;

  const deliveries = data?.data || [];
  const { total, pages, page: currentPage } = data?.pagination || { total: 0, pages: 1, page: 1 };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Deliveries (Paid)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Tracking ID</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Delivery Type</th>
              <th className="px-4 py-2 border">Pickup Address</th>
              <th className="px-4 py-2 border">Delivery Address</th>
              <th className="px-4 py-2 border">Total Amount</th>
              <th className="px-4 py-2 border">Payment Status</th>
              <th className="px-4 py-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery: any) => (
              <tr key={delivery._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-sm">{delivery.trackingId}</td>
                <td className="px-4 py-2 border">{delivery.customer?.name || 'N/A'}</td>
                <td className="px-4 py-2 border capitalize">{delivery.deliveryType}</td>
                <td className="px-4 py-2 border text-sm">{delivery.pickup.address.substring(0, 40)}...</td>
                <td className="px-4 py-2 border text-sm">{delivery.delivery.address.substring(0, 40)}...</td>
                <td className="px-4 py-2 border">₦{delivery.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  <span className={`px-2 py-1 rounded text-xs ${
                    delivery.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {delivery.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-2 border text-sm">{new Date(delivery.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {pages} (Total {total} deliveries)
        </span>
        <button
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          disabled={currentPage === pages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

