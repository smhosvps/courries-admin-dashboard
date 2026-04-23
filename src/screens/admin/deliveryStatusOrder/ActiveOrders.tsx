// screens/admin/deliveryStatusOrder/ActiveOrders.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPickedUpAndInTransitQuery} from '@/redux/features/deliveryOrderStatusApi/deliveryOrderStatusApi';
import { DeliveryTable } from '@/components/orderDeliverySatus/DeliveryTable';
import { Pagination } from '@/components/orderDeliverySatus/Pagination';
import { Filters } from '@/components/orderDeliverySatus/Filters';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

export const ActiveOrders: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ startDate?: Date; endDate?: Date; trackingId?: string }>({});
    const limit = 10;

    const { data, isLoading, refetch } = useGetPickedUpAndInTransitQuery({
        page,
        limit,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
        trackingId: filters.trackingId,
    });

    // const [cancelDelivery] = useCancelDeliveryMutation();

    const handleCancel = async () => {
        const reason = prompt('Enter cancellation reason:');
        if (!reason) return;
        try {
            // await cancelDelivery({ id, reason }).unwrap();
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

   if (isLoading) {
    return (
    <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <Loader className="animate-spin text-blue-600" size={64} />
            </div>
          </div>
    );
  }

    return (
        <div className="lg:bg-white lg:p-8 lg:rounded-[12px]">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Picked Up / In Transit Orders</h1>
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