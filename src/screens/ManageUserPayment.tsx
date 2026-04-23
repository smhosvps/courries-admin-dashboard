// src/pages/admin/ManageUserPayment.tsx

import { useParams } from "react-router-dom";
import { useState } from "react";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { useGetTransactionsQuery, useInitiateTransferMutation } from "@/redux/features/transfersApi/transfersApi";
import TransactionList from "@/components/TransactionList";

export default function ManageUserPayment() {
  const { id } = useParams<{ id: string }>();
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetUserByIdQuery(id);

  const user = userData?.user

  const {
    data: allTransactions,
    isLoading: txLoading,
    error: txError,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery({});
  const [initiateTransfer, { isLoading: transferLoading }] = useInitiateTransferMutation();

  const [amount, setAmount] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Filter transactions for this user
  const userTransactions = allTransactions?.filter(
    (tx:any) => tx.recipient?._id === id || tx.recipient === id
  ) || [];

  // Find the active bank or fallback to the first one
  const activeBank = user?.bank?.find((b: any) => b.isActive) || user?.bank?.[0];
  const hasValidBank = activeBank && activeBank.account_number && activeBank.bank_name;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    if (!amount || Number(amount) <= 0) {
      setPaymentError("Please enter a valid amount greater than 0.");
      return;
    }
    if (!id) return;
    if (!hasValidBank) {
      setPaymentError("User does not have a valid bank account.");
      return;
    }

    try {
      await initiateTransfer({ userId: id, amount: Number(amount) }).unwrap();
      alert("Transfer initiated! Status will update via webhook.");
      setAmount("");
      refetchTransactions(); // refresh transaction list
    } catch (err: any) {
      setPaymentError(err.data?.message || "Transfer failed. Please try again.");
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">Failed to load user data. Please try again.</span>
      </div>
    );
  }

  return (
    <div className=" px-0 lg:px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage User Payment</h1>
          <p className="text-gray-600 mt-2">Initiate a payout to this user and view their transaction history.</p>
        </div>
        <button
          onClick={() => refetchUser()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Refresh
        </button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900">User Information</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and bank account.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 p-4 sm:p-6">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.firstName} {user.lastName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.phone || "Not provided"}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">User Type</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{user.userType}</dd>
            </div>
            {user.address && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.address}</dd>
              </div>
            )}
            {user.dateOfBirth && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date(user.dateOfBirth).toLocaleDateString()}</dd>
              </div>
            )}
            {user.gender && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{user.gender}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Bank Details Card */}
      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Bank Account Details</h2>
        </div>
        <div className="p-4 sm:p-6">
          {hasValidBank ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Bank Name</span>
                {activeBank.isActive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>
              <p className="text-lg font-semibold text-gray-900">{activeBank.bank_name}</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{activeBank.account_number}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{activeBank.account_name}</dd>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This user has no active bank account. Please ask them to add bank details before making a payment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Initiate Payment</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Enter the amount in Nigerian Naira (NGN) to transfer to this user.</p>
          </div>
          <form onSubmit={handlePay} className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="amount" className="sr-only">
                Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₦</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-7 pr-12 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  placeholder="0.00"
                  min="1"
                  step="1"
                  required
                  disabled={!hasValidBank}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={transferLoading || !hasValidBank}
              className="mt-3 sm:mt-0 sm:ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {transferLoading ? "Processing..." : "Pay Now"}
            </button>
          </form>
          {paymentError && (
            <div className="mt-3 text-sm text-red-600">
              {paymentError}
            </div>
          )}
          {!hasValidBank && (
            <p className="mt-3 text-sm text-red-600">
              Cannot initiate payment: User has no active bank account.
            </p>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Transaction History</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            All payouts made to this user.
          </p>
        </div>
        <div className="p-4 sm:p-6">
          {txLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : txError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">Failed to load transactions.</span>
            </div>
          ) : userTransactions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
              <p className="mt-1 text-sm text-gray-500">No payouts have been made to this user yet.</p>
            </div>
          ) : (
            <TransactionList transactions={userTransactions} />
          )}
        </div>
      </div>
    </div>
  );
}