/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { useAdminAssignDeliveryMutation } from '@/redux/features/deliveryOrderStatusApi/deliveryOrderStatusApi';

interface Rider {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adminRiders: string;
  userType: string;
  deliveryPartnerInfo?: {
    status: string;
    online: boolean;
    vehicle?: { type: string };
  };
}

interface AssignRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryId: string;
  deliveryType?: string; // optional, for filtering by vehicle type
  onAssignSuccess?: () => void;
}

export const AssignRiderModal: React.FC<AssignRiderModalProps> = ({
  isOpen,
  onClose,
  deliveryId,
  deliveryType,
  onAssignSuccess,
}) => {
  const { data: usersData, isLoading: isLoadingRiders } = useGetAllUsersQuery({});
  const [adminAssign, { isLoading: isAssigning }] = useAdminAssignDeliveryMutation();
  const [selectedRiderId, setSelectedRiderId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter riders: delivery_partner with adminRiders === "Yes"
  const riders: Rider[] = (usersData?.users || []).filter(
    (user: any) =>
      user.userType === 'delivery_partner' 
  );

//   && user.adminRiders === 'Yes'

  // Optional: further filter by vehicle type if deliveryType provided
  const filteredRiders = deliveryType
    ? riders.filter(
        (rider) =>
          rider.deliveryPartnerInfo?.vehicle?.type === deliveryType
      )
    : riders;

  const handleAssign = async () => {
    if (!selectedRiderId) {
      setError('Please select a rider');
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      const result = await adminAssign({ deliveryId, riderId: selectedRiderId }).unwrap();
      setSuccess(result.message || 'Rider assigned successfully!');
      // Wait a moment then close modal and refresh list
      setTimeout(() => {
        onAssignSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to assign rider. Please try again.');
    }
  };

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedRiderId('');
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Assign Delivery to Rider
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isAssigning}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isLoadingRiders ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredRiders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-yellow-500" />
              <p>No eligible riders found.</p>
              <p className="text-sm mt-1">
                {deliveryType
                  ? `No riders with vehicle type "${deliveryType}" and adminRiders = Yes.`
                  : 'No riders with adminRiders = Yes.'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Rider
                </label>
                <select
                  value={selectedRiderId}
                  onChange={(e) => setSelectedRiderId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Choose a rider --</option>
                  {filteredRiders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.firstName} {rider.lastName} ({rider.email}) -{' '}
                      {rider.deliveryPartnerInfo?.status || 'status unknown'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional: show rider details when selected */}
              {selectedRiderId && (
                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 mb-4">
                  <p>
                    <strong>Phone:</strong>{' '}
                    {filteredRiders.find((r) => r._id === selectedRiderId)?.phone ||
                      'N/A'}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    {filteredRiders.find((r) => r._id === selectedRiderId)
                      ?.deliveryPartnerInfo?.status || 'unknown'}
                  </p>
                  <p>
                    <strong>Online:</strong>{' '}
                    {filteredRiders.find((r) => r._id === selectedRiderId)
                      ?.deliveryPartnerInfo?.online
                      ? 'Yes'
                      : 'No'}
                  </p>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm flex items-start gap-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isAssigning}
            className="px-4 py-2 text-sm w-full font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={isAssigning || !selectedRiderId || filteredRiders.length === 0}
            className="px-4 py-2 text-sm w-full font-medium text-center text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Rider'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};