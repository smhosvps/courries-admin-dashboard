// screens/admin/earnings/AdminEarnings.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAdminEarningsQuery } from '@/redux/features/earningReportApi/earningReportApi';
import { Pagination } from '@/components/orderDeliverySatus/Pagination';
import { EarningsFilters } from '@/components/earningTable/EarningsFilters';
import { EarningsTable } from '@/components/earningTable/EarningsTable';
import { Loader } from 'lucide-react';

export const AdminEarnings: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ startDate?: Date; endDate?: Date }>({});
    const limit = 10;

    const { data, isLoading } = useGetAdminEarningsQuery({
        page,
        limit,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Earnings</h1>
            <EarningsFilters onApply={setFilters} showRecipientFilter={false} />
            <EarningsTable
                earnings={data?.data || []}
                onViewDelivery={handleViewDelivery}
                showRecipient={false}
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