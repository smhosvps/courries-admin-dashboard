import React, { useState, useEffect } from 'react';
import {
  useGetEarningSettingsQuery,
  useUpdateEarningSettingsMutation,
} from '@/redux/features/earningSettingApi/earningSettingApi';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'react-toastify';

export default function EarningFormulaSettings() {
  const { data, isLoading, refetch } = useGetEarningSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateEarningSettingsMutation();
  const [adminPercent, setAdminPercent] = useState<number>(22.5);
  const [riderPercent, setRiderPercent] = useState<number>(77.5);

  useEffect(() => {
    if (data?.data) {
      setAdminPercent(data.data.adminPercentage);
      setRiderPercent(data.data.riderPercentage);
    }
  }, [data]);

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setAdminPercent(val);
      setRiderPercent(100 - val);
    }
  };

  const handleRiderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setRiderPercent(val);
      setAdminPercent(100 - val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPercent + riderPercent !== 100) {
      toast.error('Percentages must add up to 100%');
      return;
    }
    try {
      await updateSettings({
        adminPercentage: adminPercent,
        riderPercentage: riderPercent,
      }).unwrap();
      toast.success('Earning formula updated successfully');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6">Earning Formula Settings</h1>
        <p className="text-gray-500 mb-6">
          Set the percentage split between Admin Commission and Delivery Rider for every completed delivery.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Admin Commission (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={adminPercent}
              onChange={handleAdminChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">Admin gets this percentage of each delivery price</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rider Earnings (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={riderPercent}
              onChange={handleRiderChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">Rider receives this percentage</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Sum of percentages must equal 100%. Current total: <strong>{adminPercent + riderPercent}%</strong>
            </p>
          </div>

          <button
            type="submit"
            disabled={isUpdating || adminPercent + riderPercent !== 100}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-full px-4 py-2 md:py-4 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-400 border-t pt-4">
          Last updated: {data?.data?.updatedAt ? new Date(data.data.updatedAt).toLocaleString() : 'never'}
        </div>
      </div>
    </div>
  );
}