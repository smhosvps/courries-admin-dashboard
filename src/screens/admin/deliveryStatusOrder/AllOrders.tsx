
import { DeliveryTable } from '@/components/orderDeliverySatus/DeliveryTable';
import { Filters } from '@/components/orderDeliverySatus/Filters';
import { Pagination } from '@/components/orderDeliverySatus/Pagination';
import { useGetAllOrdersQuery } from '@/redux/features/deliveryOrderStatusApi/deliveryOrderStatusApi';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';




export default function AllOrders() {

    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ startDate?: Date; endDate?: Date; trackingId?: string }>({});
    const limit = 10;
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useGetAllOrdersQuery({
        page,
        limit,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
        trackingId: filters.trackingId,
    });

    //   const [cancelDelivery] = useCancelDeliveryMutation();

    const handleCancel = async () => {
        const reason = prompt('Enter cancellation reason:');
        if (!reason) return;
        try {
            //   await cancelDelivery({ id, reason }).unwrap();
            //   toast.success('Delivery cancelled successfully');
            refetch();
        } catch (err) {
            console.log(err)
            //   toast.error('Failed to cancel delivery');
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">All Orders</h1>
            <Filters onApply={setFilters} />
            <DeliveryTable
                deliveries={data?.data || []}
                onViewDetails={handleViewDetails}
                onCancel={handleCancel}
                showCancel
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