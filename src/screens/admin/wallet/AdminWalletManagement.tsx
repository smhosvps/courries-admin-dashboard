import TransactionModal from '@/components/TransactionModal';
import { useGetAllWalletsQuery, Wallet } from '@/redux/features/walletApi/walletApi';
import React, { useState } from 'react';

const AdminWalletManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const limit = 10; // items per page

  const { data, isLoading, isError, error } = useGetAllWalletsQuery({ page, limit, search });

  const handleViewTransactions = (userId: string) => {
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUserId(null);
  };

  if (isLoading) return <div className="p-4">Loading wallets...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading wallets: {JSON.stringify(error)}</div>;

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Wallet Management</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by user name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-full px-3 py-2 w-full max-w-md"
        />
      </div>

      {/* Wallets Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.wallets.map((wallet: Wallet, index: number) => {
              const serialNumber = (page - 1) * limit + index + 1;
              return (
                <tr key={wallet._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{serialNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {wallet.user.firstName} {wallet.user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{wallet.user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {wallet.formattedBalance || `₦${wallet.balance.toLocaleString('en-NG')}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{wallet.transactionCount || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewTransactions(wallet.user._id)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      View Transactions
                    </button>
                  </td>
                </tr>
              );
            })}
            {data?.wallets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No wallets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.pagination.total > data.pagination.limit && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {data.pagination.page} of {data.pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
            disabled={page === data.pagination.pages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Transaction Modal (Side Modal) */}
      {selectedUserId && (
        <TransactionModal
          userId={selectedUserId}
          isOpen={modalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminWalletManagement;