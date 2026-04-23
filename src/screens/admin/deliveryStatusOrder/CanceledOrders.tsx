import { DeliveryTable } from '@/components/orderDeliverySatus/DeliveryTable';
import { Filters } from '@/components/orderDeliverySatus/Filters';
import { Pagination } from '@/components/orderDeliverySatus/Pagination';
import { useGetCanceledDeliveriesQuery } from '@/redux/features/deliveryOrderStatusApi/deliveryOrderStatusApi';
import { Loader } from 'lucide-react';
import { useState } from 'react';


export default function CanceledOrders() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ startDate?: Date; endDate?: Date; trackingId?: string }>({});
    const limit = 10;

    const { data, isLoading } = useGetCanceledDeliveriesQuery({
        page,
        limit,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
        trackingId: filters.trackingId,
    });

    const handleViewDetails = (id: string) => {
        console.log('View details', id);
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Canceled Orders Management</h1>
            <Filters onApply={setFilters} />
            <DeliveryTable deliveries={data?.data || []} onViewDetails={handleViewDetails} showCancel={false} />
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