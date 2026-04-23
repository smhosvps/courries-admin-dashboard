/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { useGetCitiesQuery } from '@/redux/features/cityApi/cityApi';
import { X } from 'lucide-react';
import { Coupon, CouponInput } from '@/redux/features/couponApi/couponApi';

interface CouponFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CouponInput) => void;
  initialData?: Coupon | null;
  isEditing: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const { data: cities } = useGetCitiesQuery();
  const [formData, setFormData] = useState<CouponInput>({
    startDate: '',
    endDate: '',
    valueType: 'fixed',
    discountAmount: 0,
    cityType: 'all',
    city: [],
    status: 'enable',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        startDate: initialData.startDate.split('T')[0],
        endDate: initialData.endDate.split('T')[0],
        valueType: initialData.valueType,
        discountAmount: initialData.discountAmount,
        cityType: initialData.cityType,
        city: Array.isArray(initialData.city) ? initialData.city.map(c => typeof c === 'string' ? c : c._id) : [],
        status: initialData.status,
      });
    } else {
      setFormData({
        startDate: '',
        endDate: '',
        valueType: 'fixed',
        discountAmount: 0,
        cityType: 'all',
        city: [],
        status: 'enable',
      });
    }
    setErrors({});
  }, [initialData, isEditing, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    // Clear error for this field when user changes it
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCitySelection = (cityId: string) => {
    setFormData(prev => ({
      ...prev,
      city: prev.city.includes(cityId) ? prev.city.filter(id => id !== cityId) : [...prev.city, cityId],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Start & end dates
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    else {
      const endDateObj = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (endDateObj <= today) newErrors.endDate = 'End date must be in the future';
      if (formData.startDate && endDateObj <= new Date(formData.startDate))
        newErrors.endDate = 'End date must be after start date';
    }

    // Discount amount validation
    if (formData.discountAmount <= 0) {
      newErrors.discountAmount = 'Discount amount must be greater than 0';
    }
    if (formData.valueType === 'percentage' && formData.discountAmount > 100) {
      newErrors.discountAmount = 'Percentage discount cannot exceed 100';
    }

    // City validation for specific cities
    if (formData.cityType === 'specific' && formData.city.length === 0) {
      newErrors.city = 'Please select at least one city';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[12px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Coupon' : 'Add Coupon'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className={`w-full border rounded-[12px] px-3 py-2 ${errors.startDate ? 'border-red-500' : ''}`}
                placeholder="YYYY-MM-DD"
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className={`w-full border rounded-[12px] px-3 py-2 ${errors.endDate ? 'border-red-500' : ''}`}
                placeholder="YYYY-MM-DD"
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Value Type</label>
              <select
                name="valueType"
                value={formData.valueType}
                onChange={handleChange}
                className="w-full border rounded-[12px] px-3 py-2"
              >
                <option value="fixed">Fixed ($)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Amount *</label>
              <input
                type="number"
                name="discountAmount"
                value={formData.discountAmount}
                onChange={handleChange}
                step="0.01"
                required
                className={`w-full border rounded-[12px] px-3 py-2 ${errors.discountAmount ? 'border-red-500' : ''}`}
                placeholder={formData.valueType === 'fixed' ? 'e.g., 10.00' : 'e.g., 15'}
              />
              {errors.discountAmount && <p className="text-red-500 text-xs mt-1">{errors.discountAmount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City Type</label>
              <select
                name="cityType"
                value={formData.cityType}
                onChange={handleChange}
                className="w-full border rounded-[12px] px-3 py-2"
              >
                <option value="all">All Cities</option>
                <option value="specific">Specific Cities</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-[12px] px-3 py-2"
              >
                <option value="enable">Enable</option>
                <option value="disable">Disable</option>
              </select>
            </div>
          </div>

          {formData.cityType === 'specific' && (
            <div>
              <label className="block text-sm font-medium mb-1">Select Cities *</label>
              <div className={`border rounded p-3 max-h-40 overflow-y-auto ${errors.city ? 'border-red-500' : ''}`}>
                {cities?.map((city: any) => (
                  <label key={city._id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={formData.city.includes(city._id)}
                      onChange={() => handleCitySelection(city._id)}
                    />
                    <span>{city.name}</span>
                  </label>
                ))}
              </div>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-full w-full">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full w-full">{isEditing ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm;