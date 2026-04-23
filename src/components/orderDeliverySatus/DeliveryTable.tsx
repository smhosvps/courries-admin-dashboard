/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Eye, UserPlus } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Delivery } from '@/redux/features/deliveryOrderStatusApi/deliveryOrderStatusApi';
import { AssignRiderModal } from '../AssignRiderModal';

interface DeliveryTableProps {
  deliveries: Delivery[];
  onViewDetails: (id: string) => void;
  onCancel?: (id: string) => void;
  showCancel?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  onAssignmentSuccess?: () => void; // called after a rider is successfully assigned
}

export const DeliveryTable: React.FC<DeliveryTableProps> = ({
  deliveries,
  onViewDetails,
  currentPage = 1,
  itemsPerPage = 10,
  onAssignmentSuccess,
}) => {
  const [selectedDelivery, setSelectedDelivery] = useState<{ id: string; type?: string } | null>(null);

  const handleAssignRider = (deliveryId: string, deliveryType?: string) => {
    setSelectedDelivery({ id: deliveryId, type: deliveryType });
  };

  const closeModal = () => setSelectedDelivery(null);

  const handleAssignSuccess = () => {
    closeModal();
    if (onAssignmentSuccess) {
      onAssignmentSuccess();
    }
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                S/N
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Tracking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Pickup Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Delivery Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {deliveries.map((delivery:any, index) => {
              const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
              const canAssign = delivery.status === 'pending';
              return (
                <tr key={delivery._id} className="hover:bg-gray-50 border-t border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                    {serialNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    {delivery.trackingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                    {delivery.customer?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate border-r border-gray-200">
                    {delivery.pickup.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate border-r border-gray-200">
                    {delivery.delivery.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                    <StatusBadge status={delivery.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                    ₦{delivery.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                    {format(new Date(delivery.createdAt), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button
                      onClick={() => onViewDetails(delivery._id)}
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    {canAssign && (
                      <button
                        onClick={() => handleAssignRider(delivery._id, delivery.deliveryType)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center ml-2"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Assign Rider
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {deliveries.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500 border-t border-gray-200">
                  No deliveries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Rider Modal */}
      {selectedDelivery && (
        <AssignRiderModal
          isOpen={true}
          onClose={closeModal}
          deliveryId={selectedDelivery.id}
          deliveryType={selectedDelivery.type}
          onAssignSuccess={handleAssignSuccess}
        />
      )}
    </>
  );
};