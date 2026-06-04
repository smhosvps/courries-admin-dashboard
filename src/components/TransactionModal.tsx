import { Transaction, useGetUserWalletQuery, useManualFundWalletMutation, useManualDebitWalletMutation } from '@/redux/features/walletApi/walletApi';
import React, { useState } from 'react';

interface TransactionModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ userId, isOpen, onClose }) => {
  const { data, isLoading, refetch } = useGetUserWalletQuery(userId, { skip: !isOpen });
  const [manualFund, { isLoading: isFunding }] = useManualFundWalletMutation();
  const [manualDebit, { isLoading: isDebiting }] = useManualDebitWalletMutation();

  // Fund form state
  const [fundAmount, setFundAmount] = useState<number>(0);
  const [fundDescription, setFundDescription] = useState('');
  const [fundError, setFundError] = useState('');

  // Debit form state
  const [debitAmount, setDebitAmount] = useState<number>(0);
  const [debitDescription, setDebitDescription] = useState('');
  const [debitError, setDebitError] = useState('');

  const handleManualFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fundAmount <= 0) {
      setFundError('Amount must be greater than zero');
      return;
    }
    try {
      await manualFund({ userId, body: { amount: fundAmount, description: fundDescription || undefined } }).unwrap();
      setFundAmount(0);
      setFundDescription('');
      setFundError('');
      refetch();
    } catch (err: any) {
      setFundError(err.data?.message || 'Funding failed');
    }
  };

  const handleManualDebit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (debitAmount <= 0) {
      setDebitError('Amount must be greater than zero');
      return;
    }
    try {
      await manualDebit({ userId, body: { amount: debitAmount, description: debitDescription || undefined } }).unwrap();
      setDebitAmount(0);
      setDebitDescription('');
      setDebitError('');
      refetch();
    } catch (err: any) {
      setDebitError(err.data?.message || 'Debit failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal panel - wider with two columns, limited height */}
        <div className="relative bg-white rounded-xl shadow-xl transform transition-all sm:max-w-5xl sm:w-full max-h-[90vh] flex flex-col">
          {/* Header - fixed */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900" id="modal-title">
              Wallet Management
            </h3>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">Loading wallet data...</div>
          ) : data ? (
            // Main content area with overflow hidden to constrain scrolling to child containers
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* LEFT SIDEBAR - Transaction History with independent scroll */}
              <div className="md:w-1/2 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
                {/* Header inside sidebar - sticky */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-700">Transaction History</h4>
                  <p className="text-xs text-gray-500 mt-1">{data.totalTransactions} transactions</p>
                </div>
                {/* Scrollable transaction list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {data.transactions.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">No transactions yet.</p>
                  ) : (
                    data.transactions.map((tx: Transaction) => (
                      <div key={tx.reference} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(tx.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                tx.type === 'credit'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {tx.type === 'credit' ? '+' : '-'} ₦{tx.amount.toLocaleString('en-NG')}
                            </span>
                            <p className="text-xs text-gray-400 mt-1 font-mono">{tx.reference.slice(-8)}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Payment: {tx.paymentMethod}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT PANEL - Balance & Actions with independent scroll */}
              <div className="md:w-1/2 p-5 overflow-y-auto">
                {/* Wallet Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {data.wallet.formattedBalance || `₦${data.wallet.balance.toLocaleString('en-NG')}`}
                  </p>
                </div>

                {/* Credit/Debit Forms */}
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-green-700 flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Manual Credit
                    </h4>
                    <form onSubmit={handleManualFund} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
                        <input
                          type="number"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(parseFloat(e.target.value))}
                          className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
                        <input
                          type="text"
                          value={fundDescription}
                          onChange={(e) => setFundDescription(e.target.value)}
                          className="mt-1 block w-full border rounded-lg px-3 py-2"
                          placeholder="e.g., Bonus, Refund"
                        />
                      </div>
                      {fundError && <p className="text-red-500 text-sm">{fundError}</p>}
                      <button
                        type="submit"
                        disabled={isFunding}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {isFunding ? 'Processing...' : 'Credit Wallet'}
                      </button>
                    </form>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-red-700 flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                      Manual Debit
                    </h4>
                    <form onSubmit={handleManualDebit} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
                        <input
                          type="number"
                          value={debitAmount}
                          onChange={(e) => setDebitAmount(parseFloat(e.target.value))}
                          className="mt-1 block w-full border rounded-full px-3 py-2 focus:ring-red-500 focus:border-red-500"
                          required
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
                        <input
                          type="text"
                          value={debitDescription}
                          onChange={(e) => setDebitDescription(e.target.value)}
                          className="mt-1 block w-full border rounded-lg px-3 py-2"
                          placeholder="e.g., Penalty, Adjustment"
                        />
                      </div>
                      {debitError && <p className="text-red-500 text-sm">{debitError}</p>}
                      <button
                        type="submit"
                        disabled={isDebiting}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {isDebiting ? 'Processing...' : 'Debit Wallet'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-red-500">Failed to load wallet data.</div>
          )}

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;