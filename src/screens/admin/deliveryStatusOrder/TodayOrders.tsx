// screens/admin/deliveryStatusOrder/TodayOrders.tsx
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTodayOrdersQuery } from '@/redux/features/deliveryOrderStatusApi/deliveryOrderStatusApi';
import { DeliveryTable } from '@/components/orderDeliverySatus/DeliveryTable';
import { Pagination } from '@/components/orderDeliverySatus/Pagination';
import { Filters } from '@/components/orderDeliverySatus/Filters';
import { toast } from 'react-toastify';


export default function TodayOrders() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ startDate?: Date; endDate?: Date; trackingId?: string }>({});
  const limit = 10;

  const { data, isLoading, error, refetch } = useGetTodayOrdersQuery({
    page,
    limit,
    trackingId: filters.trackingId,
  });

//   const [cancelDelivery] = useCancelDeliveryMutation();

  const handleCancel = async () => {
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;
    try {
    //   await cancelDelivery({ id, reason }).unwrap();
      toast.success('Delivery cancelled successfully');
      refetch();
    } catch (err) {
        console.log(err)
      toast.error('Failed to cancel delivery');
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/dashboard-super-admin/order-details/${id}`);
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error loading today's orders</div>;

  return (
     <div className="lg:bg-white lg:p-8 lg:rounded-[12px]">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Today's Orders</h1>
      <Filters onApply={setFilters} />
      <DeliveryTable
        deliveries={data?.data || []}
        onViewDetails={handleViewDetails}
        onCancel={handleCancel}
        showCancel
        currentPage={page}
        itemsPerPage={limit}
      />
      {data && (
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.pages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};