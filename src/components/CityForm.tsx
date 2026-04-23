/* eslint-disable @typescript-eslint/no-explicit-any */


import React, { useState, useEffect } from 'react';
import { useGetCountriesQuery } from '@/redux/features/countryApi/countryApi';
import { Geofence, useGetGeofencesQuery } from '@/redux/features/geofencingApi/geofencingApi';

interface CityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: any;
  initialData?: any;
  isEditing: boolean;
}



const CityForm: React.FC<CityFormProps> = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const { data: countries } = useGetCountriesQuery({});
  const { data: geofences, isLoading: geofencesLoading } = useGetGeofencesQuery();

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    geofenced: [] as string[],
    fixedCharges: '',
    cancelCharges: '',
    minimumDistance: '',
    minimumWeight: '',
    perDistanceCharge: '',
    perWeightCharge: '',
    commissionType: 'fixed' as 'fixed' | 'percentage',
    adminCommission: '',
    status: 'enable' as 'enable' | 'disable',
  });

  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData && isEditing) {
      // Handle geofenced – could be array of IDs or populated objects
      let geofencedIds: string[] = [];
      if (Array.isArray(initialData.geofenced)) {
        geofencedIds = initialData.geofenced.map((g: any) =>
          typeof g === 'string' ? g : g._id
        );
      } else if (initialData.geofenced) {
        geofencedIds = [typeof initialData.geofenced === 'string' ? initialData.geofenced : initialData.geofenced._id];
      }

      setFormData({
        name: initialData.name,
        country: typeof initialData.country === 'string' ? initialData.country : initialData.country._id,
        geofenced: geofencedIds,
        fixedCharges: initialData.fixedCharges?.toString() ?? '',
        cancelCharges: initialData.cancelCharges?.toString() ?? '',
        minimumDistance: initialData.minimumDistance?.toString() ?? '',
        minimumWeight: initialData.minimumWeight?.toString() ?? '',
        perDistanceCharge: initialData.perDistanceCharge?.toString() ?? '',
        perWeightCharge: initialData.perWeightCharge?.toString() ?? '',
        commissionType: initialData.commissionType,
        adminCommission: initialData.adminCommission?.toString() ?? '',
        status: initialData.status,
      });
    } else {
      setFormData({
        name: '',
        country: '',
        geofenced: [],
        fixedCharges: '',
        cancelCharges: '',
        minimumDistance: '',
        minimumWeight: '',
        perDistanceCharge: '',
        perWeightCharge: '',
        commissionType: 'fixed',
        adminCommission: '',
        status: 'enable',
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, isEditing, isOpen]);

  const validateField = (name: string, value: any): string | undefined => {
    if (name === 'name') {
      if (!value.trim()) return 'City name is required';
      return undefined;
    }
    if (name === 'country') {
      if (!value) return 'Please select a country';
      return undefined;
    }
    if (name === 'geofenced') {
      if (!value || value.length === 0) return 'Please select at least one geofenced region';
      return undefined;
    }
    // Number fields
    const num = parseFloat(value);
    const isRequired = ['fixedCharges', 'cancelCharges', 'minimumDistance', 'minimumWeight', 'perDistanceCharge', 'perWeightCharge', 'adminCommission'].includes(name);
    if (isRequired) {
      if (value === '') return 'This field is required';
      if (isNaN(num)) return 'Must be a valid number';
      if (num < 0) return 'Must be 0 or greater';
    }
    if (name === 'adminCommission' && formData.commissionType === 'percentage') {
      if (num > 100) return 'Commission cannot exceed 100%';
    }
    return undefined;
  };

  const validateAll = (): boolean => {
    const newErrors: any = {};
    newErrors.name = validateField('name', formData.name);
    newErrors.country = validateField('country', formData.country);
    newErrors.geofenced = validateField('geofenced', formData.geofenced);
    newErrors.fixedCharges = validateField('fixedCharges', formData.fixedCharges);
    newErrors.cancelCharges = validateField('cancelCharges', formData.cancelCharges);
    newErrors.minimumDistance = validateField('minimumDistance', formData.minimumDistance);
    newErrors.minimumWeight = validateField('minimumWeight', formData.minimumWeight);
    newErrors.perDistanceCharge = validateField('perDistanceCharge', formData.perDistanceCharge);
    newErrors.perWeightCharge = validateField('perWeightCharge', formData.perWeightCharge);
    newErrors.adminCommission = validateField('adminCommission', formData.adminCommission);
    setErrors(newErrors);
    return !Object.values(newErrors).some(err => err !== undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev: any) => ({ ...prev, [name]: error }));
  };

  // Handle checkbox toggle for geofenced regions
  const handleGeofenceCheckbox = (geofenceId: string, checked: boolean) => {
    setFormData(prev => {
      let newGeofenced = [...prev.geofenced];
      if (checked) {
        if (!newGeofenced.includes(geofenceId)) {
          newGeofenced.push(geofenceId);
        }
      } else {
        newGeofenced = newGeofenced.filter(id => id !== geofenceId);
      }
      const error = validateField('geofenced', newGeofenced);
      setErrors((prevErrors: any) => ({ ...prevErrors, geofenced: error }));
      return { ...prev, geofenced: newGeofenced };
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData] as string);
    setErrors((prev: any) => ({ ...prev, [name]: error }));
  };

  const handleGeofenceBlur = () => {
    setTouched(prev => ({ ...prev, geofenced: true }));
    const error = validateField('geofenced', formData.geofenced);
    setErrors((prev: any) => ({ ...prev, geofenced: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    if (!validateAll()) return;

    const payload: any = {
      name: formData.name,
      country: formData.country,
      geofenced: formData.geofenced,
      fixedCharges: parseFloat(formData.fixedCharges) || 0,
      cancelCharges: parseFloat(formData.cancelCharges) || 0,
      minimumDistance: parseFloat(formData.minimumDistance) || 0,
      minimumWeight: parseFloat(formData.minimumWeight) || 0,
      perDistanceCharge: parseFloat(formData.perDistanceCharge) || 0,
      perWeightCharge: parseFloat(formData.perWeightCharge) || 0,
      commissionType: formData.commissionType,
      adminCommission: parseFloat(formData.adminCommission) || 0,
      status: formData.status,
    };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[12px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit City' : 'Add City'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City Name */}
            <div>
              <label className="block text-sm font-medium mb-1">City Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., New York"
                className={`w-full border rounded-[12px] px-3 py-2 ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {touched.name && errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium mb-1">Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border rounded-[12px] px-3 py-2 ${touched.country && errors.country ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Country</option>
                {countries?.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {touched.country && errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>

            {/* Geofenced Regions - Checkbox Group */}
            <div className="md:col-span-2 ">
              <label className="block text-sm font-medium mb-1">Geofenced Regions *</label>
              {geofencesLoading ? (
                <p className="text-xs text-gray-500">Loading geofences...</p>
              ) : (
                <div
                  className={`border rounded-[12px] p-3 max-h-48 overflow-y-auto ${touched.geofenced && errors.geofenced ? 'border-red-500' : 'border-gray-300'}`}
                  onBlur={handleGeofenceBlur}
                >
                  {geofences && geofences.length > 0 ? (
                    geofences.map((gf: Geofence) => (
                      <label key={gf._id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          value={gf._id}
                          checked={formData.geofenced.includes(gf._id)}
                          onChange={(e) => handleGeofenceCheckbox(gf._id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{gf.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No geofences available</p>
                  )}
                </div>
              )}
              {touched.geofenced && errors.geofenced && <p className="text-red-500 text-xs mt-1">{errors.geofenced}</p>}
            </div>

            {/* Fixed Charges */}
            <div>
              <label className="block text-sm font-medium mb-1">Fixed Charges *</label>
              <input
                type="number"
                name="fixedCharges"
                value={formData.fixedCharges}
                onChange={handleChange}
                onBlur={handleBlur}
                step="0.01"
                placeholder="e.g., 10.00"
                className={`w-full border rounded-[12px] px-3 py-2 ${touched.fixedCharges && errors.fixedCharges ? 'border-red-500' : 'border-gray-300'}`}
              />
              {touched.fixedCharges && errors.fixedCharges && <p className="text-red-500 text-xs mt-1">{errors.fixedCharges}</p>}
            </div>

            {/* Cancel Charges */}
            <div>
              <label className="block text-sm font-medium mb-1">Cancel Charges *</label>
              <input
                type="number"
                name="cancelCharges"
                value={formData.cancelCharges}
                onChange={handleChange}
                onBlur={handleBlur}
                step="0.01"
                placeholder="e.g., 5.00"
                className={`w-full border rounded-[12px] px-3 py-2 ${touched.cancelCharges && errors.cancelCharges ? 'border-red-500' : 'border-gray-300'}`}
              />
              {touched.cancelCharges && errors.cancelCharges && <p className="text-red-500 text-xs mt-1">{errors.cancelCharges}</p>}
            </div>

            {/* Minimum Distance */}
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Distance (km) *</label>
              <input
                type="number"
                name="minimumDistance"
                value={formData.minimumDistance}
                onChange={handleChange}
                onBlur={handleBlur}
                step="0.1"
                placeholder="e.g., 1.5"
                className={`w-full border rounded-[12px] px-3 py-2 ${touched.minimumDistance && errors.minimumDistance ? 'border-red-500' : 'border-gray-300'}`}
              />
              {touched.minimumDistance && errors.minimumDistance && <p className="text-red-500 text-xs mt-1">{errors.minimumDistance}</p>}
            </div>

            {/* Minimum Weight */}
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Weight (kg) *</label>
              <input
                type="number"
                name="minimumWeight"
                value={formData.minimumWeight}
                onChange={handleChange}
                onBlur={handleBlur}
                step="0.1"
                placeholder="e.g., 0.5"
                className={`w-full border rounded-[12px] px-3 py-2 ${touched.minimumWeight && errors.minimumWeight ? 'border-red-500' : 'border-gray-300'}`}
              />
              {touched.minimumWeight && errors.minimumWeight && <p className="text-red-500 text-xs mt-1">{errors.minimumWeight}</p>}
            </div>

            {/* Per Distance Charge */}
            <div>
              <label className="block text-sm font-medium mb-1">Per Distance Charge *</label>
              <input
                type="number"
                name="perDistanceCharge"
                value={formData.perDistanceCharge}
                onChange={handleChange}
                onBlur={handleBlur}
                step="0.01"
                placeholder="e.g., 2.00"
                className={`w-full border rounded-[12px] px-3 py-2 ${touched.perDistanceCharge && errors.perDistanceCharge ? 'border-red-500' : 'border-gray-300'}`}
              />
              {touched.perDistanceCharge && errors.perDistanceCharge && <p className="text-red-500 text-xs mt-1">{errors.perDistanceCharge}</p>}
            </div>

            {/* Per Weight Charge */}
            <div>
              <label className="block text-sm font-medium mb-1">Per Weight Charge *</label>
              <input
                type="number"
                name="perWeightCharge"
                value={formData.perWeightCharge}
                onChange={handleChange}
                onBlur={handleBlur}
                step="0.01"
                placeholder="e.g., 3.00"
                className={`w-full border rounded-[12px] px-3 py-2 ${touched.perWeightCharge && errors.perWeightCharge ? 'border-red-500' : 'border-gray-300'}`}
              />
              {touched.perWeightCharge && errors.perWeightCharge && <p className="text-red-500 text-xs mt-1">{errors.perWeightCharge}</p>}
            </div>

            {/* Commission Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Commission Type</label>
              <select
                name="commissionType"
                value={formData.commissionType}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-[12px]"
              >
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

            {/* Admin Commission */}
            <div>
              <label className="block text-sm font-medium mb-1">Admin Commission *</label>
              <input
                type="number"
                name="adminCommission"
                value={formData.adminCommission}
                onChange={handleChange}
                onBlur={handleBlur}
                step="0.01"
                placeholder={formData.commissionType === 'percentage' ? 'e.g., 15 (max 100)' : 'e.g., 20.00'}
                className={`w-full border rounded-[12px] px-3 py-2 ${touched.adminCommission && errors.adminCommission ? 'border-red-500' : 'border-gray-300'}`}
              />
              {touched.adminCommission && errors.adminCommission && <p className="text-red-500 text-xs mt-1">{errors.adminCommission}</p>}
            </div>

            {/* Status */}
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

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-full w-full">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full w-full">
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CityForm;