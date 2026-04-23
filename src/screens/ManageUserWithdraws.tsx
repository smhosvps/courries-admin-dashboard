import { useState } from 'react';
import { format } from 'date-fns';
import { useGetWithdrawalsQuery, useProcessWithdrawalMutation } from '@/redux/features/widthdrawApi/withdrawalApi';
import { Link } from 'react-router-dom';
import { useGetUserQuery } from '@/redux/api/apiSlice';
import { Loader } from 'lucide-react';

interface Withdrawal {
    _id: string;
    deliveryPartner: {
        _id: string;
        firstName: string;
        lastName: string;
        phone?: string;
        email?: string;
        avatar?: {
            public_id: string;
            url: string;
        };
    } | null;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    remarks?: string;
    processedBy?: { firstName: string; lastName: string };
    processedAt?: string;
    createdAt: string;
}

export default function ManageUserWithdraws() {
    const { data: user } = useGetUserQuery();
    const [statusFilter, setStatusFilter] = useState<string>('');
    const { data, isLoading, refetch } = useGetWithdrawalsQuery({ status: statusFilter });
    const [processWithdrawal, { isLoading: isProcessing }] = useProcessWithdrawalMutation();

    const adminId = user?.user?._id;

    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
    const [modalWithdrawalId, setModalWithdrawalId] = useState<string | null>(null);
    const [modalRemarks, setModalRemarks] = useState('');

    const withdrawals = data?.data || [];

    const openModal = (id: string, action: 'approve' | 'reject') => {
        setModalWithdrawalId(id);
        setModalAction(action);
        setModalRemarks('');
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalAction(null);
        setModalWithdrawalId(null);
        setModalRemarks('');
    };

    const handleConfirm = async () => {
        if (!modalWithdrawalId || !modalAction) return;

        try {
            await processWithdrawal({
                id: modalWithdrawalId,
                adminId,
                body: { action: modalAction, remarks: modalRemarks },
            }).unwrap();
            refetch();
            closeModal();
        } catch (err) {
            console.error('Process withdrawal error:', err);
            alert('Failed to process withdrawal. Please try again.');
        }
    };

    const getStatusBadge = (status: string) => {
        const base = 'px-2 py-1 rounded-full text-xs font-semibold';
        switch (status) {
            case 'approved':
                return <span className={`${base} bg-green-100 text-green-800`}>Approved</span>;
            case 'rejected':
                return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
            default:
                return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
        }
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
        <div className="min-h-screen">
            <div className="py-6 px-0 lg:px-4 bg-white rounded-2xl">
                <div className="mb-6 flex justify-between items-center flex-wrap gap-4 px-4 md:px-0">
                    <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                            Filter by status:
                        </label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-[12px] px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <button
                            onClick={() => refetch()}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {withdrawals.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        No withdrawal requests found.
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden rounded-lg">
                        <div className="overflow-x-auto">
                            {/* Added border-collapse and border classes for lines */}
                            <table className="min-w-full border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Partner
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Request Date
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Remarks
                                        </th>
                                        <th className="border border-gray-300 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {withdrawals.map((withdrawal: Withdrawal, index: number) => {
                                        const partner = withdrawal.deliveryPartner;
                                        const partnerName = partner
                                            ? `${partner.firstName} ${partner.lastName}`
                                            : 'Partner deleted';
                                        const partnerPhone = partner?.phone || 'No phone';
                                        const partnerId = partner?._id;

                                        return (
                                            <tr key={withdrawal._id} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-gray-300 px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {partner?.avatar?.url ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={partner.avatar.url}
                                                                    alt={partnerName}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <span className="text-gray-600 font-medium text-sm">
                                                                        {partner ? `${partner.firstName?.[0] || ''}${partner.lastName?.[0] || ''}` : '?'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {partnerName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {partnerPhone}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        ₦{withdrawal.amount.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(withdrawal.status)}
                                                </td>
                                                <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {format(new Date(withdrawal.createdAt), 'MMM dd, yyyy • hh:mm a')}
                                                </td>
                                                <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                                    {withdrawal.remarks || '—'}
                                                </td>
                                                <td className="border border-gray-300 px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        {partnerId && (
                                                            <Link to={`/dashboard-super-admin/user-detail/${partnerId}`}>
                                                                <button
                                                                    disabled={isProcessing}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm disabled:opacity-50"
                                                                >
                                                                    Details
                                                                </button>
                                                            </Link>
                                                        )}
                                                        {withdrawal.status === 'approved' && partnerId && (
                                                            <Link to={`/dashboard-super-admin/complete-payment/${partnerId}`}>
                                                                <button
                                                                    disabled={isProcessing}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm disabled:opacity-50"
                                                                >
                                                                    Make Payment
                                                                </button>
                                                            </Link>
                                                        )}
                                                        {withdrawal.status === 'pending' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => openModal(withdrawal._id, 'approve')}
                                                                    disabled={isProcessing}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm disabled:opacity-50"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => openModal(withdrawal._id, 'reject')}
                                                                    disabled={isProcessing}
                                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm disabled:opacity-50"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm italic">No actions</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal (unchanged) */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {modalAction === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {modalAction === 'approve'
                                ? 'Are you sure you want to approve this withdrawal request?'
                                : 'Are you sure you want to reject this withdrawal request?'}
                        </p>
                        <div className="mb-4">
                            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks (optional)
                            </label>
                            <textarea
                                id="remarks"
                                rows={3}
                                className="w-full border border-gray-300 rounded-[12px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add any remarks or reason for rejection..."
                                value={modalRemarks}
                                onChange={(e) => setModalRemarks(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                disabled={isProcessing}
                                className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 w-full"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isProcessing}
                                className={`px-4 py-2 rounded-full text-sm font-medium text-white w-full ${
                                    modalAction === 'approve'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                } disabled:opacity-50 flex items-center`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    modalAction === 'approve' ? 'Approve' : 'Reject'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}