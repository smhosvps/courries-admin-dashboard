import React from 'react';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { Earning } from '@/redux/features/earningReportApi/earningReportApi';

interface EarningsTableProps {
  earnings: Earning[];
  onViewDelivery?: (deliveryId: string) => void;
  showRecipient?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

export const EarningsTable: React.FC<EarningsTableProps> = ({
  earnings,
  onViewDelivery,
  showRecipient = false,
  currentPage = 1,
  itemsPerPage = 10,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-[12px] shadow border border-gray-200">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
              S/N
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
              Tracking ID
            </th>
            {showRecipient && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Delivery Partner
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
              Amount (₦)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
              Percentage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {earnings.map((earning, index) => {
            const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
            const hasDelivery = earning.delivery && typeof earning.delivery === 'object';
            
            return (
              <tr key={earning._id} className="hover:bg-gray-50 border-t border-gray-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                  {serialNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r border-gray-200">
                  {hasDelivery ? (
                    <button
                      onClick={() => onViewDelivery?.(earning.delivery._id)}
                      className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                    >
                      {earning.delivery.trackingId}
                      <Eye className="h-3 w-3 ml-1" />
                    </button>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                {showRecipient && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                    {earning.recipient && typeof earning.recipient === 'object'
                      ? `${earning.recipient.firstName || ''} ${earning.recipient.lastName || ''}`.trim() || 'N/A'
                      : 'N/A'}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium border-r border-gray-200">
                  ₦{earning.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                  {earning.percentage}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(earning.createdAt), 'dd MMM yyyy, hh:mm a')}
                </td>
              </tr>
            );
          })}
          {earnings.length === 0 && (
            <tr>
              <td colSpan={showRecipient ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-500">
                No earnings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};