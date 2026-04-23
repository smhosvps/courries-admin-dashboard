// screens/admin/earnings/DeliveryEarnings.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDeliveryEarningsQuery } from '@/redux/features/earningReportApi/earningReportApi';
import { Pagination } from '@/components/orderDeliverySatus/Pagination';
import { EarningsTable } from '@/components/earningTable/EarningsTable';
import { EarningsFilters } from '@/components/earningTable/EarningsFilters';
import { Loader } from 'lucide-react';


export const DeliveryEarnings: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ startDate?: Date; endDate?: Date; recipientId?: string }>({});
    const limit = 10;

    const { data, isLoading } = useGetDeliveryEarningsQuery({
        page,
        limit,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
        recipientId: filters.recipientId,
    });

    const handleViewDelivery = (deliveryId: string) => {
        navigate(`/admin/orders/${deliveryId}`);
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Delivery Partner Earnings</h1>
            <EarningsFilters onApply={setFilters} showRecipientFilter={true} />
            <EarningsTable
                earnings={data?.data || []}
                onViewDelivery={handleViewDelivery}
                showRecipient={true}
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