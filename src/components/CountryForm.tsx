/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';

const CountryForm = ({ isOpen, onClose, onSubmit, initialData, isEditing }:any) => {
  const [formData, setFormData] = useState({
    name: '',
    distanceType: 'km',
    weightType: 'kg',
    status: 'enable',
  });

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        name: initialData.name || '',
        distanceType: initialData.distanceType || 'km',
        weightType: initialData.weightType || 'kg',
        status: initialData.status || 'enable',
      });
    } else {
      setFormData({
        name: '',
        distanceType: 'km',
        weightType: 'kg',
        status: 'enable',
      });
    }
  }, [initialData, isEditing, isOpen]);

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[12px] p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Country' : 'Add New Country'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Country Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 "
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Distance Type
            </label>
            <select
              name="distanceType"
              value={formData.distanceType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="km">Kilometers (km)</option>
              <option value="m">Meters (m)</option>
              <option value="cm">Centimeters (cm)</option>
              <option value="mi">Miles (mi)</option>
              <option value="nmi">Nautical Miles (nmi)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Weight Type
            </label>
            <select
              name="weightType"
              value={formData.weightType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="kg">Kilograms (kg)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="enable">Enable</option>
              <option value="disable">Disable</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 w-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 w-full"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CountryForm;