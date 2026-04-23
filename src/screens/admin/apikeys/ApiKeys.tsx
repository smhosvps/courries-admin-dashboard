/* eslint-disable @typescript-eslint/no-explicit-any */

import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/redux/features/live/liveServices';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  CreditCard, 
  Bell, 
  Key, 
  MapPin, 
  Save, 
  Loader2 
} from 'lucide-react';

// Loading skeleton component
const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
    <div className="h-10 bg-gray-200 rounded w-32"></div>
  </div>
);

export default function ApiKeys() {
  const { data: settings, isLoading, isError, error } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const [formData, setFormData] = useState({
    paystackKey: '',
    oneSignalPlayerId: '',
    webClientId: '',
    iosClientId: '',
    googleMapsApiKey: '',
    googleMapsIosApiKey: '',
    googleMapsAndroidApiKey: '',
  });

  // Populate form when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        paystackKey: settings.paystackKey || '',
        oneSignalPlayerId: settings.oneSignalPlayerId || '',
        webClientId: settings.webClientId || '',
        iosClientId: settings.iosClientId || '',
        googleMapsApiKey: settings.googleMapsApiKey || '',
        googleMapsIosApiKey: settings.googleMapsIosApiKey || '',
        googleMapsAndroidApiKey: settings.googleMapsAndroidApiKey || '',
      });
    }
  }, [settings]);

  // Handle error notification for API load failure
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load settings. Please refresh the page.');
    }
  }, [isError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData).unwrap();
      toast.success('Settings saved successfully!');
    } catch (err) {
      console.log(err)
      toast.error('Failed to save settings. Please try again.');
    }
  };

  // Show error UI if API call fails
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading settings: {(error as any)?.data?.message || 'Unknown error'}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-blue-500 underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">API Keys Configuration</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your third-party API keys and credentials for the application.
          </p>
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Paystack Section */}
            <div className="bg-white shadow rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-6">
                <CreditCard className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Gateway</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="paystackKey" className="block text-sm font-medium text-gray-700 mb-1">
                    Paystack Secret Key
                  </label>
                  <input
                    type="text"
                    id="paystackKey"
                    name="paystackKey"
                    value={formData.paystackKey}
                    onChange={handleChange}
                    placeholder="sk_live_xxxxxxxxxxxx"
                    className="block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Your Paystack secret key from the dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* OneSignal Section */}
            <div className="bg-white shadow rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-6">
                <Bell className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">Push Notifications</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="oneSignalPlayerId" className="block text-sm font-medium text-gray-700 mb-1">
                    OneSignal Player ID
                  </label>
                  <input
                    type="text"
                    id="oneSignalPlayerId"
                    name="oneSignalPlayerId"
                    value={formData.oneSignalPlayerId}
                    onChange={handleChange}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The player ID from OneSignal for push notifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Login Section */}
            <div className="bg-white shadow rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-6">
                <Key className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">Google OAuth</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="webClientId" className="block text-sm font-medium text-gray-700 mb-1">
                    Web Client ID
                  </label>
                  <input
                    type="text"
                    id="webClientId"
                    name="webClientId"
                    value={formData.webClientId}
                    onChange={handleChange}
                    placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                    className="block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="iosClientId" className="block text-sm font-medium text-gray-700 mb-1">
                    iOS Client ID
                  </label>
                  <input
                    type="text"
                    id="iosClientId"
                    name="iosClientId"
                    value={formData.iosClientId}
                    onChange={handleChange}
                    placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                    className="block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Google Maps Section */}
            <div className="bg-white shadow rounded-[12px] p-6">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-6">
                <MapPin className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">Google Maps API Keys</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="googleMapsApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                    Web API Key
                  </label>
                  <input
                    type="text"
                    id="googleMapsApiKey"
                    name="googleMapsApiKey"
                    value={formData.googleMapsApiKey}
                    onChange={handleChange}
                    placeholder="AIzaSy..."
                    className="block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">For web applications.</p>
                </div>
                <div>
                  <label htmlFor="googleMapsIosApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                    iOS API Key
                  </label>
                  <input
                    type="text"
                    id="googleMapsIosApiKey"
                    name="googleMapsIosApiKey"
                    value={formData.googleMapsIosApiKey}
                    onChange={handleChange}
                    placeholder="AIzaSy..."
                    className="block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="googleMapsAndroidApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                    Android API Key
                  </label>
                  <input
                    type="text"
                    id="googleMapsAndroidApiKey"
                    name="googleMapsAndroidApiKey"
                    value={formData.googleMapsAndroidApiKey}
                    onChange={handleChange}
                    placeholder="AIzaSy..."
                    className="block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#1969fe] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}