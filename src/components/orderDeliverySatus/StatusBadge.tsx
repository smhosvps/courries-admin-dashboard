import React from 'react';

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  picked_up: 'bg-indigo-100 text-indigo-800',
  in_transit: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  request_accepted: 'bg-cyan-100 text-cyan-800',
  failed_to_assign: 'bg-gray-100 text-gray-800',
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status.replace(/_/g, ' ').toUpperCase()}
    </span>
  );
};