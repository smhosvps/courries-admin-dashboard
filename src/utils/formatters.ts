// frontend/src/utils/formatters.ts

/**
 * Format distance in kilometers to a readable string
 * @param distance - Distance in kilometers
 * @returns Formatted distance string (e.g., "2.5 km" or "850 m")
 */
export const formatDistance = (distance: number): string => {
  if (!distance && distance !== 0) return '0 km';
  
  // If distance is less than 1 km, show in meters
  if (distance < 1) {
    const meters = Math.round(distance * 1000);
    return `${meters} m`;
  }
  
  // Show with 1 decimal place for km
  return `${distance.toFixed(1)} km`;
};

/**
 * Format date to a readable string
 * @param date - Date string, timestamp, or Date object
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | number | Date,
  options?: {
    format?: 'full' | 'long' | 'medium' | 'short' | 'time' | 'datetime';
    includeTime?: boolean;
  }
): string => {
  if (!date) return 'N/A';

  try {
    const dateObj = new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const { format = 'medium', includeTime = false } = options || {};

    // Predefined format styles
    const formatStyles: Record<string, Intl.DateTimeFormatOptions> = {
      full: {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
      medium: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      short: {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      },
      time: {
        hour: '2-digit',
        minute: '2-digit',
      },
      datetime: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    };

    // Get base options
    let dateTimeOptions: Intl.DateTimeFormatOptions = formatStyles[format] || formatStyles.medium;

    // If includeTime is true but format isn't datetime or time, add time
    if (includeTime && format !== 'datetime' && format !== 'time') {
      dateTimeOptions = {
        ...dateTimeOptions,
        hour: '2-digit',
        minute: '2-digit',
      };
    }

    return new Intl.DateTimeFormat('en-US', dateTimeOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format currency (Nigerian Naira)
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  if (!amount && amount !== 0) return '₦0';
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format phone number to Nigerian format
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a Nigerian number (11 digits starting with 0)
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `0${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  // Check if it's a Nigerian number with country code
  if (cleaned.length === 13 && cleaned.startsWith('234')) {
    const local = '0' + cleaned.slice(3);
    return `0${local.slice(1, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
  }
  
  return phone;
};

/**
 * Format duration in minutes to readable format
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (minutes: number): string => {
  if (!minutes && minutes !== 0) return '0 min';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Format weight to readable format
 * @param weight - Weight in kg
 * @returns Formatted weight string
 */
export const formatWeight = (weight: number): string => {
  if (!weight && weight !== 0) return '0 kg';
  
  if (weight < 1) {
    const grams = Math.round(weight * 1000);
    return `${grams} g`;
  }
  
  return `${weight.toFixed(1)} kg`;
};

/**
 * Format address to shortened version
 * @param address - Full address string
 * @param maxLength - Maximum length
 * @returns Shortened address
 */
export const formatAddress = (address: string, maxLength: number = 50): string => {
  if (!address) return '';
  
  if (address.length <= maxLength) {
    return address;
  }
  
  return `${address.substring(0, maxLength)}...`;
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to compare
 * @returns Relative time string
 */
export const getRelativeTime = (date: string | number | Date): string => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(-diffInSeconds, 'second');
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
      return rtf.format(-diffInMinutes, 'minute');
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      return rtf.format(-diffInHours, 'hour');
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
      return rtf.format(-diffInDays, 'day');
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
      return rtf.format(-diffInMonths, 'month');
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(-diffInYears, 'year');
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};

/**
 * Format tracking ID
 * @param trackingId - Raw tracking ID
 * @returns Formatted tracking ID
 */
export const formatTrackingId = (trackingId: string): string => {
  if (!trackingId) return '';
  
  // If it already has TRK- prefix, return as is
  if (trackingId.startsWith('TRK-')) {
    return trackingId;
  }
  
  // Otherwise add TRK- prefix
  return `TRK-${trackingId}`;
};