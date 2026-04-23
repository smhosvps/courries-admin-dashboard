// components/earnings/EarningsFilters.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface EarningsFiltersProps {
  onApply: (filters: { startDate?: Date; endDate?: Date; recipientId?: string }) => void;
  showRecipientFilter?: boolean;
}

export const EarningsFilters: React.FC<EarningsFiltersProps> = ({
  onApply,
  showRecipientFilter = false,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [recipientId, setRecipientId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      startDate,
      endDate,
      recipientId: recipientId.trim() || undefined,
    });
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setRecipientId('');
    onApply({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-[12px] mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">From Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date || undefined)}
            className="mt-1 block w-full rounded-[10px] border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholderText="Start date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date || undefined)}
            className="mt-1 block w-full rounded-[10px] border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholderText="End date"
          />
        </div>
        {showRecipientFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Partner ID / Name
            </label>
            <input
              type="text"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="mt-1 block w-full rounded-[10px] border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="Enter partner ID or name"
            />
          </div>
        )}
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </form>
  );
};