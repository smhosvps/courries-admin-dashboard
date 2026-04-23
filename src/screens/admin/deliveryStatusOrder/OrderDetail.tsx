/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Package,
  Clock,
  Loader,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useGetDeliveryByIdQuery } from '@/redux/features/deliveryOrderStatusApi/deliveryOrderStatusApi';
import { StatusBadge } from '@/components/orderDeliverySatus/StatusBadge';
import { Button } from '@/components/ui/button';

interface Coordinates {
  lat: number;
  lng: number;
}

// Helper component for avatar – fixed to avoid DOM manipulation errors
const Avatar = ({ src, name, size = 'h-8 w-8' }: { src?: string; name: string; size?: string }) => {
  const [imageError, setImageError] = useState(false);

  // If we have a src and no error yet, show image
  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name}
        className={`${size} rounded-full object-cover`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback: initials
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <div
      className={`${size} rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm`}
    >
      {initials || '?'}
    </div>
  );
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error }: any = useGetDeliveryByIdQuery(id!, {
    skip: !id,
    pollingInterval: 30000, // 30 seconds in milliseconds
  });

  const delivery = response?.data;

  useEffect(() => {
    if (error) {
      toast.error('Failed to load delivery details');
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader className="animate-spin text-blue-600" size={64} />
        </div>
      </div>
    );
  }



  // Extract coordinates for map
  const pickupCoords: Coordinates | null = delivery.pickup?.location?.coordinates
    ? { lng: delivery.pickup.location.coordinates[0], lat: delivery.pickup.location.coordinates[1] }
    : null;
  const deliveryCoords: Coordinates | null = delivery.delivery?.location?.coordinates
    ? { lng: delivery.delivery.location.coordinates[0], lat: delivery.delivery.location.coordinates[1] }
    : null;
  const hasValidCoords = pickupCoords && deliveryCoords;

  const polylinePositions: [number, number][] = hasValidCoords
    ? [
      [pickupCoords.lat, pickupCoords.lng],
      [deliveryCoords.lat, deliveryCoords.lng],
    ]
    : [];

  const centerLat = hasValidCoords ? (pickupCoords.lat + deliveryCoords.lat) / 2 : 4.8156;
  const centerLng = hasValidCoords ? (pickupCoords.lng + deliveryCoords.lng) / 2 : 7.0498;

  // Customer avatar
  const customerAvatar = delivery.customer?.avatar?.url;
  const customerName = `${delivery.customer?.firstName || ''} ${delivery.customer?.lastName || ''}`.trim();

  // For pickup contact, we assume it's the same as customer (if names match) or use a default
  const pickupContactName = delivery.pickup.contactName;
  const isPickupSameAsCustomer = pickupContactName === customerName;
  const pickupAvatar = isPickupSameAsCustomer ? customerAvatar : undefined;

  // For delivery contact, use a generic avatar (or we could use a default icon)
  const deliveryContactName = delivery.delivery.contactName;

  return (
    <div className="py-8 px-0 lg:px-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-fit border-blue-200 text-blue-600 hover:bg-blue-50 rounded-[6px] text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Section */}
          {hasValidCoords && (
            <div className="bg-white rounded-[12px] p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                Route Map - Distance: {delivery.distance} km
              </h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[centerLat, centerLng]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[pickupCoords.lat, pickupCoords.lng]}>
                    <Popup>
                      <strong>Pickup Location</strong>
                      <br />
                      {delivery.pickup.address}
                    </Popup>
                  </Marker>
                  <Marker position={[deliveryCoords.lat, deliveryCoords.lng]}>
                    <Popup>
                      <strong>Delivery Location</strong>
                      <br />
                      {delivery.delivery.address}
                    </Popup>
                  </Marker>
                  <Polyline positions={polylinePositions} color="blue" weight={3} opacity={0.7} />
                </MapContainer>
              </div>
            </div>
          )}

          {/* Pickup & Delivery Info with Avatars */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              Locations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar src={pickupAvatar} name={pickupContactName} size="h-10 w-10" />
                  <div>
                    <h3 className="font-medium text-gray-900">Pickup Contact</h3>
                    <p className="text-sm text-gray-600">{pickupContactName}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{delivery.pickup.address}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-1" />
                  {delivery.pickup.contactPhone}
                </div>
                {delivery.pickup.instructions && (
                  <p className="mt-2 text-sm text-gray-500 italic">
                    Note: {delivery.pickup.instructions}
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar src={undefined} name={deliveryContactName} size="h-10 w-10" />
                  <div>
                    <h3 className="font-medium text-gray-900">Delivery Contact</h3>
                    <p className="text-sm text-gray-600">{deliveryContactName}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{delivery.delivery.address}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-1" />
                  {delivery.delivery.contactPhone}
                </div>
                {delivery.delivery.instructions && (
                  <p className="mt-2 text-sm text-gray-500 italic">
                    Note: {delivery.delivery.instructions}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Package Info */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-gray-500" />
              Package Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{delivery.package.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Type</p>
                <p className="font-medium capitalize">{delivery.deliveryType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Option</p>
                <p className="font-medium capitalize">{delivery.deliveryOption}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              Timeline
            </h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {delivery.timeline?.map((event: any, idx: number) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx !== delivery.timeline.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                            <div className="h-2 w-2 rounded-full bg-blue-400" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <p className="text-sm font-medium text-gray-900">
                            {event.status.replace(/_/g, ' ').toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(event.timestamp), 'dd MMM yyyy, hh:mm a')}
                          </p>
                          {event.note && <p className="mt-1 text-sm text-gray-600">{event.note}</p>}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-6">
          {/* Order Summary with Customer Avatar */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Customer</span>
                <div className="flex items-center space-x-2">
                  <Avatar src={customerAvatar} name={customerName} size="h-6 w-6" />
                  <span>{customerName}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tracking ID</span>
                <span className="font-mono font-medium">{delivery.trackingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Code</span>
                <span className="font-mono font-medium">{delivery.deliveryCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span>{format(new Date(delivery.createdAt), 'dd MMM yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Partner</span>
                <span>{delivery.deliveryPartner?.name || 'Not assigned'}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between">
                <span>Distance</span>
                <span>{delivery.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Duration</span>
                <span>{delivery.estimatedDuration} mins</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total + tax</span>
                <span>₦{delivery.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className="capitalize">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${delivery.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : delivery.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {delivery.paymentStatus}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="capitalize">{delivery.paymentMethod}</span>
              </div>
              {delivery.paidAt && (
                <div className="flex justify-between">
                  <span>Paid At</span>
                  <span>{format(new Date(delivery.paidAt), 'dd MMM yyyy, hh:mm a')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cancellation Info (if cancelled) */}
          {delivery.status === 'cancelled' && (
            <div className="bg-red-50 rounded-lg shadow p-6 border border-red-200">
              <h2 className="text-lg font-medium text-red-800 mb-2">Cancellation Details</h2>
              <p className="text-sm text-red-700">
                <strong>Reason:</strong> {delivery.cancellationReason || 'Not specified'}
              </p>
              {delivery.cancelledBy && (
                <p className="text-sm text-red-700 mt-1">
                  <strong>Cancelled by:</strong> {delivery.cancelledBy.name}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}